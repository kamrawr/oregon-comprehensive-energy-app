# Funding Priority Strategy Updates

## Overview
Updated the incentive stacking logic to prioritize federal HEAR/HOMES funding first, then use CPF to fill gaps and achieve no-cost measures for eligible households.

## Key Changes

### 1. Incentive Ordering Priority
**Previous:** CPF listed first in incentive packages
**New:** HEAR/HOMES listed first (applied first), CPF fills gaps

**Rationale:**
- Maximize federal funding utilization
- CPF serves as gap funding to achieve no-cost measures
- CPF amounts may exceed remaining costs to provide customer assurance

### 2. Updated Files

#### `/src/incentive_rules.js`
- **Line 1-14:** Added documentation explaining funding priority strategy
- **Line 490:** Fixed bug where `getCPFAmount()` returned null for per-sqft insulation measures
  - Changed from: `if (!rules || !rules.cpf) return null;`
  - Changed to: `if (!rules || (!rules.cpf && !rules.cpf_per_sqft)) return null;`
- **Lines 173-257:** Reordered `buildCPFPackages()` to show HEAR/HOMES first
  - Package names updated to reflect priority: "HEAR + CPF Stack (No-Cost Path)"
  - Priority values: HEAR/HOMES = 1, CPF = 2, CERTA = 3
  - Added notes explaining gap-filling strategy
- **Lines 288-317:** Reordered `buildStandardPlusHEARPackages()` for consistency
- **Lines 320-341:** Reordered HOMES + Standard package

#### `/index.html`
- **Lines 2191-2194:** Added funding strategy explanation for CPF-eligible customers
  - Displays in the Priority Community Benefits panel
  - Explains federal $ first, CPF gap-fill strategy

## Impact on User Experience

### For CPF-Eligible Households (60-80% AMI):
- **Example - Attic Insulation (2,000 sqft, $6,000 cost):**
  - HEAR 100%: $1,600 (applied first)
  - CPF: $3,000 (fills gap - calculated as 2,000 sqft × $1.50/sqft)
  - CERTA: $2,000 (enabling repairs)
  - **Total Incentives: $6,600**
  - **Net Cost: $0** (CPF exceeds remaining cost by $600 for assurance)

- **Example - Ducted Heat Pump ($12,000 cost):**
  - HEAR 100%: $8,000 (applied first)
  - CPF: $4,000 (fills remaining gap)
  - **Total Incentives: $12,000**
  - **Net Cost: $0**

### For HEAR Moderate Income (81-150% AMI):
- Federal HEAR 50% applied first
- Standard Energy Trust programs fill remaining gaps
- Significantly reduced net costs

## Measure-Specific Per-Sqft Rates

### CPF Rates (Priority Communities):
- Attic Insulation: **$1.50/sqft**
- Wall Insulation: **$1.00/sqft**
- Floor Insulation: **$1.20/sqft**

### Standard Rates:
- Attic Insulation: **$0.10/sqft**
- Wall Insulation: **$0.08/sqft**
- Floor Insulation: **$0.10/sqft**

### Fixed HEAR Amounts:
- Heat Pumps (Ducted/Ductless): **$8,000** (100%) or **$4,000** (50%)
- Insulation measures: **$1,600** (100%) or **$800** (50%)
- Heat Pump Water Heater: **$1,750** (100%) or **$875** (50%)

## Testing Recommendations

1. **Test CPF-eligible customer path:**
   - Enter 60-80% AMI household
   - Select priority community or CBO
   - Verify insulation measures show actual CPF dollar amounts (not "Calculated based on eligibility")
   - Verify HEAR is listed before CPF in packages

2. **Test comprehensive project:**
   - Multiple insulation measures + heat pump
   - Verify HOMES package option shows federal $ first
   - Verify cost summary shows no-cost or near-no-cost outcome

3. **Test area calculations:**
   - Enter different home square footages
   - Verify CPF amounts scale correctly with area
   - Example: 1,500 sqft home → $2,250 attic CPF (1,500 × $1.50)

## Notes

- CPF amounts are intentionally allowed to exceed remaining costs post-HEAR/HOMES
- This provides customer assurance that upgrades will be no-cost
- Total incentive stacking remains compliant with program rules
- HEAR and HOMES cannot stack (mutually exclusive) - system shows as separate package options
