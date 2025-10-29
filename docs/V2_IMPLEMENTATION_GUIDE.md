# v2.0 Config-Driven Architecture - Implementation Guide

## Status: PARTIAL IMPLEMENTATION

**Created:**
- ✅ `config/program_rules.json` - Unified configuration file
- ✅ `src/config_loader.js` - Configuration loader with validation

**Remaining Work:**
- ⏳ Refactor `src/incentive_rules.js` to load from config
- ⏳ Update `index.html` to include config_loader.js
- ⏳ Update tests to work with new structure
- ⏳ Verify all functionality

---

## Why This Matters for Production

**Current Issue:** Program rules are hardcoded in JavaScript source files. Any rule change requires:
1. Developer to modify source code
2. Testing to verify changes
3. Git commit/push
4. Potential for bugs if thresholds aren't updated consistently

**v2.0 Solution:** All rules in JSON config file. Changes require:
1. Edit JSON file (no code changes)
2. Test with existing test suite
3. Deploy (config file automatically loaded)
4. No code modification = lower risk

---

## Implementation Steps

### Step 1: Update IncentiveRules Constructor

**Current (v1.2):**
```javascript
class IncentiveRules {
    constructor() {
        this.programCaps = {
            HEAR_LOW_INCOME: 14000,
            // ... hardcoded values
        };
    }
}
```

**Target (v2.0):**
```javascript
class IncentiveRules {
    constructor(config = null) {
        // Load config if not provided
        if (!config) {
            const loader = new ConfigLoader();
            config = loader.loadConfigSync(); // Sync for now
        }
        
        // Store config
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
    }
}
```

### Step 2: Update getEligibilityTier Method

**Target (v2.0):**
```javascript
getEligibilityTier(amiPercent, smiPercent, fplPercent) {
    const t = this.incomeThresholds;
    
    // Weatherization
    if (smiPercent <= t.weatherization_smi_max || fplPercent <= t.weatherization_fpl_max) {
        return this.tiers.WEATHERIZATION;
    }
    
    // CPF Low Income
    if (amiPercent > t.cpf_tier1_ami_min && amiPercent <= t.cpf_tier1_ami_max) {
        return this.tiers.CPF_LOW_INCOME;
    }
    
    // HEAR Moderate
    if (amiPercent >= t.hear_moderate_ami_min && amiPercent <= t.hear_moderate_ami_max) {
        return this.tiers.HEAR_MODERATE;
    }
    
    // Standard
    return this.tiers.STANDARD;
}
```

### Step 3: Update getMeasureRules Method

**Target (v2.0):**
```javascript
getMeasureRules() {
    return this.config.measure_incentives;
}
```

### Step 4: Update isCERTAEligible Method

**Target (v2.0):**
```javascript
isCERTAEligible(measureId) {
    return this.config.certa_eligible_measures.includes(measureId);
}
```

### Step 5: Update HOMES Allocation Priority

**In applyHOMESAllocation method:**
```javascript
applyHOMESAllocation(enrichedRecommendations, customerTier = null) {
    // ...
    const priorityOrder = this.config.homes_allocation_priority;
    // ... rest of method
}
```

### Step 6: Update HTML to Load Config

**Add to index.html after other script tags:**
```html
<script src="src/config_loader.js"></script>
```

**Order matters:**
1. config_loader.js
2. income_data_loader.js
3. data_loader.js
4. incentive_rules.js (now depends on ConfigLoader)
5. incentive_calculator.js
6. report_generator.js

### Step 7: Update Tests

**Tests need to load config:**
```javascript
const ConfigLoader = require('../src/config_loader');
const IncentiveRules = require('../src/incentive_rules');

// Load config once
const loader = new ConfigLoader();
const config = loader.loadConfigSync();

// Use in tests
const incentiveRules = new IncentiveRules(config);
```

---

## Benefits Summary

### Maintainability
- ✅ Non-developers can update program rules
- ✅ Clear separation of rules from logic
- ✅ Single source of truth for all rules

### Flexibility  
- ✅ Support multiple jurisdictions (future)
- ✅ A/B testing of different rule sets
- ✅ Easy rollback if rules change

### Audit Trail
- ✅ Git history shows exact rule changes
- ✅ Version control on config file
- ✅ Documentation embedded in JSON

### Testing
- ✅ Can test with different config files
- ✅ Validate config structure
- ✅ Mock configs for unit tests

---

## Migration Checklist

- [x] Create `config/program_rules.json`
- [x] Create `src/config_loader.js`
- [ ] Update `src/incentive_rules.js` constructor
- [ ] Update `src/incentive_rules.js` methods to use config
- [ ] Update `index.html` to include config_loader
- [ ] Update test files to load config
- [ ] Run eligibility validation tests (10 tests)
- [ ] Run comprehensive scenario tests (20 scenarios)
- [ ] Manual testing in browser
- [ ] Verify visualization page works
- [ ] Update documentation

---

## Rollback Plan

If v2.0 causes issues:

1. **Quick Fix:** Revert to previous commit
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Config Fix:** If just config is wrong, edit `program_rules.json`
   - No code deployment needed
   - Changes take effect immediately

3. **Hybrid Approach:** Keep both systems
   - Config loader with fallback to hardcoded values
   - Gradual migration measure by measure

---

## Production Readiness Criteria

Before deploying v2.0 to production:

- [ ] All 10 eligibility tests pass
- [ ] All 20 scenario tests pass
- [ ] Manual walkthrough of main app completes
- [ ] Demo data loads correctly
- [ ] Reports generate without errors
- [ ] Visualization page loads
- [ ] Config validation works (test with invalid config)
- [ ] Browser console shows no errors
- [ ] Performance is not degraded

---

## Estimated Effort

**Code Changes:**
- incentive_rules.js: ~100 lines to modify
- index.html: 1 line to add
- Tests: ~20 lines to modify

**Testing:**
- Automated: 5 minutes
- Manual: 15 minutes
- Total: ~2 hours with documentation

**Recommendation:**  
Given the scope, this should be done as a dedicated v2.0 release with thorough testing before production deployment.

---

## Alternative: Incremental Migration

If full v2.0 is too risky right now:

1. **Phase 1:** Add config loader, keep hardcoded fallbacks
2. **Phase 2:** Migrate income thresholds only
3. **Phase 3:** Migrate program caps
4. **Phase 4:** Migrate measure incentives
5. **Phase 5:** Remove hardcoded values

Each phase can be tested independently.

---

**Current Status:** Foundation laid, ready for implementation when production requirements align with available development time.
