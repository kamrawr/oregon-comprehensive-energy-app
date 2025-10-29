# Oregon Energy Tool - Version Guide

## Two Versions Available

### 🌐 **Browser Version** (Production)
**File**: `src/incentive_rules.js`

**Features:**
- ✅ Hardcoded values for maximum reliability
- ✅ No dependencies, no config files
- ✅ Works immediately in any browser
- ✅ Used by `index.html` (production app)

**When to use:**
- Production web application
- GitHub Pages deployment
- Any browser-based implementation

**Values are hardcoded:**
- All income thresholds (60%, 80%, 150% AMI)
- All program caps (HEAR $14K, HOMES $10K, CERTA $2K)
- All measure incentives
- HOMES coverage rules (100% low income, 50% moderate)

### ⚙️ **Node.js Version** (Development/Testing)
**File**: `src/incentive_rules_node.js`

**Features:**
- ✅ Config-driven from `config/program_rules.json`
- ✅ Easy to update program rules
- ✅ Version tracking built-in
- ✅ Used for backend processing & testing

**When to use:**
- Node.js applications
- API backends
- Testing with different configurations
- Scenarios requiring frequent rule updates

**Load config dynamically:**
```javascript
const IncentiveRules = require('./src/incentive_rules_node.js');
const rules = new IncentiveRules();
// Config loaded automatically from config/program_rules.json
```

---

## Configuration File

**Location**: `config/program_rules.json`

**Current Version**: 2.0.0

**Structure:**
```json
{
  "version": "2.0.0",
  "income_thresholds": {
    "weatherization_smi_max": 60,
    "cpf_tier1_ami_max": 80,
    "hear_moderate_ami_max": 150,
    "homes_ami_max": 150
  },
  "program_caps": {
    "hear_household_cap": 14000,
    "homes_flex_site_cap": 10000,
    "certa_household_cap": 2000
  },
  "measure_incentives": { ... }
}
```

---

## Updating Program Rules

### For Browser Version (Production)
1. Edit `src/incentive_rules.js`
2. Update hardcoded values in `initializeHardcodedValues()` method
3. Commit and push to GitHub
4. GitHub Pages deploys automatically

### For Node.js Version (Development)
1. Edit `config/program_rules.json`
2. Update version number
3. No code changes needed
4. Restart application to load new config

---

## Testing

**Browser Version:**
```bash
# Open in browser and check console
open index.html
# Should see: ✅ IncentiveRules initialized with hardcoded values
```

**Node.js Version:**
```bash
# Run test suite
node tests/eligibility-validation.test.js
node tests/comprehensive-scenarios.test.js
```

---

## Key Differences

| Feature | Browser Version | Node.js Version |
|---------|----------------|-----------------|
| **Config File** | ❌ No | ✅ Yes (`config/program_rules.json`) |
| **Dependencies** | None | ConfigLoader |
| **Loading** | Instant | Sync load on init |
| **Updates** | Edit source code | Edit JSON file |
| **Use Case** | Production web app | Backend/Testing |
| **Reliability** | Maximum (hardcoded) | High (with fallbacks) |

---

## Which Should You Use?

### Use **Browser Version** if:
- ✅ Building a web application
- ✅ Need maximum reliability
- ✅ Deploying to GitHub Pages or similar
- ✅ Don't need frequent rule updates

### Use **Node.js Version** if:
- ✅ Building an API or backend service
- ✅ Need to update rules frequently
- ✅ Want version-controlled configuration
- ✅ Running automated tests

---

##  HOMES Eligibility Rules

**Both versions implement the same IRA program rules:**

| Income Level | AMI Range | HOMES Eligible | Coverage | Site Cap |
|--------------|-----------|----------------|----------|----------|
| Low Income | ≤80% | ✅ Yes | 100% | $0-$10K |
| Moderate | 81-150% | ✅ Yes | 50% | $0-$10K |
| **Standard** | **>150%** | **❌ NO** | **0%** | **N/A** |

**>150% AMI Households Get:**
- ✅ Standard Energy Trust incentives only
- ❌ NO HOMES funding
- ❌ NO CPF funding  
- ❌ NO HEAR funding

---

## Support

**Questions?**
- Check `docs/CONFIG_ARCHITECTURE.md` for technical details
- See `DEPLOYMENT_V2.0.md` for deployment info
- Contact: dikamrar@gmail.com

---

© 2025 Isaiah Kamrar / Community Consulting Partners LLC  
All Rights Reserved. Proprietary Software.
