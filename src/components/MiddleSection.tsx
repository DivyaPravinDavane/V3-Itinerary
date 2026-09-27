import React from 'react';
import { Search, FileText, Download, UserCheck, ArrowRight, Users, Globe, Smile, MapPin } from 'lucide-react';

interface MiddleSectionProps {
  onOpenAgentModal: () => void;
}

export const MiddleSection: React.FC<MiddleSectionProps> = ({ onOpenAgentModal }) => {
  return (
    <section className="middle-section" id="how-it-works">
      <div className="section-container">
        <div className="middle-three-cards-grid">
          {/* Card 1: How It Works */}
          <div className="how-it-works-card shadow-sm">
            <h3 className="card-inner-title">How It Works</h3>

            <div className="flow-steps-row">
              {/* Step 1 */}
              <div className="flow-step">
                <div className="step-icon-circle blue-light">
                  <Search size={18} className="step-svg text-blue-600" />
                </div>
                <h4 className="step-title">1. Destination</h4>
                <p className="step-desc">Pick your destination</p>
              </div>

              {/* Arrow */}
              <div className="step-connector-arrow">
                <ArrowRight size={16} />
              </div>

              {/* Step 2 */}
              <div className="flow-step">
                <div className="step-icon-circle blue-light">
                  <FileText size={18} className="step-svg text-blue-600" />
                </div>
                <h4 className="step-title">2. Choose Package</h4>
                <p className="step-desc">Browse durations & styles</p>
              </div>

              {/* Arrow */}
              <div className="step-connector-arrow">
                <ArrowRight size={16} />
              </div>

              {/* Step 3 */}
              <div className="flow-step">
                <div className="step-icon-circle blue-light">
                  <Download size={18} className="step-svg text-blue-600" />
                </div>
                <h4 className="step-title">3. View Itinerary</h4>
                <p className="step-desc">Explore daily schedules & pacing</p>
              </div>

              {/* Arrow */}
              <div className="step-connector-arrow">
                <ArrowRight size={16} />
              </div>

              {/* Step 4 */}
              <div className="flow-step">
                <div className="step-icon-circle blue-light">
                  <UserCheck size={18} className="step-svg text-blue-600" />
                </div>
                <h4 className="step-title">4. Buy for ₹99</h4>
                <p className="step-desc">Instant access via Razorpay</p>
              </div>
            </div>
          </div>

          {/* Card 2: For Travel Agents Promo Banner */}
          <div className="agent-promo-card shadow-md">
            <div className="agent-promo-content">
              <span className="agent-promo-tag">For Travel Agents</span>
              <h3 className="agent-promo-heading">
                Upload Unlimited Itineraries<br />
                Get Genuine Leads Across India
              </h3>
              <button className="btn-join-now" onClick={onOpenAgentModal}>
                Join Now
              </button>
            </div>

            <div className="agent-promo-image-box">
              <img 
                src="/images/laptop_mockup.jpg" 
                alt="Travel Agent Portal Dashboard on Laptop" 
                className="laptop-img"
              />
            </div>
          </div>

          {/* Card 3: Platform Live Metrics Grid */}
          <div className="metrics-card shadow-sm">
            <div className="metrics-2x2-grid">
              {/* Stat 1 */}
              <div className="metric-box">
                <div className="metric-icon-circle bg-blue-50">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div className="metric-text-group">
                  <span className="metric-number">1250+</span>
                  <span className="metric-label">Travel Agents</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="metric-box">
                <div className="metric-icon-circle bg-emerald-50">
                  <Globe size={20} className="text-emerald-600" />
                </div>
                <div className="metric-text-group">
                  <span className="metric-number">8500+</span>
                  <span className="metric-label">Itineraries</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="metric-box">
                <div className="metric-icon-circle bg-purple-50">
                  <Smile size={20} className="text-purple-600" />
                </div>
                <div className="metric-text-group">
                  <span className="metric-number">25000+</span>
                  <span className="metric-label">Happy Travellers</span>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="metric-box">
                <div className="metric-icon-circle bg-sky-50">
                  <MapPin size={20} className="text-sky-600" />
                </div>
                <div className="metric-text-group">
                  <span className="metric-number">500+</span>
                  <span className="metric-label">Destinations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
