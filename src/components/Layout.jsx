import React from 'react';
import { useTheme } from '../hooks/useTheme';
import {
    LayoutDashboard,
    Target,
    CheckSquare,
    RefreshCcw,
    Calendar,
    BarChart2,
    X,
    Layout as LayoutIcon,
    Menu,
    Download,
    User,
    Brain
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import '../styles/Layout.css';

const SidebarItem = ({ icon: IconComponent, label, active, onClick }) => (
    <div
        className={`sidebar-item ${active ? 'active' : ''}`}
        onClick={onClick}
    >
        {IconComponent && <IconComponent size={20} />}
        <span>{label}</span>
    </div>
);

const Layout = ({ children, activeTab, setActiveTab }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'ai-hub', label: 'AI Hub', icon: Brain },
        { id: 'goals', label: 'Goals', icon: Target },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'habits', label: 'Habits', icon: RefreshCcw },
        { id: 'logs', label: 'Reflections', icon: Calendar },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
        { id: 'downloads', label: 'Downloads', icon: Download },
        { id: 'profile', label: 'Profile', icon: User }
    ];


    return (
        <div className={`app-layout ${theme}`}>
            {/* Sidebar toggle for mobile */}
            <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <aside className={`sidebar glass ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <LayoutIcon size={28} className="logo-icon" />
                    <span className="logo-text">ProgressAI</span>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map(item => (
                        <SidebarItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            active={activeTab === item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                if (window.innerWidth < 768) setIsSidebarOpen(false);
                            }}
                        />
                    ))}
                </nav>
            </aside>

            <main className="main-content">
                <header className="main-header glass">
                    <div className="header-search">
                        <h1 className="current-view-title">{menuItems.find(i => i.id === activeTab)?.label}</h1>
                    </div>
                    <div className="header-user" onClick={() => setActiveTab('profile')} style={{ cursor: 'pointer' }}>
                        <div className="user-info-text">
                            <span className="user-name">{user?.name}</span>
                            <span className="user-email">{user?.email}</span>
                        </div>
                        <div className="user-avatar" title={user?.name || 'User'}>
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" className="avatar-img" />
                            ) : (
                                user?.name
                                    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                                    : 'U'
                            )}
                        </div>
                    </div>
                </header>
                <div className="content-area">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
