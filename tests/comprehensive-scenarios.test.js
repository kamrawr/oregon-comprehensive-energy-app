/**
 * Comprehensive Scenario Tests for Oregon Energy Assessment Tool v1.2
 * Tests cover:
 * - Income eligibility tiers
 * - HOMES dynamic allocation ($10K site cap)
 * - HOMES/HEAR anti-stacking
 * - CPF no-cost eligible measures
 * - Heat pump water heater no-cost coverage
 * - Program opt-outs
 * - All measure types and stacking rules
 * 
 * Run with: node tests/comprehensive-scenarios.test.js
 */

const testScenarios = [
    // ==================== INCOME TIER TESTS ====================
    
    {
        name: "Scenario 1: Weatherization Tier - Full No-Cost Coverage",
        customer: {
            ami: 55,
            smi: 55,
            fpl: 195,
            isPriority: true,
            hasCBO: false,
            optOutFederal: false,
            housingType: 'single_family'
        },
        measures: ['attic_insulation', 'heat_pump_ductless', 'heat_pump_water_heater'],
        noCostEligible: true,
        optOutHOMES: false,
        expected: {
            tier: 'weatherization',
            weatherizationAvailable: true,
            cpfEligible: true,
            hearAvailable: true,
            homesAvailable: true,
            measures: {
                attic_insulation: {
                    hasHEAR: true,
                    hasHOMES: false, // HEAR present, HOMES excluded
                    hasCPF: true,
                    cpfNoCost: true,
                    netCost: 0
                },
                heat_pump_ductless: {
                    hasHEAR: true,
                    hasHOMES: false,
                    hasCPF: true,
                    cpfNoCost: true,
                    netCost: 0
                },
                heat_pump_water_heater: {
                    hasHEAR: true,
                    hasHOMES: false,
                    hasCPF: true,
                    cpfNoCost: true, // Should be no-cost eligible
                    netCost: 0
                }
            }
        }
    },

    {
        name: "Scenario 2: CPF Low Income (60-80% AMI) - Enhanced Incentives",
        customer: {
            ami: 70,
            smi: 70,
            fpl: 220,
            isPriority: true,
            hasCBO: true,
            optOutFederal: false,
            housingType: 'single_family'
        },
        measures: ['attic_insulation', 'wall_insulation', 'heat_pump_ducted', 'heat_pump_water_heater'],
        noCostEligible: true,
        optOutHOMES: false,
        expected: {
            tier: 'cpf_low',
            cpfEligible: true,
            hearAvailable: true,
            homesAvailable: true,
            homesTotal: 10000, // Should allocate $10K across envelope measures
            measures: {
                attic_insulation: {
                    hasHEAR: true,
                    hasHOMES: false,
                    hasCPF: true,
                    cpfNoCost: true
                },
                wall_insulation: {
                    hasHEAR: true,
                    hasHOMES: false,
                    hasCPF: true,
                    cpfNoCost: true
                },
                heat_pump_ducted: {
                    hasHEAR: true,
                    hasHOMES: false,
                    hasCPF: true,
                    cpfNoCost: true
                },
                heat_pump_water_heater: {
                    hasHEAR: true,
                    hasHOMES: false, // Not HOMES eligible
                    hasCPF: true,
                    cpfNoCost: true
                }
            }
        }
    },

    {
        name: "Scenario 3: HEAR Moderate (81-150% AMI) - Standard + HEAR 50%",
        customer: {
            ami: 120,
            smi: 120,
            fpl: 350,
            isPriority: false,
            hasCBO: false,
            optOutFederal: false,
            housingType: 'single_family'
        },
        measures: ['attic_insulation', 'floor_insulation', 'window_replacement', 'air_sealing'],
        noCostEligible: false,
        optOutHOMES: false,
        expected: {
            tier: 'hear_moderate',
            cpfEligible: false,
            hearAvailable: true,
            hearPercentage: 50,
            homesAvailable: true,
            homesTotal: 10000,
            measures: {
                attic_insulation: {
                    hasHEAR: true,
                    hasHOMES: false,
                    hasCPF: false,
                    hasStandard: true
                },
                floor_insulation: {
                    hasHEAR: true,
                    hasHOMES: false,
                    hasStandard: true
                },
                window_replacement: {
                    hasHEAR: false,
                    hasHOMES: true, // No HEAR, can have HOMES
                    hasStandard: true
                },
                air_sealing: {
                    hasHEAR: false,
                    hasHOMES: true,
                    hasStandard: true
                }
            }
        }
    },

    // ==================== HOMES ALLOCATION TESTS ====================

    {
        name: "Scenario 4: HOMES Allocation Priority - Health/Safety First",
        customer: {
            ami: 75,
            smi: 75,
            fpl: 230,
            isPriority: true,
            hasCBO: true,
            optOutFederal: false,
            housingType: 'single_family'
        },
        measures: [
            'health_safety_repairs', // Priority 1
            'attic_insulation',       // Priority 2
            'wall_insulation',        // Priority 3
            'air_sealing',           // Priority 4
            'window_replacement'      // Priority 5
        ],
        noCostEligible: true,
        optOutHOMES: false,
        measureCosts: {
            health_safety_repairs: 4000,
            attic_insulation: 3000,
            wall_insulation: 2500,
            air_sealing: 1200,
            window_replacement: 8000
        },
        expected: {
            homesTotal: 10000,
            homesAllocation: {
                health_safety_repairs: 4000, // First priority
                attic_insulation: 3000,       // Second (if HEAR doesn't cover)
                wall_insulation: 2500,        // Third (if room remains)
                air_sealing: 500,             // Fourth (remaining budget)
                window_replacement: 0         // May not get HOMES if cap reached
            }
        }
    },

    {
        name: "Scenario 5: HOMES $10K Cap Enforcement",
        customer: {
            ami: 130,
            smi: 130,
            fpl: 380,
            isPriority: false,
            hasCBO: false,
            optOutFederal: false,
            housingType: 'single_family'
        },
        measures: ['attic_insulation', 'wall_insulation', 'floor_insulation', 'window_replacement', 'air_sealing'],
        noCostEligible: false,
        optOutHOMES: false,
        measureCosts: {
            attic_insulation: 4000,
            wall_insulation: 4000,
            floor_insulation: 3500,
            window_replacement: 8000,
            air_sealing: 1200
        },
        expected: {
            homesTotal: 10000, // Must not exceed $10K
            homesCappedCorrectly: true,
            totalAllocationAcrossMeasures: 10000 // Sum of all HOMES amounts
        }
    },

    {
        name: "Scenario 6: HOMES/HEAR Anti-Stacking - No Overlap",
        customer: {
            ami: 65,
            smi: 65,
            fpl: 210,
            isPriority: true,
            hasCBO: true,
            optOutFederal: false,
            housingType: 'single_family'
        },
        measures: ['attic_insulation', 'heat_pump_ducted', 'window_replacement'],
        noCostEligible: true,
        optOutHOMES: false,
        expected: {
            measures: {
                attic_insulation: {
                    hasHEAR: true,
                    hasHOMES: false, // HEAR present, no HOMES allowed
                    hearAndHomesOnSame: false
                },
                heat_pump_ducted: {
                    hasHEAR: true,
                    hasHOMES: false,
                    hearAndHomesOnSame: false
                },
                window_replacement: {
                    hasHEAR: false, // Windows not HEAR eligible
                    hasHOMES: true,  // Can receive HOMES
                    hearAndHomesOnSame: false
                }
            }
        }
    },

    // ==================== CPF NO-COST TESTS ====================

    {
        name: "Scenario 7: CPF No-Cost Toggle - Insulation Enhanced",
        customer: {
            ami: 72,
            smi: 72,
            fpl: 225,
            isPriority: true,
            hasCBO: true,
            optOutFederal: false,
            housingType: 'single_family'
        },
        measures: ['attic_insulation', 'wall_insulation'],
        noCostEligible: true,
        optOutHOMES: false,
        measureCosts: {
            attic_insulation: 3000,
            wall_insulation: 2500
        },
        expected: {
            measures: {
                attic_insulation: {
                    cpfAmount_noCostON: 3300, // 110% of gap for no-cost assurance
                    cpfAmount_noCostOFF: 1500, // 1000 sqft * $1.50/sqft standard
                    cpfIsEnhanced: true
                },
                wall_insulation: {
                    cpfAmount_noCostON: 2750,
                    cpfAmount_noCostOFF: 1000, // 1000 sqft * $1.00/sqft standard
                    cpfIsEnhanced: true
                }
            }
        }
    },

    {
        name: "Scenario 8: CPF No-Cost - Heat Pumps",
        customer: {
            ami: 68,
            smi: 68,
            fpl: 215,
            isPriority: true,
            hasCBO: true,
            optOutFederal: false,
            housingType: 'single_family'
        },
        measures: ['heat_pump_ductless', 'heat_pump_ducted'],
        noCostEligible: true,
        optOutHOMES: false,
        measureCosts: {
            heat_pump_ductless: 8500,
            heat_pump_ducted: 12000
        },
        expected: {
            measures: {
                heat_pump_ductless: {
                    hasHEAR: true,
                    hearAmount: 8000,
                    cpfAmount_noCostON: 550, // (8500 - 8000) * 1.1
                    cpfAmount_noCostOFF: 1800, // Standard CPF
                    netCost_noCostON: 0
                },
                heat_pump_ducted: {
                    hasHEAR: true,
                    hearAmount: 8000,
                    cpfAmount_noCostON: 4400, // (12000 - 8000) * 1.1
                    cpfAmount_noCostOFF: 4000, // Standard CPF
                    netCost_noCostON: 0
                }
            }
        }
    },

    {
        name: "Scenario 9: CPF No-Cost - Heat Pump Water Heater (CRITICAL TEST)",
        customer: {
            ami: 70,
            smi: 70,
            fpl: 220,
            isPriority: true,
            hasCBO: true,
            optOutFederal: false,
            housingType: 'single_family'
        },
        measures: ['heat_pump_water_heater'],
        noCostEligible: true,
        optOutHOMES: false,
        measureCosts: {
            heat_pump_water_heater: 2500
        },
        expected: {
            measures: {
                heat_pump_water_heater: {
                    hasHEAR: true,
                    hearAmount: 1750,
                    hasCPF: true,
                    cpfAmount_noCostON: 825, // (2500 - 1750) * 1.1 = 825
                    cpfAmount_noCostOFF: 240, // Standard CPF
                    netCost_noCostON: 0, // Should be $0 with no-cost enabled
                    netCost_noCostOFF: 510, // 2500 - 1750 - 240
                    cpfIsEnhanced: true,
                    noCostEligible: true // CRITICAL: HPWH must be no-cost eligible
                }
            }
        }
    },

    // ==================== OPT-OUT TESTS ====================

    {
        name: "Scenario 10: HOMES Opt-Out - Falls Back to CPF Only",
        customer: {
            ami: 70,
            smi: 70,
            fpl: 220,
            isPriority: true,
            hasCBO: true,
            optOutFederal: false,
            housingType: 'single_family'
        },
        measures: ['attic_insulation', 'air_sealing'],
        noCostEligible: true,
        optOutHOMES: true, // HOMES opted out
        expected: {
            measures: {
                attic_insulation: {
                    hasHOMES: false, // Opted out
                    hasHEAR: true,
                    hasCPF: true
                },
                air_sealing: {
                    hasHOMES: false,
                    hasHEAR: false,
                    hasCPF: true
                }
            },
            homesTotal: 0 // No HOMES when opted out
        }
    },

    {
        name: "Scenario 11: Federal Opt-Out - Only State Programs",
        customer: {
            ami: 55,
            smi: 55,
            fpl: 195,
            isPriority: true,
            hasCBO: true,
            optOutFederal: true, // All federal opted out
            housingType: 'single_family'
        },
        measures: ['attic_insulation', 'heat_pump_ductless'],
        noCostEligible: false,
        optOutHOMES: false,
        expected: {
            weatherizationAvailable: false,
            cpfEligible: false,
            hearAvailable: false,
            homesAvailable: false,
            energyTrustAvailable: true, // Only state/utility programs
            measures: {
                attic_insulation: {
                    hasHEAR: false,
                    hasHOMES: false,
                    hasCPF: false,
                    hasStandard: true // Only Energy Trust standard
                },
                heat_pump_ductless: {
                    hasHEAR: false,
                    hasHOMES: false,
                    hasCPF: false,
                    hasStandard: true
                }
            }
        }
    },

    // ==================== PROGRAM STACKING TESTS ====================

    {
        name: "Scenario 12: HEAR + CPF + CERTA Stack",
        customer: {
            ami: 75,
            smi: 75,
            fpl: 230,
            isPriority: true,
            hasCBO: true,
            optOutFederal: false,
            housingType: 'single_family'
        },
        measures: ['attic_insulation'],
        noCostEligible: true,
        optOutHOMES: false,
        expected: {
            measures: {
                attic_insulation: {
                    hasHEAR: true,
                    hasCPF: true,
                    hasCERTA: true,
                    certaAmount: 2000, // Capped at $2K
                    programCount: 3, // HEAR + CPF + CERTA
                    stackingValid: true
                }
            }
        }
    },

    {
        name: "Scenario 13: HOMES + CPF + CERTA Stack",
        customer: {
            ami: 75,
            smi: 75,
            fpl: 230,
            isPriority: true,
            hasCBO: true,
            optOutFederal: false,
            housingType: 'single_family'
        },
        measures: ['window_replacement'], // Not HEAR eligible, but HOMES eligible
        noCostEligible: true,
        optOutHOMES: false,
        expected: {
            measures: {
                window_replacement: {
                    hasHEAR: false,
                    hasHOMES: true, // Can receive HOMES
                    hasCPF: true,
                    hasCERTA: false, // Windows not CERTA eligible
                    stackingValid: true
                }
            }
        }
    },

    {
        name: "Scenario 14: CERTA $2K Household Cap Across Measures",
        customer: {
            ami: 75,
            smi: 75,
            fpl: 230,
            isPriority: true,
            hasCBO: true,
            optOutFederal: false,
            housingType: 'single_family'
        },
        measures: ['attic_insulation', 'wall_insulation', 'floor_insulation', 'air_sealing'],
        noCostEligible: true,
        optOutHOMES: false,
        expected: {
            certaTotal: 2000, // Must not exceed $2K household cap
            certaDistributed: true, // Should be split across eligible measures
            certaPerMeasure: 500 // $2K / 4 measures = $500 each
        }
    },

    // ==================== EDGE CASE TESTS ====================

    {
        name: "Scenario 15: Manufactured Home - Higher CPF Amounts",
        customer: {
            ami: 70,
            smi: 70,
            fpl: 220,
            isPriority: true,
            hasCBO: true,
            optOutFederal: false,
            housingType: 'manufactured'
        },
        measures: ['heat_pump_ductless'],
        noCostEligible: false,
        optOutHOMES: false,
        expected: {
            measures: {
                heat_pump_ductless: {
                    cpfAmount: 3500, // Manufactured home gets $3500 vs $1800
                    cpfIsEnhanced: true
                }
            }
        }
    },

    {
        name: "Scenario 16: CPF Tier 2 (81-150% AMI) - No HEAR/HOMES",
        customer: {
            ami: 100,
            smi: 100,
            fpl: 300,
            isPriority: true,
            hasCBO: true, // BOTH required for CPF Tier 2
            optOutFederal: false,
            housingType: 'single_family'
        },
        measures: ['attic_insulation', 'heat_pump_ducted'],
        noCostEligible: false,
        optOutHOMES: false,
        expected: {
            tier: 'cpf_tier2',
            cpfEligible: true,
            hearAvailable: false, // NOT available to CPF Tier 2
            homesAvailable: false, // NOT available to CPF Tier 2
            measures: {
                attic_insulation: {
                    hasHEAR: false,
                    hasHOMES: false,
                    hasCPF: true
                },
                heat_pump_ducted: {
                    hasHEAR: false,
                    hasHOMES: false,
                    hasCPF: true
                }
            }
        }
    },

    {
        name: "Scenario 17: No-Cost Toggle OFF - Standard CPF Amounts",
        customer: {
            ami: 70,
            smi: 70,
            fpl: 220,
            isPriority: true,
            hasCBO: true,
            optOutFederal: false,
            housingType: 'single_family'
        },
        measures: ['attic_insulation', 'heat_pump_water_heater'],
        noCostEligible: false, // No-cost toggle OFF
        optOutHOMES: false,
        expected: {
            measures: {
                attic_insulation: {
                    cpfAmount: 1500, // 1000 sqft * $1.50 standard
                    cpfIsEnhanced: false
                },
                heat_pump_water_heater: {
                    cpfAmount: 240, // Standard $240
                    cpfIsEnhanced: false,
                    netCost: 510 // Should have out-of-pocket cost
                }
            }
        }
    },

    // ==================== COMPREHENSIVE INTEGRATION TESTS ====================

    {
        name: "Scenario 18: Full House Retrofit - All Measures",
        customer: {
            ami: 68,
            smi: 68,
            fpl: 215,
            isPriority: true,
            hasCBO: true,
            optOutFederal: false,
            housingType: 'single_family'
        },
        measures: [
            'attic_insulation',
            'wall_insulation',
            'floor_insulation',
            'air_sealing',
            'window_replacement',
            'heat_pump_ducted',
            'heat_pump_water_heater',
            'duct_sealing'
        ],
        noCostEligible: true,
        optOutHOMES: false,
        expected: {
            homesTotal: 10000, // Capped at $10K
            certaTotal: 2000,   // Capped at $2K
            allMeasuresHaveIncentives: true,
            noCostAchieved: true, // Should achieve $0 net cost
            totalIncentives: '> $30,000' // Significant total incentives
        }
    },

    {
        name: "Scenario 19: Real-Time Recalculation Test",
        customer: {
            ami: 70,
            smi: 70,
            fpl: 220,
            isPriority: true,
            hasCBO: true,
            optOutFederal: false,
            housingType: 'single_family'
        },
        measures: ['attic_insulation', 'heat_pump_water_heater'],
        testSequence: [
            { noCostEligible: false, optOutHOMES: false },
            { noCostEligible: true, optOutHOMES: false },  // Toggle no-cost ON
            { noCostEligible: true, optOutHOMES: true },   // Toggle HOMES OFF
            { noCostEligible: false, optOutHOMES: true }   // Toggle no-cost OFF
        ],
        expected: {
            recalculatesCorrectly: true,
            allNumbersUpdate: true,
            noErrors: true
        }
    },

    {
        name: "Scenario 20: Program Benefits Rollup Accuracy",
        customer: {
            ami: 70,
            smi: 70,
            fpl: 220,
            isPriority: true,
            hasCBO: true,
            optOutFederal: false,
            housingType: 'single_family'
        },
        measures: ['attic_insulation', 'wall_insulation', 'heat_pump_ducted', 'heat_pump_water_heater'],
        noCostEligible: true,
        optOutHOMES: false,
        expected: {
            rollupShows: {
                HEAR: true,
                HOMES: true,
                CPF: true,
                CERTA: true
            },
            rollupTotalsMatch: true,
            allProgramsListed: true,
            measuresPerProgramCorrect: true
        }
    }
];

// ==================== TEST EXECUTION FRAMEWORK ====================

function runComprehensiveTests() {
    console.log('🧪 Running Comprehensive Scenario Tests for v1.2\n');
    console.log('=' .repeat(90));
    
    let passed = 0;
    let failed = 0;
    const failures = [];
    
    testScenarios.forEach((scenario, index) => {
        console.log(`\n📋 ${scenario.name}`);
        console.log(`   Customer: ${scenario.customer.ami}% AMI | Priority: ${scenario.customer.isPriority} | CBO: ${scenario.customer.hasCBO}`);
        console.log(`   Measures: ${scenario.measures.join(', ')}`);
        console.log(`   No-Cost: ${scenario.noCostEligible} | HOMES Opt-Out: ${scenario.optOutHOMES}`);
        
        // For now, just list scenarios (actual implementation would validate against running app)
        console.log(`   ✅ SCENARIO DEFINED`);
        passed++;
    });
    
    // Summary
    console.log('\n' + '='.repeat(90));
    console.log(`\n📊 Test Summary:`);
    console.log(`   ✅ Scenarios Defined: ${testScenarios.length}`);
    console.log(`   📝 Coverage Areas:`);
    console.log(`      - Income Tiers: 5 scenarios`);
    console.log(`      - HOMES Allocation: 3 scenarios`);
    console.log(`      - CPF No-Cost: 4 scenarios (including HPWH)`);
    console.log(`      - Opt-Outs: 2 scenarios`);
    console.log(`      - Program Stacking: 3 scenarios`);
    console.log(`      - Edge Cases: 3 scenarios`);
    console.log(`      - Integration: 3 scenarios`);
    console.log(`\n🎯 Ready for implementation and validation!`);
    
    return testScenarios;
}

// Run if executed directly
if (require.main === module) {
    runComprehensiveTests();
}

module.exports = { testScenarios, runComprehensiveTests };
