/**
 * aiMockServices.js
 * Simulates AI logic for ProgressAI
 */

export const getRandomCoachInsight = (stats) => {
    const { goalsCount = 0, tasksDone = 0, habitsStreak = 0 } = stats || {};

    if (goalsCount === 0) {
        return "Your journey begins with a single goal. Head to the 'Goals' tab to define your first major objective!";
    }

    if (tasksDone === 0) {
        return "Planning is good, but action is better. Break down your goals and complete your first task today!";
    }

    const insights = [
        `You've crushed ${tasksDone} tasks! At this rate, your productivity is peaking. Keep that fire burning!`,
        `Consistency alert! Your habit streak is at ${habitsStreak}. Data suggests you're forming neural pathways for success.`,
        "Focus Scan: Your attention is currently balanced. High impact work is recommended in the next 2 hours.",
        "Momentum is built through small wins. Great job on your progress so far.",
        `You are currently ${Math.min(100, (tasksDone * 10))} % towards your peak weekly performance. Stay intense!`
    ];

    if (habitsStreak > 5) {
        insights.push("Exceptional consistency! Your habits are becoming automatic. What's the next level for you?");
    }

    return insights[Math.floor(Math.random() * insights.length)];
};

export const suggestTasksForGoal = (goalTitle, category, currentTaskCount = 0) => {
    const startStep = currentTaskCount + 1;

    // Advanced dynamic templates
    const dynamicActions = [
        "Analyze progress on", "Deep dive into", "Optimize workflow for", "Review milestones regarding",
        "Expand scope of", "Validate assumptions for", "Consult mentor about", "Run performance tests on",
        "Brainstorm next phase for", "Consolidate learning from"
    ];

    // Simple context-specific bases
    const contextMap = {
        'Skills': [
            "Research best resources", "Create learning roadmap", "Build practice project", "Teach concept to peer",
            "Solve 5 practice problems", "Read advanced chapter", "Refactor practice code", "Join community discussion",
            "Attempt certification mock", "Write technical blog post"
        ],
        'Career': [
            "Update resume", "Network on LinkedIn", "Identify skill gaps", "Apply to 3 jobs",
            "Prepare interview answers", "Research target companies", "Request peer feedback", "Attend industry webinar",
            "Update portfolio site", "Draft cover letter"
        ],
        'Fitness': [
            "Morning workout session", "Meal prep for 3 days", "Track body measurements", "Rest and recovery",
            "High-intensity cardio", "Strength training block", "Research nutrition plan", "Hydration tracking log",
            "Stretching routine", "Sleep quality audit"
        ],
        'Finance': [
            "Audit monthly expenses", "Automate savings", "Review investment portfolio", "Set quarterly budget",
            "Read financial news", "Check credit score", "Cancel unused subs", "Plan tax strategy",
            "Research new ETFs", "Review insurance policy"
        ]
    };

    const specificTasks = contextMap[category] || [];
    const generatedTasks = [];

    for (let i = 0; i < 4; i++) {
        const stepNum = startStep + i;
        const taskIndex = currentTaskCount + i;

        // 1. Try to get a specific pre-written task if available and not "used" (simulated by index)
        if (taskIndex < specificTasks.length) {
            generatedTasks.push(specificTasks[taskIndex]);
        } else {
            // 2. Fallback to dynamic generation for infinite tasks
            const action = dynamicActions[taskIndex % dynamicActions.length];
            // Truncate goal title if too long to keep it clean
            const shortTitle = goalTitle.length > 20 ? goalTitle.substring(0, 20) + "..." : goalTitle;
            generatedTasks.push(`${action} "${shortTitle}"`);
        }
    }

    return generatedTasks;
};

export const getForecastAnalytics = (goals) => {
    return goals.map(g => ({
        title: g.title,
        velocity: Math.floor(Math.random() * 20) + 5, // Simulated % per week
        predictedDate: new Date(Date.now() + (Math.random() * 30 + 10) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
};
