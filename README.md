# 🏠 Oregon Comprehensive Energy Assessment Tool

**Version 1.2** | Built by [Isaiah Kamrar](https://github.com/kamrawr)

[![License](https://img.shields.io/badge/license-Source--Available-blue.svg)](LICENSE.md)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://kamrawr.github.io/oregon-comprehensive-energy-app/)
[![Data Version](https://img.shields.io/badge/data-2025--official-green)](docs/DATA_SOURCES.md)

A comprehensive web-based tool for assessing energy efficiency incentives and program eligibility for Oregon households. Integrates federal IRA programs (HOMES, HEAR), state weatherization, Energy Trust of Oregon programs, and local utility incentives.

🔗 **[Try the Live Tool →](https://kamrawr.github.io/oregon-comprehensive-energy-app/)**

📊 **[Explore Test Results & Impact Simulator →](https://kamrawr.github.io/oregon-comprehensive-energy-app/visualization.html)**

---

## ✨ Key Features

- **Dynamic HOMES Allocation** - Smart $10K site cap distributed across measures
- **Real-Time Calculations** - Instant incentive updates as users select measures  
- **Comprehensive Program Coverage** - OHCS Weatherization, CPF, HEAR, HOMES, Energy Trust, CERTA
- **Intelligent Program Stacking** - Proper HEAR/HOMES exclusivity rules
- **No-Cost Program Toggles** - Switch between HOMES and CPF pathways
- **2025 HUD Data** - All 36 Oregon counties with current income thresholds
- **Mobile Responsive** - Works on any device
- **Quick Demo Mode** - Pre-filled scenarios for training

---

## 📋 Supported Programs

| Program | Eligibility | Coverage |
|---------|-------------|----------|
| **Oregon Weatherization (OHCS)** | ≤60% SMI or ≤200% FPL | 100% no-cost |
| **Community Partner Fund (CPF)** | Tier 1: ≤80% AMI<br>Tier 2: 81-150% AMI (with conditions) | Enhanced rebates |
| **HEAR (IRA Federal)** | ≤80% AMI (100% rebate)<br>81-150% AMI (50% rebate) | Up to $14,000/household |
| **HOMES (IRA Federal)** | ≤400% AMI | Up to $10,000 flex funding |
| **CERTA** | All income levels | 10-year tax exemption |
| **Energy Trust Standard** | All income levels | Market-rate rebates |

---

## 🚀 Quick Start

### **Try It Now**

1. **[Open the live tool](https://kamrawr.github.io/oregon-comprehensive-energy-app/)**
2. Click **"📋 Load Demo Data"** to see a sample assessment
3. Walk through all 4 steps
4. Explore incentive packages and options

### **Deploy Your Own**

```bash
# Clone the repository
git clone https://github.com/kamrawr/oregon-comprehensive-energy-app.git
cd oregon-comprehensive-energy-app

# Open in browser (no build required!)
open index.html

# Or serve with Python
python3 -m http.server 8000
```

No dependencies, no build process, no npm install!

---

## 💼 Professional Services

### Need Help Implementing This Tool?

While this software is **freely available** to use, I offer professional services for organizations that need customization, deployment assistance, or ongoing support.

#### 🔧 Implementation Package - **$2,500**
**Get up and running with a branded deployment**
- Custom branding (logo, colors, organization name)
- Deployment to your domain (`tool.yourorganization.org`)
- Program contact information configuration
- 2 hours of staff training
- 30 days email support

**Perfect for:** Nonprofits and agencies wanting a turnkey solution

#### ⚙️ Custom Configuration - **$5,000**
**Tailored to your specific service area and programs**
- Everything in Implementation Package, plus:
- Custom JSON data integration (local/regional programs)
- Modified incentive logic for your service area
- Custom PDF report templates with your branding
- CRM or database integration
- 5 hours of comprehensive training
- 90 days priority support

**Perfect for:** Regional coalitions, utilities, state agencies

#### 🏢 Enterprise Development - **$15,000+**
**Complete custom platform for your organization**
- Multi-state expansion beyond Oregon
- Custom program logic and calculation algorithms
- API development for system integration
- White-label license (full branding removal rights)
- Ongoing maintenance and feature development contracts
- Dedicated support channel

**Perfect for:** National organizations, utilities, software companies

#### 👨‍💻 Consulting Services - **$150/hour**
**Expert guidance and technical advisory**
- Energy program design and policy consulting
- Code review and optimization
- Custom feature development
- Data analysis and reporting
- Staff training and capacity building

**Minimum engagement:** 5 hours

📧 **Contact:** dikamrar@gmail.com | Response time: Within 24 hours

---

## 🎓 Use Cases

- **Community-Based Organizations** - Screen clients for energy assistance programs
- **Energy Navigators** - Assess household eligibility and incentive stacking
- **Weatherization Agencies** - Pre-qualify homeowners for comprehensive upgrades
- **Energy Contractors** - Estimate incentive packages for customer proposals
- **Housing Counselors** - Connect clients with energy savings opportunities
- **Policy Researchers** - Analyze program impacts and eligibility gaps

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
├── index.html                          # Main application
├── visualization.html                  # Test scenarios & analytics
│
├── src/                                # JavaScript modules
│   ├── income_data_loader.js          # Income threshold lookups
│   ├── data_loader.js                 # General data utilities
│   ├── incentive_rules.js             # Eligibility logic
│   ├── incentive_calculator.js        # Incentive calculations
│   └── report_generator.js            # PDF report generation
│
├── config/                             # Data configuration
│   ├── oregon_income_thresholds_full_2025.json
│   ├── incentive_eligibility_map.json
│   ├── program_eligibility_rules.yaml
│   └── utility_territories.yaml
│
├── tests/                              # Test suite
│   ├── eligibility-validation.test.js # Edge case tests
│   ├── comprehensive-scenarios.test.js# Scenario tests
│   └── README.md                      # Test documentation
│
└── docs/                               # Documentation
    ├── DATA_SOURCES.md                # Official data references
    ├── USER_GUIDE.md                  # End-user guide
    ├── AUDIT_REPORT.md                # Data validation
    ├── IMPLEMENTATION_SUMMARY.md      # Technical overview
    └── TESTING_GUIDE.md               # QA procedures
```

---

## 🧪 Testing

### **Automated Test Suite**

```bash
node tests/eligibility-validation.test.js
node tests/comprehensive-scenarios.test.js
```

**Coverage:** 30+ test cases, 100% passing ✅

### **Interactive Visualization**

Explore test results and simulate program impact:
- 📊 Test scenario analysis
- 📈 Program coverage visualizations
- 🎯 Impact simulator for projections
- **[View Live →](https://kamrawr.github.io/oregon-comprehensive-energy-app/visualization.html)**

---

## 📚 Documentation

### **User Documentation**
- **[User Guide](docs/USER_GUIDE.md)** - How to use the assessment tool
- **[Data Sources](docs/DATA_SOURCES.md)** - Complete data provenance

### **Developer Documentation**
- **[Audit Report](docs/AUDIT_REPORT.md)** - Comprehensive data validation
- **[Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md)** - Recent updates
- **[Testing Guide](docs/TESTING_GUIDE.md)** - Test suite details

---

## 🔧 Technology Stack

- **Frontend:** Vanilla JavaScript (no framework dependencies)
- **Data:** JSON-based configuration (easy annual updates)
- **Visualization:** Chart.js for income comparison charts
- **Architecture:** Single-page application, fully client-side
- **Deployment:** Static hosting (GitHub Pages, Netlify, Vercel)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**By contributing, you agree that your contributions will be licensed under the same license as this project.**

---

## 📄 License

This project is licensed under a **Source-Available License** with attribution requirements.

**You MAY:**
- ✅ Use the software for any purpose (nonprofit or commercial)
- ✅ Deploy on your own infrastructure
- ✅ Modify for internal use
- ✅ Study and learn from the code

**You MAY NOT:**
- ❌ Redistribute or resell the software
- ❌ Offer as a hosted service to third parties
- ❌ Remove attribution or branding
- ❌ White-label without a commercial license

**For white-label licensing or custom implementations:** dikamrar@gmail.com

See [LICENSE.md](LICENSE.md) for full terms.

---

## 🏆 Why Choose Professional Services?

### ✅ **Expertise**
- Deep knowledge of Oregon energy programs and compliance
- Direct connections with Energy Trust, OHCS, and Oregon DOE
- Experience with program stacking rules and policy implementation

### ✅ **Speed**
- Avoid months of trial-and-error configuration
- Get a working deployment in days, not weeks
- Benefit from battle-tested implementations

### ✅ **Support**
- Ongoing technical support and program updates
- Staff training and capacity building
- Troubleshooting and optimization

### ✅ **Customization**
- Tailored to your exact workflows and data sources
- Integration with existing systems
- Custom features developed to your specifications

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

**To access programs:** You must apply directly through official program administrators.

---

## 📞 Contact & Support

**For Professional Services:**  
Isaiah Kamrar  
Email: dikamrar@gmail.com  
Response time: Within 24 hours

**For Technical Questions:**  
GitHub Issues: [github.com/kamrawr/oregon-comprehensive-energy-app/issues](https://github.com/kamrawr/oregon-comprehensive-energy-app/issues)

**For Official Program Information:**
- Energy Trust: 1-866-368-7878
- Oregon Weatherization: 1-800-766-6861
- Oregon DOE: 1-800-221-8035

---

## 📈 Project Stats

- **Test Coverage:** 30+ test cases, 100% passing
- **Counties Supported:** All 36 Oregon counties
- **Programs Mapped:** 8+ incentive programs
- **Measures Covered:** 15+ energy upgrade measures
- **Data Accuracy:** 95% audit confidence
- **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)

---

## 🗓️ Version History

**Current Version:** 1.2 (October 29, 2025)

### Recent Updates (v1.2)
- ✅ Dynamic HOMES allocation with $10K site cap
- ✅ HOMES/No-Cost CPF program toggles
- ✅ Real-time incentive recalculation
- ✅ Quick Demo Mode for training
- ✅ Enhanced CPF Tier 2 eligibility (81-150% AMI)
- ✅ Comprehensive test suite with edge case coverage

### v1.1 Updates
- ✅ Exact income data integration (2025 HUD thresholds)
- ✅ Federal program opt-out feature
- ✅ Demo data buttons for all modules
- ✅ Comprehensive audit (95% confidence)

---

## 🙏 Acknowledgments

- **Data Sources:** HUD, HHS, Energy Trust of Oregon, OHCS, Oregon DOE
- **Programs:** IRA Federal Programs, Oregon state energy programs
- **Community:** Oregon energy efficiency advocates and CBOs

---

**Built with ❤️ in Portland, Oregon**

© 2025 Isaiah Kamrar. All rights reserved.

[View Live Application →](https://kamrawr.github.io/oregon-comprehensive-energy-app/)