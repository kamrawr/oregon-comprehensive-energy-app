# Config-Driven Architecture Documentation

## Overview

The Oregon Energy Assessment Tool now uses a **config-driven architecture** where all program rules, thresholds, caps, and measure incentives are loaded from a centralized JSON configuration file. This makes the system more maintainable, testable, and easier to update when program rules change.

## Architecture Components

### 1. Configuration File (`config/program_rules.json`)

The single source of truth for all program rules and parameters.

**Sections:**
- `version`: Configuration version tracking
- `income_thresholds`: All AMI/SMI/FPL eligibility cutoffs
- `program_caps`: HEAR, HOMES, and CERTA household/site caps
- `homes_coverage_rules`: HOMES coverage percentages by income tier
- `measure_incentives`: All measure-specific incentive amounts and rules
- `certa_eligible_measures`: List of measures eligible for CERTA
- `no_cost_eligible_measures`: Measures that can achieve no-cost for eligible customers
- `homes_allocation_priority`: Priority order for HOMES fund allocation

### 2. Configuration Loader (`src/config_loader.js`)

Loads and validates the configuration file.

**Key Methods:**
- `loadConfig()`: Async loading (for browser environments)
- `loadConfigSync()`: Synchronous loading (for Node.js/tests)
- `validateConfig()`: Ensures all required fields are present
- `getIncomeThresholds()`, `getProgramCaps()`, etc.: Getter methods for specific sections

**Features:**
- Works in both browser (fetch) and Node.js (fs) environments
- Built-in validation to catch configuration errors early
- Caches config after first load for performance

### 3. Incentive Rules Engine (`src/incentive_rules.js`)

The main business logic engine, now fully config-driven.

**Constructor:**
- Loads configuration on initialization (synchronously for Node.js compatibility)
- Falls back to hardcoded defaults if config loading fails
- Populates internal state from config:
  - `this.incomeThresholds`
  - `this.programCaps`
  - `this.homesCoverageRules`
  - `this.measureIncentives`
  - `this.certaEligibleMeasures`
  - `this.homesAllocationPriority`

**Key Methods Now Using Config:**
- `getEligibilityTier()`: Uses `incomeThresholds` for tier determination
- `isCERTAEligible()`: Uses `certaEligibleMeasures` list
- `getMeasureRules()`: Returns `measureIncentives` from config
- `applyHOMESAllocation()`: Uses `homesAllocationPriority` for fund allocation

## Benefits of Config-Driven Architecture

### 1. **Maintainability**
- All program rules in one place
- No need to search through code to find hardcoded values
- Easy to see the complete picture of all program parameters

### 2. **Flexibility**
- Update program rules without modifying code
- Quick adjustments to thresholds and caps
- Version tracking built into config file

### 3. **Testing**
- Can create test-specific configurations
- Easier to test edge cases with custom config values
- Clear separation of data from logic

### 4. **Auditing**
- Configuration changes tracked in version control
- Easy to see what changed between versions
- Can compare different program rule versions

### 5. **Documentation**
- Config file serves as executable documentation
- No discrepancy between docs and implementation
- Easy for non-developers to understand program rules

## Usage Examples

### Loading Configuration

```javascript
const ConfigLoader = require('./config_loader');

// Async (browser)
const loader = new ConfigLoader();
const config = await loader.loadConfig();

// Sync (Node.js)
const config = loader.loadConfigSync();
```

### Using Configuration in IncentiveRules

```javascript
const IncentiveRules = require('./incentive_rules');

// Config automatically loaded in constructor
const rules = new IncentiveRules();

// All methods now use config values
const tier = rules.getEligibilityTier(70, 65, 210);
const isCERTA = rules.isCERTAEligible('attic_insulation');
```

### Accessing Specific Config Sections

```javascript
const loader = new ConfigLoader();
const config = loader.loadConfigSync();

// Income thresholds
const thresholds = loader.getIncomeThresholds();
console.log(thresholds.weatherization_smi_max); // 60

// Program caps
const caps = loader.getProgramCaps();
console.log(caps.hear_household_cap); // 14000

// HOMES coverage rules
const homesCoverage = loader.getHOMESCoverageRules();
console.log(homesCoverage.low_income.coverage_percent); // 100

// Measure incentives
const measures = loader.getMeasureIncentives();
console.log(measures.heat_pump_ductless.hear); // 8000
```

## Configuration File Structure

```json
{
  "version": "2.0.0",
  "effective_date": "2025-01-01",
  
  "income_thresholds": {
    "weatherization_smi_max": 60,
    "weatherization_fpl_max": 200,
    "cpf_tier1_ami_max": 80,
    "hear_moderate_ami_min": 81,
    "hear_moderate_ami_max": 150,
    "homes_ami_max": 150
  },
  
  "program_caps": {
    "hear_household_cap": 14000,
    "homes_flex_site_cap": 10000,
    "certa_household_cap": 2000
  },
  
  "measure_incentives": {
    "heat_pump_ductless": {
      "cpf": { "single_family": 1800, "manufactured": 3500 },
      "hear": 8000,
      "standard": 800,
      "homes_eligible": true
    }
  }
}
```

## Updating Program Rules

### Step 1: Edit Configuration
Update `config/program_rules.json` with new values:

```json
{
  "program_caps": {
    "hear_household_cap": 15000  // Updated from 14000
  }
}
```

### Step 2: Update Version
Increment the version number in the config file:

```json
{
  "version": "2.1.0",
  "last_updated": "2025-11-01"
}
```

### Step 3: Test Changes
Run tests to verify changes:

```bash
node tests/comprehensive-scenarios.test.js
node tests/eligibility-validation.test.js
```

### Step 4: Document Changes
Add notes in `FUNDING-PRIORITY-UPDATES.md` about what changed and why.

## Fallback Behavior

If config loading fails (e.g., file not found, invalid JSON), the system falls back to hardcoded defaults in `IncentiveRules` constructor:

```javascript
catch (error) {
    console.warn('⚠️  Config load failed, using fallback defaults:', error.message);
    // Uses hardcoded defaults...
}
```

This ensures the application remains functional even if config file is unavailable.

## Migration Path

The refactor maintains **backward compatibility**:

1. **Constructor**: Now loads config but maintains same internal structure
2. **Method Signatures**: All public methods unchanged
3. **Return Values**: Same data structures returned
4. **Tests**: All existing tests pass without modification

## Best Practices

### DO:
✅ Update config file for rule changes  
✅ Version your config changes  
✅ Test after every config update  
✅ Document significant changes  
✅ Use getter methods for config access  

### DON'T:
❌ Hardcode values in the rules engine  
❌ Modify config without version bump  
❌ Skip validation after config changes  
❌ Access config directly without loader  
❌ Make breaking changes to config structure  

## Future Enhancements

Potential improvements to the config architecture:

1. **Multi-environment Configs**: Dev, staging, production configs
2. **Remote Config Loading**: Load from API endpoint
3. **Config Validation Schema**: JSON Schema validation
4. **Hot Reloading**: Update config without restart
5. **Config History**: Track and rollback config changes
6. **A/B Testing**: Test different rule configurations

## Troubleshooting

### Config Not Loading
**Problem**: "Config load failed" warning  
**Solution**: Check file path in `ConfigLoader.configPath` and verify JSON syntax

### Tests Failing After Config Change
**Problem**: Tests fail after updating config  
**Solution**: Verify all required fields present, run validation

### Unexpected Behavior
**Problem**: Rules not working as expected  
**Solution**: Log `this.config` in constructor to verify loaded values

### Browser vs Node.js Issues
**Problem**: Works in Node.js but not browser  
**Solution**: Check fetch URL path, ensure config file served by web server

## Related Files

- `config/program_rules.json` - Configuration file
- `src/config_loader.js` - Configuration loader
- `src/incentive_rules.js` - Rules engine (config consumer)
- `tests/comprehensive-scenarios.test.js` - Integration tests
- `tests/eligibility-validation.test.js` - Validation tests
- `docs/CONFIG_ARCHITECTURE.md` - This file

## Copyright

© 2025 Isaiah Kamrar / Community Consulting Partners LLC  
All Rights Reserved. Proprietary Software.  
See LICENSE.md for terms and conditions.
