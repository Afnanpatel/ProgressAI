import React, { useState } from 'react';
import { Trash2, Calendar, Flag, Sparkles } from 'lucide-react';
import { suggestTasksForGoal } from '../utils/aiMockServices';
import useLocalStorage from '../hooks/useLocalStorage';
import { initialTasks } from '../data/initialData';
import ConfirmationModal from './ConfirmationModal';
import '../styles/Goals.css';

const GoalCard = ({ goal, onDelete }) => {
    const [tasks, setTasks] = useLocalStorage('tasks', initialTasks);
    const [isStrategizing, setIsStrategizing] = useState(false);
    const [showAINotification, setShowAINotification] = useState(false);

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
            const suggestedTitles = suggestTasksForGoal(goal.title, goal.category);
            const newTasks = suggestedTitles.map(title => ({
                id: Date.now().toString() + Math.random(),
                goalId: goal.id,
                title: title,
                status: 'Pending',
                dueDate: goal.deadline,
                effort: 'Medium'
            }));
            setTasks([...tasks, ...newTasks]);
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
                    <span>AI Strategist generated {suggestTasksForGoal(goal.title, goal.category).length} tasks!</span>
                </div>
            )}
            <div className="goal-card-header">
                <span className="goal-category badge">{goal.category}</span>
                <div className="goal-actions">
                    <button
                        className={`icon-btn ai-btn ${isStrategizing ? 'strategizing' : ''}`}
                        onClick={handleAIStrategize}
                        title="AI Strategize"
                        disabled={isStrategizing}
                    >
                        <Sparkles size={18} />
                    </button>
                    <button
                        className="icon-btn delete-btn"
                        onClick={onDelete}
                        title="Delete Goal"
                    >
                        <Trash2 size={18} />
                    </button>
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
