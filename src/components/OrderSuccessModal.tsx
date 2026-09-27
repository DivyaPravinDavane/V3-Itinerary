import React, { useState } from 'react';
import { CheckCircle2, Download, MessageCircle, Phone, Mail, X, FileText, Send, Calendar, Users, ShieldCheck } from 'lucide-react';
import type { Itinerary, OrderRecord } from '../types';
import { generateItineraryPDF } from '../utils/pdfGenerator';

interface OrderSuccessModalProps {
  itinerary: Itinerary;
  order: OrderRecord;
  customerName: string;
  onClose: () => void;
  onViewMyTrips: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  itinerary,
  order,
  customerName,
  onClose,
  onViewMyTrips
}) => {
  const [inquirySent, setInquirySent] = useState(false);
  const [travelDates, setTravelDates] = useState('2026-11-15');
  const [guestCount, setGuestCount] = useState('2 Adults');
  const [customNotes, setCustomNotes] = useState('');

  const handleDownloadPDF = () => {
    generateItineraryPDF(itinerary, order, customerName);
  };

  // Prefilled WhatsApp deep link as defined in PRD Section 8.3
  const waEncodedMsg = encodeURIComponent(
    `Hi ${itinerary.agent.agencyName}, I purchased your ${itinerary.destination} ${itinerary.durationDays}-Day Itinerary on V3Itinerary (Order #${order.orderId}). I would like to inquire about booking the full ground package.`
  );
  const waCleanPhone = itinerary.agent.whatsapp.replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/${waCleanPhone}?text=${waEncodedMsg}`;

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-container fulfillment-modal shadow-2xl animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* Success Header */}
        <div className="fulfillment-header">
          <div className="success-icon-badge">
            <CheckCircle2 size={38} className="text-emerald-500" />
          </div>
          <h2 className="fulfillment-title">Payment Successful!</h2>
          <p className="fulfillment-sub">Your digital travel blueprint has been unlocked and bound to your account.</p>
          <div className="order-pill-tag font-mono">Order Ref: {order.orderId}</div>
        </div>

        {/* Download & Connect Actions Row */}
        <div className="fulfillment-action-cards">
          {/* Action 1: Instant PDF Blueprint Download */}
          <div className="fulfillment-card pdf-card">
            <div className="card-top-icon">
              <FileText size={24} className="text-blue-600" />
            </div>
            <h3 className="card-h">Instant PDF Blueprint</h3>
            <p className="card-p">Download the complete day-by-day itinerary with exact timings, hotel options, and routes for offline travel.</p>
            <button className="btn-action-primary" onClick={handleDownloadPDF}>
              <Download size={17} /> Download Blueprint (PDF)
            </button>
          </div>

          {/* Action 2: WhatsApp Direct Connection */}
          <div className="fulfillment-card whatsapp-card">
            <div className="card-top-icon">
              <MessageCircle size={24} className="text-emerald-600" />
            </div>
            <h3 className="card-h">WhatsApp Travel Agent</h3>
            <p className="card-p">Chat directly with {itinerary.agent.founderName} to customize your flights, hotels, and on-ground activities.</p>
            <a href={waLink} target="_blank" rel="noreferrer" className="btn-action-whatsapp">
              <MessageCircle size={17} /> Connect on WhatsApp
            </a>
          </div>

          {/* Action 3: Direct Phone Hotline */}
          <div className="fulfillment-card phone-card">
            <div className="card-top-icon">
              <Phone size={24} className="text-purple-600" />
            </div>
            <h3 className="card-h">Verified Phone Hotline</h3>
            <p className="card-p">Direct phone access to {itinerary.agent.agencyName} during regular operating hours (9 AM - 8 PM IST).</p>
            <a href={`tel:${itinerary.agent.phone}`} className="btn-action-phone">
              <Phone size={17} /> Call: {itinerary.agent.phone}
            </a>
          </div>
        </div>

        {/* In-App Direct Inquiry Form (PRD Section 8.3) */}
        <div className="agent-inquiry-box">
          <h4 className="inquiry-box-title">
            <Mail size={17} className="text-blue-600" />
            Send Inquiry Directly to Verified Agency ({itinerary.agent.agencyName})
          </h4>

          {inquirySent ? (
            <div className="inquiry-success-alert">
              <CheckCircle2 size={20} className="text-emerald-600" />
              <div>
                <strong>Inquiry Dispatched!</strong>
                <p>The travel planner has received your request and will contact you via WhatsApp or Email within 2 business hours.</p>
              </div>
            </div>
          ) : (
            <form className="inquiry-form" onSubmit={handleSendInquiry}>
              <div className="inquiry-fields-row">
                <div className="inquiry-field">
                  <label className="lbl"><Calendar size={13} /> Tentative Travel Date</label>
                  <input 
                    type="date" 
                    value={travelDates} 
                    onChange={(e) => setTravelDates(e.target.value)}
                    className="inquiry-input"
                    required
                  />
                </div>
                <div className="inquiry-field">
                  <label className="lbl"><Users size={13} /> Number of Guests</label>
                  <input 
                    type="text" 
                    value={guestCount} 
                    onChange={(e) => setGuestCount(e.target.value)}
                    placeholder="e.g. 2 Adults, 1 Child"
                    className="inquiry-input"
                    required
                  />
                </div>
              </div>

              <div className="inquiry-field">
                <label className="lbl">Specific Requests or Customizations</label>
                <textarea 
                  rows={2}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. We prefer vegetarian food options, private beach villa, and airport luxury pickup."
                  className="inquiry-textarea"
                ></textarea>
              </div>

              <div className="inquiry-submit-row">
                <div className="verified-stamp-note">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>GSTIN {itinerary.agent.gstNumber} Verified Agency</span>
                </div>
                <button type="submit" className="btn-send-inquiry">
                  <Send size={15} /> Submit Inquiry to Agent
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="fulfillment-footer">
          <button className="btn-outline-text" onClick={onClose}>
            Back to Home
          </button>
          <button className="btn-dashboard-jump" onClick={onViewMyTrips}>
            Go to My Trips Hub →
          </button>
        </div>
      </div>
    </div>
  );
};
