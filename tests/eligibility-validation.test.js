/**
 * Eligibility Validation Tests
 * Tests edge cases for income thresholds and program eligibility
 * Run with: node tests/eligibility-validation.test.js
 */

// Mock data for testing
const testScenarios = [
    // Edge Case 1: 60% AMI (Weatherization boundary)
    {
        name: "60% AMI - Weatherization Eligible",
        ami: 60,
        smi: 60,
        fpl: 195,
        isPriorityCommunity: true,
        workingWithCBO: false,
        optOutFederal: false,
        expected: {
            weatherization: true,
            cpfEligible: true,  // ≤80% AMI + priority
            hearLowIncome: true,  // ≤80% AMI
            hearModerate: false,
            energyTrust: true
        }
    },
    
    // Edge Case 2: 80% AMI (CPF/HEAR boundary)
    {
        name: "80% AMI - CPF/HEAR Cutoff",
        ami: 80,
        smi: 80,
        fpl: 250,
        isPriorityCommunity: true,
        workingWithCBO: false,
        optOutFederal: false,
        expected: {
            weatherization: false,  // >60% SMI
            cpfEligible: true,  // ≤80% AMI + priority
            hearLowIncome: true,  // ≤80% AMI
            hearModerate: false,
            energyTrust: true
        }
    },
    
    // Edge Case 3: 81% AMI with BOTH priority AND CBO (NEW: CPF eligible 81-150%)
    {
        name: "81% AMI - CPF Eligible with Priority AND CBO",
        ami: 81,
        smi: 81,
        fpl: 260,
        isPriorityCommunity: true,
        workingWithCBO: true,
        optOutFederal: false,
        expected: {
            weatherization: false,
            cpfEligible: true,  // 81-150% AMI with BOTH priority AND CBO
            hearLowIncome: false,  // >80% AMI (NOT eligible for federal unless opt-out)
            hearModerate: false,  // >80% CPF customers NOT eligible for federal HEAR
            energyTrust: false  // >80% AMI
        }
    },
    
    // Edge Case 4: 150% AMI (HEAR moderate boundary)
    {
        name: "150% AMI - HEAR Moderate Cutoff",
        ami: 150,
        smi: 150,
        fpl: 450,
        isPriorityCommunity: false,
        workingWithCBO: false,
        optOutFederal: false,
        expected: {
            weatherization: false,
            cpfEligible: false,  // >80% AMI
            hearLowIncome: false,
            hearModerate: true,  // ≤150% AMI
            homesEligible: true,  // ≤400% AMI
            energyTrust: false
        }
    },
    
    // Edge Case 5: 151% AMI (Above HEAR moderate)
    {
        name: "151% AMI - Standard Programs Only",
        ami: 151,
        smi: 151,
        fpl: 460,
        isPriorityCommunity: false,
        workingWithCBO: false,
        optOutFederal: false,
        expected: {
            weatherization: false,
            cpfEligible: false,
            hearLowIncome: false,
            hearModerate: false,  // >150% AMI
            homesEligible: true,  // ≤400% AMI
            standardPrograms: true
        }
    },
    
    // Edge Case 6: CPF without priority community
    {
        name: "80% AMI - No Priority Community",
        ami: 80,
        smi: 80,
        fpl: 250,
        isPriorityCommunity: false,
        workingWithCBO: false,
        optOutFederal: false,
        expected: {
            cpfEligible: false,  // Requires priority OR CBO
            hearLowIncome: true,  // Just income requirement
            energyTrust: true
        }
    },
    
    // Edge Case 6b: 100% AMI with only priority (NOT CPF, but HEAR eligible)
    {
        name: "100% AMI - Priority Only (HEAR eligible, no CPF)",
        ami: 100,
        smi: 100,
        fpl: 300,
        isPriorityCommunity: true,
        workingWithCBO: false,
        optOutFederal: false,
        expected: {
            cpfEligible: false,  // Requires BOTH priority AND CBO for 81-150%
            hearModerate: true,  // Eligible since NOT in CPF Tier 2
            homesEligible: true,  // Eligible since NOT in CPF Tier 2
            energyTrust: false
        }
    },
    
    // Edge Case 6c: 100% AMI with only CBO (NOT CPF, but HEAR eligible)
    {
        name: "100% AMI - CBO Only (HEAR eligible, no CPF)",
        ami: 100,
        smi: 100,
        fpl: 300,
        isPriorityCommunity: false,
        workingWithCBO: true,
        optOutFederal: false,
        expected: {
            cpfEligible: false,  // Requires BOTH priority AND CBO for 81-150%
            hearModerate: true,  // Eligible since NOT in CPF Tier 2
            homesEligible: true,  // Eligible since NOT in CPF Tier 2
            energyTrust: false
        }
    },
    
    // Edge Case 7: Federal opt-out
    {
        name: "60% AMI - Federal Opt-Out",
        ami: 60,
        smi: 60,
        fpl: 195,
        isPriorityCommunity: true,
        workingWithCBO: true,
        optOutFederal: true,
        expected: {
            weatherization: false,  // Filtered by opt-out
            cpfEligible: false,  // Filtered by opt-out
            hearLowIncome: false,  // Filtered by opt-out
            energyTrust: true,  // NOT federal, still available
            liheap: false  // Filtered by opt-out
        }
    },
    
    // Edge Case 8: Weatherization via FPL (200% FPL boundary)
    {
        name: "200% FPL - Weatherization via FPL",
        ami: 85,
        smi: 55,  // Below 60% SMI
        fpl: 200,
        isPriorityCommunity: false,
        workingWithCBO: false,
        optOutFederal: false,
        expected: {
            weatherization: true,  // ≤200% FPL qualifies
            cpfEligible: false,  // >80% AMI + no priority
            hearLowIncome: false,  // >80% AMI
            hearModerate: true  // 81-150% AMI
        }
    }
];

// Test function to validate eligibility logic
function testEligibility(scenario) {
    const { ami, smi, fpl, isPriorityCommunity, workingWithCBO, optOutFederal } = scenario;
    
    // Replicate the eligibility logic from index.html
    const eligibility = {
        liheap: !optOutFederal && fpl <= 150,
        weatherization: !optOutFederal && (smi <= 60 || fpl <= 200),
        
        // NEW CPF rules:
        // Tier 1: ≤80% AMI + (priority OR CBO)
        // Tier 2: 81-150% AMI + (priority AND CBO)
        cpfEligible: !optOutFederal && (
            (ami <= 80 && (isPriorityCommunity || workingWithCBO)) ||
            (ami > 80 && ami <= 150 && isPriorityCommunity && workingWithCBO)
        ),
        
        energyTrust: ami <= 80,
        lowIncomeHousing: ami <= 80,
        firstTimeHomebuyer: ami <= 120,
        
        // HEAR NOT available to >80% AMI CPF customers (they chose CPF over federal)
        hearLowIncome: !optOutFederal && ami <= 80,
        hearModerate: !optOutFederal && ami > 80 && ami <= 150 && !(ami > 80 && isPriorityCommunity && workingWithCBO),
        hearWeatherization: !optOutFederal && (smi <= 60 || fpl <= 200),
        
        // HOMES NOT available to >80% AMI CPF customers
        homesEligible: !optOutFederal && ami <= 400 && !(ami > 80 && ami <= 150 && isPriorityCommunity && workingWithCBO),
        homesWeatherization: !optOutFederal && (smi <= 60 || fpl <= 200),
        
        standardPrograms: ami > 150,
        isPriorityCommunity: isPriorityCommunity,
        workingWithCBO: workingWithCBO,
        optOutFederalPrograms: optOutFederal
    };
    
    return eligibility;
}

// Run tests
function runTests() {
    console.log('🧪 Running Eligibility Validation Tests\n');
    console.log('=' .repeat(80));
    
    let passed = 0;
    let failed = 0;
    const failures = [];
    
    testScenarios.forEach(scenario => {
        console.log(`\n📋 Test: ${scenario.name}`);
        console.log(`   AMI: ${scenario.ami}% | SMI: ${scenario.smi}% | FPL: ${scenario.fpl}%`);
        console.log(`   Priority: ${scenario.isPriorityCommunity} | CBO: ${scenario.workingWithCBO} | Opt-Out: ${scenario.optOutFederal}`);
        
        const result = testEligibility(scenario);
        let testPassed = true;
        
        // Check each expected value
        Object.keys(scenario.expected).forEach(key => {
            const expected = scenario.expected[key];
            const actual = result[key];
            
            if (expected !== actual) {
                testPassed = false;
                console.log(`   ❌ ${key}: Expected ${expected}, got ${actual}`);
                failures.push({
                    test: scenario.name,
                    field: key,
                    expected,
                    actual
                });
            }
        });
        
        if (testPassed) {
            console.log('   ✅ PASSED');
            passed++;
        } else {
            console.log('   ❌ FAILED');
            failed++;
        }
    });
    
    // Summary
    console.log('\n' + '='.repeat(80));
    console.log(`\n📊 Test Summary:`);
    console.log(`   ✅ Passed: ${passed}/${testScenarios.length}`);
    console.log(`   ❌ Failed: ${failed}/${testScenarios.length}`);
    
    if (failures.length > 0) {
        console.log(`\n❌ Failed Assertions:`);
        failures.forEach(f => {
            console.log(`   ${f.test} → ${f.field}: Expected ${f.expected}, got ${f.actual}`);
        });
        process.exit(1);
    } else {
        console.log(`\n🎉 All tests passed!`);
        process.exit(0);
    }
}

// Run if executed directly
if (require.main === module) {
    runTests();
}

module.exports = { testEligibility, testScenarios };
