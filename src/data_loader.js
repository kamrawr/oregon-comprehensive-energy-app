/**
 * Data Loader Module
 * 
 * Copyright © 2025 Isaiah Kamrar / Community Consulting Partners LLC
 * All Rights Reserved. Proprietary Software.
 * See LICENSE.md for terms and conditions.
 * 
 * Loads official incentive and eligibility data from config files
 * Source: config/incentive_eligibility_map.json
 */

class DataLoader {
    constructor() {
        this.dataCache = null;
        this.configPath = 'config/incentive_eligibility_map.json';
    }

    /**
     * Load incentive eligibility data from config file
     */
    async loadIncentiveData() {
        if (this.dataCache) {
            return this.dataCache;
        }

        try {
            const response = await fetch(this.configPath);
            if (!response.ok) {
                throw new Error(`Failed to load config: ${response.status}`);
            }
            
            this.dataCache = await response.json();
            console.log('✓ Loaded official incentive data from config:', this.dataCache.version);
            return this.dataCache;
        } catch (error) {
            console.error('Error loading incentive data:', error);
            // Fallback to embedded data if fetch fails
            return this.getEmbeddedFallbackData();
        }
    }

    /**
     * Get measure incentive amounts by tier
     */
    getMeasureIncentives(measureId, tier) {
        if (!this.dataCache) {
            console.warn('Data not loaded yet. Call loadIncentiveData() first.');
            return null;
        }

        const measure = this.dataCache.measure_incentives[measureId];
        if (!measure) {
            return null;
        }

        return measure.incentive_tiers[tier] || null;
    }

    /**
     * Get all measure data
     */
    getMeasureData(measureId) {
        if (!this.dataCache) {
            return null;
        }
        return this.dataCache.measure_incentives[measureId] || null;
    }

    /**
     * Get income tier definitions
     */
    getIncomeTiers() {
        if (!this.dataCache) {
            return null;
        }
        return this.dataCache.income_tiers || null;
    }

    /**
     * Get stacking rules
     */
    getStackingRules() {
        if (!this.dataCache) {
            return null;
        }
        return this.dataCache.program_stacking_matrix || null;
    }

    /**
     * Get official program contacts
     */
    getOfficialContacts() {
        if (!this.dataCache) {
            return null;
        }
        return this.dataCache.official_contacts || null;
    }

    /**
     * Embedded fallback data (in case config file can't be loaded)
     * Uses same structure as config file but minimal data
     */
    getEmbeddedFallbackData() {
        console.warn('Using embedded fallback data - config file not accessible');
        return {
            version: "1.0-fallback",
            last_updated: "2025-10-29",
            source: "embedded fallback",
            disclaimer: "Using embedded data - verify all amounts with official program administrators",
            
            measure_incentives: {
                heat_pump_ductless: {
                    incentive_tiers: {
                        cpf_single_family: { amount: 1800 },
                        cpf_manufactured_home: { amount: 3500 },
                        hear_low_income: { amount: 8000 },
                        hear_moderate_income: { amount: 4000 },
                        standard_market_rate: { amount: 800 }
                    }
                },
                heat_pump_ducted: {
                    incentive_tiers: {
                        cpf_single_family: { amount: 4000 },
                        hear_low_income: { amount: 8000 },
                        hear_moderate_income: { amount: 4000 },
                        standard_market_rate: { amount: 1500 }
                    }
                },
                attic_insulation: {
                    incentive_tiers: {
                        cpf: { amount_per_sqft: 1.5 },
                        hear_insulation: 1600,
                        standard_market_rate: { amount_per_sqft: 0.10 }
                    }
                }
            },
            
            official_contacts: {
                energy_trust: {
                    name: "Energy Trust of Oregon",
                    phone: "1-866-368-7878",
                    website: "energytrust.org"
                },
                oregon_weatherization: {
                    name: "Oregon Housing & Community Services",
                    phone: "1-800-766-6861",
                    website: "oregon.gov/ohcs/energy-weatherization"
                },
                oregon_doe: {
                    name: "Oregon Department of Energy",
                    phone: "1-800-221-8035",
                    website: "oregon.gov/energy"
                }
            }
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataLoader;
}
