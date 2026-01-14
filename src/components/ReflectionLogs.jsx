import React, { useState } from 'react';
import { BookOpen, Calendar, Smile, Plus, Trash2 } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import { format } from 'date-fns';
import ConfirmationModal from './ConfirmationModal';
import '../styles/Logs.css';

const ReflectionLogs = () => {
  const [logs, setLogs] = useLocalStorage('reflection_logs', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logType, setLogType] = useState('daily');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, logId: null });

  const handleAddLog = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newLog = {
      id: Date.now().toString(),
      type: logType,
      date: format(new Date(), 'yyyy-MM-dd'),
      mood: formData.get('mood'),
      content: {
        workedOn: formData.get('workedOn'),
        wentWell: formData.get('wentWell'),
        blockers: formData.get('blockers'),
        lessons: formData.get('lessons'),
        plan: formData.get('plan')
      }
    };
    setLogs([newLog, ...logs]);
    setIsModalOpen(false);
  };

  const deleteLog = (id) => {
    setDeleteModal({ isOpen: true, logId: id });
  };

  const confirmDelete = () => {
    setLogs(logs.filter(log => log.id !== deleteModal.logId));
    setDeleteModal({ isOpen: false, logId: null });
  };

  return (
    <div className="logs-container fade-in">
      <div className="logs-header">
        <div>
          <h2 className="section-title">Reflection Logs</h2>
          <p className="section-subtitle">Journal your progress and learn from each day</p>
        </div>
        <div className="log-actions-top">
          <button className="btn-primary" onClick={() => { setLogType('daily'); setIsModalOpen(true); }}>
            <Plus size={20} />
            <span>Daily Log</span>
          </button>
          <button className="btn-primary" onClick={() => { setLogType('weekly'); setIsModalOpen(true); }}>
            <Plus size={20} />
            <span>Weekly Review</span>
          </button>
        </div>
      </div>

      <div className="logs-timeline">
        {logs.length === 0 ? (
          <div className="empty-state card glass">
            <BookOpen size={48} />
            <p>No logs yet. Start by reflecting on your day!</p>
          </div>
        ) : (
          logs.map(log => (
            <div key={log.id} className={`log-entry card glass scale-in ${log.type}`}>
              <div className="log-entry-header">
                <div className="log-meta">
                  <div className="log-type-badge">{log.type}</div>
                  <div className="log-date">
                    <Calendar size={14} />
                    <span>{log.date}</span>
                  </div>
                  {log.mood && (
                    <div className="log-mood">
                      <Smile size={14} />
                      <span>Mood: {log.mood}/5</span>
                    </div>
                  )}
                </div>
                <button className="delete-btn" onClick={() => deleteLog(log.id)}>
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="log-content">
                {log.content.workedOn && (
                  <div className="log-section">
                    <h4>What did I work on?</h4>
                    <p>{log.content.workedOn}</p>
                  </div>
                )}
                {log.content.wentWell && (
                  <div className="log-section">
                    <h4>What went well?</h4>
                    <p>{log.content.wentWell}</p>
                  </div>
                )}
                {log.content.blockers && (
                  <div className="log-section">
                    <h4>Any blockers?</h4>
                    <p>{log.content.blockers}</p>
                  </div>
                )}
                {log.content.lessons && (
                  <div className="log-section">
                    <h4>Lessons learned</h4>
                    <p>{log.content.lessons}</p>
                  </div>
                )}
                {log.content.plan && (
                  <div className="log-section">
                    <h4>Plan for next period</h4>
                    <p>{log.content.plan}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content card glass">
            <h3>{logType === 'daily' ? 'Daily Reflection' : 'Weekly Review'}</h3>
            <form onSubmit={handleAddLog}>
              {logType === 'daily' ? (
                <>
                  <div className="form-group">
                    <label>Mood (1-5)</label>
                    <input type="range" name="mood" min="1" max="5" defaultValue="3" />
                  </div>
                  <div className="form-group">
                    <label>What did I work on today?</label>
                    <textarea name="workedOn" required rows="3"></textarea>
                  </div>
                  <div className="form-group">
                    <label>What went well?</label>
                    <textarea name="wentWell" rows="2"></textarea>
                  </div>
                  <div className="form-group">
                    <label>What blocked me?</label>
                    <textarea name="blockers" rows="2"></textarea>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Key accomplishments this week</label>
                    <textarea name="workedOn" required rows="3"></textarea>
                  </div>
                  <div className="form-group">
                    <label>Lessons learned</label>
                    <textarea name="lessons" rows="2"></textarea>
                  </div>
                  <div className="form-group">
                    <label>Plan for next week</label>
                    <textarea name="plan" rows="3"></textarea>
                  </div>
                </>
              )}
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Log</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Log?"
        message="Are you sure you want to delete this reflection? This cannot be undone."
        onConfirm={confirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, logId: null })}
      />
    </div>
  );
};

export default ReflectionLogs;
