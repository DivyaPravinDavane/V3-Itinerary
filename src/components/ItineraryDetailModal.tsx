import React, { useState, useEffect } from 'react';
import { 
  X, Clock, Users, Heart, Star, Lock,
  ShieldCheck, Download, CheckCircle2,
  Calendar, CreditCard, ChevronDown, ChevronUp, FileText, ExternalLink
} from 'lucide-react';
import type { Itinerary, OrderRecord } from '../types';
import { generateItineraryPDF, createItineraryPDFBlobUrl } from '../utils/pdfGenerator';

interface ItineraryDetailModalProps {
  itinerary: Itinerary | null;
  onClose: () => void;
  onBuy: (itinerary: Itinerary) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  isPurchased: boolean;
  onOpenOrderSuccess: () => void;
  order?: OrderRecord | null;
  customerName?: string;
  customerEmail?: string;
}

export const ItineraryDetailModal: React.FC<ItineraryDetailModalProps> = ({
  itinerary,
  onClose,
  onBuy,
  isSaved,
  onToggleSave,
  isPurchased,
  order,
  customerName = 'Valued Traveler',
  customerEmail = 'rahul.sharma@example.com'
}) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [openDayIndex, setOpenDayIndex] = useState<number | null>(0);

  // Generate PDF preview blob URL whenever purchased (or use agent uploaded PDF)
  useEffect(() => {
    if (isPurchased && itinerary) {
      if (itinerary.pdfUrl) {
        setPdfBlobUrl(itinerary.pdfUrl);
        return;
      }

      const activeOrder: OrderRecord = order || {
        orderId: `V3I-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-99`,
        itineraryId: itinerary.id,
        itineraryTitle: itinerary.title,
        destination: itinerary.destination,
        amountPaid: 99.00,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        paymentMethod: 'UPI (Razorpay Verified)',
        razorpayPaymentId: 'pay_unlocked_blueprint',
        agentName: itinerary.agent?.agencyName || 'V3 Curators',
        agentPhone: itinerary.agent?.phone || '+91 98203 89694',
        agentWhatsapp: itinerary.agent?.whatsapp || '+91 98203 89694',
        agentEmail: itinerary.agent?.email || 'support@v3itinerary.com'
      };

      try {
        const url = createItineraryPDFBlobUrl(itinerary, activeOrder, customerName);
        setPdfBlobUrl(url);
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (e) {
        console.error("PDF Blob generation error:", e);
      }
    }
  }, [isPurchased, itinerary, order, customerName]);

  if (!itinerary) return null;

  const handleDownloadPDF = () => {
    if (itinerary?.pdfUrl) {
      const link = document.createElement('a');
      link.href = itinerary.pdfUrl;
      link.download = itinerary.pdfName || `${itinerary.destination}_Itinerary_Blueprint.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const activeOrder: OrderRecord = order || {
      orderId: `V3I-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-99`,
      itineraryId: itinerary.id,
      itineraryTitle: itinerary.title,
      destination: itinerary.destination,
      amountPaid: 99.00,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      paymentMethod: 'UPI (Razorpay Verified)',
      razorpayPaymentId: 'pay_unlocked_blueprint',
      agentName: itinerary.agent?.agencyName || 'V3 Curators',
      agentPhone: itinerary.agent?.phone || '+91 98203 89694',
      agentWhatsapp: itinerary.agent?.whatsapp || '+91 98203 89694',
      agentEmail: itinerary.agent?.email || 'support@v3itinerary.com'
    };
    generateItineraryPDF(itinerary, activeOrder, customerName);
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-container package-split-view-modal shadow-2xl animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* SPLIT CONTAINER: Picture on Left, Summary + Razorpay / PDF on Right */}
        <div className="split-view-layout">
          {/* =========================================================================
              LEFT COLUMN: Picture & Visual Highlights
              ========================================================================= */}
          <div className="split-left-picture-col">
            <div className="picture-hero-wrap">
              <img 
                src={itinerary.coverImage} 
                alt={itinerary.title} 
                className="picture-main-img"
              />
              <div className="picture-gradient-overlay" />

              {/* Floating Meta Badges */}
              <div className="picture-badges-row">
                <span className="pic-badge duration">
                  <Clock size={12} />
                  <span>{itinerary.durationDays}D / {itinerary.durationNights}N</span>
                </span>
                <span className="pic-badge style">
                  <Users size={12} />
                  <span>{itinerary.travelerType} Special</span>
                </span>
                <span className="pic-badge destination">
                  <span>{itinerary.destination}</span>
                </span>
              </div>

              {/* Wishlist Heart */}
              <button 
                className={`pic-heart-btn ${isSaved ? 'saved' : ''}`}
                onClick={() => onToggleSave(itinerary.id)}
                title={isSaved ? "Saved to wishlist" : "Save package"}
                aria-label="Save package"
              >
                <Heart size={18} fill={isSaved ? '#EF4444' : 'none'} stroke={isSaved ? '#EF4444' : '#FFFFFF'} />
              </button>
            </div>

            {/* Gallery Previews & Highlights */}
            <div className="split-left-details">
              <div className="pic-rating-row">
                <div className="rating-pill">
                  <Star size={14} fill="#F59E0B" stroke="#F59E0B" />
                  <span className="font-bold">{itinerary.rating}</span>
                </div>
                <span className="text-xs text-slate-500">({itinerary.reviewCount} verified travelers)</span>
              </div>

              <div className="pic-highlights-box">
                <span className="pic-box-label">Included Sights & Experiences:</span>
                <div className="pic-tags-wrap">
                  {itinerary.days.map((d, i) => (
                    <span key={i} className="pic-tag">
                      ✓ {d.highlights[0] || d.title.substring(0, 24)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pic-best-season">
                <Calendar size={13} className="text-blue-600 shrink-0" />
                <span>Best travel season: <strong>{itinerary.bestTimeToVisit.split('(')[0]}</strong></span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: Little Summary (Not Full) & Razorpay / PDF Viewer
              ========================================================================= */}
          <div className="split-right-content-col">
            {/* Header Title */}
            <div className="content-header-block">
              <span className="content-dest-tag">{itinerary.destination} Verified Blueprint</span>
              <h2 className="content-package-title">{itinerary.title}</h2>
            </div>

            {/* Little Summary (Not Full) as requested */}
            <div className="package-little-summary-card">
              <h4 className="summary-title">Package Synopsis</h4>
              <p className="summary-text">
                {itinerary.overview}
              </p>

              {/* High-level Day Outline */}
              <div className="summary-day-outline-list">
                <span className="outline-heading">Trip Route & Daily Outline:</span>
                {itinerary.days.map((day) => (
                  <div key={day.dayNumber} className="day-outline-item">
                    <span className="day-badge">Day {day.dayNumber}</span>
                    <span className="day-outline-title">{day.title}</span>
                  </div>
                ))}
              </div>

              {/* Estimated Budget Synopsis */}
              <div className="summary-budget-row">
                <div>
                  <span className="budget-lbl">Est. Total Trip Ground Budget:</span>
                  <div className="budget-val">₹{itinerary.estimatedTripCost.toLocaleString('en-IN')}</div>
                </div>
                <div className="text-right">
                  <span className="budget-lbl">Itinerary Blueprint Fee:</span>
                  <div className="price-val">₹99 <span className="text-xs font-normal text-slate-500">(Flat)</span></div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                BEFORE PAYMENT: PUT RAZORPAY TO VIEW THE FULL ITINERARY
                ========================================================================= */}
            {!isPurchased ? (
              <div className="razorpay-unlock-box">
                {itinerary.pdfUrl ? (
                  <div className="p-3 mb-3 bg-red-50/70 border border-red-200 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                      <FileText size={22} className="text-red-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-2 flex-wrap">
                        <span className="truncate max-w-[200px]">{itinerary.pdfName || 'Verified Agent Tour Itinerary.pdf'}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase">PDF</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Official travel agency itinerary document attached. Unlocks for instant viewing & download upon payment.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="lock-teaser-row">
                    <Lock size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="lock-teaser-text">
                      Detailed morning, afternoon & evening schedules, exact timings, direct ticket booking links, and offline PDF guide are unlocked after payment.
                    </p>
                  </div>
                )}

                <div className="razorpay-action-card">
                  <div className="rzp-badge-strip">
                    <span className="rzp-brand-tag">Razorpay Verified Checkout</span>
                    <span className="rzp-security-tag"><ShieldCheck size={13} /> 256-Bit Encrypted</span>
                  </div>

                  <div className="rzp-price-row">
                    <div>
                      <span className="rzp-total-lbl">Total Payable:</span>
                      <div className="rzp-price-amount">₹99.00</div>
                    </div>
                    <span className="rzp-all-inc">All Taxes Included • Instant Access</span>
                  </div>

                  <button 
                    className="btn-pay-razorpay-direct shadow-lg"
                    onClick={() => onBuy(itinerary)}
                    id="btn-split-pay-razorpay"
                  >
                    <CreditCard size={18} />
                    <span>Pay ₹99 to View Full Itinerary</span>
                  </button>

                  <p className="rzp-guarantee-note">
                    Instant access: UPI (GPay, PhonePe, Paytm), Cards & NetBanking supported.
                  </p>
                </div>
              </div>
            ) : (
              /* =========================================================================
                  AFTER PAYMENT: THE PDF SHOULD BE SEEN AS REQUESTED!
                  ========================================================================= */
              <div className="pdf-unlocked-container animate-fade-in">
                <div className="pdf-success-banner">
                  <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-emerald-950 text-sm">Payment Verified! Blueprint PDF Unlocked</h4>
                    <p className="text-xs text-emerald-800">
                      📧 Dispatched to <strong>{customerEmail}</strong> (Check inbox & spam) • Live blueprint ready to view & download below:
                    </p>
                  </div>
                </div>

                {/* PDF Viewer / Preview Card (The PDF is Seen!) */}
                <div className="pdf-viewer-card">
                  <div className="pdf-card-header">
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={18} className="text-red-600 shrink-0" />
                      <span className="font-bold text-slate-800 text-sm truncate">
                        {itinerary.pdfName || `${itinerary.destination}_Itinerary_Blueprint.pdf`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {itinerary.pdfUrl && (
                        <a 
                          href={itinerary.pdfUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="btn-pdf-download-action"
                          style={{ background: '#F1F5F9', color: '#334155' }}
                          title="Open PDF in Full Screen"
                        >
                          <ExternalLink size={14} />
                          <span>Full Screen</span>
                        </a>
                      )}
                      <button 
                        className="btn-pdf-download-action"
                        onClick={handleDownloadPDF}
                      >
                        <Download size={15} />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Embedded PDF iframe viewer if available */}
                  {pdfBlobUrl ? (
                    <div className="pdf-embed-wrapper">
                      <iframe 
                        src={pdfBlobUrl} 
                        className="pdf-iframe-view"
                        title={`${itinerary.destination} Travel Itinerary PDF`}
                      />
                    </div>
                  ) : (
                    <div className="pdf-fallback-box">
                      <FileText size={36} className="text-blue-600 mb-2" />
                      <div className="font-bold text-sm text-slate-800">Complete Offline Blueprint PDF Ready</div>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm">
                        Click download below to save the complete day-by-day itinerary with timings, maps, and hotel links.
                      </p>
                      <button 
                        className="btn-pdf-download-large mt-3"
                        onClick={handleDownloadPDF}
                      >
                        <Download size={16} />
                        <span>Download Itinerary (PDF)</span>
                      </button>
                    </div>
                  )}

                  {/* Full Itinerary On-Screen Toggle */}
                  <div className="pdf-toggle-full-wrap">
                    <button 
                      className="btn-toggle-schedule"
                      onClick={() => setShowFullSchedule(!showFullSchedule)}
                    >
                      <span>{showFullSchedule ? "Hide On-Screen Schedule" : "Or View Full Day-by-Day Details On-Screen"}</span>
                      {showFullSchedule ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {showFullSchedule && (
                      <div className="unlocked-schedule-dropdown animate-slide-down">
                        {itinerary.days.map((day, idx) => {
                          const isOpen = openDayIndex === idx;
                          return (
                            <div key={day.dayNumber} className={`schedule-day-box ${isOpen ? 'open' : ''}`}>
                              <div 
                                className="schedule-day-header"
                                onClick={() => setOpenDayIndex(isOpen ? null : idx)}
                              >
                                <span className="day-tag">Day {day.dayNumber}</span>
                                <h5 className="day-h">{day.title}</h5>
                                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </div>

                              {isOpen && (
                                <div className="schedule-day-body animate-slide-down">
                                  <div className="part morning">
                                    <span className="lbl">🌅 Morning:</span>
                                    <p>{day.morning}</p>
                                  </div>
                                  <div className="part afternoon">
                                    <span className="lbl">☀️ Afternoon:</span>
                                    <p>{day.afternoon}</p>
                                  </div>
                                  <div className="part evening">
                                    <span className="lbl">🌙 Evening:</span>
                                    <p>{day.evening}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
