import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  Scale, 
  Search, 
  Printer 
} from 'lucide-react';
import { LegalPoliciesContent } from './LegalPoliciesContent';
import { type PolicyTabKey, LEGAL_POLICIES } from '../data/legalPoliciesData';

interface LegalPoliciesModalProps {
  isOpen: boolean;
  initialTab?: PolicyTabKey;
  onClose: () => void;
}

export const LegalPoliciesModal: React.FC<LegalPoliciesModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTabKey>(initialTab);
  const [prevInitialTab, setPrevInitialTab] = useState<PolicyTabKey>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
  }

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="modal-overlay animate-fade-in" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div 
        className="modal-container legal-policies-modal shadow-2xl animate-scale-up" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="modal-close-btn" 
          onClick={onClose} 
          aria-label="Close legal policies modal"
        >
          <X size={20} />
        </button>

        {/* Modal Top Header Bar */}
        <div className="legal-modal-header">
          <div className="legal-modal-brand-row">
            <img src="/v3_logo.png" alt="V3Itinerary Logo" className="legal-modal-logo" />
            <div className="legal-modal-header-titles">
              <h2 id="legal-modal-title" className="legal-modal-main-title">
                Trust, Privacy & Legal Terms
              </h2>
              <p className="legal-modal-sub-title">
                V3Itinerary Platforms India Pvt Ltd • Official Governance & Consumer Protection
              </p>
            </div>
          </div>

          <div className="legal-modal-header-actions">
            {/* Live in-policy search */}
            <div className="legal-modal-search-box">
              <Search size={15} className="legal-search-icon" />
              <input 
                type="text" 
                placeholder="Search policy clauses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="legal-search-input"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="legal-search-clear-btn"
                  title="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Print Button */}
            <button 
              className="legal-modal-action-btn print-btn" 
              onClick={handlePrint}
              title="Print active policy document"
            >
              <Printer size={15} />
              <span className="btn-label-desktop">Print</span>
            </button>
          </div>
        </div>

        {/* Policy Navigation Tabs Bar */}
        <div className="legal-tabs-bar" role="tablist">
          <button 
            role="tab"
            aria-selected={activeTab === 'privacy'}
            className={`legal-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <ShieldCheck size={16} />
            <span>{LEGAL_POLICIES.privacy.shortTitle}</span>
          </button>

          <button 
            role="tab"
            aria-selected={activeTab === 'terms'}
            className={`legal-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            <FileText size={16} />
            <span>{LEGAL_POLICIES.terms.shortTitle}</span>
          </button>

          <button 
            role="tab"
            aria-selected={activeTab === 'refund'}
            className={`legal-tab-btn ${activeTab === 'refund' ? 'active' : ''}`}
            onClick={() => setActiveTab('refund')}
          >
            <RotateCcw size={16} />
            <span>{LEGAL_POLICIES.refund.shortTitle}</span>
          </button>

          <button 
            role="tab"
            aria-selected={activeTab === 'gst'}
            className={`legal-tab-btn ${activeTab === 'gst' ? 'active' : ''}`}
            onClick={() => setActiveTab('gst')}
          >
            <Scale size={16} />
            <span>{LEGAL_POLICIES.gst.shortTitle}</span>
          </button>
        </div>

        {/* Scrollable Policy Content Area */}
        <div className="legal-modal-content-area">
          <LegalPoliciesContent 
            activeTab={activeTab} 
            searchQuery={searchQuery} 
          />
        </div>

        {/* Bottom Bar with Verification Badges */}
        <div className="legal-modal-footer">
          <div className="legal-modal-footer-badges">
            <span className="legal-verif-badge">
              <ShieldCheck size={14} className="text-emerald-500" /> 100% Verified Platform
            </span>
            <span className="legal-verif-badge">
              🔒 256-Bit SSL Encrypted
            </span>
            <span className="legal-verif-badge">
              🇮🇳 Government of India GST Compliant
            </span>
          </div>

          <button 
            className="legal-modal-dismiss-btn" 
            onClick={onClose}
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
};
