import { useState, useEffect } from 'react';
import { fetchAPI } from '../api';

export default function DailyPlanner() {
  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeFrame, setTimeFrame] = useState('today'); // 'today', 'tomorrow', 'week'

  useEffect(() => {
    loadDailySubtasks();
  }, []);

  const loadDailySubtasks = async () => {
    setLoading(true);
    setError('');
    try {
      // We still fetch the same endpoint since it returns all relevant incomplete tasks
      // Alternatively we can fetch all subtasks if backend logic needs update, 
      // but for now we'll use the current endpoint which returns all incomplete tasks.
      const data = await fetchAPI('/task/daily-subtasks');
      if (data && data.success) {
        setSubtasks(data.subtasks || []);
      }
    } catch (err) {
      setError('Failed to fetch daily study planner schedule.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubtask = async (subtask) => {
    const nextStatus = !subtask.is_completed;
    try {
      await fetchAPI(`/task/subtasks/${subtask.id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_completed: nextStatus })
      });

      // Update state locally
      setSubtasks(subtasks.map(s => s.id === subtask.id ? { ...s, is_completed: nextStatus } : s));
      setSuccess(`Updated "${subtask.title}"!`);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to update subtask completion.');
    }
  };

  if (loading) return <div className="page-container"><div style={{ marginTop: '2rem' }}>Loading Daily study schedule planner...</div></div>;

  // Compute boundaries
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const nextWeekDate = new Date(todayDate);
  nextWeekDate.setDate(nextWeekDate.getDate() + 7);

  const getLocalDateStr = (dateObj) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalDateStr(todayDate);
  const tomorrowStr = getLocalDateStr(tomorrowDate);
  const nextWeekStr = getLocalDateStr(nextWeekDate);

  // Filter subtasks based on selected time frame
  let displayedTasks = [];
  let headerText = '';

  if (timeFrame === 'today') {
      displayedTasks = subtasks.filter(s => !s.schedule_date || s.schedule_date.split('T')[0] <= todayStr);
      headerText = "📅 Today's Study & Task Planner";
  } else if (timeFrame === 'tomorrow') {
      displayedTasks = subtasks.filter(s => s.schedule_date && s.schedule_date.split('T')[0] === tomorrowStr);
      headerText = "📅 Tomorrow's Planner";
  } else if (timeFrame === 'week') {
      displayedTasks = subtasks.filter(s => s.schedule_date && s.schedule_date.split('T')[0] > todayStr && s.schedule_date.split('T')[0] <= nextWeekStr);
      headerText = "📅 Next 7 Days Planner";
  }

  const totalScheduled = displayedTasks.length;
  const completedCount = displayedTasks.filter(s => s.is_completed).length;
  const performanceRate = totalScheduled > 0 ? Math.round((completedCount / totalScheduled) * 100) : 0;

  return (
    <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '2rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.25rem' }}>{headerText}</h2>
        <p className="subtitle">Focus step-by-step to stay balanced and complete all course milestones on schedule.</p>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button 
          className={`btn ${timeFrame === 'today' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setTimeFrame('today')}
        >
          Today
        </button>
        <button 
          className={`btn ${timeFrame === 'tomorrow' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setTimeFrame('tomorrow')}
        >
          Tomorrow
        </button>
        <button 
          className={`btn ${timeFrame === 'week' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setTimeFrame('week')}
        >
          Next 7 Days
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Side: Checklist Grid */}
        <div>
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📝 Scheduled Sub-Tasks Checklist
            </h3>

            {totalScheduled === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '3rem' }}>🎉</span>
                <h4 style={{ marginTop: '1rem', color: 'var(--text-main)' }}>You are completely caught up!</h4>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>No sub-tasks are scheduled for this time frame. Create new tasks or use Gemini AI to break down complex workloads.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {displayedTasks.map(sub => {
                  const isOverdue = sub.schedule_date && sub.schedule_date.split('T')[0] < todayStr && !sub.is_completed;
                  return (
                    <div 
                      key={sub.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '1rem 1.25rem', 
                        borderRadius: '8px', 
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <input 
                          type="checkbox" 
                          checked={!!sub.is_completed}
                          onChange={() => handleToggleSubtask(sub)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <div>
                          <div 
                            style={{ 
                              fontWeight: '600', 
                              fontSize: '0.95rem',
                              color: sub.is_completed ? 'var(--text-muted)' : 'var(--text-main)',
                              textDecoration: sub.is_completed ? 'line-through' : 'none'
                            }}
                          >
                            {sub.title}
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                            <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: '700' }}>
                              {sub.task_title}
                            </span>
                            {isOverdue && (
                              <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: 'var(--danger-light)', color: 'var(--danger-color)', fontWeight: '700' }}>
                                OVERDUE STEP
                              </span>
                            )}
                            {timeFrame !== 'today' && sub.schedule_date && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {new Date(sub.schedule_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                          <div>Est: <strong>{sub.estimated_time}m</strong></div>
                          <div>Act: <strong>{sub.actual_time || 0}m</strong></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Stats */}
        <div>
          {/* Daily completion rate widget */}
          <div className="card" style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Completion Rate
            </h4>
            <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--accent-dark)', marginBottom: '0.5rem' }}>
              {performanceRate}%
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-light)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{ width: `${performanceRate}%`, height: '100%', backgroundColor: 'var(--accent-dark)', borderRadius: '4px', transition: 'width 0.3s ease' }}></div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Completed <strong>{completedCount}</strong> of <strong>{totalScheduled}</strong> scheduled steps for {timeFrame}.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
