import React, { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { initialGoals, initialTasks } from '../data/initialData';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [goals, setGoals] = useLocalStorage('goals', initialGoals);
    const [tasks, setTasks] = useLocalStorage('tasks', initialTasks);

    // Sync goal progress when tasks change
    useEffect(() => {
        setGoals(prevGoals => {
            const updated = prevGoals.map(goal => {
                const goalTasks = tasks.filter(t => t.goalId === goal.id);
                if (goalTasks.length === 0) return goal;

                const completedTasksCount = goalTasks.filter(t => t.status === 'Done').length;
                const newProgress = Math.round((completedTasksCount / goalTasks.length) * 100);

                if (goal.progress !== newProgress) {
                    return { ...goal, progress: newProgress };
                }
                return goal;
            });

            if (JSON.stringify(updated) !== JSON.stringify(prevGoals)) {
                return updated;
            }
            return prevGoals;
        });
    }, [tasks]);

    const addGoal = (goal) => setGoals(prev => [...prev, goal]);

    const deleteGoal = (goalId) => {
        setGoals(prev => prev.filter(g => g.id !== goalId));
        // Cleanup associated tasks
        setTasks(prev => prev.filter(t => t.goalId !== goalId));
    };

    const updateGoal = (goalId, updates) => {
        setGoals(prev => prev.map(g => g.id === goalId ? { ...g, ...updates } : g));
    };

    const addTask = (task) => setTasks(prev => [...prev, task]);

    const addTasks = (newTasks) => setTasks(prev => [...prev, ...newTasks]);

    const deleteTask = (taskId) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };

    const updateTask = (taskId, updates) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    };

    return (
        <DataContext.Provider value={{
            goals, setGoals, addGoal, deleteGoal, updateGoal,
            tasks, setTasks, addTask, addTasks, deleteTask, updateTask
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
