import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Flame, Target } from 'lucide-react';

const HabitCalendar = ({ habit, streak }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Add padding for start of month
    const startDay = monthStart.getDay(); // 0 is Sunday
    const paddingDays = Array(startDay).fill(null);

    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    // Calc Rate
    const completedCount = habit.logs.filter(l => l.completed).length;
    const rate = habit.logs.length > 0 ? Math.round((completedCount / (habit.logs.length || 1)) * 100) : 0;

    return (
        <div className="habit-calendar-wrapper">
            <div className="calendar-header">
                <button onClick={prevMonth}><ChevronLeft /></button>
                <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
                <button onClick={nextMonth}><ChevronRight /></button>
            </div>

            <div className="calendar-days-header">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} className="day-name">{d}</div>
                ))}
            </div>

            <div className="calendar-body">
                {paddingDays.map((_, i) => (
                    <div key={`p-${i}`} className="calendar-cell disabled" />
                ))}
                {daysInMonth.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCompleted = habit.logs.some(l => l.date === dateStr && l.completed);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div
                            key={dateStr}
                            className={`calendar-cell ${isCompleted ? 'completed' : ''} ${isToday ? 'is-today' : ''}`}
                        >
                            {format(day, 'd')}
                        </div>
                    );
                })}
            </div>

            <div className="calendar-footer">
                <div className="stat-item">
                    <span className="label">Streak</span>
                    <div className="value-row" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Flame size={20} className="text-orange" />
                        <span className="value" style={{ fontSize: '1.5rem', fontWeight: '800', color: '#3b82f6' }}>{streak}</span>
                    </div>
                </div>
                <div className="stat-item">
                    <span className="label">Rate</span>
                    <div className="value-row" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Target size={20} className="text-blue" style={{ color: '#3b82f6' }} />
                        <span className="value" style={{ fontSize: '1.5rem', fontWeight: '800', color: '#3b82f6' }}>{rate}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HabitCalendar;
