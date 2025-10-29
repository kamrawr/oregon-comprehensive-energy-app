# Test Suite

## Test Files Overview

### 1. Eligibility Validation Tests
**File:** `eligibility-validation.test.js`  
**Purpose:** Validates income eligibility logic for all Oregon energy assistance programs.

### 2. Comprehensive Scenario Tests (v1.2)
**File:** `comprehensive-scenarios.test.js`  
**Purpose:** End-to-end validation of HOMES allocation, CPF no-cost coverage, HPWH eligibility, and all program stacking rules.

---

## Eligibility Validation Tests

### Purpose
Validates the income eligibility logic for all Oregon energy assistance programs against edge cases and boundary conditions.

### Running Tests

```bash
node tests/eligibility-validation.test.js
```

### Test Coverage

The test suite validates 8 critical edge cases:

1. **60% AMI** - Weatherization boundary (should qualify for weatherization, CPF, HEAR)
2. **80% AMI** - CPF/HEAR cutoff (last tier for CPF with priority)
3. **81% AMI** - Above CPF threshold (should NOT qualify for CPF)
4. **150% AMI** - HEAR moderate cutoff
5. **151% AMI** - Standard programs only
6. **80% AMI without priority** - CPF requires priority community OR CBO
7. **Federal opt-out** - Ensures federal programs filtered correctly
8. **200% FPL via SMI** - Weatherization qualification via FPL path

### What's Tested

- ✅ Weatherization eligibility (≤60% SMI OR ≤200% FPL)
- ✅ CPF eligibility (≤80% AMI + priority/CBO) **CORRECTED Oct 2025**
- ✅ HEAR low-income (≤80% AMI, includes weatherization tier) **CORRECTED Oct 2025**
- ✅ HEAR moderate (81-150% AMI)
- ✅ HOMES eligibility (≤400% AMI)
- ✅ Energy Trust income-qualified (≤80% AMI)
- ✅ Federal opt-out filtering
- ✅ Priority community requirements

### Expected Results

All tests should pass (8/8). If any tests fail, the eligibility logic in `index.html` may have been modified incorrectly.

### Adding New Tests

To add new edge case tests:

1. Add a new test scenario object to the `testScenarios` array
2. Include `name`, `ami`, `smi`, `fpl`, flags, and `expected` values
3. Run the test suite to validate

### Maintenance

Run these tests:
- After any changes to eligibility logic
- Before committing eligibility-related changes
- When updating income thresholds (annually)
- After program rule changes

### Test History

- **Oct 29, 2025** - Initial test suite created
  - Validates corrected CPF threshold (≤80% vs old <150%)
  - Validates corrected HEAR low-income (≤80% vs old >60% AND ≤80%)
  - All 8 tests passing

---

## Comprehensive Scenario Tests (v1.2)

### Purpose
Validates complex interactions between multiple programs, dynamic HOMES allocation, CPF no-cost coverage, heat pump water heater eligibility, and real-time recalculations.

### Running Tests

```bash
node tests/comprehensive-scenarios.test.js
```

### Test Coverage

**20 comprehensive scenarios across 7 categories:**

#### Income Tier Tests (3 scenarios)
1. **Weatherization Tier** - Full no-cost coverage at ≤60% AMI
2. **CPF Low Income** - Enhanced incentives at 60-80% AMI
3. **HEAR Moderate** - 50% rebates at 81-150% AMI

#### HOMES Allocation Tests (3 scenarios)
4. **Priority Allocation** - Health/safety first, then envelope measures
5. **$10K Cap Enforcement** - Maximum site cap validation
6. **HEAR/HOMES Anti-Stacking** - No overlap on same measures

#### CPF No-Cost Tests (4 scenarios)
7. **Insulation Enhanced** - 110% gap-filling for insulation
8. **Heat Pumps** - Enhanced CPF for space heating
9. **Heat Pump Water Heater** - 🔥 CRITICAL: HPWH no-cost eligibility
10. **No-Cost Toggle OFF** - Standard CPF amounts validation

#### Opt-Out Tests (2 scenarios)
11. **HOMES Opt-Out** - Falls back to CPF/HEAR only
12. **Federal Opt-Out** - Only state/utility programs available

#### Program Stacking Tests (3 scenarios)
13. **HEAR + CPF + CERTA** - Multi-program stacking
14. **HOMES + CPF + CERTA** - Alternative stacking pathway
15. **CERTA $2K Cap** - Household cap across measures

#### Edge Case Tests (3 scenarios)
16. **Manufactured Home** - Higher CPF amounts
17. **CPF Tier 2** - 81-150% AMI with priority + CBO
18. **Standard Amounts** - No-cost toggle OFF validation

#### Integration Tests (3 scenarios)
19. **Full House Retrofit** - All measures simultaneously
20. **Real-Time Recalculation** - Toggle interactions
21. **Program Benefits Rollup** - Accuracy of totals display

### Critical Test Cases

#### 🔥 Scenario 9: Heat Pump Water Heater No-Cost (MOST CRITICAL)
**Why Critical:** HPWHs were previously excluded from CPF no-cost eligibility, leaving customers with out-of-pocket costs even when qualifying for no-cost programs.

**Test Setup:**
- Customer: 70% AMI, priority community, CBO partner
- Measure: Heat pump water heater ($2,500 estimated cost)
- No-Cost Eligible: YES

**Expected Results:**
```javascript
{
  hasHEAR: true,
  hearAmount: 1750,
  hasCPF: true,
  cpfAmount_noCostON: 825,  // (2500 - 1750) * 1.1
  cpfAmount_noCostOFF: 240, // Standard CPF
  netCost_noCostON: 0,      // MUST be $0 with no-cost enabled
  netCost_noCostOFF: 510,   // 2500 - 1750 - 240
  cpfIsEnhanced: true,
  noCostEligible: true      // CRITICAL FLAG
}
```

**Impact if Failed:** Customers would face $500+ out-of-pocket costs for a measure that should be covered under no-cost programs.

### HOMES Allocation Logic Tests

#### Scenario 4: Priority-Based Allocation
Validates the five-tier priority system:
1. **Health/Safety** (highest priority)
2. **Attic Insulation**
3. **Wall Insulation**
4. **Air Sealing**
5. **Window Replacement** (lowest priority)

**Test validates:**
- HOMES allocated to measures without HEAR coverage first
- $10,000 site cap strictly enforced
- Lower-priority measures receive remaining budget
- No HOMES allocated where HEAR already covers measure

### HEAR/HOMES Anti-Stacking

**Rule:** If a measure receives HEAR incentive, it CANNOT receive HOMES on the same measure.

**Scenarios 6, 13:** Validate this exclusion logic across:
- Envelope measures (insulation, air sealing)
- Heating equipment (heat pumps)
- Non-HEAR measures (windows can still get HOMES)

### Real-Time Recalculation (Scenario 19)

**Tests four sequential states:**
1. No-Cost OFF, HOMES ON (baseline)
2. No-Cost ON, HOMES ON (enhanced CPF kicks in)
3. No-Cost ON, HOMES OFF (CPF without HOMES backing)
4. No-Cost OFF, HOMES OFF (standard only)

**Validates:**
- All totals recalculate instantly
- No stale values persist
- Program rollup updates correctly
- No JavaScript errors in console

### Expected Results

All 20 scenarios should produce defined expected outputs. The test framework currently **defines** the scenarios; full implementation validation requires integration with the live application.

**Test Output (Current):**
```
🧪 Running Comprehensive Scenario Tests for v1.2
================================================================================
📊 Test Summary:
   ✅ Scenarios Defined: 20
   📝 Coverage Areas:
      - Income Tiers: 3 scenarios
      - HOMES Allocation: 3 scenarios
      - CPF No-Cost: 4 scenarios (including HPWH)
      - Opt-Outs: 2 scenarios
      - Program Stacking: 3 scenarios
      - Edge Cases: 3 scenarios
      - Integration: 3 scenarios
🎯 Ready for implementation and validation!
```

### Adding New Scenarios

To add new comprehensive test scenarios:

1. Add a new scenario object to the `testScenarios` array in `comprehensive-scenarios.test.js`
2. Include all required fields:
   ```javascript
   {
     name: "Scenario N: Description",
     customer: { ami, smi, fpl, isPriority, hasCBO, optOutFederal, housingType },
     measures: ['measure_id_1', 'measure_id_2'],
     noCostEligible: true/false,
     optOutHOMES: true/false,
     measureCosts: { measure_id: cost }, // Optional
     expected: { /* expected results */ }
   }
   ```
3. Document the scenario's purpose and critical validation points
4. Run the test suite to ensure proper definition

### Maintenance

Run comprehensive tests:
- After any changes to HOMES allocation logic
- After modifying CPF no-cost calculation
- Before committing v1.2+ feature changes
- When updating measure eligibility rules
- After toggle interaction modifications

### Test History

- **Nov 2025** - Comprehensive scenario test suite created
  - 20 end-to-end scenarios covering v1.2 features
  - HOMES dynamic allocation with $10K cap
  - CPF no-cost for insulation and heat pumps
  - HPWH no-cost eligibility (critical addition)
  - HEAR/HOMES anti-stacking validation
  - Opt-out toggle behavior
  - Real-time recalculation testing
  - All scenarios defined and documented
