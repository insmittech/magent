import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowLeft, AlertCircle, ShieldAlert, KeyRound, Sparkles } from 'lucide-react';

export const AdminLoginPage = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [authenticatedRole, setAuthenticatedRole] = useState('admin');

  const isSuperAdminInput = username.toLowerCase().includes('super');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const u = username.trim().toLowerCase();
    const p = password.trim();

    if ((u === 'superadmin' || u === 'superadmin@magnet.com') && p === 'superadmin123') {
      setIsScanning(true);
      setAuthenticatedRole('super_admin');
      setTimeout(() => {
        setIsScanning(false);
        onLoginSuccess('super_admin');
      }, 1200);
    } else if ((u === 'admin' || u === 'admin@magnet.com') && p === 'admin123') {
      setIsScanning(true);
      setAuthenticatedRole('admin');
      setTimeout(() => {
        setIsScanning(false);
        onLoginSuccess('admin');
      }, 1200);
    } else {
      setIsShaking(true);
      setError('Access Denied: Invalid Security Credentials.');
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleFillDemo = (role) => {
    if (role === 'super_admin') {
      setUsername('superadmin');
      setPassword('superadmin123');
    } else {
      setUsername('admin');
      setPassword('admin123');
    }
    setError('');
  };

  return (
    <div className="admin-login-overlay">
      {/* 3D Moving Cyber Grid background */}
      <div className="cyber-grid-bg"></div>

      <div className={`admin-login-box ${isShaking ? 'shake-active' : ''} ${isSuperAdminInput ? 'super-theme' : ''}`}>
        {/* Floating Back to Shop Button */}
        <button className="admin-back-btn" onClick={onCancel}>
          <ArrowLeft size={16} /> Exit Portal
        </button>

        {/* 3D Security Shield Header */}
        <div className="admin-login-header">
          <div className="shield-3d-container">
            <div className="shield-3d-core">
              {isSuperAdminInput ? (
                <ShieldAlert size={38} style={{ color: '#f59e0b' }} />
              ) : (
                <ShieldCheck size={38} style={{ color: '#ef4444' }} />
              )}
            </div>
            <div className="shield-ring outer" style={{ borderColor: isSuperAdminInput ? 'rgba(245, 158, 11, 0.4)' : undefined }}></div>
            <div className="shield-ring inner" style={{ borderColor: isSuperAdminInput ? 'rgba(245, 158, 11, 0.6)' : undefined }}></div>
          </div>
          <h2 className="admin-portal-title">
            {isSuperAdminInput ? 'SUPER ADMIN GOVERNANCE' : 'MAGNET CONTROL PORTAL'}
          </h2>
          <p className="admin-portal-subtitle">
            {isSuperAdminInput ? 'Master administrative access & system quotas' : 'Secure storefront database authentication'}
          </p>
        </div>

        {/* Security Scanner Overlay */}
        {isScanning ? (
          <div className="scanner-container">
            <div className="scanner-laser" style={{ background: authenticatedRole === 'super_admin' ? '#f59e0b' : '#ef4444' }}></div>
            <div className="scanner-fingerprint">
              <svg viewBox="0 0 64 64" fill="none" stroke={authenticatedRole === 'super_admin' ? '#f59e0b' : '#ef4444'} strokeWidth="2.5" strokeLinecap="round">
                <path d="M20 30c0-6.6 5.4-12 12-12s12 5.4 12 12v4M14 30c0-10 8-18 18-18s18 8 18 18v8M8 30c0-13.3 10.7-24 24-24s24 10.7 24 24v12" />
                <path d="M26 30v14M32 30v18M38 30v14" />
              </svg>
            </div>
            <span className="scanner-text">
              {authenticatedRole === 'super_admin' ? 'AUTHORIZING SUPER ADMIN ACCESS...' : 'AUTHORIZING STORE TERMINAL...'}
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="admin-login-form">
            {error && (
              <div className="error-banner">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="input-group-3d">
              <label className="input-label-3d">Security Username / Email</label>
              <div className="input-wrapper-3d">
                <User size={16} className="input-icon-3d" />
                <input 
                  type="text" 
                  className="input-field-3d"
                  placeholder="e.g. superadmin or admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="input-group-3d" style={{ marginTop: '1.25rem' }}>
              <label className="input-label-3d">Security Passcode</label>
              <div className="input-wrapper-3d">
                <Lock size={16} className="input-icon-3d" />
                <input 
                  type="password" 
                  className="input-field-3d"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="admin-submit-btn"
              style={{
                background: isSuperAdminInput 
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                  : undefined,
                boxShadow: isSuperAdminInput 
                  ? '0 0 20px rgba(245, 158, 11, 0.4)' 
                  : undefined
              }}
            >
              {isSuperAdminInput ? 'Authenticate Super Admin' : 'Authenticate Terminal'}
            </button>
            
            {/* Demo Quick Fill Switcher */}
            <div className="credentials-tip" style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                Quick Login Demo Roles:
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleFillDemo('super_admin')}
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: '#fbbf24',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  👑 Super Admin (superadmin)
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin')}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  🛡️ Staff Admin (admin)
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
