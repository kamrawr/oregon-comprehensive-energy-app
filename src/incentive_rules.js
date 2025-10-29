/**
 * Incentive Rules Engine
 * Maps customer eligibility to correct incentive amounts
 * Based on residential-incentive-insights project data
 */

class IncentiveRules {
    constructor() {
        // Income tier thresholds
        this.tiers = {
            WEATHERIZATION: 'weatherization',      // ≤60% AMI or ≤200% FPL - NO COST
            CPF_LOW_INCOME: 'cpf_low',            // 60-80% AMI - Enhanced + HEAR 100%
            HEAR_MODERATE: 'hear_moderate',        // 81-150% AMI - Standard + HEAR 50%
            STANDARD: 'standard'                   // >150% AMI - Standard only
        };
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
        if (smiPercent <= 60 || fplPercent <= 200) {
            return this.tiers.WEATHERIZATION;
        }
        
        // Priority 2: CPF Income-Qualified (60-80% AMI)
        if (amiPercent > 60 && amiPercent <= 80) {
            return this.tiers.CPF_LOW_INCOME;
        }
        
        // Priority 3: HEAR Moderate Income (81-150% AMI)
        if (amiPercent > 80 && amiPercent <= 150) {
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
            if (measureRule.homes_eligible) {
                packages.push({
                    name: 'HOMES Package (Comprehensive Alternative)',
                    incentives: [{
                        program: 'HOMES (IRA Federal)',
                        amount: '2,000-8,000',
                        priority: 2,
                        contact: 'Oregon DOE',
                        note: 'Whole-home rebate (≥20% savings) - available to all income tiers'
                    }],
                    note: 'Good for comprehensive projects - no waitlist'
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
     * Check if measure is eligible for CERTA (insulation/sealing/duct projects only)
     */
    isCERTAEligible(measureId) {
        const certaMeasures = [
            'attic_insulation',
            'wall_insulation',
            'floor_insulation',
            'air_sealing',
            'duct_sealing'
        ];
        return certaMeasures.includes(measureId);
    }
    
    /**
     * Build CPF incentive packages with proper stacking
     * CPF can stack with HEAR OR HOMES (not both) + CERTA
     */
    buildCPFPackages(measureId, measureRule, measureDetails, hearPercentage) {
        const packages = [];
        const cpfAmount = this.getCPFAmount(measureId, measureDetails);
        const hearAmount = this.getHEARAmount(measureId, hearPercentage);
        
        // Package 1: CPF + HEAR (for electrification measures)
        if (cpfAmount && hearAmount) {
            const incentives = [
                {
                    program: 'CPF - Energy Trust',
                    amount: cpfAmount,
                    priority: 1,
                    contact: 'Community Partner'
                },
                {
                    program: 'HEAR (IRA Federal)',
                    amount: hearAmount,
                    coverage: `${hearPercentage}%`,
                    priority: 1,
                    contact: 'Oregon DOE: 1-800-221-8035',
                    note: 'Cannot stack with HOMES'
                }
            ];
            
            // Add CERTA only for insulation/sealing/duct projects
            if (this.isCERTAEligible(measureId)) {
                incentives.push({
                    program: 'CERTA (Enabling Repairs)',
                    amount: 2000,
                    priority: 2,
                    contact: 'Oregon DOE',
                    note: 'For electrical/structural prep'
                });
            }
            
            packages.push({
                name: 'CPF + HEAR Package',
                incentives: incentives,
                note: 'Maximum stacking for this measure'
            });
        }
        
        // Package 2: CPF + HOMES (for envelope measures)
        if (cpfAmount && measureRule.homes_eligible) {
            const incentives = [
                {
                    program: 'CPF - Energy Trust',
                    amount: cpfAmount,
                    priority: 1,
                    contact: 'Community Partner'
                },
                {
                    program: 'HOMES (IRA Federal)',
                    amount: '2,000-8,000',
                    priority: 2,
                    contact: 'Oregon DOE',
                    note: 'Whole-home rebate (≥20% savings required), cannot stack with HEAR'
                }
            ];
            
            // Add CERTA only for insulation/sealing/duct projects
            if (this.isCERTAEligible(measureId)) {
                incentives.push({
                    program: 'CERTA',
                    amount: 2000,
                    priority: 2,
                    contact: 'Oregon DOE'
                });
            }
            
            packages.push({
                name: 'CPF + HOMES Package',
                incentives: incentives,
                note: 'Best for comprehensive envelope upgrades'
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
                    program: 'CERTA',
                    amount: 2000,
                    priority: 2,
                    contact: 'Oregon DOE'
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
     */
    buildStandardPlusHEARPackages(measureId, measureRule, measureDetails) {
        const packages = [];
        const standardAmount = this.getStandardAmount(measureId, measureDetails);
        const hearAmount = this.getHEARAmount(measureId, 50);
        
        // Package 1: Standard + HEAR
        if (standardAmount && hearAmount) {
            packages.push({
                name: 'Standard + HEAR 50%',
                incentives: [
                    {
                        program: 'Energy Trust Standard',
                        amount: standardAmount,
                        priority: 1,
                        contact: 'Energy Trust: 1-866-368-7878'
                    },
                    {
                        program: 'HEAR 50% (IRA Federal)',
                        amount: hearAmount,
                        priority: 1,
                        contact: 'Oregon DOE: 1-800-221-8035',
                        note: 'Cannot stack with HOMES'
                    }
                ],
                note: 'Best for electrification measures'
            });
        }
        
        // Package 2: Standard + HOMES
        if (standardAmount && measureRule.homes_eligible) {
            packages.push({
                name: 'Standard + HOMES',
                incentives: [
                    {
                        program: 'Energy Trust Standard',
                        amount: standardAmount,
                        priority: 1,
                        contact: 'Energy Trust: 1-866-368-7878'
                    },
                    {
                        program: 'HOMES (IRA Federal)',
                        amount: '2,000-8,000',
                        priority: 2,
                        contact: 'Oregon DOE',
                        note: 'Whole-home rebate (≥20% savings), cannot stack with HEAR'
                    }
                ],
                note: 'Best for comprehensive projects'
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
     */
    buildStandardPackages(measureId, measureRule, measureDetails) {
        const packages = [];
        const standardAmount = this.getStandardAmount(measureId, measureDetails);
        
        if (standardAmount) {
            const incentives = [{
                program: 'Energy Trust Standard',
                amount: standardAmount,
                priority: 1,
                contact: 'Energy Trust: 1-866-368-7878'
            }];
            
            if (measureRule.homes_eligible) {
                incentives.push({
                    program: 'HOMES (IRA Federal)',
                    amount: '2,000-8,000',
                    priority: 2,
                    contact: 'Oregon DOE',
                    note: 'Whole-home performance rebate'
                });
            }
            
            packages.push({
                name: 'Standard Programs',
                incentives: incentives,
                note: 'Market-rate incentives'
            });
        }
        
        return packages;
    }

    /**
     * Define measure-specific incentive rules
     */
    getMeasureRules() {
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
                certa_eligible: 2000
            },
            'electrical_wiring': {
                cpf: null,
                hear: 2500,
                standard: 0,
                homes_eligible: false,
                certa_eligible: 2000
            }
        };
    }

    /**
     * Get CPF incentive amount
     */
    getCPFAmount(measureId, details) {
        const rules = this.getMeasureRules()[measureId];
        if (!rules || !rules.cpf) return null;

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
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IncentiveRules;
}
