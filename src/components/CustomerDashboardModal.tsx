import React, { useState } from 'react';
import { X, Briefcase, Heart, FileText, User, Download, MessageCircle, Phone, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { UserProfile, Itinerary } from '../types';
import { generateItineraryPDF } from '../utils/pdfGenerator';

interface CustomerDashboardModalProps {
  user: UserProfile;
  allItineraries: Itinerary[];
  initialTab?: 'trips' | 'saved' | 'orders' | 'profile';
  onClose: () => void;
  onSelectItinerary: (itinerary: Itinerary) => void;
  onRemoveSaved: (id: string) => void;
  onUpdatePreferences: (type: string, budget: string) => void;
  onOpenAuth?: (mode?: 'login' | 'signup', role?: 'customer' | 'admin') => void;
}

export const CustomerDashboardModal: React.FC<CustomerDashboardModalProps> = ({
  user,
  allItineraries,
  initialTab = 'trips',
  onClose,
  onSelectItinerary,
  onRemoveSaved,
  onUpdatePreferences,
  onOpenAuth
}) => {
  const [activeTab, setActiveTab] = useState<'trips' | 'saved' | 'orders' | 'profile'>(initialTab);
  const [travelType, setTravelType] = useState(user.preferredTravelType || 'Couple');
  const [budgetTier, setBudgetTier] = useState(user.preferredBudgetTier || 'Comfort');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Match direct itinerary IDs, destination slugs ('dest-bali'), or destination names ('bali')
  const savedItineraries = allItineraries.filter(it => {
    const destSlug = `dest-${it.destination.toLowerCase().replace(/\s+/g, '-')}`;
    return (
      user.savedItineraryIds.includes(it.id) ||
      user.savedItineraryIds.includes(destSlug) ||
      user.savedItineraryIds.some(sid => 
        sid.toLowerCase() === it.destination.toLowerCase() ||
        sid.toLowerCase() === it.id.toLowerCase()
      )
    );
  });

  const handleSavePref = async (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePreferences(travelType, budgetTier);
    try {
      await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          fullName: user.fullName,
          mobile: user.mobile,
          preferredTravelType: travelType,
          preferredBudgetTier: budgetTier
        })
      });
    } catch (err) {
      console.warn('Preferences sync notice:', err);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-container dashboard-modal shadow-2xl animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close dashboard">
          <X size={20} />
        </button>

        {/* Top Header */}
        <div className="dashboard-header-bar">
          <div className="dash-user-identity">
            <div className="dash-avatar-circle">
              {(user.fullName || 'Guest').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="dash-user-name">{user.fullName || 'Guest Traveler'}</h2>
              <p className="dash-user-contact">
                {user.email ? `${user.email}${user.mobile ? ` • ${user.mobile}` : ''}` : 'Guest Session (Saved on this device)'}
              </p>
            </div>
          </div>

          {/* Metric Overview Cards from PRD Section 6.3 */}
          <div className="dash-metrics-ribbon">
            <div className="metric-pill">
              <span className="pill-n">{user.purchasedOrders.length}</span>
              <span className="pill-l">Purchased Blueprints</span>
            </div>
            <div className="metric-pill">
              <span className="pill-n">{user.savedItineraryIds.length}</span>
              <span className="pill-l">Saved Destinations</span>
            </div>
            <div className="metric-pill">
              <span className="pill-n">₹{(user.purchasedOrders.length * 99).toFixed(2)}</span>
              <span className="pill-l">Total Invested</span>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="dashboard-tabs-bar">
          <button 
            className={`dash-tab ${activeTab === 'trips' ? 'active' : ''}`}
            onClick={() => setActiveTab('trips')}
          >
            <Briefcase size={16} /> My Trips ({user.purchasedOrders.length})
          </button>
          <button 
            className={`dash-tab ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <Heart size={16} /> Saved Wishlist ({user.savedItineraryIds.length})
          </button>
          <button 
            className={`dash-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FileText size={16} /> Orders & Invoices
          </button>
          <button 
            className={`dash-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} /> Preferences
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content-area">
          {/* TAB 1: MY TRIPS */}
          {activeTab === 'trips' && (
            <div className="my-trips-pane">
              {user.purchasedOrders.length === 0 ? (
                <div className="empty-state-box">
                  <Briefcase size={40} className="text-slate-300 mb-3" />
                  <h4>No Purchased Trips Yet</h4>
                  <p>Browse our verified itineraries for Dubai, Maldives, Singapore and more starting at just ₹99 to unlock complete day-by-day blueprints.</p>
                </div>
              ) : (
                <div className="purchased-trips-list">
                  {user.purchasedOrders.map((order) => {
                    const it = allItineraries.find(i => i.id === order.itineraryId);
                    if (!it) return null;

                    const waEncodedMsg = encodeURIComponent(
                      `Hi ${order.agentName}, I purchased your ${order.destination} Itinerary on V3Itinerary (Order #${order.orderId}). I'd like to talk about package booking.`
                    );
                    const cleanPhone = order.agentWhatsapp.replace(/[^0-9]/g, '');

                    return (
                      <div key={order.orderId} className="purchased-trip-card shadow-sm">
                        <img src={it.coverImage} alt={order.destination} className="trip-thumb" />
                        <div className="trip-main-info">
                          <div className="trip-badges-line">
                            <span className="badge-tag">{order.destination}</span>
                            <span className="badge-ref font-mono">Order #{order.orderId}</span>
                            <span className="badge-date">{order.date}</span>
                          </div>
                          <h4 className="trip-title" onClick={() => onSelectItinerary(it)}>
                            {order.itineraryTitle}
                          </h4>
                          <div className="trip-agent-line">
                            <ShieldCheck size={14} className="text-emerald-600" />
                            <span>Verified Agent: <strong>{order.agentName}</strong></span>
                          </div>
                        </div>

                        <div className="trip-actions-col">
                          <button 
                            className="btn-download-sm" 
                            onClick={() => generateItineraryPDF(it, order, user.fullName)}
                          >
                            <Download size={14} /> Download PDF
                          </button>
                          <a 
                            href={`https://wa.me/${cleanPhone}?text=${waEncodedMsg}`}
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn-wa-sm"
                          >
                            <MessageCircle size={14} /> WhatsApp
                          </a>
                          <a 
                            href={`tel:${order.agentPhone}`} 
                            className="btn-call-sm"
                          >
                            <Phone size={14} /> Call
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVED WISHLIST */}
          {activeTab === 'saved' && (
            <div className="saved-wishlist-pane">
              {/* Guest cloud sync notification */}
              {!user.isLoggedIn && (
                <div className="guest-wishlist-cloud-banner">
                  <div className="guest-cloud-left">
                    <span className="guest-cloud-icon">☁️</span>
                    <div>
                      <h5 className="font-bold text-sm text-slate-800">Sync with MySQL Database & Cloud</h5>
                      <p className="text-xs text-slate-600">You are currently in guest mode. Log in or create an account to permanently sync these saved items to phpMyAdmin database.</p>
                    </div>
                  </div>
                  {onOpenAuth && (
                    <button 
                      className="btn-guest-sync-auth"
                      onClick={() => {
                        onClose();
                        onOpenAuth('login', 'customer');
                      }}
                    >
                      Log In / Register
                    </button>
                  )}
                </div>
              )}

              {savedItineraries.length === 0 ? (
                <div className="empty-state-box">
                  <div className="empty-heart-circle">
                    <Heart size={44} className="text-rose-400" />
                  </div>
                  <h4>Your Wishlist is Empty</h4>
                  <p>Click the heart icon on any destination or package card to bookmark itineraries for future reference.</p>
                  <button 
                    className="btn-browse-destinations"
                    onClick={onClose}
                  >
                    Explore Destinations Now
                  </button>
                </div>
              ) : (
                <div className="saved-grid">
                  {savedItineraries.map((it) => (
                    <div key={it.id} className="saved-item-card shadow-sm hover:shadow-md transition-all">
                      <div className="saved-item-img-wrap">
                        <img src={it.coverImage} alt={it.destination} className="saved-item-img" />
                        <span className="saved-badge-tag">
                          <Heart size={11} fill="#EF4444" stroke="#EF4444" /> Saved
                        </span>
                      </div>
                      <div className="saved-item-details">
                        <div className="flex-between">
                          <span className="saved-dest-pill">{it.destination}</span>
                          <span className="saved-price-pill">From ₹{it.accessPrice || 99}</span>
                        </div>
                        <h4 className="saved-title" onClick={() => onSelectItinerary(it)} title="Click to view details">
                          {it.title}
                        </h4>
                        <div className="saved-card-footer">
                          <button className="btn-view-it" onClick={() => onSelectItinerary(it)}>
                            View Blueprint
                          </button>
                          <button 
                            className="btn-delete-saved" 
                            onClick={() => onRemoveSaved(it.id)}
                            title="Remove from saved wishlist"
                          >
                            <Trash2 size={16} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDERS & INVOICES */}
          {activeTab === 'orders' && (
            <div className="orders-invoices-pane">
              {/* DESKTOP TABLE VIEW */}
              <div className="invoices-table-container">
                <table className="invoices-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Itinerary</th>
                      <th>Base Fee</th>
                      <th>GST (18%)</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.purchasedOrders.map((order) => {
                      const it = allItineraries.find(i => i.id === order.itineraryId);
                      return (
                        <tr key={order.orderId}>
                          <td className="font-mono text-xs">{order.orderId}</td>
                          <td>{order.date}</td>
                          <td>{order.destination} Blueprint</td>
                          <td>₹99.00</td>
                          <td>₹0.00</td>
                          <td className="font-bold">₹99.00</td>
                          <td><span className="status-badge success">COMPLETED</span></td>
                          <td>
                            {it && (
                              <button 
                                className="btn-table-download"
                                onClick={() => generateItineraryPDF(it, order, user.fullName)}
                              >
                                <Download size={13} /> PDF
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS VIEW */}
              <div className="invoices-mobile-cards">
                {user.purchasedOrders.length === 0 ? (
                  <div className="empty-state-box">
                    <FileText size={40} className="text-slate-300 mb-3" />
                    <h4>No Orders Found</h4>
                    <p>Your unlocked travel blueprints and tax invoices will appear here.</p>
                  </div>
                ) : (
                  user.purchasedOrders.map((order) => {
                    const it = allItineraries.find(i => i.id === order.itineraryId);
                    return (
                      <div key={order.orderId} className="invoice-mobile-card">
                        <div className="inv-card-header">
                          <div className="flex items-center gap-2">
                            <span className="inv-badge-paid">✓ COMPLETED</span>
                            <span className="inv-order-ref">#{order.orderId}</span>
                          </div>
                          <span className="inv-date">{order.date}</span>
                        </div>

                        <div className="inv-card-body">
                          <h4 className="inv-item-title">{order.itineraryTitle}</h4>
                          <div className="inv-dest-tag">{order.destination} Blueprint</div>

                          <div className="inv-price-breakdown">
                            <div className="inv-price-item">
                              <span className="inv-price-label">Base Fee</span>
                              <span className="inv-price-val">₹99.00</span>
                            </div>
                            <div className="inv-price-item">
                              <span className="inv-price-label">GST (Taxes)</span>
                              <span className="inv-price-val">₹0.00 (All Inc.)</span>
                            </div>
                            <div className="inv-price-item total">
                              <span className="inv-price-label font-bold">Total Paid</span>
                              <span className="inv-price-val highlight">₹99.00</span>
                            </div>
                          </div>
                        </div>

                        {it && (
                          <div className="inv-card-footer">
                            <button 
                              className="btn-inv-download"
                              onClick={() => generateItineraryPDF(it, order, user.fullName)}
                            >
                              <Download size={14} />
                              <span>Download Invoice & Guide (PDF)</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PREFERENCES */}
          {activeTab === 'profile' && (
            <div className="profile-preferences-pane">
              <form className="preferences-form" onSubmit={handleSavePref}>
                <h4 className="pref-heading">Traveler Profile & Customization Preferences</h4>
                <p className="pref-sub">Help our verified agents tailor on-ground quotes to your exact travel style.</p>

                <div className="form-group-row">
                  <div className="form-field">
                    <label className="input-lbl">Preferred Travel Style</label>
                    <select 
                      value={travelType} 
                      onChange={(e) => setTravelType(e.target.value)}
                      className="dash-select"
                    >
                      <option value="Solo">Solo Backpacker</option>
                      <option value="Couple">Couple / Romantic Honeymoon</option>
                      <option value="Family">Family with Children</option>
                      <option value="Group">Group of Friends / Adventure</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="input-lbl">Preferred Hotel Budget Tier</label>
                    <select 
                      value={budgetTier} 
                      onChange={(e) => setBudgetTier(e.target.value)}
                      className="dash-select"
                    >
                      <option value="Budget">Budget Friendly (3-Star Boutique)</option>
                      <option value="Comfort">Comfort & Style (4-Star Premium)</option>
                      <option value="Luxury">Luxury Escapes (5-Star Heritage & Resorts)</option>
                    </select>
                  </div>
                </div>

                <div className="pref-actions-row">
                  <button type="submit" className="btn-save-pref">
                    Save Traveler Preferences
                  </button>
                  {savedSuccess && (
                    <span className="pref-saved-msg">
                      <CheckCircle2 size={16} /> Preferences successfully updated!
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
