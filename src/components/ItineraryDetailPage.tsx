import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Clock, Users, Heart, Star,
  ShieldCheck, Download, CheckCircle2,
  Calendar, CreditCard, ChevronDown, ChevronUp, FileText,
  MapPin, Phone, MessageCircle, Mail, DollarSign, Hotel, Sparkles, Share2
} from 'lucide-react';
import type { Itinerary, OrderRecord } from '../types';
import { generateItineraryPDF, createItineraryPDFBlobUrl } from '../utils/pdfGenerator';

interface ItineraryDetailPageProps {
  itinerary: Itinerary;
  onClose: () => void;
  onBuy: (itinerary: Itinerary) => void;
  isSaved: boolean;
  onToggleSave: (id: string, e?: React.MouseEvent) => void;
  isPurchased: boolean;
  order?: OrderRecord | null;
  customerName?: string;
  customerEmail?: string;
  onBackToDestinations?: () => void;
}

export const ItineraryDetailPage: React.FC<ItineraryDetailPageProps> = ({
  itinerary,
  onClose,
  onBuy,
  isSaved,
  onToggleSave,
  isPurchased,
  order,
  customerName = 'Valued Traveler',
  customerEmail = 'rahul.sharma@example.com',
  onBackToDestinations
}) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(true);
  const [openDayIndex, setOpenDayIndex] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  // Generate PDF preview blob URL whenever purchased
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [itinerary.id]);

  useEffect(() => {
    if (isPurchased && itinerary) {
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

  const handleDownloadPDF = () => {
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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="itinerary-detail-page animate-fade-in">
      {/* 1. TOP BREADCRUMB & ACTION STRIP */}
      <div className="itinerary-top-strip">
        <div className="itinerary-top-inner">
          <div className="flex items-center gap-3">
            <button 
              className="itinerary-back-btn" 
              onClick={onBackToDestinations || onClose}
              title="Go back"
            >
              <ArrowLeft size={16} />
              <span>Back to {itinerary.destination} Packages</span>
            </button>
            <div className="breadcrumb-trail hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <span>Home</span>
              <span>/</span>
              <span>Destinations</span>
              <span>/</span>
              <span>{itinerary.destination}</span>
              <span>/</span>
              <span className="text-slate-800 font-medium truncate max-w-xs">{itinerary.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              className="btn-strip-action"
              onClick={handleShare}
              title="Share Link"
            >
              <Share2 size={15} />
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>
            <button 
              className={`btn-strip-action ${isSaved ? 'text-rose-600 font-semibold' : ''}`}
              onClick={(e) => onToggleSave(itinerary.id, e)}
              title={isSaved ? "Saved to Wishlist" : "Save to Wishlist"}
            >
              <Heart size={15} fill={isSaved ? '#EF4444' : 'none'} stroke={isSaved ? '#EF4444' : 'currentColor'} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN PAGE BODY CONTAINER (2 COLUMNS) */}
      <div className="itinerary-page-container">
        <div className="itinerary-page-grid">
          
          {/* =========================================================================
              LEFT COLUMN (WIDE): Hero Media, Synopsis, Days Schedule, Hotels & Agent
              ========================================================================= */}
          <div className="itinerary-main-col">
            {/* Hero Visual Card */}
            <div className="itinerary-hero-media-box shadow-sm">
              <img 
                src={itinerary.coverImage} 
                alt={itinerary.title}
                className="itinerary-hero-cover-img"
              />
              <div className="itinerary-hero-overlay"></div>

              {/* Floating Badges */}
              <div className="itinerary-hero-badges-row">
                <span className="hero-badge duration">
                  <Clock size={13} />
                  <span>{itinerary.durationDays} Days / {itinerary.durationNights} Nights</span>
                </span>
                <span className="hero-badge category">
                  <Users size={13} />
                  <span>{itinerary.travelerType} Special</span>
                </span>
                <span className="hero-badge destination">
                  <MapPin size={13} />
                  <span>{itinerary.destination}, {itinerary.country}</span>
                </span>
              </div>
            </div>

            {/* Title & Overview Card */}
            <div className="itinerary-content-card shadow-sm">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                  {itinerary.destination} Verified Itinerary Blueprint
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  <Star size={14} fill="#F59E0B" stroke="#F59E0B" />
                  <span className="font-bold text-slate-900">{itinerary.rating}</span>
                  <span>({itinerary.reviewCount} verified travelers)</span>
                </div>
              </div>

              <h1 className="itinerary-page-main-title">{itinerary.title}</h1>

              <p className="itinerary-page-overview-p">{itinerary.overview}</p>

              {/* Highlights Chips */}
              <div className="itinerary-highlights-strip">
                <h4 className="highlights-label">Included Sights & Key Highlights:</h4>
                <div className="highlights-chips-grid">
                  {itinerary.days.map((day, i) => (
                    <div key={i} className="highlight-chip">
                      <Sparkles size={13} className="text-blue-600 shrink-0 mt-0.5" />
                      <span>{day.highlights[0] || day.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="itinerary-season-box">
                <Calendar size={15} className="text-blue-600 shrink-0" />
                <span className="text-xs text-slate-700">
                  Best time to visit: <strong>{itinerary.bestTimeToVisit}</strong>
                </span>
              </div>
            </div>

            {/* Day-by-Day Precision Schedule */}
            <div className="itinerary-content-card shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Day-by-Day Precision Travel Schedule</h3>
                  <p className="text-xs text-slate-500">Curated hour-by-hour routing, meal suggestions, and landmark navigation</p>
                </div>
                <button 
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  onClick={() => setShowFullSchedule(!showFullSchedule)}
                >
                  <span>{showFullSchedule ? "Collapse All" : "Expand All"}</span>
                  {showFullSchedule ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {showFullSchedule && (
                <div className="days-accordion-list mt-4 space-y-3">
                  {itinerary.days.map((day, idx) => {
                    const isOpen = openDayIndex === idx;
                    return (
                      <div key={day.dayNumber} className={`day-accordion-card ${isOpen ? 'is-open' : ''}`}>
                        <div 
                          className="day-accordion-header"
                          onClick={() => setOpenDayIndex(isOpen ? null : idx)}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="day-number-badge">Day {day.dayNumber}</span>
                            <h4 className="day-title-text">{day.title}</h4>
                          </div>
                          {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                        </div>

                        {isOpen && (
                          <div className="day-accordion-body animate-slide-down">
                            <div className="day-time-block morning">
                              <span className="time-badge">🌅 Morning</span>
                              <p className="time-desc">{day.morning}</p>
                            </div>
                            <div className="day-time-block afternoon">
                              <span className="time-badge">☀️ Afternoon</span>
                              <p className="time-desc">{day.afternoon}</p>
                            </div>
                            <div className="day-time-block evening">
                              <span className="time-badge">🌙 Evening</span>
                              <p className="time-desc">{day.evening}</p>
                            </div>

                            <div className="day-highlights-footer">
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Day Highlights:</span>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {day.highlights.map((h, hi) => (
                                  <span key={hi} className="day-h-pill">✓ {h}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tiered Accommodations Breakdown */}
            {itinerary.hotels && itinerary.hotels.length > 0 && (
              <div className="itinerary-content-card shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Hotel size={18} className="text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">Recommended Hotels & Stays</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {itinerary.hotels.map((h, i) => (
                    <div key={i} className="hotel-tier-box">
                      <span className={`hotel-tier-tag ${h.tier.toLowerCase()}`}>{h.tier} Tier</span>
                      <h4 className="hotel-name">{h.name}</h4>
                      <div className="hotel-price">{h.estPricePerNight} / night</div>
                      <div className="hotel-perks-list">
                        {h.perks.map((p, pi) => (
                          <span key={pi} className="hotel-perk-item">✓ {p}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estimated Budget Breakdown */}
            {itinerary.budgetBreakdown && (
              <div className="itinerary-content-card shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign size={18} className="text-emerald-600" />
                  <h3 className="text-lg font-bold text-slate-900">Estimated Trip Budget Breakdown</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                  <div className="budget-cell">
                    <span className="lbl">Flights</span>
                    <span className="val">₹{itinerary.budgetBreakdown.flights?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="budget-cell">
                    <span className="lbl">Hotel Stays</span>
                    <span className="val">₹{itinerary.budgetBreakdown.accommodation?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="budget-cell">
                    <span className="lbl">Food & Dining</span>
                    <span className="val">₹{itinerary.budgetBreakdown.foodDining?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="budget-cell">
                    <span className="lbl">Sightseeing</span>
                    <span className="val">₹{itinerary.budgetBreakdown.activitiesSightseeing?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="budget-cell">
                    <span className="lbl">Local Transit</span>
                    <span className="val">₹{itinerary.budgetBreakdown.localTransport?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Verified Agent Card */}
            {itinerary.agent && (
              <div className="itinerary-content-card agent-showcase-box shadow-sm">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <img 
                      src={itinerary.agent.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                      alt={itinerary.agent.founderName} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 text-sm">{itinerary.agent.agencyName}</h4>
                        <span className="badge-verified-inline text-[11px]"><ShieldCheck size={13} /> Verified</span>
                      </div>
                      <p className="text-xs text-slate-500">Founder: {itinerary.agent.founderName} • GSTIN: <span className="font-mono font-medium text-slate-700">{itinerary.agent.gstNumber}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {itinerary.agent.phone && (
                      <a href={`tel:${itinerary.agent.phone}`} className="btn-agent-contact phone">
                        <Phone size={13} />
                        <span>Call</span>
                      </a>
                    )}
                    {itinerary.agent.whatsapp && (
                      <a href={`https://wa.me/${itinerary.agent.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-agent-contact whatsapp">
                        <MessageCircle size={13} />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    {itinerary.agent.email && (
                      <a href={`mailto:${itinerary.agent.email}`} className="btn-agent-contact email">
                        <Mail size={13} />
                        <span>Email</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="itinerary-content-card shadow-sm">
                <h4 className="font-bold text-sm text-slate-900 mb-2 text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 size={16} /> Included in this Blueprint
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {itinerary.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="itinerary-content-card shadow-sm">
                <h4 className="font-bold text-sm text-slate-900 mb-2 text-slate-500">
                  Excluded (Booked Separately)
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {itinerary.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-slate-400 font-bold">•</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN (STICKY SIDEBAR): Checkout Box & Unlocked PDF Viewer
              ========================================================================= */}
          <div className="itinerary-sidebar-col">
            <div className="sticky-sidebar-box">
              
              {!isPurchased ? (
                /* BEFORE PURCHASE: RAZORPAY CHECKOUT CARD */
                <div className="sidebar-checkout-card shadow-lg">
                  <div className="sidebar-badge-strip">
                    <span className="brand-pill">Razorpay Hosted Gateway</span>
                    <span className="sec-pill"><ShieldCheck size={12} /> 256-Bit SSL</span>
                  </div>

                  <div className="sidebar-price-block">
                    <span className="price-lbl">Complete Blueprint Access</span>
                    <div className="sidebar-active-price">
                      <span className="currency">₹</span>
                      <span className="amount">99</span>
                      <span className="unit">.00 flat</span>
                    </div>
                    <span className="price-sub">All taxes included • Instant PDF Delivery</span>
                  </div>

                  <div className="sidebar-features-list">
                    <div className="feat-item">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Instant Day-by-Day Schedule Unlock</span>
                    </div>
                    <div className="feat-item">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Downloadable Offline PDF Blueprint</span>
                    </div>
                    <div className="feat-item">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Direct WhatsApp with Verified Agent</span>
                    </div>
                    <div className="feat-item">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Direct PDF Dispatched to Your Gmail</span>
                    </div>
                  </div>

                  <button 
                    className="btn-pay-sidebar-main shadow-md hover:shadow-lg"
                    onClick={() => onBuy(itinerary)}
                    id="btn-sidebar-pay-razorpay"
                  >
                    <CreditCard size={18} />
                    <span>Pay ₹99 to Unlock Full Itinerary & PDF</span>
                  </button>

                  <p className="sidebar-note">
                    Supported: UPI (Google Pay, PhonePe, Paytm), All Credit/Debit Cards, NetBanking.
                  </p>
                </div>
              ) : (
                /* AFTER PURCHASE: PDF VIEWER & DOWNLOAD ACTIONS */
                <div className="sidebar-unlocked-card shadow-lg animate-fade-in">
                  <div className="unlocked-banner">
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="font-bold text-xs text-emerald-950">Blueprint Unlocked!</h4>
                      <p className="text-[11px] text-emerald-800">Emailed to {customerEmail}</p>
                    </div>
                  </div>

                  <div className="sidebar-pdf-preview-box">
                    <FileText size={36} className="text-blue-600 mb-2" />
                    <div className="font-bold text-xs text-slate-800 text-center">
                      {itinerary.destination}_Itinerary_Blueprint.pdf
                    </div>
                    <button 
                      className="btn-download-pdf-sidebar mt-3 shadow"
                      onClick={handleDownloadPDF}
                    >
                      <Download size={15} />
                      <span>Download Complete PDF</span>
                    </button>
                  </div>

                  {/* Embedded PDF iframe if available */}
                  {pdfBlobUrl && (
                    <div className="sidebar-pdf-embed-wrapper mt-3">
                      <iframe 
                        src={pdfBlobUrl} 
                        className="w-full h-80 rounded-lg border border-slate-200"
                        title={`${itinerary.destination} Itinerary PDF`}
                      />
                    </div>
                  )}

                  {itinerary.agent && (
                    <div className="agent-connect-card mt-3">
                      <div className="text-xs font-bold text-slate-800 mb-1">Direct Agent Assistance:</div>
                      <p className="text-[11px] text-slate-500 mb-2">Connect with {itinerary.agent.founderName} on WhatsApp for custom hotel or flight bookings.</p>
                      {itinerary.agent.whatsapp && (
                        <a 
                          href={`https://wa.me/${itinerary.agent.whatsapp.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-agent-whatsapp-sidebar"
                        >
                          <MessageCircle size={14} />
                          <span>Chat with Agent on WhatsApp</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Trust Badge Card */}
              <div className="sidebar-trust-assurance mt-4 shadow-sm">
                <ShieldCheck size={20} className="text-emerald-600 mb-1" />
                <div className="font-bold text-xs text-slate-800">100% Verified Platform Guarantee</div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                  All blueprints authored by GST-verified registered travel planners.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
