# Testing Guide - Oregon Energy Assessment Tool v1.2

**Version:** 1.2  
**Last Updated:** November 2025  
**Purpose:** Comprehensive testing procedures for v1.2 features

---

## Test Suite Overview

### Automated Tests

**1. Eligibility Validation Tests**
- **File:** `tests/eligibility-validation.test.js`
- **Scenarios:** 8 income threshold edge cases
- **Runtime:** ~1 second
- **Status:** 8/8 PASSING ✅

**2. Comprehensive Scenario Tests**
- **File:** `tests/comprehensive-scenarios.test.js`
- **Scenarios:** 20 end-to-end validation cases
- **Runtime:** ~2 seconds
- **Status:** 20/20 SCENARIOS DEFINED ✅

### Running Automated Tests

```bash
# Navigate to project directory
cd /Users/isaiah/oregon-comprehensive-energy-app

# Run eligibility validation
node tests/eligibility-validation.test.js

# Run comprehensive scenarios
node tests/comprehensive-scenarios.test.js

# Run both
npm test  # If configured in package.json
```

---

## Manual Testing Procedures

### 🔥 Critical Test: Heat Pump Water Heater No-Cost

**Objective:** Verify HPWH achieves $0 net cost with no-cost toggle enabled

**Steps:**
1. Open `index.html` in browser
2. **Income Entry:**
   - County: Any county
   - Household size: 4
   - Annual income: Enter amount for ~70% AMI (e.g., $62,000 for Multnomah)
3. **Priority Flags:**
   - ✅ Check "Priority Community"
   - ✅ Check "Working with CBO Partner"
4. **Measure Selection:**
   - Select ONLY "Heat Pump Water Heater"
5. **Toggle Settings:**
   - ✅ Check "No-Cost Eligible"
   - ❌ Leave "Opt Out of HOMES" unchecked
6. **Review Results Section**

**Expected Results:**
```
Heat Pump Water Heater
├── Estimated Cost: ~$2,500
├── HEAR Rebate: $1,750
├── CPF Enhanced: $825 (or similar, 110% of gap)
├── Energy Trust Standard: $240
└── Your Net Cost: $0.00 ✅
```

**Validation Checklist:**
- [ ] Net cost displays as $0.00
- [ ] CPF amount is significantly higher than standard $240
- [ ] HEAR incentive shows $1,750
- [ ] No error messages in console
- [ ] Totals section includes enhanced CPF in rollup

**If Test Fails:**
- Check if HPWH is included in no-cost eligible measures list
- Verify CPF calculation applies 110% multiplier
- Confirm toggle state is properly read
- Check browser console for JavaScript errors

---

### 🏠 HOMES Allocation Test

**Objective:** Verify HOMES allocates up to $10,000 across eligible measures with proper priority

**Steps:**
1. Open `index.html` in browser
2. **Income Entry:**
   - County: Multnomah
   - Household size: 3
   - Annual income: $65,000 (~75% AMI)
3. **Priority Flags:**
   - ✅ Priority Community
   - ✅ CBO Partner
4. **Measure Selection (select ALL):**
   - Health/Safety Repairs
   - Attic Insulation
   - Wall Insulation
   - Air Sealing
   - Window Replacement
5. **Toggle Settings:**
   - ✅ No-Cost Eligible
   - ❌ Opt Out of HOMES (leave unchecked)

**Expected Results:**

**Priority Order:**
1. Health/Safety - Gets HOMES first (highest priority)
2. Windows - Gets HOMES (not HEAR eligible)
3. Air Sealing - Gets HOMES if budget remains
4. Attic/Wall - Get HEAR + CPF (no HOMES due to anti-stacking)

**HOMES Total:** Should not exceed $10,000

**Validation Checklist:**
- [ ] Total HOMES allocation ≤ $10,000
- [ ] Health/Safety receives HOMES if selected
- [ ] Measures with HEAR do NOT show HOMES
- [ ] Windows (non-HEAR) receive HOMES
- [ ] Program benefits rollup shows accurate HOMES total
- [ ] No single measure shows both HEAR + HOMES

---

### 🔄 Toggle Interaction Test

**Objective:** Verify real-time recalculation when toggles change

**Steps:**
1. Open `index.html` in browser
2. **Setup:**
   - Enter 70% AMI customer profile
   - Select: Attic Insulation, HPWH
   - ✅ Check "No-Cost Eligible"
   - ❌ Leave "Opt Out of HOMES" unchecked
3. **Record Initial Values:**
   - Note net costs for both measures
   - Note CPF amounts
   - Note total incentives
4. **Toggle Test Sequence:**

**Sequence 1: Disable No-Cost**
- ❌ Uncheck "No-Cost Eligible"
- Observe changes

**Expected:**
- CPF amounts drop to standard levels
- Net costs increase (no longer $0)
- Totals update instantly
- No page reload required

**Sequence 2: Opt Out HOMES**
- ✅ Re-enable "No-Cost Eligible"
- ✅ Check "Opt Out of HOMES"
- Observe changes

**Expected:**
- HOMES incentives removed from all measures
- HEAR and CPF remain
- Net costs may increase slightly
- Rollup no longer shows HOMES program

**Sequence 3: Both Toggles Off**
- ❌ Uncheck "No-Cost Eligible"
- ❌ Uncheck "Opt Out of HOMES"
- Observe changes

**Expected:**
- Standard incentive amounts only
- HOMES re-appears
- Higher net costs
- All values reflect baseline scenario

**Validation Checklist:**
- [ ] All changes happen instantly (no lag)
- [ ] No stale values persist
- [ ] Totals accurately reflect toggle states
- [ ] No JavaScript errors in console
- [ ] Page remains responsive
- [ ] All measure cards update simultaneously

---

### 📊 Program Stacking Test

**Objective:** Verify correct stacking of HEAR, CPF, CERTA, HOMES

**Test Case: Attic Insulation (HEAR + CPF + CERTA)**

**Steps:**
1. Setup 70% AMI customer with priority + CBO
2. Select only "Attic Insulation"
3. Enable no-cost

**Expected Stacking:**
```
Attic Insulation
├── HEAR: $1,600
├── CPF Enhanced: (varies, fills gap)
├── CERTA: Up to $2,000
├── HOMES: $0 (excluded due to HEAR)
└── Net Cost: $0.00
```

**Validation:**
- [ ] HEAR present (≤80% AMI qualifies)
- [ ] CPF fills remaining gap
- [ ] CERTA appears (enabling repair)
- [ ] HOMES absent (anti-stacking rule)
- [ ] Net cost = $0

**Test Case: Window Replacement (HOMES + CPF + CERTA)**

**Steps:**
1. Same customer profile
2. Select only "Window Replacement"
3. Enable no-cost

**Expected Stacking:**
```
Window Replacement
├── HEAR: $0 (not HEAR eligible)
├── CPF Enhanced: (varies)
├── CERTA: $0 (windows not CERTA eligible)
├── HOMES: $X,XXX (allocated from $10K budget)
└── Net Cost: Varies
```

**Validation:**
- [ ] No HEAR (windows excluded)
- [ ] HOMES present (no conflict)
- [ ] CPF fills gap
- [ ] Appropriate net cost displayed

---

### 🏭 Manufactured Home Test

**Objective:** Verify higher CPF amounts for manufactured homes

**Steps:**
1. Open `index.html`
2. **Income Entry:**
   - 70% AMI customer
   - Priority + CBO
3. **Housing Type:**
   - Select "Manufactured Home"
4. **Measure Selection:**
   - Heat Pump Ductless

**Expected Results:**
```
Heat Pump Ductless (Manufactured Home)
├── CPF Standard: $3,500 (vs $1,800 for site-built)
└── CPF Enhanced: Higher gap-fill if no-cost enabled
```

**Validation:**
- [ ] CPF amount = $3,500 (not $1,800)
- [ ] Enhanced CPF uses manufactured home base if no-cost enabled
- [ ] All other incentives stack correctly

---

### 🚫 Opt-Out Behavior Test

**Objective:** Verify federal opt-out excludes correct programs

**Steps:**
1. Open `index.html`
2. **Income Entry:**
   - 55% AMI customer (weatherization tier)
3. **Opt-Out Selection:**
   - ✅ Check "I do not want federal assistance"
4. **Measure Selection:**
   - Attic Insulation
   - Heat Pump Ductless

**Expected Results:**

**Programs Excluded:**
- ❌ Weatherization (federal)
- ❌ CPF (federal)
- ❌ HEAR (federal)
- ❌ HOMES (federal)

**Programs Available:**
- ✅ Energy Trust Standard (state/utility)
- ✅ State/local programs only

**Validation:**
- [ ] No weatherization package shown
- [ ] No CPF amounts displayed
- [ ] No HEAR incentives
- [ ] No HOMES allocation
- [ ] Standard Energy Trust incentives present
- [ ] Appropriate messaging about opt-out

---

## Edge Case Testing

### CPF Tier 2 (81-150% AMI + Priority + CBO)

**Setup:**
- 100% AMI
- ✅ Priority Community
- ✅ CBO Partner

**Expected:**
- ✅ CPF eligible (Tier 2)
- ❌ HEAR NOT available (>80% AMI)
- ❌ HOMES NOT available (Tier 2 exclusion)

**Validation:**
- [ ] CPF incentives display correctly
- [ ] No HEAR incentives shown
- [ ] No HOMES allocation
- [ ] Appropriate tier messaging

### Income Boundary Tests

**Test at these exact AMI thresholds:**
- **60% AMI** - Weatherization boundary
- **80% AMI** - CPF/HEAR cutoff
- **81% AMI** - Just above CPF
- **150% AMI** - HEAR moderate cutoff
- **151% AMI** - Standard only

**For each threshold:**
1. Enter income that results in exact percentage
2. Toggle priority/CBO flags
3. Verify correct program eligibility
4. Document any edge cases

---

## Browser Compatibility Testing

**Test in these browsers:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**For each browser, verify:**
- Calculations correct
- Toggles function properly
- Layout displays correctly
- No console errors
- Performance acceptable

---

## Performance Testing

### Load Time Test

**Procedure:**
1. Clear browser cache
2. Open browser DevTools (Network tab)
3. Load `index.html`
4. Record metrics

**Acceptance Criteria:**
- [ ] Initial page load < 2 seconds
- [ ] No excessive file sizes
- [ ] No 404 errors
- [ ] No CDN failures

### Calculation Performance

**Procedure:**
1. Select all measures (worst case)
2. Toggle no-cost checkbox
3. Measure response time

**Acceptance Criteria:**
- [ ] Recalculation completes < 100ms
- [ ] No visible lag
- [ ] No browser freeze
- [ ] Smooth animation/transition

---

## Regression Testing

**Before any code changes, verify:**

### Baseline Functionality
- [ ] Income calculation works
- [ ] All measures display correctly
- [ ] Program eligibility logic correct
- [ ] Contact information accurate

### v1.1 Features (Should Still Work)
- [ ] CPF threshold at 80% AMI
- [ ] HEAR includes ≤80% AMI (all tiers)
- [ ] Data freshness indicators display
- [ ] Source references intact

### v1.2 Features (New)
- [ ] HOMES allocation functioning
- [ ] No-cost toggle working
- [ ] HPWH no-cost eligible
- [ ] HOMES opt-out functioning
- [ ] Real-time recalculation

---

## Bug Reporting Template

If you find an issue during testing:

```markdown
## Bug Report

**Date:** [Date found]
**Tester:** [Your name]
**Test Case:** [Which test were you running?]

### Environment
- **Browser:** [Browser name + version]
- **OS:** [Operating system]
- **Screen Size:** [Desktop/tablet/mobile]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Result
[What should have happened]

### Actual Result
[What actually happened]

### Screenshot/Error Message
[Attach screenshot or paste error message]

### Severity
- [ ] Critical - Blocks core functionality
- [ ] High - Major feature broken
- [ ] Medium - Feature partially broken
- [ ] Low - Minor issue/cosmetic

### Additional Notes
[Any other relevant information]
```

---

## Test Sign-Off Checklist

**v1.2 Release Testing**

### Automated Tests
- [ ] Eligibility validation: 8/8 passing
- [ ] Comprehensive scenarios: 20/20 defined

### Critical Manual Tests
- [ ] HPWH no-cost test (Scenario 9)
- [ ] HOMES allocation test (Scenarios 4-6)
- [ ] Toggle interaction test (Scenario 19)
- [ ] Program stacking validation

### Edge Cases
- [ ] Manufactured home CPF
- [ ] CPF Tier 2 eligibility
- [ ] Federal opt-out behavior
- [ ] Income boundary thresholds

### Browser Compatibility
- [ ] Chrome ✅
- [ ] Firefox ✅
- [ ] Safari ✅
- [ ] Edge ✅
- [ ] Mobile browsers ✅

### Performance
- [ ] Page load < 2s
- [ ] Calculations < 100ms
- [ ] No memory leaks
- [ ] No console errors

### Documentation
- [ ] Test README updated
- [ ] IMPLEMENTATION_SUMMARY updated
- [ ] DATA_SOURCES updated
- [ ] TESTING_GUIDE complete

---

## Test Maintenance

### When to Re-Run Tests

**After code changes:**
- Re-run affected test scenarios
- Run full regression suite for major changes

**Before releases:**
- Run complete automated test suite
- Execute all critical manual tests
- Verify in multiple browsers

**Quarterly reviews:**
- Validate income data still current
- Check program rules haven't changed
- Update test scenarios if needed

### Updating Test Scenarios

When program rules change:

1. Update test scenario expected values
2. Document change in test comments
3. Update DATA_SOURCES.md
4. Re-validate all affected tests
5. Update this TESTING_GUIDE if procedures change

---

## Support & Contact

**For testing questions:**
- Review test documentation in `tests/README.md`
- Check IMPLEMENTATION_SUMMARY for feature details
- Consult DATA_SOURCES for program rules

**For bug reports:**
- Use template above
- Include browser console logs
- Attach screenshots when relevant

---

**Document Version:** 1.2  
**Last Updated:** November 2025  
**Maintained By:** Project contributors
