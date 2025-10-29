/**
 * Oregon Energy Assessment Report Generator
 * 
 * Copyright © 2025 Isaiah Kamrar
 * All Rights Reserved. Proprietary Software.
 * See LICENSE.md for terms and conditions.
 * 
 * Generates comprehensive 9-section professional reports aligned with:
 * - BPI-2400 standards
 * - Energy Trust specifications
 * - IRA program requirements
 * 
 * Report Sections:
 * 1. Executive Summary
 * 2. Eligibility Profile
 * 3. Home Assessment Findings
 * 4. Prioritized Recommendations
 * 5. Retrofit Roadmap (Phased)
 * 6. Program Application Guide
 * 7. Financial Summary
 * 8. Next Steps Action Plan
 * 9. Appendices
 */

class ReportGenerator {
    constructor() {
        this.reportVersion = '1.0';
        this.generatedDate = new Date();
    }

    /**
     * Generate complete comprehensive report
     */
    generateReport(customerData, incomeData, assessmentData, incentiveResults) {
        const sections = {
            section1: this.generateExecutiveSummary(customerData, incomeData, incentiveResults),
            section2: this.generateEligibilityProfile(customerData, incomeData, incentiveResults.eligiblePrograms),
            section3: this.generateHomeAssessmentFindings(assessmentData, customerData),
            section4: this.generatePrioritizedRecommendations(incentiveResults.recommendations, customerData),
            section5: this.generateRetrofitRoadmap(incentiveResults.recommendations),
            section6: this.generateProgramApplicationGuide(incentiveResults.eligiblePrograms),
            section7: this.generateFinancialSummary(incentiveResults),
            section8: this.generateActionPlan(customerData, incentiveResults),
            section9: this.generateAppendices(assessmentData, customerData)
        };

        return this.assembleHTMLReport(sections, customerData);
    }

    /**
     * SECTION 1: Executive Summary
     */
    generateExecutiveSummary(customerData, incomeData, incentiveResults) {
        const assessmentId = customerData.customerId || this.generateAssessmentId();
        const totalCost = incentiveResults.totalEstimatedCost || 0;
        const totalIncentives = incentiveResults.totalAvailableIncentives || 0;
        const netCost = incentiveResults.estimatedNetCost || 0;
        const estimatedSavings = this.calculateAnnualSavings(incentiveResults.recommendations);
        const payback = netCost > 0 ? (netCost / estimatedSavings).toFixed(1) : 0;

        return `
            <div class="report-section executive-summary">
                <h2 class="section-title">📊 Executive Summary</h2>
                
                <div class="summary-header">
                    <div class="summary-meta">
                        <div class="meta-row">
                            <span class="meta-label">Assessment ID:</span>
                            <span class="meta-value">${assessmentId}</span>
                        </div>
                        <div class="meta-row">
                            <span class="meta-label">Assessment Date:</span>
                            <span class="meta-value">${this.formatDate(this.generatedDate)}</span>
                        </div>
                        <div class="meta-row">
                            <span class="meta-label">Customer:</span>
                            <span class="meta-value">${customerData.firstName} ${customerData.lastName}</span>
                        </div>
                        <div class="meta-row">
                            <span class="meta-label">Property Location:</span>
                            <span class="meta-value">${customerData.county}, Oregon</span>
                        </div>
                        <div class="meta-row">
                            <span class="meta-label">Housing Type:</span>
                            <span class="meta-value">${this.formatHousingType(customerData.housingType)}</span>
                        </div>
                    </div>
                </div>

                <div class="key-findings">
                    <h3>🎯 Key Findings</h3>
                    <div class="findings-grid">
                        <div class="finding-card cost-card">
                            <div class="finding-icon">💵</div>
                            <div class="finding-value">$${totalCost.toLocaleString()}</div>
                            <div class="finding-label">Total Estimated Project Cost</div>
                        </div>
                        <div class="finding-card incentive-card">
                            <div class="finding-icon">🎁</div>
                            <div class="finding-value">$${totalIncentives.toLocaleString()}</div>
                            <div class="finding-label">Available Incentives</div>
                        </div>
                        <div class="finding-card net-card">
                            <div class="finding-icon">💰</div>
                            <div class="finding-value">$${netCost.toLocaleString()}</div>
                            <div class="finding-label">Estimated Net Cost</div>
                        </div>
                        <div class="finding-card savings-card">
                            <div class="finding-icon">📉</div>
                            <div class="finding-value">$${estimatedSavings.toLocaleString()}/yr</div>
                            <div class="finding-label">Estimated Annual Savings</div>
                        </div>
                    </div>
                </div>

                <div class="executive-summary-text">
                    <p><strong>Property Overview:</strong> This ${incomeData.householdSize}-person household in ${customerData.county} 
                    qualifies for ${incentiveResults.eligiblePrograms.federal.length + incentiveResults.eligiblePrograms.state.length} 
                    energy assistance programs.</p>
                    
                    <p><strong>Investment Summary:</strong> The recommended energy efficiency improvements total 
                    $${totalCost.toLocaleString()}, with up to $${totalIncentives.toLocaleString()} in available incentives, 
                    reducing your out-of-pocket cost to approximately $${netCost.toLocaleString()}. 
                    These improvements will save an estimated $${estimatedSavings.toLocaleString()} annually on energy costs, 
                    with a simple payback period of ${payback} years.</p>
                </div>
            </div>
        `;
    }

    /**
     * SECTION 2: Eligibility Profile
     */
    generateEligibilityProfile(customerData, incomeData, eligiblePrograms) {
        const allPrograms = [
            ...eligiblePrograms.federal,
            ...eligiblePrograms.state,
            ...eligiblePrograms.utility
        ];

        let programBadges = '';
        allPrograms.forEach(program => {
            const badgeClass = program.incomeQualified ? 'badge-income-qualified' : 'badge-standard';
            const icon = program.incomeQualified ? '⭐' : '✓';
            programBadges += `
                <div class="program-badge ${badgeClass}">
                    <span class="badge-icon">${icon}</span>
                    <span class="badge-name">${program.name}</span>
                    ${program.maxRebate ? `<span class="badge-amount">Up to $${program.maxRebate.toLocaleString()}</span>` : ''}
                </div>
            `;
        });

        const utilityList = customerData.allUtilities.map(u => this.formatUtilityName(u)).join(', ');

        return `
            <div class="report-section eligibility-profile">
                <h2 class="section-title">✅ Eligibility Profile</h2>
                
                <div class="eligibility-summary">
                    <div class="eligibility-row">
                        <span class="eligibility-label">Income Status:</span>
                        <span class="eligibility-value">${incomeData.amiPercent}% AMI (${incomeData.fplPercent}% FPL)</span>
                    </div>
                    <div class="eligibility-row">
                        <span class="eligibility-label">County AMI:</span>
                        <span class="eligibility-value">$${incomeData.ami.toLocaleString()}</span>
                    </div>
                    <div class="eligibility-row">
                        <span class="eligibility-label">Service Territory:</span>
                        <span class="eligibility-value">${utilityList}</span>
                    </div>
                    <div class="eligibility-row">
                        <span class="eligibility-label">Property Type:</span>
                        <span class="eligibility-value">${this.formatHousingType(customerData.housingType)} - ${customerData.ownershipStatus}</span>
                    </div>
                </div>

                <h3>🎫 Your Eligible Programs</h3>
                <div class="program-badges-container">
                    ${programBadges}
                </div>

                ${incomeData.amiPercent <= 80 ? `
                    <div class="special-notice income-qualified-notice">
                        <h4>⭐ Income-Qualified Status</h4>
                        <p>You qualify for enhanced incentives through income-qualified programs, including potential 
                        no-cost weatherization services and increased rebate percentages.</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * SECTION 3: Home Assessment Findings
     */
    generateHomeAssessmentFindings(assessmentData, customerData) {
        let healthSafetyWarnings = '';
        if (assessmentData.healthSafety && assessmentData.healthSafety.length > 0 && 
            !assessmentData.healthSafety.includes('none')) {
            healthSafetyWarnings = `
                <div class="critical-warning">
                    <h4>⚠️ Health & Safety Findings</h4>
                    <ul>
                        ${assessmentData.healthSafety.map(issue => `<li>${this.formatHealthSafetyIssue(issue)}</li>`).join('')}
                    </ul>
                    <p><strong>Action Required:</strong> These issues must be addressed before proceeding with energy efficiency improvements.</p>
                </div>
            `;
        }

        return `
            <div class="report-section home-assessment">
                <h2 class="section-title">🏠 Home Assessment Findings</h2>
                
                ${healthSafetyWarnings}

                <h3>Property Characteristics</h3>
                <table class="assessment-table">
                    <tr>
                        <th>Component</th>
                        <th>Current Condition</th>
                        <th>Finding</th>
                    </tr>
                    <tr>
                        <td><strong>Building Size</strong></td>
                        <td>${assessmentData.homeSize || 'Not specified'} sq ft</td>
                        <td>${this.assessHomeSize(assessmentData.homeSize)}</td>
                    </tr>
                    <tr>
                        <td><strong>Attic Insulation</strong></td>
                        <td>${this.formatCondition(assessmentData.atticInsulation)} (R-${assessmentData.currentAtticR || '?'})</td>
                        <td>${this.assessInsulation(assessmentData.atticInsulation)}</td>
                    </tr>
                    <tr>
                        <td><strong>Wall Insulation</strong></td>
                        <td>${this.formatCondition(assessmentData.wallInsulation)}</td>
                        <td>${this.assessInsulation(assessmentData.wallInsulation)}</td>
                    </tr>
                    <tr>
                        <td><strong>Floor/Foundation</strong></td>
                        <td>${this.formatFoundation(assessmentData.foundationType)}</td>
                        <td>${this.assessFoundation(assessmentData.foundationType)}</td>
                    </tr>
                    <tr>
                        <td><strong>Air Sealing</strong></td>
                        <td>${this.formatCondition(assessmentData.airSealing)}</td>
                        <td>${this.assessAirSealing(assessmentData.airSealing)}</td>
                    </tr>
                    <tr>
                        <td><strong>Windows</strong></td>
                        <td>${this.formatCondition(assessmentData.windowCondition)} (${assessmentData.windowCount || '?'} windows)</td>
                        <td>${this.assessWindows(assessmentData.windowCondition)}</td>
                    </tr>
                    <tr>
                        <td><strong>Heating System</strong></td>
                        <td>${this.formatHeatingSystem(assessmentData.heatingSystem)} (${assessmentData.heatingAge || '?'} years old)</td>
                        <td>${this.assessHeatingSystem(assessmentData.heatingSystem, assessmentData.heatingAge)}</td>
                    </tr>
                    <tr>
                        <td><strong>Cooling System</strong></td>
                        <td>${this.formatCoolingSystem(assessmentData.coolingSystem)}</td>
                        <td>${this.assessCoolingSystem(assessmentData.coolingSystem)}</td>
                    </tr>
                    <tr>
                        <td><strong>Water Heater</strong></td>
                        <td>${this.formatWaterHeater(assessmentData.waterHeaterType)} (${assessmentData.waterHeaterAge || '?'} years old)</td>
                        <td>${this.assessWaterHeater(assessmentData.waterHeaterType, assessmentData.waterHeaterAge)}</td>
                    </tr>
                </table>

                <h3>Energy Performance Estimate</h3>
                <div class="energy-performance">
                    <p>Based on your home's current condition, estimated annual energy costs are higher than necessary. 
                    The recommended improvements could reduce your energy consumption by 25-40% annually.</p>
                </div>
            </div>
        `;
    }

    /**
     * SECTION 4: Prioritized Recommendations
     */
    generatePrioritizedRecommendations(recommendations, customerData) {
        let recsHTML = '';
        
        recommendations.forEach((rec, index) => {
            const priorityClass = this.getPriorityClass(rec.priority);
            const concernMatches = this.matchesConcerns(rec, customerData.prioritizedConcerns);
            
            recsHTML += `
                <div class="recommendation-card ${priorityClass}">
                    <div class="rec-header">
                        <span class="rec-number">#${index + 1}</span>
                        <h4 class="rec-title">${rec.description}</h4>
                        <span class="rec-priority">${rec.priority}</span>
                    </div>
                    
                    <div class="rec-body">
                        <div class="rec-why">
                            <strong>Why Recommended:</strong>
                            <p>${this.generateRecommendationRationale(rec)}</p>
                            ${concernMatches ? `<p class="concern-match">✓ Addresses your priority: ${concernMatches}</p>` : ''}
                        </div>

                        <div class="rec-specs">
                            <strong>Specifications:</strong>
                            ${this.generateSpecifications(rec)}
                        </div>

                        <div class="rec-cost-breakdown">
                            <table class="cost-table">
                                <tr>
                                    <td>Estimated Project Cost:</td>
                                    <td class="cost-value">$${rec.estimatedCost.toLocaleString()}</td>
                                </tr>
                                ${rec.availableIncentives && rec.availableIncentives.length > 0 ? `
                                    ${rec.availableIncentives.map(inc => `
                                        <tr class="incentive-row">
                                            <td>  ${inc.program} Incentive:</td>
                                            <td class="incentive-value">-$${inc.amount.toLocaleString()}</td>
                                        </tr>
                                    `).join('')}
                                    <tr class="net-cost-row">
                                        <td><strong>Your Net Cost:</strong></td>
                                        <td class="net-cost-value"><strong>$${this.calculateNetCost(rec).toLocaleString()}</strong></td>
                                    </tr>
                                ` : ''}
                                ${rec.estimatedSavings ? `
                                    <tr class="savings-row">
                                        <td>Annual Energy Savings:</td>
                                        <td class="savings-value">$${rec.estimatedSavings.toLocaleString()}/year</td>
                                    </tr>
                                    <tr>
                                        <td>Simple Payback:</td>
                                        <td>${rec.paybackYears} years</td>
                                    </tr>
                                ` : ''}
                            </table>
                        </div>

                        ${rec.availableIncentives && rec.availableIncentives.length > 0 ? `
                            <div class="rec-incentive-details">
                                <strong>How to Apply:</strong>
                                ${rec.availableIncentives.map(inc => `
                                    <div class="incentive-application">
                                        <p><strong>${inc.program}:</strong> ${inc.applicationProcess}</p>
                                        <p class="requirements">Requirements: ${inc.requirements.join(', ')}</p>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        return `
            <div class="report-section recommendations">
                <h2 class="section-title">🎯 Prioritized Recommendations</h2>
                <p class="section-intro">Based on your home assessment and stated priorities, here are your recommended improvements 
                ranked by importance, cost-effectiveness, and alignment with your concerns.</p>
                
                <div class="recommendations-list">
                    ${recsHTML}
                </div>
            </div>
        `;
    }

    /**
     * SECTION 5: Retrofit Roadmap (Phased Approach)
     */
    generateRetrofitRoadmap(recommendations) {
        const phases = this.organizeIntoPhases(recommendations);

        return `
            <div class="report-section roadmap">
                <h2 class="section-title">🗺️ Retrofit Roadmap</h2>
                <p class="section-intro">A strategic phased approach to maximize efficiency and cost-effectiveness.</p>

                ${Object.keys(phases).map(phaseKey => {
                    const phase = phases[phaseKey];
                    return `
                        <div class="phase-card">
                            <div class="phase-header">
                                <h3>${phase.name}</h3>
                                <span class="phase-timeline">${phase.timeline}</span>
                            </div>
                            <div class="phase-body">
                                <p class="phase-rationale"><strong>Why This Phase:</strong> ${phase.rationale}</p>
                                <ul class="phase-measures">
                                    ${phase.measures.map(m => `<li>${m.description} - $${m.estimatedCost.toLocaleString()}</li>`).join('')}
                                </ul>
                                <p class="phase-cost"><strong>Phase Investment:</strong> $${phase.totalCost.toLocaleString()}</p>
                            </div>
                        </div>
                    `;
                }).join('')}

                <div class="sequencing-guidance">
                    <h4>💡 Sequencing Guidance</h4>
                    <ul>
                        <li>✓ Address health and safety issues first</li>
                        <li>✓ Complete envelope improvements before HVAC upgrades (right-size equipment)</li>
                        <li>✓ Combine measures when possible to save on contractor mobilization costs</li>
                        <li>✓ Align work with your budget and program application timelines</li>
                    </ul>
                </div>
            </div>
        `;
    }

    /**
     * SECTION 6: Program Application Guide
     */
    generateProgramApplicationGuide(eligiblePrograms) {
        const allPrograms = [
            ...eligiblePrograms.federal,
            ...eligiblePrograms.state,
            ...eligiblePrograms.utility
        ];

        let programGuides = '';
        allPrograms.forEach(program => {
            programGuides += `
                <div class="program-guide-card">
                    <h4>${program.name}</h4>
                    <p class="program-description">${program.description}</p>
                    
                    <div class="program-details">
                        ${program.maxRebate ? `<p><strong>Maximum Rebate:</strong> $${program.maxRebate.toLocaleString()}</p>` : ''}
                        ${program.requiresEnergyModeling ? `<p class="requirement">⚠️ Requires energy modeling</p>` : ''}
                        
                        <div class="how-to-apply">
                            <strong>How to Apply:</strong>
                            ${this.generateApplicationSteps(program)}
                        </div>

                        <div class="program-contacts">
                            ${this.generateProgramContacts(program)}
                        </div>
                    </div>
                </div>
            `;
        });

        return `
            <div class="report-section program-guide">
                <h2 class="section-title">📋 Program Application Guide</h2>
                <p class="section-intro">Step-by-step guidance for applying to each program you're eligible for.</p>
                
                <div class="program-guides-container">
                    ${programGuides}
                </div>

                <div class="contractor-guidance">
                    <h3>🔧 Finding Qualified Contractors</h3>
                    <ul>
                        <li><strong>Energy Trust Trade Ally Network:</strong> energytrust.org/trade-ally-directory</li>
                        <li><strong>BPI Certified Professionals:</strong> bpi.org/professionals</li>
                        <li><strong>Local Community Partners:</strong> Contact your local Community Action Agency</li>
                    </ul>
                    <p><em>Always request multiple bids and verify contractor certifications.</em></p>
                </div>
            </div>
        `;
    }

    /**
     * SECTION 7: Financial Summary
     */
    generateFinancialSummary(incentiveResults) {
        const totalCost = incentiveResults.totalEstimatedCost;
        const totalIncentives = incentiveResults.totalAvailableIncentives;
        const netCost = incentiveResults.estimatedNetCost;
        const annualSavings = this.calculateAnnualSavings(incentiveResults.recommendations);
        const monthlySavings = Math.floor(annualSavings / 12);
        const tenYearSavings = annualSavings * 10;

        return `
            <div class="report-section financial-summary">
                <h2 class="section-title">💰 Financial Summary</h2>
                
                <div class="financial-overview">
                    <table class="financial-table">
                        <tr class="total-row">
                            <td>Total Project Cost (All Measures):</td>
                            <td class="cost-value">$${totalCost.toLocaleString()}</td>
                        </tr>
                        <tr class="incentive-row">
                            <td>Total Available Incentives:</td>
                            <td class="incentive-value">-$${totalIncentives.toLocaleString()}</td>
                        </tr>
                        <tr class="net-row">
                            <td><strong>Estimated Net Cost to You:</strong></td>
                            <td class="net-value"><strong>$${netCost.toLocaleString()}</strong></td>
                        </tr>
                        <tr class="divider-row"><td colspan="2"></td></tr>
                        <tr class="savings-row">
                            <td>Estimated Monthly Energy Savings:</td>
                            <td class="savings-value">$${monthlySavings}/month</td>
                        </tr>
                        <tr class="savings-row">
                            <td>Estimated Annual Energy Savings:</td>
                            <td class="savings-value">$${annualSavings.toLocaleString()}/year</td>
                        </tr>
                        <tr class="savings-row">
                            <td>Cumulative 10-Year Savings:</td>
                            <td class="savings-value">$${tenYearSavings.toLocaleString()}</td>
                        </tr>
                        <tr class="divider-row"><td colspan="2"></td></tr>
                        <tr class="payback-row">
                            <td><strong>Simple Payback Period:</strong></td>
                            <td><strong>${netCost > 0 ? (netCost / annualSavings).toFixed(1) : 0} years</strong></td>
                        </tr>
                    </table>
                </div>

                <h3>💳 Financing Calculator</h3>
                <div class="financing-calculator">
                    <p>Estimated monthly payments for your net cost of <strong>$${netCost.toLocaleString()}</strong> over a 5-year term:</p>
                    <table class="financing-table">
                        <tr class="table-header">
                            <th>Interest Rate</th>
                            <th>Monthly Payment</th>
                            <th>Total Paid</th>
                            <th>Total Interest</th>
                        </tr>
                        <tr class="highlight-row">
                            <td><strong>0% APR</strong></td>
                            <td class="payment-value"><strong>$${Math.round(netCost / 60).toLocaleString()}/month</strong></td>
                            <td>$${netCost.toLocaleString()}</td>
                            <td class="savings-value">$0</td>
                        </tr>
                        <tr>
                            <td>15% APR</td>
                            <td class="payment-value">$${this.calculateMonthlyPayment(netCost, 0.15, 60).toLocaleString()}/month</td>
                            <td>$${Math.round(this.calculateMonthlyPayment(netCost, 0.15, 60) * 60).toLocaleString()}</td>
                            <td>$${Math.round((this.calculateMonthlyPayment(netCost, 0.15, 60) * 60) - netCost).toLocaleString()}</td>
                        </tr>
                    </table>
                    <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;"><em>Note: 0% financing may be available through Energy Trust or utility programs for qualified customers.</em></p>
                </div>
                
                <h3 style="margin-top: 2rem;">💰 Program Benefits Breakdown</h3>
                ${this.generateProgramBreakdown(incentiveResults.recommendations)}
                
                <h3 style="margin-top: 2rem;">Financing Programs</h3>
                <div class="financing-options">
                    <div class="financing-card">
                        <h4>Energy Trust Financing</h4>
                        <p>Low-interest loans for energy efficiency projects. Often paired with incentives.</p>
                        <p class="contact-info">Call: 1-866-368-7878</p>
                    </div>
                    <div class="financing-card">
                        <h4>PACE Financing</h4>
                        <p>Property Assessed Clean Energy - repaid through property taxes over time.</p>
                        <p class="contact-info">Check county availability</p>
                    </div>
                    <div class="financing-card">
                        <h4>Utility On-Bill Financing</h4>
                        <p>Some utilities offer financing repaid through your monthly utility bill.</p>
                        <p class="contact-info">Contact your utility provider</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * SECTION 8: Next Steps Action Plan
     */
    generateActionPlan(customerData, incentiveResults) {
        const hasWeatherization = incentiveResults.eligiblePrograms.state.some(p => p.id === 'swr');

        return `
            <div class="report-section action-plan">
                <h2 class="section-title">🚀 Next Steps - Your Action Plan</h2>
                
                <div class="immediate-actions">
                    <h3>Immediate Actions (This Week)</h3>
                    <ol class="action-list">
                        <li class="action-item">
                            <strong>Review this report thoroughly</strong> - Share with family members and discuss priorities
                        </li>
                        ${incentiveResults.eligiblePrograms.federal.some(p => p.incomeQualified) ? `
                        <li class="action-item">
                            <strong>Gather income documentation</strong> - Recent tax returns, pay stubs, or benefit award letters
                        </li>
                        ` : ''}
                        ${hasWeatherization ? `
                        <li class="action-item priority-action">
                            <strong>Contact Oregon Weatherization Program</strong> - You qualify for no-cost comprehensive services
                            <br>📞 1-800-766-6861
                        </li>
                        ` : ''}
                        <li class="action-item">
                            <strong>Contact eligible programs</strong> - Start with highest-value programs first
                        </li>
                        <li class="action-item">
                            <strong>Schedule follow-up assessment</strong> - if needed for detailed specifications
                        </li>
                    </ol>
                </div>

                <div class="finding-contractors">
                    <h3>Finding & Vetting Contractors</h3>
                    <div class="contractor-steps">
                        <div class="step">
                            <strong>1. Use Energy Trust Trade Ally Directory</strong>
                            <p>Visit energytrust.org/find-a-contractor</p>
                        </div>
                        <div class="step">
                            <strong>2. Request Multiple Bids</strong>
                            <p>Get at least 3 quotes to compare pricing and approach</p>
                        </div>
                        <div class="step">
                            <strong>3. Verify Certifications</strong>
                            <p>Check for BPI, NATE, or Trade Ally certifications</p>
                        </div>
                        <div class="step">
                            <strong>4. Review References</strong>
                            <p>Ask for recent customer references and check reviews</p>
                        </div>
                    </div>
                </div>

                <div class="timeline-considerations">
                    <h3>⏰ Timeline & Seasonal Considerations</h3>
                    <ul>
                        <li>Winter: Best time for insulation work (contractors less busy)</li>
                        <li>Spring/Fall: Ideal for HVAC installations (moderate weather)</li>
                        <li>Summer: Higher demand for cooling upgrades</li>
                        <li>Program Deadlines: Some incentives have funding caps - apply early</li>
                    </ul>
                </div>
            </div>
        `;
    }

    /**
     * SECTION 9: Appendices
     */
    generateAppendices(assessmentData, customerData) {
        return `
            <div class="report-section appendices">
                <h2 class="section-title">📎 Appendices</h2>
                
                <div class="appendix">
                    <h3>A. Assessment Data Summary</h3>
                    <pre class="data-summary">${JSON.stringify(assessmentData, null, 2)}</pre>
                </div>

                <div class="appendix">
                    <h3>B. Important Contacts</h3>
                    <table class="contacts-table">
                        <tr>
                            <td><strong>Oregon Weatherization:</strong></td>
                            <td>1-800-766-6861 | oregon.gov/ohcs</td>
                        </tr>
                        <tr>
                            <td><strong>Energy Trust of Oregon:</strong></td>
                            <td>1-866-368-7878 | energytrust.org</td>
                        </tr>
                        <tr>
                            <td><strong>Oregon Dept of Energy:</strong></td>
                            <td>1-800-221-8035 | oregon.gov/energy</td>
                        </tr>
                        <tr>
                            <td><strong>Local Community Action Agency:</strong></td>
                            <td>Contact for income-qualified programs</td>
                        </tr>
                    </table>
                </div>

                <div class="appendix">
                    <h3>C. Glossary of Terms</h3>
                    <dl class="glossary">
                        <dt>AMI (Area Median Income):</dt>
                        <dd>The midpoint of a region's income distribution. Used to determine program eligibility.</dd>
                        
                        <dt>BPI-2400:</dt>
                        <dd>Building Performance Institute standard for comprehensive home energy assessments.</dd>
                        
                        <dt>Heat Pump:</dt>
                        <dd>An efficient heating and cooling system that moves heat rather than generating it.</dd>
                        
                        <dt>HSPF2:</dt>
                        <dd>Heating Seasonal Performance Factor - efficiency rating for heat pumps.</dd>
                        
                        <dt>R-Value:</dt>
                        <dd>Measure of insulation's resistance to heat flow. Higher R-values = better insulation.</dd>
                    </dl>
                </div>

                <div class="disclaimer">
                    <h3>Disclaimer</h3>
                    <p><em>This report provides estimates based on the information provided and typical program guidelines. 
                    Actual costs, savings, and incentive amounts may vary. Final program eligibility and incentive amounts 
                    are determined by program administrators. This assessment does not constitute a guarantee of program 
                    participation or incentive availability. Always verify current program rules and funding availability 
                    before proceeding.</em></p>
                    
                    <p><strong>Report Version:</strong> ${this.reportVersion} | 
                    <strong>Generated:</strong> ${this.formatDateTime(this.generatedDate)}</p>
                </div>
            </div>
        `;
    }

    /**
     * Assemble complete HTML report with styling
     */
    assembleHTMLReport(sections, customerData) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Energy Assessment Report - ${customerData.customerId}</title>
    ${this.getReportStyles()}
</head>
<body>
    <div class="report-container">
        <header class="report-header">
            <h1>Oregon Comprehensive Energy Assessment Report</h1>
            <div class="report-subtitle">
                ${customerData.firstName} ${customerData.lastName} | ${customerData.county}, Oregon
            </div>
        </header>

        ${sections.section1}
        ${sections.section2}
        ${sections.section3}
        ${sections.section4}
        ${sections.section5}
        ${sections.section6}
        ${sections.section7}
        ${sections.section8}
        ${sections.section9}

        <footer class="report-footer">
            <p>Generated by Oregon Comprehensive Energy Assessment Tool</p>
            <p>${this.formatDateTime(this.generatedDate)}</p>
        </footer>
    </div>
</body>
</html>
        `;
    }

    /**
     * Report CSS Styles
     */
    getReportStyles() {
        return `
<style>
    @media print {
        .report-section { page-break-inside: avoid; }
        .recommendation-card { page-break-inside: avoid; }
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        background: #f5f5f5;
        padding: 20px;
    }
    
    .report-container {
        max-width: 1000px;
        margin: 0 auto;
        background: white;
        padding: 40px;
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    
    .report-header {
        text-align: center;
        border-bottom: 4px solid #2c5530;
        padding-bottom: 20px;
        margin-bottom: 40px;
    }
    
    .report-header h1 {
        color: #2c5530;
        font-size: 2.2rem;
        margin-bottom: 10px;
    }
    
    .report-subtitle {
        color: #666;
        font-size: 1.1rem;
    }
    
    .report-section {
        margin-bottom: 40px;
    }
    
    .section-title {
        color: #2c5530;
        font-size: 1.8rem;
        border-bottom: 2px solid #5cb85c;
        padding-bottom: 10px;
        margin-bottom: 20px;
    }
    
    .section-intro {
        background: #f9fafb;
        padding: 15px;
        border-left: 4px solid #5cb85c;
        margin-bottom: 20px;
    }
    
    /* Executive Summary Styles */
    .summary-meta {
        background: #f9fafb;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
    }
    
    .meta-row {
        display: flex;
        padding: 8px 0;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .meta-row:last-child { border-bottom: none; }
    
    .meta-label {
        font-weight: 600;
        width: 200px;
        color: #666;
    }
    
    .meta-value {
        flex: 1;
        color: #333;
    }
    
    .findings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin: 20px 0;
    }
    
    .finding-card {
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        border: 2px solid #e0e0e0;
    }
    
    .finding-icon {
        font-size: 2.5rem;
        margin-bottom: 10px;
    }
    
    .finding-value {
        font-size: 1.8rem;
        font-weight: bold;
        color: #2c5530;
        margin-bottom: 8px;
    }
    
    .finding-label {
        font-size: 0.9rem;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    /* Program Badges */
    .program-badges-container {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin: 20px 0;
    }
    
    .program-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        border-radius: 999px;
        font-size: 0.9rem;
        font-weight: 600;
    }
    
    .badge-income-qualified {
        background: #d4edda;
        border: 2px solid #28a745;
        color: #155724;
    }
    
    .badge-standard {
        background: #d1ecf1;
        border: 2px solid #17a2b8;
        color: #0c5460;
    }
    
    /* Recommendations */
    .recommendation-card {
        background: white;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    
    .recommendation-card.priority-critical {
        border-color: #dc3545;
        background: #fff5f5;
    }
    
    .recommendation-card.priority-high {
        border-color: #ffc107;
    }
    
    .rec-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
    }
    
    .rec-number {
        background: #2c5530;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 1.1rem;
    }
    
    .rec-title {
        flex: 1;
        color: #2c5530;
        font-size: 1.2rem;
    }
    
    .rec-priority {
        padding: 6px 12px;
        border-radius: 999px;
        font-size: 0.85rem;
        font-weight: 600;
        background: #f0f0f0;
    }
    
    /* Tables */
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
    }
    
    th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #e0e0e0;
    }
    
    th {
        background: #2c5530;
        color: white;
        font-weight: 600;
    }
    
    tr:hover {
        background: #f9fafb;
    }
    
    .cost-value { color: #dc3545; font-weight: 600; }
    .incentive-value { color: #28a745; font-weight: 600; }
    .net-value { color: #2c5530; font-size: 1.2rem; }
    .savings-value { color: #17a2b8; font-weight: 600; }
    
    /* Phase Cards */
    .phase-card {
        background: #f9fafb;
        border-left: 4px solid #5cb85c;
        padding: 20px;
        margin-bottom: 20px;
        border-radius: 8px;
    }
    
    .phase-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }
    
    .phase-timeline {
        background: #5cb85c;
        color: white;
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 0.85rem;
        font-weight: 600;
    }
    
    .critical-warning {
        background: #fff3cd;
        border-left: 4px solid #ffc107;
        padding: 20px;
        margin-bottom: 20px;
        border-radius: 8px;
    }
    
    .critical-warning h4 {
        color: #856404;
        margin-bottom: 10px;
    }
    
    .report-footer {
        text-align: center;
        padding-top: 40px;
        border-top: 2px solid #e0e0e0;
        color: #666;
        font-size: 0.9rem;
    }
</style>
        `;
    }

    // === HELPER METHODS ===

    generateAssessmentId() {
        return 'OR-' + Date.now().toString(36).toUpperCase();
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    formatDateTime(date) {
        return new Date(date).toLocaleString('en-US');
    }

    formatHousingType(type) {
        const types = {
            'single_family': 'Single Family Home',
            'multi_family': 'Multi-Family',
            'townhome': 'Townhome',
            'manufactured': 'Manufactured Home',
            'condo': 'Condominium'
        };
        return types[type] || type;
    }

    formatUtilityName(id) {
        const names = {
            'pge': 'Portland General Electric',
            'pacific_power': 'Pacific Power',
            'eweb': 'EWEB',
            'municipal': 'Municipal',
            'nw_natural': 'NW Natural',
            'cascade': 'Cascade Natural Gas',
            'avista': 'Avista',
            'propane': 'Propane'
        };
        return names[id] || id;
    }

    formatCondition(condition) {
        const conditions = {
            'poor': 'Poor',
            'fair': 'Fair',
            'good': 'Good',
            'excellent': 'Excellent',
            'none': 'None'
        };
        return conditions[condition] || condition || 'Not specified';
    }

    formatHeatingSystem(system) {
        const systems = {
            'electric_resistance': 'Electric Baseboard/Wall Heaters',
            'gas_furnace': 'Gas Furnace',
            'oil_furnace': 'Oil Furnace',
            'heat_pump': 'Heat Pump',
            'wood_stove': 'Wood Stove',
            'none': 'No Central Heating'
        };
        return systems[system] || system;
    }

    formatCoolingSystem(system) {
        const systems = {
            'central_ac': 'Central Air Conditioning',
            'window_ac': 'Window AC Units',
            'heat_pump': 'Heat Pump',
            'none': 'No Cooling System'
        };
        return systems[system] || system;
    }

    formatWaterHeater(type) {
        const types = {
            'electric_tank': 'Electric Tank',
            'gas_tank': 'Gas Tank',
            'tankless': 'Tankless',
            'heat_pump': 'Heat Pump Water Heater'
        };
        return types[type] || type;
    }

    formatFoundation(type) {
        const types = {
            'basement': 'Basement',
            'crawlspace': 'Crawlspace',
            'slab': 'Slab on Grade',
            'pier_beam': 'Pier & Beam'
        };
        return types[type] || type;
    }

    formatHealthSafetyIssue(issue) {
        const issues = {
            'combustion': 'Combustion safety concerns - testing required',
            'moisture': 'Moisture or water intrusion issues',
            'mold': 'Visible mold present',
            'asbestos': 'Suspected asbestos materials',
            'lead': 'Suspected lead paint'
        };
        return issues[issue] || issue;
    }

    calculateAnnualSavings(recommendations) {
        return recommendations.reduce((sum, rec) => sum + (rec.estimatedSavings || 0), 0);
    }

    calculateNetCost(rec) {
        const totalIncentives = (rec.availableIncentives || []).reduce((sum, inc) => sum + inc.amount, 0);
        return Math.max(0, rec.estimatedCost - totalIncentives);
    }
    
    /**
     * Calculate monthly loan payment using standard loan formula
     * @param {number} principal - Loan amount
     * @param {number} annualRate - Annual interest rate (e.g., 0.15 for 15%)
     * @param {number} months - Loan term in months
     * @returns {number} Monthly payment amount
     */
    calculateMonthlyPayment(principal, annualRate, months) {
        if (principal <= 0) return 0;
        if (annualRate === 0) return Math.round(principal / months);
        
        const monthlyRate = annualRate / 12;
        const payment = principal * 
            (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
            (Math.pow(1 + monthlyRate, months) - 1);
        
        return Math.round(payment);
    }
    
    /**
     * Generate program benefits breakdown table
     */
    generateProgramBreakdown(recommendations) {
        // Aggregate incentives by program
        const programTotals = {};
        const programMeasures = {};
        
        recommendations.forEach(rec => {
            if (rec.availableIncentives && rec.availableIncentives.length > 0) {
                rec.availableIncentives.forEach(inc => {
                    const programName = inc.program || 'Other';
                    const amount = inc.amount || 0;
                    
                    if (!programTotals[programName]) {
                        programTotals[programName] = 0;
                        programMeasures[programName] = [];
                    }
                    
                    programTotals[programName] += amount;
                    if (!programMeasures[programName].includes(rec.measure)) {
                        programMeasures[programName].push(rec.measure);
                    }
                });
            }
        });
        
        // Sort programs by total amount
        const sortedPrograms = Object.entries(programTotals)
            .sort((a, b) => b[1] - a[1]);
        
        if (sortedPrograms.length === 0) {
            return '<p>No program-specific incentives identified for selected measures.</p>';
        }
        
        let html = `
            <table class="program-breakdown-table" style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                <thead>
                    <tr style="background: #2c5530; color: white;">
                        <th style="padding: 0.75rem; text-align: left;">Program</th>
                        <th style="padding: 0.75rem; text-align: right;">Total Incentive</th>
                        <th style="padding: 0.75rem; text-align: left;">Applied To</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        sortedPrograms.forEach(([program, total], idx) => {
            const measures = programMeasures[program].join(', ');
            const bgColor = idx % 2 === 0 ? '#ffffff' : '#f9fafb';
            
            html += `
                <tr style="background: ${bgColor}; border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 0.75rem; font-weight: 600;">${program}</td>
                    <td style="padding: 0.75rem; text-align: right; font-weight: bold; color: #5cb85c;">$${total.toLocaleString()}</td>
                    <td style="padding: 0.75rem; color: #666; font-size: 0.9rem;">${measures}</td>
                </tr>
            `;
        });
        
        // Add total row
        const grandTotal = sortedPrograms.reduce((sum, [_, total]) => sum + total, 0);
        html += `
                <tr style="background: #d4edda; font-weight: bold; border-top: 3px solid #2c5530;">
                    <td style="padding: 0.75rem;">TOTAL INCENTIVES</td>
                    <td style="padding: 0.75rem; text-align: right; font-size: 1.1rem; color: #2c5530;">$${grandTotal.toLocaleString()}</td>
                    <td style="padding: 0.75rem; color: #666;">${sortedPrograms.length} program(s)</td>
                </tr>
            </tbody>
        </table>
        `;
        
        return html;
    }


    getPriorityClass(priority) {
        if (priority.includes('CRITICAL')) return 'priority-critical';
        if (priority.includes('HIGH')) return 'priority-high';
        return 'priority-medium';
    }

    matchesConcerns(rec, prioritizedConcerns) {
        if (!rec.addressesConcerns || !prioritizedConcerns) return null;
        
        for (let concern of prioritizedConcerns) {
            if (rec.addressesConcerns.includes(concern.id)) {
                return `#${concern.rank} ${concern.text}`;
            }
        }
        return null;
    }

    generateRecommendationRationale(rec) {
        if (rec.urgency === 'immediate') {
            return `This is a critical health and safety issue that must be addressed before other improvements.`;
        }
        return `This improvement will ${rec.category === 'envelope' ? 'reduce heat loss and improve comfort' : 
                rec.category === 'hvac' ? 'provide efficient heating and cooling' : 'reduce energy consumption'}.`;
    }

    generateSpecifications(rec) {
        let specs = '<ul>';
        if (rec.sqft) specs += `<li>Area: ${rec.sqft} sq ft</li>`;
        if (rec.sizing) specs += `<li>Recommended size: ${rec.sizing.recommendedSize}</li>`;
        if (rec.heatPumpType) specs += `<li>Type: ${rec.heatPumpType} heat pump</li>`;
        if (rec.windowCount) specs += `<li>Number of windows: ${rec.windowCount}</li>`;
        specs += '</ul>';
        return specs;
    }

    organizeIntoPhases(recommendations) {
        const phases = {
            phase1: { name: 'Phase 1: Immediate (0-6 months)', timeline: '0-6 months', measures: [], totalCost: 0, rationale: 'Health, safety, and critical repairs first' },
            phase2: { name: 'Phase 2: Envelope (6-12 months)', timeline: '6-12 months', measures: [], totalCost: 0, rationale: 'Reduce heating/cooling load before upgrading systems' },
            phase3: { name: 'Phase 3: Systems (12-24 months)', timeline: '12-24 months', measures: [], totalCost: 0, rationale: 'Right-size equipment after envelope improvements' }
        };

        recommendations.forEach(rec => {
            if (rec.urgency === 'immediate' || rec.category === 'health_safety') {
                phases.phase1.measures.push(rec);
                phases.phase1.totalCost += rec.estimatedCost;
            } else if (rec.category === 'envelope') {
                phases.phase2.measures.push(rec);
                phases.phase2.totalCost += rec.estimatedCost;
            } else {
                phases.phase3.measures.push(rec);
                phases.phase3.totalCost += rec.estimatedCost;
            }
        });

        return phases;
    }

    generateApplicationSteps(program) {
        if (program.id === 'swr') {
            return `<ol>
                <li>Call 1-800-766-6861 to request assessment</li>
                <li>Provide income documentation</li>
                <li>Schedule in-home assessment</li>
                <li>Receive prioritized work plan</li>
                <li>Weatherization work performed at no cost</li>
            </ol>`;
        }
        if (program.id === 'cpf') {
            return `<ol>
                <li>Contact local Community Partner organization</li>
                <li>Complete income verification</li>
                <li>Work with partner to select measures</li>
                <li>Partner coordinates contractor and incentives</li>
            </ol>`;
        }
        return `<ol>
            <li>Contact program administrator</li>
            <li>Review eligibility requirements</li>
            <li>Submit application with required documentation</li>
            <li>Receive approval and proceed with work</li>
        </ol>`;
    }

    generateProgramContacts(program) {
        const contacts = {
            'homes': '<strong>Oregon Dept of Energy:</strong> 1-800-221-8035',
            'hear': '<strong>Oregon Dept of Energy:</strong> 1-800-221-8035',
            'cpf': '<strong>Community Partners:</strong> Contact local Community Action Agency',
            'energy_trust_standard': '<strong>Energy Trust:</strong> 1-866-368-7878 | energytrust.org',
            'swr': '<strong>Oregon Weatherization:</strong> 1-800-766-6861',
            'certa': '<strong>Oregon Dept of Revenue:</strong> oregon.gov/dor'
        };
        return `<p class="contact-info">${contacts[program.id] || 'Contact program administrator'}</p>`;
    }

    assessHomeSize(size) {
        if (!size) return 'Size not specified';
        if (size < 1000) return 'Small home - may qualify for enhanced measures';
        if (size > 3000) return 'Large home - may need multiple zones';
        return 'Typical size for Oregon';
    }

    assessInsulation(condition) {
        if (condition === 'poor' || condition === 'none') return '❗ Upgrade recommended';
        if (condition === 'fair') return '⚠️ Consider upgrade';
        return '✓ Adequate';
    }

    assessAirSealing(condition) {
        if (condition === 'poor') return '❗ Significant infiltration - priority upgrade';
        if (condition === 'fair') return '⚠️ Air sealing recommended';
        return '✓ Good condition';
    }

    assessWindows(condition) {
        if (condition === 'poor') return '❗ Single pane or damaged - replacement recommended';
        if (condition === 'fair') return '⚠️ Consider upgrade for comfort';
        return '✓ Good condition';
    }

    assessFoundation(type) {
        if (type === 'crawlspace') return '⚠️ Ensure proper insulation and moisture barrier';
        if (type === 'basement') return 'Check for insulation and moisture issues';
        return 'Standard foundation';
    }

    assessHeatingSystem(system, age) {
        if (system === 'electric_resistance') return '❗ High-cost heating - heat pump upgrade recommended';
        if (age > 15) return '❗ Aging system - replacement recommended';
        if (age > 10) return '⚠️ Monitor efficiency';
        return '✓ Adequate';
    }

    assessCoolingSystem(system) {
        if (system === 'none') return 'No cooling - consider heat pump for heating & cooling';
        if (system === 'window_ac') return '⚠️ Inefficient - central system recommended';
        return '✓ Adequate';
    }

    assessWaterHeater(type, age) {
        if (type === 'electric_tank' && age > 10) return '❗ Heat pump water heater upgrade recommended';
        if (age > 12) return '⚠️ Nearing end of life';
        return '✓ Adequate';
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReportGenerator;
}
