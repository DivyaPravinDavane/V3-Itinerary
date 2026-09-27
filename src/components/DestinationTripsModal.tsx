import React from 'react';
import { X, Clock, ShieldCheck, Star, ArrowRight, MapPin, Heart } from 'lucide-react';
import type { Itinerary } from '../types';

interface DestinationTripsModalProps {
  destinationName: string | null;
  allItineraries: Itinerary[];
  savedIds: string[];
  onClose: () => void;
  onSelectTrip: (itinerary: Itinerary) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
}

export const DestinationTripsModal: React.FC<DestinationTripsModalProps> = ({
  destinationName,
  allItineraries,
  savedIds,
  onClose,
  onSelectTrip,
  onToggleSave
}) => {
  if (!destinationName) return null;

  // Filter trips for this destination
  const trips = allItineraries.filter(
    it => it.destination.toLowerCase() === destinationName.toLowerCase()
  );

  const heroTrip = trips[0];

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-container dest-trips-modal shadow-2xl animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close trips list">
          <X size={20} />
        </button>

        {/* Destination Header Banner */}
        <div className="dest-trips-header">
          {heroTrip?.coverImage && (
            <img 
              src={heroTrip.coverImage} 
              alt={destinationName} 
              className="dest-trips-header-bg"
            />
          )}
          <div className="dest-trips-header-gradient" />
          <div className="dest-trips-header-info">
            <div className="dest-trips-badge">
              <MapPin size={14} />
              <span>{heroTrip?.country || 'Featured Destination'}</span>
            </div>
            <h2 className="dest-trips-title">{destinationName} Travel Blueprints</h2>
            <p className="dest-trips-sub">
              Compare verified local travel agencies, trip durations, and daily schedules
            </p>
          </div>
        </div>

        {/* Trips List */}
        <div className="dest-trips-body">
          <div className="dest-trips-count-bar">
            <span>Available Verified Itineraries ({trips.length})</span>
            <span className="text-xs text-slate-500">Instant digital access at ₹99 each</span>
          </div>

          <div className="dest-trips-grid">
            {trips.map((trip) => {
              const isSaved = savedIds.includes(trip.id);
              return (
                <div key={trip.id} className="trip-selection-card shadow-sm hover:shadow-md transition-all">
                  {/* Top Agency & Duration Bar */}
                  <div className="trip-card-top-bar">
                    <div className="trip-agent-badge">
                      <img 
                        src={trip.agent.avatarUrl} 
                        alt={trip.agent.founderName} 
                        className="trip-agent-thumb"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="trip-agency-name">{trip.agent.agencyName}</span>
                          <span className="agent-verified-mini" title="GST Registered & Verified">
                            <ShieldCheck size={13} className="text-blue-600" />
                          </span>
                        </div>
                        <span className="trip-agent-founder">Agent: {trip.agent.founderName} ({trip.agent.yearsInBusiness} yrs exp)</span>
                      </div>
                    </div>

                    <div className="trip-duration-chip">
                      <Clock size={13} />
                      <span>{trip.durationDays} Days / {trip.durationNights} Nights</span>
                    </div>
                  </div>

                  {/* Trip Title & Overview */}
                  <div className="trip-card-content">
                    <h3 className="trip-card-title">{trip.title}</h3>
                    <p className="trip-card-overview line-clamp-2">{trip.overview}</p>

                    {/* Highlights tags */}
                    <div className="trip-tags-row">
                      {trip.days.slice(0, 3).map((d, i) => (
                        <span key={i} className="trip-tag-pill">
                          Day {d.dayNumber}: {d.highlights[0] || d.title.substring(0, 20)}
                        </span>
                      ))}
                      {trip.days.length > 3 && (
                        <span className="trip-tag-pill more-tag">+{trip.days.length - 3} more days</span>
                      )}
                    </div>
                  </div>

                  {/* Trip Card Bottom: Rating, Budget, and Select Button */}
                  <div className="trip-card-bottom">
                    <div className="trip-meta-col">
                      <div className="flex items-center gap-2">
                        <div className="rating-pill-sm">
                          <Star size={13} fill="#F59E0B" stroke="#F59E0B" />
                          <span>{trip.rating}</span>
                        </div>
                        <span className="text-xs text-slate-500">({trip.reviewCount} reviews)</span>
                      </div>
                      <span className="trip-ground-est">
                        Est. Budget: <strong>₹{trip.estimatedTripCost.toLocaleString('en-IN')}</strong>
                      </span>
                    </div>

                    <div className="trip-actions-row">
                      <button 
                        className={`btn-save-sm ${isSaved ? 'saved' : ''}`}
                        onClick={(e) => onToggleSave(trip.id, e)}
                        title={isSaved ? "Saved to wishlist" : "Save itinerary"}
                      >
                        <Heart size={16} fill={isSaved ? '#EF4444' : 'none'} stroke={isSaved ? '#EF4444' : '#64748B'} />
                      </button>

                      <button 
                        className="btn-select-trip"
                        onClick={() => onSelectTrip(trip)}
                      >
                        <span>Select Trip & Details</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
