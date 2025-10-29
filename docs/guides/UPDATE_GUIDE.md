# Update Guide

This guide explains how to update program data, incentive amounts, and eligibility rules in the Oregon Comprehensive Energy Assessment tool.

---

## 📅 When to Update

Update data when:
- **Income limits change** (typically March/April annually)
- **Program incentives are adjusted** (monitor quarterly)
- **New programs launch** (IRA HOMES/HEAR, etc.)
- **Eligibility rules change**
- **Contact information updates**

---

## 🎯 What to Update

### 1. **Income Eligibility Data**

**File:** `index.html` (lines 1228-1282)

**Update annually with:**
- [HUD Income Limits](https://www.huduser.gov/portal/datasets/il.html)
- [Federal Poverty Guidelines](https://aspe.hhs.gov/poverty-guidelines)
- Oregon OHCS published data

**How to update:**
```javascript
// Update oregonCounties object
const oregonCounties = {
    "Multnomah County": { ami: 95800 },  // ← Update AMI values
    // ... all 36 counties
};

// Update fplData
const fplData = {
    1: 15060,  // ← Update FPL values
    2: 20440,
    // ...
};

// Update oregonSMI
const oregonSMI = 78600;  // ← Update SMI value
```

---

### 2. **Incentive Amounts**

**File:** `config/incentive_eligibility_map.json`

**Update when programs change incentive amounts:**

```json
{
  "measure_incentives": {
    "heat_pump_ductless": {
      "incentive_tiers": {
        "cpf_single_family": {
          "amount": 1800  // ← Update amounts here
        }
      }
    }
  }
}
```

**Sources to check:**
- Energy Trust PI documents (check version number)
- IRA program guidance (HOMES/HEAR)
- OHCS weatherization updates
- Program administrator websites

---

### 3. **Program Rules**

**File:** `config/program_eligibility_rules.yaml`

**Update when:**
- Eligibility thresholds change
- Stacking rules are modified
- Requirements are updated

```yaml
HEAR:
  eligibility:
    income_requirements:
      low_income:
        threshold: "ami <= 80"  # ← Update thresholds
        rebate_percentage: 100   # ← Update percentages
```

---

### 4. **Contact Information**

**File:** `config/incentive_eligibility_map.json`

```json
{
  "official_contacts": {
    "energy_trust": {
      "phone": "1-866-368-7878",  // ← Verify phone numbers
      "website": "energytrust.org"  // ← Verify URLs
    }
  }
}
```

---

## 🔧 Step-by-Step Update Process

### **Step 1: Research Official Sources**

1. Visit official program websites
2. Download latest program documentation
3. Note version numbers and effective dates
4. Save copies of source documents

### **Step 2: Update Config Files**

```bash
# Edit the config files
code config/incentive_eligibility_map.json
code config/program_eligibility_rules.yaml
```

### **Step 3: Update Version Numbers**

In `config/incentive_eligibility_map.json`:
```json
{
  "version": "1.1",  // ← Increment version
  "last_updated": "2025-12-15",  // ← Update date
  "source": "Energy Trust PI 320CPF-OR v2025.4"  // ← Update source
}
```

### **Step 4: Update Documentation**

Update `docs/DATA_SOURCES.md`:
- Add notes about changes
- Update "Last Verified" date
- Document new sources

### **Step 5: Test Changes**

```bash
# Open locally to test
open index.html

# Test scenarios:
# - Low-income customer (≤60% SMI)
# - Moderate-income customer (81-150% AMI)
# - Priority community with CBO
# - Standard market rate

# Verify:
# ✓ Eligibility calculations are correct
# ✓ Incentive amounts match official sources
# ✓ Stacking rules are enforced
# ✓ Contact information is accurate
```

### **Step 6: Commit Changes**

```bash
git add config/ docs/DATA_SOURCES.md index.html
git commit -m "Data update: [Program] incentives - [Change description]

Source: [Official documentation link]
Effective: [Date]
Version: [New version number]"

git push origin main
```

---

## 📋 Update Checklist

Use this checklist for each update:

- [ ] Research official sources and save documentation
- [ ] Update `config/incentive_eligibility_map.json`
- [ ] Update `config/program_eligibility_rules.yaml` if needed
- [ ] Update income data in `index.html` if annual update
- [ ] Increment version numbers
- [ ] Update `docs/DATA_SOURCES.md`
- [ ] Test with demo data (Load Demo Data button)
- [ ] Test all eligibility tiers
- [ ] Verify incentive calculations
- [ ] Check contact information
- [ ] Commit with detailed message
- [ ] Push to GitHub
- [ ] Verify GitHub Pages deployment

---

## 🔍 Verification

### **Test Cases:**

1. **Weatherization Eligible (≤60% SMI)**
   - Income: $35,000 (family of 4 in Multnomah County)
   - Expected: OHCS Weatherization + HOMES/HEAR options

2. **CPF Eligible (60-80% AMI + Priority Community)**
   - Income: $55,000 (family of 4)
   - Priority: Low-income + CBO
   - Expected: CPF + HEAR 100% + CERTA

3. **HEAR Moderate (81-150% AMI)**
   - Income: $80,000 (family of 4)
   - Expected: Standard + HEAR 50% + HOMES

4. **Standard (>150% AMI)**
   - Income: $150,000 (family of 4)
   - Expected: Standard + HOMES only

---

## 📞 Getting Help

- **Official program questions:** Contact program administrators directly
- **Technical issues:** Open GitHub issue
- **Data accuracy:** Verify with official sources before updating

---

## 🚨 Important Notes

- **Always cite sources** in commit messages
- **Never guess at values** - only use official data
- **Test thoroughly** before pushing
- **Document all changes** in DATA_SOURCES.md
- **Version control** everything

---

**Last Updated:** October 29, 2025  
**Maintained By:** Project contributors
