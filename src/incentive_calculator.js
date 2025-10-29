/**
 * Oregon Energy Incentive Calculator
 * 
 * Calculates available incentives based on:
 * - Customer eligibility (income, location, utilities)
 * - Home assessment data
 * - Program rules and stacking logic
 * 
 * Integrates with:
 * - config/program_eligibility_rules.yaml
 * - config/utility_territories.yaml
 * - config/measure_specifications.yaml
 */

class IncentiveCalculator {
    constructor(programRules, utilityTerritories, measureSpecs) {
        this.programs = programRules;
        this.territories = utilityTerritories;
        this.measures = measureSpecs;
    }

    /**
     * Calculate all available incentives for a customer
     * @param {Object} customerProfile - Customer intake and eligibility data
     * @param {Object} assessmentData - Home assessment results
     * @returns {Object} Available programs and optimized incentive packages
     */
    calculateAvailableIncentives(customerProfile, assessmentData) {
        // Step 1: Determine program eligibility
        const eligiblePrograms = this.determineEligiblePrograms(customerProfile);
        
        // Step 2: Generate measure recommendations based on assessment
        const recommendedMeasures = this.generateRecommendations(assessmentData, customerProfile);
        
        // Step 3: Calculate incentives for each measure
        const measuresWithIncentives = recommendedMeasures.map(measure => {
            return this.calculateMeasureIncentives(measure, eligiblePrograms, customerProfile);
        });
        
        // Step 4: Optimize incentive stacking
        const optimizedPackages = this.optimizeIncentiveStacking(measuresWithIncentives, eligiblePrograms);
        
        return {
            eligiblePrograms: eligiblePrograms,
            recommendations: measuresWithIncentives,
            optimizedPackages: optimizedPackages,
            totalEstimatedCost: this.calculateTotalCost(measuresWithIncentives),
            totalAvailableIncentives: this.calculateTotalIncentives(optimizedPackages),
            estimatedNetCost: this.calculateNetCost(measuresWithIncentives, optimizedPackages)
        };
    }

    /**
     * Determine which programs customer is eligible for
     */
    determineEligiblePrograms(customerProfile) {
        const eligible = {
            federal: [],
            state: [],
            utility: [],
            local: []
        };

        const ami = customerProfile.amiPercent;
        const income = customerProfile.annualIncome;
        const utilities = customerProfile.allUtilities || [];
        const county = customerProfile.county;
        const ownershipStatus = customerProfile.ownershipStatus;
        const housingType = customerProfile.housingType;

        // === FEDERAL PROGRAMS ===

        // HOMES (IRA) - Modeled savings rebate
        if (ami <= 150 && ['own', 'landlord'].includes(ownershipStatus)) {
            eligible.federal.push({
                id: 'homes',
                name: 'HOMES Rebate (IRA)',
                maxRebate: 8000,
                incomeQualified: ami <= 80,
                requiresEnergyModeling: true,
                description: 'Whole-home energy savings rebate based on modeled performance improvement'
            });
        }

        // HEAR (IRA) - High-efficiency appliance rebates
        if (ami <= 150 && ['own', 'landlord'].includes(ownershipStatus)) {
            const rebatePercentage = ami <= 80 ? 100 : 50;
            eligible.federal.push({
                id: 'hear',
                name: 'HEAR (High-Efficiency Electric Home Rebate)',
                maxRebate: 14000,
                rebatePercentage: rebatePercentage,
                incomeQualified: ami <= 80,
                description: 'Prescriptive rebates for electric heat pumps, water heaters, and upgrades',
                cannotStackWith: ['homes']
            });
        }

        // === STATE/UTILITY PROGRAMS ===

        // Energy Trust CPF (Income-Qualified)
        const hasEnergyTrustUtility = utilities.some(u => ['pge', 'pacific_power'].includes(u));
        if (ami <= 80 && hasEnergyTrustUtility) {
            eligible.state.push({
                id: 'cpf',
                name: 'Community Partner Funding (Energy Trust)',
                administrator: 'Community Based Organizations',
                incomeQualified: true,
                description: 'Enhanced incentives for income-qualified households',
                eligibleUtilities: ['pge', 'pacific_power']
            });
        }

        // Energy Trust Standard (All income levels)
        if (hasEnergyTrustUtility) {
            eligible.state.push({
                id: 'energy_trust_standard',
                name: 'Energy Trust Standard Incentives',
                incomeQualified: false,
                description: 'Standard prescriptive incentives for efficiency upgrades',
                eligibleUtilities: ['pge', 'pacific_power', 'nw_natural', 'cascade', 'avista'],
                cannotStackWith: ['cpf']
            });
        }

        // Oregon Weatherization (SWR)
        const smi = 78600; // Oregon State Median Income 2025
        const fpl200 = this.getFPL200(customerProfile.householdSize);
        if ((income <= smi * 0.60) || (income <= fpl200)) {
            eligible.state.push({
                id: 'swr',
                name: 'Single-Family Weatherization (OHCS)',
                noCost: true,
                comprehensive: true,
                description: 'Comprehensive no-cost weatherization and energy upgrades',
                cannotStackWith: ['all'] // Weatherization is standalone
            });
        }

        // CERTA (Tax Exemption - Available to all)
        eligible.state.push({
            id: 'certa',
            name: 'Clean Energy Retrofit Tax Assistance',
            type: 'property_tax_exemption',
            duration: '10 years',
            description: 'Property tax exemption for energy efficiency improvements',
            stacksWith: ['all']
        });

        // === UTILITY-SPECIFIC PROGRAMS ===
        utilities.forEach(utility => {
            const utilityPrograms = this.getUtilitySpecificPrograms(utility);
            eligible.utility.push(...utilityPrograms);
        });

        return eligible;
    }

    /**
     * Generate measure recommendations based on assessment
     */
    generateRecommendations(assessmentData, customerProfile) {
        const recommendations = [];
        const priorities = customerProfile.prioritizedConcerns || [];

        // Priority system: Health/Safety > Customer Priority > Envelope > HVAC > Water Heating

        // === HEALTH & SAFETY (Always Priority 1) ===
        if (assessmentData.healthSafety) {
            if (assessmentData.healthSafety.includes('combustion')) {
                recommendations.push({
                    measure: 'combustion_safety_testing',
                    category: 'health_safety',
                    priority: '🔴 CRITICAL',
                    estimatedCost: 0,
                    description: 'Required combustion appliance safety testing',
                    urgency: 'immediate'
                });
            }
            if (assessmentData.healthSafety.includes('mold')) {
                recommendations.push({
                    measure: 'moisture_remediation',
                    category: 'health_safety',
                    priority: '🔴 CRITICAL',
                    estimatedCost: 1500,
                    description: 'Address moisture and mold issues before insulation work',
                    urgency: 'immediate'
                });
            }
        }

        // === ENVELOPE MEASURES (Priority 2-4) ===
        if (assessmentData.atticInsulation === 'poor' || assessmentData.atticInsulation === 'none') {
            const customerPriority = this.findConcernPriority('insulation', priorities);
            recommendations.push({
                measure: 'attic_insulation',
                category: 'envelope',
                priority: '🟡 HIGH',
                customerPriorityWeight: customerPriority?.weight || 0,
                estimatedCost: this.calculateAtticInsulationCost(assessmentData.homeSize),
                estimatedSavings: 250,
                paybackYears: 4,
                description: `Add insulation to R-49+ (currently R-${assessmentData.currentAtticR || 11})`,
                sqft: assessmentData.atticArea || Math.floor(assessmentData.homeSize * 0.8),
                addressesConcerns: ['insulation', 'high_bills', 'comfort']
            });
        }

        if (assessmentData.airSealing !== 'good') {
            const customerPriority = this.findConcernPriority('drafts', priorities);
            recommendations.push({
                measure: 'air_sealing',
                category: 'envelope',
                priority: '🟡 HIGH',
                customerPriorityWeight: customerPriority?.weight || 0,
                estimatedCost: 1200,
                estimatedSavings: 180,
                paybackYears: 6,
                description: 'Comprehensive air sealing to reduce infiltration',
                addressesConcerns: ['drafts', 'comfort', 'high_bills']
            });
        }

        if (assessmentData.windowCondition === 'poor') {
            const customerPriority = this.findConcernPriority('windows', priorities);
            recommendations.push({
                measure: 'window_replacement',
                category: 'envelope',
                priority: '🟢 MEDIUM',
                customerPriorityWeight: customerPriority?.weight || 0,
                estimatedCost: 8000,
                estimatedSavings: 300,
                paybackYears: 26,
                description: 'Replace with ENERGY STAR windows',
                windowCount: assessmentData.windowCount || 12,
                addressesConcerns: ['windows', 'drafts', 'comfort']
            });
        }

        // === HVAC MEASURES (Priority 5-6) ===
        if (assessmentData.heatingSystem === 'electric_resistance' || 
            assessmentData.heatingAge > 15) {
            const customerPriority = this.findConcernPriority('old_equipment', priorities);
            
            const heatPumpType = assessmentData.hasExistingDucts === 'yes' ? 'ducted' : 'ductless';
            const estimatedCost = heatPumpType === 'ducted' ? 12000 : 8500;
            
            recommendations.push({
                measure: `heat_pump_${heatPumpType}`,
                category: 'hvac',
                priority: '🟡 HIGH',
                customerPriorityWeight: customerPriority?.weight || 0,
                estimatedCost: estimatedCost,
                estimatedSavings: 800,
                paybackYears: 8,
                description: `Install ${heatPumpType} heat pump (replacing ${assessmentData.heatingSystem})`,
                heatPumpType: heatPumpType,
                sizing: this.calculateHeatPumpSizing(assessmentData.homeSize),
                addressesConcerns: ['old_equipment', 'high_bills', 'comfort']
            });
        }

        if (assessmentData.waterHeaterType === 'electric_tank' && assessmentData.waterHeaterAge > 10) {
            recommendations.push({
                measure: 'heat_pump_water_heater',
                category: 'water_heating',
                priority: '🟢 MEDIUM',
                estimatedCost: 2500,
                estimatedSavings: 350,
                paybackYears: 5,
                description: 'Upgrade to heat pump water heater (UEF 3.0+)',
                addressesConcerns: ['old_equipment', 'high_bills']
            });
        }

        // === DUCT SEALING ===
        if (assessmentData.hasExistingDucts === 'yes' && assessmentData.ductCondition !== 'good') {
            recommendations.push({
                measure: 'duct_sealing',
                category: 'hvac',
                priority: '🟡 HIGH',
                estimatedCost: 800,
                estimatedSavings: 150,
                paybackYears: 5,
                description: 'Professional duct sealing and insulation',
                addressesConcerns: ['drafts', 'comfort', 'high_bills']
            });
        }

        // Sort by priority and customer weight
        return this.sortRecommendations(recommendations);
    }

    /**
     * Calculate incentives for a specific measure
     */
    calculateMeasureIncentives(measure, eligiblePrograms, customerProfile) {
        const incentives = [];
        const ami = customerProfile.amiPercent;

        // Check each eligible program for this measure
        [...eligiblePrograms.federal, ...eligiblePrograms.state, ...eligiblePrograms.utility]
            .forEach(program => {
                const incentive = this.getMeasureIncentive(measure, program, ami);
                if (incentive && incentive.amount > 0) {
                    incentives.push(incentive);
                }
            });

        // Add incentive details to measure
        return {
            ...measure,
            availableIncentives: incentives,
            totalIncentivesBeforeStacking: incentives.reduce((sum, inc) => sum + inc.amount, 0)
        };
    }

    /**
     * Get incentive amount for a measure from a specific program
     */
    getMeasureIncentive(measure, program, ami) {
        const measureId = measure.measure;

        // === HEAR PROGRAM ===
        if (program.id === 'hear') {
            const hearIncentives = {
                'heat_pump_ducted': 8000,
                'heat_pump_ductless': 8000,
                'heat_pump_water_heater': 1750,
                'electric_panel_upgrade': 4000,
                'electrical_wiring': 2500,
                'attic_insulation': 1600,
                'air_sealing': 1600,
                'window_replacement': 1600
            };

            if (hearIncentives[measureId]) {
                const baseAmount = hearIncentives[measureId];
                const rebatePercent = program.rebatePercentage;
                return {
                    program: 'HEAR',
                    amount: Math.floor(baseAmount * (rebatePercent / 100)),
                    maxAmount: baseAmount,
                    percentage: rebatePercent,
                    requirements: ['Income verification', 'Licensed contractor', 'Meets efficiency standards'],
                    applicationProcess: 'Apply through Oregon Department of Energy'
                };
            }
        }

        // === CPF (Income-Qualified Energy Trust) ===
        if (program.id === 'cpf') {
            if (measureId === 'heat_pump_ductless') {
                const isManufacturedHome = measure.housingType === 'manufactured';
                return {
                    program: 'CPF - Energy Trust',
                    amount: isManufacturedHome ? 3500 : 1800,
                    requirements: ['Income verification', 'HSPF2 ≥ 8.10', 'Replaces electric resistance'],
                    applicationProcess: 'Apply through Community Partner organization'
                };
            }
            if (measureId === 'heat_pump_ducted') {
                return {
                    program: 'CPF - Energy Trust',
                    amount: 4000,
                    requirements: ['Income verification', 'HSPF2 ≥ 7.50', 'Replaces electric furnace'],
                    applicationProcess: 'Apply through Community Partner organization'
                };
            }
            if (measureId === 'attic_insulation') {
                const sqft = measure.sqft || 1000;
                return {
                    program: 'CPF - Energy Trust',
                    amount: Math.floor(sqft * 0.15),
                    perSqft: 0.15,
                    sqft: sqft,
                    requirements: ['Income verification', 'R-value improvement'],
                    applicationProcess: 'Apply through Community Partner organization'
                };
            }
            if (measureId === 'air_sealing') {
                return {
                    program: 'CPF - Energy Trust',
                    amount: 800,
                    requirements: ['Income verification', 'Blower door testing'],
                    applicationProcess: 'Apply through Community Partner organization'
                };
            }
        }

        // === ENERGY TRUST STANDARD ===
        if (program.id === 'energy_trust_standard') {
            if (measureId === 'heat_pump_ductless') {
                return {
                    program: 'Energy Trust Standard',
                    amount: 800,
                    requirements: ['HSPF2 ≥ 8.10', 'Trade Ally installation'],
                    applicationProcess: 'Apply through Energy Trust Trade Ally'
                };
            }
            if (measureId === 'heat_pump_ducted') {
                return {
                    program: 'Energy Trust Standard',
                    amount: 1500,
                    requirements: ['HSPF2 ≥ 7.50', 'Trade Ally installation'],
                    applicationProcess: 'Apply through Energy Trust Trade Ally'
                };
            }
            if (measureId === 'attic_insulation') {
                const sqft = measure.sqft || 1000;
                return {
                    program: 'Energy Trust Standard',
                    amount: Math.floor(sqft * 0.10),
                    perSqft: 0.10,
                    sqft: sqft,
                    requirements: ['R-value improvement', 'Trade Ally installation'],
                    applicationProcess: 'Apply through Energy Trust Trade Ally'
                };
            }
        }

        return null;
    }

    /**
     * Optimize incentive stacking to maximize total incentives
     */
    optimizeIncentiveStacking(measuresWithIncentives, eligiblePrograms) {
        const packages = [];

        // Check if customer qualifies for Weatherization (SWR)
        const hasWeatherization = eligiblePrograms.state.some(p => p.id === 'swr');
        if (hasWeatherization) {
            // Weatherization covers everything at no cost
            packages.push({
                name: 'Oregon Weatherization Program (No-Cost)',
                programs: ['SWR - Single-Family Weatherization'],
                totalIncentives: measuresWithIncentives.reduce((sum, m) => sum + m.estimatedCost, 0),
                customerCost: 0,
                description: 'All measures covered at no cost through weatherization program',
                isOptimal: true
            });
            return packages;
        }

        // === PACKAGE 1: HEAR (if eligible) ===
        const hearProgram = eligiblePrograms.federal.find(p => p.id === 'hear');
        if (hearProgram) {
            let hearTotal = 0;
            const hearMeasures = [];
            
            measuresWithIncentives.forEach(measure => {
                const hearIncentive = measure.availableIncentives.find(i => i.program === 'HEAR');
                if (hearIncentive) {
                    hearTotal += hearIncentive.amount;
                    hearMeasures.push(measure.measure);
                }
            });

            packages.push({
                name: 'HEAR Package (IRA)',
                programs: ['HEAR'],
                measures: hearMeasures,
                totalIncentives: Math.min(hearTotal, 14000),
                maxPerHousehold: 14000,
                canStackWith: ['utility', 'certa'],
                cannotStackWith: ['homes', 'cpf'],
                description: `Federal rebates for electrification (${hearProgram.rebatePercentage}% income-qualified rebate)`
            });
        }

        // === PACKAGE 2: CPF + Utility (if eligible) ===
        const cpfProgram = eligiblePrograms.state.find(p => p.id === 'cpf');
        if (cpfProgram) {
            let cpfTotal = 0;
            const cpfMeasures = [];
            
            measuresWithIncentives.forEach(measure => {
                const cpfIncentive = measure.availableIncentives.find(i => i.program === 'CPF - Energy Trust');
                if (cpfIncentive) {
                    cpfTotal += cpfIncentive.amount;
                    cpfMeasures.push(measure.measure);
                }
            });

            packages.push({
                name: 'CPF Income-Qualified Package',
                programs: ['CPF', 'Utility Programs'],
                measures: cpfMeasures,
                totalIncentives: cpfTotal,
                canStackWith: ['homes', 'utility', 'certa'],
                cannotStackWith: ['energy_trust_standard'],
                description: 'Enhanced incentives for income-qualified households through Community Partners'
            });
        }

        // === PACKAGE 3: Energy Trust Standard + HOMES ===
        const energyTrustStandard = eligiblePrograms.state.find(p => p.id === 'energy_trust_standard');
        const homesProgram = eligiblePrograms.federal.find(p => p.id === 'homes');
        
        if (energyTrustStandard && homesProgram) {
            let etTotal = 0;
            const etMeasures = [];
            
            measuresWithIncentives.forEach(measure => {
                const etIncentive = measure.availableIncentives.find(i => i.program === 'Energy Trust Standard');
                if (etIncentive) {
                    etTotal += etIncentive.amount;
                    etMeasures.push(measure.measure);
                }
            });

            packages.push({
                name: 'HOMES + Energy Trust Package',
                programs: ['HOMES (IRA)', 'Energy Trust Standard'],
                measures: etMeasures,
                totalIncentives: etTotal + 4000, // Estimated HOMES for 20-35% savings
                description: 'Performance-based HOMES rebate + prescriptive Energy Trust incentives',
                requiresEnergyModeling: true,
                canStackWith: ['cpf', 'utility', 'certa'],
                cannotStackWith: ['hear']
            });
        }

        // Sort packages by total incentive value
        packages.sort((a, b) => b.totalIncentives - a.totalIncentives);
        
        if (packages.length > 0) {
            packages[0].isOptimal = true;
        }

        return packages;
    }

    // === HELPER FUNCTIONS ===

    findConcernPriority(concernId, prioritizedConcerns) {
        return prioritizedConcerns.find(c => c.id === concernId);
    }

    sortRecommendations(recommendations) {
        return recommendations.sort((a, b) => {
            // Critical health/safety first
            if (a.urgency === 'immediate' && b.urgency !== 'immediate') return -1;
            if (b.urgency === 'immediate' && a.urgency !== 'immediate') return 1;
            
            // Then by customer priority weight
            const aWeight = a.customerPriorityWeight || 0;
            const bWeight = b.customerPriorityWeight || 0;
            if (aWeight !== bWeight) return bWeight - aWeight;
            
            // Then by priority level
            const priorityOrder = { '🔴 CRITICAL': 0, '🟡 HIGH': 1, '🟢 MEDIUM': 2, '⚪ LOW': 3 };
            return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
        });
    }

    calculateAtticInsulationCost(homeSize) {
        const sqft = Math.floor(homeSize * 0.8); // Assume attic is 80% of floor area
        const costPerSqft = 2.50;
        return Math.floor(sqft * costPerSqft);
    }

    calculateHeatPumpSizing(homeSize) {
        // Simplified Manual J: ~25-30 BTU/sqft for Oregon climate
        const btuPerSqft = 25;
        const totalBtu = homeSize * btuPerSqft;
        const tons = Math.ceil(totalBtu / 12000);
        
        return {
            estimatedLoad: totalBtu,
            recommendedSize: `${tons} ton`,
            minBtu: totalBtu * 0.9,
            maxBtu: totalBtu * 1.15
        };
    }

    getFPL200(householdSize) {
        const fpl = {
            1: 15060, 2: 20440, 3: 25820, 4: 31200,
            5: 36580, 6: 41960, 7: 47340, 8: 52720
        };
        return (fpl[householdSize] || 52720) * 2;
    }

    getUtilitySpecificPrograms(utility) {
        const programs = [];
        
        if (utility === 'pge') {
            programs.push({
                id: 'pge_smart_thermostat',
                name: 'PGE Smart Thermostat Rebate',
                amount: 50,
                utility: 'pge'
            });
        }
        
        if (utility === 'nw_natural') {
            programs.push({
                id: 'nwn_gas_furnace',
                name: 'NW Natural Gas Furnace Rebate',
                amount: 700,
                utility: 'nw_natural',
                requirements: ['95% AFUE or higher']
            });
        }
        
        return programs;
    }

    calculateTotalCost(measures) {
        return measures.reduce((sum, m) => sum + (m.estimatedCost || 0), 0);
    }

    calculateTotalIncentives(packages) {
        if (packages.length === 0) return 0;
        return packages[0].totalIncentives;
    }

    calculateNetCost(measures, packages) {
        const totalCost = this.calculateTotalCost(measures);
        const totalIncentives = this.calculateTotalIncentives(packages);
        return Math.max(0, totalCost - totalIncentives);
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IncentiveCalculator;
}
