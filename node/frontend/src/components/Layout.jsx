import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('taskManagerToken');
    const userData = localStorage.getItem('taskManagerUser');

    if (!token) {
      navigate('/');
    } else if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }

    // Listen for unauthorized event from api.js
    const handleUnauthorized = () => {
      navigate('/');
    };
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('taskManagerToken');
    localStorage.removeItem('taskManagerUser');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>ScholarDesk</h1>
          <p>Academic Excellence</p>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="/dashboard" 
            className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            <span>▦</span> Dashboard
          </Link>
          <Link 
            to="/tasks" 
            className={`nav-item ${location.pathname === '/tasks' ? 'active' : ''}`}
          >
            <span>✓</span> Tasks
          </Link>
          <Link 
            to="/analysis" 
            className={`nav-item ${location.pathname === '/analysis' ? 'active' : ''}`}
          >
            <span>📊</span> Analysis
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/add-task" className="btn btn-primary" style={{ width: '100%', padding: '0.6rem' }}>
            + Add New Task
          </Link>
          <button onClick={handleLogout} className="nav-item" style={{ color: 'var(--text-main)', marginTop: '1rem' }}>
            <span>🚪</span> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="topbar" style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 2rem' }}>
          {/* Header layout simplified - placeholders removed */}
        </header>

        <Outlet />
      </div>
    </div>
  );
}
