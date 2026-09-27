import React, { useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Heart, ArrowRight, Clock, 
  Search, RotateCcw, Star, ShieldCheck, MapPin, Users
} from 'lucide-react';
import type { Itinerary, Destination } from '../types';

export interface SearchFilterState {
  isSearchActive: boolean;
  query: string;
  destination: string;
  duration: string;
  travellers: string;
}

interface PopularDestinationsProps {
  destinations: Itinerary[];
  destinationsMaster?: Destination[];
  savedIds: string[];
  searchFilter: SearchFilterState;
  isViewingAll: boolean;
  onClearSearch: () => void;
  onRemoveFilter: (filterKey: 'query' | 'destination' | 'duration' | 'travellers') => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelectDestination: (destinationName: string) => void;
  onSelectItinerary: (itinerary: Itinerary) => void;
  onBuyItinerary: (itinerary: Itinerary) => void;
  onViewAll: () => void;
  onBackToPopular: () => void;
}

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({
  destinations,
  destinationsMaster,
  savedIds,
  searchFilter,
  isViewingAll,
  onClearSearch,
  onRemoveFilter,
  onToggleSave,
  onSelectDestination,
  onSelectItinerary,
  onBuyItinerary,
  onViewAll,
  onBackToPopular
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getDurationLabel = (val: string) => {
    switch (val) {
      case '1-3': return '1-3 Days (Weekend)';
      case '4-6': return '4-6 Days (Short Trip)';
      case '7-10': return '7-10 Days (Standard)';
      case '10+': return '10+ Days (Extended)';
      default: return val;
    }
  };

  const getTravellerLabel = (val: string) => {
    switch (val) {
      case 'Solo': return 'Solo Traveler';
      case 'Couple': return 'Couple / Honeymoon';
      case 'Family': return 'Family with Kids';
      case 'Group': return 'Group / Friends';
      default: return val;
    }
  };

  const isGridMode = searchFilter.isSearchActive || isViewingAll;

  // Compute title
  let sectionTitle = 'Popular Destinations';
  let sectionSubtitle = 'Explore handcrafted holiday packages & curated day-by-day travel itineraries';

  if (searchFilter.isSearchActive) {
    if (searchFilter.destination) {
      sectionTitle = `Verified Itineraries for ${searchFilter.destination}`;
    } else if (searchFilter.query) {
      sectionTitle = `Search Results for "${searchFilter.query}"`;
    } else {
      sectionTitle = 'Filtered Itinerary Results';
    }
    sectionSubtitle = `Found ${destinations.length} verified ${destinations.length === 1 ? 'travel blueprint' : 'travel blueprints'} matching your criteria`;
  } else if (isViewingAll) {
    sectionTitle = `All Curated Travel Itineraries (${destinations.length})`;
    sectionSubtitle = 'Browse complete verified travel blueprints from certified agents across India & worldwide';
  }

  return (
    <section className="destinations-section" id="destinations">
      <div className="section-container">
        {/* Section Header */}
        <div className="search-results-header">
          <div>
            <div className="search-title-wrap">
              <h2 className="section-heading">{sectionTitle}</h2>
              {searchFilter.isSearchActive && (
                <span className="search-count-badge">
                  {destinations.length} available
                </span>
              )}
            </div>
            <p className="section-subheading">{sectionSubtitle}</p>
          </div>

          <div className="search-header-actions">
            {searchFilter.isSearchActive ? (
              <button 
                className="btn-reset-search"
                onClick={onClearSearch}
                title="Reset search and return to popular destinations"
              >
                <RotateCcw size={15} />
                <span>Reset Search</span>
              </button>
            ) : isViewingAll ? (
              <button 
                className="btn-reset-search"
                onClick={onBackToPopular}
              >
                <RotateCcw size={15} />
                <span>Back to Popular</span>
              </button>
            ) : (
              <button className="view-all-link" onClick={onViewAll}>
                <span>View All ({destinations.length}+)</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {searchFilter.isSearchActive && (
          <div className="search-filter-pills-bar">
            <div className="search-pills-left">
              <span className="search-pill-label">Active Filters:</span>
              
              {searchFilter.query && (
                <span className="search-pill-item">
                  <Search size={13} className="pill-icon-svg" />
                  <span>"{searchFilter.query}"</span>
                  <button onClick={() => onRemoveFilter('query')} className="search-pill-remove" title="Remove query filter">×</button>
                </span>
              )}

              {searchFilter.destination && (
                <span className="search-pill-item">
                  <MapPin size={13} className="pill-icon-svg" />
                  <span>Destination: {searchFilter.destination}</span>
                  <button onClick={() => onRemoveFilter('destination')} className="search-pill-remove" title="Remove destination filter">×</button>
                </span>
              )}

              {searchFilter.duration && (
                <span className="search-pill-item">
                  <Clock size={13} className="pill-icon-svg" />
                  <span>Duration: {getDurationLabel(searchFilter.duration)}</span>
                  <button onClick={() => onRemoveFilter('duration')} className="search-pill-remove" title="Remove duration filter">×</button>
                </span>
              )}

              {searchFilter.travellers && (
                <span className="search-pill-item">
                  <Users size={13} className="pill-icon-svg" />
                  <span>Travellers: {getTravellerLabel(searchFilter.travellers)}</span>
                  <button onClick={() => onRemoveFilter('travellers')} className="search-pill-remove" title="Remove travellers filter">×</button>
                </span>
              )}
            </div>

            <button 
              onClick={onClearSearch}
              className="search-clear-all-btn"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* ─── CASE 1: EMPTY STATE ─── */}
        {searchFilter.isSearchActive && destinations.length === 0 ? (
          <div className="search-empty-state">
            <div className="empty-icon-circle">
              <Search size={28} />
            </div>
            <h3 className="empty-title">No Verified Itineraries Found</h3>
            <p className="empty-desc">
              We couldn't find any itineraries matching your exact filters. Try broadening your duration or traveler type, or explore our full collection of curated packages.
            </p>
            <div className="empty-btn-group">
              <button 
                onClick={onClearSearch}
                className="btn-empty-primary"
              >
                Reset Search Filters
              </button>
              <button 
                onClick={onViewAll}
                className="btn-empty-secondary"
              >
                Browse All 32 Blueprints
              </button>
            </div>
          </div>
        ) : isGridMode ? (
          /* ─── CASE 2: SEARCH RESULTS GRID ─── */
          <div className="search-results-grid">
            {destinations.map((itinerary) => {
              const destSlug = `dest-${itinerary.destination.toLowerCase().replace(/\s+/g, '-')}`;
              const isSaved = savedIds.includes(itinerary.id) || 
                              savedIds.includes(destSlug) || 
                              savedIds.some(sid => sid.toLowerCase() === itinerary.destination.toLowerCase());

              return (
                <div 
                  key={itinerary.id} 
                  className="pkg-card"
                >
                  {/* Card Media Header */}
                  <div className="pkg-card-media">
                    <img 
                      src={itinerary.coverImage} 
                      alt={itinerary.title} 
                      className="pkg-card-img"
                      loading="lazy"
                    />
                    <div className="pkg-card-overlay"></div>

                    {isSaved && (
                      <span className="saved-corner-pill">
                        <Heart size={11} fill="#EF4444" stroke="#EF4444" />
                        <span>Saved</span>
                      </span>
                    )}

                    {/* Top Badges */}
                    <div className="pkg-top-badges">
                      <span className="pkg-badge-duration">
                        <Clock size={12} />
                        <span>{itinerary.durationDays}D / {itinerary.durationNights}N</span>
                      </span>

                      {itinerary.travelerType && (
                        <span className="pkg-badge-traveler">
                          <Users size={12} />
                          <span>{itinerary.travelerType}</span>
                        </span>
                      )}
                    </div>

                    {/* Wishlist Heart Toggle */}
                    <button 
                      className={`pkg-heart-btn ${isSaved ? 'saved' : ''}`}
                      onClick={(e) => {
                        const activeId = isSaved 
                          ? ([itinerary.id, destSlug, itinerary.destination.toLowerCase()].find(cid => savedIds.includes(cid)) || itinerary.id)
                          : itinerary.id;
                        onToggleSave(activeId, e);
                      }}
                      title={isSaved ? 'Remove from Saved' : 'Save Itinerary'}
                      aria-label="Save to favorites"
                    >
                      <Heart 
                        size={17} 
                        fill={isSaved ? '#EF4444' : 'none'} 
                        stroke={isSaved ? '#EF4444' : '#FFFFFF'} 
                      />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="pkg-card-body">
                    {/* Location & Star Rating */}
                    <div className="pkg-location-row">
                      <div className="pkg-dest-text">
                        <MapPin size={13} className="text-blue-500" />
                        <span>{itinerary.destination}, {itinerary.country}</span>
                      </div>
                      <div className="pkg-rating-pill">
                        <Star size={13} fill="#F59E0B" stroke="#F59E0B" />
                        <span className="pkg-rating-num">{itinerary.rating || 4.9}</span>
                        <span className="pkg-rating-count">({itinerary.reviewCount || 120})</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 
                      className="pkg-title"
                      onClick={() => onSelectItinerary(itinerary)}
                      title={itinerary.title}
                    >
                      {itinerary.title}
                    </h3>

                    {/* Overview text */}
                    <p className="pkg-overview">
                      {itinerary.overview}
                    </p>

                    {/* Verified Travel Agent Trust Strip */}
                    <div className="pkg-agent-strip">
                      <ShieldCheck size={14} className="pkg-agent-shield" />
                      <span className="pkg-agent-name">Verified Agent • {itinerary.agent?.agencyName || 'Certified Travel Partner'}</span>
                    </div>

                    {/* Card Footer: Price & Actions */}
                    <div className="pkg-card-footer">
                      <div className="pkg-price-col">
                        <span className="pkg-price-sub">Verified Blueprint</span>
                        <div className="pkg-price-main-row">
                          <span className="pkg-price-amt">₹{itinerary.accessPrice || 99}</span>
                          <span className="pkg-price-tag">Instant PDF</span>
                        </div>
                      </div>

                      <div className="pkg-actions-col">
                        <button 
                          className="btn-pkg-details"
                          onClick={() => onSelectItinerary(itinerary)}
                          title="View detailed daily blueprint and hotel recommendations"
                        >
                          View Details
                        </button>
                        <button 
                          className="btn-pkg-buy"
                          onClick={() => onBuyItinerary(itinerary)}
                          title="Instant buy for ₹99"
                        >
                          Buy ₹{itinerary.accessPrice || 99}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ─── CASE 3: DEFAULT POPULAR DESTINATIONS CAROUSEL ─── */
          <div className="carousel-wrapper">
            {/* Left Arrow */}
            <button 
              className="carousel-nav-btn prev-btn shadow-md" 
              onClick={() => handleScroll('left')}
              aria-label="Previous Destinations"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Cards Track */}
            <div className="destinations-track" ref={scrollRef}>
              {((destinationsMaster && destinationsMaster.length > 0)
                ? destinationsMaster.map((masterDest) => {
                    const matchingItineraries = destinations.filter(
                      it => it.destination.toLowerCase() === masterDest.name.toLowerCase()
                    );
                    const primaryIt = matchingItineraries[0];
                    const destSlug = `dest-${masterDest.name.toLowerCase().replace(/\s+/g, '-')}`;
                    const targetId = primaryIt ? primaryIt.id : (masterDest.id || destSlug);
                    const candidateIds = [
                      targetId,
                      masterDest.id,
                      destSlug,
                      masterDest.name.toLowerCase(),
                      ...(primaryIt ? [primaryIt.id] : []),
                      ...matchingItineraries.map(it => it.id)
                    ].filter(Boolean) as string[];

                    return {
                      id: targetId,
                      destination: masterDest.name,
                      country: masterDest.country,
                      region: masterDest.region,
                      coverImage: masterDest.cover_image || masterDest.coverImage || primaryIt?.coverImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
                      durationLabel: primaryIt ? `${primaryIt.durationDays}D / ${primaryIt.durationNights}N` : `${masterDest.region || 'Curated'} Tour`,
                      accessPrice: masterDest.starting_price || masterDest.startingPrice || primaryIt?.accessPrice || 99,
                      itineraryCount: matchingItineraries.length || masterDest.itinerary_count || 1,
                      tagline: masterDest.tagline || (matchingItineraries.length > 0 ? `${matchingItineraries.length} Verified Blueprints` : 'Handcrafted Holiday Packages'),
                      candidateIds
                    };
                  })
                : destinations.map((dest) => {
                    const destSlug = `dest-${dest.destination.toLowerCase().replace(/\s+/g, '-')}`;
                    return {
                      id: dest.id,
                      destination: dest.destination,
                      country: dest.country,
                      region: dest.region,
                      coverImage: dest.coverImage,
                      durationLabel: `${dest.durationDays}D / ${dest.durationNights}N`,
                      accessPrice: dest.accessPrice,
                      itineraryCount: 1,
                      tagline: 'Handcrafted Holiday Packages',
                      candidateIds: [dest.id, destSlug, dest.destination.toLowerCase()]
                    };
                  })
              ).map((dest) => {
                const isSaved = dest.candidateIds.some((cid: string) => savedIds.includes(cid));
                return (
                  <div 
                    key={dest.id} 
                    className="destination-card shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => onSelectDestination(dest.destination)}
                    title={`View available holiday packages for ${dest.destination}`}
                  >
                    <div className="card-media-wrapper">
                      <img 
                        src={dest.coverImage} 
                        alt={dest.destination} 
                        className="card-cover-img"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="card-media-gradient"></div>

                      {isSaved && (
                        <span className="saved-corner-pill">
                          <Heart size={11} fill="#EF4444" stroke="#EF4444" />
                          <span>Saved</span>
                        </span>
                      )}

                      <div className="card-duration-tag">
                        <Clock size={12} />
                        <span>{dest.durationLabel}</span>
                      </div>

                      <button 
                        className={`card-heart-btn ${isSaved ? 'saved' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          const activeId = dest.candidateIds.find((cid: string) => savedIds.includes(cid)) || dest.id;
                          onToggleSave(activeId, e);
                        }}
                        title={isSaved ? 'Remove from Saved' : 'Save Destination'}
                        aria-label="Save to favorites"
                      >
                        <Heart 
                          size={17} 
                          fill={isSaved ? '#EF4444' : 'none'} 
                          stroke={isSaved ? '#EF4444' : '#FFFFFF'} 
                        />
                      </button>
                    </div>

                    <div className="card-info-footer">
                      <div className="card-text-col">
                        <div className="flex items-center justify-between">
                          <h3 className="card-dest-title">{dest.destination}</h3>
                          <span className="card-price-badge">From ₹{dest.accessPrice}</span>
                        </div>
                        
                        <div className="card-package-badge-row">
                          <span className="card-package-count">{dest.tagline}</span>
                        </div>

                        <div className="card-action-cue">
                          <span>Click to explore {dest.itineraryCount > 0 ? `${dest.itineraryCount} verified blueprints` : 'packages'} →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Arrow */}
            <button 
              className="carousel-nav-btn next-btn shadow-md" 
              onClick={() => handleScroll('right')}
              aria-label="Next Destinations"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
