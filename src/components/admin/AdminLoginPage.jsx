import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowLeft, AlertCircle } from 'lucide-react';

export const AdminLoginPage = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (username === 'admin' && password === 'admin123') {
      setIsScanning(true);
      // Simulate fingerprint/cyber scan sequence
      setTimeout(() => {
        setIsScanning(false);
        onLoginSuccess();
      }, 1500);
    } else {
      setIsShaking(true);
      setError('Access Denied: Invalid Security Credentials.');
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="admin-login-overlay">
      {/* 3D Moving Cyber Grid background */}
      <div className="cyber-grid-bg"></div>

      <div className={`admin-login-box ${isShaking ? 'shake-active' : ''}`}>
        {/* Floating Back to Shop Button */}
        <button className="admin-back-btn" onClick={onCancel}>
          <ArrowLeft size={16} /> Exit Portal
        </button>

        {/* 3D Security Shield Header */}
        <div className="admin-login-header">
          <div className="shield-3d-container">
            <div className="shield-3d-core">
              <ShieldCheck size={38} style={{ color: '#ef4444' }} />
            </div>
            <div className="shield-ring outer"></div>
            <div className="shield-ring inner"></div>
          </div>
          <h2 className="admin-portal-title">MAGNET CONTROL PORTAL</h2>
          <p className="admin-portal-subtitle">Secure mainframe database authentication</p>
        </div>

        {/* Security Scanner Overlay */}
        {isScanning ? (
          <div className="scanner-container">
            <div className="scanner-laser"></div>
            <div className="scanner-fingerprint">
              <svg viewBox="0 0 64 64" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
                <path d="M20 30c0-6.6 5.4-12 12-12s12 5.4 12 12v4M14 30c0-10 8-18 18-18s18 8 18 18v8M8 30c0-13.3 10.7-24 24-24s24 10.7 24 24v12" />
                <path d="M26 30v14M32 30v18M38 30v14" />
              </svg>
            </div>
            <span className="scanner-text">AUTHORIZING MAINFRAME...</span>
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
              <label className="input-label-3d">Security Username</label>
              <div className="input-wrapper-3d">
                <User size={16} className="input-icon-3d" />
                <input 
                  type="text" 
                  className="input-field-3d"
                  placeholder="Enter admin ID"
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

            <button type="submit" className="admin-submit-btn">
              Authenticate Terminal
            </button>
            
            <div className="credentials-tip">
              <span>Demo credentials: <strong>admin</strong> / <strong>admin123</strong></span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
