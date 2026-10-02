import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, MapPin, Heart, ArrowRight, Compass, ShieldCheck, 
  Sparkles, CheckCircle2, ChevronRight, Home, Globe, X
} from 'lucide-react';
import type { Itinerary, Destination } from '../types';
import { 
  getCitiesForDestination, 
  checkDestinationMatchesQuery, 
  POPULAR_SEARCH_CITIES 
} from '../utils/destinationCities';

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
  cities: string[];
  matchedCity?: string;
  matchScore?: number;
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
  'Switzerland': {
    vibes: ['mountain', 'snow', 'nature', 'luxury'],
    desc: 'Alpine glaciers of Mt Titlis & Jungfraujoch, crystal Lake Lucerne & world-class scenic trains.',
    bestTime: 'May - Oct (Green) & Dec - Apr (Snow)'
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
  const [showLiveDropdown, setShowLiveDropdown] = useState(false);
  const [highlightedDestId, setHighlightedDestId] = useState<string | null>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setShowLiveDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smooth scroll page directly to the matching destination card with header offset
  const scrollToDestination = (destName?: string, destId?: string) => {
    setTimeout(() => {
      let targetEl: HTMLElement | null = null;
      if (destName) {
        targetEl = document.getElementById(`dest-card-${destName.toLowerCase().replace(/\s+/g, '-')}`);
      }
      if (!targetEl && destId) {
        targetEl = document.getElementById(`dest-card-${destId}`);
      }
      if (!targetEl) {
        targetEl = document.getElementById('dest-grid-section');
      }

      if (targetEl) {
        const headerOffset = 96;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }

      const highlightKey = destName ? destName.toLowerCase().replace(/\s+/g, '-') : (destId || null);
      if (highlightKey) {
        setHighlightedDestId(highlightKey);
        setTimeout(() => setHighlightedDestId(null), 4000);
      }
    }, 110);
  };

  const handleSearchSubmit = (e: React.FormEvent, forceRedirect = false) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowLiveDropdown(false);

    const q = searchQuery.toLowerCase().trim();
    let topMatch: DestinationCardData | undefined = filteredDestinations[0];
    if (!topMatch) {
      topMatch = destinationsList.find(d => {
        const res = checkDestinationMatchesQuery(d.name, d.country, q, allItineraries, d.description, d.vibes);
        return res.isMatch;
      });
    }

    if (topMatch) {
      if (forceRedirect) {
        // Direct redirect on Enter key: fulfills "when i search any city it should redirect"
        onSelectDestination(topMatch.name);
      } else {
        // Smooth scroll straight down to the destination card and show it: fulfills "or the page should go there and show it to the user"
        scrollToDestination(topMatch.name, topMatch.id);
      }
    } else {
      scrollToDestination();
    }
  };

  const handleSelectCityChip = (city: string) => {
    setSearchQuery(city);
    setShowLiveDropdown(false);
    const q = city.toLowerCase();
    const matched = destinationsList.find(d => {
      const res = checkDestinationMatchesQuery(d.name, d.country, q, allItineraries);
      return res.isMatch;
    });
    scrollToDestination(matched?.name, matched?.id);
  };

  const handleDropdownSelect = (destName: string, shouldRedirectDirectly = true) => {
    setShowLiveDropdown(false);
    if (shouldRedirectDirectly) {
      // Direct redirect to the destination's packages
      onSelectDestination(destName);
    } else {
      setSearchQuery(destName);
      scrollToDestination(destName);
    }
  };

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

        const cities = getCitiesForDestination(destName, allItineraries);

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
          candidateIds,
          cities
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

        const cities = getCitiesForDestination(destName, allItineraries);

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
          candidateIds,
          cities
        });
      }
    });

    return Array.from(destMap.values());
  }, [destinationsMaster, allItineraries]);

  // Filter & Search with Intelligent City & Destination Match Engine
  const filteredDestinations = useMemo(() => {
    let result: DestinationCardData[] = [];
    const q = searchQuery.toLowerCase().trim();

    if (q) {
      destinationsList.forEach(d => {
        const matchRes = checkDestinationMatchesQuery(
          d.name,
          d.country,
          q,
          allItineraries,
          d.description,
          d.vibes
        );

        if (matchRes.isMatch) {
          result.push({
            ...d,
            matchedCity: matchRes.matchedCity,
            matchScore: matchRes.score
          });
        }
      });
    } else {
      result = destinationsList.map(d => ({ ...d, matchedCity: undefined, matchScore: 0 }));
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
    } else if (q) {
      // Prioritize best city/destination match score first when searching!
      result.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
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
        'switzerland': 74,
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
  }, [destinationsList, searchQuery, regionFilter, vibeFilter, sortBy, allItineraries]);

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

          {/* Quick Search Form with Live Dropdown & Smooth Scroll */}
          <div ref={searchWrapRef} className="dest-search-outer-wrap">
            <form onSubmit={(e) => handleSearchSubmit(e, true)} className="dest-search-bar-wrap shadow-xl">
              <Search size={20} className="dest-search-icon" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowLiveDropdown(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) setShowLiveDropdown(true);
                }}
                placeholder="Search cities (e.g. Paris, Zurich, Gulmarg, Ubud, Phuket, Munnar) or destinations..."
                className="dest-search-input"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowLiveDropdown(false);
                  }}
                  className="dest-search-clear"
                  title="Clear search"
                >
                  <X size={15} />
                </button>
              )}
              <button 
                type="button"
                onClick={(e) => handleSearchSubmit(e, false)}
                className="dest-search-submit-btn"
                title="Scroll down and show matching destination"
              >
                <span>Find</span>
                <ArrowRight size={14} />
              </button>
            </form>

            {/* Live Autocomplete / Instant Dropdown for Immediate Redirection */}
            {showLiveDropdown && searchQuery.trim().length >= 2 && filteredDestinations.length > 0 && (
              <div className="dest-search-live-dropdown shadow-2xl animate-fade-in">
                <div className="dest-dropdown-header">
                  <span>Matching Destinations for &ldquo;{searchQuery}&rdquo;:</span>
                  <span className="dest-dropdown-hint">Click to view blueprints</span>
                </div>
                <div className="dest-dropdown-list">
                  {filteredDestinations.slice(0, 5).map(item => (
                    <div 
                      key={item.id}
                      className="dest-dropdown-item"
                      onClick={() => handleDropdownSelect(item.name, true)}
                    >
                      <div className="dest-dropdown-item-left">
                        <img 
                          src={item.coverImage} 
                          alt={item.name} 
                          className="dest-drop-thumb"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=120&q=80';
                          }}
                        />
                        <div className="dest-drop-info">
                          <div className="dest-drop-title-row">
                            <span className="dest-drop-name">{item.name}</span>
                            {item.matchedCity && item.matchedCity.toLowerCase() !== item.name.toLowerCase() && (
                              <span className="dest-drop-city-pill">
                                Covers <strong>{item.matchedCity}</strong>
                              </span>
                            )}
                          </div>
                          <span className="dest-drop-meta">{item.country} • {item.itineraryCount} {item.itineraryCount === 1 ? 'Package' : 'Packages'}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="dest-drop-redirect-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDropdownSelect(item.name, true);
                        }}
                      >
                        <span>View Blueprints</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Clickable Popular City Suggestion Chips */}
          <div className="dest-city-chips-container">
            <div className="dest-city-chips-label">
              <MapPin size={13} className="text-amber-400 shrink-0" />
              <span>Popular Cities:</span>
            </div>
            <div className="dest-city-chips-scroll">
              {POPULAR_SEARCH_CITIES.map(city => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleSelectCityChip(city)}
                  className={`dest-city-chip-btn ${searchQuery.toLowerCase().trim() === city.toLowerCase() ? 'active' : ''}`}
                >
                  {city}
                </button>
              ))}
            </div>
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
      <main id="dest-grid-section" className="dest-grid-section">
        <div className="dest-page-container">
          <div className="dest-grid-header">
            <div>
              <h2 className="dest-grid-title">
                {searchQuery.trim() ? (
                  <span>Destinations Matching City / Keyword &ldquo;<strong className="text-blue-600">{searchQuery}</strong>&rdquo;</span>
                ) : regionFilter === 'Domestic' ? (
                  'Domestic Destinations in India'
                ) : regionFilter === 'International' ? (
                  'International Holiday Destinations'
                ) : (
                  'All Verified Destinations'
                )}
              </h2>
              {searchQuery.trim() && (
                <div className="dest-active-search-sub">
                  <span>Found {filteredDestinations.length} destination{filteredDestinations.length === 1 ? '' : 's'} matching &ldquo;{searchQuery}&rdquo;</span>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="dest-clear-search-chip"
                    title="Clear search"
                  >
                    Clear Filter ×
                  </button>
                </div>
              )}
            </div>
            <span className="dest-grid-count">
              Showing <strong>{filteredDestinations.length}</strong> {filteredDestinations.length === 1 ? 'destination' : 'destinations'}
            </span>
          </div>

          {/* Quick City Match Redirect Banner */}
          {searchQuery.trim() && filteredDestinations.length > 0 && (
            <div className="dest-search-redirect-banner">
              <div className="dest-search-redirect-left">
                <div className="dest-search-redirect-pin">
                  <MapPin size={22} className="text-blue-600" />
                </div>
                <div>
                  <div className="dest-search-redirect-heading">
                    <span>Showing destination covering</span>
                    <span className="dest-highlight-text">&ldquo;{searchQuery}&rdquo;</span>
                    <span>: <strong>{filteredDestinations[0].name}</strong> ({filteredDestinations[0].country})</span>
                  </div>
                  <p className="dest-search-redirect-sub">
                    {filteredDestinations[0].itineraryCount} verified {filteredDestinations[0].itineraryCount === 1 ? 'blueprint' : 'blueprints'} available{filteredDestinations[0].matchedCity ? ` covering ${filteredDestinations[0].matchedCity}` : ''}. Click to view all packages directly.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelectDestination(filteredDestinations[0].name)}
                className="dest-search-redirect-btn"
                title={`Open ${filteredDestinations[0].name} packages`}
              >
                <span>View {filteredDestinations[0].name} Packages</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}

          {filteredDestinations.length === 0 ? (
            <div className="dest-empty-state">
              <div className="dest-empty-icon">
                <Search size={32} />
              </div>
              <h3 className="dest-empty-title">
                {searchQuery ? `No Destinations Found for "${searchQuery}"` : 'No Destinations Match Your Filter'}
              </h3>
              <p className="dest-empty-desc">
                {searchQuery
                  ? `We couldn't find a direct destination or city matching "${searchQuery}". Try clicking one of our popular cities below or browse all destinations.`
                  : 'Try selecting a different style or resetting your filters to explore all handcrafted itineraries.'}
              </p>
              <div className="dest-empty-city-suggestions">
                {['Paris', 'Zurich', 'Gulmarg', 'Phuket', 'Seminyak', 'Munnar', 'Jaipur', 'Calangute', 'Tokyo', 'Rome'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleSelectCityChip(c)}
                    className="dest-empty-city-pill"
                  >
                    📍 {c}
                  </button>
                ))}
              </div>
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
                    id={`dest-card-${dest.name.toLowerCase().replace(/\s+/g, '-')}`}
                    data-dest-id={dest.id}
                    className={`dest-card-premium shadow-sm hover:shadow-xl transition-all ${
                      highlightedDestId === dest.name.toLowerCase().replace(/\s+/g, '-') || highlightedDestId === dest.id 
                        ? 'dest-card-highlighted' 
                        : ''
                    }`}
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

                      {/* Matched City Badge if user searched a city */}
                      {dest.matchedCity && dest.matchedCity.toLowerCase() !== dest.name.toLowerCase() && (
                        <span className="dest-card-matched-city-badge">
                          <MapPin size={11} className="text-emerald-300 shrink-0" />
                          <span>Includes <strong>{dest.matchedCity}</strong></span>
                        </span>
                      )}

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

                      {/* Covered Cities & Spots Strip */}
                      {dest.cities && dest.cities.length > 0 && (
                        <div className="dest-card-cities-strip">
                          <MapPin size={12} className="text-blue-500 shrink-0 mt-0.5" />
                          <div className="dest-card-cities-inner">
                            <span className="dest-card-cities-title">Cities & Spots: </span>
                            <span className="dest-card-cities-text">
                              {dest.cities.slice(0, 4).map((c, idx) => {
                                const isMatched = searchQuery.trim() && c.toLowerCase().includes(searchQuery.toLowerCase().trim());
                                return (
                                  <span key={c} className={isMatched ? 'dest-city-highlight' : ''}>
                                    {c}{idx < Math.min(dest.cities.length - 1, 3) ? ', ' : ''}
                                  </span>
                                );
                              })}
                              {dest.cities.length > 4 ? ` +${dest.cities.length - 4} more` : ''}
                            </span>
                          </div>
                        </div>
                      )}

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
