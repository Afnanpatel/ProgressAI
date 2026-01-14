import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Clock, Tag, Trash2 } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import { initialTasks, initialGoals } from '../data/initialData';
import ConfirmationModal from './ConfirmationModal';
import '../styles/Tasks.css';

const TasksView = () => {
  const [tasks, setTasks] = useLocalStorage('tasks', initialTasks);
  const [goals, setGoals] = useLocalStorage('goals', initialGoals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null });

  // Sync goal progress when tasks change
  useEffect(() => {
    const updatedGoals = goals.map(goal => {
      const goalTasks = tasks.filter(t => t.goalId === goal.id);
      if (goalTasks.length === 0) return goal;

      const completedTasksCount = goalTasks.filter(t => t.status === 'Done').length;
      const newProgress = Math.round((completedTasksCount / goalTasks.length) * 100);

      return { ...goal, progress: newProgress };
    });

    const hasChanged = JSON.stringify(updatedGoals) !== JSON.stringify(goals);
    if (hasChanged) {
      setGoals(updatedGoals);
    }
  }, [tasks, goals, setGoals]);

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const isNowDone = task.status !== 'Done';
        if (isNowDone) {
          showNotification('Task completed successfully! 🎉');
        }
        return { ...task, status: isNowDone ? 'Done' : 'Pending' };
      }
      return task;
    }));
  };

  const handleDeleteTask = (id) => {
    setDeleteModal({ isOpen: true, taskId: id });
  };

  const confirmDelete = () => {
    setTasks(tasks.filter(task => task.id !== deleteModal.taskId));
    setDeleteModal({ isOpen: false, taskId: null });
    showNotification('Task deleted.');
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTask = {
      id: Date.now().toString(),
      goalId: formData.get('goalId'),
      title: formData.get('title'),
      status: 'Pending',
      dueDate: formData.get('dueDate'),
      effort: formData.get('effort')
    };
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
    showNotification('New task created!');
  };

  return (
    <div className="tasks-container fade-in">
      {notification.show && (
        <div className="task-notification glass">
          <CheckCircle2 size={18} />
          <span>{notification.message}</span>
        </div>
      )}

      <div className="tasks-header">
        <div>
          <h2 className="section-title">Tasks & Milestones</h2>
          <p className="section-subtitle">Break down your goals into actionable steps</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      <div className="tasks-list glass">
        {tasks.length === 0 && (
          <div className="empty-state">No tasks created yet. Click "New Task" to begin.</div>
        )}
        {tasks.map(task => {
          const goal = goals.find(g => g.id === task.goalId);
          const isDone = task.status === 'Done';
          return (
            <div key={task.id} className={`task-item scale-in ${isDone ? 'completed' : ''}`}>
              <button className="status-toggle" onClick={() => toggleTaskStatus(task.id)}>
                {isDone ? <CheckCircle2 size={24} className="success-icon" /> : <Circle size={24} />}
              </button>
              <div className="task-info">
                <div className="task-title-row">
                  <span className="task-title">{task.title}</span>
                  {isDone && <span className="completed-badge">COMPLETED</span>}
                </div>
                <div className="task-meta">
                  <div className="meta-badge goal-link">
                    <Tag size={12} />
                    <span>Goal: {goal ? goal.title : 'No Goal Linked'}</span>
                  </div>
                  <div className="meta-badge">
                    <Clock size={12} />
                    <span>{task.dueDate}</span>
                  </div>
                  <span className={`effort-badge ${task.effort.toLowerCase()}`}>{task.effort}</span>
                </div>
              </div>
              <button className="icon-btn delete-btn" onClick={() => handleDeleteTask(task.id)} title="Delete Task">
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content card glass">
            <h3>Create New Task</h3>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label>Task Title</label>
                <input name="title" required placeholder="e.g. Research competitor pricing" />
              </div>
              <div className="form-group">
                <label>Associate with Goal</label>
                <select name="goalId" required>
                  <option value="">Select a Goal</option>
                  {goals.map(goal => (
                    <option key={goal.id} value={goal.id}>{goal.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>Effort Level</label>
                  <select name="effort">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Task?"
        message="Are you sure you want to delete this task? This will affect your goal progress."
        onConfirm={confirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, taskId: null })}
      />
    </div>
  );
};

export default TasksView;
