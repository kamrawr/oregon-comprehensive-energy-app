# 🏠 Oregon Comprehensive Energy Assessment Tool

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://kamrawr.github.io/oregon-comprehensive-energy-app/)
[![Data Version](https://img.shields.io/badge/data-2025--official-green)](docs/DATA_SOURCES.md)

**An independent, comprehensive assessment tool to help Oregon homeowners navigate energy efficiency incentives and programs.**

🔗 **Live Application:** https://kamrawr.github.io/oregon-comprehensive-energy-app/

📊 **Test Visualization & Impact Simulator:** https://kamrawr.github.io/oregon-comprehensive-energy-app/visualization.html

---

## ✨ Features

- **✅ Accurate 2025 Data** - Official HUD AMI, FPL, and program incentive data
- **🎯 4-Step Assessment** - Customer intake → Income qualification → Home evaluation → Personalized pathways
- **💰 Comprehensive Program Coverage** - OHCS Weatherization, CPF, HEAR, HOMES, Energy Trust, CERTA
- **📊 Intelligent Incentive Stacking** - Proper program combination rules with HEAR/HOMES exclusivity
- **🏠 Dynamic HOMES Allocation** - $10K site cap intelligently distributed across measures, prioritizing health/safety and envelope
- **🏘️ Priority Community Support** - Enhanced eligibility tracking for underserved communities
- **🎛️ Flexible Program Options** - Opt-out of HOMES (audit requirement) and toggle no-cost CPF eligibility
- **📱 Mobile Responsive** - Works on all devices
- **📥 Downloadable Reports** - Export personalized assessment results
- **🔄 Interactive Selection** - Choose priority measures with dual cost summaries and real-time updates
- **📈 Interactive Visualizations** - Explore test results, program coverage, and simulate long-term impact

---

## 🎯 What It Does

This tool helps Oregon homeowners:

1. **Determine eligibility** for federal, state, and utility energy programs
2. **Calculate accurate incentive amounts** based on income, location, and home type
3. **Understand program stacking rules** (which incentives can combine)
4. **Get personalized recommendations** prioritized by need and cost-effectiveness
5. **Access official program contacts** for application assistance

---

## 📋 Supported Programs

| Program | Eligibility | Coverage |
|---------|-------------|----------|
| **Oregon Weatherization (OHCS)** | ≤60% SMI or ≤200% FPL | 100% no-cost |
| **Community Partner Fund (CPF)** | Tier 1: ≤80% AMI + (Priority OR CBO)<br>Tier 2: 81-150% AMI + (Priority AND CBO) | Enhanced rebates |
| **HEAR (IRA Federal)** | ≤80% AMI (100%)<br>81-150% AMI (50%) | Electrification rebates |
| **HOMES (IRA Federal)** | ≤400% AMI | Up to $10,000 flex funding (dynamically allocated) |
| **CERTA** | All income levels | Tax exemption |
| **Energy Trust Standard** | All income levels | Market-rate rebates |
| **LIHEAP** | ≤150% FPL | Bill assistance |

---

## 🚀 Quick Start

### **Try the Live Demo**

1. Visit: https://kamrawr.github.io/oregon-comprehensive-energy-app/
2. Click **"📋 Load Demo Data"** to see a sample assessment
3. Walk through all 4 steps
4. Explore package options and cost summaries

### **Explore Test Results & Impact**

1. Visit: https://kamrawr.github.io/oregon-comprehensive-energy-app/visualization.html
2. View interactive test scenario results and analysis
3. Explore program coverage visualizations by income tier
4. Use the impact simulator to estimate long-term effects
5. Analyze HOMES allocation and CPF no-cost coverage

### **Run Locally**

```bash
# Clone the repository
git clone https://github.com/kamrawr/oregon-comprehensive-energy-app.git
cd oregon-comprehensive-energy-app

# Open in your browser
open index.html
```

No build process or dependencies required!

---

## 📊 Data Sources

All data comes from official sources:

- **Income Limits:** [2025 HUD Income Limits](https://www.huduser.gov/portal/datasets/il.html)
- **Poverty Guidelines:** [2025 Federal Poverty Guidelines](https://aspe.hhs.gov/poverty-guidelines)
- **Incentive Amounts:** Energy Trust PI 320CPF-OR v2025.3, IRA Sections 50121/50122
- **Program Rules:** OHCS WAP guidelines, Oregon DOE documentation

📖 **Full documentation:** [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md)

---

## 🏗️ Project Structure

```
oregon-comprehensive-energy-app/
├── index.html                          # Main application (single-page)
├── README.md                           # This file
│
├── config/                             # Data configuration
│   ├── incentive_eligibility_map.json  # Incentive amounts & stacking rules
│   ├── oregon_income_thresholds_full_2025.json  # Exact income thresholds
│   ├── program_eligibility_rules.yaml  # Program requirements
│   ├── utility_territories.yaml        # Utility coverage data
│   └── bpi2400_schema.yaml            # BPI standards
│
├── src/                                # JavaScript modules
│   ├── income_data_loader.js          # Income threshold lookups (NEW)
│   ├── data_loader.js                 # General data utilities
│   ├── incentive_rules.js             # Eligibility logic
│   ├── incentive_calculator.js        # Incentive calculations
│   └── report_generator.js            # PDF report generation
│
├── tests/                              # Test suite
│   ├── eligibility-validation.test.js # 10 edge case tests (NEW)
│   ├── comprehensive-scenarios.test.js # 20 scenario tests (NEW)
│   └── README.md                      # Test documentation (NEW)
│
├── visualization.html                  # Interactive test & impact visualization (NEW)
│
└── docs/                               # Documentation
    ├── DATA_SOURCES.md                # Official data references
    ├── AUDIT_REPORT.md                # Comprehensive audit (NEW)
    ├── IMPLEMENTATION_SUMMARY.md      # Implementation details (NEW)
    ├── USER_GUIDE.md                  # End-user guide
    ├── guides/
    │   ├── CONTRIBUTING.md            # Contribution guidelines
    │   └── UPDATE_GUIDE.md            # Data update procedures
    └── development/
        ├── PROJECT_SUMMARY.md         # Project overview
        ├── ENHANCEMENT_SPEC.md        # Feature specifications
        ├── IMPLEMENTATION_STATUS.md   # Development status
        └── DEVELOPMENT_SUMMARY.md     # Technical summary
```

---

## 🧪 Testing

### **Automated Test Suite**

```bash
node tests/eligibility-validation.test.js
```

**Coverage:** 10 edge cases, all passing ✅
- CPF Tier 1 and Tier 2 eligibility
- HEAR/HOMES exclusions for CPF Tier 2
- Federal opt-out filtering
- Weatherization via SMI and FPL paths
- Priority community requirements

**Documentation:** `tests/README.md`

### **Interactive Visualization**

Explore test results and simulate program impact:

```
Open: visualization.html
```

**Features:**
- 📊 Test scenario analysis across 20+ comprehensive tests
- 📈 Program coverage by income tier visualizations
- 🎯 Impact simulator for long-term projections
- 🏗️ HOMES allocation priority analysis
- 💸 CPF no-cost coverage comparisons
- 📉 Interactive D3.js charts and graphs

**Live Demo:** https://kamrawr.github.io/oregon-comprehensive-energy-app/visualization.html

### **Demo Data**

Every module has a "📋 Load Demo Data" button:
- **Intake:** Jane Smith, Multnomah County, priority + CBO
- **Income:** Family of 4, $55,000/year (≈65% AMI)
- **Assessment:** 1975 home, poor insulation, old equipment

---

## 🔧 For Developers

### **Technology Stack**

- **HTML5** - Semantic, accessible markup
- **CSS3** - Responsive design with CSS Grid/Flexbox
- **Vanilla JavaScript** - No framework dependencies
- **Chart.js** - Data visualization (CDN)
- **GitHub Pages** - Static site hosting

### **Key Features**

- ✅ No build process
- ✅ No npm dependencies
- ✅ Self-contained single-page app
- ✅ Config-driven data
- ✅ Modular JavaScript architecture
- ✅ Mobile-first responsive design
- ✅ Exact income threshold lookups (JSON-based)
- ✅ Dynamic HOMES allocation with $10K site cap
- ✅ Real-time incentive recalculation on option toggles
- ✅ No-cost CPF enhancement for eligible measures
- ✅ Automated test suite (10/10 passing)
- ✅ Comprehensive audit trail (95% confidence)

### **Contributing**

We welcome contributions! See [docs/guides/CONTRIBUTING.md](docs/guides/CONTRIBUTING.md)

```bash
# Setup
git clone https://github.com/kamrawr/oregon-comprehensive-energy-app.git
cd oregon-comprehensive-energy-app

# Create branch
git checkout -b feature/your-feature

# Make changes and test
open index.html

# Commit and push
git add .
git commit -m "Feature: Description"
git push origin feature/your-feature
```

---

## 📚 Documentation

### **User Documentation**
- **[User Guide](docs/USER_GUIDE.md)** - How to use the assessment tool
- **[Data Sources](docs/DATA_SOURCES.md)** - Complete data provenance

### **Developer Documentation**
- **[Audit Report](docs/AUDIT_REPORT.md)** - Comprehensive data validation (NEW)
- **[Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md)** - Recent updates (NEW)
- **[Update Guide](docs/guides/UPDATE_GUIDE.md)** - How to update program data
- **[Contributing Guide](docs/guides/CONTRIBUTING.md)** - How to contribute
- **[Test Documentation](tests/README.md)** - Test suite details (NEW)

---

## ⚠️ Important Disclaimers

**This tool is:**
- ✅ An informational resource for estimating eligibility
- ✅ Based on official 2025 program data
- ✅ Updated regularly with current program rules

**This tool is NOT:**
- ❌ Officially endorsed by Energy Trust, OHCS, or Oregon DOE
- ❌ A guarantee of program eligibility or incentive amounts
- ❌ A substitute for official program application

**To access programs:** You must apply directly through official program administrators. Contact information is provided in assessment results.

---

## 🔄 Keeping Data Current

Program data is updated when:
- Income limits change (annually, typically March/April)
- Program incentives are adjusted (monitor quarterly)
- New programs launch or rules change

See [docs/guides/UPDATE_GUIDE.md](docs/guides/UPDATE_GUIDE.md) for update procedures.

---

## 📞 Contact & Support

- **Questions:** Open a [GitHub Issue](https://github.com/kamrawr/oregon-comprehensive-energy-app/issues)
- **Bug Reports:** Use the issue tracker
- **Feature Requests:** Open a discussion

**For official program information, contact:**
- Energy Trust: 1-866-368-7878
- Oregon Weatherization: 1-800-766-6861
- Oregon DOE: 1-800-221-8035

---

## 📜 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Data Sources:** HUD, HHS, Energy Trust of Oregon, OHCS, Oregon DOE
- **Programs:** IRA Federal Programs, Oregon state energy programs
- **Community:** Oregon energy efficiency advocates and CBOs

---

## 📈 Project Stats

- **📦 Total Size:** ~3,000+ lines of code
- **⚡ Load Time:** <2 seconds on broadband
- **📱 Mobile Ready:** Responsive design
- **♿ Accessible:** Semantic HTML, ARIA labels
- **🌐 Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)
- **🧪 Test Coverage:** 10 edge cases, 100% passing
- **📊 Counties Supported:** All 36 Oregon counties
- **💰 Programs Mapped:** 8+ incentive programs
- **🔧 Measures Covered:** 15+ energy upgrade measures
- **✅ Data Accuracy:** 95% audit confidence

---

## 🗓️ Version History

**Current Version:** 1.1 (October 29, 2025)

### Recent Updates (v1.1)
- ✅ CPF Tier 2 eligibility added (81-150% AMI with priority+CBO)
- ✅ Exact income data integration (`oregon_income_thresholds_full_2025.json`)
- ✅ Federal program opt-out feature
- ✅ Demo data buttons for all modules
- ✅ Comprehensive audit completed (95% confidence)
- ✅ Test suite with 10 passing edge cases
- ✅ HEAR/HOMES exclusions for CPF Tier 2 customers
- ✅ Income calculation uses exact thresholds (no more adjustments)

### Initial Release (v1.0)
- ✅ 2025 official data integrated
- ✅ Corrected eligibility rules (SMI-based weatherization)
- ✅ HOMES/HEAR for all income tiers
- ✅ Priority community tracking
- ✅ Measure selection with dual reports
- ✅ Comprehensive disclaimers

---

**Built with ❤️ for Oregon homeowners**

[View Live Application →](https://kamrawr.github.io/oregon-comprehensive-energy-app/)
