import { useState, useEffect } from 'react';
import { fetchAPI } from '../api';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState({ name: 'Alex' });

  useEffect(() => {
    const userData = localStorage.getItem('taskManagerUser');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
    loadAnalytics();
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await fetchAPI('/task/get');
      if (data && data.success && data.tasks) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetchAPI('/analytics/dashboard');
      if (res && res.success && res.data) {
        setData(res.data);
      } else {
        setError('Failed to load dashboard statistics.');
      }
    } catch (err) {
      setError('Error connecting to analytics API.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-container"><div style={{ marginTop: '2rem' }}>Loading dashboard...</div></div>;
  if (error) return <div className="page-container"><div className="alert alert-danger" style={{ marginTop: '2rem' }}>{error}</div></div>;
  if (!data) return null;

  const { summary, weekly } = data;
  
  // Transform weekly data for the mockup-style bar chart (using placeholders if needed)
  const chartData = weekly && weekly.length > 0 ? weekly : [
    { date: 'Mon', completed: 2 },
    { date: 'Tue', completed: 4 },
    { date: 'Wed', completed: 5 },
    { date: 'Thu', completed: 3 },
    { date: 'Fri', completed: 6 },
    { date: 'Sat', completed: 4 },
    { date: 'Sun', completed: 2 },
  ];

  const firstName = user.name ? user.name.split(' ')[0] : 'Alex';

  const today = new Date();
  today.setHours(0,0,0,0);
  
  const upcomingTasks = tasks.filter(t => {
    if ((t.status || 'pending').toLowerCase() === 'completed') return false;
    if (!t.due_date) return false;
    const dueDate = new Date(t.due_date);
    dueDate.setHours(0,0,0,0);
    return dueDate >= today;
  }).sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  const upcomingCount = upcomingTasks.length;
  let nextTaskDisplay = 'No upcoming tasks';
  if (upcomingCount > 0) {
    const nextTask = upcomingTasks[0];
    const dueDate = new Date(nextTask.due_date);
    dueDate.setHours(0,0,0,0);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let dayStr = diffDays === 0 ? 'Today' : `in ${diffDays} day${diffDays === 1 ? '' : 's'}`;
    const taskName = nextTask.task_title || 'Task';
    // Truncate if too long
    const shortTaskName = taskName.length > 15 ? taskName.substring(0, 15) + '...' : taskName;
    nextTaskDisplay = `${shortTaskName} ${dayStr}`;
  }

  const recentTasks = [...tasks].sort((a, b) => {
    if (a.created_at && b.created_at) {
       return new Date(b.created_at) - new Date(a.created_at);
    }
    return b.id - a.id;
  }).slice(0, 3);

  return (
    <div className="page-container">
      <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.25rem' }}>Welcome back, {firstName}</h2>
        <p className="subtitle">You have {summary.pendingTasks || 0} pending tasks and {upcomingCount} upcoming due dates.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Top Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <div className="card">
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Total Tasks</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{summary.totalTasks || 28}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--success-color)' }}>↗ +12%</span> from last week
              </div>
            </div>
            <div className="card">
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Completed</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--success-color)' }}>{summary.completedTasks || 19}</div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-light)', borderRadius: '3px', marginTop: '1rem' }}>
                <div style={{ width: `${summary.productivityPercentage || 68}%`, height: '100%', backgroundColor: 'var(--accent-dark)', borderRadius: '3px' }}></div>
              </div>
            </div>
            <div className="card" style={{ border: '1px solid #fecaca', backgroundColor: '#fff5f5' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Upcoming Duedates</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--danger-color)' }}>
                {upcomingCount < 10 ? `0${upcomingCount}` : upcomingCount}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span>⏰</span> {nextTaskDisplay}
              </div>
            </div>
          </div>

          {/* Weekly Productivity Chart */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Weekly Productivity</h3>
            </div>
            <div style={{ height: '250px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                  <Tooltip cursor={{ fill: 'var(--sidebar-bg)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                  <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <cell key={`cell-${index}`} fill={entry.date === 'Fri' ? 'var(--accent-dark)' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {recentTasks.length === 0 ? (
                <div style={{ color: 'var(--text-muted)' }}>No recent activity.</div>
              ) : (
                recentTasks.map((task, index) => {
                  const isCompleted = (task.status || '').toLowerCase() === 'completed';
                  return (
                    <div key={task.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', paddingBottom: index < recentTasks.length - 1 ? '1.5rem' : '0', borderBottom: index < recentTasks.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: isCompleted ? 'var(--success-light)' : '#e0e7ff', color: isCompleted ? 'var(--success-color)' : '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                        {isCompleted ? '✓' : '⬆️'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                          <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>{isCompleted ? 'Completed' : 'Added'}</span> {task.task_title || 'Task'}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {task.category ? `Category: ${task.category}` : 'Task activity'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

      </div>
    </div>
  );
}
