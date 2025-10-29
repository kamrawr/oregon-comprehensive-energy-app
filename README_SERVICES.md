# Oregon Comprehensive Energy Assessment Tool

**Version 1.2** | Built by Isaiah Kamrar / Community Consulting Partners LLC

A comprehensive web-based tool for assessing energy efficiency incentives and program eligibility for Oregon households. Integrates federal IRA programs (HOMES, HEAR), state weatherization, Energy Trust of Oregon programs, and local utility incentives.

---

## 🚀 Features

- **Dynamic HOMES Allocation** - Smart allocation algorithm with site caps
- **Real-Time Calculations** - Instant incentive recalculation as users select measures
- **Program Eligibility Logic** - Automated determination across multiple income tiers (AMI, FPL, SMI)
- **No-Cost Program Toggles** - Switch between HOMES and CPF no-cost pathways
- **Quick Demo Mode** - Pre-filled scenarios for training and presentations
- **Mobile-Responsive** - Works on any device
- **2025 HUD Data** - All 36 Oregon counties with current threshold data

---

## 📦 Quick Start

### Self-Hosted Deployment

1. Clone the repository:
```bash
git clone https://github.com/kamrawr/oregon-comprehensive-energy-app.git
cd oregon-comprehensive-energy-app
```

2. Serve locally:
```bash
python3 -m http.server 8000
# or
npx serve
```

3. Open `http://localhost:8000` in your browser

### GitHub Pages Deployment

Fork this repo and enable GitHub Pages in Settings → Pages → Source: main branch

---

## 🎓 Use Cases

- **Community-Based Organizations** - Screen clients for energy assistance programs
- **Energy Navigators** - Assess household eligibility and incentive stacking
- **Weatherization Agencies** - Pre-qualify homeowners for comprehensive upgrades
- **Energy Contractors** - Estimate incentive packages for customer proposals
- **Housing Counselors** - Connect clients with energy savings opportunities
- **Policy Researchers** - Analyze program impacts and eligibility gaps

---

## 💼 Professional Services

### Need Help Implementing This Tool?

While this software is freely available, **Community Consulting Partners LLC** offers professional implementation and customization services:

#### 🔧 Implementation Package - $2,500
**Get up and running with a branded deployment**
- Custom branding (logo, colors, organization name)
- Deployment to your domain (`tool.yourorganization.org`)
- Configuration of contact information and program links
- 2 hours of staff training
- 30 days email support

**Perfect for:** Nonprofits and agencies wanting a turnkey solution

---

#### ⚙️ Custom Configuration - $5,000
**Tailored to your specific needs**
- Everything in Implementation Package, plus:
- Custom JSON data integration (local/regional programs)
- Modified incentive logic for your service area
- Custom report templates with your branding
- CRM or database integration
- 5 hours of comprehensive training
- 90 days priority support

**Perfect for:** Regional coalitions, utilities, state agencies

---

#### 🏢 Enterprise Development - $15,000+
**Complete custom platform**
- Multi-state expansion beyond Oregon
- Custom program logic and calculation algorithms
- API development for system integration
- White-label license (full branding removal)
- Ongoing maintenance and feature development
- Dedicated support channel

**Perfect for:** National organizations, utilities, software companies

---

#### 👨‍💻 Consulting Services - $150/hour
**Expert guidance and technical advisory**
- Energy program design and policy consulting
- Code review and optimization
- Custom feature development
- Data analysis and reporting
- Staff training and capacity building
- Strategic planning for energy programs

**Minimum engagement:** 5 hours

---

## 📧 Contact

**Isaiah Kamrar**  
Community Consulting Partners LLC

**For Professional Services:**  
Email: dikamrar@gmail.com  
Response time: Within 24 hours

**For Technical Questions:**  
GitHub Issues: https://github.com/kamrawr/oregon-comprehensive-energy-app/issues

**Portfolio & Case Studies:**  
[LinkedIn](https://linkedin.com/in/isaiahkamrar) | [GitHub](https://github.com/kamrawr)

---

## 📊 Technical Stack

- **Frontend:** Vanilla JavaScript (no framework dependencies)
- **Data:** JSON-based configuration (easy annual updates)
- **Visualization:** Chart.js for income comparison charts
- **Architecture:** Single-page application, fully client-side
- **Deployment:** Static hosting (GitHub Pages, Netlify, Vercel)

---

## 🗂️ Project Structure

```
oregon-comprehensive-energy-app/
├── index.html                          # Main application
├── visualization.html                  # Test scenarios & analytics
├── src/
│   ├── data_loader.js                 # JSON data management
│   ├── incentive_calculator.js        # Core calculation engine
│   ├── incentive_rules.js             # Program eligibility logic
│   ├── income_data_loader.js          # Income threshold data
│   └── report_generator.js            # PDF/report generation
├── config/
│   ├── oregon_income_thresholds_full_2025.json
│   └── incentive_eligibility_map.json
├── docs/
│   ├── DATA_SOURCES.md                # Data provenance
│   ├── IMPLEMENTATION_SUMMARY.md      # Technical overview
│   └── TESTING_GUIDE.md               # QA procedures
└── tests/
    └── comprehensive-scenarios.test.js
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Note:** By contributing, you agree that your contributions will be licensed under the same license as this project.

---

## 📄 License

This project is licensed under a **Source-Available License** with attribution requirements.

**You MAY:**
- Use the software for any purpose (nonprofit or commercial)
- Deploy on your own infrastructure
- Modify for internal use
- Study and learn from the code

**You MAY NOT:**
- Redistribute or resell the software
- Offer as a hosted service to third parties
- Remove attribution or branding
- White-label without a commercial license

**For white-label licensing or custom implementations, contact:** dikamrar@gmail.com

See [LICENSE.md](LICENSE.md) for full terms.

---

## 🏆 Why Choose Professional Services?

### ✅ **Expertise**
- Deep knowledge of Oregon energy programs (HOMES, HEAR, CPF, Weatherization)
- Experience with program stacking rules and compliance requirements
- Direct connections with Energy Trust, OHCS, and Oregon DOE

### ✅ **Speed**
- Avoid months of trial-and-error configuration
- Get a working deployment in days, not weeks
- Benefit from battle-tested implementations

### ✅ **Support**
- Ongoing technical support and program updates
- Training for your staff
- Troubleshooting and optimization

### ✅ **Customization**
- Tailored to your exact workflows and data sources
- Integration with your existing systems
- Custom features developed to your specifications

---

## 🌟 Testimonials

> "This tool transformed how we screen clients for energy programs. What used to take 30 minutes now takes 5."  
> — *Energy Navigator, Community Action Partnership (coming soon)*

> "Isaiah's expertise in both the technical and policy sides made implementation seamless."  
> — *Program Director, Regional Weatherization Agency (coming soon)*

*Interested in being a beta user and providing feedback? Contact dikamrar@gmail.com*

---

## 📈 Roadmap

- [ ] Multi-state expansion (Washington, California)
- [ ] API for programmatic access
- [ ] PDF report generation with custom templates
- [ ] CRM integrations (Salesforce, HubSpot)
- [ ] Mobile app version
- [ ] Spanish language support

**Want to sponsor a feature?** Contact dikamrar@gmail.com

---

## 🙏 Acknowledgments

- Energy Trust of Oregon for program data and specifications
- Oregon Housing & Community Services for weatherization program details
- Oregon Department of Energy for IRA program implementation guidance
- Community-based organizations for real-world testing and feedback

---

**Built with ❤️ in Portland, Oregon**

© 2025 Isaiah Kamrar / Community Consulting Partners LLC. All rights reserved.