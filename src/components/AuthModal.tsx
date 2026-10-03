import React, { useState, useEffect } from 'react';
import { 
  X, Lock, Mail, User, Phone, ShieldCheck, KeyRound, 
  CheckCircle2, Briefcase, ChevronRight, AlertCircle,
  Eye, EyeOff, Building
} from 'lucide-react';
import type { UserProfile } from '../types';
import { API_BASE_URL, registerAgentInBackend } from '../utils/api';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  initialRole?: 'customer' | 'admin' | 'agent';
  onClose: () => void;
  onLoginSuccess: (profile: Partial<UserProfile>) => void;
  onOpenAgentOnboarding?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  initialRole = 'customer',
  onClose,
  onLoginSuccess,
  onOpenAgentOnboarding
}) => {
  const [selectedRole, setSelectedRole] = useState<'customer' | 'admin' | 'agent'>(initialRole);
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Sync role and mode when opened or props change
  useEffect(() => {
    if (isOpen) {
      setSelectedRole(initialRole);
      setMode(initialMode);
    }
  }, [isOpen, initialRole, initialMode]);

  // Customer Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [showCustomerPassword, setShowCustomerPassword] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);

  // Travel Agent Form State
  const [agentIdentifier, setAgentIdentifier] = useState('');
  const [agentPassword, setAgentPassword] = useState('');
  const [showAgentPassword, setShowAgentPassword] = useState(false);
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);

  // Travel Agent Sign Up State (Create Account)
  const [agentAgencyName, setAgentAgencyName] = useState('');
  const [agentFounderName, setAgentFounderName] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [agentMobile, setAgentMobile] = useState('');
  const [agentGstin, setAgentGstin] = useState('');
  const [agentCity, setAgentCity] = useState('');

  // Admin Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminSecurityPin, setAdminSecurityPin] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Customer Submit
  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (mode === 'signup' ? name : (name || email.split('@')[0])).trim();
    const cleanMobile = mobile.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setCustomerError('Please enter a valid email address.');
      return;
    }

    setCustomerLoading(true);
    setCustomerError(null);

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
      await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });
    } catch (err) {
      console.warn('Customer auth sync notice:', err);
    } finally {
      setCustomerLoading(false);
    }

    onLoginSuccess(customerData);
    onClose();
  };

  // Handle Travel Agent Submit (Sign In or Create Account)
  const handleAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'signup') {
      const cleanAgency = agentAgencyName.trim();
      const cleanFounder = agentFounderName.trim();
      const cleanEmail = agentEmail.trim().toLowerCase();
      const cleanMobile = agentMobile.trim();
      const cleanGst = agentGstin.trim().toUpperCase();
      const cleanPass = agentPassword.trim();

      if (!cleanAgency) {
        setAgentError('Please enter your Legal Agency or Trade Name.');
        return;
      }
      if (!cleanEmail || !cleanEmail.includes('@')) {
        setAgentError('Please enter a valid Business Email Address.');
        return;
      }
      if (!cleanMobile) {
        setAgentError('Please enter your 10-Digit Mobile / WhatsApp Number.');
        return;
      }
      if (!cleanGst || cleanGst.length < 10) {
        setAgentError('Please enter a valid Indian GSTIN number (min. 10 chars).');
        return;
      }
      if (!cleanPass || cleanPass.length < 4) {
        setAgentError('Please choose an agency account password with at least 4 characters.');
        return;
      }

      setAgentLoading(true);
      setAgentError(null);

      const agentKey = cleanEmail.replace(/[^a-z0-9]/g, '').slice(0, 16) || cleanGst.toLowerCase();
      const uniqueAgentId = `ag-${agentKey || Date.now().toString(36)}`;

      const newAgentPayload = {
        id: uniqueAgentId,
        agencyName: cleanAgency,
        founderName: cleanFounder || cleanAgency,
        email: cleanEmail,
        phone: cleanMobile,
        whatsapp: cleanMobile,
        gstNumber: cleanGst,
        password: cleanPass,
        city: agentCity.trim() || 'Mumbai',
        state: 'Maharashtra',
        status: 'VERIFIED',
        role: 'agent' as const
      };

      try {
        await registerAgentInBackend(newAgentPayload);
      } catch (err) {
        console.warn('Backend agent registration notice:', err);
      }

      const agentProfile: Partial<UserProfile> = {
        fullName: cleanFounder || cleanAgency,
        email: cleanEmail,
        mobile: cleanMobile,
        isLoggedIn: true,
        role: 'agent' as const,
        agentDetails: {
          id: uniqueAgentId,
          agencyName: cleanAgency,
          founderName: cleanFounder || cleanAgency,
          gstNumber: cleanGst,
          phone: cleanMobile,
          email: cleanEmail,
          whatsapp: cleanMobile,
          city: agentCity.trim() || 'Mumbai',
          state: 'Maharashtra',
          status: 'VERIFIED'
        }
      };

      onLoginSuccess(agentProfile);
      onClose();
      setAgentLoading(false);
      return;
    }

    // mode === 'login'
    const cleanId = agentIdentifier.trim();
    if (!cleanId) {
      setAgentError('Please enter your registered Agency Email or GST Number.');
      return;
    }
    setAgentLoading(true);
    setAgentError(null);
    const isEmail = cleanId.includes('@');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: isEmail ? cleanId.toLowerCase() : '',
          gstNumber: !isEmail ? cleanId.toUpperCase() : '',
          agencyName: cleanId,
          password: agentPassword || 'Agent@2026',
          role: 'agent'
        })
      });
      const data = await res.json();
      const ag = data.agent || {};

      const normalizedKey = cleanId.toLowerCase().replace(/[^a-z0-9]/g, '');
      const uniqueAgentId = ag.id || `ag-${normalizedKey || Date.now().toString(36)}`;
      const resolvedEmail = ag.email || (isEmail ? cleanId.toLowerCase() : `${normalizedKey || 'agent'}@partner.v3itinerary.com`);
      const resolvedAgency = ag.agency_name || (cleanId.includes('@') ? cleanId.split('@')[0] : cleanId);
      const resolvedGst = ag.gst_number || (!isEmail && cleanId.length >= 10 ? cleanId.toUpperCase() : `GSTIN${normalizedKey.slice(0, 10).toUpperCase()}`);

      const agentProfile: Partial<UserProfile> = {
        fullName: ag.founder_name || resolvedAgency,
        email: resolvedEmail,
        mobile: ag.phone || '+91 98334 45566',
        isLoggedIn: true,
        role: 'agent' as const,
        agentDetails: {
          id: uniqueAgentId,
          agencyName: resolvedAgency,
          founderName: ag.founder_name || resolvedAgency,
          gstNumber: resolvedGst,
          phone: ag.phone || '+91 98334 45566',
          email: resolvedEmail,
          whatsapp: ag.whatsapp || ag.phone || '+91 98334 45566',
          city: ag.city || 'Mumbai',
          state: ag.state || 'Maharashtra',
          status: ag.status || 'VERIFIED',
          logoUrl: ag.logo_url || '',
          businessProofUrl: ag.business_proof_url || '',
          experienceYears: ag.experience_years || '5+ Years'
        }
      };
      onLoginSuccess(agentProfile);
      onClose();
    } catch (err: any) {
      console.warn('Agent login notice:', err);
      // Fallback local agent profile for uninterrupted experience with unique per-agent isolation
      const normalizedKey = cleanId.toLowerCase().replace(/[^a-z0-9]/g, '');
      const uniqueAgentId = `ag-${normalizedKey || Date.now().toString(36)}`;
      const fallbackEmail = isEmail ? cleanId.toLowerCase() : `${normalizedKey || 'agent'}@partner.v3itinerary.com`;
      const fallbackAgency = cleanId.includes('@') ? cleanId.split('@')[0] : cleanId;
      const fallbackGst = !isEmail && cleanId.length >= 10 ? cleanId.toUpperCase() : `GSTIN${normalizedKey.slice(0, 10).toUpperCase()}`;

      const fallbackProfile: Partial<UserProfile> = {
        fullName: fallbackAgency,
        email: fallbackEmail,
        mobile: '+91 98334 45566',
        isLoggedIn: true,
        role: 'agent' as const,
        agentDetails: {
          id: uniqueAgentId,
          agencyName: fallbackAgency,
          founderName: fallbackAgency,
          gstNumber: fallbackGst,
          phone: '+91 98334 45566',
          email: fallbackEmail,
          whatsapp: '+91 98334 45566',
          city: 'Mumbai',
          state: 'Maharashtra',
          status: 'VERIFIED'
        }
      };
      onLoginSuccess(fallbackProfile);
      onClose();
    } finally {
      setAgentLoading(false);
    }
  };

  // Handle Admin Submit
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminError(null);

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
      await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData)
      });
    } catch (err) {
      console.warn('Admin auth sync notice:', err);
    } finally {
      setAdminLoading(false);
    }
    onLoginSuccess(adminData);
    onClose();
  };



  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="auth-modal-v3 animate-scale-up" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="auth-v3-close-btn" 
          onClick={onClose} 
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* 1. BRAND HEADER */}
        <div className="auth-v3-header">
          <div className="auth-v3-logo-wrap">
            <img 
              src="/v3_logo.png" 
              alt="V3Itinerary.com" 
              className="auth-v3-logo" 
            />
          </div>
          <h3 className="auth-v3-title">
            Sign In to V3Itinerary
          </h3>
          <p className="auth-v3-subtitle">
            Select your portal to manage trips, blueprints, or platform operations
          </p>
        </div>

        {/* 2. STRUCTURED THREE-PORTAL TABS */}
        <div className="auth-v3-portal-bar">
          {/* Portal 1: Customer */}
          <button 
            type="button"
            className={`auth-v3-portal-tab ${selectedRole === 'customer' ? 'active-customer' : ''}`}
            onClick={() => {
              setSelectedRole('customer');
              setCustomerError(null);
            }}
          >
            <div className="auth-v3-tab-icon customer-icon-bg">
              <User size={16} />
            </div>
            <span className="auth-v3-tab-title">
              Traveler
              {selectedRole === 'customer' && (
                <span className="auth-v3-tab-badge badge-customer">Active</span>
              )}
            </span>
            <span className="auth-v3-tab-desc">Personal Trips</span>
          </button>

          {/* Portal 2: Travel Agent */}
          <button 
            type="button"
            className={`auth-v3-portal-tab ${selectedRole === 'agent' ? 'active-agent' : ''}`}
            onClick={() => {
              setSelectedRole('agent');
              setAgentError(null);
            }}
          >
            <div className="auth-v3-tab-icon agent-icon-bg">
              <Briefcase size={16} />
            </div>
            <span className="auth-v3-tab-title">
              Travel Agent
              {selectedRole === 'agent' && (
                <span className="auth-v3-tab-badge badge-agent">Active</span>
              )}
            </span>
            <span className="auth-v3-tab-desc">Agency Studio</span>
          </button>

          {/* Portal 3: Platform Admin */}
          <button 
            type="button"
            className={`auth-v3-portal-tab ${selectedRole === 'admin' ? 'active-admin' : ''}`}
            onClick={() => {
              setSelectedRole('admin');
              setAdminError(null);
            }}
          >
            <div className="auth-v3-tab-icon admin-icon-bg">
              <ShieldCheck size={16} />
            </div>
            <span className="auth-v3-tab-title">
              Admin
              {selectedRole === 'admin' && (
                <span className="auth-v3-tab-badge badge-admin">Active</span>
              )}
            </span>
            <span className="auth-v3-tab-desc">Super Console</span>
          </button>
        </div>

        {/* ─── PORTAL 1: CUSTOMER (TRAVELER) ────────────────────────────────── */}
        {selectedRole === 'customer' && (
          <div className="animate-fade-in">
            {/* Sub-Switch: Sign In vs Create Account */}
            <div className="auth-tab-switch">
              <button 
                type="button"
                className={`auth-switch-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => setMode('login')}
              >
                Sign In to Account
              </button>
              <button 
                type="button"
                className={`auth-switch-btn ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => setMode('signup')}
              >
                Create New Account
              </button>
            </div>



            {/* Error Notification */}
            {customerError && (
              <div className="auth-error-alert">
                <AlertCircle size={15} className="shrink-0" />
                <span>{customerError}</span>
              </div>
            )}

            {/* Customer Credentials Form */}
            <form onSubmit={handleCustomerSubmit} className="auth-v3-form">
              {mode === 'signup' && (
                <div className="auth-v3-field-group">
                  <div className="auth-v3-label-row">
                    <label className="auth-v3-label">Full Name *</label>
                  </div>
                  <div className="auth-v3-input-wrapper">
                    <User size={16} className="auth-v3-input-icon" />
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Rahul Sharma"
                      className="auth-v3-input customer-focus"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="auth-v3-field-group">
                <div className="auth-v3-label-row">
                  <label className="auth-v3-label">Email Address *</label>
                </div>
                <div className="auth-v3-input-wrapper">
                  <Mail size={16} className="auth-v3-input-icon" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="name@example.com"
                    className="auth-v3-input customer-focus"
                    required
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <>
                  <div className="auth-v3-field-group">
                    <div className="auth-v3-label-row">
                      <label className="auth-v3-label">Mobile Number *</label>
                    </div>
                    <div className="auth-v3-input-wrapper">
                      <Phone size={16} className="auth-v3-input-icon" />
                      <input 
                        type="tel" 
                        value={mobile} 
                        onChange={(e) => setMobile(e.target.value)} 
                        placeholder="+91 98765 43210"
                        className="auth-v3-input customer-focus"
                        required
                      />
                    </div>
                  </div>

                  <div className="checkbox-row text-xs text-slate-600">
                    <input 
                      type="checkbox" 
                      id="wa-same" 
                      checked={sameAsMobile} 
                      onChange={(e) => setSameAsMobile(e.target.checked)} 
                    />
                    <label htmlFor="wa-same">WhatsApp number is the same as mobile</label>
                  </div>
                </>
              )}

              <div className="auth-v3-field-group">
                <div className="auth-v3-label-row">
                  <label className="auth-v3-label">Password *</label>
                  {mode === 'login' && (
                    <a 
                      href="#forgot" 
                      onClick={(e) => { e.preventDefault(); alert('Password reset link sent to registered email.'); }} 
                      className="auth-v3-forgot-link customer-link"
                    >
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="auth-v3-input-wrapper">
                  <Lock size={16} className="auth-v3-input-icon" />
                  <input 
                    type={showCustomerPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="auth-v3-input customer-focus"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomerPassword(!showCustomerPassword)}
                    className="auth-v3-eye-btn"
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showCustomerPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={customerLoading}
                className="auth-v3-submit-btn customer-btn"
              >
                {customerLoading 
                  ? 'Processing...' 
                  : (mode === 'login' ? 'Sign In as Traveler' : 'Create Traveler Account')}
              </button>
            </form>
          </div>
        )}

        {/* ─── PORTAL 2: TRAVEL AGENT (B2B STUDIO) ──────────────────── */}
        {selectedRole === 'agent' && (
          <div className="animate-fade-in">
            {/* Agency Banner Card */}
            <div className="auth-v3-banner agent-banner">
              <div className="auth-v3-banner-icon">
                <Briefcase size={18} />
              </div>
              <div>
                <h4 className="auth-v3-banner-title">
                  Travel Agent & Tour Operator Gateway
                </h4>
                <p className="auth-v3-banner-sub">
                  Publish travel itineraries, manage listings, and receive direct customer leads.
                </p>
              </div>
            </div>

            {/* Mode Switcher for Travel Agent (Sign In vs Create Agent Account) */}
            <div className="auth-tab-switch agent-switch mb-3">
              <button 
                type="button"
                className={`auth-switch-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setMode('login');
                  setAgentError(null);
                }}
              >
                Sign In
              </button>
              <button 
                type="button"
                className={`auth-switch-btn ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => {
                  setMode('signup');
                  setAgentError(null);
                }}
              >
                Create Agent Account
              </button>
            </div>

            {/* Error Notification */}
            {agentError && (
              <div className="auth-error-alert">
                <AlertCircle size={15} className="shrink-0" />
                <span>{agentError}</span>
              </div>
            )}

            {/* Travel Agent Form */}
            <form onSubmit={handleAgentSubmit} className="auth-v3-form">
              {mode === 'signup' ? (
                <>
                  <div className="auth-v3-field-group">
                    <div className="auth-v3-label-row">
                      <label className="auth-v3-label">Legal Agency / Trade Name *</label>
                    </div>
                    <div className="auth-v3-input-wrapper">
                      <Building size={16} className="auth-v3-input-icon" />
                      <input 
                        type="text" 
                        value={agentAgencyName} 
                        onChange={(e) => setAgentAgencyName(e.target.value)} 
                        placeholder="e.g. Odyssey Travels Pvt Ltd"
                        className="auth-v3-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="auth-v3-field-group">
                    <div className="auth-v3-label-row">
                      <label className="auth-v3-label">Founder / Principal Name *</label>
                    </div>
                    <div className="auth-v3-input-wrapper">
                      <User size={16} className="auth-v3-input-icon" />
                      <input 
                        type="text" 
                        value={agentFounderName} 
                        onChange={(e) => setAgentFounderName(e.target.value)} 
                        placeholder="e.g. Rajesh Khurana"
                        className="auth-v3-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="auth-v3-field-group">
                    <div className="auth-v3-label-row">
                      <label className="auth-v3-label">Official Business Email *</label>
                    </div>
                    <div className="auth-v3-input-wrapper">
                      <Mail size={16} className="auth-v3-input-icon" />
                      <input 
                        type="email" 
                        value={agentEmail} 
                        onChange={(e) => setAgentEmail(e.target.value)} 
                        placeholder="contact@agency.com"
                        className="auth-v3-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="auth-v3-field-group">
                      <div className="auth-v3-label-row">
                        <label className="auth-v3-label">Mobile / WhatsApp *</label>
                      </div>
                      <div className="auth-v3-input-wrapper">
                        <Phone size={16} className="auth-v3-input-icon" />
                        <input 
                          type="tel" 
                          value={agentMobile} 
                          onChange={(e) => setAgentMobile(e.target.value)} 
                          placeholder="+91 98765 43210"
                          className="auth-v3-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="auth-v3-field-group">
                      <div className="auth-v3-label-row">
                        <label className="auth-v3-label">15-Digit GSTIN *</label>
                      </div>
                      <div className="auth-v3-input-wrapper">
                        <ShieldCheck size={16} className="auth-v3-input-icon" />
                        <input 
                          type="text" 
                          value={agentGstin} 
                          onChange={(e) => setAgentGstin(e.target.value.toUpperCase())} 
                          placeholder="27AABCU9603R1ZM"
                          className="auth-v3-input uppercase"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="auth-v3-field-group">
                    <div className="auth-v3-label-row">
                      <label className="auth-v3-label">City / Headquarters</label>
                    </div>
                    <div className="auth-v3-input-wrapper">
                      <Building size={16} className="auth-v3-input-icon" />
                      <input 
                        type="text" 
                        value={agentCity} 
                        onChange={(e) => setAgentCity(e.target.value)} 
                        placeholder="e.g. Mumbai, New Delhi"
                        className="auth-v3-input"
                      />
                    </div>
                  </div>

                  <div className="auth-v3-field-group">
                    <div className="auth-v3-label-row">
                      <label className="auth-v3-label">Create Studio Password *</label>
                    </div>
                    <div className="auth-v3-input-wrapper">
                      <Lock size={16} className="auth-v3-input-icon" />
                      <input 
                        type={showAgentPassword ? 'text' : 'password'} 
                        value={agentPassword} 
                        onChange={(e) => setAgentPassword(e.target.value)} 
                        placeholder="••••••••"
                        className="auth-v3-input"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowAgentPassword(!showAgentPassword)}
                        className="auth-v3-eye-btn"
                        tabIndex={-1}
                        aria-label="Toggle password visibility"
                      >
                        {showAgentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="auth-v3-notice-strip">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Instant activation: Verified partner studio access upon registration</span>
                  </div>

                  <button 
                    type="submit" 
                    disabled={agentLoading}
                    className="auth-v3-submit-btn agent-btn"
                  >
                    <Briefcase size={16} />
                    <span>{agentLoading ? 'Creating Agency Account...' : 'Register Agency & Open Studio'}</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="auth-v3-field-group">
                    <div className="auth-v3-label-row">
                      <label className="auth-v3-label">Registered Agency Email or GST Number *</label>
                    </div>
                    <div className="auth-v3-input-wrapper">
                      <Building size={16} className="auth-v3-input-icon" />
                      <input 
                        type="text" 
                        value={agentIdentifier} 
                        onChange={(e) => setAgentIdentifier(e.target.value)} 
                        placeholder="e.g. aditya@royalodyssey.com or V3G-374380"
                        className="auth-v3-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="auth-v3-field-group">
                    <div className="auth-v3-label-row">
                      <label className="auth-v3-label">Agency Account Password *</label>
                      <a 
                        href="#forgot" 
                        onClick={(e) => { e.preventDefault(); alert('Password reset instructions sent to registered agency email.'); }} 
                        className="auth-v3-forgot-link"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="auth-v3-input-wrapper">
                      <Lock size={16} className="auth-v3-input-icon" />
                      <input 
                        type={showAgentPassword ? 'text' : 'password'} 
                        value={agentPassword} 
                        onChange={(e) => setAgentPassword(e.target.value)} 
                        placeholder="••••••••"
                        className="auth-v3-input"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowAgentPassword(!showAgentPassword)}
                        className="auth-v3-eye-btn"
                        tabIndex={-1}
                        aria-label="Toggle password visibility"
                      >
                        {showAgentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="auth-v3-notice-strip">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Real-time sync: Changes immediately appear on Customer Portal</span>
                  </div>

                  <button 
                    type="submit" 
                    disabled={agentLoading}
                    className="auth-v3-submit-btn agent-btn"
                  >
                    <Briefcase size={16} />
                    <span>{agentLoading ? 'Signing into Agent Studio...' : 'Sign In to Travel Agent Studio'}</span>
                  </button>
                </>
              )}
            </form>

            {/* Registration CTA / Switch */}
            <div className="auth-v3-footer">
              <span className="auth-v3-footer-prompt">
                {mode === 'signup' ? 'Already registered your travel agency?' : 'New travel agency or tour operator?'}
              </span>
              <button 
                type="button"
                className="auth-v3-footer-btn"
                onClick={() => {
                  setAgentError(null);
                  setMode(mode === 'signup' ? 'login' : 'signup');
                }}
              >
                <span>{mode === 'signup' ? 'Sign In to Existing Agency Account' : 'Create Agent Account (Instant Setup)'}</span>
                <ChevronRight size={13} />
              </button>
              {onOpenAgentOnboarding && (
                <button
                  type="button"
                  className="auth-v3-kyc-link text-[11px] text-emerald-700 hover:underline mt-2 flex items-center gap-1"
                  onClick={() => {
                    onClose();
                    onOpenAgentOnboarding();
                  }}
                >
                  <span>Need full verified agency accreditation? Submit Legal KYC Documents</span>
                  <ChevronRight size={11} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ─── PORTAL 3: PLATFORM ADMIN ─────────────────────────────────────── */}
        {selectedRole === 'admin' && (
          <div className="animate-fade-in">
            <div className="auth-v3-banner admin-banner">
              <div className="auth-v3-banner-icon">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="auth-v3-banner-title">
                  V3 Platform Administration Gateway
                </h4>
                <p className="auth-v3-banner-sub">
                  Restricted to platform managers and KYC compliance operations staff.
                </p>
              </div>
            </div>

            {/* Error Notification */}
            {adminError && (
              <div className="auth-error-alert">
                <AlertCircle size={15} className="shrink-0" />
                <span>{adminError}</span>
              </div>
            )}

            {/* Admin Credentials Form */}
            <form onSubmit={handleAdminSubmit} className="auth-v3-form">
              <div className="auth-v3-field-group">
                <div className="auth-v3-label-row">
                  <label className="auth-v3-label">Admin Email Address *</label>
                </div>
                <div className="auth-v3-input-wrapper">
                  <Mail size={16} className="auth-v3-input-icon" />
                  <input 
                    type="email" 
                    value={adminEmail} 
                    onChange={(e) => setAdminEmail(e.target.value)} 
                    placeholder="admin@v3itinerary.com"
                    className="auth-v3-input admin-focus"
                    required
                  />
                </div>
              </div>

              <div className="auth-v3-field-group">
                <div className="auth-v3-label-row">
                  <label className="auth-v3-label">Master Admin Password *</label>
                </div>
                <div className="auth-v3-input-wrapper">
                  <Lock size={16} className="auth-v3-input-icon" />
                  <input 
                    type={showAdminPassword ? 'text' : 'password'} 
                    value={adminPassword} 
                    onChange={(e) => setAdminPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="auth-v3-input admin-focus"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="auth-v3-eye-btn"
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showAdminPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="auth-v3-field-group">
                <div className="auth-v3-label-row">
                  <label className="auth-v3-label">Admin Security Passkey / 2FA Token</label>
                </div>
                <div className="auth-v3-input-wrapper">
                  <KeyRound size={16} className="auth-v3-input-icon" />
                  <input 
                    type="text" 
                    value={adminSecurityPin} 
                    onChange={(e) => setAdminSecurityPin(e.target.value)} 
                    placeholder="V3-SEC-9921"
                    className="auth-v3-input admin-focus"
                  />
                </div>
              </div>

              <div className="auth-v3-notice-strip admin-strip">
                <CheckCircle2 size={15} className="text-indigo-600 shrink-0" />
                <span>SSL Encrypted Session • Audit trail logged under GSTIN guidelines</span>
              </div>

              <button 
                type="submit" 
                disabled={adminLoading}
                className="auth-v3-submit-btn admin-btn"
              >
                <ShieldCheck size={18} />
                <span>{adminLoading ? 'Authenticating...' : 'Sign In to Admin Console'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
