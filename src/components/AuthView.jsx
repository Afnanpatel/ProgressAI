import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Layout as LayoutIcon, Mail, Lock, User as UserIcon } from 'lucide-react';
import '../styles/Auth.css';

const AuthView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        login(formData.email, formData.password);
      } else {
        signup(formData.name, formData.email, formData.password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleAuth = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="auth-container">
      <div className="auth-card card glass">
        <div className="auth-header">
          <div className="logo">
            <LayoutIcon size={32} className="logo-icon" />
            <span>ProgressAI</span>
          </div>
          <h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>
          <p>{isLogin ? 'Login to continue your growth' : 'Join us to track your progress'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error-message">{error}</div>}
          {!isLogin && (
            <div className="form-group">
              <label><UserIcon size={14} /> Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          <div className="form-group">
            <label><Mail size={14} /> Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label><Lock size={14} /> Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary auth-submit">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={toggleAuth} className="toggle-auth">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
