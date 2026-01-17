import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import useLocalStorage from '../hooks/useLocalStorage';
import { initialGoals, initialTasks, initialHabits } from '../data/initialData';
import { calculateTotalStreakSum } from '../utils/habitUtils';
import { Target, CheckCircle, Flame, TrendingUp } from 'lucide-react';
import '../styles/Analytics.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const AnalyticsView = () => {
    const [goals] = useLocalStorage('goals', initialGoals);
    const [tasks] = useLocalStorage('tasks', initialTasks);
    const [habits] = useLocalStorage('habits', initialHabits);

    const completionRate = tasks.length > 0
        ? Math.round((tasks.filter(t => t.status === 'Done').length / tasks.length) * 100)
        : 0;

    const today = new Date();
    const totalStreak = calculateTotalStreakSum(habits, today);

    const goalProgressData = {
        labels: goals.map(g => g.title.length > 15 ? g.title.substring(0, 15) + '...' : g.title),
        datasets: [{
            label: 'Progress (%)',
            data: goals.map(g => g.progress),
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
            borderRadius: 12,
            borderWidth: 0,
            hoverBackgroundColor: 'rgba(99, 102, 241, 1)',
        }]
    };

    const categoryData = {
        labels: [...new Set(goals.map(g => g.category))],
        datasets: [{
            data: [...new Set(goals.map(g => g.category))].map(cat =>
                goals.filter(g => g.category === cat).length
            ),
            backgroundColor: [
                '#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'
            ],
            borderWidth: 0,
            hoverOffset: 20
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: { family: 'Inter', size: 12 }
                }
            }
        }
    };

    return (
        <div className="analytics-container fade-in">
            <div className="analytics-header">
                <h2 className="section-title">Performance Analytics</h2>
                <p className="section-subtitle">Deep dive into your progress metrics</p>
            </div>

            <div className="analytics-summary-grid">
                <div className="summary-card card glass scale-in">
                    <div className="summary-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                        <Target size={24} />
                    </div>
                    <div className="summary-details">
                        <span className="label">Total Goals</span>
                        <span className="value">{goals.length}</span>
                    </div>
                </div>
                <div className="summary-card card glass scale-in" style={{ animationDelay: '0.1s' }}>
                    <div className="summary-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div className="summary-details">
                        <span className="label">Task Efficiency</span>
                        <span className="value">{completionRate}%</span>
                    </div>
                </div>
                <div className="summary-card card glass scale-in" style={{ animationDelay: '0.2s' }}>
                    <div className="summary-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                        <Flame size={24} />
                    </div>
                    <div className="summary-details">
                        <span className="label">Total Habit Streak</span>
                        <span className="value">{totalStreak} days</span>
                    </div>
                </div>
            </div>

            <div className="analytics-charts-grid">
                <div className="chart-wrapper card glass scale-in">
                    <h3>Goal Completion Progress</h3>
                    <div className="chart-box">
                        <Bar data={goalProgressData} options={{ ...options, indexAxis: 'y' }} />
                    </div>
                </div>
                <div className="chart-wrapper card glass scale-in" style={{ animationDelay: '0.1s' }}>
                    <h3>Category Focus</h3>
                    <div className="chart-box">
                        <Pie data={categoryData} options={options} />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AnalyticsView;
