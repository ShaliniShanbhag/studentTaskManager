import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchAPI } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, go to dashboard
    const token = localStorage.getItem('taskManagerToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      const data = await fetchAPI('/user/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (data && data.success) {
        localStorage.setItem('taskManagerToken', data.token);
        localStorage.setItem('taskManagerUser', JSON.stringify(data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-screen">
      <div className="split-left">
        <div className="split-left-content">
          <h1>ScholarDesk</h1>
          <p>Elevating academic excellence through organized quiet and high-tech efficiency. Join a community of dedicated scholars.</p>
          <div className="feature-pills">
            <div className="feature-pill">
              <span>✓</span> Focus Management
            </div>
            <div className="feature-pill">
              <span>✓</span> Smart Task Lists
            </div>
          </div>
        </div>
      </div>
      <div className="split-right">
        <div className="auth-form-container">
          <h2>Welcome Back</h2>
          <p className="subtitle">Please enter your credentials to access your workspace.</p>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>✉️</span>
                <input 
                  type="email" 
                  id="email" 
                  className="form-control" 
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="student@university.edu" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label htmlFor="password" className="form-label">Password</label>
                <span style={{ fontSize: '0.85rem', color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}>Forgot Password?</span>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔒</span>
                <input 
                  type="password" 
                  id="password" 
                  className="form-control" 
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="••••••••" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input type="checkbox" id="remember" style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
              <label htmlFor="remember" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Remember this device for 30 days</label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }} disabled={loading}>
              {loading ? 'Please wait...' : 'Sign In →'}
            </button>
          </form>
          
          <div className="divider">OR CONTINUE WITH</div>

          <div className="sso-buttons">
            <button className="btn-sso">
              <span>🏛️</span> Institutional SSO
            </button>
            <button className="btn-sso">
              <span>🛡️</span> Student ID
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>New to ScholarDesk? </span>
            <Link to="/register" style={{ color: 'var(--text-main)', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          </div>
        </div>
      </div>
    </div>
  );
}
