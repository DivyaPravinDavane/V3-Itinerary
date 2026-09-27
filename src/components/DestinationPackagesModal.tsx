import React, { useState } from 'react';
import { 
  Clock, CheckCircle2, ChevronRight,
  Filter, MapPin, Heart, ShieldCheck
} from 'lucide-react';
import type { Itinerary } from '../types';

interface DestinationPackagesModalProps {
  destinationName: string | null;
  allItineraries: Itinerary[];
  savedIds: string[];
  isPurchased: (itineraryId: string) => boolean;
  onClose: () => void;
  onSelectPackage: (itinerary: Itinerary) => void;
  onPayToView: (itinerary: Itinerary) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
}

export const DestinationPackagesModal: React.FC<DestinationPackagesModalProps> = ({
  destinationName,
  allItineraries,
  savedIds,
  isPurchased,
  onClose,
  onSelectPackage,
  onToggleSave
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [searchInput, setSearchInput] = useState<string>(destinationName || '');

  if (!destinationName) return null;

  // Filter packages for this destination
  let packages = allItineraries.filter(
    it => it.destination.toLowerCase() === destinationName.toLowerCase()
  );

  // Apply search
  if (searchInput.trim()) {
    const q = searchInput.toLowerCase();
    const searched = packages.filter(
      p => p.title.toLowerCase().includes(q) || 
           p.overview.toLowerCase().includes(q) ||
           p.travelerType.toLowerCase().includes(q)
    );
    if (searched.length > 0) {
      packages = searched;
    }
  }

  // Apply duration filter
  if (selectedDuration !== 'all') {
    if (selectedDuration === 'short') {
      packages = packages.filter(p => p.durationDays <= 3);
    } else if (selectedDuration === 'medium') {
      packages = packages.filter(p => p.durationDays >= 4 && p.durationDays <= 6);
    } else if (selectedDuration === 'long') {
      packages = packages.filter(p => p.durationDays >= 7);
    }
  }

  // Apply category filter
  if (selectedCategory !== 'all') {
    packages = packages.filter(p => p.travelerType.toLowerCase() === selectedCategory.toLowerCase());
  }

  return (
    <div className="dest-packages-page animate-fade-in">
      {/* TOP SEARCH ENGINE STRIP */}
      <div className="mmt-top-search-strip">
        <div className="mmt-search-container">
          <div className="mmt-input-cell dest-cell">
            <label className="mmt-cell-lbl">DESTINATION OR ACTIVITY</label>
            <div className="mmt-cell-val flex items-center gap-1.5">
              <MapPin size={16} className="text-blue-600 shrink-0" />
              <input 
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter destination or attraction..."
                className="mmt-search-input"
              />
            </div>
          </div>

          <div className="mmt-input-cell date-cell">
            <label className="mmt-cell-lbl">DURATION PREFERENCE (OPTIONAL)</label>
            <select 
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="mmt-select-input"
            >
              <option value="all">All Durations (3D to 7D+)</option>
              <option value="short">1 - 3 Days (Weekend Break)</option>
              <option value="medium">4 - 6 Days (Standard Tour)</option>
              <option value="long">7+ Days (Complete Explorer)</option>
            </select>
          </div>

          <div className="mmt-search-actions">
            <button 
              className="mmt-search-btn"
              onClick={() => {}}
            >
              SEARCH
            </button>

            <button 
              className="mmt-back-btn"
              onClick={onClose}
              type="button"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* MAIN BODY 2-COLUMN LAYOUT (Filters on Left, 3-Card Grid on Right) */}
      <div className="mmt-listing-body">
        {/* LEFT SIDEBAR: Filters */}
        <aside className="mmt-filters-sidebar">
          <div className="filters-header-row">
            <div className="flex items-center gap-1.5">
              <Filter size={15} className="text-blue-600" />
              <span className="font-bold text-slate-800 text-sm">Filters</span>
            </div>
            <button 
              className="text-xs text-blue-600 font-semibold hover:underline"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDuration('all');
                setSearchInput(destinationName);
              }}
            >
              Reset All
            </button>
          </div>

          {/* Price Filter Box */}
          <div className="filter-group-box">
            <div className="filter-group-title">Itinerary Blueprint Price</div>
            <div className="price-range-callout">
              <span className="price-min">₹99 Flat</span>
              <span className="price-tag-sub">Taxes Included</span>
            </div>
          </div>

          {/* Categories Filter */}
          <div className="filter-group-box">
            <div className="filter-group-title">Package Styles</div>
            <div className="filter-checkboxes-list">
              {[
                { id: 'all', label: 'All Packages' },
                { id: 'family', label: 'Family Specials' },
                { id: 'couple', label: 'Couples & Romantic' },
                { id: 'solo', label: 'Weekend Getaway / Solo' },
                { id: 'group', label: 'Adventure & Group' },
              ].map(cat => (
                <label key={cat.id} className="filter-chk-item">
                  <input 
                    type="radio" 
                    name="packageCategory" 
                    checked={selectedCategory === cat.id}
                    onChange={() => setSelectedCategory(cat.id)}
                    className="mmt-radio"
                  />
                  <span className={`chk-label ${selectedCategory === cat.id ? 'font-bold text-blue-700' : ''}`}>
                    {cat.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Duration Filters */}
          <div className="filter-group-box">
            <div className="filter-group-title">Trip Duration</div>
            <div className="filter-checkboxes-list">
              {[
                { id: 'all', label: 'Any Duration' },
                { id: 'short', label: '1 - 3 Days' },
                { id: 'medium', label: '4 - 6 Days' },
                { id: 'long', label: '7+ Days' }
              ].map(dur => (
                <label key={dur.id} className="filter-chk-item">
                  <input 
                    type="radio" 
                    name="packageDuration" 
                    checked={selectedDuration === dur.id}
                    onChange={() => setSelectedDuration(dur.id)}
                    className="mmt-radio"
                  />
                  <span className={`chk-label ${selectedDuration === dur.id ? 'font-bold text-blue-700' : ''}`}>
                    {dur.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Trust Assurance Card */}
          <div className="sidebar-trust-box">
            <ShieldCheck size={20} className="text-emerald-600 mb-1" />
            <div className="font-bold text-xs text-slate-800">100% Verified Blueprints</div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
              Includes hour-by-hour routing, discount booking links, and offline PDF guide.
            </p>
          </div>
        </aside>

        {/* RIGHT CONTENT: Packages Grid */}
        <main className="mmt-cards-main">
          <div className="mmt-results-header">
            <span className="results-count-text">
              Showing <strong>{packages.length}</strong> Holiday Packages for <strong>{destinationName}</strong>
            </span>
            <span className="text-xs text-slate-500">
              Click any card to read summary and unlock full itinerary with PDF
            </span>
          </div>

          {packages.length === 0 ? (
            <div className="empty-packages-placeholder py-12 px-6 text-center bg-white rounded-xl border border-slate-200 my-6 shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <MapPin size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Curating New Blueprints for {destinationName}
              </h3>
              <p className="text-slate-600 max-w-md mx-auto mb-6 text-sm">
                Our verified travel specialists are putting together turn-by-turn day-by-day itineraries for {destinationName}. Check back shortly or explore our other top destinations!
              </p>
              <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all inline-flex items-center gap-2"
              >
                Explore Other Destinations
              </button>
            </div>
          ) : (
            <div className="mmt-packages-3col-grid">
              {packages.map((pkg) => {
                const destSlug = `dest-${pkg.destination.toLowerCase().replace(/\s+/g, '-')}`;
                const isSaved = savedIds.includes(pkg.id) || 
                                savedIds.includes(destSlug) || 
                                savedIds.some(sid => sid.toLowerCase() === pkg.destination.toLowerCase());
                const hasPurchased = isPurchased(pkg.id);

                return (
                  <div 
                    key={pkg.id} 
                    className="mmt-card shadow-sm hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => onSelectPackage(pkg)}
                  >
                    {/* Top Image Container */}
                    <div className="mmt-card-img-wrap">
                      <img 
                        src={pkg.coverImage} 
                        alt={pkg.title} 
                        className="mmt-card-img"
                        loading="lazy"
                      />
                      
                      {isSaved && (
                        <span className="saved-corner-pill">
                          <Heart size={11} fill="#EF4444" stroke="#EF4444" />
                          <span>Saved</span>
                        </span>
                      )}

                      {/* Category Badge */}
                      <span className="mmt-category-badge">
                        {pkg.travelerType === 'Family' ? 'Family Special' : 
                         pkg.travelerType === 'Couple' ? 'Romantic Escape' : 
                         pkg.travelerType === 'Solo' ? 'Express Weekend' : 'Theme Parks & Safari'}
                      </span>

                      {/* Wishlist Heart Button */}
                      <button 
                        className={`mmt-heart-btn ${isSaved ? 'saved' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          const activeId = isSaved 
                            ? ([pkg.id, destSlug, pkg.destination.toLowerCase()].find(cid => savedIds.includes(cid)) || pkg.id)
                            : pkg.id;
                          onToggleSave(activeId, e);
                        }}
                        title={isSaved ? "Saved in Wishlist" : "Save package to Wishlist"}
                        aria-label="Save package"
                      >
                        <Heart size={16} fill={isSaved ? '#EF4444' : 'none'} stroke={isSaved ? '#EF4444' : '#FFFFFF'} />
                      </button>

                      {hasPurchased && (
                        <span className="mmt-purchased-badge">
                          ✓ Unlocked
                        </span>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="mmt-card-body">
                      <h3 className="mmt-card-title line-clamp-2" title={pkg.title}>
                        {pkg.title}
                      </h3>

                      <div className="mmt-card-duration-row">
                        <Clock size={13} className="text-slate-400 shrink-0" />
                        <span>{pkg.durationDays} Days / {pkg.durationNights} Nights</span>
                      </div>

                      <div className="mmt-card-bullets-list">
                        <div className="mmt-bullet-item">
                          <CheckCircle2 size={13} className="text-blue-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">
                            {pkg.days[0]?.highlights[0] ? `Includes ${pkg.days[0].highlights[0]}` : 'Includes top iconic attractions & transfers'}
                          </span>
                        </div>
                        <div className="mmt-bullet-item">
                          <CheckCircle2 size={13} className="text-blue-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">
                            {pkg.days[1]?.highlights[0] ? `Explore ${pkg.days[1].highlights[0]}` : 'Curated 4-star stays & local dining spots'}
                          </span>
                        </div>
                      </div>

                      {/* Card Bottom Pricing & Action */}
                      <div className="mmt-card-footer">
                        <div className="mmt-savings-tag">
                          You save 42%
                        </div>

                        <div className="mmt-price-cta-row">
                          <div className="mmt-price-col">
                            <span className="mmt-orig-price">From ₹1,804</span>
                            <div className="mmt-active-price">
                              <span className="curr">₹</span>
                              <span className="amt">99</span>
                              <span className="unit">per package</span>
                            </div>
                          </div>

                          <div className="mmt-action-indicator">
                            <span>View Summary</span>
                            <ChevronRight size={15} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
