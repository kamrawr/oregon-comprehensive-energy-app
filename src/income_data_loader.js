/**
 * Income Data Loader
 * Loads and provides access to Oregon 2025 income thresholds
 * Uses exact values from oregon_income_thresholds_full_2025.json
 */

class IncomeDataLoader {
    constructor() {
        this.data = null;
        this.dataByCountyAndSize = {};
    }

    /**
     * Load income data from JSON file
     */
    async loadData() {
        try {
            const response = await fetch('config/oregon_income_thresholds_full_2025.json');
            this.data = await response.json();
            this.indexData();
            return true;
        } catch (error) {
            console.error('Failed to load income data:', error);
            return false;
        }
    }

    /**
     * Index data by county and household size for fast lookup
     */
    indexData() {
        this.dataByCountyAndSize = {};
        
        this.data.forEach(entry => {
            const key = `${entry.county}_${entry.household_size}`;
            this.dataByCountyAndSize[key] = entry;
        });
    }

    /**
     * Get income thresholds for a specific county and household size
     * @param {string} county - County name (e.g., "Baker", "Multnomah")
     * @param {number} householdSize - Number of people in household (1-8)
     * @returns {object} Threshold object with ami_60, ami_80, ami_100, ami_150, smi_60, smi_100, fpl_100, fpl_200
     */
    getThresholds(county, householdSize) {
        // Handle "County" suffix if present
        const countyKey = county.replace(' County', '');
        const key = `${countyKey}_${householdSize}`;
        
        const thresholds = this.dataByCountyAndSize[key];
        
        if (!thresholds) {
            console.error(`No threshold data found for ${county}, household size ${householdSize}`);
            return null;
        }
        
        return thresholds;
    }

    /**
     * Calculate income percentages using exact threshold values
     * @param {number} annualIncome - Annual household income
     * @param {string} county - County name
     * @param {number} householdSize - Household size (1-8)
     * @returns {object} Percentages and exact thresholds
     */
    calculatePercentages(annualIncome, county, householdSize) {
        const thresholds = this.getThresholds(county, householdSize);
        
        if (!thresholds) {
            return null;
        }

        // Calculate percentages using exact 100% values
        const amiPercent = Math.round((annualIncome / thresholds.ami_100) * 100);
        const smiPercent = Math.round((annualIncome / thresholds.smi_100) * 100);
        const fplPercent = Math.round((annualIncome / thresholds.fpl_100) * 100);

        return {
            ami: amiPercent,
            smi: smiPercent,
            fpl: fplPercent,
            
            // Include exact threshold values for reference
            thresholds: {
                ami_60: thresholds.ami_60,
                ami_80: thresholds.ami_80,
                ami_100: thresholds.ami_100,
                ami_150: thresholds.ami_150,
                smi_60: thresholds.smi_60,
                smi_100: thresholds.smi_100,
                fpl_100: thresholds.fpl_100,
                fpl_200: thresholds.fpl_200
            },
            
            // Legacy format for compatibility
            adjustedAMI: thresholds.ami_100,
            adjustedSMI: thresholds.smi_100,
            fplAmount: thresholds.fpl_100
        };
    }

    /**
     * Get list of all counties
     */
    getCounties() {
        if (!this.data) return [];
        
        const counties = [...new Set(this.data.map(entry => entry.county))];
        return counties.sort();
    }

    /**
     * Check if data is loaded
     */
    isLoaded() {
        return this.data !== null && this.data.length > 0;
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IncomeDataLoader;
}
