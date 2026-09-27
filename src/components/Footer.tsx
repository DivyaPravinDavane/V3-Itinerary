import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenAgentModal: () => void;
  onScrollToSection: (sectionId: string) => void;
  onSelectDestination: (name: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAgentModal,
  onScrollToSection,
  onSelectDestination
}) => {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-top-container">
        {/* Col 1: Brand & Vision */}
        <div className="footer-col brand-col">
          <div className="footer-logo-row" onClick={() => onScrollToSection('hero')} style={{ cursor: 'pointer' }}>
            <img 
              src="/v3_logo.png" 
              alt="V3Itinerary.com" 
              className="footer-brand-logo-img" 
            />
          </div>
          <p className="footer-about-p">
            India's premier marketplace for verified travel itineraries. We empower certified travel experts to monetize crafted travel blueprints while protecting travelers from generic AI hallucinations and unvetted tour scams.
          </p>
          <div className="footer-gst-badge">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>100% Mandatory GST Verification for all Travel Planners</span>
          </div>
        </div>

        {/* Col 2: Top Destinations */}
        <div className="footer-col">
          <h4 className="footer-col-title">Popular Blueprints</h4>
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

        {/* Col 3: Quick Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">Platform & Agents</h4>
          <ul className="footer-links-list">
            <li><button onClick={() => onScrollToSection('hero')}>Marketplace Home</button></li>
            <li><button onClick={() => onScrollToSection('destinations')}>Browse Curated Itineraries</button></li>
            <li><button onClick={onOpenAgentModal}>For Travel Agents (Join with GSTIN)</button></li>
            <li><button onClick={() => onScrollToSection('how-it-works')}>How It Works (4 Steps)</button></li>
            <li><button onClick={() => onScrollToSection('trust-pillars')}>Buyer Protection & Trust</button></li>
            <li><a href="#transparency">Pricing Transparency (₹99 Rule)</a></li>
          </ul>
        </div>

        {/* Col 4: Support & Contact */}
        <div className="footer-col contact-col">
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

      <div className="footer-bottom-bar">
        <div className="footer-bottom-inner">
          <p className="copyright-text">
            © {new Date().getFullYear()} V3Itinerary Platforms India Pvt Ltd. All rights reserved.
          </p>
          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <span>•</span>
            <a href="#terms">Terms of Service</a>
            <span>•</span>
            <a href="#gst-compliance">GST Compliance Guidelines</a>
            <span>•</span>
            <a href="#refund">Instant Digital Access Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
