import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, CheckCircle2, Circle, Clock, Tag, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import ConfirmationModal from './ConfirmationModal';
import '../styles/Tasks.css';

const TasksView = () => {
  const { tasks, updateTask, deleteTask, goals, addTask } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [expandedGoalId, setExpandedGoalId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null });

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const toggleTaskStatus = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const isNowDone = task.status !== 'Done';
      if (isNowDone) {
        showNotification('Task completed successfully! 🎉');
      }
      updateTask(taskId, { status: isNowDone ? 'Done' : 'Pending' });
    }
  };

  const handleDeleteTask = (id) => {
    setDeleteModal({ isOpen: true, taskId: id });
  };

  const confirmDelete = () => {
    deleteTask(deleteModal.taskId);
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
    addTask(newTask);
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

      <div className="tasks-list-container">
        {tasks.length === 0 && (
          <div className="empty-state glass">No tasks created yet. Click "New Task" to begin.</div>
        )}

        {Object.entries(tasks.reduce((acc, task) => {
          const goalId = task.goalId || 'uncategorized';
          if (!acc[goalId]) acc[goalId] = [];
          acc[goalId].push(task);
          return acc;
        }, {})).map(([goalId, goalTasks]) => {
          const goal = goals.find(g => g.id === goalId);
          const goalTitle = goal ? goal.title : (goalId === 'uncategorized' ? 'General Tasks' : 'Unknown Goal');
          const isExpanded = expandedGoalId === goalId;
          const progress = goal ? goal.progress : 0;
          const completedCount = goalTasks.filter(t => t.status === 'Done').length;

          return (
            <div key={goalId} className={`task-group-card card glass ${isExpanded ? 'expanded' : ''}`}>
              <div
                className="group-card-header"
                onClick={() => setExpandedGoalId(isExpanded ? null : goalId)}
              >
                <div className="group-info">
                  <h3 className="group-title">{goalTitle}</h3>
                  <div className="group-stats">
                    <span className="badge">{completedCount}/{goalTasks.length} Done</span>
                    {goal && <span className="progress-text">{progress}% Complete</span>}
                  </div>
                </div>
                <div className="chevron-icon">
                  {isExpanded ? '▼' : '▶'}
                </div>
              </div>

              {isExpanded && (
                <div className="tasks-list glass fade-in">
                  {goalTasks.map((task, index) => {
                    const isDone = task.status === 'Done';
                    const displayTitle = task.title.replace(/^Step \d+: /, '');
                    return (
                      <div key={task.id} className={`task-item scale-in ${isDone ? 'completed' : ''}`}>
                        <button className="status-toggle" onClick={() => toggleTaskStatus(task.id)}>
                          {isDone ? <CheckCircle2 size={24} className="success-icon" /> : <Circle size={24} />}
                        </button>
                        <div className="task-info">
                          <div className="task-title-row">
                            <span className="task-title">Step {index + 1}: {displayTitle}</span>
                            {isDone && <span className="completed-badge">COMPLETED</span>}
                          </div>
                          <div className="task-meta">
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
              )}
            </div>
          );
        })}
      </div>

      {isModalOpen && createPortal(
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
        </div>,
        document.body
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
