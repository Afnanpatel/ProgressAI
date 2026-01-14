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

export const suggestTasksForGoal = (goalTitle, category) => {
    const defaultTasks = ["Step 1: Research and Planning", "Step 2: Initialize Core Setup", "Step 3: Execute Primary Phase", "Step 4: Review and Refine"];

    const contextMap = {
        'Skills': [
            "Identify top 3 resources (Books/Courses)",
            "Set a 30-day learning curriculum",
            "Build a small project to demonstrate skill",
            "Teach/Explain the concept to someone else"
        ],
        'Career': [
            "Update professional profile and resume",
            "Network with 3 industry professionals",
            "List required certifications or milestones",
            "Apply for 2 high-matching roles"
        ],
        'Fitness': [
            "Schedule 3 workouts this week",
            "Define specific nutritional goals",
            "Join a local group or find a coach",
            "Track baseline measurements today"
        ],
        'Finance': [
            "Audit expenses from the last 30 days",
            "Set up automatic savings transfer",
            "Research 2 low-risk investment options",
            "Define a clear 6-month budget"
        ]
    };

    return contextMap[category] || defaultTasks;
};

export const getForecastAnalytics = (goals) => {
    return goals.map(g => ({
        title: g.title,
        velocity: Math.floor(Math.random() * 20) + 5, // Simulated % per week
        predictedDate: new Date(Date.now() + (Math.random() * 30 + 10) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
};
