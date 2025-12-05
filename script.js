// Population group structure
class PopulationGroup {
    constructor(name, count, riskLevel, essentialPercent, lifeExpectancy) {
        this.name = name;
        this.count = count;
        this.riskLevel = riskLevel; // Probability of death if infected
        this.essentialPercent = essentialPercent / 100;
        this.lifeExpectancy = lifeExpectancy;
        this.essentialCount = Math.floor(count * this.essentialPercent);
        this.nonEssentialCount = count - this.essentialCount;
    }

    // Calculate utility score for a person in this group
    getUtilityScore(isEssential = false) {
        // Utility = risk * life expectancy * (1 + essential bonus)
        const essentialBonus = isEssential ? 0.3 : 0; // 30% bonus for essential workers
        return this.riskLevel * this.lifeExpectancy * (1 + essentialBonus);
    }

    // Calculate expected lives saved per vaccine
    getLivesSavedPerVaccine() {
        return this.riskLevel;
    }

    // Calculate expected life-years saved per vaccine
    getLifeYearsSavedPerVaccine(isEssential = false) {
        return this.riskLevel * this.lifeExpectancy * (1 + (isEssential ? 0.3 : 0));
    }
}

// Utilitarian Algorithm: Maximize total utility (life-years saved)
function utilitarianDistribution(groups, totalVaccines) {
    // Create priority list based on utility score
    const priorityList = [];
    
    groups.forEach(group => {
        // Add essential workers first (higher utility)
        for (let i = 0; i < group.essentialCount; i++) {
            priorityList.push({
                group: group,
                isEssential: true,
                utility: group.getUtilityScore(true)
            });
        }
        // Add non-essential workers
        for (let i = 0; i < group.nonEssentialCount; i++) {
            priorityList.push({
                group: group,
                isEssential: false,
                utility: group.getUtilityScore(false)
            });
        }
    });
    
    // Sort by utility (highest first)
    priorityList.sort((a, b) => b.utility - a.utility);
    
    // Allocate vaccines
    const allocation = {
        young: { essential: 0, nonEssential: 0 },
        middle: { essential: 0, nonEssential: 0 },
        elderly: { essential: 0, nonEssential: 0 }
    };
    
    let vaccinesUsed = 0;
    let totalLivesSaved = 0;
    let totalLifeYearsSaved = 0;
    let vulnerableProtected = 0;
    
    for (let i = 0; i < Math.min(totalVaccines, priorityList.length); i++) {
        const item = priorityList[i];
        const groupName = item.group.name.toLowerCase();
        const key = groupName === 'young' ? 'young' : groupName === 'middle' ? 'middle' : 'elderly';
        
        if (item.isEssential) {
            allocation[key].essential++;
        } else {
            allocation[key].nonEssential++;
        }
        
        vaccinesUsed++;
        totalLivesSaved += item.group.getLivesSavedPerVaccine();
        totalLifeYearsSaved += item.group.getLifeYearsSavedPerVaccine(item.isEssential);
        
        // Count vulnerable (high risk) protected
        if (item.group.riskLevel >= 0.1) {
            vulnerableProtected++;
        }
    }
    
    return {
        allocation,
        vaccinesUsed,
        totalLivesSaved: Math.round(totalLivesSaved * 100) / 100,
        totalLifeYearsSaved: Math.round(totalLifeYearsSaved * 100) / 100,
        vulnerableProtected
    };
}

// Kantian Algorithm: Fair distribution based on method
function kantianDistribution(groups, totalVaccines, method) {
    const allocation = {
        young: { essential: 0, nonEssential: 0 },
        middle: { essential: 0, nonEssential: 0 },
        elderly: { essential: 0, nonEssential: 0 }
    };
    
    let vaccinesUsed = 0;
    let totalLivesSaved = 0;
    let totalLifeYearsSaved = 0;
    let vulnerableProtected = 0;
    
    if (method === 'lottery') {
        // Equal chance lottery: random distribution
        const allPeople = [];
        groups.forEach(group => {
            for (let i = 0; i < group.count; i++) {
                allPeople.push({
                    group: group,
                    isEssential: i < group.essentialCount
                });
            }
        });
        
        // Shuffle array (Fisher-Yates)
        for (let i = allPeople.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allPeople[i], allPeople[j]] = [allPeople[j], allPeople[i]];
        }
        
        // Allocate randomly
        for (let i = 0; i < Math.min(totalVaccines, allPeople.length); i++) {
            const person = allPeople[i];
            const groupName = person.group.name.toLowerCase();
            const key = groupName === 'young' ? 'young' : groupName === 'middle' ? 'middle' : 'elderly';
            
            if (person.isEssential) {
                allocation[key].essential++;
            } else {
                allocation[key].nonEssential++;
            }
            
            vaccinesUsed++;
            totalLivesSaved += person.group.getLivesSavedPerVaccine();
            totalLifeYearsSaved += person.group.getLifeYearsSavedPerVaccine(person.isEssential);
            
            if (person.group.riskLevel >= 0.1) {
                vulnerableProtected++;
            }
        }
        
    } else if (method === 'vulnerability') {
        // Highest vulnerability first (regardless of utility)
        const priorityList = [];
        
        groups.forEach(group => {
            for (let i = 0; i < group.count; i++) {
                priorityList.push({
                    group: group,
                    isEssential: i < group.essentialCount,
                    vulnerability: group.riskLevel
                });
            }
        });
        
        // Sort by vulnerability (highest first)
        priorityList.sort((a, b) => b.vulnerability - a.vulnerability);
        
        for (let i = 0; i < Math.min(totalVaccines, priorityList.length); i++) {
            const item = priorityList[i];
            const groupName = item.group.name.toLowerCase();
            const key = groupName === 'young' ? 'young' : groupName === 'middle' ? 'middle' : 'elderly';
            
            if (item.isEssential) {
                allocation[key].essential++;
            } else {
                allocation[key].nonEssential++;
            }
            
            vaccinesUsed++;
            totalLivesSaved += item.group.getLivesSavedPerVaccine();
            totalLifeYearsSaved += item.group.getLifeYearsSavedPerVaccine(item.isEssential);
            
            if (item.group.riskLevel >= 0.1) {
                vulnerableProtected++;
            }
        }
        
    } else if (method === 'equal') {
        // Equal distribution across groups
        const vaccinesPerGroup = Math.floor(totalVaccines / groups.length);
        const remainder = totalVaccines % groups.length;
        
        groups.forEach((group, index) => {
            const vaccinesForGroup = vaccinesPerGroup + (index < remainder ? 1 : 0);
            const vaccinesForEssential = Math.min(group.essentialCount, Math.floor(vaccinesForGroup * 0.5));
            const vaccinesForNonEssential = Math.min(group.nonEssentialCount, vaccinesForGroup - vaccinesForEssential);
            
            const groupName = group.name.toLowerCase();
            const key = groupName === 'young' ? 'young' : groupName === 'middle' ? 'middle' : 'elderly';
            
            allocation[key].essential = vaccinesForEssential;
            allocation[key].nonEssential = vaccinesForNonEssential;
            
            vaccinesUsed += vaccinesForEssential + vaccinesForNonEssential;
            totalLivesSaved += (vaccinesForEssential + vaccinesForNonEssential) * group.getLivesSavedPerVaccine();
            totalLifeYearsSaved += vaccinesForEssential * group.getLifeYearsSavedPerVaccine(true) +
                                  vaccinesForNonEssential * group.getLifeYearsSavedPerVaccine(false);
            
            if (group.riskLevel >= 0.1) {
                vulnerableProtected += vaccinesForEssential + vaccinesForNonEssential;
            }
        });
    }
    
    return {
        allocation,
        vaccinesUsed,
        totalLivesSaved: Math.round(totalLivesSaved * 100) / 100,
        totalLifeYearsSaved: Math.round(totalLifeYearsSaved * 100) / 100,
        vulnerableProtected
    };
}

// Display results
function displayResults(utilResult, kantResult, groups) {
    // Utilitarian results
    document.getElementById('utilVaccines').textContent = utilResult.vaccinesUsed;
    document.getElementById('utilLives').textContent = utilResult.totalLivesSaved.toFixed(2);
    document.getElementById('utilLifeYears').textContent = utilResult.totalLifeYearsSaved.toFixed(2);
    document.getElementById('utilVulnerable').textContent = utilResult.vulnerableProtected;
    
    // Kantian results
    document.getElementById('kantVaccines').textContent = kantResult.vaccinesUsed;
    document.getElementById('kantLives').textContent = kantResult.totalLivesSaved.toFixed(2);
    document.getElementById('kantLifeYears').textContent = kantResult.totalLifeYearsSaved.toFixed(2);
    document.getElementById('kantVulnerable').textContent = kantResult.vulnerableProtected;
    
    // Breakdown displays
    displayBreakdown('utilBreakdown', utilResult.allocation, groups);
    displayBreakdown('kantBreakdown', kantResult.allocation, groups);
    
    // Create comparison chart
    createComparisonChart(utilResult, kantResult);
    
    // Analysis text
    generateAnalysis(utilResult, kantResult);
}

function displayBreakdown(elementId, allocation, groups) {
    const element = document.getElementById(elementId);
    element.innerHTML = '';
    
    const groupNames = ['young', 'middle', 'elderly'];
    const displayNames = ['Young (18-40)', 'Middle-Aged (41-60)', 'Elderly (61+)'];
    
    groupNames.forEach((key, index) => {
        const total = allocation[key].essential + allocation[key].nonEssential;
        const div = document.createElement('div');
        div.className = 'breakdown-item';
        div.innerHTML = `
            <span class="breakdown-label">${displayNames[index]}:</span>
            <span class="breakdown-value">${total} (${allocation[key].essential} essential, ${allocation[key].nonEssential} non-essential)</span>
        `;
        element.appendChild(div);
    });
}

function createComparisonChart(utilResult, kantResult) {
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.comparisonChartInstance) {
        window.comparisonChartInstance.destroy();
    }
    
    window.comparisonChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Lives Saved', 'Life-Years Saved', 'Vulnerable Protected'],
            datasets: [
                {
                    label: 'Utilitarian',
                    data: [
                        utilResult.totalLivesSaved,
                        utilResult.totalLifeYearsSaved,
                        utilResult.vulnerableProtected
                    ],
                    backgroundColor: 'rgba(76, 175, 80, 0.7)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Kantian',
                    data: [
                        kantResult.totalLivesSaved,
                        kantResult.totalLifeYearsSaved,
                        kantResult.vulnerableProtected
                    ],
                    backgroundColor: 'rgba(33, 150, 243, 0.7)',
                    borderColor: 'rgba(33, 150, 243, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Utilitarian vs. Kantian Distribution Comparison'
                }
            }
        }
    });
}

function generateAnalysis(utilResult, kantResult) {
    const analysis = document.getElementById('analysisText');
    let text = '<h4>Ethical Analysis</h4>';
    
    const lifeYearsDiff = utilResult.totalLifeYearsSaved - kantResult.totalLifeYearsSaved;
    const livesDiff = utilResult.totalLivesSaved - kantResult.totalLivesSaved;
    const vulnerableDiff = utilResult.vulnerableProtected - kantResult.vulnerableProtected;
    
    text += '<p><strong>Results:</strong></p><ul>';
    
    if (lifeYearsDiff > 0) {
        text += `<li>The Utilitarian approach saves ${lifeYearsDiff.toFixed(2)} more life-years by prioritizing those with higher utility scores (risk × life expectancy × essential status).</li>`;
    } else if (lifeYearsDiff < 0) {
        text += `<li>The Kantian approach saves ${Math.abs(lifeYearsDiff).toFixed(2)} more life-years in this scenario.</li>`;
    } else {
        text += '<li>Both approaches result in similar life-years saved.</li>';
    }
    
    if (vulnerableDiff > 0) {
        text += `<li>The Utilitarian approach protects ${vulnerableDiff} more vulnerable individuals (high-risk), but this may be coincidental to utility maximization.</li>`;
    } else if (vulnerableDiff < 0) {
        text += `<li>The Kantian approach protects ${Math.abs(vulnerableDiff)} more vulnerable individuals, prioritizing fairness and duty over utility.</li>`;
    }
    
    text += '</ul><p><strong>Ethical Implications:</strong></p>';
    text += '<p>The Utilitarian framework maximizes the predicted total benefit but may be treating individuals as means to an end. ';
    text += 'The Kantian framework respects individual dignity and fairness but may result in fewer total lives or years saved. ';
    text += 'This simulation shows the distinctions between utilitarian and kantian ethics with regards to issues of resource allocation.</p>';
    
    analysis.innerHTML = text;
}

// Form submission handler
document.getElementById('simulationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get input values
    const totalVaccines = parseInt(document.getElementById('totalVaccines').value);
    const youngCount = parseInt(document.getElementById('youngCount').value);
    const middleCount = parseInt(document.getElementById('middleCount').value);
    const elderlyCount = parseInt(document.getElementById('elderlyCount').value);
    const youngRisk = parseFloat(document.getElementById('youngRisk').value);
    const middleRisk = parseFloat(document.getElementById('middleRisk').value);
    const elderlyRisk = parseFloat(document.getElementById('elderlyRisk').value);
    const youngEssential = parseFloat(document.getElementById('youngEssential').value);
    const middleEssential = parseFloat(document.getElementById('middleEssential').value);
    const elderlyEssential = parseFloat(document.getElementById('elderlyEssential').value);
    const lifeExpectancyStr = document.getElementById('lifeExpectancy').value;
    const kantianMethod = document.getElementById('kantianMethod').value;
    
    // Parse life expectancy
    const lifeExpectancyParts = lifeExpectancyStr.split(':').map(x => parseFloat(x.trim()));
    const [youngLife, middleLife, elderlyLife] = lifeExpectancyParts;
    
    // Create population groups
    const groups = [
        new PopulationGroup('Young', youngCount, youngRisk, youngEssential, youngLife),
        new PopulationGroup('Middle', middleCount, middleRisk, middleEssential, middleLife),
        new PopulationGroup('Elderly', elderlyCount, elderlyRisk, elderlyEssential, elderlyLife)
    ];
    
    // Run simulations
    const utilResult = utilitarianDistribution(groups, totalVaccines);
    const kantResult = kantianDistribution(groups, totalVaccines, kantianMethod);
    
    // Display results
    displayResults(utilResult, kantResult, groups);
    
    // Show results section
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
});

