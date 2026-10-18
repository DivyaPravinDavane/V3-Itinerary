import React from 'react';
import { 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  Scale, 
  Calendar, 
  Info, 
  AlertCircle, 
  CheckCircle2, 
  Mail, 
  Phone 
} from 'lucide-react';
import { LEGAL_POLICIES, type PolicyTabKey, type PolicyDocument } from '../data/legalPoliciesData';

interface LegalPoliciesContentProps {
  activeTab: PolicyTabKey;
  searchQuery?: string;
}

export const LegalPoliciesContent: React.FC<LegalPoliciesContentProps> = ({
  activeTab,
  searchQuery = ''
}) => {
  const policy: PolicyDocument = LEGAL_POLICIES[activeTab] || LEGAL_POLICIES.privacy;

  const getPolicyIcon = (key: PolicyTabKey) => {
    switch (key) {
      case 'privacy':
        return <ShieldCheck size={24} className="text-emerald-400" />;
      case 'terms':
        return <FileText size={24} className="text-sky-400" />;
      case 'refund':
        return <RotateCcw size={24} className="text-amber-400" />;
      case 'gst':
        return <Scale size={24} className="text-indigo-400" />;
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Filter sections if search query is present
  const filteredSections = policy.sections.filter(sec => {
    if (!normalizedQuery) return true;
    const matchTitle = sec.title.toLowerCase().includes(normalizedQuery);
    const matchParagraphs = sec.paragraphs.some(p => p.toLowerCase().includes(normalizedQuery));
    const matchBullets = sec.bulletPoints?.some(b => b.toLowerCase().includes(normalizedQuery));
    const matchCallout = sec.callout?.text.toLowerCase().includes(normalizedQuery);
    return matchTitle || matchParagraphs || matchBullets || matchCallout;
  });

  return (
    <div className="policy-doc-container animate-fade-in" id={`policy-doc-${activeTab}`}>
      {/* Header Banner */}
      <div className="policy-header-strip">
        <div className="policy-header-main">
          <div className="policy-header-icon-box">
            {getPolicyIcon(policy.key)}
          </div>
          <div>
            <div className="policy-header-badge-row">
              <span className="policy-badge-tag">{policy.badge}</span>
              <span className="policy-meta-date">
                <Calendar size={13} /> Last Updated: {policy.lastUpdated}
              </span>
            </div>
            <h2 className="policy-title-h2">{policy.title}</h2>
            <p className="policy-tagline-text">{policy.tagline}</p>
          </div>
        </div>
      </div>

      {/* Quick Trust Chips */}
      <div className="policy-trust-chips-row">
        <div className="policy-trust-chip">
          <CheckCircle2 size={14} className="text-emerald-500" />
          <span>V3Itinerary Platforms India Pvt Ltd</span>
        </div>
        <div className="policy-trust-chip">
          <ShieldCheck size={14} className="text-blue-500" />
          <span>Razorpay PCI-DSS Level 1 Encrypted</span>
        </div>
        <div className="policy-trust-chip">
          <Scale size={14} className="text-purple-500" />
          <span>Mandatory Agent GSTIN Verified</span>
        </div>
      </div>

      {/* If search query yielded no results */}
      {filteredSections.length === 0 ? (
        <div className="policy-empty-search">
          <AlertCircle size={24} className="text-amber-500" />
          <p>No matching sections found for "{searchQuery}". Showing all sections...</p>
        </div>
      ) : null}

      {/* Sections List */}
      <div className="policy-sections-list">
        {(filteredSections.length > 0 ? filteredSections : policy.sections).map((section) => (
          <div key={section.id} className="policy-section-card" id={`section-${section.id}`}>
            <h3 className="policy-section-title">{section.title}</h3>

            {/* Paragraphs */}
            <div className="policy-section-body">
              {section.paragraphs.map((p, idx) => (
                <p key={idx} className="policy-paragraph-p">
                  {p}
                </p>
              ))}

              {/* Bullet points */}
              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="policy-bullets-list">
                  {section.bulletPoints.map((item, bIdx) => (
                    <li key={bIdx} className="policy-bullet-item">
                      <span className="policy-bullet-dot"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Highlight callout box */}
              {section.callout && (
                <div className={`policy-callout-box callout-${section.callout.type}`}>
                  {section.callout.type === 'info' && <Info size={17} className="callout-icon" />}
                  {section.callout.type === 'warning' && <AlertCircle size={17} className="callout-icon" />}
                  {section.callout.type === 'success' && <CheckCircle2 size={17} className="callout-icon" />}
                  <div className="callout-text">{section.callout.text}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Support Notice */}
      <div className="policy-help-footer-banner">
        <div className="policy-help-left">
          <h4 className="policy-help-title">Questions about our policies or need assistance?</h4>
          <p className="policy-help-desc">
            Our 24x7 customer support desk and compliance officers are here to help.
          </p>
        </div>
        <div className="policy-help-contact-buttons">
          <a href="mailto:support@v3itinerary.com" className="policy-contact-btn email-btn">
            <Mail size={14} /> support@v3itinerary.com
          </a>
          <a href="tel:+9118008348747" className="policy-contact-btn phone-btn">
            <Phone size={14} /> Helpline: 1800-834-8747
          </a>
        </div>
      </div>
    </div>
  );
};
