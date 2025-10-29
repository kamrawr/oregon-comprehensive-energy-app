# Oregon Comprehensive Energy Assessment - User Guide

## Overview
This tool provides a complete energy assessment workflow that integrates customer intake, income qualification, home energy evaluation, and personalized incentive recommendations—all in a single interactive page.

## Navigation
The app uses a 4-step progressive workflow:

### Step 1: Customer Intake & Eligibility
**Purpose:** Establish customer profile and initial program eligibility

**What you'll provide:**
- Contact information (name, email, phone)
- Geographic location (Oregon county)
- Utility provider
- Housing type and ownership status
- Primary energy concerns (multi-select)
- Urgency of need

**Outcome:** 
- Customer ID generated for tracking
- Profile established for personalized recommendations

### Step 2: Income Qualification
**Purpose:** Determine eligibility for income-qualified programs

**What you'll provide:**
- Household size (1-8 people)
- Household income amount
- Income frequency (annual/monthly/biweekly/weekly)
- Tax status (pre-tax or post-tax)

**Outcome:**
- Annual income calculated and normalized
- Percentages calculated for:
  - Area Median Income (AMI) - county-specific
  - State Median Income (SMI) - Oregon statewide
  - Federal Poverty Level (FPL) - household size adjusted
- Eligibility determined for:
  - ✓ LIHEAP (≤150% FPL)
  - ✓ Weatherization Program (≤60% SMI)
  - ✓ Energy Trust Income-Qualified (≤80% AMI)
  - ✓ Low-Income Housing (≤80% AMI)
  - ✓ First-Time Homebuyer Programs (≤120% AMI)
  - Standard programs (if above income limits)

### Step 3: Home Energy Assessment
**Purpose:** Evaluate home's current energy performance

**What you'll provide:**

**Property Details:**
- Home square footage
- Conditioned space (for HVAC sizing)
- Foundation type
- Roof condition

**Building Envelope:**
- Attic insulation condition
- Wall insulation condition
- Window type (single/double/triple pane)
- Door sealing condition

**HVAC Systems:**
- Primary heating system type and age
- Cooling system type
- Ductwork condition

**Health & Safety:**
- Multi-select checklist of concerns (combustion appliances, moisture, mold, asbestos, lead paint)

**Outcome:**
- Issues identified and prioritized
- Recommendations generated with:
  - Priority level (🔴 critical, 🟠 high, 🟡 medium, 🟢 low)
  - Measure description
  - Estimated costs
  - Available incentives
  - Dependencies

### Step 4: Personalized Incentive Pathways
**Purpose:** Synthesize all data into actionable plan

**What you'll see:**
- Complete customer profile summary
- Eligibility-based pathway recommendations:
  - If weatherization eligible: Priority path with no-cost options
  - If Energy Trust income-qualified: Enhanced incentive options
  - Standard programs: Full incentive breakdown
  
- **Prioritized Retrofit Plan** table showing:
  - All recommendations from Step 3
  - Adjusted incentives based on your income eligibility
  - Net costs after incentives
  - Implementation order
  
- **Financing & Resources** with contact info for:
  - Oregon Weatherization Program
  - Energy Trust of Oregon
  - Financing options
  - Local contractors
  
- **Next Steps** tailored to your situation

**Actions available:**
- Download full HTML report
- Start new assessment
- Navigate back to edit any section

## Key Features

### Progress Tracking
- Visual progress bar shows completion status
- Click on any completed step circle to jump back
- Green checkmarks indicate completed sections

### Data Persistence
- All data stored in browser session
- Navigate freely between steps without losing information
- Customer ID tracks your unique assessment

### Smart Logic
- Income calculations automatically convert all frequencies to annual
- Household size adjustments apply to AMI/SMI thresholds
- County-specific AMI data (all 36 Oregon counties)
- Recommendations consider:
  - Health & safety issues (always first priority)
  - Roof condition before attic work
  - Insulation before HVAC upgrades
  - System age and efficiency

### Report Generation
- Click "Download Full Report" to get standalone HTML file
- Report includes:
  - Customer ID and date
  - All eligibility results
  - Complete recommendation table
  - Contact resources
  - Can be printed or saved as PDF

## Program Eligibility Reference

### LIHEAP (Low Income Home Energy Assistance Program)
- **Threshold:** ≤150% Federal Poverty Level
- **Benefits:** Help with energy bills
- **Contact:** Local community action agency

### Oregon Weatherization Program
- **Threshold:** ≤60% State Median Income
- **Benefits:** Free comprehensive home upgrades (insulation, air sealing, health & safety, sometimes HVAC)
- **Contact:** 1-800-766-6861

### Energy Trust Income-Qualified Programs
- **Threshold:** ≤80% Area Median Income
- **Benefits:** Enhanced rebates and incentives for efficiency upgrades
- **Contact:** 1-866-368-7878

### Standard Energy Trust Programs
- **Threshold:** No income limit
- **Benefits:** Standard rebates for qualifying measures
- **Contact:** energytrust.org

## Tips for Best Results

1. **Be thorough but honest**
   - Use "N/A" when you don't know
   - Multiple concerns help prioritize recommendations

2. **Have this information ready:**
   - Recent utility bills (for provider confirmation)
   - Household income documentation
   - Approximate home age and size
   - Recent energy bills to identify concerns

3. **Income qualification:**
   - Use gross (pre-tax) income for most accurate eligibility
   - Include all household members
   - Count regular income only (not one-time payments)

4. **Energy assessment:**
   - Square footage can be estimated from tax records
   - Heating system age usually visible on equipment label
   - Don't worry if some fields are unknown

5. **After completing:**
   - Download and save your report
   - Contact programs you're eligible for
   - Share report with contractors for accurate quotes

## Frequently Asked Questions

**Q: Is my data saved?**  
A: Data stays in your browser session only. Download the report to keep a permanent copy.

**Q: Can I go back and edit?**  
A: Yes! Click any completed step circle or use Back buttons. Your data persists during the session.

**Q: What if my county isn't listed?**  
A: All 36 Oregon counties are included. If serving non-Oregon areas, AMI data would need to be added.

**Q: Are the incentive amounts accurate?**  
A: Amounts are representative and based on typical Energy Trust rates. Actual incentives vary by program, contractor, and specific measures. Always verify with program administrators.

**Q: What if I rent?**  
A: Some programs serve renters! Weatherization programs often work with landlords. Select "Rent" in Step 1.

**Q: How do I apply for programs?**  
A: The final step provides direct contact information. Download your report and share it when you call.

**Q: Can I use this for multiple properties?**  
A: Yes, just complete a new assessment for each property. Each gets a unique Customer ID.

## Technical Notes

- **Browser compatibility:** All modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile friendly:** Responsive design works on phones and tablets
- **Offline capable:** Works without internet after initial page load (except Chart.js CDN)
- **No data collection:** Everything runs locally in your browser

## Support

For technical issues with the tool itself, check that:
- JavaScript is enabled
- Browser is up to date
- Required fields are filled before clicking Continue

For program eligibility questions or to apply:
- **Energy Trust of Oregon:** 1-866-368-7878 | energytrust.org
- **Oregon Weatherization:** 1-800-766-6861 | oregon.gov/ohcs/energy-weatherization
- **LIHEAP:** Contact your local community action agency

## Updates

This tool uses 2025 income limits and program data. For the most current eligibility requirements, always verify with program administrators.

---

**Ready to start?** Open `index.html` and begin your comprehensive energy assessment!
