import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, Heart, ArrowRight, Compass, ShieldCheck, 
  Sparkles, CheckCircle2, ChevronRight, Home, Globe
} from 'lucide-react';
import type { Itinerary, Destination } from '../types';

interface DestinationsPageProps {
  destinationsMaster: Destination[];
  allItineraries: Itinerary[];
  savedIds: string[];
  onSelectDestination: (destinationName: string) => void;
  onSelectItinerary?: (itinerary: Itinerary) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onBackToHome: () => void;
}

interface DestinationCardData {
  id: string;
  name: string;
  country: string;
  region: 'Domestic' | 'International';
  coverImage: string;
  description: string;
  bestTimeToVisit: string;
  itineraryCount: number;
  startingPrice: number;
  durationRange: string;
  vibes: string[];
  candidateIds: string[];
}

// Curated metadata enrichment for destination vibes and aesthetics
const DESTINATION_META: Record<string, { vibes: string[]; desc: string; bestTime: string }> = {
  'Dubai': {
    vibes: ['city', 'luxury', 'shopping'],
    desc: 'Futuristic skylines, desert safaris, golden souks & luxury waterfronts.',
    bestTime: 'Nov - Mar (Pleasant 25°C)'
  },
  'Maldives': {
    vibes: ['beach', 'luxury', 'romantic'],
    desc: 'Pristine coral atolls, overwater bungalows & turquoise crystal lagoons.',
    bestTime: 'Dec - Apr (Dry Season)'
  },
  'Singapore': {
    vibes: ['city', 'family', 'modern'],
    desc: 'Gardens by the Bay, Marina Bay Sands, Sentosa Island & world-class dining.',
    bestTime: 'Year-Round (Best Nov - Jan)'
  },
  'Thailand': {
    vibes: ['beach', 'culture', 'nightlife'],
    desc: 'Vibrant Bangkok markets, Phuket limestone islands & rich Buddhist temples.',
    bestTime: 'Nov - Apr (Sunny & Cool)'
  },
  'Europe': {
    vibes: ['culture', 'mountain', 'historic'],
    desc: 'Parisian avenues, Swiss Alpine peaks, Roman antiquity & scenic railway tours.',
    bestTime: 'May - Sep (Warm & Green)'
  },
  'Bali': {
    vibes: ['tropical', 'beach', 'culture'],
    desc: 'Lush Ubud rice terraces, spiritual sea temples, surfing & beach club sunsets.',
    bestTime: 'Apr - Oct (Dry & Breezy)'
  },
  'Kashmir': {
    vibes: ['mountain', 'snow', 'nature'],
    desc: 'Shikara rides on Dal Lake, snowcapped Gulmarg peaks & Mughal floral gardens.',
    bestTime: 'Apr - Oct & Dec - Feb (Snow)'
  },
  'Goa': {
    vibes: ['beach', 'nature', 'party'],
    desc: 'Golden sun-kissed beaches, Portuguese heritage churches & coastal seafood.',
    bestTime: 'Oct - Mar (Peak Season)'
  },
  'Kerala': {
    vibes: ['tropical', 'nature', 'wellness'],
    desc: 'Tranquil Alleppey backwaters, Munnar tea hills & Ayurvedic rejuvenation.',
    bestTime: 'Sep - Mar (Pleasant Cool)'
  },
  'Manali': {
    vibes: ['mountain', 'snow', 'adventure'],
    desc: 'Snow adventures at Solang Valley, Rohtang Pass, cedar pine forests & cafes.',
    bestTime: 'Oct - Jun (Snow in Winter)'
  },
  'Ladakh': {
    vibes: ['mountain', 'adventure', 'culture'],
    desc: 'High-altitude Himalayan passes, Pangong Tso azure waters & Buddhist monasteries.',
    bestTime: 'May - Sep (Passes Open)'
  },
  'Rajasthan': {
    vibes: ['culture', 'heritage', 'luxury'],
    desc: 'Regal palaces of Jaipur, golden desert dunes of Jaisalmer & Udaipur lakes.',
    bestTime: 'Oct - Mar (Royal Winter)'
  },
  'Vietnam': {
    vibes: ['culture', 'nature', 'budget'],
    desc: 'Emerald waters of Ha Long Bay, lantern-lit Hoi An & bustling street food culture.',
    bestTime: 'Nov - Apr (Mild & Dry)'
  },
  'Japan': {
    vibes: ['culture', 'city', 'modern'],
    desc: 'Neon Tokyo lights, historic Kyoto shrines, Mount Fuji & cherry blossom parks.',
    bestTime: 'Mar - May & Sep - Nov'
  },
  'Andaman': {
    vibes: ['beach', 'island', 'adventure'],
    desc: 'Radhanagar white sand beaches, scuba diving, cellular jail & coral reefs.',
    bestTime: 'Oct - May (Calm Seas)'
  },
  'Sri Lanka': {
    vibes: ['nature', 'beach', 'culture'],
    desc: 'Sigiriya rock fortress, scenic Ella blue train, wildlife safaris & golden coasts.',
    bestTime: 'Dec - Apr (South & West Coast)'
  },
  'Australia': {
    vibes: ['city', 'beach', 'nature'],
    desc: 'Sydney Opera House, Great Barrier Reef diving, Gold Coast surf & wildlife.',
    bestTime: 'Sep - Nov & Mar - May'
  }
};

export const DestinationsPage: React.FC<DestinationsPageProps> = ({
  destinationsMaster,
  allItineraries,
  savedIds,
  onSelectDestination,
  onToggleSave,
  onBackToHome
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<'all' | 'Domestic' | 'International'>('all');
  const [vibeFilter, setVibeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'name' | 'packages'>('popular');

  // Build unified and deduplicated list of destinations
  const destinationsList: DestinationCardData[] = useMemo(() => {
    // Collect all unique destination names
    const destMap = new Map<string, DestinationCardData>();

    // 1. Process from master destinations if present
    if (destinationsMaster && destinationsMaster.length > 0) {
      destinationsMaster.forEach(m => {
        const destName = m.name;
        const matchingItineraries = allItineraries.filter(
          it => it.destination.toLowerCase() === destName.toLowerCase()
        );
        const primaryIt = matchingItineraries[0];
        const destSlug = `dest-${destName.toLowerCase().replace(/\s+/g, '-')}`;
        const targetId = primaryIt ? primaryIt.id : (m.id || destSlug);
        const meta = DESTINATION_META[destName] || {
          vibes: ['explore'],
          desc: m.tagline || m.description || primaryIt?.overview || 'Handcrafted holiday packages and verified daily blueprints.',
          bestTime: m.best_time_to_visit || m.bestTimeToVisit || primaryIt?.bestTimeToVisit || 'October to March'
        };

        const durations = matchingItineraries.map(it => it.durationDays).filter(Boolean);
        const minDays = durations.length ? Math.min(...durations) : (primaryIt?.durationDays || 4);
        const maxDays = durations.length ? Math.max(...durations) : (primaryIt?.durationDays || 7);
        const durationRange = minDays === maxDays ? `${minDays} Days` : `${minDays} - ${maxDays} Days`;

        const candidateIds = [
          targetId,
          m.id,
          destSlug,
          destName.toLowerCase(),
          ...(primaryIt ? [primaryIt.id] : []),
          ...matchingItineraries.map(it => it.id)
        ].filter(Boolean) as string[];

        destMap.set(destName.toLowerCase(), {
          id: targetId,
          name: destName,
          country: m.country || primaryIt?.country || (m.region === 'Domestic' ? 'India' : 'International'),
          region: (m.region as any) || primaryIt?.region || 'International',
          coverImage: m.cover_image || m.coverImage || primaryIt?.coverImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
          description: meta.desc,
          bestTimeToVisit: meta.bestTime,
          itineraryCount: matchingItineraries.length || m.itinerary_count || 1,
          startingPrice: m.starting_price || m.startingPrice || primaryIt?.accessPrice || 99,
          durationRange,
          vibes: meta.vibes,
          candidateIds
        });
      });
    }

    // 2. Also ensure all unique destinations from allItineraries exist
    allItineraries.forEach(it => {
      const destName = it.destination;
      const key = destName.toLowerCase();
      if (!destMap.has(key)) {
        const matchingItineraries = allItineraries.filter(
          i => i.destination.toLowerCase() === key
        );
        const destSlug = `dest-${key.replace(/\s+/g, '-')}`;
        const meta = DESTINATION_META[destName] || {
          vibes: ['explore'],
          desc: it.overview || 'Handcrafted holiday packages and verified daily blueprints.',
          bestTime: it.bestTimeToVisit || 'October to March'
        };

        const durations = matchingItineraries.map(i => i.durationDays).filter(Boolean);
        const minDays = durations.length ? Math.min(...durations) : it.durationDays;
        const maxDays = durations.length ? Math.max(...durations) : it.durationDays;
        const durationRange = minDays === maxDays ? `${minDays} Days` : `${minDays} - ${maxDays} Days`;

        const candidateIds = [
          it.id,
          destSlug,
          key,
          ...matchingItineraries.map(i => i.id)
        ];

        destMap.set(key, {
          id: it.id,
          name: destName,
          country: it.country,
          region: it.region,
          coverImage: it.coverImage,
          description: meta.desc,
          bestTimeToVisit: meta.bestTime,
          itineraryCount: matchingItineraries.length,
          startingPrice: it.accessPrice || 99,
          durationRange,
          vibes: meta.vibes,
          candidateIds
        });
      }
    });

    return Array.from(destMap.values());
  }, [destinationsMaster, allItineraries]);

  // Filter & Search
  const filteredDestinations = useMemo(() => {
    let result = [...destinationsList];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.vibes.some(v => v.includes(q))
      );
    }

    // Region filter
    if (regionFilter !== 'all') {
      result = result.filter(d => d.region.toLowerCase() === regionFilter.toLowerCase());
    }

    // Vibe filter
    if (vibeFilter !== 'all') {
      result = result.filter(d => d.vibes.includes(vibeFilter));
    }

    // Sorting
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'packages') {
      result.sort((a, b) => b.itineraryCount - a.itineraryCount);
    } else {
      // Default: Popular / Curated order
      const popularPriority: Record<string, number> = {
        'dubai': 100,
        'maldives': 95,
        'singapore': 90,
        'goa': 88,
        'kashmir': 85,
        'thailand': 82,
        'bali': 80,
        'kerala': 78,
        'manali': 75,
        'europe': 72,
        'rajasthan': 70,
        'ladakh': 68,
        'japan': 65,
        'vietnam': 62,
        'andaman': 60,
        'sri lanka': 58,
        'australia': 55
      };
      result.sort((a, b) => {
        const scoreA = popularPriority[a.name.toLowerCase()] || 10;
        const scoreB = popularPriority[b.name.toLowerCase()] || 10;
        return scoreB - scoreA;
      });
    }

    return result;
  }, [destinationsList, searchQuery, regionFilter, vibeFilter, sortBy]);

  // Region counts for tab badges
  const counts = useMemo(() => {
    const domestic = destinationsList.filter(d => d.region === 'Domestic').length;
    const international = destinationsList.filter(d => d.region === 'International').length;
    return {
      total: destinationsList.length,
      domestic,
      international
    };
  }, [destinationsList]);

  return (
    <div className="destinations-page animate-fade-in">
      {/* ─── 1. BREADCRUMB STRIP ─── */}
      <div className="dest-page-breadcrumbs">
        <div className="dest-page-container">
          <nav className="breadcrumbs-nav" aria-label="Breadcrumb">
            <button onClick={onBackToHome} className="breadcrumb-link flex items-center gap-1.5">
              <Home size={14} />
              <span>Home</span>
            </button>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">Destinations</span>
            {regionFilter !== 'all' && (
              <>
                <ChevronRight size={14} className="breadcrumb-separator" />
                <span className="breadcrumb-sub">
                  {regionFilter === 'Domestic' ? 'Domestic (India)' : 'International'}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* ─── 2. HERO SHOWCASE BANNER ─── */}
      <header className="dest-page-hero">
        <div className="dest-page-hero-overlay"></div>
        <div className="dest-page-container dest-page-hero-content">
          <div className="dest-hero-badge">
            <Compass size={16} className="text-blue-400" />
            <span>Discover Verified Holiday Destinations</span>
          </div>

          <h1 className="dest-page-hero-title">
            Curated Destinations & Verified Itineraries
          </h1>

          <p className="dest-page-hero-sub">
            Explore {counts.total} handpicked vacation spots across India and the globe. Every destination features turn-by-turn blueprints with hourly timings, hotel recommendations, and certified GST travel agents for just ₹99.
          </p>

          {/* Quick Search Input */}
          <div className="dest-search-bar-wrap shadow-lg">
            <Search size={20} className="dest-search-icon" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by destination name, country, or vibe (e.g. Dubai, Kashmir, Beaches)..."
              className="dest-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="dest-search-clear"
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Key Trust Stats Strip */}
          <div className="dest-hero-stats">
            <div className="dest-stat-chip">
              <Sparkles size={15} className="text-amber-400" />
              <span>{counts.total}+ Destinations</span>
            </div>
            <div className="dest-stat-chip">
              <Globe size={15} className="text-cyan-400" />
              <span>{counts.domestic} Domestic • {counts.international} International</span>
            </div>
            <div className="dest-stat-chip">
              <ShieldCheck size={15} className="text-emerald-400" />
              <span>100% GST Verified Planners</span>
            </div>
            <div className="dest-stat-chip">
              <span className="font-bold text-white">₹99</span>
              <span>Flat Transparent Blueprint Fee</span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── 3. FILTER BAR & CONTROLS ─── */}
      <section className="dest-controls-section">
        <div className="dest-page-container">
          <div className="dest-controls-inner">
            {/* Region Tabs (All / Domestic / International) */}
            <div className="dest-region-tabs">
              <button 
                className={`dest-region-tab ${regionFilter === 'all' ? 'active' : ''}`}
                onClick={() => setRegionFilter('all')}
              >
                <span>All Destinations</span>
                <span className="tab-pill-count">{counts.total}</span>
              </button>
              <button 
                className={`dest-region-tab ${regionFilter === 'Domestic' ? 'active' : ''}`}
                onClick={() => setRegionFilter('Domestic')}
              >
                <span>🇮🇳 Domestic (India)</span>
                <span className="tab-pill-count">{counts.domestic}</span>
              </button>
              <button 
                className={`dest-region-tab ${regionFilter === 'International' ? 'active' : ''}`}
                onClick={() => setRegionFilter('International')}
              >
                <span>🌍 International</span>
                <span className="tab-pill-count">{counts.international}</span>
              </button>
            </div>

            {/* Sorting Dropdown */}
            <div className="dest-sort-wrap">
              <label htmlFor="dest-sort-select" className="dest-sort-label">Sort by:</label>
              <select 
                id="dest-sort-select"
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="dest-sort-select"
              >
                <option value="popular">Most Popular</option>
                <option value="name">Destination (A - Z)</option>
                <option value="packages">Most Blueprints Available</option>
              </select>
            </div>
          </div>

          {/* Vibe / Theme Filter Pills */}
          <div className="dest-vibes-row">
            <span className="dest-vibes-label">Explore by Style:</span>
            <div className="dest-vibes-pills-list">
              {[
                { id: 'all', label: 'All Styles' },
                { id: 'beach', label: '🏖️ Beaches & Islands' },
                { id: 'mountain', label: '🏔️ Snow & Mountains' },
                { id: 'culture', label: '🕌 Heritage & Culture' },
                { id: 'tropical', label: '🌴 Tropical & Backwaters' },
                { id: 'city', label: '🏙️ Skylines & City Breaks' },
                { id: 'adventure', label: '🥾 Adventure & Trails' }
              ].map(v => (
                <button
                  key={v.id}
                  onClick={() => setVibeFilter(v.id)}
                  className={`dest-vibe-pill ${vibeFilter === v.id ? 'active' : ''}`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {(searchQuery || regionFilter !== 'all' || vibeFilter !== 'all') && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setRegionFilter('all');
                  setVibeFilter('all');
                }}
                className="dest-reset-filters-btn"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── 4. DESTINATIONS GRID ─── */}
      <main className="dest-grid-section">
        <div className="dest-page-container">
          <div className="dest-grid-header">
            <h2 className="dest-grid-title">
              {regionFilter === 'Domestic' ? 'Domestic Destinations in India' : 
               regionFilter === 'International' ? 'International Holiday Destinations' : 
               'All Verified Destinations'}
            </h2>
            <span className="dest-grid-count">
              Showing <strong>{filteredDestinations.length}</strong> {filteredDestinations.length === 1 ? 'destination' : 'destinations'}
            </span>
          </div>

          {filteredDestinations.length === 0 ? (
            <div className="dest-empty-state">
              <div className="dest-empty-icon">
                <Search size={32} />
              </div>
              <h3 className="dest-empty-title">No Destinations Match Your Filter</h3>
              <p className="dest-empty-desc">
                We couldn't find any destinations matching "{searchQuery || vibeFilter}". Try searching with a different keyword or reset filters to browse all our handcrafted places.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setRegionFilter('all');
                  setVibeFilter('all');
                }}
                className="btn-dest-reset"
              >
                Browse All Destinations
              </button>
            </div>
          ) : (
            <div className="destinations-master-grid">
              {filteredDestinations.map((dest) => {
                const isSaved = dest.candidateIds.some(cid => savedIds.includes(cid));

                return (
                  <article 
                    key={dest.id}
                    className="dest-card-premium shadow-sm hover:shadow-xl transition-all"
                    onClick={() => onSelectDestination(dest.name)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onSelectDestination(dest.name);
                      }
                    }}
                    title={`View travel blueprints for ${dest.name}`}
                  >
                    {/* Media Cover */}
                    <div className="dest-card-media">
                      <img 
                        src={dest.coverImage} 
                        alt={dest.name} 
                        className="dest-card-img"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="dest-card-gradient"></div>

                      {/* Region Badge */}
                      <span className={`dest-card-region-badge ${dest.region.toLowerCase()}`}>
                        {dest.region === 'Domestic' ? '🇮🇳 India' : '🌍 International'}
                      </span>

                      {/* Duration Tag */}
                      <span className="dest-card-duration-badge">
                        {dest.durationRange}
                      </span>

                      {/* Wishlist Button */}
                      <button 
                        className={`dest-card-wish-btn ${isSaved ? 'saved' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          const activeId = dest.candidateIds.find(cid => savedIds.includes(cid)) || dest.id;
                          onToggleSave(activeId, e);
                        }}
                        title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
                        aria-label="Save to favorites"
                      >
                        <Heart size={15} fill={isSaved ? '#EF4444' : 'none'} color={isSaved ? '#EF4444' : '#FFFFFF'} />
                      </button>
                    </div>

                    {/* Content Body */}
                    <div className="dest-card-body">
                      <div className="dest-card-top-row">
                        <div>
                          <h3 className="dest-card-title">{dest.name}</h3>
                          <div className="dest-card-location">
                            <MapPin size={13} className="text-slate-400 shrink-0" />
                            <span>{dest.country}</span>
                          </div>
                        </div>
                        <div className="dest-card-price-pill">
                          <span className="dest-card-price-label">Blueprints from</span>
                          <span className="dest-card-price-val">₹{dest.startingPrice}</span>
                        </div>
                      </div>

                      <p className="dest-card-desc">
                        {dest.description}
                      </p>

                      <div className="dest-card-meta-row">
                        <div className="dest-meta-item">
                          <span className="dest-meta-label">Best Season</span>
                          <span className="dest-meta-val">{dest.bestTimeToVisit}</span>
                        </div>
                        <div className="dest-meta-item text-right">
                          <span className="dest-meta-label">Available Blueprints</span>
                          <span className="dest-meta-val font-semibold text-blue-700">
                            {dest.itineraryCount} {dest.itineraryCount === 1 ? 'Package' : 'Packages'}
                          </span>
                        </div>
                      </div>

                      {/* Card Action Button */}
                      <div className="dest-card-action-wrap">
                        <button 
                          className="btn-dest-explore"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDestination(dest.name);
                          }}
                        >
                          <span>Explore Holiday Packages</span>
                          <ArrowRight size={16} className="btn-explore-arrow" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ─── 5. BOTTOM WHY V3 TRAVEL ASSURANCE ─── */}
      <section className="dest-assurance-strip">
        <div className="dest-page-container">
          <div className="dest-assurance-grid">
            <div className="assurance-card">
              <div className="assurance-icon-box text-blue-600 bg-blue-50">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="assurance-title">100% Verified Planners</h4>
                <p className="assurance-text">Every blueprint is authored by government GST-verified travel agents with local ground knowledge.</p>
              </div>
            </div>

            <div className="assurance-card">
              <div className="assurance-icon-box text-emerald-600 bg-emerald-50">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="assurance-title">No AI Hallucinations</h4>
                <p className="assurance-text">Real transit durations, recommended timings, verified ticket links and reliable hotel suggestions.</p>
              </div>
            </div>

            <div className="assurance-card">
              <div className="assurance-icon-box text-amber-600 bg-amber-50">
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className="assurance-title">Instant Offline PDF</h4>
                <p className="assurance-text">Pay ₹99 once and receive your complete color-coded itinerary PDF instantly on your WhatsApp and email.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default DestinationsPage;
