# Funding Rules Configuration

## Current Status (v1.2)

### Program Caps

Program-level caps are currently defined in **two locations**:

1. **Source Code** (`src/incentive_rules.js` lines 41-48):
   ```javascript
   this.programCaps = {
       HEAR_LOW_INCOME: 14000,      // $14,000 household cap (≤80% or ≤150% FPL)
       HEAR_MODERATE: 14000,         // $14,000 household cap (81-150% AMI)
       HOMES_MIN: 2000,              // $2,000 minimum HOMES rebate
       HOMES_MAX: 8000,              // $8,000 maximum HOMES rebate (whole-home modeled savings)
       HOMES_FLEX_MAX: 10000,        // $10,000 HOMES flex funding for non-HEAR measures
       CERTA_MAX: 2000               // $2,000 CERTA cap for enabling repairs
   };
   ```

2. **Config File** (`config/incentive_eligibility_map.json` lines 46-57):
   ```json
   "max_per_household": 14000,
   "rebate_range": "2000-8000"
   ```

### Income Tier Thresholds

Income tier thresholds are defined in **source code** (`src/incentive_rules.js` lines 57-76):
- Weatherization: ≤60% SMI OR ≤200% FPL
- CPF Low Income: 60-80% AMI
- HEAR Moderate: 81-150% AMI
- Standard: >150% AMI

These thresholds are also documented in `config/incentive_eligibility_map.json` but not dynamically loaded.

### Measure-Specific Amounts

Measure-specific incentive amounts are defined in **source code** (`src/incentive_rules.js` lines 435+):
- Heat pump amounts (CPF, HEAR, Standard)
- Insulation per-sqft rates
- Fixed amounts for various measures

These amounts are also documented in `config/incentive_eligibility_map.json`.

---

## Recommendation: Config-Driven Architecture

### Benefits of Loading from Config Files

1. **Easy Updates**: Change program rules without modifying code
2. **Version Control**: Track program changes year-over-year
3. **Multi-Jurisdiction**: Support different rules for different regions
4. **Audit Trail**: Clear documentation of rule changes
5. **Non-Technical Updates**: Program administrators can update values

### Proposed Refactor (Future v2.0)

Create a unified `config/program_rules.json`:

```json
{
  "version": "2025.1",
  "effective_date": "2025-01-01",
  "last_updated": "2025-10-29",
  
  "income_thresholds": {
    "weatherization_smi": 60,
    "weatherization_fpl": 200,
    "cpf_tier1_max_ami": 80,
    "cpf_tier2_min_ami": 81,
    "cpf_tier2_max_ami": 150,
    "hear_low_income_max_ami": 80,
    "hear_moderate_min_ami": 81,
    "hear_moderate_max_ami": 150,
    "homes_max_ami": 150
  },
  
  "program_caps": {
    "hear_household_cap": 14000,
    "homes_flex_site_cap": 10000,
    "homes_modeled_min": 2000,
    "homes_modeled_max": 8000,
    "certa_household_cap": 2000
  },
  
  "homes_coverage_by_income": {
    "low_income": {
      "ami_max": 80,
      "coverage_percent": 100
    },
    "moderate_income": {
      "ami_min": 81,
      "ami_max": 150,
      "coverage_percent": 50
    }
  },
  
  "measure_incentives": {
    "heat_pump_ductless": {
      "cpf_single_family": 1800,
      "cpf_manufactured": 3500,
      "hear_low_income": 8000,
      "hear_moderate": 4000,
      "standard": 800
    }
    // ... more measures
  }
}
```

Then update `IncentiveRules` constructor to load from config:

```javascript
constructor(configPath = '../config/program_rules.json') {
    const config = this.loadConfig(configPath);
    this.programCaps = config.program_caps;
    this.incomeThresholds = config.income_thresholds;
    this.measureRules = config.measure_incentives;
    // ...
}
```

---

## Current Testing

All tests pass with current hardcoded values:

- **Eligibility Validation**: 10/10 tests passing ✅
- **Comprehensive Scenarios**: 20/20 scenarios defined ✅

Tests verify:
- HOMES ≤150% AMI eligibility
- HOMES 100% coverage for ≤80% AMI
- HOMES 50% coverage for 81-150% AMI
- HEAR household caps
- CPF tier eligibility
- Program stacking rules

---

## Maintenance Notes

### When Program Rules Change:

**Current Process (v1.2)**:
1. Update values in `src/incentive_rules.js`
2. Update documentation in `config/incentive_eligibility_map.json`
3. Update test expectations if thresholds change
4. Run test suite to verify
5. Update visualization data if needed

**Future Process (v2.0)**:
1. Update `config/program_rules.json`
2. Run test suite to verify
3. Documentation auto-generated from config

---

## Version History

- **v1.2 (2025-10-29)**: Corrected HOMES eligibility (≤150% AMI only), added 50% moderate income constraint
- **v1.1 (2025-10-28)**: Added CPF Tier 2, no-cost enhancement, HOMES dynamic allocation
- **v1.0 (2025-10-27)**: Initial release with hardcoded program rules

---

**Recommendation**: Consider config-driven architecture for v2.0 to improve maintainability and allow non-technical updates to program rules.
