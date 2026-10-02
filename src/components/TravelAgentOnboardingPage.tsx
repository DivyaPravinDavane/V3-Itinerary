import React, { useState, useRef } from 'react';
import {
  X,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  ShieldCheck,
  Building,
  Globe,
  Plane,
  Users,
  Heart,
  Briefcase,
  Crown,
  Compass,
  CircleDot,
  CloudUpload,
  UserCheck,
  TrendingUp,
  Check,
  Headphones,
  Phone,
  Mail,
  Clock,
  Star,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { registerAgentInBackend, uploadDocumentToBackend } from '../utils/api';

interface TravelAgentOnboardingPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const INDIAN_CITIES = [
  'Mumbai', 'Delhi NCR', 'Bengaluru', 'Ahmedabad', 'Pune',
  'Jaipur', 'Hyderabad', 'Chennai', 'Kolkata', 'Surat',
  'Kochi', 'Chandigarh', 'Indore', 'Lucknow', 'Goa',
  'Nagpur', 'Vadodara', 'Coimbatore', 'Bhopal', 'Visakhapatnam', 'Other'
];

const INDIAN_STATES = [
  'Maharashtra', 'Delhi', 'Gujarat', 'Karnataka', 'Rajasthan',
  'Tamil Nadu', 'Kerala', 'Uttar Pradesh', 'Punjab', 'Goa',
  'West Bengal', 'Telangana', 'Madhya Pradesh', 'Haryana',
  'Andhra Pradesh', 'Uttarakhand', 'Himachal Pradesh', 'Jammu & Kashmir', 'Other'
];

export const TravelAgentOnboardingPage: React.FC<TravelAgentOnboardingPageProps> = ({
  isOpen,
  onClose
}) => {
  // Step 1: Basic Details
  const [agencyName, setAgencyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [mobileCode, setMobileCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [whatsappCode, setWhatsappCode] = useState('+91');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  // Step 2: Business Details
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [businessType, setBusinessType] = useState<'Domestic' | 'International' | 'Both'>('Both');
  const [specialisations, setSpecialisations] = useState<string[]>(['Family', 'Honeymoon']);

  // Step 3: V3Itinerary Profile
  const [aboutAgency, setAboutAgency] = useState('');
  const [destinationsSold, setDestinationsSold] = useState('');
  const [plannedUploads, setPlannedUploads] = useState<string>('25 - 50');

  // Step 4: Documents
  const [businessProofFile, setBusinessProofFile] = useState<File | null>(null);
  const [businessProofUrl, setBusinessProofUrl] = useState<string>('');
  const [businessProofUploading, setBusinessProofUploading] = useState(false);
  const [businessProofError, setBusinessProofError] = useState('');

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState('');

  const [socialLink, setSocialLink] = useState('');

  // Step 5: Confirmation
  const [confirmCorrect, setConfirmCorrect] = useState(false);
  const [confirmTerms, setConfirmTerms] = useState(false);

  // Status & Submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const proofInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Toggle Specialisation
  const toggleSpecialisation = (spec: string) => {
    setSpecialisations(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  // Handle Business Proof Upload (PDF, JPG, PNG max 5MB)
  const handleBusinessProofChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setBusinessProofError('File size exceeds 5MB limit. Please upload a smaller file.');
      return;
    }

    setBusinessProofError('');
    setBusinessProofFile(file);
    setBusinessProofUploading(true);

    try {
      const uploadRes = await uploadDocumentToBackend(file);
      if (uploadRes?.url) {
        setBusinessProofUrl(uploadRes.url);
      }
    } catch (err) {
      console.warn('Upload document notice:', err);
    } finally {
      setBusinessProofUploading(false);
    }
  };

  const handleRemoveProof = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBusinessProofFile(null);
    setBusinessProofUrl('');
    if (proofInputRef.current) proofInputRef.current.value = '';
  };

  // Handle Agency Logo Upload (JPG, PNG max 2MB)
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setLogoError('Logo image exceeds 2MB limit. Please upload a smaller image.');
      return;
    }

    setLogoError('');
    setLogoFile(file);
    setLogoUploading(true);

    // Generate local preview immediately
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const uploadRes = await uploadDocumentToBackend(file);
      if (uploadRes?.url) {
        setLogoPreview(uploadRes.url);
      }
    } catch (err) {
      console.warn('Upload logo notice:', err);
    } finally {
      setLogoUploading(false);
    }
  };

  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLogoFile(null);
    setLogoPreview('');
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirmCorrect || !confirmTerms) {
      setSubmitError('Please check both confirmation boxes before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        agencyName,
        contactPerson,
        founderName: contactPerson,
        email,
        gstNumber: gstNumber ? gstNumber.trim().toUpperCase() : undefined,
        gstin: gstNumber ? gstNumber.trim().toUpperCase() : undefined,
        phone: `${mobileCode} ${mobile}`,
        mobile: `${mobileCode} ${mobile}`,
        whatsapp: whatsapp ? `${whatsappCode} ${whatsapp}` : `${mobileCode} ${mobile}`,
        city,
        state,
        experienceYears,
        businessType,
        specialisations,
        aboutAgency,
        destinationsSold,
        plannedUploads,
        businessProofDoc: businessProofFile ? {
          name: businessProofFile.name,
          size: businessProofFile.size,
          url: businessProofUrl
        } : undefined,
        logoDoc: logoFile ? {
          name: logoFile.name,
          url: logoPreview
        } : undefined,
        socialLink
      };

      await registerAgentInBackend(payload);

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setIsSubmitting(false);
      setSubmitError(err?.message || 'Onboarding submission failed. Please check details and try again.');
    }
  };

  return (
    <div className="agent-onboarding-overlay animate-fade-in">
      <div className="agent-onboarding-container">
        {/* Top Header Bar / Navigation Integration */}
        <div className="agent-onboarding-topbar">
          <div className="flex items-center gap-3">
            <div className="agent-brand-pill">
              <span className="text-orange-500 font-extrabold text-lg">V3</span>
              <span className="text-primary-navy font-bold text-sm">itinerary</span>
              <span className="agent-tag-badge">Partner Portal</span>
            </div>
          </div>
          <button 
            className="agent-close-btn"
            onClick={onClose}
            aria-label="Close and return to marketplace"
            title="Return to marketplace"
          >
            <X size={20} />
            <span className="hidden-mobile">Close</span>
          </button>
        </div>

        {/* Hero Section Banner */}
        <div className="agent-hero-banner">
          <div className="agent-hero-content">
            <div className="agent-hero-badge">Verified Partner Network</div>
            <h1 className="agent-hero-title">Travel Agent Onboarding</h1>
            <p className="agent-hero-subtitle">Join India's Trusted Itinerary Marketplace</p>
            <p className="agent-hero-desc">
              Upload unlimited itineraries and connect with genuine travellers across India.
            </p>
          </div>

          <div className="agent-hero-visual">
            {/* World landmarks decorative graphic & Agent visual */}
            <div className="agent-hero-landmarks">
              <div className="landmark-cloud cloud-1"></div>
              <div className="landmark-cloud cloud-2"></div>
              <div className="landmark-plane">✈</div>
            </div>
            <div className="agent-hero-agent-img-wrap">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" 
                alt="Travel Agent Partner" 
                className="agent-hero-agent-img"
              />
              <div className="agent-verified-floating-badge">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>Verified Agent</span>
              </div>
            </div>
          </div>
        </div>

        {isSuccess ? (
          /* SUCCESS STATE VIEW */
          <div className="agent-success-container animate-scale-up">
            <div className="agent-success-card">
              <div className="agent-success-icon-wrap">
                <CheckCircle2 size={56} className="text-emerald-500" />
              </div>
              <h2 className="agent-success-title">Onboarding Submitted Successfully!</h2>
              <p className="agent-success-sub">
                Welcome aboard, <strong>{agencyName || 'Partner'}</strong>! Your verified travel agency profile has been created in the V3itinerary database.
              </p>

              <div className="agent-success-details-box">
                <div className="success-row">
                  <span className="success-lbl">Contact Person:</span>
                  <span className="success-val">{contactPerson || 'Agency Admin'}</span>
                </div>
                <div className="success-row">
                  <span className="success-lbl">Business Contact:</span>
                  <span className="success-val">{email} • {mobileCode} {mobile}</span>
                </div>
                <div className="success-row">
                  <span className="success-lbl">Operating Hub:</span>
                  <span className="success-val">{city}, {state}</span>
                </div>
                <div className="success-row">
                  <span className="success-lbl">Planned Blueprints:</span>
                  <span className="success-val">{plannedUploads} Itineraries</span>
                </div>
                {businessProofFile && (
                  <div className="success-row">
                    <span className="success-lbl">Business Document:</span>
                    <span className="success-val text-emerald-600 font-semibold flex items-center gap-1">
                      <FileText size={14} /> {businessProofFile.name} (Uploaded)
                    </span>
                  </div>
                )}
              </div>

              <div className="agent-success-next-steps">
                <h4>What Happens Next?</h4>
                <ol>
                  <li>Our agent verification team will verify your submitted business credentials within 2-4 business hours.</li>
                  <li>You will receive your agent portal access credentials and itinerary builder dashboard link at <strong>{email}</strong>.</li>
                  <li>You can begin uploading your customized day-by-day itineraries and pricing packages immediately.</li>
                </ol>
              </div>

              <div className="agent-success-actions">
                <button className="btn-primary-gradient" onClick={onClose}>
                  Return to Marketplace
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* MAIN TWO-COLUMN CONTENT */
          <div className="agent-onboarding-body-grid">
            {/* LEFT COLUMN: THE 5-STEP FORM */}
            <div className="agent-form-column">
              <form onSubmit={handleSubmit} className="agent-onboarding-form">
                
                {submitError && (
                  <div className="agent-form-alert error">
                    <AlertCircle size={18} />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* ─── STEP 1: BASIC DETAILS ──────────────────────────────── */}
                <div className="form-section-card">
                  <div className="form-section-header">
                    <div className="step-num-badge">1</div>
                    <h3 className="form-section-title">Basic Details</h3>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-lbl">Travel Agency / Business Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Enter agency / business name"
                        value={agencyName}
                        onChange={e => setAgencyName(e.target.value)}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-lbl">Contact Person Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Enter full name"
                        value={contactPerson}
                        onChange={e => setContactPerson(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2 mt-3">
                    <div className="form-group">
                      <label className="form-lbl">Mobile Number *</label>
                      <div className="input-group-phone">
                        <select 
                          value={mobileCode} 
                          onChange={e => setMobileCode(e.target.value)}
                          className="phone-code-select"
                        >
                          <option value="+91">+91</option>
                          <option value="+971">+971</option>
                          <option value="+65">+65</option>
                          <option value="+44">+44</option>
                          <option value="+1">+1</option>
                        </select>
                        <input 
                          type="tel" 
                          required 
                          placeholder="Enter mobile number"
                          value={mobile}
                          onChange={e => setMobile(e.target.value)}
                          className="form-control phone-input"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-lbl">WhatsApp Number</label>
                      <div className="input-group-phone">
                        <select 
                          value={whatsappCode} 
                          onChange={e => setWhatsappCode(e.target.value)}
                          className="phone-code-select"
                        >
                          <option value="+91">+91</option>
                          <option value="+971">+971</option>
                          <option value="+65">+65</option>
                          <option value="+44">+44</option>
                          <option value="+1">+1</option>
                        </select>
                        <input 
                          type="tel" 
                          placeholder="Enter WhatsApp number"
                          value={whatsapp}
                          onChange={e => setWhatsapp(e.target.value)}
                          className="form-control phone-input"
                          maxLength={10}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group mt-3">
                    <label className="form-lbl">Email Address *</label>
                    <div className="input-with-icon">
                      <Mail size={16} className="input-icon-left text-slate-400" />
                      <input 
                        type="email" 
                        required 
                        placeholder="Enter email address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="form-control has-icon"
                      />
                    </div>
                  </div>

                  <div className="form-group mt-3">
                    <label className="form-lbl">GSTIN / GST Number (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 27AAAAA0000A1Z5 (If applicable)"
                      value={gstNumber}
                      onChange={e => setGstNumber(e.target.value.toUpperCase())}
                      className="form-control"
                      maxLength={15}
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">If pending or not applicable, a verified V3 ID will be auto-assigned.</span>
                  </div>
                </div>

                {/* ─── STEP 2: BUSINESS DETAILS ───────────────────────────── */}
                <div className="form-section-card">
                  <div className="form-section-header">
                    <div className="step-num-badge">2</div>
                    <h3 className="form-section-title">Business Details</h3>
                  </div>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label className="form-lbl">City *</label>
                      <select 
                        required 
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="form-control select-control"
                      >
                        <option value="">Select city</option>
                        {INDIAN_CITIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-lbl">State *</label>
                      <select 
                        required 
                        value={state}
                        onChange={e => setState(e.target.value)}
                        className="form-control select-control"
                      >
                        <option value="">Select state</option>
                        {INDIAN_STATES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-lbl">Years in Travel Business</label>
                      <select 
                        value={experienceYears}
                        onChange={e => setExperienceYears(e.target.value)}
                        className="form-control select-control"
                      >
                        <option value="">Select experience</option>
                        <option value="< 1 Year">&lt; 1 Year</option>
                        <option value="1 - 3 Years">1 - 3 Years</option>
                        <option value="3 - 5 Years">3 - 5 Years</option>
                        <option value="5 - 10 Years">5 - 10 Years</option>
                        <option value="10+ Years">10+ Years</option>
                      </select>
                    </div>
                  </div>

                  {/* Type of Travel Business Pills */}
                  <div className="form-group mt-4">
                    <label className="form-lbl">Type of Travel Business *</label>
                    <div className="type-pills-row">
                      <button 
                        type="button"
                        className={`type-pill-btn ${businessType === 'Domestic' ? 'active' : ''}`}
                        onClick={() => setBusinessType('Domestic')}
                      >
                        <Building size={16} />
                        <span>Domestic</span>
                      </button>
                      <button 
                        type="button"
                        className={`type-pill-btn ${businessType === 'International' ? 'active' : ''}`}
                        onClick={() => setBusinessType('International')}
                      >
                        <Globe size={16} />
                        <span>International</span>
                      </button>
                      <button 
                        type="button"
                        className={`type-pill-btn ${businessType === 'Both' ? 'active' : ''}`}
                        onClick={() => setBusinessType('Both')}
                      >
                        <Plane size={16} />
                        <span>Both</span>
                      </button>
                    </div>
                  </div>

                  {/* Specialisation Multi-Select */}
                  <div className="form-group mt-4">
                    <label className="form-lbl">Specialisation (You can select multiple)</label>
                    <div className="specialisation-tags-wrap">
                      {[
                        { name: 'Family', icon: <Users size={14} /> },
                        { name: 'Honeymoon', icon: <Heart size={14} /> },
                        { name: 'Group Tours', icon: <Users size={14} /> },
                        { name: 'Corporate', icon: <Briefcase size={14} /> },
                        { name: 'Luxury', icon: <Crown size={14} /> },
                        { name: 'Adventure', icon: <Compass size={14} /> },
                        { name: 'Other', icon: <CircleDot size={14} /> },
                      ].map(item => {
                        const isSelected = specialisations.includes(item.name);
                        return (
                          <button 
                            key={item.name}
                            type="button"
                            className={`spec-pill-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleSpecialisation(item.name)}
                          >
                            {item.icon}
                            <span>{item.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ─── STEP 3: V3ITINERARY PROFILE ────────────────────────── */}
                <div className="form-section-card">
                  <div className="form-section-header">
                    <div className="step-num-badge">3</div>
                    <h3 className="form-section-title">V3Itinerary Profile</h3>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-lbl flex-between">
                        <span>About Your Agency *</span>
                        <span className="char-count">{aboutAgency.length}/300</span>
                      </label>
                      <textarea 
                        required 
                        rows={3}
                        maxLength={300}
                        placeholder="Tell us something about your agency"
                        value={aboutAgency}
                        onChange={e => setAboutAgency(e.target.value)}
                        className="form-control textarea-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-lbl flex-between">
                        <span>Destinations You Currently Sell *</span>
                        <span className="char-count">{destinationsSold.length}/300</span>
                      </label>
                      <textarea 
                        required 
                        rows={3}
                        maxLength={300}
                        placeholder="e.g. Dubai, Thailand, Europe, Kerala, Andaman etc."
                        value={destinationsSold}
                        onChange={e => setDestinationsSold(e.target.value)}
                        className="form-control textarea-control"
                      />
                    </div>
                  </div>

                  {/* Number of Itineraries Plan to Upload */}
                  <div className="form-group mt-4">
                    <label className="form-lbl">Number of Itineraries You Plan to Upload *</label>
                    <div className="radio-pills-row">
                      {['10 - 25', '25 - 50', '50 - 100', '100+'].map(val => (
                        <label 
                          key={val} 
                          className={`radio-pill-label ${plannedUploads === val ? 'active' : ''}`}
                        >
                          <input 
                            type="radio" 
                            name="plannedUploads" 
                            value={val}
                            checked={plannedUploads === val}
                            onChange={() => setPlannedUploads(val)}
                            className="radio-hidden"
                          />
                          <span className="custom-radio-dot"></span>
                          <span className="radio-text">{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ─── STEP 4: DOCUMENTS & MEDIA UPLOAD ───────────────────── */}
                <div className="form-section-card">
                  <div className="form-section-header">
                    <div className="step-num-badge">4</div>
                    <h3 className="form-section-title">Documents</h3>
                  </div>

                  <div className="form-grid-2">
                    {/* Upload Business Proof (PDF/JPG/PNG) */}
                    <div className="form-group">
                      <label className="form-lbl">Upload Business Proof *</label>
                      <input 
                        ref={proofInputRef}
                        type="file" 
                        accept=".pdf,image/png,image/jpeg,image/webp"
                        onChange={handleBusinessProofChange}
                        className="hidden-file-input"
                        id="business-proof-file"
                      />
                      
                      {businessProofFile ? (
                        <div className="doc-uploaded-box animate-fade-in">
                          <div className="doc-uploaded-left">
                            <div className="doc-type-icon">
                              {businessProofFile.type.includes('pdf') ? (
                                <FileText size={22} className="text-red-500" />
                              ) : (
                                <ImageIcon size={22} className="text-blue-500" />
                              )}
                            </div>
                            <div className="doc-info-text">
                              <span className="doc-name-text" title={businessProofFile.name}>
                                {businessProofFile.name}
                              </span>
                              <span className="doc-size-text">
                                {formatFileSize(businessProofFile.size)} • <span className="text-emerald-600 font-semibold">✓ Attached</span>
                              </span>
                            </div>
                          </div>
                          <div className="doc-actions-right">
                            <button 
                              type="button" 
                              className="btn-doc-remove"
                              onClick={handleRemoveProof}
                              title="Remove document"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label 
                          htmlFor="business-proof-file" 
                          className={`doc-upload-dropzone ${businessProofUploading ? 'uploading' : ''}`}
                        >
                          <div className="dropzone-icon-circle">
                            {businessProofUploading ? (
                              <Loader2 size={24} className="animate-spin text-blue-600" />
                            ) : (
                              <CloudUpload size={24} className="text-blue-600" />
                            )}
                          </div>
                          <span className="dropzone-main-text">
                            {businessProofUploading ? 'Uploading Document...' : 'Upload Document'}
                          </span>
                          <span className="dropzone-sub-text">PDF, JPG or PNG (Max. 5MB)</span>
                        </label>
                      )}
                      {businessProofError && (
                        <span className="field-error-text">{businessProofError}</span>
                      )}
                    </div>

                    {/* Upload Agency Logo */}
                    <div className="form-group">
                      <label className="form-lbl">Upload Agency Logo *</label>
                      <input 
                        ref={logoInputRef}
                        type="file" 
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleLogoChange}
                        className="hidden-file-input"
                        id="agency-logo-file"
                      />

                      {logoPreview ? (
                        <div className="doc-uploaded-box animate-fade-in">
                          <div className="doc-uploaded-left">
                            <img src={logoPreview} alt="Agency Logo" className="logo-preview-thumb" />
                            <div className="doc-info-text">
                              <span className="doc-name-text">
                                {logoFile?.name || 'Agency Logo'}
                              </span>
                              <span className="doc-size-text">
                                {logoFile ? formatFileSize(logoFile.size) : 'Ready'} • <span className="text-emerald-600 font-semibold">✓ Ready</span>
                              </span>
                            </div>
                          </div>
                          <div className="doc-actions-right">
                            <button 
                              type="button" 
                              className="btn-doc-remove"
                              onClick={handleRemoveLogo}
                              title="Remove logo"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label 
                          htmlFor="agency-logo-file" 
                          className={`doc-upload-dropzone ${logoUploading ? 'uploading' : ''}`}
                        >
                          <div className="dropzone-icon-circle">
                            {logoUploading ? (
                              <Loader2 size={24} className="animate-spin text-blue-600" />
                            ) : (
                              <CloudUpload size={24} className="text-blue-600" />
                            )}
                          </div>
                          <span className="dropzone-main-text">
                            {logoUploading ? 'Uploading Logo...' : 'Upload Logo'}
                          </span>
                          <span className="dropzone-sub-text">JPG or PNG (Max. 2MB)</span>
                        </label>
                      )}
                      {logoError && (
                        <span className="field-error-text">{logoError}</span>
                      )}
                    </div>
                  </div>

                  {/* Website / Instagram / Facebook */}
                  <div className="form-group mt-3">
                    <label className="form-lbl">Website / Instagram / Facebook</label>
                    <div className="input-with-icon">
                      <Globe size={16} className="input-icon-left text-slate-400" />
                      <input 
                        type="url" 
                        placeholder="Enter website or social media link (optional)"
                        value={socialLink}
                        onChange={e => setSocialLink(e.target.value)}
                        className="form-control has-icon"
                      />
                    </div>
                  </div>
                </div>

                {/* ─── STEP 5: CONFIRMATION ───────────────────────────────── */}
                <div className="form-section-card">
                  <div className="form-section-header">
                    <div className="step-num-badge">5</div>
                    <h3 className="form-section-title">Confirmation</h3>
                  </div>

                  <div className="confirmation-checkboxes-col">
                    <label className="confirm-checkbox-label">
                      <input 
                        type="checkbox" 
                        required
                        checked={confirmCorrect}
                        onChange={e => setConfirmCorrect(e.target.checked)}
                        className="confirm-checkbox"
                      />
                      <span>I confirm that the information provided is correct.</span>
                    </label>

                    <label className="confirm-checkbox-label">
                      <input 
                        type="checkbox" 
                        required
                        checked={confirmTerms}
                        onChange={e => setConfirmTerms(e.target.checked)}
                        className="confirm-checkbox"
                      />
                      <span>
                        I agree to V3itinerary's <strong>Terms & Conditions</strong> and understand that itinerary content uploaded by me must be accurate and genuine.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="form-submit-row">
                    <button 
                      type="submit" 
                      className="btn-agent-submit-green"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin mr-2" />
                          <span>Processing Registration & Documents...</span>
                        </>
                      ) : (
                        <>
                          <span>SUBMIT & START ONBOARDING</span>
                          <ArrowRight size={18} className="submit-arrow" />
                        </>
                      )}
                    </button>
                    <div className="secure-footer-note">
                      <Lock size={13} className="text-slate-400" />
                      <span>Your information is safe and secure with us.</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* RIGHT COLUMN: SIDEBAR BENEFIT & HELP CARDS */}
            <div className="agent-sidebar-column">
              {/* CARD 1: Why Join V3itinerary? */}
              <div className="agent-side-card shadow-sm">
                <h3 className="side-card-heading">Why Join V3itinerary?</h3>
                
                <div className="side-benefits-list">
                  <div className="benefit-item">
                    <div className="benefit-icon-box bg-blue-50 text-blue-600">
                      <CloudUpload size={20} />
                    </div>
                    <div className="benefit-text-wrap">
                      <h4 className="benefit-title">Upload Unlimited Itineraries</h4>
                      <p className="benefit-desc">Add as many itineraries as you want.</p>
                    </div>
                  </div>

                  <div className="benefit-item">
                    <div className="benefit-icon-box bg-orange-50 text-orange-600">
                      <Users size={20} />
                    </div>
                    <div className="benefit-text-wrap">
                      <h4 className="benefit-title">Reach Genuine Buyers</h4>
                      <p className="benefit-desc">Connect with verified & serious travellers.</p>
                    </div>
                  </div>

                  <div className="benefit-item">
                    <div className="benefit-icon-box bg-emerald-50 text-emerald-600">
                      <UserCheck size={20} />
                    </div>
                    <div className="benefit-text-wrap">
                      <h4 className="benefit-title">Get Verified Buyer Details</h4>
                      <p className="benefit-desc">Receive full details of interested buyers.</p>
                    </div>
                  </div>

                  <div className="benefit-item">
                    <div className="benefit-icon-box bg-amber-50 text-amber-600">
                      <TrendingUp size={20} />
                    </div>
                    <div className="benefit-text-wrap">
                      <h4 className="benefit-title">Grow Your Business</h4>
                      <p className="benefit-desc">Increase visibility and get more bookings.</p>
                    </div>
                  </div>

                  <div className="benefit-item">
                    <div className="benefit-icon-box bg-green-50 text-green-600">
                      <Check size={20} />
                    </div>
                    <div className="benefit-text-wrap">
                      <h4 className="benefit-title">Simple & Easy Process</h4>
                      <p className="benefit-desc">Upload, connect and grow - all in one place.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: Need Help? */}
              <div className="agent-side-card need-help-card shadow-sm">
                <div className="need-help-header">
                  <div className="help-icon-circle">
                    <Headphones size={22} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="side-card-heading mb-0">Need Help?</h3>
                    <p className="help-sub-text">Our support team is here to help you</p>
                  </div>
                </div>

                <div className="help-contacts-list">
                  <a href="tel:9820369694" className="help-contact-item">
                    <Phone size={15} className="text-blue-600" />
                    <span className="contact-bold">9820369694</span>
                  </a>

                  <a href="mailto:support@v3itinerary.com" className="help-contact-item">
                    <Mail size={15} className="text-blue-600" />
                    <span>support@v3itinerary.com</span>
                  </a>

                  <div className="help-contact-item muted">
                    <Clock size={15} className="text-slate-400" />
                    <span>Mon - Sat: 10:00 AM to 7:00 PM</span>
                  </div>
                </div>
              </div>

              {/* CARD 3: Trusted by Travel Agents */}
              <div className="agent-side-card testimonial-card shadow-sm">
                <h3 className="side-card-heading">Trusted by Travel Agents</h3>
                
                <div className="stars-rating-row">
                  <div className="stars-flex">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="rating-score-text">4.8/5 (120+ Reviews)</span>
                </div>

                <p className="testimonial-quote">
                  "V3itinerary has helped us reach thousands of genuine travellers and grow our business."
                </p>

                <div className="testimonial-author-row">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" 
                    alt="Travel Partner" 
                    className="test-avatar" 
                  />
                  <span className="test-author-name">– Travel Partner</span>
                </div>

                <div className="testimonial-dots">
                  <span className="dot active"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM TRUST BAR (4 PILLARS) */}
        <div className="agent-bottom-trust-bar">
          <div className="trust-pillar-item">
            <div className="pillar-icon-circle">
              <ShieldCheck size={22} className="text-blue-600" />
            </div>
            <div className="pillar-text">
              <h5 className="pillar-title">Secure & Trusted</h5>
              <p className="pillar-desc">Your data is 100% safe</p>
            </div>
          </div>

          <div className="trust-pillar-item">
            <div className="pillar-icon-circle">
              <UserCheck size={22} className="text-blue-600" />
            </div>
            <div className="pillar-text">
              <h5 className="pillar-title">Verified Travel Agents</h5>
              <p className="pillar-desc">Trusted & professional</p>
            </div>
          </div>

          <div className="trust-pillar-item">
            <div className="pillar-icon-circle">
              <Globe size={22} className="text-blue-600" />
            </div>
            <div className="pillar-text">
              <h5 className="pillar-title">Across India</h5>
              <p className="pillar-desc">Leads from everywhere</p>
            </div>
          </div>

          <div className="trust-pillar-item">
            <div className="pillar-icon-circle">
              <Headphones size={22} className="text-blue-600" />
            </div>
            <div className="pillar-text">
              <h5 className="pillar-title">24x7 Support</h5>
              <p className="pillar-desc">We're here to help</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
