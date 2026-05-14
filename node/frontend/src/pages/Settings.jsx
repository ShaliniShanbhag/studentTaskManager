import { useState, useEffect } from 'react';
import { fetchAPI } from '../api';

export default function Settings() {
  const [user, setUser] = useState({ name: '', email: '' });

  useEffect(() => {
    const userData = localStorage.getItem('taskManagerUser');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
        <h2>Settings</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>Support</span>
          <span style={{ fontWeight: '600', borderBottom: '2px solid var(--primary-color)' }}>Account</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Profile Management */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Profile Management</h3>
              <button className="btn btn-primary btn-small">Save Changes</button>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div>
                <div style={{ width: '120px', height: '120px', borderRadius: '12px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ fontSize: '3rem', color: '#94a3b8' }}>👤</span>
                  <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    📷
                  </div>
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control" defaultValue={user.name ? user.name.split(' ')[0] : 'Julian'} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control" defaultValue={user.name ? user.name.split(' ').slice(1).join(' ') : 'Ames'} />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" defaultValue={user.email || 'julian.ames@university.edu'} />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Academic Bio</label>
                  <textarea className="form-control" rows="3" defaultValue="Senior Economics major focused on behavioral finance and data analysis."></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Authentication */}
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Security & Authentication</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-control" defaultValue="********" />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-control" placeholder="Min. 8 characters" />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-control" defaultValue="********" />
                </div>
                <button className="btn btn-outline" style={{ backgroundColor: '#f1f5f9' }}>Update Password</button>
              </div>
              
              <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>🛡️</span>
                  <h4 style={{ fontWeight: '600' }}>Two-Factor Auth</h4>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
                  Add an extra layer of security to your academic portal.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Currently Disabled</span>
                  <button className="btn" style={{ fontWeight: '600', fontSize: '0.9rem', padding: 0 }}>Enable Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Preferences */}
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Preferences</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontWeight: '600' }}>Email Notifications</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Task reminders and grade updates</div>
              </div>
              <div style={{ width: '40px', height: '20px', borderRadius: '10px', backgroundColor: 'var(--success-color)', position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', right: '2px', top: '2px' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <div style={{ fontWeight: '600' }}>Focus Mode</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Silence non-academic alerts</div>
              </div>
              <div style={{ width: '40px', height: '20px', borderRadius: '10px', backgroundColor: '#cbd5e1', position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', left: '2px', top: '2px' }}></div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Theme</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn" style={{ flex: 1, backgroundColor: 'var(--primary-color)', color: 'white', border: '1px solid var(--primary-color)' }}>
                  ☀️ Light
                </button>
                <button className="btn btn-outline" style={{ flex: 1 }}>
                  🌙 Dark
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Primary Language</label>
              <select className="form-control">
                <option>English (US)</option>
              </select>
            </div>
          </div>

          {/* Plan & Storage */}
          <div className="card" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
            <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: '#94a3b8' }}>Plan & Storage</h3>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '700' }}>4.2</span>
              <span style={{ color: '#94a3b8' }}>/ 10 GB</span>
            </div>
            
            <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '1.5rem' }}>
              <div style={{ width: '42%', height: '100%', backgroundColor: 'var(--success-color)', borderRadius: '2px' }}></div>
            </div>
            
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>ScholarDesk Pro Plan</p>
            
            <button className="btn" style={{ width: '100%', backgroundColor: 'white', color: 'var(--primary-color)' }}>
              Manage Subscription
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
