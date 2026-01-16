import { format, subDays, differenceInCalendarDays } from 'date-fns';

/**
 * Checks if a specific habit was supposed to be completed on a given date.
 */
export const isHabitScheduled = (habit, date) => {
    const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (habit.frequency === 'Daily') return true;
    if (habit.frequency === 'Weekdays' && !isWeekend) return true;
    if (habit.frequency === 'Weekends' && isWeekend) return true;
    return false;
};

/**
 * Calculates current streak for an individual habit.
 */
export const calculateHabitStreak = (habit, today = new Date()) => {
    const logs = habit.logs || [];
    if (logs.length === 0) return 0;

    const todayStr = format(today, 'yyyy-MM-dd');
    const completedDates = new Set(logs.filter(l => l.completed).map(l => l.date));

    let streakCount = 0;
    let checkDate = new Date(today);

    while (true) {
        const dStr = format(checkDate, 'yyyy-MM-dd');

        if (isHabitScheduled(habit, checkDate)) {
            if (completedDates.has(dStr)) {
                streakCount++;
            } else {
                // If it's today and not yet completed, don't break the streak yet
                if (dStr === todayStr) {
                    checkDate = subDays(checkDate, 1);
                    continue;
                }
                break; // Streak broken
            }
        }
        checkDate = subDays(checkDate, 1);

        // Safety break
        if (differenceInCalendarDays(today, checkDate) > 365) break;
    }
    return streakCount;
};

/**
 * Checks if a specific date was a "Perfect Day" (all scheduled habits completed).
 */
export const isPerfectDay = (habits, date) => {
    const dStr = format(date, 'yyyy-MM-dd');
    const scheduledHabits = habits.filter(h => isHabitScheduled(h, date));

    if (scheduledHabits.length === 0) return false;

    return scheduledHabits.every(h =>
        h.logs && h.logs.some(l => l.date === dStr && l.completed)
    );
};

/**
 * Calculates "Master Streak" (days in a row that were Perfect Days).
 */
export const calculateMasterStreak = (habits, today = new Date()) => {
    if (!habits || habits.length === 0) return 0;

    const todayStr = format(today, 'yyyy-MM-dd');
    let streakCount = 0;
    let checkDate = new Date(today);

    while (true) {
        const dStr = format(checkDate, 'yyyy-MM-dd');
        const scheduledHabits = habits.filter(h => isHabitScheduled(h, checkDate));

        if (scheduledHabits.length > 0) {
            const allDone = scheduledHabits.every(h =>
                h.logs && h.logs.some(l => l.date === dStr && l.completed)
            );
            if (allDone) {
                streakCount++;
            } else {
                if (dStr === todayStr) {
                    checkDate = subDays(checkDate, 1);
                    continue;
                }
                break;
            }
        } else {
            // Skip days with no habits scheduled (doesn't break or increment)
        }

        checkDate = subDays(checkDate, 1);
        if (differenceInCalendarDays(today, checkDate) > 365) break;
    }
    return streakCount;
};

/**
 * Calculates "Perfect Days" in the last N days.
 */
export const countRecentPerfectDays = (habits, daysLimit = 7, today = new Date()) => {
    let perfectCount = 0;
    for (let i = 0; i < daysLimit; i++) {
        if (isPerfectDay(habits, subDays(today, i))) {
            perfectCount++;
        }
    }
    return perfectCount;
};
