import { FiPlus, FiTrash2 } from 'react-icons/fi';

export const PlannerTimeline = ({ days, itinerary, onUpdate }) => {
  const schedule = days?.length ? days : itinerary || [];

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

  const addDay = () => {
    const next = schedule.length + 1;
    const lastDate = schedule[schedule.length - 1]?.date;
    const nextDate = lastDate
      ? new Date(new Date(lastDate).getTime() + 86400000).toISOString().slice(0, 10)
      : '';
    emit([
      ...schedule,
      { day: next, date: nextDate, title: `Day ${next}`, activities: [] },
    ]);
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
                title: 'New activity',
                description: '',
                location: '',
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
    acts[actIndex] = { ...acts[actIndex], [field]: value, name: field === 'title' ? value : acts[actIndex].name };
    updated[dayIndex] = { ...updated[dayIndex], activities: acts };
    emit(updated);
  };

  return (
    <div>
      {schedule.map((day, dayIndex) => (
        <div key={`day-${day.day}-${dayIndex}`} className="timeline-day">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <h4 style={{ marginRight: 'auto' }}>Day {day.day}</h4>
            <input
              type="date"
              value={day.date || ''}
              onChange={(e) => updateDay(dayIndex, 'date', e.target.value)}
              style={{ width: 'auto' }}
            />
            <input
              type="text"
              value={day.title || ''}
              onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
              placeholder="Day title"
              style={{ flex: 1, minWidth: '120px' }}
            />
          </div>
          {(day.activities || []).map((act, actIndex) => (
            <div key={actIndex} className="activity-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="time"
                  value={(act.time || '09:00').slice(0, 5)}
                  onChange={(e) => updateActivity(dayIndex, actIndex, 'time', e.target.value)}
                  style={{ width: '90px' }}
                />
                <input
                  type="text"
                  value={act.title || act.name || ''}
                  onChange={(e) => updateActivity(dayIndex, actIndex, 'title', e.target.value)}
                  placeholder="Activity title"
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn btn-ghost" onClick={() => removeActivity(dayIndex, actIndex)}>
                  <FiTrash2 />
                </button>
              </div>
              <input
                type="text"
                value={act.location || ''}
                onChange={(e) => updateActivity(dayIndex, actIndex, 'location', e.target.value)}
                placeholder="Location"
                style={{ marginTop: '0.35rem' }}
              />
              <input
                type="text"
                value={act.description || ''}
                onChange={(e) => updateActivity(dayIndex, actIndex, 'description', e.target.value)}
                placeholder="Description"
                style={{ marginTop: '0.35rem' }}
              />
            </div>
          ))}
          <button type="button" className="btn btn-outline" style={{ marginTop: '0.5rem' }} onClick={() => addActivity(dayIndex)}>
            <FiPlus /> Add activity
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-primary" onClick={addDay}>
        <FiPlus /> Add day
      </button>
    </div>
  );
};
