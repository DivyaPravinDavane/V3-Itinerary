import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, Users, ShieldCheck, FileText, Zap, Globe, Plane, ChevronDown, X } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (params: { query: string; destination: string; duration: string; travellers: string }) => void;
  activeFilter?: {
    query: string;
    destination: string;
    duration: string;
    travellers: string;
  };
  availableDestinations?: { name: string; country?: string }[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, activeFilter, availableDestinations }) => {
  const [query, setQuery] = useState(activeFilter?.query || '');
  const [destination, setDestination] = useState(activeFilter?.destination || '');
  const [duration, setDuration] = useState(activeFilter?.duration || '');
  const [travellers, setTravellers] = useState(activeFilter?.travellers || '');

  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [durationDropdownOpen, setDurationDropdownOpen] = useState(false);
  const [travellerDropdownOpen, setTravellerDropdownOpen] = useState(false);

  const searchCardRef = useRef<HTMLFormElement>(null);

  // Synchronize if activeFilter changes externally (e.g. clear search)
  useEffect(() => {
    if (activeFilter) {
      setQuery(activeFilter.query || '');
      setDestination(activeFilter.destination || '');
      setDuration(activeFilter.duration || '');
      setTravellers(activeFilter.travellers || '');
    }
  }, [activeFilter]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchCardRef.current && !searchCardRef.current.contains(event.target as Node)) {
        setDestDropdownOpen(false);
        setDurationDropdownOpen(false);
        setTravellerDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const defaultDestinationOptions = [
    { label: 'All Destinations', value: '' },
    { label: 'Kerala Backwaters & Munnar', value: 'Kerala' },
    { label: 'Dubai, UAE', value: 'Dubai' },
    { label: 'Maldives Paradise', value: 'Maldives' },
    { label: 'Singapore & Sentosa', value: 'Singapore' },
    { label: 'Thailand (Bangkok, Phuket, Pattaya)', value: 'Thailand' },
    { label: 'Europe (Swiss Alps & Paris)', value: 'Europe' },
    { label: 'Bali & Nusa Penida', value: 'Bali' },
    { label: 'Kashmir Valley & Gulmarg', value: 'Kashmir' },
    { label: 'Goa Beaches & Heritage', value: 'Goa' },
    { label: 'Manali & Himachal Snow', value: 'Manali' },
    { label: 'Ladakh, Leh & Pangong', value: 'Ladakh' },
    { label: 'Rajasthan Royal Heritage', value: 'Rajasthan' },
    { label: 'Vietnam (Hanoi & Halong Bay)', value: 'Vietnam' },
    { label: 'Japan (Tokyo & Kyoto)', value: 'Japan' },
    { label: 'Australia (Sydney & Reef)', value: 'Australia' },
    { label: 'Andaman & Nicobar Islands', value: 'Andaman' },
    { label: 'Sri Lanka Wonder', value: 'Sri Lanka' }
  ];

  const destinationOptions = availableDestinations && availableDestinations.length > 0
    ? [
        { label: 'All Destinations', value: '' },
        ...availableDestinations.map(d => ({
          label: d.country ? `${d.name} (${d.country})` : d.name,
          value: d.name
        }))
      ]
    : defaultDestinationOptions;

  const durationOptions = [
    { label: 'Any Duration', value: '' },
    { label: '1-3 Days (Weekend)', value: '1-3' },
    { label: '4-6 Days (Short Trip)', value: '4-6' },
    { label: '7-10 Days (Standard)', value: '7-10' },
    { label: '10+ Days (Extended)', value: '10+' }
  ];

  const travellerOptions = [
    { label: 'Any Travellers', value: '' },
    { label: 'Solo Traveler', value: 'Solo' },
    { label: 'Couple / Honeymoon', value: 'Couple' },
    { label: 'Family with Kids', value: 'Family' },
    { label: 'Group / Friends', value: 'Group' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDestDropdownOpen(false);
    setDurationDropdownOpen(false);
    setTravellerDropdownOpen(false);
    onSearch({ query, destination, duration, travellers });
  };

  return (
    <section className="hero-section" id="hero">
      {/* Background Graphic */}
      <div className="hero-bg-container">
        <img 
          src="/images/hero_banner.jpg" 
          alt="Tropical overwater bungalows travel paradise" 
          className="hero-bg-img"
        />
        <div className="hero-scrim-overlay"></div>
      </div>

      <div className="hero-container">
        <div className="hero-content-left">
          <h1 className="hero-title">
            India's Trusted Platform for<br />
            <span className="hero-title-accent">Travel Itineraries</span>
          </h1>

          <h2 className="hero-subtitle">Discover. Buy. Travel Better.</h2>

          <p className="hero-description">
            Explore expertly crafted itineraries from verified travel agents across India.
            Buy the itinerary you like and connect directly with the best.
          </p>

          {/* Floating Search Engine Module */}
          <form 
            ref={searchCardRef}
            className="hero-search-card shadow-xl" 
            onSubmit={handleSearchSubmit}
          >
            {/* Input 1: Destination / Tour Name */}
            <div className="search-field flex-grow relative">
              <Search className="field-icon text-slate-400" size={19} />
              <input 
                type="text" 
                placeholder="Search destination, city, or tour name..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input pr-7"
              />
              {query && (
                <button 
                  type="button" 
                  onClick={() => setQuery('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 p-1"
                  title="Clear text"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="field-divider"></div>

            {/* Input 2: Select Destination Dropdown */}
            <div 
              className="search-field dropdown-trigger" 
              onClick={() => {
                setDestDropdownOpen(!destDropdownOpen);
                setDurationDropdownOpen(false);
                setTravellerDropdownOpen(false);
              }}
            >
              <MapPin className="field-icon text-blue-500" size={18} />
              <span className={`dropdown-selected-label ${!destination ? 'placeholder-color' : ''}`}>
                {destination ? destinationOptions.find(d => d.value === destination)?.label : 'Select Destination'}
              </span>
              <ChevronDown size={14} className="dropdown-arrow" />

              {destDropdownOpen && (
                <div className="search-popover-menu shadow-lg" onClick={(e) => e.stopPropagation()}>
                  {destinationOptions.map((opt) => (
                    <div 
                      key={opt.value} 
                      className={`search-popover-item ${destination === opt.value ? 'selected' : ''}`}
                      onClick={() => {
                        setDestination(opt.value);
                        setDestDropdownOpen(false);
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="field-divider"></div>

            {/* Input 3: Duration Dropdown */}
            <div 
              className="search-field dropdown-trigger" 
              onClick={() => {
                setDurationDropdownOpen(!durationDropdownOpen);
                setDestDropdownOpen(false);
                setTravellerDropdownOpen(false);
              }}
            >
              <Calendar className="field-icon text-blue-500" size={18} />
              <span className={`dropdown-selected-label ${!duration ? 'placeholder-color' : ''}`}>
                {duration ? durationOptions.find(d => d.value === duration)?.label : 'Duration'}
              </span>
              <ChevronDown size={14} className="dropdown-arrow" />

              {durationDropdownOpen && (
                <div className="search-popover-menu shadow-lg" onClick={(e) => e.stopPropagation()}>
                  {durationOptions.map((opt) => (
                    <div 
                      key={opt.value} 
                      className={`search-popover-item ${duration === opt.value ? 'selected' : ''}`}
                      onClick={() => {
                        setDuration(opt.value);
                        setDurationDropdownOpen(false);
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="field-divider"></div>

            {/* Input 4: Travellers Dropdown */}
            <div 
              className="search-field dropdown-trigger" 
              onClick={() => {
                setTravellerDropdownOpen(!travellerDropdownOpen);
                setDestDropdownOpen(false);
                setDurationDropdownOpen(false);
              }}
            >
              <Users className="field-icon text-blue-500" size={18} />
              <span className={`dropdown-selected-label ${!travellers ? 'placeholder-color' : ''}`}>
                {travellers ? travellerOptions.find(t => t.value === travellers)?.label : 'Travellers'}
              </span>
              <ChevronDown size={14} className="dropdown-arrow" />

              {travellerDropdownOpen && (
                <div className="search-popover-menu shadow-lg" onClick={(e) => e.stopPropagation()}>
                  {travellerOptions.map((opt) => (
                    <div 
                      key={opt.value} 
                      className={`search-popover-item ${travellers === opt.value ? 'selected' : ''}`}
                      onClick={() => {
                        setTravellers(opt.value);
                        setTravellerDropdownOpen(false);
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-search-primary">
              Search
            </button>
          </form>

          {/* Quick Trending Destination Filter Chips */}
          <div className="hero-quick-destinations">
            <span className="quick-dest-label">Trending Now:</span>
            <div className="quick-dest-chips">
              {(availableDestinations && availableDestinations.length > 0
                ? availableDestinations.slice(0, 8)
                : [
                    { name: 'Switzerland' },
                    { name: 'Kerala' },
                    { name: 'Australia' },
                    { name: 'Dubai' },
                    { name: 'Maldives' },
                    { name: 'Bali' },
                    { name: 'Singapore' }
                  ]
              ).map((d) => (
                <button
                  key={d.name}
                  type="button"
                  onClick={() => onSearch({ query: '', destination: d.name, duration: '', travellers: '' })}
                  className={`quick-dest-chip ${activeFilter?.destination === d.name ? 'active' : ''}`}
                  title={`View verified itineraries for ${d.name}`}
                >
                  <MapPin size={11} className="quick-chip-pin" />
                  <span>{d.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feature Trust Pills Strip */}
          <div className="hero-feature-pills">
            <div className="feature-pill">
              <div className="pill-icon-box blue-bg">
                <ShieldCheck size={16} className="pill-icon text-blue-600" />
              </div>
              <div className="pill-text-group">
                <span className="pill-title">Verified Travel Agents</span>
                <span className="pill-sub">Trusted & Professional</span>
              </div>
            </div>

            <div className="feature-pill">
              <div className="pill-icon-box blue-bg">
                <FileText size={16} className="pill-icon text-blue-600" />
              </div>
              <div className="pill-text-group">
                <span className="pill-title">Unlimited Itineraries</span>
                <span className="pill-sub">Many Options, One Place</span>
              </div>
            </div>

            <div className="feature-pill">
              <div className="pill-icon-box blue-bg">
                <Zap size={16} className="pill-icon text-blue-600" />
              </div>
              <div className="pill-text-group">
                <span className="pill-title">Instant Access</span>
                <span className="pill-sub">Download & Connect</span>
              </div>
            </div>

            <div className="feature-pill">
              <div className="pill-icon-box blue-bg">
                <Globe size={16} className="pill-icon text-blue-600" />
              </div>
              <div className="pill-text-group">
                <span className="pill-title">Across India</span>
                <span className="pill-sub">Leads From Everywhere</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Callout Badge on Right */}
        <div className="hero-floating-badge shadow-2xl">
          <div className="badge-flight-graphic">
            <div className="badge-plane-icon">
              <Plane size={15} />
            </div>
            <div className="badge-dash-line"></div>
            <div className="badge-target-pin">
              <MapPin size={13} />
            </div>
          </div>
          <div className="badge-text">
            Your Journey Starts with<br />
            the <span className="highlight-amber">Right Itinerary!</span>
          </div>
        </div>
      </div>
    </section>
  );
};
