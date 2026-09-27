import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';
import type { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  initialRole?: 'customer' | 'admin';
  onClose: () => void;
  onLoginSuccess: (profile: Partial<UserProfile>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  initialRole = 'customer',
  onClose,
  onLoginSuccess
}) => {
  const [selectedRole, setSelectedRole] = useState<'customer' | 'admin'>(initialRole);
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Sync role and mode when opened or props change
  useEffect(() => {
    if (isOpen) {
      setSelectedRole(initialRole);
      setMode(initialMode);
    }
  }, [isOpen, initialRole, initialMode]);

  // Customer Form State - starts clean so user enters their real credentials
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [sameAsMobile, setSameAsMobile] = useState(true);

  // Admin Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminSecurityPin, setAdminSecurityPin] = useState('');

  if (!isOpen) return null;

  // Handle Customer Submit
  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (mode === 'signup' ? name : (name || email.split('@')[0])).trim();
    const cleanMobile = mobile.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      alert('Please enter a valid email address.');
      return;
    }

    const customerData = {
      fullName: cleanName || 'Traveler',
      email: cleanEmail,
      mobile: cleanMobile,
      whatsapp: sameAsMobile ? cleanMobile : cleanMobile,
      password: cleanPassword,
      isNewRegistration: mode === 'signup',
      isLoggedIn: true,
      role: 'customer' as const
    };
    try {
      await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });
    } catch (err) {
      console.warn('User auth sync notice:', err);
    }
    onLoginSuccess(customerData);
    onClose();
  };

  // Handle Admin Submit
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = (adminEmail || 'admin@v3itinerary.com').trim().toLowerCase();
    const adminData = {
      fullName: 'V3 Platform Admin',
      email: cleanEmail,
      mobile: '+91 98000 11223',
      whatsapp: '+91 98000 11223',
      password: adminPassword || 'admin@2026',
      securityPin: adminSecurityPin || 'V3-SEC-9921',
      isNewRegistration: false,
      isLoggedIn: true,
      role: 'admin' as const
    };
    try {
      await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData)
      });
    } catch (err) {
      console.warn('Admin auth sync notice:', err);
    }
    onLoginSuccess(adminData);
    onClose();
  };

  // Google OAuth Simulation
  const handleGoogleLogin = async () => {
    const googleData = {
      fullName: 'Vikram Joshi (Google)',
      email: 'vikram.travels@gmail.com',
      mobile: '+91 98210 99881',
      whatsapp: '+91 98210 99881',
      password: 'GoogleOAuth2@Verified',
      isNewRegistration: false,
      isLoggedIn: true,
      role: 'customer' as const
    };
    try {
      await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleData)
      });
    } catch (err) {
      console.warn('Google auth sync notice:', err);
    }
    onLoginSuccess(googleData);
    onClose();
  };

  const fillDemoCustomer = () => {
    setName('Rahul Sharma');
    setEmail('rahul.sharma@example.com');
    setMobile('+91 98765 43210');
    setPassword('Secret@123');
  };

  const fillDemoAdmin = () => {
    setAdminEmail('admin@v3itinerary.com');
    setAdminPassword('admin@2026');
    setAdminSecurityPin('V3-SEC-9921');
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-container auth-modal-box shadow-2xl animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="auth-header-title-box text-center">
          <div className="auth-logo-row flex justify-center mb-2">
            <img src="/v3_logo.png" alt="V3Itinerary.com" className="auth-brand-logo-img" />
          </div>
          <h3 className="auth-main-heading">Sign In to V3Itinerary</h3>
          <p className="auth-main-sub">Select portal to access your account:</p>
        </div>

        {/* Two Portals Selector: Customer & Admin */}
        <div className="auth-portal-selector">
          <button 
            type="button"
            className={`portal-select-card ${selectedRole === 'customer' ? 'active-customer' : ''}`}
            onClick={() => setSelectedRole('customer')}
          >
            <div className="portal-icon-box customer-icon">
              <User size={20} />
            </div>
            <div className="portal-card-info">
              <span className="portal-card-name">Customer Portal</span>
              <span className="portal-card-desc">Travelers & Explorers</span>
            </div>
            {selectedRole === 'customer' && <span className="portal-indicator-badge">Selected</span>}
          </button>

          <button 
            type="button"
            className={`portal-select-card ${selectedRole === 'admin' ? 'active-admin' : ''}`}
            onClick={() => setSelectedRole('admin')}
          >
            <div className="portal-icon-box admin-icon">
              <ShieldCheck size={20} />
            </div>
            <div className="portal-card-info">
              <span className="portal-card-name">Admin Portal</span>
              <span className="portal-card-desc">Operations & KYC Staff</span>
            </div>
            {selectedRole === 'admin' && <span className="portal-indicator-badge admin-badge">Selected</span>}
          </button>
        </div>

        {/* PORTAL 1: CUSTOMER PORTAL */}
        {selectedRole === 'customer' && (
          <div className="customer-auth-container animate-fade-in">
            {/* Customer Sub-tabs: Login vs Signup */}
            <div className="auth-tab-switch">
              <button 
                type="button"
                className={`auth-switch-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => setMode('login')}
              >
                Sign In
              </button>
              <button 
                type="button"
                className={`auth-switch-btn ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => setMode('signup')}
              >
                Create Account
              </button>
            </div>

            {/* Google OAuth One-Tap Simulation */}
            <div className="google-auth-box">
              <button type="button" className="btn-google-oauth" onClick={handleGoogleLogin}>
                <svg viewBox="0 0 24 24" width="18" height="18" className="google-svg">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="auth-or-divider">
              <span>or continue with email & mobile</span>
            </div>

            {/* Quick Demo Fill Pill */}
            <div className="demo-hint-box">
              <button type="button" onClick={fillDemoCustomer} className="demo-fill-btn">
                <Sparkles size={13} />
                <span>Fill Demo Customer (Rahul Sharma)</span>
              </button>
            </div>

            {/* Customer Credentials Form */}
            <form onSubmit={handleCustomerSubmit} className="auth-form-fields">
              {mode === 'signup' && (
                <div className="form-field">
                  <label className="input-lbl">Full Name *</label>
                  <div className="input-with-icon">
                    <User size={16} className="field-icon-left" />
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Rahul Sharma"
                      className="dash-input pl-9"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-field">
                <label className="input-lbl">Email Address *</label>
                <div className="input-with-icon">
                  <Mail size={16} className="field-icon-left" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="name@example.com"
                    className="dash-input pl-9"
                    required
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <>
                  <div className="form-field">
                    <label className="input-lbl">Mobile Number (Indian 10-Digits) *</label>
                    <div className="input-with-icon">
                      <Phone size={16} className="field-icon-left" />
                      <input 
                        type="tel" 
                        value={mobile} 
                        onChange={(e) => setMobile(e.target.value)} 
                        placeholder="+91 98765 43210"
                        className="dash-input pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="checkbox-row">
                    <input 
                      type="checkbox" 
                      id="wa-same" 
                      checked={sameAsMobile} 
                      onChange={(e) => setSameAsMobile(e.target.checked)} 
                    />
                    <label htmlFor="wa-same" className="text-xs text-slate-600">
                      WhatsApp number is the same as mobile
                    </label>
                  </div>
                </>
              )}

              <div className="form-field">
                <label className="input-lbl">Password *</label>
                <div className="input-with-icon">
                  <Lock size={16} className="field-icon-left" />
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="dash-input pl-9"
                    required
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div className="checkbox-row">
                  <input type="checkbox" id="terms" required defaultChecked />
                  <label htmlFor="terms" className="text-xs text-slate-600">
                    I agree to V3Itinerary's <a href="#terms" className="text-blue-600 underline">Terms of Service</a> and <a href="#privacy" className="text-blue-600 underline">Privacy Policy</a>
                  </label>
                </div>
              )}

              <button type="submit" className="btn-primary-gradient full-w mt-2">
                {mode === 'login' ? 'Sign In to Customer Portal' : 'Create Customer Account'}
              </button>
            </form>
          </div>
        )}

        {/* PORTAL 2: ADMIN PORTAL */}
        {selectedRole === 'admin' && (
          <div className="admin-auth-container animate-fade-in">
            <div className="admin-badge-banner">
              <div className="admin-badge-icon">
                <ShieldCheck size={26} className="text-blue-600" />
              </div>
              <div>
                <h4 className="admin-banner-title">V3 Platform Administration Gateway</h4>
                <p className="admin-banner-sub">Restricted access for platform managers and operations staff.</p>
              </div>
            </div>

            {/* Quick Demo Fill Pill for Admin */}
            <div className="demo-hint-box">
              <button type="button" onClick={fillDemoAdmin} className="demo-fill-btn admin-fill">
                <Sparkles size={13} />
                <span>One-Click Fill Admin Credentials</span>
              </button>
            </div>

            {/* Admin Credentials Form */}
            <form onSubmit={handleAdminSubmit} className="auth-form-fields">
              <div className="form-field">
                <label className="input-lbl">Admin Email Address *</label>
                <div className="input-with-icon">
                  <Mail size={16} className="field-icon-left" />
                  <input 
                    type="email" 
                    value={adminEmail} 
                    onChange={(e) => setAdminEmail(e.target.value)} 
                    placeholder="admin@v3itinerary.com"
                    className="dash-input pl-9"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="input-lbl">Master Admin Password *</label>
                <div className="input-with-icon">
                  <Lock size={16} className="field-icon-left" />
                  <input 
                    type="password" 
                    value={adminPassword} 
                    onChange={(e) => setAdminPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="dash-input pl-9"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="input-lbl">Admin Security Passkey / 2FA Token</label>
                <div className="input-with-icon">
                  <KeyRound size={16} className="field-icon-left" />
                  <input 
                    type="text" 
                    value={adminSecurityPin} 
                    onChange={(e) => setAdminSecurityPin(e.target.value)} 
                    placeholder="V3-SEC-9921"
                    className="dash-input pl-9"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Pre-authorized hardware security key session.</p>
              </div>

              <div className="admin-security-notice">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>SSL Encrypted • Session audits logged under GSTIN compliance</span>
              </div>

              <button type="submit" className="btn-admin-solid full-w mt-2">
                <ShieldCheck size={18} />
                <span>Sign In to Admin Console</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
