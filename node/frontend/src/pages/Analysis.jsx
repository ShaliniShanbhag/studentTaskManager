import { useState, useEffect } from 'react';
import { fetchAPI } from '../api';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

const COLORS = ['#0f172a', '#166534', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

export default function Analysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetchAPI('/analytics/dashboard');
      if (res && res.success && res.data) {
        setData(res.data);
      } else {
        setError('Failed to load analytics.');
      }
    } catch (err) {
      setError('Error connecting to analytics API.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-container"><div style={{ marginTop: '2rem' }}>Loading analytics...</div></div>;
  if (error) return <div className="page-container"><div className="alert alert-danger" style={{ marginTop: '2rem' }}>{error}</div></div>;
  if (!data) return null;

  const { summary, categories, weekly } = data;

  return (
    <div className="page-container">
      <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.25rem' }}>Detailed Analytics</h2>
        <p className="subtitle">Deep dive into your productivity and task distribution.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Category Breakdown (Pie Chart) */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Tasks by Category</h3>
          <div style={{ height: '300px', width: '100%' }}>
            {categories && categories.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}
                    itemStyle={{ color: 'var(--text-main)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '4rem' }}>No category data available.</div>
            )}
          </div>
        </div>

        {/* Category Performance (Bar Chart) */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Completion by Category</h3>
          <div style={{ height: '300px', width: '100%' }}>
            {categories && categories.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="var(--text-muted)" axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip 
                    cursor={{ fill: 'var(--sidebar-bg)' }}
                    contentStyle={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar dataKey="completed" name="Completed" fill="var(--success-color)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" name="Pending" fill="var(--text-main)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '4rem' }}>No category data available.</div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Actionable Insights</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {summary.overdueTasks > 0 ? (
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--danger-light)', borderRadius: '8px', borderLeft: '4px solid var(--danger-color)' }}>
              <div style={{ fontWeight: '600', color: 'var(--danger-color)', marginBottom: '0.5rem' }}>Action Required</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>You have {summary.overdueTasks} overdue task(s). Prioritize completing them.</p>
            </div>
          ) : (
             <div style={{ padding: '1.5rem', backgroundColor: 'var(--success-light)', borderRadius: '8px', borderLeft: '4px solid var(--success-color)' }}>
              <div style={{ fontWeight: '600', color: 'var(--accent-dark)', marginBottom: '0.5rem' }}>On Track</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>You have no overdue tasks. Great job staying on top of your work!</p>
            </div>
          )}
          
          {summary.productivityPercentage >= 80 && summary.totalTasks > 0 ? (
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--success-light)', borderRadius: '8px', borderLeft: '4px solid var(--success-color)' }}>
              <div style={{ fontWeight: '600', color: 'var(--accent-dark)', marginBottom: '0.5rem' }}>Excellent Progress</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Your productivity rate is {summary.productivityPercentage}%. Keep up the excellent work!</p>
            </div>
          ) : (
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--sidebar-bg)', borderRadius: '8px', borderLeft: '4px solid var(--text-main)' }}>
              <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Stay Focused</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>You have {summary.pendingTasks} pending task(s). Break them down to make steady progress.</p>
            </div>
          )}
          
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--sidebar-bg)', borderRadius: '8px', borderLeft: '4px solid var(--warning-color)' }}>
             <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Category Distribution</div>
             <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
               {categories && categories.length > 0 ? (
                 <>
                   Most of your tasks are in the 
                   <span style={{ 
                     backgroundColor: 
                       categories.reduce((p, c) => (p.value > c.value) ? p : c).name === 'Work' ? '#dbeafe' : 
                       categories.reduce((p, c) => (p.value > c.value) ? p : c).name === 'Personal' ? '#f3e8ff' : 
                       categories.reduce((p, c) => (p.value > c.value) ? p : c).name === 'Study' ? '#dcfce7' : 
                       categories.reduce((p, c) => (p.value > c.value) ? p : c).name === 'Health' ? '#fce7f3' : 
                       categories.reduce((p, c) => (p.value > c.value) ? p : c).name === 'Finance' ? '#fef3c7' : '#f1f5f9',
                     color: 
                       categories.reduce((p, c) => (p.value > c.value) ? p : c).name === 'Work' ? '#1e40af' : 
                       categories.reduce((p, c) => (p.value > c.value) ? p : c).name === 'Personal' ? '#6b21a8' : 
                       categories.reduce((p, c) => (p.value > c.value) ? p : c).name === 'Study' ? '#166534' : 
                       categories.reduce((p, c) => (p.value > c.value) ? p : c).name === 'Health' ? '#9d174d' : 
                       categories.reduce((p, c) => (p.value > c.value) ? p : c).name === 'Finance' ? '#92400e' : '#475569',
                     padding: '0.1rem 0.4rem', 
                     borderRadius: '4px', 
                     margin: '0 0.25rem',
                     fontWeight: '700' 
                   }}>
                     {categories.reduce((prev, current) => (prev.value > current.value) ? prev : current).name}
                   </span> 
                   category.
                 </>
               ) : "Create tasks with categories to see your distribution."}
             </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
