import React, { useState, useRef } from 'react';
import {
    User,
    Mail,
    Camera,
    Moon,
    Sun,
    Trash2,
    LogOut,
    Shield,
    Bell,
    Settings
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import ConfirmationModal from './ConfirmationModal';
import '../styles/Profile.css';

const ProfileView = () => {
    const { user, updateUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const fileInputRef = useRef(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        type: 'danger'
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUser({ avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResetProgress = () => {
        setModalConfig({
            isOpen: true,
            title: 'Reset All Data?',
            message: 'WARNING: This will permanently delete all your goals, tasks, habits, and reflection logs. This action cannot be undone.',
            type: 'danger',
            onConfirm: () => {
                const keysToReset = ['goals', 'tasks', 'habits', 'reflection_logs'];

                keysToReset.forEach(key => {
                    localStorage.removeItem(key);
                    if (user?.id) {
                        localStorage.removeItem(`${key}_${user.id}`);
                    }
                });

                window.location.reload();
            }
        });
    };

    const handleLogout = () => {
        setModalConfig({
            isOpen: true,
            title: 'Logout?',
            message: 'Are you sure you want to sign out of your account?',
            type: 'primary',
            onConfirm: () => logout()
        });
    };

    return (
        <div className="profile-container">
            <div className="profile-header-card card glass">
                <div className="profile-banner"></div>
                <div className="profile-main-info">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar large">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" />
                            ) : (
                                <span className="avatar-placeholder">
                                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </span>
                            )}
                            <button
                                className="avatar-edit-btn"
                                onClick={() => fileInputRef.current.click()}
                                title="Change Profile Picture"
                            >
                                <Camera size={18} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>
                    <div className="profile-text-info">
                        <h2>{user?.name}</h2>
                        <p className="user-email-text"><Mail size={14} /> {user?.email}</p>
                    </div>
                </div>
            </div>

            <div className="profile-settings-grid">
                <section className="settings-section card glass">
                    <div className="section-header">
                        <Settings size={20} />
                        <h3>Account Settings</h3>
                    </div>
                    <div className="settings-list">
                        <div className="settings-item">
                            <div className="item-info">
                                <h4>Display Name</h4>
                                <p>How you appear in the app</p>
                            </div>
                            <input
                                type="text"
                                defaultValue={user?.name}
                                className="settings-input"
                                onBlur={(e) => updateUser({ name: e.target.value })}
                            />
                        </div>
                        <div className="settings-item">
                            <div className="item-info">
                                <h4>Email Address</h4>
                                <p>Used for login and notifications</p>
                            </div>
                            <input
                                type="email"
                                defaultValue={user?.email}
                                className="settings-input"
                                disabled
                            />
                        </div>
                    </div>
                </section>

                <section className="settings-section card glass">
                    <div className="section-header">
                        <Moon size={20} />
                        <h3>Appearance</h3>
                    </div>
                    <div className="settings-list">
                        <div className="settings-item" onClick={toggleTheme} style={{ cursor: 'pointer' }}>
                            <div className="item-info">
                                <h4>{theme === 'light' ? 'Light' : 'Dark'} Mode</h4>
                                <p>Switch between light and dark themes</p>
                            </div>
                            <div className={`theme-switch ${theme}`}>
                                <div className="switch-handle">
                                    {theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="settings-section card glass danger-zone">
                    <div className="section-header">
                        <Shield size={20} />
                        <h3>Danger Zone</h3>
                    </div>
                    <div className="settings-list">
                        <div className="settings-item">
                            <div className="item-info">
                                <h4>Reset Progress</h4>
                                <p>Clear all your tracking data. This cannot be undone.</p>
                            </div>
                            <button className="btn-danger-outline" onClick={handleResetProgress}>
                                <Trash2 size={16} />
                                <span>Reset All Data</span>
                            </button>
                        </div>
                        <div className="settings-item">
                            <div className="item-info">
                                <h4>Logout</h4>
                                <p>Sign out of your account on this device</p>
                            </div>
                            <button className="btn-secondary" onClick={handleLogout}>
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            <div className="website-info-section card glass">
                <div className="section-header justify-center">
                    <Shield size={20} />
                    <h3>Website Info</h3>
                </div>
                <div className="website-credits">
                    <p>This website was created by</p>
                    <h4>AFNAN PATEL</h4>
                    <span className="engineer-tag">I'm an engineer</span>
                </div>
            </div>

            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={modalConfig.onConfirm}
            />
        </div>
    );
};

export default ProfileView;
