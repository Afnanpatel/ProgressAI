import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Calendar, Flag, Sparkles, MoreVertical } from 'lucide-react';
import { suggestTasksForGoal } from '../utils/aiMockServices';
import { useData } from '../context/DataContext';
import ConfirmationModal from './ConfirmationModal';
import '../styles/Goals.css';

const GoalCard = ({ goal, onDelete }) => {
    const { tasks, addTasks } = useData();
    const [isStrategizing, setIsStrategizing] = useState(false);
    const [showAINotification, setShowAINotification] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const tasksRef = useRef(tasks);

    // Update tasksRef whenever tasks change
    useEffect(() => {
        tasksRef.current = tasks;
    }, [tasks]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMenu]);

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'critical': return '#ef4444';
            case 'high': return '#f59e0b';
            case 'medium': return '#6366f1';
            default: return '#9ca3af';
        }
    };

    const handleAIStrategize = () => {
        setIsStrategizing(true);
        setTimeout(() => {
            const currentTasks = tasksRef.current;
            const existingGoalTasks = currentTasks.filter(t => t.goalId === goal.id);
            const suggestedTitles = suggestTasksForGoal(goal.title, goal.category, existingGoalTasks.length);
            const newTasks = suggestedTitles.map(title => ({
                id: Date.now().toString() + Math.random(),
                goalId: goal.id,
                title: title,
                status: 'Pending',
                dueDate: goal.deadline,
                effort: 'Medium'
            }));
            addTasks(newTasks);
            setIsStrategizing(false);
            setShowAINotification(true);
            setTimeout(() => setShowAINotification(false), 3000);
        }, 1500);
    };

    return (
        <div className="goal-card-wrapper card glass scale-in">
            {showAINotification && (
                <div className="task-notification glass ai-notif fade-in">
                    <Sparkles size={18} />
                    <span>AI Strategist generated {suggestTasksForGoal(goal.title, goal.category, tasks.filter(t => t.goalId === goal.id).length).length} new tasks!</span>
                </div>
            )}
            <div className="goal-card-header">
                <span className="goal-category badge">{goal.category}</span>
                <div className="goal-actions" style={{ position: 'relative' }} ref={menuRef}>
                    <button
                        className="icon-btn menu-btn"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <MoreVertical size={20} />
                    </button>

                    {showMenu && (
                        <div className="actions-menu glass scale-in">
                            <button
                                className={`menu-item ${isStrategizing ? 'strategizing' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent menu close immediately if needed, though blur handles it
                                    handleAIStrategize();
                                    setShowMenu(false);
                                }}
                                disabled={isStrategizing}
                            >
                                <Sparkles size={16} className="text-purple" />
                                <span>AI Strategize</span>
                            </button>
                            <button
                                className="menu-item delete-item"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                    setShowMenu(false);
                                }}
                            >
                                <Trash2 size={16} />
                                <span>Delete Goal</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <h3 className="goal-title">{goal.title}</h3>
            <p className="goal-description">
                {goal.description}
            </p>

            <div className="goal-progress-section">
                <div className="progress-info">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                </div>
                <div className="modern-progress-bar">
                    <div
                        className="progress-value"
                        style={{
                            width: `${goal.progress}%`,
                            backgroundColor: getPriorityColor(goal.priority),
                        }}
                    >
                        <div className="shine"></div>
                    </div>
                </div>
            </div>

            <div className="goal-meta">
                <div className="meta-item">
                    <Calendar size={14} />
                    <span>{goal.deadline}</span>
                </div>
                <div className="meta-item">
                    <Flag size={14} style={{ color: getPriorityColor(goal.priority) }} />
                    <span>{goal.priority}</span>
                </div>
            </div>
        </div>
    );
};

export default GoalCard;
