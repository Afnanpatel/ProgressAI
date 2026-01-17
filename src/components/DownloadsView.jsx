import React from 'react';
import { Download, FileText, Table, Goal, CheckSquare, RefreshCcw } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import { initialGoals, initialTasks, initialHabits } from '../data/initialData';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import { calculateHabitStreak } from '../utils/habitUtils';
import '../styles/Downloads.css';

const DownloadsView = () => {
  const [goals] = useLocalStorage('goals', initialGoals);
  const [tasks] = useLocalStorage('tasks', initialTasks);
  const [habits] = useLocalStorage('habits', initialHabits);

  const today = new Date();

  // Enrich data for export
  const enrichedGoals = goals.map(g => ({
    ...g,
    progress: `${g.progress}%`
  }));

  const enrichedTasks = tasks.map(t => {
    const goal = goals.find(g => g.id === t.goalId);
    return {
      ...t,
      goalTitle: goal ? goal.title : 'General'
    };
  });

  const enrichedHabits = habits.map(h => {
    const streak = calculateHabitStreak(h, today);
    // Rough consistency calculation: (completed logs / total days since first log)
    // For now keeping it simple as per original data or 0
    return {
      ...h,
      streak: streak,
      consistency: h.logs ? Math.round((h.logs.filter(l => l.completed).length / Math.max(1, h.logs.length)) * 100) : 0
    };
  });

  const downloadOptions = [
    {
      id: 'goals',
      title: 'Goals Export',
      description: 'Export all your long-term goals and their current progress.',
      icon: Goal,
      data: enrichedGoals,
      filename: 'my-goals',
      color: '#6366f1'
    },
    {
      id: 'tasks',
      title: 'Tasks Export',
      description: 'Full list of tasks with their current status and linked goals.',
      icon: CheckSquare,
      data: enrichedTasks,
      filename: 'my-tasks',
      color: '#10b981'
    },
    {
      id: 'habits',
      title: 'Habits Export',
      description: 'Consistency data, current streaks, and habit tracking history.',
      icon: RefreshCcw,
      data: enrichedHabits,
      filename: 'my-habits',
      color: '#f59e0b'
    }
  ];

  return (
    <div className="downloads-container fade-in">
      <div className="downloads-header">
        <h2 className="section-title">Data Exports</h2>
        <p className="section-subtitle">Download your progress data in various formats</p>
      </div>

      <div className="downloads-grid">
        {downloadOptions.map((opt) => (
          <div key={opt.id} className="download-card card glass scale-in">
            <div className="card-header">
              <div className="icon-box" style={{ background: `${opt.color}15`, color: opt.color }}>
                <opt.icon size={24} />
              </div>
              <div className="header-text">
                <h3>{opt.title}</h3>
                <p>{opt.description}</p>
              </div>
            </div>

            <div className="card-actions">
              <button
                className="btn-secondary flex-center"
                onClick={() => exportToCSV(opt.data, `${opt.filename}.csv`)}
              >
                <Table size={18} />
                <span>Export CSV</span>
              </button>
              <button
                className="btn-secondary flex-center"
                onClick={() => exportToPDF(opt.data, `${opt.filename}.pdf`, opt.id)}
              >
                <FileText size={18} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="export-info-banner card glass">
        <div className="info-icon">💡</div>
        <div className="info-content">
          <h4>Privacy & Security</h4>
          <p>All exports are generated locally in your browser. Your data never leaves your device during the export process. Reflection logs are excluded from collective downloads to maintain privacy.</p>
        </div>
      </div>

    </div>
  );
};

export default DownloadsView;
