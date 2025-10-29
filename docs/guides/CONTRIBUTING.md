# Contributing Guide

Thank you for your interest in contributing to the Oregon Comprehensive Energy Assessment tool! This document outlines how to contribute effectively.

---

## 🎯 Ways to Contribute

- **Data updates** - Update program data and incentive amounts
- **Bug fixes** - Report or fix issues
- **Feature enhancements** - Propose new functionality
- **Documentation** - Improve guides and documentation
- **Testing** - Test with real-world scenarios

---

## 🚀 Getting Started

### **Prerequisites**

- Git installed
- Web browser (Chrome, Firefox, Safari)
- Text editor (VS Code recommended)
- Basic knowledge of HTML/CSS/JavaScript

### **Setup**

```bash
# Clone the repository
git clone https://github.com/kamrawr/oregon-comprehensive-energy-app.git
cd oregon-comprehensive-energy-app

# Open in browser
open index.html
```

---

## 📁 Project Structure

```
oregon-comprehensive-energy-app/
├── index.html                  # Main application (self-contained)
├── config/                     # Data configuration files
│   ├── incentive_eligibility_map.json
│   └── program_eligibility_rules.yaml
├── src/                        # JavaScript modules
│   ├── data_loader.js         # Config file loader
│   ├── incentive_rules.js     # Eligibility logic
│   ├── incentive_calculator.js
│   └── report_generator.js
├── docs/                       # Documentation
│   ├── guides/                # How-to guides
│   ├── development/           # Development docs
│   ├── DATA_SOURCES.md        # Data provenance
│   └── USER_GUIDE.md          # End-user guide
└── README.md                   # Project overview
```

---

## 🔧 Making Changes

### **1. Create a Branch**

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
# or
git checkout -b data/program-name-update
```

### **2. Make Your Changes**

**For data updates:**
- Follow [UPDATE_GUIDE.md](UPDATE_GUIDE.md)
- Always cite official sources
- Test with demo data

**For code changes:**
- Follow existing code style
- Comment complex logic
- Test all affected features

### **3. Test Locally**

```bash
# Open in browser
open index.html

# Test checklist:
- [ ] Load demo data works
- [ ] All 4 steps complete successfully
- [ ] Eligibility calculations are correct
- [ ] Incentive amounts display properly
- [ ] Package options show correctly
- [ ] Cost summaries calculate
- [ ] No console errors
```

### **4. Commit Changes**

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "Type: Brief description

- Detailed change 1
- Detailed change 2

Source: [If data update]
Fixes: #123 [If fixing an issue]"
```

**Commit types:**
- `Data:` - Data/config updates
- `Feature:` - New functionality
- `Fix:` - Bug fixes
- `Docs:` - Documentation only
- `Style:` - Code formatting
- `Refactor:` - Code restructuring
- `Test:` - Testing changes

### **5. Push and Create Pull Request**

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title
- Description of changes
- Testing performed
- Screenshots if UI changes

---

## 📋 Coding Standards

### **JavaScript**

- Use ES6+ features
- Descriptive variable names
- Comment complex logic
- No inline styles (use CSS)

```javascript
// Good
function calculateNetCost(estimatedCost, incentives) {
    // Calculate total incentives from all programs
    let total = 0;
    for (const inc of incentives) {
        if (typeof inc.amount === 'number') {
            total += inc.amount;
        }
    }
    return estimatedCost - total;
}

// Avoid
function calc(c, i) {
    let t = 0;
    for (let x of i) t += x.amount;
    return c - t;
}
```

### **HTML**

- Semantic HTML5 elements
- Accessible forms (labels, ARIA)
- Mobile-responsive design

### **CSS**

- Use CSS variables for colors
- Mobile-first approach
- Consistent spacing

---

## 📊 Data Guidelines

### **Required for Data Updates**

1. **Official source** - Must link to official documentation
2. **Version number** - Include document version
3. **Effective date** - When does change take effect
4. **Citation** - Add to DATA_SOURCES.md

### **Data Sources (Approved)**

✅ **Official:**
- HUD Income Limits
- Federal Poverty Guidelines
- Energy Trust PI documents
- IRA program guidance
- OHCS program rules

❌ **Not Acceptable:**
- Estimates or assumptions
- Outdated sources
- Unofficial websites
- Personal calculations

---

## 🐛 Reporting Issues

Use GitHub Issues with:

**Bug Report:**
```markdown
## Bug Description
[Clear description]

## Steps to Reproduce
1. Step 1
2. Step 2
3. See error

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- Browser: [Chrome 120]
- Device: [Desktop/Mobile]
- Screenshot: [If applicable]
```

**Feature Request:**
```markdown
## Feature Description
[Clear description]

## Use Case
[Why is this needed]

## Proposed Solution
[How it could work]

## Alternatives Considered
[Other approaches]
```

---

## ✅ Pull Request Checklist

Before submitting:

- [ ] Code follows project style
- [ ] All tests pass locally
- [ ] Demo data loader works
- [ ] No console errors
- [ ] Documentation updated if needed
- [ ] DATA_SOURCES.md updated (if data change)
- [ ] Commit messages are clear
- [ ] Branch is up to date with main

---

## 🔍 Code Review Process

1. **Submit PR** - Create pull request
2. **Automated checks** - Wait for any CI/CD
3. **Review** - Maintainer reviews code
4. **Feedback** - Address any comments
5. **Approval** - PR is approved
6. **Merge** - Changes merged to main
7. **Deploy** - GitHub Pages auto-deploys

---

## 📞 Getting Help

- **Questions:** Open a GitHub Discussion
- **Bugs:** Create a GitHub Issue
- **Chat:** [If you have a Discord/Slack]

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE file).

---

## 🙏 Recognition

Contributors will be:
- Listed in project credits
- Mentioned in release notes
- Appreciated for their work!

---

**Questions?** Open a GitHub Issue or Discussion

**Last Updated:** October 29, 2025
