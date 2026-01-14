import React, { useState, useEffect } from 'react';
import { Cpu, Brain, Zap, LineChart, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import { initialGoals } from '../data/initialData';
import { getForecastAnalytics } from '../utils/aiMockServices';
import '../styles/AI.css';

const AIHub = () => {
    const [goals] = useLocalStorage('goals', initialGoals);
    const [forecasts, setForecasts] = useState([]);
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        // Simulate "AI Processing" time
        const timer = setTimeout(() => {
            setForecasts(getForecastAnalytics(goals));
            setIsScanning(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [goals]);

    return (
        <div className="ai-hub-container fade-in">
            <div className="ai-hero-section">
                <div className="ai-scanning-line"></div>
                <div className="brain-visual">
                    <Brain size={32} />
                </div>
                <h1>ProgressAI Intelligence</h1>
                <p>Advanced neural analysis of your potential and productivity velocity.</p>
            </div>

            <div className="ai-grid">
                <div className="ai-card card glass scale-in">
                    <span className="ai-badge-top">VELOCITY FORECAST</span>
                    <div className="insight-header">
                        <h3>Neural Goal Projections</h3>
                        <Sparkles size={18} className="logo-icon" />
                    </div>
                    {isScanning ? (
                        <div className="empty-state">Calculating trajectories...</div>
                    ) : forecasts.length > 0 ? (
                        <div className="forecast-list">
                            {forecasts.map((f, i) => (
                                <div key={i} className="forecast-item">
                                    <div className="forecast-main">
                                        <span className="forecast-title">{f.title}</span>
                                        <span className="forecast-prediction">AI Prediction: {f.predictedDate}</span>
                                    </div>
                                    <div className="velocity-tag" style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>WEEKLY VELOCITY</div>
                                        <div style={{ fontWeight: 800, color: 'var(--success)' }}>+{f.velocity}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>
                            <Zap size={32} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                            <p>No active neural pathways detected. Create a <strong>Goal</strong> to begin performance forecasting.</p>
                        </div>
                    )}
                </div>

                <div className="ai-card card glass scale-in" style={{ animationDelay: '0.1s' }}>
                    <span className="ai-badge-top">FOCUS SCAN</span>
                    <div className="insight-header">
                        <h3>Cognitive Load Analysis</h3>
                        <Cpu size={18} />
                    </div>
                    <div className="focus-stats" style={{ marginTop: '1.5rem' }}>
                        <div className="focus-stat-item" style={{ marginBottom: '1.5rem' }}>
                            <div className="stat-label-flex" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Mental Focus Velocity</span>
                                <span style={{ fontWeight: 800 }}>88%</span>
                            </div>
                            <div className="modern-progress-bar">
                                <div className="progress-value" style={{ width: '88%' }}>
                                    <div className="shine"></div>
                                </div>
                            </div>
                        </div>
                        <div className="focus-stat-item">
                            <div className="stat-label-flex" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Distraction Resistance</span>
                                <span style={{ fontWeight: 800 }}>72%</span>
                            </div>
                            <div className="modern-progress-bar">
                                <div className="progress-value" style={{ width: '72%', background: 'var(--primary-bright)' }}>
                                    <div className="shine"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ai-tip-box" style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(99,102,241,0.1)', borderRadius: '12px', fontSize: '0.9rem' }}>
                        {goals.length > 0 ? (
                            <><strong>PRO-TIP:</strong> You are currently over-focusing on low-level tasks. Shift your neural resources to <strong>{goals[0].title}</strong> for maximum impact.</>
                        ) : (
                            <><strong>SYSTEM STATUS:</strong> Idle. Awaiting goal initialization to begin productivity optimization.</>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIHub;
