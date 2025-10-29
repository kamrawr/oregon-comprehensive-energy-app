# Oregon Comprehensive Energy Assessment - Enhancement Specification

## Overview
This document details the required enhancements to transform the MVP into a production-ready, audit-compliant comprehensive energy assessment application aligned with BPI-2400 standards and complete Energy Trust of Oregon program specifications.

---

## 1. MULTI-SELECT UTILITIES & GEOGRAPHIC ELIGIBILITY

### Current State
- Single utility provider selection
- County selection drives AMI data only

### Required Changes

#### 1.1 Multi-Utility Selection
```yaml
utility_config:
  selection_type: multi_select
  max_selections: null  # unlimited
  utilities:
    electric:
      - id: pge
        name: Portland General Electric (PGE)
        service_territory: [Multnomah, Clackamas, Washington, Marion, Yamhill, Polk, Benton, Clatsop, Columbia]
        programs: [CPF, HOMES, HEAR, Standard]
        income_qualified_available: true
        
      - id: pacific_power
        name: Pacific Power
        service_territory: [Klamath, Jackson, Josephine, Douglas, Lane, Deschutes, Jefferson, Crook]
        programs: [CPF, Standard]
        income_qualified_available: true
        
      - id: eweb
        name: Eugene Water & Electric Board (EWEB)
        service_territory: [Lane]
        programs: [Standard, Local]
        income_qualified_available: true
        
      - id: municipal
        name: Municipal Utility
        service_territory: []  # Variable
        programs: [Standard, Local]
        income_qualified_available: varies
        
    gas:
      - id: nw_natural
        name: NW Natural Gas
        service_territory: [Multnomah, Washington, Clackamas, Marion, Yamhill, Polk, Lane]
        programs: [CPF, Standard]
        
      - id: cascade
        name: Cascade Natural Gas
        service_territory: [Deschutes, Jefferson, Crook, Klamath, Jackson]
        programs: [Standard]
        
      - id: avista
        name: Avista
        service_territory: [Union, Wallowa]
        programs: [Standard]

  validation_rules:
    - rule: must_select_at_least_one
    - rule: warn_if_utility_not_in_county_service_territory
    - rule: cross_reference_with_program_eligibility
```

#### 1.2 Geographic-Utility Cross-Validation
- **County selection** → Auto-suggest available utilities
- **Utility selection** → Validate against county service territory
- **Warning system** for non-standard configurations
- **Program availability matrix** based on county + utility combination

#### 1.3 Auto-Fill Logic
```javascript
// When county + utilities selected → Pre-populate Step 2
auto_fill_rules:
  - trigger: county_and_utility_selected
    actions:
      - populate_ami_data: true
      - set_program_eligibility_flags: true
      - enable_applicable_programs: [CPF, HOMES, HEAR, SWR, CERTA]
      - disable_non_available_programs: []
```

---

## 2. DRAG-AND-DROP PRIORITY RANKING

### Current State
- Multi-checkbox selection only
- No priority ordering
- Not used in recommendation logic

### Required Changes

#### 2.1 Interactive Priority Ranking UI
```yaml
priority_ranking_interface:
  input_type: draggable_list
  display_mode: visual_cards
  
  concerns_list:
    - id: high_bills
      label: High energy bills
      icon: 💰
      weight: null  # User assigned
      
    - id: comfort
      label: Home comfort (too hot/cold)
      icon: 🌡️
      weight: null
      
    - id: drafts
      label: Drafts and air leaks
      icon: 💨
      weight: null
      
    - id: old_equipment
      label: Old/inefficient heating/cooling
      icon: 🔧
      weight: null
      
    - id: insulation
      label: Poor insulation
      icon: 🏠
      weight: null
      
    - id: windows
      label: Old/inefficient windows
      icon: 🪟
      weight: null
      
    - id: health
      label: Health and safety concerns
      icon: ⚠️
      weight: null
  
  ranking_logic:
    - drag_and_drop_to_reorder
    - top_item_weight: 7
    - descending_weights: [7, 6, 5, 4, 3, 2, 1]
    - unselected_weight: 0
```

#### 2.2 Priority-Weighted Recommendation Engine
```javascript
recommendation_scoring:
  base_score: technical_priority  // Health/Safety > Envelope > HVAC
  
  adjustments:
    customer_priority_multiplier:
      formula: "base_score * (1 + (customer_rank_weight / 10))"
      
    urgency_multiplier:
      immediate: 1.5
      high: 1.3
      moderate: 1.1
      low: 1.0
  
  final_ranking:
    sort_by: adjusted_score
    display_format: 
      - priority_emoji
      - measure_name
      - customer_concern_alignment_badge
```

#### 2.3 Report Integration
- **Show customer's stated priorities** in final report
- **Highlight recommendations** that address top 3 concerns
- **Explain alignment**: "This addresses your #1 concern: high bills"

---

## 3. BPI-2400 COMPLIANT ASSESSMENT

### Current State
- Basic assessment fields
- No sizing calculations
- Missing required BPI-2400 data points

### Required Implementation

#### 3.1 BPI-2400 Data Capture Schema
See attached: `config/bpi2400_schema.yaml` (to be created)

**Key additions required:**
```yaml
bpi_2400_data_model:
  
  building_characterization:
    geometry:
      - conditioned_floor_area: {type: number, unit: sq_ft, required: true}
      - conditioned_volume: {type: number, unit: cu_ft, required: true}
      - number_of_stories: {type: integer, required: true}
      - orientation: {type: enum, values: [N, NE, E, SE, S, SW, W, NW]}
      - year_built: {type: integer, required: false}
      
    envelope:
      walls:
        - construction_type: {type: enum, values: [wood_frame, masonry, concrete, other]}
        - existing_r_value: {type: number, required: true}
        - wall_area_gross: {type: number, unit: sq_ft}
        - wall_area_net: {type: number, unit: sq_ft}  # Gross - windows - doors
        
      ceiling_attic:
        - attic_type: {type: enum, values: [vented, unvented, cathedral, flat]}
        - ceiling_area: {type: number, unit: sq_ft}
        - existing_r_value: {type: number}
        - ventilation_adequate: {type: boolean}
        - access_type: {type: enum, values: [hatch, stairs, scuttle, none]}
        
      foundation:
        - type: {already captured}
        - floor_area: {type: number, unit: sq_ft}
        - existing_insulation_r_value: {type: number}
        - ground_cover_present: {type: boolean}
        - moisture_issues: {type: boolean}
        
      windows:
        - count: {type: integer}
        - total_area: {type: number, unit: sq_ft}
        - u_factor: {type: number}  # Or infer from type
        - shgc: {type: number}
        - condition: {type: enum, values: [poor, fair, good, excellent]}
        
      doors:
        - count: {type: integer}
        - type: {type: enum, values: [solid_wood, hollow_core, insulated_steel, sliding_glass]}
        - weatherstripping: {type: enum, values: [none, poor, fair, good]}
  
    hvac_systems:
      heating:
        - system_type: {already captured}
        - fuel_type: {type: enum}
        - capacity_btu: {type: number, unit: btuh}
        - efficiency: {type: number}  # AFUE, HSPF, COP
        - age: {already captured}
        - distribution: {type: enum, values: [ducted, ductless, hydronic, zonal]}
        
      cooling:
        - system_type: {already captured}
        - capacity_btu: {type: number, unit: btuh}
        - efficiency: {type: number}  # SEER, EER
        - age: {type: number, unit: years}
        
      ventilation:
        - mechanical_ventilation_present: {type: boolean}
        - type: {type: enum, values: [exhaust_only, supply_only, balanced, erv, hrv, none]}
        - cfm_capacity: {type: number}
        
      ductwork:
        - location: {type: enum, values: [conditioned, unconditioned_attic, unconditioned_crawl, unconditioned_basement, unconditioned_garage]}
        - insulation_r_value: {type: number}
        - leakage_visual: {type: enum, values: [none, minor, moderate, major]}
        - total_length_estimate: {type: number, unit: linear_ft}
  
    health_safety:
      combustion_safety:
        - combustion_appliances_present: {already captured via checkbox}
        - spillage_test_required: {type: boolean, auto: true_if_combustion}
        - co_detector_present: {type: boolean}
        - natural_draft_appliances: {type: boolean}
        
      moisture_mold:
        - visible_mold: {already captured}
        - moisture_issues: {already captured}
        - relative_humidity_high: {type: boolean}
        
      hazardous_materials:
        - asbestos_suspected: {already captured}
        - lead_paint_suspected: {already captured}
        - vermiculite_insulation: {type: boolean}
        
      air_quality:
        - attached_garage: {type: boolean}
        - knob_tube_wiring: {type: boolean}
        - radon_tested: {type: boolean}
  
    diagnostics:
      blower_door:
        - test_required: {type: boolean, default: true}
        - cfm50: {type: number}
        - ach50: {type: number}
        - ela: {type: number}
        
      duct_testing:
        - test_required: {type: boolean, auto: true_if_ducted}
        - duct_leakage_to_outside: {type: number, unit: cfm25}
        - percent_leakage: {type: number}
        
      combustion_testing:
        - required: {type: boolean, auto: true_if_combustion}
        - co_ambient: {type: number, unit: ppm}
        - co_flue: {type: number, unit: ppm}
        - draft_pressure: {type: number, unit: pascals}
```

#### 3.2 Sizing Calculations
```yaml
hvac_sizing_logic:
  heat_loss_calculation:
    method: Manual_J_simplified
    inputs:
      - conditioned_floor_area
      - conditioned_volume
      - wall_r_value
      - ceiling_r_value
      - floor_r_value
      - window_u_factor_and_area
      - door_count_and_type
      - ach50_or_estimate
      - design_temperatures  # From county climate zone
      
    outputs:
      - design_heating_load_btuh
      - recommended_hp_capacity_range
      - number_of_zones_suggested
      
  heat_pump_selection:
    rules:
      - if_conditioned_area_lt_1200: recommend_1_head
      - if_conditioned_area_1200_to_2000: recommend_2_heads
      - if_conditioned_area_gt_2000: recommend_3_heads_or_ducted
      - if_existing_ducts_and_good_condition: prefer_ducted_hp
      - if_no_ducts_or_poor_ducts: prefer_ductless_hp
```

#### 3.3 Technical Specification Reference
See: `config/technical_specs.yaml` (to be created)
- BPI-2400-S-2013 Standard alignment
- Manual J/D/S calculation references
- Energy Trust measure checklists integration

---

## 4. ELIGIBILITY-TO-INCENTIVE MAPPING

### Current State
- Basic eligibility flags (LIHEAP, Weatherization, etc.)
- Generic incentive text
- No detailed program rules

### Required Implementation

#### 4.1 Program Configuration File
File: `config/program_eligibility_rules.yaml`

```yaml
programs:
  
  # === FEDERAL PROGRAMS ===
  
  HOMES:
    full_name: Home Owner Managing Energy Savings (HOMES Rebate)
    authority: Inflation Reduction Act (IRA)
    administrator: Oregon Department of Energy
    
    eligibility:
      income_requirements:
        low_income_enhanced:
          threshold: "ami <= 80"
          bonus_multiplier: 1.0  # No bonus structure, same rebate
        standard:
          threshold: "ami > 80 AND ami <= 150"
          available: true
          
      home_requirements:
        ownership: [own, landlord]
        property_type: [single_family, multi_family_1to4, manufactured]
        utility_service: [pge, pacific_power, eweb, municipal]
        
    incentive_structure:
      type: modeled_savings_based
      calculation_method: "energy_savings_percentage * rebate_per_kwh"
      
      tiers:
        - savings_percent: "20% to 34%"
          rebate_max: 4000
          rebate_per_kwh_saved: variable
          
        - savings_percent: "35% or more"
          rebate_max: 8000
          rebate_per_kwh_saved: variable
          
      payment_timing: after_verification
      requires_energy_modeling: true
      max_rebate_per_project: 8000
      
    eligible_measures:
      - insulation_attic
      - insulation_wall
      - insulation_floor
      - air_sealing
      - windows_doors
      - heat_pump_ducted
      - heat_pump_ductless
      - heat_pump_water_heater
      
    stacking_rules:
      can_stack_with: [energy_trust_cpf, utility_incentives]
      cannot_stack_with: [hear]
      layering_max_total: null  # No federal cap on stacking
      
  HEAR:
    full_name: High-Efficiency Electric Home Rebate Act (HEAR)
    authority: Inflation Reduction Act (IRA)
    administrator: Oregon Department of Energy
    
    eligibility:
      income_requirements:
        low_income:
          threshold: "ami <= 80"
          rebate_percentage: 100
          max_per_household: 14000
          
        moderate_income:
          threshold: "ami > 80 AND ami <= 150"
          rebate_percentage: 50
          max_per_household: 14000
          
      home_requirements:
        ownership: [own, landlord]
        property_type: [single_family, multi_family_1to4, manufactured]
        
    incentive_structure:
      type: measure_based_prescriptive
      
      measures:
        heat_pump_central:
          rebate_amount: 8000
          income_based_percentage: applies
          requirements:
            - replaces_fossil_fuel_or_electric_resistance
            - meets_efficiency_standards
            
        heat_pump_ductless:
          rebate_amount: 8000
          income_based_percentage: applies
          requirements:
            - replaces_electric_resistance
            - hspf2_gte_8.10
            
        heat_pump_water_heater:
          rebate_amount: 1750
          income_based_percentage: applies
          requirements:
            - uef_gte_3.00
            
        electric_panel_upgrade:
          rebate_amount: 4000
          income_based_percentage: applies
          requirements:
            - minimum_200amp
            - required_for_electrification
            
        electrical_wiring:
          rebate_amount: 2500
          income_based_percentage: applies
          requirements:
            - required_for_electrification_measures
            
        weatherization:
          rebate_amount: 1600
          income_based_percentage: applies
          measures: [insulation, air_sealing]
          
    stacking_rules:
      can_stack_with: [utility_incentives]
      cannot_stack_with: [homes, energy_trust_income_qualified]
      layering_max_total: 14000
      
  # === STATE/UTILITY PROGRAMS ===
  
  CPF:
    full_name: Community Partner Funding
    authority: Energy Trust of Oregon
    administrator: Community Based Organizations
    
    eligibility:
      income_requirements:
        threshold: "ami <= 80"
        verification_required: true
        
      geographic:
        utility_territories: [pge, pacific_power]
        
    incentive_structure:
      type: prescriptive_enhanced
      reference_doc: PI_320CPF_2025
      
      heat_pumps:
        ductless_single_family:
          base_incentive: 1800
          manufactured_home_bonus: 1700  # Total 3500
          requirements:
            - replaces_electric_resistance
            - hspf2_gte_8.10
            - single_head_single_compressor
            
        ductless_multifamily:
          base_incentive: 2000
          requirements:
            - eligible_mf_property
            - replaces_electric_resistance
            
        ducted_single_family:
          base_incentive: 4000
          requirements:
            - replaces_electric_forced_air_furnace
            - hspf2_gte_7.50
            
        ducted_multifamily:
          base_incentive: 5000
          
        no_cost_ducted:
          incentive: covers_full_cost
          requirements:
            - income_qualified
            - replaces_electric_forced_air_furnace
            
        extended_capacity:
          base_incentive: 2000
          replace_furnace_bonus: 4000  # Total 6000
          requirements:
            - qualifying_product_list
            - auxiliary_heat_lockout
            - no_backup_gas
            - pge_or_pacific_power_only
            
      insulation:
        attic:
          incentive_per_sqft: 0.15
          max_incentive: null
          requirements: [r_value_improvement, proper_installation]
          
        wall:
          incentive_per_sqft: 0.10
          max_incentive: null
          requirements: [existing_r4_or_less]
          
        floor:
          incentive_per_sqft: 0.12
          max_incentive: null
          
    stacking_rules:
      can_stack_with: [homes, utility_incentives]
      cannot_stack_with: [hear, standard_energy_trust]
      
  CERTA:
    full_name: Clean Energy Retrofit Tax Assistance
    authority: State of Oregon
    administrator: Oregon Department of Revenue
    
    eligibility:
      income_requirements:
        threshold: null  # Available to all
        enhanced_for: "ami <= 80"
        
    incentive_structure:
      type: property_tax_exemption
      duration_years: 10
      
      exemption_calculation:
        method: assessed_value_increase_exemption
        applies_to: eligible_measure_costs
        
    stacking_rules:
      can_stack_with: [all_programs]
      
  SWR:
    full_name: Single Family Weatherization
    authority: Oregon Housing & Community Services
    administrator: Community Action Agencies
    
    eligibility:
      income_requirements:
        threshold: "smi <= 60 OR fpl <= 200"  # Whichever is higher
        verification_required: true
        documentation_intensive: true
        
    incentive_structure:
      type: no_cost_comprehensive
      customer_cost: 0
      
      covered_measures:
        - attic_insulation
        - wall_insulation
        - floor_insulation
        - air_sealing
        - duct_sealing
        - windows_doors  # If health/safety issue
        - heating_system  # If failed or unsafe
        - health_safety_measures
        - minor_repairs
        
      program_limits:
        max_per_home: varies_by_need
        assessment_required: comprehensive_in_home
        
    stacking_rules:
      can_stack_with: [liheap]
      cannot_stack_with: [all_other_programs]  # Weatherization is comprehensive
      
  # === STANDARD PROGRAMS ===
  
  energy_trust_standard:
    full_name: Energy Trust Standard Incentives
    authority: Energy Trust of Oregon
    administrator: Energy Trust / Trade Allies
    
    eligibility:
      income_requirements:
        threshold: null  # Available to all
        
      geographic:
        utility_territories: [pge, pacific_power, nw_natural, cascade, avista]
        
    incentive_structure:
      type: prescriptive_standard
      
      heat_pumps:
        ductless:
          incentive: 800
          requirements: [hspf2_gte_8.10, qualifying_product]
          
        ducted:
          incentive: 1500
          requirements: [hspf2_gte_7.50, replaces_electric_or_gas]
          
      insulation:
        attic:
          incentive_per_sqft: 0.10
          
        wall:
          incentive_per_sqft: 0.08
          
      windows:
        incentive_per_window: 50
        max_per_home: 500
        
    stacking_rules:
      can_stack_with: [homes, certa, federal_tax_credits]
      cannot_stack_with: [hear, cpf, income_qualified_programs]

# === UTILITY-SPECIFIC PROGRAMS ===

utility_programs:
  pge:
    smart_thermostat:
      incentive: 50
      requirements: [connected_device, approved_model]
      
  pacific_power:
    wattsmart:
      incentive: varies
      type: performance_based
      
  nw_natural:
    gas_furnace:
      incentive: 700
      requirements: [95_afue_or_higher]
      
    gas_water_heater:
      incentive: 300
      requirements: [tankless_or_uef_gte_0.90]

# === CROSS-PROGRAM RULES ===

stacking_matrix:
  # Defines what can be combined
  
  rule_sets:
    - name: federal_ira_exclusivity
      description: HOMES and HEAR are mutually exclusive
      logic: "NOT (HOMES AND HEAR)"
      
    - name: income_qualified_exclusivity
      description: CPF and Energy Trust Standard are mutually exclusive
      logic: "NOT (CPF AND energy_trust_standard)"
      
    - name: weatherization_comprehensive
      description: SWR covers everything, no stacking needed
      logic: "IF SWR THEN NOT (any_other_program)"
      
    - name: federal_state_utility_layering
      description: Federal + State + Utility allowed
      logic: "HOMES + CPF + utility_incentive = allowed"
      examples:
        - homes: true
          cpf: true
          pge_smart_thermostat: true
          total_valid: true
          
    - name: maximum_incentive_caps
      description: Some programs have total project caps
      rules:
        - hear_max_per_household: 14000
        - homes_max_per_project: 8000
        - combined_heat_pump_incentives_max: 8000  # Can't double-dip HP incentives

# === VALIDATION RULES ===

validation_rules:
  income_verification:
    required_for: [CPF, SWR, HEAR_low_income, HEAR_moderate]
    acceptable_documents:
      - tax_return_1040
      - pay_stubs_recent_2months
      - benefit_award_letters
      - self_attestation  # Only for some programs
      
  measure_requirements:
    heat_pump:
      must_meet:
        - efficiency_standards
        - proper_sizing
        - manufacturer_warranty
        - contractor_certification: [NATE, BPI, or Trade_Ally]
        
    insulation:
      must_meet:
        - r_value_improvement
        - proper_installation_per_bpi
        - health_safety_clearances
        - ventilation_maintained
```

#### 4.2 Incentive Calculation Engine
File: `src/incentive_calculator.js` (to be created)

```javascript
class IncentiveCalculator {
  constructor(eligibilityProfile, assessmentData, programRules) {
    this.profile = eligibilityProfile;
    this.assessment = assessmentData;
    this.rules = programRules;
  }
  
  calculateAvailableIncentives(measure) {
    const programs = this.getEligiblePrograms(measure);
    const incentives = [];
    
    for (const program of programs) {
      const amount = this.calculateProgramIncentive(program, measure);
      if (amount > 0) {
        incentives.push({
          program: program.name,
          amount: amount,
          requirements: program.requirements,
          stacks_with: program.stacking_rules.can_stack_with
        });
      }
    }
    
    return this.optimizeIncentiveStack(incentives);
  }
  
  optimizeIncentiveStack(incentives) {
    // Find best combination considering stacking rules
    // Return array of compatible incentives that maximize total
  }
}
```

---

## 5. COMPREHENSIVE CUSTOMER REPORT

### Current State
- Basic downloadable HTML
- Missing key details
- Not actionable/professional enough

### Required Enhancements

#### 5.1 Report Structure
```yaml
report_sections:
  
  1_executive_summary:
    - customer_id
    - assessment_date
    - assessor_name_org
    - property_address
    - key_findings_summary
    - total_estimated_project_cost
    - total_available_incentives
    - estimated_net_cost
    - estimated_annual_savings
    - simple_payback_period
    
  2_eligibility_profile:
    - income_qualification_summary
    - program_eligibility_badges:
        format: visual_badges
        include: [HOMES, HEAR, CPF, SWR, CERTA, Standard]
    - utility_territories
    - special_considerations
    
  3_home_assessment_findings:
    - property_characteristics_table
    - existing_systems_inventory
    - health_safety_findings:
        priority: critical
        display: prominent_warnings
    - energy_performance_metrics:
        - estimated_current_energy_use
        - estimated_post_retrofit_energy_use
        - percent_improvement
        
  4_prioritized_recommendations:
    structure:
      - priority_level: [critical, high, medium, low]
      - measure_name
      - why_recommended:
          technical_justification: true
          customer_concern_alignment: true
      - specifications:
          - equipment_model_suggestions
          - r_value_targets
          - sizing_calculations
      - cost_breakdown:
          - estimated_material_cost
          - estimated_labor_cost
          - total_project_cost
      - available_incentives:
          - program_name
          - incentive_amount
          - requirements
          - application_process
      - net_cost_to_customer
      - estimated_annual_savings
      - simple_payback
      - energy_savings_kwh_or_therms
      
  5_retrofit_roadmap:
    phased_approach:
      phase_1_immediate:
        timeframe: 0-6_months
        measures: [health_safety, critical_repairs]
        rationale: safety_first
        
      phase_2_envelope:
        timeframe: 6-12_months
        measures: [insulation, air_sealing, windows]
        rationale: reduce_load_before_hvac
        
      phase_3_systems:
        timeframe: 12-24_months
        measures: [heat_pump, water_heater, duct_sealing]
        rationale: maximize_efficiency_with_improved_envelope
        
      phase_4_optimization:
        timeframe: 24+_months
        measures: [solar, battery, ventilation]
        rationale: complete_decarbonization
        
    sequencing_logic:
      - health_safety_always_first
      - envelope_before_hvac_sizing
      - combine_measures_to_save_contractor_trips
      - align_with_customer_budget_and_priorities
      
  6_program_application_guide:
    for_each_program:
      - program_name
      - eligibility_confirmed: yes/no
      - how_to_apply:
          - contact_info
          - required_documents
          - application_steps
          - typical_timeline
      - contractor_requirements:
          - certifications_needed
          - how_to_find_qualified_contractors
          - trade_ally_network_links
          
  7_financial_summary:
    - total_project_cost_all_measures
    - total_available_incentives_all_programs
    - estimated_net_cost
    - estimated_monthly_energy_cost_savings
    - estimated_annual_savings
    - cumulative_10_year_savings
    - simple_payback_period
    - financing_options:
        - energy_trust_financing
        - pace_financing  # Property Assessed Clean Energy
        - utility_on_bill_financing
        - other_low_interest_programs
        
  8_next_steps_action_plan:
    immediate_actions:
      - review_this_report
      - gather_required_income_documentation
      - contact_programs_youre_eligible_for
      - schedule_follow_up_comprehensive_assessment  # If needed
      
    finding_contractors:
      - energy_trust_trade_ally_network
      - bpi_certified_professionals
      - local_community_partners
      - request_multiple_bids
      
    timeline:
      - suggested_application_dates
      - seasonal_considerations
      - program_deadline_awareness
      
  9_appendices:
    - bpi_2400_data_sheet
    - technical_specifications
    - measure_checklist_references
    - program_rule_excerpts
    - warranty_information
    - post_installation_quality_assurance_process

  report_metadata:
    - report_version: 1.0
    - software_version: app_version
    - generated_by: oregon_comprehensive_energy_app
    - disclaimer: standard_disclaimers
    - audit_trail:
        - assessment_completion_timestamp
        - data_validation_checks_passed
        - program_rules_version_used
```

#### 5.2 Report Styling & Format
- **Professional PDF export** with branded header/footer
- **Print-optimized CSS** with page breaks
- **Visual charts** showing energy use, costs, savings
- **Program logos** where appropriate
- **QR codes** linking to application portals
- **Contractor-ready specifications** for bid requests

---

## 6. CONFIGURATION FILES FOR AUDIT & MAINTENANCE

### File Structure
```
config/
├── program_eligibility_rules.yaml       # Section 4.1 above
├── bpi2400_schema.yaml                  # Section 3.1 above
├── technical_specs.yaml                 # BPI standards, Manual J, etc.
├── utility_territories.yaml             # Section 1.1 above
├── measure_specifications.yaml          # From CPF specs
├── incentive_stacking_rules.yaml        # Cross-program validation
├── report_templates.yaml                # Report structure
└── validation_rules.yaml                # Data validation logic

data/
├── oregon_ami_2025.json
├── federal_poverty_guidelines_2025.json
├── climate_zones.json
├── equipment_efficiency_standards.json
└── county_utility_crosswalk.json

docs/
├── AUDIT_LOG.md                         # Track all rule changes
├── PROGRAM_UPDATES.md                   # Document when programs change
├── TECHNICAL_GUIDANCE.md                # BPI-2400 implementation notes
└── API_DOCUMENTATION.md                 # If building API endpoints
```

### Configuration Management
```yaml
version_control:
  config_files_versioned: true
  changelog_required: true
  audit_trail:
    - track_all_rule_changes
    - document_data_source_updates
    - log_program_modifications
    
  validation:
    - automated_schema_validation
    - cross_reference_checks
    - test_suite_for_calculations
    
  update_process:
    triggers:
      - energy_trust_program_update
      - irs_guidance_change
      - state_legislation
      - utility_rate_changes
      
    workflow:
      - update_config_file
      - update_changelog
      - run_validation_tests
      - deploy_to_production
      - notify_users_of_changes
```

---

## 7. RESIDENTIAL INCENTIVE INSIGHTS INTEGRATION

### Reference Projects
Based on your Downloads:
- `energy_trust_cpf_repo_v2.zip` - CPF program specs ✓ Reviewed
- `eto_residential_incentives_2025.numbers` - Incentive rates
- Funding finder HTML/TSX files

### Integration Tasks
1. **Extract incentive data** from .numbers files → JSON
2. **Map to YAML schema** in program_eligibility_rules.yaml
3. **Create measure library** with cost/savings data
4. **Build recommendation engine** using insights
5. **Implement stacking optimization** algorithm

---

## 8. IMPLEMENTATION PRIORITY

### Phase 1: Foundation (Week 1-2)
- [ ] Create all YAML config files
- [ ] Implement BPI-2400 data schema
- [ ] Build utility multi-select with validation
- [ ] Extract incentive data from .numbers files

### Phase 2: Core Logic (Week 3-4)
- [ ] Implement drag-and-drop priority ranking
- [ ] Build eligibility calculation engine
- [ ] Create incentive calculator with stacking logic
- [ ] Implement sizing calculations (Manual J simplified)

### Phase 3: Enhanced Assessment (Week 5-6)
- [ ] Expand assessment form with BPI-2400 fields
- [ ] Add validation rules and field dependencies
- [ ] Implement health/safety prioritization
- [ ] Build recommendation scoring algorithm

### Phase 4: Reporting (Week 7-8)
- [ ] Design comprehensive report template
- [ ] Implement report generation with all sections
- [ ] Add PDF export with professional styling
- [ ] Create contractor bid package export

### Phase 5: Testing & Validation (Week 9-10)
- [ ] Build test suite for calculations
- [ ] Validate against known program scenarios
- [ ] User acceptance testing
- [ ] Documentation completion

---

## 9. SUCCESS CRITERIA

### Functional Requirements
- ✅ All 36 Oregon counties with accurate AMI data
- ✅ Multi-utility selection with territory validation
- ✅ Priority ranking influences recommendations
- ✅ BPI-2400 compliant data capture
- ✅ Accurate eligibility determination for all programs
- ✅ Correct incentive calculations with stacking
- ✅ Professional, actionable customer reports
- ✅ Audit trail for all calculations

### Quality Requirements
- ✅ Configuration-driven (no hard-coded rules)
- ✅ Transparent calculation logic
- ✅ Auditable recommendation engine
- ✅ Version-controlled config files
- ✅ Automated validation tests
- ✅ Clear documentation

### Performance Requirements
- ✅ Sub-second calculation response
- ✅ Works offline after initial load
- ✅ Mobile responsive
- ✅ Print/PDF optimized

---

## 10. NEXT IMMEDIATE ACTIONS

1. **Review this spec** - Confirm alignment with vision
2. **Extract .numbers data** - Convert to JSON/YAML
3. **Create config directory** - Start with program_eligibility_rules.yaml
4. **Identify BPI-2400 resource** - Need actual standard document
5. **Build test cases** - Sample households for validation
6. **Start Phase 1** - Foundation implementation

---

**Document Version:** 1.0  
**Last Updated:** 2025-10-29  
**Status:** Specification Complete - Awaiting Review & Approval
