# 🏠 Oregon Comprehensive Energy Assessment Tool

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://kamrawr.github.io/oregon-comprehensive-energy-app/)
[![Data Version](https://img.shields.io/badge/data-2025--official-green)](docs/DATA_SOURCES.md)

**An independent, comprehensive assessment tool to help Oregon homeowners navigate energy efficiency incentives and programs.**

🔗 **Live Application:** https://kamrawr.github.io/oregon-comprehensive-energy-app/

---

## ✨ Features

- **✅ Accurate 2025 Data** - Official HUD AMI, FPL, and program incentive data
- **🎯 4-Step Assessment** - Customer intake → Income qualification → Home evaluation → Personalized pathways
- **💰 Comprehensive Program Coverage** - OHCS Weatherization, CPF, HEAR, HOMES, Energy Trust, CERTA
- **📊 Intelligent Incentive Stacking** - Proper program combination rules with HEAR/HOMES exclusivity
- **🏘️ Priority Community Support** - Enhanced eligibility tracking for underserved communities
- **📱 Mobile Responsive** - Works on all devices
- **📥 Downloadable Reports** - Export personalized assessment results
- **🔄 Interactive Selection** - Choose priority measures with dual cost summaries

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
| **Community Partner Fund (CPF)** | ≤80% AMI + Priority Community/CBO | Enhanced rebates |
| **HEAR (IRA Federal)** | ≤150% AMI | 50-100% electrification |
| **HOMES (IRA Federal)** | ≤400% AMI | $2,000-$8,000 whole-home |
| **CERTA** | All income levels | Tax exemption |
| **Energy Trust Standard** | All income levels | Market-rate rebates |

---

## 🚀 Quick Start

### **Try the Live Demo**

1. Visit: https://kamrawr.github.io/oregon-comprehensive-energy-app/
2. Click **"📋 Load Demo Data"** to see a sample assessment
3. Walk through all 4 steps
4. Explore package options and cost summaries

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
├── index.html                  # Main application (self-contained)
├── config/                     # Data configuration
│   ├── incentive_eligibility_map.json    # Official incentive data
│   └── program_eligibility_rules.yaml    # Program rules
├── src/                        # JavaScript modules
│   ├── data_loader.js         # Config loader
│   ├── incentive_rules.js     # Eligibility logic
│   ├── incentive_calculator.js
│   └── report_generator.js
├── docs/                       # Documentation
│   ├── guides/                # How-to guides
│   │   ├── UPDATE_GUIDE.md   # Data update instructions
│   │   └── CONTRIBUTING.md   # Contribution guidelines
│   ├── development/           # Dev documentation
│   ├── DATA_SOURCES.md        # Data provenance
│   └── USER_GUIDE.md          # End-user guide
└── README.md                   # This file
```

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

- **[User Guide](docs/USER_GUIDE.md)** - How to use the assessment tool
- **[Data Sources](docs/DATA_SOURCES.md)** - Complete data provenance
- **[Update Guide](docs/guides/UPDATE_GUIDE.md)** - How to update program data
- **[Contributing Guide](docs/guides/CONTRIBUTING.md)** - How to contribute

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

- **📦 Total Size:** ~245 KB (including all assets)
- **⚡ Load Time:** <2 seconds on broadband
- **📱 Mobile Ready:** Responsive design
- **♿ Accessible:** Semantic HTML, ARIA labels
- **🌐 Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)

---

## 🗓️ Version History

**Current Version:** 1.0 (October 2025)
- ✅ 2025 official data integrated
- ✅ Corrected eligibility rules (SMI-based weatherization)
- ✅ HOMES/HEAR for all income tiers
- ✅ Priority community tracking
- ✅ Measure selection with dual reports
- ✅ Comprehensive disclaimers

---

**Built with ❤️ for Oregon homeowners**

[View Live Application →](https://kamrawr.github.io/oregon-comprehensive-energy-app/)
