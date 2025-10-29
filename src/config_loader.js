/**
 * Configuration Loader for Program Rules v2.0
 * 
 * Copyright © 2025 Isaiah Kamrar / Community Consulting Partners LLC
 * All Rights Reserved. Proprietary Software.
 * See LICENSE.md for terms and conditions.
 * 
 * Loads and validates program rules configuration
 * Works in both browser and Node.js environments
 */

class ConfigLoader {
    constructor() {
        this.config = null;
        this.configPath = '../config/program_rules.json';
    }

    /**
     * Load configuration from JSON file
     * Works in both browser (fetch) and Node.js (require) environments
     */
    async loadConfig() {
        if (this.config) {
            return this.config; // Return cached config
        }

        try {
            // Browser environment
            if (typeof window !== 'undefined') {
                const response = await fetch('config/program_rules.json');
                if (!response.ok) {
                    throw new Error(`Failed to load config: ${response.statusText}`);
                }
                this.config = await response.json();
            }
            // Node.js environment
            else if (typeof require !== 'undefined') {
                const fs = require('fs');
                const path = require('path');
                const configPath = path.join(__dirname, this.configPath);
                const data = fs.readFileSync(configPath, 'utf8');
                this.config = JSON.parse(data);
            }
            else {
                throw new Error('Unsupported environment');
            }

            this.validateConfig(this.config);
            console.log(`✅ Loaded program rules config v${this.config.version}`);
            return this.config;

        } catch (error) {
            console.error('❌ Failed to load config:', error);
            throw new Error(`Config load failed: ${error.message}`);
        }
    }

    /**
     * Synchronous config loading for Node.js
     */
    loadConfigSync() {
        if (this.config) {
            return this.config;
        }

        try {
            if (typeof require !== 'undefined') {
                const fs = require('fs');
                const path = require('path');
                const configPath = path.join(__dirname, this.configPath);
                const data = fs.readFileSync(configPath, 'utf8');
                this.config = JSON.parse(data);
                this.validateConfig(this.config);
                return this.config;
            } else {
                throw new Error('Sync loading only available in Node.js');
            }
        } catch (error) {
            console.error('❌ Failed to load config:', error);
            throw new Error(`Config load failed: ${error.message}`);
        }
    }

    /**
     * Validate required configuration fields
     */
    validateConfig(config) {
        const required = [
            'version',
            'income_thresholds',
            'program_caps',
            'homes_coverage_rules',
            'measure_incentives'
        ];

        for (const field of required) {
            if (!config[field]) {
                throw new Error(`Missing required config field: ${field}`);
            }
        }

        // Validate income thresholds
        const thresholds = config.income_thresholds;
        if (!thresholds.weatherization_smi_max || !thresholds.hear_low_income_ami_max) {
            throw new Error('Invalid income_thresholds configuration');
        }

        // Validate program caps
        const caps = config.program_caps;
        if (!caps.hear_household_cap || !caps.homes_flex_site_cap || !caps.certa_household_cap) {
            throw new Error('Invalid program_caps configuration');
        }

        // Validate measure incentives
        if (Object.keys(config.measure_incentives).length === 0) {
            throw new Error('No measure incentives defined in configuration');
        }

        return true;
    }

    /**
     * Get specific config section
     */
    getIncomeThresholds() {
        if (!this.config) {
            throw new Error('Config not loaded. Call loadConfig() first.');
        }
        return this.config.income_thresholds;
    }

    getProgramCaps() {
        if (!this.config) {
            throw new Error('Config not loaded. Call loadConfig() first.');
        }
        return this.config.program_caps;
    }

    getHOMESCoverageRules() {
        if (!this.config) {
            throw new Error('Config not loaded. Call loadConfig() first.');
        }
        return this.config.homes_coverage_rules;
    }

    getMeasureIncentives() {
        if (!this.config) {
            throw new Error('Config not loaded. Call loadConfig() first.');
        }
        return this.config.measure_incentives;
    }

    getCERTAEligibleMeasures() {
        if (!this.config) {
            throw new Error('Config not loaded. Call loadConfig() first.');
        }
        return this.config.certa_eligible_measures || [];
    }

    getNoCostEligibleMeasures() {
        if (!this.config) {
            throw new Error('Config not loaded. Call loadConfig() first.');
        }
        return this.config.no_cost_eligible_measures || [];
    }

    getHOMESAllocationPriority() {
        if (!this.config) {
            throw new Error('Config not loaded. Call loadConfig() first.');
        }
        return this.config.homes_allocation_priority || [];
    }
}

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigLoader;
}

// Also export to window for browser
if (typeof window !== 'undefined') {
    window.ConfigLoader = ConfigLoader;
}
