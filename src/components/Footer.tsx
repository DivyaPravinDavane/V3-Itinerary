import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import type { PolicyTabKey } from '../data/legalPoliciesData';

interface FooterProps {
  onOpenAgentModal: () => void;
  onOpenAgentLogin?: () => void;
  onScrollToSection: (sectionId: string) => void;
  onSelectDestination: (name: string) => void;
  onNavigatePage?: (page: 'home' | 'destinations' | 'agent-studio' | 'policies', tab?: PolicyTabKey) => void;
  onOpenAgentDashboard?: () => void;
  isAgent?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAgentModal,
  onOpenAgentLogin,
  onScrollToSection,
  onSelectDestination,
  onNavigatePage,
  onOpenAgentDashboard,
  isAgent
}) => {
  const handlePolicyClick = (tab: PolicyTabKey) => {
    if (onNavigatePage) {
      onNavigatePage('policies', tab);
    } else {
      window.history.pushState({}, '', `/${tab}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="site-footer" id="footer">
      <div className="footer-top-container">
        {/* Col 1: Brand & Vision */}
        <div className="footer-col brand-col">
          <div 
            className="footer-logo-row" 
            onClick={() => {
              if (onNavigatePage) onNavigatePage('home');
              else onScrollToSection('hero');
            }} 
            style={{ cursor: 'pointer' }}
          >
            <img 
              src="/v3_logo.png" 
              alt="V3Itinerary.com" 
              className="footer-brand-logo-img" 
            />
          </div>
          <p className="footer-about-p">
            India's trusted platform for verified travel itineraries. We connect travelers with certified local travel agents to get authentic, ready-to-use trip plans for just ₹99.
          </p>
          <div 
            className="footer-gst-badge"
            onClick={() => handlePolicyClick('gst')}
            title="Click to view official GST compliance guidelines"
            style={{ cursor: 'pointer' }}
          >
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>100% Mandatory GST Verification for all Travel Planners</span>
          </div>
        </div>

        {/* Col 2: Top Destinations */}
        <div className="footer-col">
          <h4 className="footer-col-title">Popular Itineraries</h4>
          <ul className="footer-links-list">
            <li><button onClick={() => onSelectDestination('Dubai')}>Dubai Luxury & Desert Safari</button></li>
            <li><button onClick={() => onSelectDestination('Maldives')}>Maldives Overwater Villa</button></li>
            <li><button onClick={() => onSelectDestination('Singapore')}>Singapore Universal & Sentosa</button></li>
            <li><button onClick={() => onSelectDestination('Thailand')}>Thailand Bangkok & Pattaya</button></li>
            <li><button onClick={() => onSelectDestination('Europe')}>Europe Swiss Alps & Paris</button></li>
            <li><button onClick={() => onSelectDestination('Bali')}>Bali Ubud & Nusa Penida</button></li>
            <li><button onClick={() => onSelectDestination('Kashmir')}>Kashmir Dal Lake & Gulmarg</button></li>
            <li><button onClick={() => onSelectDestination('Goa')}>Goa Beach & Dudhsagar</button></li>
            <li><button onClick={() => onSelectDestination('Kerala')}>Kerala Munnar & Alleppey</button></li>
            <li><button onClick={() => onSelectDestination('Manali')}>Manali Snow & Atal Tunnel</button></li>
            <li><button onClick={() => onSelectDestination('Ladakh')}>Ladakh Pangong & Nubra</button></li>
            <li><button onClick={() => onSelectDestination('Vietnam')}>Vietnam Halong Bay & Hoi An</button></li>
            <li><button onClick={() => onSelectDestination('Japan')}>Japan Tokyo & Kyoto</button></li>
          </ul>
        </div>

        {/* Col 3: Platform, Agents & Legal Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">Platform & Trust</h4>
          <ul className="footer-links-list">
            <li>
              <button onClick={() => {
                if (onNavigatePage) onNavigatePage('home');
                else onScrollToSection('hero');
              }}>
                Marketplace Home
              </button>
            </li>
            <li>
              <button onClick={() => {
                if (onNavigatePage) onNavigatePage('destinations');
                else onScrollToSection('destinations');
              }}>
                Explore All Destinations
              </button>
            </li>
            <li>
              <button onClick={() => {
                if (isAgent && onNavigatePage) {
                  onNavigatePage('agent-studio');
                } else if (onOpenAgentLogin) {
                  onOpenAgentLogin();
                } else if (onOpenAgentDashboard) {
                  onOpenAgentDashboard();
                } else {
                  onOpenAgentModal();
                }
              }}>
                Travel Agent Login (Studio Portal)
              </button>
            </li>
            <li><button onClick={onOpenAgentModal}>For Travel Agents (Join with GSTIN)</button></li>
            <li><button onClick={() => onScrollToSection('how-it-works')}>How It Works (4 Steps)</button></li>
            <li><button onClick={() => handlePolicyClick('terms')}>Terms and Conditions</button></li>
            <li><button onClick={() => handlePolicyClick('privacy')}>Privacy Policy</button></li>
            <li><button onClick={() => handlePolicyClick('refund')}>Refund Policy</button></li>
            <li><button onClick={() => handlePolicyClick('gst')}>GST Compliance Guidelines</button></li>
          </ul>
        </div>

        {/* Col 4: Support & Contact */}
        <div className="footer-col contact-col" id="contact">
          <h4 className="footer-col-title">Customer Concierge</h4>
          <div className="footer-contact-item">
            <Phone size={15} className="text-blue-400" />
            <span>24x7 Helpline: +91 1800-834-8747</span>
          </div>
          <div className="footer-contact-item">
            <Mail size={15} className="text-blue-400" />
            <span>support@v3itinerary.com</span>
          </div>
          <div className="footer-contact-item">
            <MapPin size={15} className="text-blue-400" />
            <span>Mumbai • Bengaluru • New Delhi, India</span>
          </div>

          <div className="footer-payments-supported">
            <span className="pay-tag">UPI</span>
            <span className="pay-tag">Cards</span>
            <span className="pay-tag">NetBanking</span>
            <span className="pay-tag">Razorpay</span>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar with Clean Word Links to Other Pages */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-inner">
          <p className="copyright-text">
            © {new Date().getFullYear()} V3Itinerary Platforms India Pvt Ltd. All rights reserved.
          </p>

          <div className="footer-legal-links">
            <button 
              type="button" 
              onClick={() => handlePolicyClick('privacy')}
              className="footer-legal-btn"
            >
              Privacy Policy
            </button>
            <span className="footer-legal-sep">•</span>
            <button 
              type="button" 
              onClick={() => handlePolicyClick('terms')}
              className="footer-legal-btn"
            >
              Terms and Conditions
            </button>
            <span className="footer-legal-sep">•</span>
            <button 
              type="button" 
              onClick={() => handlePolicyClick('refund')}
              className="footer-legal-btn"
            >
              Refund Policy
            </button>
            <span className="footer-legal-sep">•</span>
            <button 
              type="button" 
              onClick={() => handlePolicyClick('gst')}
              className="footer-legal-btn"
            >
              GST Compliance
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
