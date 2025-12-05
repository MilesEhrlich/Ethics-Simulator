// Narrative data for each pathway
const narratives = {
    kantian: {
        title: "The Path of Duty",
        steps: [
            {
                text: "You remember Kant's categorical imperative: 'act only in accordance with that maxim through which you can at the same time will that it become a universal law' (Kant 31). Being honest is a perfect duty; it cannot be violated, regardless of consequences.",
                choices: [
                    { text: "Proceed with whistleblowing", next: 1, integrity: 20, welfare: -15 } // High integrity cost, low welfare cost
                ]
            },
            {
                text: "You contact a regulatory agency and give them all of the evidence. You know this will end your career, but it's your moral duty. The consequences and context are morally irrelevant. 'I must act from duty alone' you tell yourself.",
                choices: [
                    { text: "Continue", next: 2, integrity: 10, welfare: -10 } // Further integrity gain, more welfare loss
                ]
            },
            {
                text: "The investigation begins. You're immediately fired from your job and your company launches a smear campaign. Your family is now devastated by the financial loss. Your spouse now has to take on multiple jobs to support your family. Your children's college funds are gone.",
                choices: [
                    { text: "Continue", next: 3, integrity: 0, welfare: -10 } // Integrity stable, more welfare loss
                ]
            },
            {
                text: "Months pass. The regulatory process is slow. The company uses legal maneuvers to delay the process further. You're unemployable in your field. You still have your integrity, you did your duty. But your life is ruined. The company continues operating, though under increased examination.",
                choices: [
                    { text: "See the outcome", next: "end", integrity: 10, welfare: -5 } // Final welfare loss
                ]
            }
        ],
        finalOutcome: {
            text: "You maintained your integrity and fulfilled your moral duty. The truth was exposed, though the company continues to fight. Your life is ruined, but at least you can look yourself in the mirror. Kant would approve of your choice: you acted from duty, not from inclination or consequences.",
            analysis: `
                <h3>Kantian Deontological Analysis</h3>
                <p><strong>Perfect Duty:</strong> Telling the truth is a perfect duty that must be followed. The categorical imperative requires you to act in a way that could be universalized. Lying or not telling the truth would be impermissible.</p>
                <p><strong>Consequences are Irrelevant:</strong> For Kant, the morality of an action comes from the intention and fulfilling one's moral duty, not from the consequences or context surrounding the action. You're morally obligated to tell the truth, regardless of whether it stops the company or ruins your life.</p>
                <p><strong>Dignity and Autonomy:</strong> By acting out of duty, you respect the moral law. You treat yourself and others as ends in themselves, not merely as means.</p>
                <p><strong>Result:</strong> Your integrity score was high, but you have a low welfare score. This shows Kant's point: moral action is about duty, not happiness or well-being like in Utilitarianism or Virtue Ethics.</p>
            `
        }
    },
    utilitarian: {
        title: "The Path of Consequences",
        steps: [
            {
                text: "You consider the utilitarian principle of utility: What will maximize overall happiness and minimize suffering? You weigh the potential lives saved against the certain harm to your family. You also consider the probability that whistleblowing will actually succeed.",
                choices: [
                    { text: "Calculate: High chance of failure, proceed anyway", next: 1, integrity: 25, welfare: -10 },
                    { text: "Calculate: Low chance of success, remain silent", next: 2, integrity: -20, welfare: 40 }
                ]
            },
            {
                text: "You decide to blow the whistle. Your reasoning for doing so is that even a small chance of saving lives outweighs your family's suffering. You contact regulators, but the process is slow. The company immediately fires you and begins legal counterattacks.",
                choices: [
                    { text: "Continue", next: 3, integrity: 5, welfare: -15 }
                ]
            },
            {
                text: "As predicted, the company's legal team delays everything. Years pass. Your family struggles. The medication continues to be sold. You realize your calculation was wrong, the probability of success was lower than you thought. The total utility is negative.",
                choices: [
                    { text: "See the outcome", next: "end", integrity: 0, welfare: -15 }
                ]
            },
            {
                text: "You remain silent. Your family's financial stability is preserved. You continue your career, though you must now live with your guilt. The medication continues to cause harm. You rationalize: 'The outcome wouldn't have changed anyway.'",
                choices: [
                    { text: "See the outcome", next: "end", integrity: -30, welfare: 5 }
                ]
            },
            {
                text: "Your silence weighs on you. You try to work within the system, but the company's culture prevents meaningful change. The harm continues. You've preserved your family's welfare but failed to maximize overall utility.",
                choices: [
                    { text: "See the outcome", next: "end", integrity: 0, welfare: 0 }
                ]
            }
        ],
        finalOutcome: {
            text: "You attempted to maximize overall utility, but the calculation was complex. The actual outcomes didn't match your predictions. This shows a common issue with utilitarianism: we cannot always predict or control consequences.",
            analysis: `
                <h3>Analysis using Bernard Williams' Critique of Utilitarianism</h3>
                <p><strong>Integrity and Personal Projects:</strong> Williams argues that utilitarianism can require you to sacrifice your core personal projects and commitments (like providing for your family) for the greater good. This can be a great moral cost that utilitarianism cannont account for.</p>
                <p><strong>The Problem of Alienation:</strong> When you act purely for the sake of maximizing utility, you may become alienated from your own values. Your identity as a parent and spouse should matter, not just instrumentally.</p>
                <p><strong>Uncertainty of Consequences:</strong> As you experienced, we cannot reliably predict the outcomes of our decisions. The medication might continue to be sold either way, or it might be stopped even if you remain silent. Utilitarianism assumes that we are able to make these calculations, but we often cannot.</p>
                <p><strong>Result:</strong> Moderate integrity score, moderate welfare score. This shows Williams' point: sometimes actions that preserves personal integrity (whistleblowing) can lead to lower overall well-being, and this trade-off shouldn't be ignored.</p>
            `
        }
    },
    virtue: {
        title: "The Path of Virtue",
        steps: [
            {
                text: "You consider what a virtuous person would do. Aristotle explains that virtue comes from in finding the mean between extremes. Here, the extremes are cowardice (remaining silent) and recklessness (whistleblowing without strategy).",
                choices: [
                    { text: "Seek a balanced approach: build a coalition", next: 1, integrity: 20, welfare: 40 },
                    { text: "Act courageously but strategically", next: 2, integrity: 10, welfare: 45 }
                ]
            },
            {
                text: "You begin quietly building alliances with other concerned employees. You document everything very cautiously. You seek legal counsel. You prepare your family for potential consequences. This all takes time, but you're building support for action.",
                choices: [
                    { text: "Continue building support", next: 3, integrity: -10, welfare: 5 },
                    { text: "Act now with your coalition", next: 4, integrity: 10, welfare: 0 }
                ]
            },
            {
                text: "You act courageously without being reckless. You get legal protection first. You make sure your evidence is undeniable. You time your action to maximize impact. You've prepared your family financially as much as possible.",
                choices: [
                    { text: "Continue", next: 4, integrity: 20, welfare: -20 }
                ]
            },
            {
                text: "Your coalition grows. You've found people who agree with your cauase in the legal department and among other executives. Together, you have more power. The company cannot easily dismiss all of you. You're finding the mean: courageous reckless.",
                choices: [
                    { text: "Proceed with the coalition", next: 4, integrity: -5, welfare: -5 }
                ]
            },
            {
                text: "You and your coalition blow the whistle together. The company cannot easily retaliate against all of you. The evidence is overwhelming. Regulators act quickly. The medication is pulled from the market, but unfortunately more people felt the affects while you were growing your coalition. You still face career consequences, but they're less severe with your coalition's support.",
                choices: [
                    { text: "See the outcome", next: "end", integrity: 5, welfare: -3 }
                ]
            }
        ],
        finalOutcome: {
            text: "You found the mean between cowardice and recklessness. You acted courageously but practically. You balanced your duty to expose the truth with your responsibilities to your family. Your actions were virtuous.",
            analysis: `
                <h3>Aristotelian Virtue Ethics Analysis</h3>
                <p><strong>The Doctrine of the Mean:</strong> Virtue is found between the extremes. Cowardice (a deficiency of courage) would be remaining silent. Recklessness (an excess of courage) would be whistleblowing without any strategy or preparation. The virtuous mean is courageous action with outcomes in mind.</p>
                <p><strong>Character and Habituation:</strong> Your actions shape your character. By acting virtuously, you become more virtuous. The virtuous person doesn't just follow rules (like Kant) or calculate consequences (like utilitarians), they develop good character through their virtuous practices.</p>
                <p><strong>Eudaimonia (Flourishing):</strong> The ultimate goal is human flourishing, which requires balancing various goods: integrity, family well-being, social contribution. No single good (like duty or utility) is the deciding factor they must all be properly considered.</p>
                <p><strong>Result:</strong> High integrity score, high welfare score. This shows the strengths of virtu ehtics; acting virtuously means acting cautiously and with your own interests in mind as well.</p>
            `
        }
    }
};

// Game state
let currentPathway = null;
let currentStep = 0;
let integrityScore = 50; // Start at neutral
let welfareScore = 50; // Start at neutral

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Pathway selection
    document.querySelectorAll('.pathway-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const pathway = this.closest('.pathway-card').dataset.pathway;
            startPathway(pathway);
        });
    });

    // Restart button
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', function() {
            resetGame();
        });
    }
});

function startPathway(pathway) {
    currentPathway = pathway;
    currentStep = 0;
    integrityScore = 50;
    welfareScore = 50;

    document.getElementById('dilemmaIntro').style.display = 'none';
    document.getElementById('narrativeSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';

    showStep(0);
}

function showStep(stepIndex) {
    const pathway = narratives[currentPathway];
    const step = pathway.steps[stepIndex];
    
    if (!step) return;

    const contentDiv = document.getElementById('narrativeContent');
    const buttonsDiv = document.getElementById('choiceButtons');

    // Display narrative text
    contentDiv.innerHTML = `
        <div class="narrative-text">
            <h2>${pathway.title}</h2>
            <p>${step.text}</p>
        </div>
    `;

    // Display choices
    buttonsDiv.innerHTML = '';
    step.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = choice.text;
        button.addEventListener('click', function() {
            handleChoice(choice);
        });
        buttonsDiv.appendChild(button);
    });
}

function handleChoice(choice) {
    // Update scores
    integrityScore = Math.max(0, Math.min(100, integrityScore + choice.integrity));
    welfareScore = Math.max(0, Math.min(100, welfareScore + choice.welfare));

    if (choice.next === 'end') {
        showFinalOutcome();
    } else {
        currentStep = choice.next;
        showStep(currentStep);
    }
}

function showFinalOutcome() {
    const pathway = narratives[currentPathway];
    const outcome = pathway.finalOutcome;

    // Use accumulated scores (they already reflect all choices)
    // The finalOutcome scores are just defaults if needed, but we use accumulated values
    // This allows different paths to have different final scores

    // Hide narrative, show results
    document.getElementById('narrativeSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';

    // Display outcome
    const outcomeContent = document.getElementById('outcomeContent');
    outcomeContent.innerHTML = `
        <div class="outcome-text">
            <p>${outcome.text}</p>
        </div>
    `;

    // Update scores display
    updateScores();

    // Display philosophical analysis
    const analysisDiv = document.getElementById('philosophicalAnalysis');
    analysisDiv.innerHTML = outcome.analysis;

    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

function updateScores() {
    document.getElementById('integrityScore').textContent = integrityScore;
    document.getElementById('welfareScore').textContent = welfareScore;
    
    document.getElementById('integrityBar').style.width = integrityScore + '%';
    document.getElementById('welfareBar').style.width = welfareScore + '%';
}

function resetGame() {
    currentPathway = null;
    currentStep = 0;
    integrityScore = 50;
    welfareScore = 50;

    document.getElementById('dilemmaIntro').style.display = 'block';
    document.getElementById('narrativeSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

