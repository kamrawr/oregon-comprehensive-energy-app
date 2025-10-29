/**
 * Incentive Rules Engine
 * 
 * Copyright © 2025 Isaiah Kamrar / Community Consulting Partners LLC
 * All Rights Reserved. Proprietary Software.
 * See LICENSE.md for terms and conditions.
 * 
 * Maps customer eligibility to correct incentive amounts
 * Based on residential-incentive-insights project data
 * 
 * FUNDING PRIORITY STRATEGY:
 * 1. HEAR/HOMES federal funding applied FIRST (primary funding source)
 *    - HEAR: $14,000 household cap, measure-specific limits apply
 *    - HOMES: Two pathways:
 *      a) Modeled savings: $2,000-$8,000 based on whole-home energy savings (≥20%)
 *      b) Flex funding: Up to $10,000 can flex across non-HEAR funded measures per site
 *      HOMES Coverage by Income:
 *        • ≤80% AMI: 100% of costs (up to limits)
 *        • 81-150% AMI: 50% of costs (up to limits)
 *        • >150% AMI: NOT ELIGIBLE
 * 2. CERTA: Capped at $2,000 for enabling repairs
 *    - If enabling costs exceed $2K, HOMES can cover the gap
 * 3. CPF fills remaining gaps to achieve no-cost measures for eligible households
 * 
 * Goal: Maximize use of federal dollars, then state/utility programs to achieve
 * no-cost or near-no-cost upgrades for income-qualified households.
 * CPF amounts may exceed remaining costs to provide customer assurance.
 */

// Load ConfigLoader (works in both Node.js and browser)
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    var ConfigLoader = require('./config_loader');
}

class IncentiveRules {
    constructor() {
        // Load configuration synchronously (for Node.js environment and tests)
        // In browser, ConfigLoader is loaded via script tag
        if (typeof ConfigLoader === 'undefined') {
            console.warn('⚠️  ConfigLoader not available, using fallback defaults');
            this.initializeFallbacks();
            this.tiers = {
                WEATHERIZATION: 'weatherization',
                CPF_LOW_INCOME: 'cpf_low',
                HEAR_MODERATE: 'hear_moderate',
                STANDARD: 'standard'
            };
            return;
        }
        
        const configLoader = new ConfigLoader();
        try {
            // Try sync load for Node.js
            const config = typeof require !== 'undefined' ? 
                configLoader.loadConfigSync() : 
                null; // Browser will load async later
            
            if (config) {
                // Successfully loaded config (Node.js)
                this.config = config;
                this.incomeThresholds = config.income_thresholds;
                this.programCaps = {
                    HEAR_LOW_INCOME: config.program_caps.hear_household_cap,
                    HEAR_MODERATE: config.program_caps.hear_household_cap,
                    HOMES_MIN: config.program_caps.homes_modeled_min,
                    HOMES_MAX: config.program_caps.homes_modeled_max,
                    HOMES_FLEX_MAX: config.program_caps.homes_flex_site_cap,
                    CERTA_MAX: config.program_caps.certa_household_cap
                };
                this.homesCoverageRules = config.homes_coverage_rules;
                this.measureIncentives = config.measure_incentives;
                this.certaEligibleMeasures = config.certa_eligible_measures || [];
                this.homesAllocationPriority = config.homes_allocation_priority || [];
            } else {
                // Browser environment - will load async
                this.configLoader = configLoader;
                this.initializeFallbacks();
            }
        } catch (error) {
            console.warn('⚠️  Config load failed, using fallback defaults:', error.message);
            this.initializeFallbacks();
        }
        
        // Income tier thresholds (these remain constant)
        this.tiers = {
            WEATHERIZATION: 'weatherization',      // ≤60% SMI or ≤200% FPL - NO COST
            CPF_LOW_INCOME: 'cpf_low',            // 60-80% AMI - Enhanced + HEAR 100%
            HEAR_MODERATE: 'hear_moderate',        // 81-150% AMI - Standard + HEAR 50%
            STANDARD: 'standard'                   // >150% AMI - Standard only
        };
    }

    /**
     * Initialize fallback values when config loading fails or browser async
     */
    initializeFallbacks() {
        this.incomeThresholds = {
            weatherization_smi_max: 60,
            weatherization_fpl_max: 200,
            cpf_tier1_ami_max: 80,
            hear_moderate_ami_min: 81,
            hear_moderate_ami_max: 150,
            homes_ami_max: 150
        };
        this.programCaps = {
            HEAR_LOW_INCOME: 14000,
            HEAR_MODERATE: 14000,
            HOMES_MIN: 2000,
            HOMES_MAX: 8000,
            HOMES_FLEX_MAX: 10000,
            CERTA_MAX: 2000
        };
        this.homesCoverageRules = {
            low_income: { ami_max: 80, coverage_percent: 100 },
            moderate_income: { ami_min: 81, ami_max: 150, coverage_percent: 50 },
            not_eligible: { ami_min: 151, coverage_percent: 0 }
        };
        this.measureIncentives = null;
        this.certaEligibleMeasures = [
            'attic_insulation',
            'wall_insulation',
            'floor_insulation',
            'air_sealing',
            'duct_sealing'
        ];
        this.homesAllocationPriority = [
            'health_safety_repairs',
            'attic_insulation',
            'wall_insulation',
            'floor_insulation',
            'air_sealing',
            'window_replacement',
            'duct_sealing'
        ];
    }

    /**
     * Async initialization for browser (call after DOM ready)
     */
    async initializeAsync() {
        if (this.configLoader && !this.config) {
            try {
                const config = await this.configLoader.loadConfig();
                this.config = config;
                this.incomeThresholds = config.income_thresholds;
                this.programCaps = {
                    HEAR_LOW_INCOME: config.program_caps.hear_household_cap,
                    HEAR_MODERATE: config.program_caps.hear_household_cap,
                    HOMES_MIN: config.program_caps.homes_modeled_min,
                    HOMES_MAX: config.program_caps.homes_modeled_max,
                    HOMES_FLEX_MAX: config.program_caps.homes_flex_site_cap,
                    CERTA_MAX: config.program_caps.certa_household_cap
                };
                this.homesCoverageRules = config.homes_coverage_rules;
                this.measureIncentives = config.measure_incentives;
                this.certaEligibleMeasures = config.certa_eligible_measures || [];
                this.homesAllocationPriority = config.homes_allocation_priority || [];
                console.log(`✅ Async loaded config v${config.version}`);
            } catch (error) {
                console.warn('⚠️  Async config load failed, using fallbacks:', error.message);
            }
        }
    }

    /**
     * Determine customer's eligibility tier
     * @param {number} amiPercent - Percent of Area Median Income
     * @param {number} smiPercent - Percent of State Median Income  
     * @param {number} fplPercent - Percent of Federal Poverty Level
     */
    getEligibilityTier(amiPercent, smiPercent, fplPercent) {
        // Priority 1: Weatherization (no-cost comprehensive)
        // Correct rule: ≤60% SMI (not AMI) or ≤200% FPL
        if (smiPercent <= this.incomeThresholds.weatherization_smi_max || 
            fplPercent <= this.incomeThresholds.weatherization_fpl_max) {
            return this.tiers.WEATHERIZATION;
        }
        
        // Priority 2: CPF Income-Qualified (60-80% AMI)
        if (amiPercent > this.incomeThresholds.weatherization_smi_max && 
            amiPercent <= this.incomeThresholds.cpf_tier1_ami_max) {
            return this.tiers.CPF_LOW_INCOME;
        }
        
        // Priority 3: HEAR Moderate Income (81-150% AMI)
        if (amiPercent > this.incomeThresholds.hear_moderate_ami_min && 
            amiPercent <= this.incomeThresholds.hear_moderate_ami_max) {
            return this.tiers.HEAR_MODERATE;
        }
        
        // Priority 4: Standard Market Rate (>150% AMI)
        return this.tiers.STANDARD;
    }

    /**
     * Get incentive for a specific measure based on eligibility tier
     * Returns stacking packages with proper limits
     */
    getIncentiveForMeasure(measureId, tier, measureDetails = {}) {
        const rules = this.getMeasureRules();
        const measureRule = rules[measureId];
        
        if (!measureRule) {
            return null;
        }

        // === WEATHERIZATION TIER ===
        if (tier === this.tiers.WEATHERIZATION) {
            const packages = [
                {
                    name: 'OHCS Weatherization (Primary)',
                    incentives: [{
                        program: 'Oregon Weatherization (OHCS)',
                        amount: 'Full Coverage',
                        coverage: '100%',
                        priority: 1,
                        contact: '1-800-766-6861',
                        description: 'No-cost comprehensive weatherization',
                        requirements: ['Income verification', 'Application approval'],
                        note: 'May have waitlist - check agency capacity'
                    }],
                    note: 'Full no-cost coverage (waitlist may apply)'
                }
            ];
            
            // Package 2: HEAR alternative (all income tiers can access)
            const hearAmount = this.getHEARAmount(measureId, 100);
            if (hearAmount) {
                const incentives = [{
                    program: 'HEAR 100% (IRA Federal)',
                    amount: hearAmount,
                    priority: 1,
                    contact: 'Oregon DOE: 1-800-221-8035',
                    note: 'Available even with OHCS eligibility - no waitlist'
                }];
                
                // Add CERTA if applicable AND envelope/sealing work
                if (this.isCERTAEligible(measureId)) {
                    incentives.push({
                        program: 'CERTA (Enabling Repairs)',
                        amount: 2000,
                        priority: 2,
                        contact: 'Oregon DOE',
                        note: 'For electrical/structural prep work'
                    });
                }
                
                packages.push({
                    name: 'HEAR 100% Package (Faster Alternative)',
                    incentives: incentives,
                    note: 'Faster timeline than weatherization waitlist'
                });
            }
            
            // Package 3: HOMES alternative (for envelope measures)
            // Amount is placeholder - will be dynamically allocated in applyHOMESAllocation()
            if (measureRule.homes_eligible) {
                packages.push({
                    name: 'HOMES Package (Comprehensive Alternative)',
                    incentives: [{
                        program: 'HOMES (IRA Federal)',
                        amount: 0, // Placeholder - dynamically allocated up to $10K site cap
                        priority: 2,
                        contact: 'Oregon DOE',
                        note: 'Allocated dynamically up to $10K site cap (fills gaps after other incentives)'
                    }],
                    note: 'Good for comprehensive projects - no waitlist, flexible funding'
                });
            }
            
            // Package 4: CPF alternative if priority community/CBO
            if (measureDetails.cpfEligible) {
                const cpfAmount = this.getCPFAmount(measureId, measureDetails);
                if (cpfAmount && cpfAmount !== 'Full Coverage') {
                    packages.push({
                        name: 'CPF Alternative',
                        incentives: [{
                            program: 'CPF - Energy Trust',
                            amount: cpfAmount,
                            priority: 2,
                            contact: 'Community Partner',
                            requirements: measureRule.cpf_requirements || ['Income verification', 'Trade Ally']
                        }],
                        note: 'Enhanced CPF rebates via CBO partner'
                    });
                }
            }
            
            return packages;
        }

        // === CPF LOW INCOME TIER (60-80% AMI) ===
        if (tier === this.tiers.CPF_LOW_INCOME) {
            return this.buildCPFPackages(measureId, measureRule, measureDetails, 100);
        }

        // === HEAR MODERATE TIER (81-150% AMI) ===
        if (tier === this.tiers.HEAR_MODERATE) {
            return this.buildStandardPlusHEARPackages(measureId, measureRule, measureDetails);
        }

        // === STANDARD TIER (>150% AMI) ===
        if (tier === this.tiers.STANDARD) {
            return this.buildStandardPackages(measureId, measureRule, measureDetails);
        }

        return null;
    }
    
    /**
     * Check if measure is eligible for CERTA (loaded from config)
     */
    isCERTAEligible(measureId) {
        return this.certaEligibleMeasures.includes(measureId);
    }
    
    /**
     * Build CPF incentive packages with proper stacking
     * Priority: HEAR/HOMES first (federal $), then CPF gap-fill for no-cost coverage
     */
    buildCPFPackages(measureId, measureRule, measureDetails, hearPercentage) {
        const packages = [];
        const cpfAmount = this.getCPFAmount(measureId, measureDetails);
        const hearAmount = this.getHEARAmount(measureId, hearPercentage);
        
        // Package 1: HEAR + CPF + CERTA (for electrification measures)
        // Prioritize HEAR federal funding, then CPF to fill gaps
        if (hearAmount && cpfAmount) {
            const incentives = [
                {
                    program: 'HEAR (IRA Federal)',
                    amount: hearAmount,
                    coverage: `${hearPercentage}%`,
                    priority: 1,
                    contact: 'Oregon DOE: 1-800-221-8035',
                    note: `Primary federal funding - $${this.programCaps.HEAR_LOW_INCOME.toLocaleString()} household cap applies`
                },
                {
                    program: 'CPF - Energy Trust',
                    amount: cpfAmount,
                    priority: 2,
                    contact: 'Community Partner',
                    note: 'Gap funding to achieve no-cost (may exceed remaining cost)'
                }
            ];
            
            // Add CERTA for insulation/sealing/duct projects (capped at $2K)
            if (this.isCERTAEligible(measureId)) {
                incentives.push({
                    program: 'CERTA (Enabling Repairs)',
                    amount: this.programCaps.CERTA_MAX,
                    priority: 3,
                    contact: 'Oregon DOE',
                    note: `Capped at $${this.programCaps.CERTA_MAX.toLocaleString()} for enabling work`
                });
            }
            
            packages.push({
                name: 'HEAR + CPF Stack (No-Cost Path)',
                incentives: incentives,
                note: 'Federal $ first, CPF fills gaps - typically achieves $0 cost'
            });
        }
        
        // Package 2: HOMES + CPF + CERTA (for envelope measures)
        // HOMES covers comprehensive work including enabling repairs above CERTA cap
        // HOMES can flex up to $10K across non-HEAR funded measures per site
        // Amount is placeholder - will be dynamically allocated in applyHOMESAllocation()
        if (measureRule.homes_eligible && cpfAmount) {
            const incentives = [
                {
                    program: 'HOMES (IRA Federal)',
                    amount: 0, // Placeholder - dynamically allocated up to $10K site cap
                    priority: 1,
                    contact: 'Oregon DOE',
                    note: 'Allocated dynamically up to $10K site cap (fills gaps after other incentives)'
                },
                {
                    program: 'CPF - Energy Trust',
                    amount: cpfAmount,
                    priority: 2,
                    contact: 'Community Partner',
                    note: 'Gap funding for remaining costs (may exceed balance)'
                }
            ];
            
            // Add CERTA for insulation/sealing/duct projects (capped at $2K)
            // Note: If enabling costs exceed $2K, HOMES covers the gap
            if (this.isCERTAEligible(measureId)) {
                incentives.push({
                    program: 'CERTA (Enabling Repairs)',
                    amount: this.programCaps.CERTA_MAX,
                    priority: 3,
                    contact: 'Oregon DOE',
                    note: `Up to $${this.programCaps.CERTA_MAX.toLocaleString()}; HOMES covers gaps above this`
                });
            }
            
            packages.push({
                name: 'HOMES + CPF Stack (No-Cost Path)',
                incentives: incentives,
                note: 'Federal whole-home rebate + CPF gap funding - typically achieves $0 cost'
            });
        }
        
        // Package 3: CPF only (if neither HEAR nor HOMES apply)
        if (cpfAmount && !hearAmount && !measureRule.homes_eligible) {
            const incentives = [{
                program: 'CPF - Energy Trust',
                amount: cpfAmount,
                priority: 1,
                contact: 'Community Partner'
            }];
            
            if (measureRule.certa_eligible) {
                incentives.push({
                    program: 'CERTA (Enabling Repairs)',
                    amount: this.programCaps.CERTA_MAX,
                    priority: 2,
                    contact: 'Oregon DOE',
                    note: `Capped at $${this.programCaps.CERTA_MAX.toLocaleString()}`
                });
            }
            
            packages.push({
                name: 'CPF Package',
                incentives: incentives,
                note: 'Enhanced CPF rebates'
            });
        }
        
        return packages;
    }
    
    /**
     * Build Standard + HEAR packages for moderate income
     * Priority: HEAR federal funding first, then standard programs
     */
    buildStandardPlusHEARPackages(measureId, measureRule, measureDetails) {
        const packages = [];
        const standardAmount = this.getStandardAmount(measureId, measureDetails);
        const hearAmount = this.getHEARAmount(measureId, 50);
        
        // Package 1: HEAR + Standard
        if (hearAmount && standardAmount) {
            packages.push({
                name: 'HEAR 50% + Standard',
                incentives: [
                    {
                        program: 'HEAR 50% (IRA Federal)',
                        amount: hearAmount,
                        priority: 1,
                        contact: 'Oregon DOE: 1-800-221-8035',
                        note: `Federal funding applied first - $${this.programCaps.HEAR_MODERATE.toLocaleString()} household cap applies`
                    },
                    {
                        program: 'Energy Trust Standard',
                        amount: standardAmount,
                        priority: 2,
                        contact: 'Energy Trust: 1-866-368-7878',
                        note: 'Gap funding for remaining costs'
                    }
                ],
                note: 'Federal $ first, standard programs fill gaps'
            });
        }
        
        // Package 2: HOMES + Standard
        // Amount is placeholder - will be dynamically allocated in applyHOMESAllocation()
        if (measureRule.homes_eligible && standardAmount) {
            packages.push({
                name: 'HOMES + Standard',
                incentives: [
                    {
                        program: 'HOMES (IRA Federal)',
                        amount: 0, // Placeholder - dynamically allocated up to $10K site cap
                        priority: 1,
                        contact: 'Oregon DOE',
                        note: 'Allocated dynamically up to $10K site cap (fills gaps after other incentives)'
                    },
                    {
                        program: 'Energy Trust Standard',
                        amount: standardAmount,
                        priority: 2,
                        contact: 'Energy Trust: 1-866-368-7878',
                        note: 'Gap funding for remaining costs'
                    }
                ],
                note: 'Federal $ first for comprehensive envelope work'
            });
        }
        
        // Package 3: Standard only
        if (standardAmount && !hearAmount && !measureRule.homes_eligible) {
            packages.push({
                name: 'Standard Programs',
                incentives: [{
                    program: 'Energy Trust Standard',
                    amount: standardAmount,
                    priority: 1,
                    contact: 'Energy Trust: 1-866-368-7878'
                }],
                note: 'Standard rebate available'
            });
        }
        
        return packages;
    }
    
    /**
     * Build standard packages (>150% AMI)
     * HOMES NOT AVAILABLE above 150% AMI per IRA rules
     */
    buildStandardPackages(measureId, measureRule, measureDetails) {
        const packages = [];
        const standardAmount = this.getStandardAmount(measureId, measureDetails);
        
        if (standardAmount) {
            packages.push({
                name: 'Standard Programs',
                incentives: [{
                    program: 'Energy Trust Standard',
                    amount: standardAmount,
                    priority: 1,
                    contact: 'Energy Trust: 1-866-368-7878'
                }],
                note: 'Market-rate incentives (HOMES not available >150% AMI)'
            });
        }
        
        return packages;
    }

    /**
     * Get measure-specific incentive rules (loaded from config)
     */
    getMeasureRules() {
        // If config was loaded successfully, use it
        if (this.measureIncentives) {
            return this.measureIncentives;
        }
        
        // Fallback to hardcoded rules if config loading failed
        return {
            'heat_pump_ductless': {
                cpf: { single_family: 1800, manufactured: 3500, multifamily: 2000 },
                hear: 8000,
                standard: 800,
                homes_eligible: true,
                certa_eligible: false,
                cpf_requirements: ['HSPF2 ≥ 8.1', 'Replaces electric resistance']
            },
            'heat_pump_ducted': {
                cpf: { single_family: 4000, extended_capacity: 6000, no_cost: 'full' },
                hear: 8000,
                standard: 1500,
                homes_eligible: true,
                certa_eligible: false,
                cpf_requirements: ['HSPF2 ≥ 7.5', 'Replaces electric furnace']
            },
            'attic_insulation': {
                cpf_per_sqft: 1.5,
                hear: 1600,
                standard_per_sqft: 0.10,
                homes_eligible: true,
                certa_eligible: true,
                cpf_requirements: ['R-value improvement to R-38+']
            },
            'wall_insulation': {
                cpf_per_sqft: 1.0,
                hear: 1600,
                standard_per_sqft: 0.08,
                homes_eligible: true,
                certa_eligible: true
            },
            'floor_insulation': {
                cpf_per_sqft: 1.2,
                hear: 1600,
                standard_per_sqft: 0.10,
                homes_eligible: true,
                certa_eligible: true
            },
            'air_sealing': {
                cpf: 800,
                hear: 'included_in_insulation',
                standard: 400,
                homes_eligible: true,
                certa_eligible: false
            },
            'heat_pump_water_heater': {
                cpf: 240,
                hear: 1750,
                standard: 240,
                homes_eligible: false,
                certa_eligible: false,
                cpf_requirements: ['UEF ≥ 3.0', '30A circuit']
            },
            'duct_sealing': {
                cpf: 600,
                hear: null,
                standard: 400,
                homes_eligible: true,
                certa_eligible: false
            },
            'smart_thermostat': {
                cpf: 250,
                hear: null,
                standard: 250,
                homes_eligible: false,
                certa_eligible: false
            },
            'window_replacement': {
                cpf_per_sqft: 1.5,
                hear: null,
                standard_per_window: 50,
                standard_max: 500,
                homes_eligible: true,
                certa_eligible: false
            },
            'electric_panel_upgrade': {
                cpf: 'full',
                hear: 4000,
                standard: 0,
                homes_eligible: false,
                certa_eligible: true
            },
            'health_safety_repairs': {
                cpf: 'full',
                hear: null,
                standard: 0,
                homes_eligible: true,
                certa_eligible: true
            }
        };
    }

    /**
     * Get CPF incentive amount
     */
    getCPFAmount(measureId, details) {
        const rules = this.getMeasureRules()[measureId];
        if (!rules || (!rules.cpf && !rules.cpf_per_sqft)) return null;

        if (rules.cpf === 'full') return 'Full Coverage';

        // Handle per-sqft measures
        if (rules.cpf_per_sqft) {
            const sqft = details.sqft || 1000;
            return Math.floor(sqft * rules.cpf_per_sqft);
        }

        // Handle tiered CPF (heat pumps)
        if (typeof rules.cpf === 'object') {
            if (details.housingType === 'manufactured') {
                return rules.cpf.manufactured || rules.cpf.single_family;
            }
            return rules.cpf.single_family || rules.cpf.multifamily;
        }

        return rules.cpf;
    }

    /**
     * Get HEAR incentive amount
     */
    getHEARAmount(measureId, percentage) {
        const rules = this.getMeasureRules()[measureId];
        if (!rules || !rules.hear || rules.hear === 'included_in_insulation') return null;

        const baseAmount = rules.hear;
        return Math.floor(baseAmount * (percentage / 100));
    }

    /**
     * Get Standard Energy Trust incentive amount
     */
    getStandardAmount(measureId, details) {
        const rules = this.getMeasureRules()[measureId];
        if (!rules) return null;

        // Handle per-sqft measures
        if (rules.standard_per_sqft) {
            const sqft = details.sqft || 1000;
            return Math.floor(sqft * rules.standard_per_sqft);
        }

        // Handle per-window measures
        if (rules.standard_per_window) {
            const windows = details.windowCount || 10;
            const amount = windows * rules.standard_per_window;
            return Math.min(amount, rules.standard_max || amount);
        }

        return rules.standard || null;
    }

    /**
     * Calculate total incentives and net cost for a package
     */
    calculateNetCost(estimatedCost, packageOrIncentives) {
        // Handle legacy single incentive array
        let incentives = packageOrIncentives;
        if (packageOrIncentives && packageOrIncentives.incentives) {
            incentives = packageOrIncentives.incentives;
        }
        
        if (!incentives || incentives.length === 0) {
            return {
                totalIncentives: 0,
                netCost: estimatedCost,
                coverage: 0
            };
        }

        let totalIncentives = 0;
        for (const inc of incentives) {
            if (inc.amount === 'Full Coverage') {
                return {
                    totalIncentives: estimatedCost,
                    netCost: 0,
                    coverage: 100,
                    note: 'No-cost through weatherization'
                };
            }
            if (typeof inc.amount === 'number') {
                totalIncentives += inc.amount;
            }
        }

        const netCost = Math.max(0, estimatedCost - totalIncentives);
        const coverage = estimatedCost > 0 ? Math.round((totalIncentives / estimatedCost) * 100) : 0;

        return {
            totalIncentives,
            netCost,
            coverage
        };
    }
    
    /**
     * Get the best package (highest total incentives) from available packages
     */
    getBestPackage(packages, estimatedCost) {
        if (!packages || packages.length === 0) return null;
        if (packages.length === 1) return packages[0];
        
        let bestPackage = packages[0];
        let maxIncentives = 0;
        
        for (const pkg of packages) {
            const calc = this.calculateNetCost(estimatedCost, pkg);
            if (calc.totalIncentives > maxIncentives || calc.netCost === 0) {
                maxIncentives = calc.totalIncentives;
                bestPackage = pkg;
            }
        }
        
        return bestPackage;
    }

    /**
     * Get human-readable tier description
     */
    getTierDescription(tier) {
        const descriptions = {
            [this.tiers.WEATHERIZATION]: '🎉 No-Cost Weatherization Eligible',
            [this.tiers.CPF_LOW_INCOME]: '⭐ Income-Qualified (CPF + HEAR 100%)',
            [this.tiers.HEAR_MODERATE]: '💰 Moderate-Income (Standard + HEAR 50%)',
            [this.tiers.STANDARD]: '📊 Standard Incentives'
        };
        return descriptions[tier] || tier;
    }
    
    /**
     * Apply household-level caps to incentive packages across all measures
     * Ensures HEAR, HOMES, and CERTA don't exceed their household limits
     * 
     * HOMES Strategy:
     * - $10K maximum per site (not per measure)
     * - Cannot be stacked with HEAR on the same measure
     * - Dynamically allocated to fill gaps after HEAR, prioritizing health/safety and envelope
     * - CPF layers on top to achieve no-cost outcomes
     */
    applyHouseholdCaps(enrichedRecommendations) {
        let hearTotal = 0;
        let certaTotal = 0;
        const certaUsageByMeasure = [];
        
        // First pass: collect HEAR and CERTA usage from best packages
        enrichedRecommendations.forEach((rec, idx) => {
            if (rec.bestPackage && rec.bestPackage.incentives) {
                rec.bestPackage.incentives.forEach(inc => {
                    // Track HEAR usage
                    if (inc.program && inc.program.includes('HEAR') && typeof inc.amount === 'number') {
                        hearTotal += inc.amount;
                    }
                    // Track CERTA usage
                    if (inc.program && inc.program.includes('CERTA') && typeof inc.amount === 'number') {
                        certaUsageByMeasure.push({ idx, amount: inc.amount });
                        certaTotal += inc.amount;
                    }
                });
            }
        });
        
        // Apply HEAR household cap ($14,000)
        if (hearTotal > this.programCaps.HEAR_LOW_INCOME) {
            console.warn(`HEAR total ($${hearTotal}) exceeds household cap ($${this.programCaps.HEAR_LOW_INCOME})`);
        }
        
        // Apply CERTA household cap ($2,000)
        if (certaTotal > this.programCaps.CERTA_MAX) {
            console.log(`CERTA total ($${certaTotal}) exceeds cap ($${this.programCaps.CERTA_MAX}). Adjusting...`);
            
            const numCertaMeasures = certaUsageByMeasure.length;
            const certaPerMeasure = Math.floor(this.programCaps.CERTA_MAX / numCertaMeasures);
            
            certaUsageByMeasure.forEach((usage, i) => {
                const rec = enrichedRecommendations[usage.idx];
                if (rec.bestPackage && rec.bestPackage.incentives) {
                    rec.bestPackage.incentives.forEach(inc => {
                        if (inc.program && inc.program.includes('CERTA')) {
                            const oldAmount = inc.amount;
                            inc.amount = (i === numCertaMeasures - 1) ? 
                                this.programCaps.CERTA_MAX - (certaPerMeasure * (numCertaMeasures - 1)) :
                                certaPerMeasure;
                            inc.note = `$${inc.amount.toLocaleString()} of $${this.programCaps.CERTA_MAX.toLocaleString()} household cap (shared across ${numCertaMeasures} measures)`;
                            console.log(`  Adjusted CERTA for measure ${usage.idx}: $${oldAmount} → $${inc.amount}`);
                        }
                    });
                }
            });
        }
        
        // Apply HOMES site cap ($10,000) - dynamically allocate across non-HEAR measures
        // Pass customer tier to apply income-specific constraints
        const customerTier = enrichedRecommendations[0]?.customerTier || null;
        this.applyHOMESAllocation(enrichedRecommendations, customerTier);
        
        // Recalculate all measure totals after adjustments
        enrichedRecommendations.forEach(rec => {
            if (rec.bestPackage && rec.bestPackage.incentives) {
                const costCalc = this.calculateNetCost(rec.estimatedCostNum, rec.bestPackage);
                rec.totalIncentives = costCalc.totalIncentives;
                rec.netCost = costCalc.netCost;
                rec.coverage = costCalc.coverage;
            }
        });
        
        return enrichedRecommendations;
    }
    
    /**
     * Apply HOMES allocation across measures up to $10K site cap
     * Priority: Health/Safety > Envelope (insulation, air sealing) > Other
     * HOMES cannot stack with HEAR on the same measure
     * 
     * HOMES Coverage by Income (IRA Program Rules - loaded from config):
     * - ≤80% AMI: 100% of costs covered (up to site cap)
     * - 81-150% AMI: 50% of costs covered (up to site cap)
     * - >150% AMI: NOT ELIGIBLE for HOMES
     */
    applyHOMESAllocation(enrichedRecommendations, customerTier = null) {
        // Use config-driven site cap (0-10K range)
        let homesRemaining = this.programCaps.HOMES_FLEX_MAX;
        
        // Check eligibility - HOMES only available ≤homes_ami_max (150% AMI per config)
        if (customerTier === this.tiers.STANDARD) {
            console.log(`🏠 HOMES not available for >${this.incomeThresholds.homes_ami_max}% AMI customers`);
            // Remove any HOMES incentives from standard tier customers
            enrichedRecommendations.forEach(rec => {
                if (rec.bestPackage && rec.bestPackage.incentives) {
                    rec.bestPackage.incentives = rec.bestPackage.incentives.filter(inc => 
                        !inc.program || !inc.program.includes('HOMES')
                    );
                }
            });
            return;
        }
        
        // Check if customer is moderate income (affects HOMES percentage based on config)
        // Moderate income = 81-150% AMI per config
        const isModerateIncome = customerTier === this.tiers.HEAR_MODERATE;
        
        // Priority order for HOMES allocation (loaded from config)
        const priorityOrder = this.homesAllocationPriority;
        
        // Sort measures by priority
        const sortedMeasures = enrichedRecommendations
            .map((rec, idx) => ({ rec, idx }))
            .sort((a, b) => {
                const aPriority = priorityOrder.indexOf(a.rec.measureId);
                const bPriority = priorityOrder.indexOf(b.rec.measureId);
                const aVal = aPriority === -1 ? 999 : aPriority;
                const bVal = bPriority === -1 ? 999 : bPriority;
                return aVal - bVal;
            });
        
        console.log(`🏠 Allocating HOMES funding across measures (max $${this.programCaps.HOMES_FLEX_MAX.toLocaleString()} site cap)...`);
        
        sortedMeasures.forEach(({ rec, idx }) => {
            if (homesRemaining <= 0) return;
            if (!rec.bestPackage || !rec.bestPackage.incentives) return;
            
            // Check if measure has HEAR (HOMES can't stack with HEAR on same measure)
            const hasHEAR = rec.bestPackage.incentives.some(inc => 
                inc.program && inc.program.includes('HEAR')
            );
            
            if (hasHEAR) {
                console.log(`  ⊗ ${rec.measure}: Has HEAR, skipping HOMES (can't stack)`);
                // Remove HOMES from this measure if present
                rec.bestPackage.incentives = rec.bestPackage.incentives.filter(inc => 
                    !inc.program || !inc.program.includes('HOMES')
                );
                return;
            }
            
            // Find existing HOMES entry
            const homesIncentive = rec.bestPackage.incentives.find(inc => 
                inc.program && inc.program.includes('HOMES')
            );
            
            if (!homesIncentive) return; // Measure not HOMES-eligible
            
            // Calculate gap after other incentives (excluding HOMES)
            const otherIncentives = rec.bestPackage.incentives
                .filter(inc => !inc.program.includes('HOMES'))
                .reduce((sum, inc) => sum + (typeof inc.amount === 'number' ? inc.amount : 0), 0);
            
            const gap = Math.max(0, rec.estimatedCostNum - otherIncentives);
            
            // Apply HOMES coverage limits based on income tier (from config)
            // Low income (≤80% AMI): 100% coverage
            // Moderate income (81-150% AMI): 50% coverage
            let maxHomesForMeasure = gap;
            if (isModerateIncome) {
                const moderateCoveragePercent = this.homesCoverageRules.moderate_income.coverage_percent / 100;
                maxHomesForMeasure = Math.min(gap, rec.estimatedCostNum * moderateCoveragePercent);
            }
            
            // Allocate HOMES up to the max for this measure, but not exceeding remaining budget
            const homesAmount = Math.min(maxHomesForMeasure, homesRemaining);
            
            if (homesAmount > 0) {
                homesIncentive.amount = homesAmount;
                homesIncentive.note = `$${homesAmount.toLocaleString()} of $${this.programCaps.HOMES_FLEX_MAX.toLocaleString()} site cap (fills gap after other incentives)`;
                homesRemaining -= homesAmount;
                console.log(`  ✓ ${rec.measure}: Allocated $${homesAmount.toLocaleString()} HOMES (${homesRemaining.toLocaleString()} remaining)`);
            } else {
                // Remove HOMES if no amount allocated
                rec.bestPackage.incentives = rec.bestPackage.incentives.filter(inc => 
                    !inc.program || !inc.program.includes('HOMES')
                );
                console.log(`  ⊗ ${rec.measure}: No HOMES needed (fully covered by other incentives)`);
            }
        });
        
        console.log(`🏠 HOMES allocation complete. Used: $${(this.programCaps.HOMES_FLEX_MAX - homesRemaining).toLocaleString()} / $${this.programCaps.HOMES_FLEX_MAX.toLocaleString()}`);
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IncentiveRules;
}

// Also export to window for browser
if (typeof window !== 'undefined') {
    window.IncentiveRules = IncentiveRules;
}
