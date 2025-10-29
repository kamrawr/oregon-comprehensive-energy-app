# Test Suite

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
