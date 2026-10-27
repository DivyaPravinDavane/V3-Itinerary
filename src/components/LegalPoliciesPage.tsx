import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  Scale, 
  Search, 
  Printer, 
  ArrowLeft, 
  Home, 
  ChevronRight, 
  X 
} from 'lucide-react';
import { LegalPoliciesContent } from './LegalPoliciesContent';
import { type PolicyTabKey, LEGAL_POLICIES } from '../data/legalPoliciesData';

interface LegalPoliciesPageProps {
  initialTab?: PolicyTabKey;
  onBackToHome: () => void;
  onTabChange?: (tab: PolicyTabKey) => void;
}

export const LegalPoliciesPage: React.FC<LegalPoliciesPageProps> = ({
  initialTab = 'privacy',
  onBackToHome,
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTabKey>(initialTab);
  const [prevInitialTab, setPrevInitialTab] = useState<PolicyTabKey>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state if initialTab prop changes
  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
  }

  // Handle URL sync when user clicks browser back/forward buttons
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
      const hash = window.location.hash.replace(/^#+/, '').toLowerCase();
      const tab = path || hash;
      if (tab === 'privacy' || tab === 'terms' || tab === 'refund' || tab === 'gst') {
        setActiveTab(tab as PolicyTabKey);
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleSelectTab = (tab: PolicyTabKey) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', `/${tab}`);
    }
    if (onTabChange) onTabChange(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const currentPolicy = LEGAL_POLICIES[activeTab] || LEGAL_POLICIES.privacy;

  return (
    <div className="legal-page-wrapper animate-fade-in" id="legal-policies-page">
      {/* Top Breadcrumb & Back Bar */}
      <div className="legal-page-nav-bar">
        <div className="legal-page-nav-container">
          <button 
            type="button" 
            onClick={onBackToHome}
            className="legal-back-btn"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>

          <div className="legal-breadcrumb">
            <button 
              type="button" 
              onClick={onBackToHome}
              className="breadcrumb-home-link"
            >
              <Home size={14} />
              <span>Home</span>
            </button>
            <ChevronRight size={13} className="breadcrumb-sep" />
            <span className="breadcrumb-current">Legal & Trust Policies</span>
            <ChevronRight size={13} className="breadcrumb-sep" />
            <span className="breadcrumb-active-tag">{currentPolicy.shortTitle}</span>
          </div>
        </div>
      </div>

      {/* Hero Header Banner */}
      <section className="legal-page-hero">
        <div className="legal-page-hero-container">
          <div className="legal-hero-badge">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>V3Itinerary Platforms India Pvt Ltd • Official Governance</span>
          </div>
          <h1 className="legal-hero-title">
            Legal Terms & Consumer Protection
          </h1>
          <p className="legal-hero-sub">
            Verified itineraries, transparent ₹99 pricing guardrails, Razorpay encrypted checkouts, and 100% mandatory GST-verified travel agents.
          </p>

          {/* Search & Actions Bar */}
          <div className="legal-hero-tools-row">
            <div className="legal-page-search-box">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder={`Search in ${currentPolicy.shortTitle}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="legal-page-search-input"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery('')}
                  className="search-clear-btn"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button 
              type="button" 
              onClick={handlePrint}
              className="legal-print-btn"
              title="Print policy document"
            >
              <Printer size={15} />
              <span>Print Policy</span>
            </button>
          </div>
        </div>
      </section>

      {/* Policy Tabs Navigation */}
      <div className="legal-page-tabs-strip">
        <div className="legal-page-tabs-container" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'privacy'}
            className={`legal-page-tab-item ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => handleSelectTab('privacy')}
          >
            <ShieldCheck size={18} />
            <div className="tab-text-group">
              <span className="tab-label-main">Privacy Policy</span>
              <span className="tab-label-sub">DPDP Act 2023 & Security</span>
            </div>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'terms'}
            className={`legal-page-tab-item ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => handleSelectTab('terms')}
          >
            <FileText size={18} />
            <div className="tab-text-group">
              <span className="tab-label-main">Terms & Conditions</span>
              <span className="tab-label-sub">₹99 Marketplace Agreement</span>
            </div>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'refund'}
            className={`legal-page-tab-item ${activeTab === 'refund' ? 'active' : ''}`}
            onClick={() => handleSelectTab('refund')}
          >
            <RotateCcw size={18} />
            <div className="tab-text-group">
              <span className="tab-label-main">Refund Policy</span>
              <span className="tab-label-sub">Instant Digital Access & Guarantee</span>
            </div>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'gst'}
            className={`legal-page-tab-item ${activeTab === 'gst' ? 'active' : ''}`}
            onClick={() => handleSelectTab('gst')}
          >
            <Scale size={18} />
            <div className="tab-text-group">
              <span className="tab-label-main">GST Compliance</span>
              <span className="tab-label-sub">Mandatory Agent Verification</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Policy Content Area */}
      <main className="legal-page-content-main">
        <div className="legal-page-content-container">
          <div className="legal-page-card shadow-lg">
            <LegalPoliciesContent 
              activeTab={activeTab} 
              searchQuery={searchQuery} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};
