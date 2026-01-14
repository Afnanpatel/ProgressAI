import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import GoalsView from './components/GoalsView';
import TasksView from './components/TasksView';
import HabitsView from './components/HabitsView';
import ReflectionLogs from './components/ReflectionLogs';
import AuthView from './components/AuthView';
import AnalyticsView from './components/AnalyticsView';
import DownloadsView from './components/DownloadsView';
import ProfileView from './components/ProfileView';
import AIHub from './components/AIHub';
import './styles/globals.css';
import './styles/Auth.css';
import './styles/Goals.css';
import './styles/Tasks.css';
import './styles/Habits.css';
import './styles/Logs.css';
import './styles/Dashboard.css';
import './styles/Forms.css';

const AppContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <AuthView />;
  }

  const renderContent = () => {
    try {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard />;
        case 'goals':
          return <GoalsView />;
        case 'tasks':
          return <TasksView />;
        case 'habits':
          return <HabitsView />;
        case 'logs':
          return <ReflectionLogs />;
        case 'analytics':
          return <AnalyticsView />;
        case 'downloads':
          return <DownloadsView />;
        case 'profile':
          return <ProfileView />;
        case 'ai-hub':
          return <AIHub />;
        default:
          return <Dashboard />;
      }
    } catch (error) {
      console.error('Render error:', error);
      return <div className="card">Something went wrong. Check console.</div>;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
