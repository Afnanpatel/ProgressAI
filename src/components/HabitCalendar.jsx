import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import '../styles/Habits.css';

const HabitCalendar = ({ habit }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const onNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const onPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    // Generate days
    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    const getDayStatus = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const log = habit.logs.find(l => l.date === dateStr);
        if (log?.completed) return 'completed';

        // Use logic for missed days if needed (e.g. past today and not completed)
        if (date < new Date() && !isSameDay(date, new Date()) && !log) {
            // Check frequency logic here if complex, for now assume daily
            return 'missed';
        }
        return 'none';
    };

    return (
        <div className="habit-calendar-wrapper">
            <div className="calendar-header">
                <button onClick={onPrevMonth}><ChevronLeft size={20} /></button>
                <span>{format(currentMonth, "MMMM yyyy")}</span>
                <button onClick={onNextMonth}><ChevronRight size={20} /></button>
            </div>
            <div className="calendar-days-header">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="col-header">{d}</div>
                ))}
            </div>
            <div className="calendar-body">
                {calendarDays.map((dayItem, idx) => {
                    const status = getDayStatus(dayItem);
                    const isCurrentMonth = isSameMonth(dayItem, monthStart);

                    return (
                        <div
                            key={dayItem.toString()}
                            className={`calendar-cell ${!isCurrentMonth ? 'disabled' : ''} ${status}`}
                        >
                            <span className="number">{format(dayItem, dateFormat)}</span>
                            {status === 'completed' && <div className="dot success"></div>}
                            {status === 'missed' && <div className="dot missed"></div>}
                        </div>
                    );
                })}
            </div>

            <div className="calendar-footer">
                <div className="stat-item">
                    <span className="label">Current Streak</span>
                    <span className="value">{habit.streak}</span>
                </div>
                <div className="stat-item">
                    <span className="label">Completion Rate</span>
                    <span className="value">--%</span> {/* Placeholder for now */}
                </div>
            </div>
        </div>
    );
};

export default HabitCalendar;
