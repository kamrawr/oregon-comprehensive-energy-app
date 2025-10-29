# Data Sources Documentation

This document tracks all official data sources used in the Oregon Comprehensive Energy Assessment tool. **No data is fabricated** - all values come from official program documentation.

---

## **Official Data Files**

### **1. Income Eligibility Data**
**Source:** `oregon-income-calculator` repository  
**File:** Embedded in `index.html` (lines 1228-1282)

```javascript
// 2025 Oregon AMI Data (HUD Income Limits)
oregonCounties: { ... }  // All 36 Oregon counties

// 2025 Federal Poverty Guidelines (HHS)
fplData: { 1: 15060, 2: 20440, ... 8: 52720 }

// 2025 Oregon State Median Income
oregonSMI: 78600

// Household size adjustments
householdAdjustments: { 1: 0.70, ... 8: 1.32 }
```

**Official Sources:**
- **HUD Income Limits 2025:** https://www.huduser.gov/portal/datasets/il.html
- **Federal Poverty Guidelines 2025:** https://aspe.hhs.gov/poverty-guidelines
- **Oregon OHCS Data:** https://www.oregon.gov/ohcs/compliance-monitoring/pages/rent-income-limits.aspx

---

### **2. Incentive Eligibility Map**
**File:** `config/incentive_eligibility_map.json`  
**Version:** 1.0  
**Last Updated:** 2025-10-29  
**Source:** residential-incentive-insights project

**Contains:**
- Income tier definitions (SWR, CPF, HEAR, HOMES, Standard)
- Measure-specific incentive amounts by tier
- Stacking rules and optimal pathways
- Official program contacts

**Data Sources:**
- Energy Trust PI 320CPF-OR v2025.3
- IRA HOMES/HEAR program guidance
- Energy Trust measure specifications 2025
- OHCS weatherization program guidelines

---

### **3. Program Eligibility Rules**
**File:** `config/program_eligibility_rules.yaml`  
**Version:** 1.0  
**Last Updated:** 2025-10-29

**Programs Documented:**
- **HOMES** - IRA Section 50121
- **HEAR** - IRA Section 50122
- **CPF** - Energy Trust Community Partner Funding
- **SWR** - Oregon Weatherization (OHCS)
- **CERTA** - Oregon clean energy tax assistance
- **Energy Trust Standard** - Market-rate incentives

**Official Documentation:**
- IRA program guidance (federal)
- Energy Trust program documentation
- OHCS Single-Family Weatherization guidelines
- Oregon Department of Revenue CERTA rules

---

## **Measure-Specific Incentive Amounts**

### **Heat Pump - Ductless**
| Tier | Amount | Source |
|------|--------|--------|
| SWR Weatherization | Full coverage | OHCS WAP guidelines |
| CPF Single Family | $1,800 | PI 320CPF-OR v2025.3 |
| CPF Manufactured | $3,500 | PI 320CPF-OR v2025.3 |
| CPF Multifamily | $2,000 | PI 320CPF-OR v2025.3 |
| HEAR Low-Income (100%) | $8,000 | IRA Section 50122 |
| HEAR Moderate (50%) | $4,000 | IRA Section 50122 |
| Standard Market Rate | $800 | Energy Trust 2025 specs |

### **Heat Pump - Ducted**
| Tier | Amount | Source |
|------|--------|--------|
| SWR Weatherization | Full coverage | OHCS WAP guidelines |
| CPF Single Family | $4,000 | PI 320CPF-OR v2025.3 |
| CPF No-Cost Option | Full coverage | PI 320CPF-OR v2025.3 |
| CPF Extended Capacity | $6,000 | PI 320CPF-OR v2025.3 |
| HEAR Low-Income (100%) | $8,000 | IRA Section 50122 |
| HEAR Moderate (50%) | $4,000 | IRA Section 50122 |
| Standard Market Rate | $1,500 | Energy Trust 2025 specs |

### **Attic Insulation**
| Tier | Amount | Source |
|------|--------|--------|
| SWR Weatherization | Full coverage | OHCS WAP guidelines |
| CPF | $1.50/sq ft | PI 320CPF-OR v2025.3 |
| SWR Moderate | 50-60% coverage | Energy Trust SWR program |
| HEAR | $1,600 | IRA Section 50122 |
| CERTA | Up to $2,000 | Oregon DOE enabling repairs |
| HOMES | $2,000-$8,000 | IRA Section 50121 |
| Standard | $0.10/sq ft | Energy Trust 2025 specs |

### **Wall Insulation**
| Tier | Amount | Source |
|------|--------|--------|
| CPF | $1.00/sq ft | PI 320CPF-OR v2025.3 |
| Standard | $0.08/sq ft | Energy Trust 2025 specs |
| HEAR | $1,600 | IRA Section 50122 |

### **Floor/Crawlspace Insulation**
| Tier | Amount | Source |
|------|--------|--------|
| CPF | $1.20/sq ft | PI 320CPF-OR v2025.3 |
| Standard | $0.10/sq ft | Energy Trust 2025 specs |
| HEAR | $1,600 | IRA Section 50122 |

### **Air Sealing**
| Tier | Amount | Source |
|------|--------|--------|
| CPF | $800 | PI 320CPF-OR v2025.3 |
| Standard | $400 | Energy Trust 2025 specs |

### **Heat Pump Water Heater**
| Tier | Amount | Source |
|------|--------|--------|
| CPF Standard | $240 | PI 320CPF-OR v2025.3 |
| CPF No-Cost Enhanced | 110% of gap after HEAR | **v1.2 ENHANCEMENT Nov 2025** |
| HEAR Low-Income (100%) | $1,750 | IRA Section 50122 |
| HEAR Moderate (50%) | $875 | IRA Section 50122 |
| Standard | $240 | Energy Trust 2025 specs |

**CPF No-Cost Eligibility (v1.2):**
- Heat pump water heaters now included in CPF no-cost coverage
- When no-cost toggle enabled: CPF = (Cost - HEAR) × 1.1
- Example: $2,500 cost - $1,750 HEAR = $750 gap × 1.1 = $825 CPF
- Result: $0 net cost for qualifying households

### **Duct Sealing**
| Tier | Amount | Source |
|------|--------|--------|
| CPF | $600 | PI 320CPF-OR v2025.3 |
| Standard | $400 | Energy Trust 2025 specs |

### **Smart Thermostat**
| Tier | Amount | Source |
|------|--------|--------|
| CPF Direct Install | $250 | PI 320CPF-OR v2025.3 |
| Standard | $250 | Energy Trust 2025 specs |

### **Windows**
| Tier | Amount | Source |
|------|--------|--------|
| CPF Enhanced | $1.00-$1.50/sq ft | PI 320CPF-OR v2025.3 |
| Standard | $50/window (max $500) | Energy Trust 2025 specs |

### **Electric Panel Upgrade**
| Tier | Amount | Source |
|------|--------|--------|
| HEAR Low-Income (100%) | $4,000 | IRA Section 50122 |
| HEAR Moderate (50%) | $2,000 | IRA Section 50122 |
| CERTA | Up to $2,000 | Oregon DOE enabling repairs |
| Standard | $0 | Not available |

### **Electrical Wiring**
| Tier | Amount | Source |
|------|--------|--------|
| HEAR Low-Income (100%) | $2,500 | IRA Section 50122 |
| HEAR Moderate (50%) | $1,250 | IRA Section 50122 |
| CERTA | Up to $2,000 | Oregon DOE enabling repairs |

---

## **Eligibility Thresholds**

### **Income-Based Eligibility**
| Program | Threshold | Source | Notes |
|---------|-----------|--------|-------|
| **Oregon Weatherization** | ≤60% SMI OR ≤200% FPL | OHCS WAP 2025 guidelines | Uses SMI, not AMI |
| **CPF** | ≤80% AMI + Priority Community/CBO | Energy Trust CPF program rules | **CORRECTED Oct 2025** (was <150%) |
| **LIHEAP** | ≤150% FPL | Federal LIHEAP guidelines | Bill assistance |
| **HEAR Low-Income (100%)** | ≤80% AMI | IRA Section 50122 | **Includes weatherization tier** |
| **HEAR Moderate (50%)** | 81-150% AMI | IRA Section 50122 | Federal IRA |
| **HOMES** | ≤400% AMI | IRA Section 50121 | Performance-based |
| **Energy Trust IQ** | ≤80% AMI | Energy Trust 2025 guidelines | Utility-funded |

---

## **Official Program Contacts**

### **Energy Trust of Oregon**
- **Phone:** 1-866-368-7878
- **Website:** https://www.energytrust.org
- **Programs:** Standard, SWR, CPF
- **Source:** Official Energy Trust contact page

### **Oregon Housing & Community Services (OHCS)**
- **Phone:** 1-800-766-6861
- **Website:** https://www.oregon.gov/ohcs/energy-weatherization
- **Programs:** Single-Family Weatherization
- **Source:** OHCS official website

### **Oregon Department of Energy**
- **Phone:** 1-800-221-8035
- **Website:** https://www.oregon.gov/energy
- **Programs:** HEAR, HOMES, CERTA
- **Source:** Oregon DOE official website

---

## **Data Verification Process**

1. **Income Data:** Verified against official 2025 HUD Income Limits and Federal Poverty Guidelines
2. **Incentive Amounts:** Cross-referenced with Energy Trust PI documents and IRA program guidance
3. **Contact Information:** Verified against official agency websites
4. **Program Rules:** Confirmed with published program documentation

---

## **Data Update Schedule**

- **Income Limits:** Updated annually (typically March/April)
- **Incentive Amounts:** Updated as programs change (monitor quarterly)
- **Program Rules:** Monitor for IRA program launches and updates
- **Next Review:** December 2025

---

## **Disclaimer**

While all data is sourced from official documentation, **programs are subject to change**. Users must verify:
- Current incentive availability
- Funding levels
- Eligibility requirements
- Application deadlines

**Direct confirmation with program administrators is required before making financial decisions.**

---

## **Contributing Data Updates**

To update data in this tool:

1. **Update config files:**
   - `config/incentive_eligibility_map.json`
   - `config/program_eligibility_rules.yaml`

2. **Document sources:**
   - Add reference links
   - Note version numbers
   - Record effective dates

3. **Test changes:**
   - Verify calculations
   - Check stacking rules
   - Confirm contact information

4. **Commit with detailed message:**
   ```
   Data update: [Program name] - [Change description]
   Source: [Official documentation link]
   Effective: [Date]
   ```

---

## **Corrections and Updates**

### October 29, 2025 - Eligibility Threshold Corrections

**Issues Identified via Data Audit:**

1. **CPF Eligibility Threshold** (CRITICAL FIX)
   - **Previous (Incorrect):** <150% AMI + priority community/CBO
   - **Corrected:** ≤80% AMI + priority community/CBO
   - **Source:** Energy Trust CPF program documentation
   - **Impact:** Over-promising eligibility to 81-149% AMI households
   - **Status:** ✅ CORRECTED in code (index.html line 1555)

2. **HEAR Low-Income Eligibility** (MEDIUM FIX)
   - **Previous (Incorrect):** >60% AND ≤80% AMI (excluded ≤60% tier)
   - **Corrected:** ≤80% AMI (includes all income-qualified, including weatherization tier)
   - **Source:** IRA Section 50122
   - **Rationale:** Weatherization-eligible customers should see HEAR as alternative if waitlist exists
   - **Status:** ✅ CORRECTED in code (index.html line 1566)

**Validation:**
- All corrections verified via test suite (`tests/eligibility-validation.test.js`)
- 8/8 edge case tests passing
- Audit report available: `docs/AUDIT_REPORT.md`

### November 2025 - Version 1.2 Enhancements

**New Features Added:**

1. **HOMES Dynamic Allocation** (NEW FEATURE)
   - **Implementation:** $10,000 maximum site cap per household
   - **Priority-based allocation:** Health/Safety → Attic → Wall → Air Sealing → Windows
   - **Anti-stacking rule:** HOMES excluded from measures receiving HEAR
   - **Source:** IRA Section 50121 guidance
   - **Status:** ✅ IMPLEMENTED & TESTED (Scenarios 4-6)

2. **CPF No-Cost Eligible Option** (ENHANCEMENT)
   - **Implementation:** Enhanced CPF for insulation and heat pumps to achieve $0 net cost
   - **Calculation:** 110% of gap after other incentives
   - **Eligible Measures:**
     - Attic insulation
     - Wall insulation
     - Floor insulation
     - Heat pump ductless
     - Heat pump ducted
     - 🔥 **Heat pump water heater** (critical addition)
   - **Source:** Energy Trust CPF no-cost pilot program
   - **Status:** ✅ IMPLEMENTED & TESTED (Scenarios 7-9)

3. **Heat Pump Water Heater No-Cost Coverage** (CRITICAL FIX)
   - **Previous:** HPWHs excluded from no-cost eligibility, only $240 CPF
   - **Updated:** HPWHs included in enhanced CPF calculation
   - **Example:** $2,500 cost - $1,750 HEAR = $750 × 1.1 = $825 CPF enhanced
   - **Impact:** Eliminates $500+ out-of-pocket costs for qualifying households
   - **Status:** ✅ CORRECTED in v1.2 (Scenario 9 validates)

4. **HOMES Opt-Out Toggle** (USER FEATURE)
   - **Implementation:** User-facing checkbox to opt out of HOMES
   - **Use Case:** Customers unable to comply with HOMES audit requirements
   - **Behavior:** Excludes HOMES, maintains HEAR/CPF/CERTA/Standard
   - **Status:** ✅ IMPLEMENTED & TESTED (Scenario 10)

**Test Coverage:**
- ✅ Comprehensive test suite created: `tests/comprehensive-scenarios.test.js`
- ✅ 20 end-to-end scenarios covering all v1.2 features
- ✅ Critical HPWH no-cost validation (Scenario 9)
- ✅ HOMES allocation priority testing (Scenarios 4-6)
- ✅ Real-time recalculation testing (Scenario 19)

---

**Last Verified:** November 2025  
**Data Version:** 1.2 (HOMES & CPF no-cost features)  
**Maintained By:** Project contributors
