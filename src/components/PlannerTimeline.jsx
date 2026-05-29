import { useState } from 'react';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiClock, FiMapPin, FiArrowUp, FiArrowDown, FiCalendar, FiActivity } from 'react-icons/fi';

export const PlannerTimeline = ({ days, itinerary, onUpdate }) => {
  const schedule = days?.length ? days : itinerary || [];
  const [expandedDays, setExpandedDays] = useState({ 0: true });

  const emit = (updated) => {
    onUpdate({
      days: updated,
      itinerary: updated.map((d) => ({
        day: d.day,
        date: d.date,
        title: d.title,
        activities: d.activities,
      })),
    });
  };

  const toggleDay = (idx) => {
    setExpandedDays((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const addDay = () => {
    const next = schedule.length + 1;
    const lastDate = schedule[schedule.length - 1]?.date;
    const nextDate = lastDate
      ? new Date(new Date(lastDate).getTime() + 86400000).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);
    const updated = [
      ...schedule,
      { day: next, date: nextDate, title: `Day ${next}`, activities: [] },
    ];
    emit(updated);
    // Auto expand new day
    setExpandedDays((prev) => ({ ...prev, [schedule.length]: true }));
  };

  const removeDay = (dayIndex) => {
    if (schedule.length <= 1) return;
    const updated = schedule
      .filter((_, i) => i !== dayIndex)
      .map((d, i) => ({ ...d, day: i + 1 }));
    emit(updated);
  };

  const addActivity = (dayIndex) => {
    const updated = schedule.map((d, i) =>
      i === dayIndex
        ? {
            ...d,
            activities: [
              ...(d.activities || []),
              {
                time: '09:00',
                title: 'New Activity',
                description: '',
                location: '',
                duration: '1.5 hrs',
              },
            ],
          }
        : d
    );
    emit(updated);
  };

  const removeActivity = (dayIndex, actIndex) => {
    const updated = [...schedule];
    updated[dayIndex] = {
      ...updated[dayIndex],
      activities: updated[dayIndex].activities.filter((_, i) => i !== actIndex),
    };
    emit(updated);
  };

  const updateDay = (dayIndex, field, value) => {
    const updated = [...schedule];
    updated[dayIndex] = { ...updated[dayIndex], [field]: value };
    emit(updated);
  };

  const updateActivity = (dayIndex, actIndex, field, value) => {
    const updated = [...schedule];
    const acts = [...(updated[dayIndex].activities || [])];
    acts[actIndex] = { 
      ...acts[actIndex], 
      [field]: value, 
      name: field === 'title' ? value : acts[actIndex].name 
    };
    updated[dayIndex] = { ...updated[dayIndex], activities: acts };
    emit(updated);
  };

  const moveActivity = (dayIndex, actIndex, direction) => {
    const day = schedule[dayIndex];
    if (!day || !day.activities) return;
    const activities = [...day.activities];
    const targetIdx = direction === 'up' ? actIndex - 1 : actIndex + 1;
    if (targetIdx < 0 || targetIdx >= activities.length) return;

    // Swap activities
    const temp = activities[actIndex];
    activities[actIndex] = activities[targetIdx];
    activities[targetIdx] = temp;

    const updated = [...schedule];
    updated[dayIndex] = { ...day, activities };
    emit(updated);
  };

  return (
    <div className="planner-timeline-wrapper">
      <div className="timeline-days-container">
        {schedule.map((day, dayIndex) => {
          const isExpanded = !!expandedDays[dayIndex];
          const activitiesCount = day.activities?.length || 0;

          return (
            <div 
              key={`day-${day.day}-${dayIndex}`} 
              className={`timeline-day-card glass-card ${isExpanded ? 'is-expanded' : ''}`}
            >
              {/* Day Card Header */}
              <div className="day-card-header" onClick={() => toggleDay(dayIndex)}>
                <div className="day-header-main">
                  <span className="day-badge">Day {day.day}</span>
                  <div className="day-title-info">
                    <h4>{day.title || `Day ${day.day}`}</h4>
                    <span className="day-meta-text">
                      {day.date ? new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Set Date'}
                      {` · ${activitiesCount} ${activitiesCount === 1 ? 'activity' : 'activities'}`}
                    </span>
                  </div>
                </div>

                <div className="day-header-actions" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="date"
                    value={day.date || ''}
                    onChange={(e) => updateDay(dayIndex, 'date', e.target.value)}
                    className="timeline-date-picker"
                    aria-label="Day Date"
                  />
                  <input
                    type="text"
                    value={day.title || ''}
                    onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                    placeholder="Rename Day"
                    className="timeline-title-input"
                    aria-label="Day Title"
                  />
                  {schedule.length > 1 && (
                    <button 
                      type="button" 
                      className="btn-icon-danger" 
                      onClick={() => removeDay(dayIndex)}
                      title="Delete Day"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                  <button type="button" className="btn-icon-ghost">
                    {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Day Card Body / Activities list */}
              {isExpanded && (
                <div className="day-card-body">
                  <div className="activities-timeline">
                    {day.activities && day.activities.map((act, actIndex) => {
                      const showTransit = actIndex < day.activities.length - 1;
                      return (
                        <div key={actIndex} className="activity-timeline-item">
                          <div className="activity-node">
                            <span className="activity-node-dot">
                              <FiActivity size={12} />
                            </span>
                            {showTransit && <span className="activity-node-line" />}
                          </div>

                          <div className="activity-card-inner glass-card">
                            {/* Top row: Time, Title, Actions */}
                            <div className="activity-row-main">
                              <div className="activity-time-input-wrap">
                                <FiClock className="input-icon" />
                                <input
                                  type="time"
                                  value={(act.time || '09:00').slice(0, 5)}
                                  onChange={(e) => updateActivity(dayIndex, actIndex, 'time', e.target.value)}
                                  className="activity-time-input"
                                />
                              </div>

                              <input
                                type="text"
                                value={act.title || act.name || ''}
                                onChange={(e) => updateActivity(dayIndex, actIndex, 'title', e.target.value)}
                                placeholder="E.g., Breakfast at café, Visit museum..."
                                className="activity-title-input"
                              />

                              <div className="activity-action-group">
                                <button
                                  type="button"
                                  className="btn-icon-tiny"
                                  disabled={actIndex === 0}
                                  onClick={() => moveActivity(dayIndex, actIndex, 'up')}
                                  title="Move Up"
                                >
                                  <FiArrowUp size={14} />
                                </button>
                                <button
                                  type="button"
                                  className="btn-icon-tiny"
                                  disabled={actIndex === day.activities.length - 1}
                                  onClick={() => moveActivity(dayIndex, actIndex, 'down')}
                                  title="Move Down"
                                >
                                  <FiArrowDown size={14} />
                                </button>
                                <button 
                                  type="button" 
                                  className="btn-icon-tiny-danger" 
                                  onClick={() => removeActivity(dayIndex, actIndex)}
                                  title="Remove Activity"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            </div>

                            {/* Second row: Location & Duration */}
                            <div className="activity-row-secondary">
                              <div className="activity-field-wrap">
                                <FiMapPin className="field-icon" />
                                <input
                                  type="text"
                                  value={act.location || ''}
                                  onChange={(e) => updateActivity(dayIndex, actIndex, 'location', e.target.value)}
                                  placeholder="Location or address"
                                  className="activity-details-input"
                                />
                              </div>

                              <div className="activity-field-wrap">
                                <FiClock className="field-icon" />
                                <input
                                  type="text"
                                  value={act.duration || '1 hr'}
                                  onChange={(e) => updateActivity(dayIndex, actIndex, 'duration', e.target.value)}
                                  placeholder="Duration (e.g. 2 hrs)"
                                  className="activity-details-input width-small"
                                />
                              </div>
                            </div>

                            {/* Third row: Description */}
                            <textarea
                              value={act.description || ''}
                              onChange={(e) => updateActivity(dayIndex, actIndex, 'description', e.target.value)}
                              placeholder="Add descriptions, ticket details, or notes..."
                              className="activity-desc-textarea"
                            />
                          </div>

                          {/* Transit / Travel Time Indicator */}
                          {showTransit && (
                            <div className="transit-indicator">
                              <span className="transit-badge">🚗 15–20 mins transit time</span>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {!activitiesCount && (
                      <div className="empty-activities-placeholder">
                        <p>No activities scheduled for this day yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Add Activity Button inside Day */}
                  <div className="day-card-footer">
                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm" 
                      onClick={() => addActivity(dayIndex)}
                    >
                      <FiPlus /> Add Activity
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Global Add Day Button */}
      <div className="timeline-actions">
        <button type="button" className="btn btn-primary" onClick={addDay}>
          <FiPlus /> Add Planning Day
        </button>
      </div>
    </div>
  );
};
