import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Flame, CheckCircle2, Trophy, MoreVertical, ArrowLeft, Calendar as CalendarIcon, Smile, Dumbbell, BookOpen, Sun, Moon, Coffee, AlertCircle } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import { initialHabits } from '../data/initialData';
import { format } from 'date-fns';
import { calculateHabitStreak, calculateMasterStreak } from '../utils/habitUtils';
import ConfirmationModal from './ConfirmationModal';
import HabitCalendar from './HabitCalendar';
import '../styles/Habits.css';

// Simple Icon Mapping Helper
const getIconForHabit = (title) => {
  const t = title.toLowerCase();
  if (t.includes('read') || t.includes('book')) return <BookOpen size={24} />;
  if (t.includes('gym') || t.includes('workout') || t.includes('exercise')) return <Dumbbell size={24} />;
  if (t.includes('meditate') || t.includes('mind')) return <Smile size={24} />;
  if (t.includes('sleep') || t.includes('bed')) return <Moon size={24} />;
  if (t.includes('morning') || t.includes('wake')) return <Sun size={24} />;
  if (t.includes('drink') || t.includes('water')) return <Coffee size={24} />;
  return <CheckCircle2 size={24} />; // Default
};

const HabitsView = () => {
  const [habits, setHabits] = useLocalStorage('habits', initialHabits);
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, habitId: null });
  const [reflectionModal, setReflectionModal] = useState({ isOpen: false, habitId: null });
  const [cheatModal, setCheatModal] = useState({ isOpen: false, message: '' });
  const [learningNote, setLearningNote] = useState('');

  const today = new Date();
  const dateStr = format(today, 'yyyy-MM-dd');

  // Derive selected habit from state for reactivity
  const selectedHabit = habits.find(h => h.id === selectedHabitId);

  // Dashboard Stats
  const totalHabits = habits.length;
  const completedToday = habits.filter(h =>
    h.logs.some(l => l.date === dateStr && l.completed)
  ).length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const masterStreak = calculateMasterStreak(habits, today);

  const handleToggleClick = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    const isCompleted = habit.logs.some(l => l.date === dateStr);

    if (isCompleted) return;

    // Day of week check
    const dayOfWeek = today.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isWeekday = !isWeekend;

    if (habit.frequency === 'Weekdays' && isWeekend) {
      setCheatModal({ isOpen: true, message: "Don't try to cheat, focus on your habits! This habit is only for weekdays." });
      return;
    }
    if (habit.frequency === 'Weekends' && isWeekday) {
      setCheatModal({ isOpen: true, message: "Don't try to cheat, focus on your habits! This habit is only for weekends." });
      return;
    }

    setReflectionModal({ isOpen: true, habitId });
    setLearningNote('');
  };

  const handleSaveReflection = (e) => {
    e.preventDefault();
    const { habitId } = reflectionModal;
    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit;

      const newLogs = [...(habit.logs || []), { date: dateStr, completed: true, note: learningNote }];
      return { ...habit, logs: newLogs };
    }));
    setReflectionModal({ isOpen: false, habitId: null });
  };

  const handleDeleteHabit = (id) => {
    setDeleteModal({ isOpen: true, habitId: id });
  };

  const confirmDelete = () => {
    setHabits(habits.filter(habit => habit.id !== deleteModal.habitId));
    setDeleteModal({ isOpen: false, habitId: null });
    if (selectedHabitId === deleteModal.habitId) setSelectedHabitId(null);
  };

  const handleAddHabit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newHabit = {
      id: Date.now().toString(),
      title: formData.get('title'),
      frequency: formData.get('frequency'),
      logs: []
    };
    setHabits([...habits, newHabit]);
    setIsModalOpen(false);
  };

  // --- DETAIL VIEW (Calendar) ---
  if (selectedHabit) {
    return (
      <div className="habits-detail-view fade-in">
        <div className="detail-header">
          <button className="icon-btn" onClick={() => setSelectedHabitId(null)}>
            <ArrowLeft size={24} />
          </button>
          <h2>{selectedHabit.title}</h2>
          <button className="icon-btn" onClick={() => handleDeleteHabit(selectedHabit.id)}>
            <MoreVertical size={24} />
          </button>
        </div>

        <div className="detail-content">
          <HabitCalendar habit={selectedHabit} streak={calculateHabitStreak(selectedHabit, today)} />

          <div className="habit-insights">
            <h3 className="section-label">Recent Insights</h3>
            <div className="insights-list">
              {selectedHabit.logs && selectedHabit.logs.filter(l => l.note).length > 0 ? (
                selectedHabit.logs.filter(l => l.note).reverse().map((log, idx) => (
                  <div key={idx} className="insight-card">
                    <div className="insight-header">
                      <span className="insight-date">{format(new Date(log.date), 'MMM d, yyyy')}</span>
                    </div>
                    <p className="insight-text">"{log.note}"</p>
                  </div>
                ))
              ) : (
                <div className="empty-insights">
                  <Smile size={32} />
                  <p>No reflections recorded yet. Keep going!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          title="Delete Habit?"
          message="Are you sure you want to delete this habit?"
          onConfirm={confirmDelete}
          onClose={() => setDeleteModal({ isOpen: false, habitId: null })}
        />
      </div>
    );
  }

  // --- MAIN DASHBOARD VIEW ---
  return (
    <div className="habits-dashboard fade-in">
      <div className="dashboard-header-card">
        <div className="header-top">
          <h2>My Habits</h2>
          <button className="btn-icon-light" onClick={() => setIsModalOpen(true)}>
            <Plus size={24} />
          </button>
        </div>

        <div className="daily-progress-section">
          <div className="progress-text">
            <span className="percent">{completionRate}%</span>
            <span className="label">complete today</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>

        <div className="stats-mini" style={{ color: '#000000', fontWeight: 800 }}>
          <Flame size={18} className="text-orange" />
          <span>{masterStreak} Day Total Streak</span>
        </div>
      </div>

      <div className="habits-list-section">
        <div className="section-label">Today</div>

        <div className="habits-vertical-list">
          {habits.map(habit => {
            const isCompleted = habit.logs && habit.logs.some(l => l.date === dateStr);
            const currentStreak = calculateHabitStreak(habit, today);

            return (
              <div key={habit.id} className="habit-list-card" onClick={() => setSelectedHabitId(habit.id)}>
                <div className="habit-icon-wrapper">
                  {getIconForHabit(habit.title)}
                </div>

                <div className="habit-info">
                  <h3 className="habit-title">{habit.title}</h3>
                  <div className="habit-streak">
                    <Flame size={14} className={currentStreak > 0 ? "text-orange" : "text-muted"} />
                    <span>{currentStreak} in a row</span>
                  </div>
                </div>

                <button
                  className={`check-btn ${isCompleted ? 'completed' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleClick(habit.id);
                  }}
                  disabled={isCompleted}
                >
                  {isCompleted && <CheckCircle2 size={24} color="white" />}
                </button>
              </div>
            );
          })}
        </div>

        {habits.length > 0 && (
          <div className="habit-summary-footer glass card" style={{ marginTop: '2rem', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="summary-text">
              <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)' }}>Master Streak</h4>
              <p style={{ margin: '0.2rem 0 0', fontSize: '1.5rem', fontWeight: 900, color: '#3b82f6' }}>{masterStreak} Days</p>
            </div>
            <div className="summary-icon-big" style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '16px' }}>
              <Trophy size={32} color="#3b82f6" />
            </div>
          </div>
        )}
      </div>

      {isModalOpen && createPortal(
        <div className="modal-overlay">
          <div className="modal-content card glass">
            <h3>New Habit</h3>
            <form onSubmit={handleAddHabit}>
              <div className="form-group">
                <label>Enter your title:</label>
                <input name="title" required placeholder="Meditate" className="input-underlined" />
              </div>
              <div className="form-group">
                <label>Frequency</label>
                <select name="frequency">
                  <option value="Daily">Daily</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Weekends">Weekends</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary rounded-full">Continue</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {reflectionModal.isOpen && createPortal(
        <div className="modal-overlay">
          <div className="modal-content card glass reflection-modal">
            <div className="modal-header">
              <CheckCircle2 size={32} color="#22c55e" />
              <h3>Daily Reflection</h3>
              <p>Great job! What did you learn from this habit today?</p>
            </div>
            <form onSubmit={handleSaveReflection}>
              <div className="form-group">
                <textarea
                  required
                  placeholder="Share a quick insight..."
                  value={learningNote}
                  onChange={(e) => setLearningNote(e.target.value)}
                  autoFocus
                  style={{ width: '100%', minHeight: '100px', background: 'var(--background)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', marginTop: '1rem' }}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setReflectionModal({ isOpen: false, habitId: null })}>Skip</button>
                <button type="submit" className="btn-primary">Save & Complete</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {cheatModal.isOpen && createPortal(
        <div className="modal-overlay">
          <div className="modal-content card glass reflection-modal">
            <div className="modal-header">
              <AlertCircle size={48} color="#ef4444" />
              <h3>Whoops!</h3>
            </div>
            <p style={{ margin: '1rem 0' }}>{cheatModal.message}</p>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button className="btn-primary" onClick={() => setCheatModal({ isOpen: false, message: '' })}>
                I Understand
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Habit?"
        message="Are you sure?"
        onConfirm={confirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, habitId: null })}
      />
    </div>
  );
};

export default HabitsView;
