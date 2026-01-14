import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import GoalCard from './GoalCard';
import useLocalStorage from '../hooks/useLocalStorage';
import { initialGoals } from '../data/initialData';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import ConfirmationModal from './ConfirmationModal';
import '../styles/Goals.css';

const GoalsView = () => {
  const [goals, setGoals] = useLocalStorage('goals', initialGoals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, goalId: null });

  const categories = ['All', 'Career', 'Skills', 'Fitness', 'Finance', 'Mental Health', 'Projects', 'Learning'];

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || goal.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteGoal = (id) => {
    setDeleteModal({ isOpen: true, goalId: id });
  };

  const confirmDelete = () => {
    setGoals(goals.filter(goal => goal.id !== deleteModal.goalId));
    setDeleteModal({ isOpen: false, goalId: null });
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newGoal = {
      id: Date.now().toString(),
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      priority: formData.get('priority'),
      status: 'Not Started',
      startDate: new Date().toISOString().split('T')[0],
      deadline: formData.get('deadline'),
      progress: 0,
      motivation: formData.get('motivation')
    };
    setGoals([...goals, newGoal]);
    setIsModalOpen(false);
  };

  return (
    <div className="goals-container fade-in">
      <div className="goals-header">
        <div>
          <h2 className="section-title">My Goals</h2>
          <p className="section-subtitle">Define and track your long-term objectives</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            <span>Add Goal</span>
          </button>
        </div>
      </div>

      <div className="filters-bar glass">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="goals-grid">
        {filteredGoals.map(goal => (
          <GoalCard key={goal.id} goal={goal} onDelete={() => handleDeleteGoal(goal.id)} />
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content card glass">
            <h3>Create New Goal</h3>
            <form onSubmit={handleAddGoal}>
              <div className="form-group">
                <label>Goal Title</label>
                <input name="title" required placeholder="e.g. Learn System Design" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" placeholder="What do you want to achieve?" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category">
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select name="priority">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Target Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Motivation (Why this matters?)</label>
                <input name="motivation" placeholder="Stay focused on your why" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Goal?"
        message="Are you sure you want to delete this goal? This will remove all associated progress."
        onConfirm={confirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, goalId: null })}
      />
    </div>
  );
};

export default GoalsView;
