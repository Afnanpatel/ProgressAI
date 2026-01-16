import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Flame, CheckCircle2, Trophy, MoreVertical, ArrowLeft, Calendar as CalendarIcon, Smile, Dumbbell, BookOpen, Sun, Moon, Coffee } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import { initialHabits } from '../data/initialData';
import { format, isSameDay } from 'date-fns';
import ConfirmationModal from './ConfirmationModal';
import HabitCalendar from './HabitCalendar';
import '../styles/Habits.css';

// Simple Icon Mapping Helper
const getIconForHabit = (title, category) => {
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
  const [selectedHabit, setSelectedHabit] = useState(null); // If set, shows Detail/Calendar view
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, habitId: null });

  const today = new Date();

  // Dashboard Stats
  const totalHabits = habits.length;
  const completedToday = habits.filter(h =>
    h.logs.some(l => l.date === format(today, 'yyyy-MM-dd') && l.completed)
  ).length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const handleToggleToday = (habitId) => {
    const dateStr = format(today, 'yyyy-MM-dd');
    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit;

      const isCompleted = habit.logs.some(l => l.date === dateStr);
      let newLogs;

      if (isCompleted) {
        newLogs = habit.logs.filter(l => l.date !== dateStr);
      } else {
        newLogs = [...habit.logs, { date: dateStr, completed: true }];
      }

      // Simple streak recalculation (can be enhanced later to be robust)
      const streak = isCompleted ? Math.max(0, habit.streak - 1) : habit.streak + 1;

      return { ...habit, logs: newLogs, streak };
    }));
  };

  const handleDeleteHabit = (id) => {
    setDeleteModal({ isOpen: true, habitId: id });
  };

  const confirmDelete = () => {
    setHabits(habits.filter(habit => habit.id !== deleteModal.habitId));
    setDeleteModal({ isOpen: false, habitId: null });
    if (selectedHabit?.id === deleteModal.habitId) setSelectedHabit(null);
  };

  const handleAddHabit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newHabit = {
      id: Date.now().toString(),
      title: formData.get('title'),
      frequency: formData.get('frequency'),
      streak: 0,
      bestStreak: 0,
      logs: [] // No icon field yet, using helper
    };
    setHabits([...habits, newHabit]);
    setIsModalOpen(false);
  };

  // --- DETAIL VIEW (Calendar) ---
  if (selectedHabit) {
    return (
      <div className="habits-detail-view fade-in">
        <div className="detail-header">
          <button className="icon-btn" onClick={() => setSelectedHabit(null)}>
            <ArrowLeft size={24} />
          </button>
          <h2>{selectedHabit.title}</h2>
          <button className="icon-btn" onClick={() => handleDeleteHabit(selectedHabit.id)}>
            <MoreVertical size={24} />
          </button>
        </div>

        <div className="detail-content">
          <HabitCalendar habit={selectedHabit} />
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
      {/* Blue Dashboard Card */}
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

        <div className="stats-mini">
          <Trophy size={16} className="text-yellow" />
          <span>2 perfect days this week</span>
        </div>
      </div>

      {/* Today's List */}
      <div className="habits-list-section">
        <div className="section-label">Today</div>

        <div className="habits-vertical-list">
          {habits.map(habit => {
            const isCompleted = habit.logs.some(l => l.date === format(today, 'yyyy-MM-dd'));

            return (
              <div key={habit.id} className="habit-list-card" onClick={() => setSelectedHabit(habit)}>
                <div className="habit-icon-wrapper">
                  {getIconForHabit(habit.title, habit.frequency)}
                </div>

                <div className="habit-info">
                  <h3 className="habit-title">{habit.title}</h3>
                  <div className="habit-streak">
                    <Flame size={14} className={habit.streak > 0 ? "text-orange" : "text-muted"} />
                    <span>{habit.streak} in a row</span>
                  </div>
                </div>

                <button
                  className={`check-btn ${isCompleted ? 'completed' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleToday(habit.id);
                  }}
                >
                  {isCompleted && <CheckCircle2 size={24} color="white" />}
                </button>
              </div>
            );
          })}
        </div>
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
                </select>
              </div>
              {/* Icon picker to be added */}

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary rounded-full">Continue</button>
              </div>
            </form>
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

const [habits, setHabits] = useLocalStorage('habits', initialHabits);
const [isModalOpen, setIsModalOpen] = useState(false);
const [reflectionModal, setReflectionModal] = useState({ isOpen: false, habitId: null, date: null });
const [learningNote, setLearningNote] = useState('');
const [deleteModal, setDeleteModal] = useState({ isOpen: false, habitId: null });

const today = new Date();
const weekStart = startOfWeek(today, { weekStartsOn: 1 });
const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));

const openReflectionModal = (habitId, date) => {
  setReflectionModal({ isOpen: true, habitId, date });
  setLearningNote('');
};

const handleSaveReflection = (e) => {
  e.preventDefault();
  const { habitId, date } = reflectionModal;
  const dateStr = format(date, 'yyyy-MM-dd');

  setHabits(habits.map(habit => {
    if (habit.id === habitId) {
      // Prevent duplicate logs for the same day
      if (habit.logs.some(l => l.date === dateStr)) return habit;

      const updatedLogs = [...habit.logs, { date: dateStr, completed: true, note: learningNote }];

      // Recalculate streak
      let streak = 0;
      const sortedLogs = [...updatedLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
      for (let log of sortedLogs) {
        if (log.completed) streak++;
        else break;
      }

      return {
        ...habit,
        logs: updatedLogs,
        streak,
        bestStreak: Math.max(streak, habit.bestStreak)
      };
    }
    return habit;
  }));
  setReflectionModal({ isOpen: false, habitId: null, date: null });
};

const getWeekStats = (habit) => {
  let applicableDays = 7;
  if (habit.frequency === 'Weekdays') applicableDays = 5;
  if (habit.frequency === 'Weekends') applicableDays = 2;

  const completedThisWeek = weekDays.filter(day => {
    const dayOfWeek = day.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let isApplicable = true;
    if (habit.frequency === 'Weekdays' && isWeekend) isApplicable = false;
    if (habit.frequency === 'Weekends' && !isWeekend) isApplicable = false;

    if (!isApplicable) return false;

    const dateStr = format(day, 'yyyy-MM-dd');
    return habit.logs.find(log => log.date === dateStr)?.completed;
  }).length;

  return Math.round((completedThisWeek / applicableDays) * 100);
};

const handleDeleteHabit = (id) => {
  setDeleteModal({ isOpen: true, habitId: id });
};

const confirmDelete = () => {
  setHabits(habits.filter(habit => habit.id !== deleteModal.habitId));
  setDeleteModal({ isOpen: false, habitId: null });
};

const handleAddHabit = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const newHabit = {
    id: Date.now().toString(),
    title: formData.get('title'),
    frequency: formData.get('frequency'),
    streak: 0,
    bestStreak: 0,
    logs: []
  };
  setHabits([...habits, newHabit]);
  setIsModalOpen(false);
};

return (
  <div className="habits-container fade-in">
    <div className="habits-header">
      <div>
        <h2 className="section-title">Habit Tracker</h2>
        <p className="section-subtitle">Build consistency with daily rituals</p>
      </div>
      <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
        <Plus size={20} />
        <span>New Habit</span>
      </button>
    </div>

    <div className="habits-grid card glass">
      <div className="habits-table-header">
        <div className="habit-name-col">Habit</div>
        <div className="habit-days-col">
          {weekDays.map(day => (
            <div key={day.toString()} className="day-label">
              <span>{format(day, 'EEE')}</span>
              <span className="day-num">{format(day, 'd')}</span>
            </div>
          ))}
        </div>
        <div className="habit-stats-col">Stats</div>
      </div>

      {habits.map(habit => (
        <div key={habit.id} className="habit-row scale-in">
          <div className="habit-name-col">
            <span className="habit-title">{habit.title}</span>
            <div className="streak-badge">
              <Flame size={14} />
              <span>{habit.streak} day streak</span>
            </div>
            <button className="icon-btn delete-btn" onClick={() => handleDeleteHabit(habit.id)} title="Delete Habit">
              <Trash2 size={14} />
            </button>
          </div>
          <div className="habit-days-col">
            {weekDays.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const log = habit.logs.find(l => l.date === dateStr);
              const isCompleted = log?.completed;
              const isToday = isSameDay(day, today);

              // Frequency check
              const dayOfWeek = day.getDay();
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              const isWeekday = !isWeekend;

              let isApplicable = true;
              if (habit.frequency === 'Weekdays' && isWeekend) isApplicable = false;
              if (habit.frequency === 'Weekends' && isWeekday) isApplicable = false;

              if (!isApplicable) {
                return <div key={day.toString()} className="day-placeholder"></div>;
              }

              const canClick = isToday && !isCompleted;

              return (
                <div
                  key={day.toString()}
                  className={`day-box ${isCompleted ? 'completed' : ''} ${isToday ? 'is-today' : ''} ${canClick ? 'clickable' : 'locked'}`}
                  onClick={() => canClick && openReflectionModal(habit.id, day)}
                  title={isCompleted ? (log.note || "Completed") : (isToday ? "Click to log today's progress" : "Cannot log past or future days")}
                >
                  {isCompleted ? <CheckCircle2 size={24} /> : <div className="empty-circle"></div>}
                </div>
              );
            })}
          </div>
          <div className="habit-stats-col">
            <div className="consistency-score">
              <TrendingUp size={14} />
              <span>{getWeekStats(habit)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>

    {isModalOpen && createPortal(
      <div className="modal-overlay">
        <div className="modal-content card glass">
          <h3>Add New Habit</h3>
          <form onSubmit={handleAddHabit}>
            <div className="form-group">
              <label>Habit Title</label>
              <input name="title" required placeholder="e.g. Read 10 pages" />
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
              <button type="submit" className="btn-primary">Add Habit</button>
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
            <CheckCircle2 size={32} color="var(--success)" />
            <h3>Daily Reflection</h3>
            <p>Great job! What did you learn from this habit today?</p>
          </div>
          <form onSubmit={handleSaveReflection}>
            <div className="form-group">
              <textarea
                required
                placeholder="Share a quick insight or learning..."
                value={learningNote}
                onChange={(e) => setLearningNote(e.target.value)}
                autoFocus
              />
            </div>
            <p className="note-hint">Once saved, this day's progress is fixed to ensure consistency.</p>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setReflectionModal({ isOpen: false, habitId: null, date: null })}>Discard</button>
              <button type="submit" className="btn-primary">Save & Complete</button>
            </div>
          </form>
        </div>
      </div>,
      document.body
    )}

    <ConfirmationModal
      isOpen={deleteModal.isOpen}
      title="Delete Habit?"
      message="Are you sure you want to delete this habit? All progress logs will be lost."
      onConfirm={confirmDelete}
      onClose={() => setDeleteModal({ isOpen: false, habitId: null })}
    />
  </div>
);
};

export default HabitsView;
