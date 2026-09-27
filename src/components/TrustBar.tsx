import React from 'react';
import { ShieldCheck, Lock, DownloadCloud, Headphones, Info } from 'lucide-react';

export const TrustBar: React.FC = () => {
  return (
    <div className="trust-section-wrapper" id="trust-pillars">
      <div className="section-container">
        {/* Four Trust Pillars Bar */}
        <div className="bottom-trust-strip shadow-sm">
          {/* Pillar 1 */}
          <div className="trust-pillar-item">
            <div className="trust-pillar-icon-box green-icon-box">
              <ShieldCheck size={22} className="text-emerald-600" />
            </div>
            <div className="trust-pillar-info">
              <h4 className="trust-pillar-title text-emerald-800">Verified & Trusted</h4>
              <p className="trust-pillar-desc">All agents are verified for your safety</p>
            </div>
          </div>

          <div className="trust-pillar-divider"></div>

          {/* Pillar 2 */}
          <div className="trust-pillar-item">
            <div className="trust-pillar-icon-box orange-icon-box">
              <Lock size={20} className="text-amber-600" />
            </div>
            <div className="trust-pillar-info">
              <h4 className="trust-pillar-title text-amber-800">Safe Payments</h4>
              <p className="trust-pillar-desc">Secure payment gateway for worry-free transactions</p>
            </div>
          </div>

          <div className="trust-pillar-divider"></div>

          {/* Pillar 3 */}
          <div className="trust-pillar-item">
            <div className="trust-pillar-icon-box blue-icon-box">
              <DownloadCloud size={21} className="text-blue-600" />
            </div>
            <div className="trust-pillar-info">
              <h4 className="trust-pillar-title text-blue-800">Instant Access</h4>
              <p className="trust-pillar-desc">Download itinerary immediately after purchase</p>
            </div>
          </div>

          <div className="trust-pillar-divider"></div>

          {/* Pillar 4 */}
          <div className="trust-pillar-item">
            <div className="trust-pillar-icon-box purple-icon-box">
              <Headphones size={21} className="text-purple-600" />
            </div>
            <div className="trust-pillar-info">
              <h4 className="trust-pillar-title text-purple-800">Dedicated Support</h4>
              <p className="trust-pillar-desc">We're here to help you 24x7</p>
            </div>
          </div>
        </div>

        {/* PRD Non-Deceptive Pricing Guardrail Notice */}
        <div className="pricing-guardrail-banner">
          <Info size={18} className="guardrail-icon" />
          <p className="guardrail-text">
            <strong>Non-Deceptive Pricing Guarantee:</strong> ₹99 is the nominal fee to access the complete digital travel blueprint and verified agent contact. Actual on-ground tour packages and travel bookings are customized separately.
          </p>
        </div>
      </div>
    </div>
  );
};
