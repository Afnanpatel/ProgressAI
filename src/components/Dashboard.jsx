import React from 'react';
import {
  BarChart,
  Target,
  CheckSquare,
  Flame,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Trophy
} from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import { initialGoals, initialTasks, initialHabits } from '../data/initialData';
import { getRandomCoachInsight } from '../utils/aiMockServices';
import { calculateHabitStreak, calculateTotalStreakSum } from '../utils/habitUtils';
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
import { Bar, Pie } from 'react-chartjs-2';
import '../styles/Dashboard.css';

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

const StatCard = ({ title, value, icon: IconComponent, color, subValue }) => (
  <div className="stat-card card glass scale-in">
    <div className="stat-icon-wrapper">
      <div className="stat-icon" style={{ backgroundColor: `${color}15`, color }}>
        {IconComponent && <IconComponent size={24} />}
      </div>
      <div className="stat-glow" style={{ backgroundColor: color }}></div>
    </div>
    <div className="stat-info">
      <span className="stat-title">{title}</span>
      <div className="stat-value-group">
        <span className="stat-value">{value}</span>
        {subValue && <span className="stat-sub-value" style={{ color: `${color}cc` }}>{subValue}</span>}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [goals] = useLocalStorage('goals', initialGoals);
  const [tasks] = useLocalStorage('tasks', initialTasks);
  const [habits] = useLocalStorage('habits', initialHabits);

  const quotes = [
    { text: "Your only limit is your mind.", author: "Unknown" },
    { text: "Consistency is the key to all success.", author: "Unknown" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "David Goggins" },
    { text: "Small progress is still progress.", author: "Unknown" }
  ];

  const [quote] = React.useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const activeGoalsCount = goals.filter(g => g.status !== 'Completed').length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Use improved sum-based streak logic
  const today = new Date();
  const totalStreakSum = calculateTotalStreakSum(habits, today);
  const avgHabitStreak = habits.length > 0
    ? Math.round(totalStreakSum / habits.length)
    : 0;

  const categoryData = {
    labels: [...new Set(goals.map(g => g.category))],
    datasets: [
      {
        label: 'Goals by Category',
        data: [...new Set(goals.map(g => g.category))].map(cat =>
          goals.filter(g => g.category === cat).length
        ),
        backgroundColor: [
          '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'
        ],
        borderWidth: 0,
        hoverOffset: 10
      },
    ],
  };

  const progressData = {
    labels: goals.map(g => g.title.length > 15 ? g.title.substring(0, 15) + '...' : g.title),
    datasets: [
      {
        label: 'Progress %',
        data: goals.map(g => g.progress),
        backgroundColor: (context) => {
          const char = context.chart;
          const { ctx, chartArea } = char;
          if (!chartArea) return '#6366f1';
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, '#6366f1');
          gradient.addColorStop(1, '#a855f7');
          return gradient;
        },
        borderRadius: 12,
        hoverBackgroundColor: '#818cf8'
      },
    ],
  };

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <div className="header-text">
          <div className="welcome-badge">Dashboard Overview</div>
          <h2 className="section-title">Welcome back, Superhuman!</h2>
          <p className="section-subtitle">You're making incredible strides today. Keep the fire burning!</p>
        </div>
        <div className="quick-actions">
          <div className="total-streak-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(245, 158, 11, 0.1)', padding: '8px 16px', borderRadius: '30px', color: '#f59e0b', fontWeight: '800' }}>
            <Flame size={20} />
            <span>{totalStreakSum} TOTAL STREAK</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Active Goals"
          value={activeGoalsCount}
          subValue={activeGoalsCount > 0 ? "In Progress" : "All Set"}
          icon={Target}
          color="#6366f1"
        />
        <StatCard
          title="Task Efficiency"
          value={`${taskCompletionRate}%`}
          subValue={`${completedTasks} Done`}
          icon={CheckSquare}
          color="#10b981"
        />
        <StatCard
          title="Total Streak"
          value={`${totalStreakSum} days`}
          subValue="Accumulative"
          icon={Trophy}
          color="#f59e0b"
        />
        <StatCard
          title="Milestones"
          value={completedGoals}
          subValue="Completed"
          icon={TrendingUp}
          color="#8b5cf6"
        />
      </div>

      <div className="main-dashboard-grid">
        <div className="charts-column">
          <div className="motivation-card card glass scale-in">
            <div className="quote-icon">"</div>
            <p className="quote-text">{quote.text}</p>
            <span className="quote-author">— {quote.author}</span>
          </div>

          <div className="chart-card card glass scale-in">
            <div className="card-header-flex">
              <div className="header-group">
                <h3>Goal Progress</h3>
                <p>Visualization of your current objectives</p>
              </div>
              <span className="badge hot">LIVING VIEW</span>
            </div>
            <div className="chart-container">
              {goals.length > 0 ? (
                <Bar
                  data={progressData}
                  options={{
                    indexAxis: 'y',
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { display: false }, max: 100, ticks: { display: false } },
                      y: {
                        grid: { display: false },
                        ticks: { font: { size: 12, weight: '600' } }
                      }
                    }
                  }}
                />
              ) : (
                <div className="empty-chart">No goals data yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="activity-column">
          <div className="upcoming-section card glass scale-in">
            <div className="card-header-flex">
              <div className="header-group">
                <h3>Critical Path</h3>
                <p>Highest priority deadlines</p>
              </div>
              <div className="priority-indicator">
                <AlertCircle size={18} color="var(--danger)" />
              </div>
            </div>
            <div className="deadlines-list">
              {goals
                .filter(g => g.status !== 'Completed')
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .slice(0, 4)
                .map(goal => (
                  <div key={goal.id} className="deadline-item-mini">
                    <div className="item-dot" style={{ background: `var(--${goal.priority === 'High' ? 'danger' : 'primary'})` }}></div>
                    <div className="item-info">
                      <span className="item-title">{goal.title}</span>
                      <span className="item-date">{goal.deadline}</span>
                    </div>
                    <div className="progress-ring-mini">
                      <div className="ring-fill" style={{ width: `${goal.progress}%` }}></div>
                      <span className="item-percent">{goal.progress}%</span>
                    </div>
                  </div>
                ))
              }
              {goals.filter(g => g.status !== 'Completed').length === 0 && (
                <div className="empty-state">Your path is clear!</div>
              )}
            </div>
          </div>

          <div className="quick-stats card glass scale-in ai-coach-card">
            <div className="insight-header">
              <h3><Sparkles size={18} style={{ marginRight: '8px', color: 'var(--primary)' }} /> AI Productivity Coach</h3>
              <div className="insight-pulse"></div>
            </div>
            <div className="insight-content">
              <p style={{ fontStyle: 'italic', fontWeight: '600' }}>
                "{getRandomCoachInsight({
                  goalsCount: goals.length,
                  tasksDone: completedTasks,
                  habitsStreak: totalStreakSum
                })}"
              </p>
              <div className="modern-progress-bar">
                <div className="progress-value" style={{ width: `${taskCompletionRate}%` }}>
                  <div className="shine"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
