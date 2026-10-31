import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquare, 
  Plus, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  X,
  Sparkles,
  Award
} from 'lucide-react';
import type { Itinerary, ItineraryReview } from '../types';
import { 
  getItineraryReviews, 
  addItineraryReview, 
  getEffectiveRatingAndCount,
  toggleReviewHelpful,
  isReviewHelpful
} from '../utils/reviewManager';

interface ItineraryReviewsSectionProps {
  itinerary: Itinerary;
  onRatingUpdated?: (newRating: number, newCount: number) => void;
  compact?: boolean; // For modal embed
}

export const ItineraryReviewsSection: React.FC<ItineraryReviewsSectionProps> = ({
  itinerary,
  onRatingUpdated,
  compact = false
}) => {
  const [reviews, setReviews] = useState<ItineraryReview[]>(() => getItineraryReviews(itinerary));
  const [stats, setStats] = useState(() => getEffectiveRatingAndCount(itinerary));
  const [isWriting, setIsWriting] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'helpful'>('recent');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formTravelerType, setFormTravelerType] = useState<ItineraryReview['travelerType']>('Couple');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refresh reviews when itinerary changes
  useEffect(() => {
    setReviews(getItineraryReviews(itinerary));
    setStats(getEffectiveRatingAndCount(itinerary));
  }, [itinerary.id]);

  // Star breakdown calculation
  const ratingDistribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[star]++;
    });
    const total = reviews.length || 1;
    return {
      5: { count: counts[5], pct: Math.round((counts[5] / total) * 100) },
      4: { count: counts[4], pct: Math.round((counts[4] / total) * 100) },
      3: { count: counts[3], pct: Math.round((counts[3] / total) * 100) },
      2: { count: counts[2], pct: Math.round((counts[2] / total) * 100) },
      1: { count: counts[1], pct: Math.round((counts[1] / total) * 100) },
    };
  }, [reviews]);

  // Filtered and sorted reviews
  const visibleReviews = useMemo(() => {
    let list = [...reviews];
    if (selectedFilter !== 'all') {
      list = list.filter(r => Math.round(r.rating) === selectedFilter);
    }
    if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'helpful') {
      list.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
    }
    return list;
  }, [reviews, selectedFilter, sortBy]);

  const ratingLabel = (score: number) => {
    if (score >= 5) return 'Exceptional! 🌟';
    if (score >= 4) return 'Very Good! 👍';
    if (score >= 3) return 'Average / Decent 🙂';
    if (score >= 2) return 'Below Expectations 😕';
    return 'Poor ⚠️';
  };

  const handleHelpfulClick = (reviewId: string) => {
    const voted = toggleReviewHelpful(reviewId);
    setReviews(prev =>
      prev.map(r => {
        if (r.id === reviewId) {
          const count = r.helpfulCount || 0;
          return { ...r, helpfulCount: voted ? count + 1 : Math.max(0, count - 1) };
        }
        return r;
      })
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTitle.trim() || !formComment.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const res = addItineraryReview(itinerary, {
        userName: formName,
        userLocation: formLocation,
        rating: formRating,
        title: formTitle,
        comment: formComment,
        travelerType: formTravelerType
      });

      setReviews(res.reviews);
      setStats({ rating: res.newRating, reviewCount: res.newReviewCount });
      if (onRatingUpdated) {
        onRatingUpdated(res.newRating, res.newReviewCount);
      }

      setIsWriting(false);
      setIsSubmitting(false);
      setSuccessMsg(`Thank you, ${formName.trim()}! Your review has been published and is now live.`);

      // Reset Form
      setFormRating(5);
      setFormTitle('');
      setFormComment('');
      setFormName('');
      setFormLocation('');

      setTimeout(() => setSuccessMsg(null), 6000);
    }, 400);
  };

  return (
    <div className={`itinerary-reviews-container ${compact ? 'compact-mode' : ''} bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-5 sm:p-7 my-6`}>
      {/* 1. SECTION HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <Award size={13} className="text-amber-600" />
              Verified Traveler Ratings
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">• 100% Authentic Community Feedback</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <MessageSquare size={22} className="text-emerald-600" />
            Traveler Reviews & Ratings
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real feedback from travelers who unlocked this {itinerary.destination} blueprint
          </p>
        </div>

        {!isWriting && (
          <button
            type="button"
            onClick={() => setIsWriting(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
          >
            <Plus size={16} />
            <span>Write a Review</span>
          </button>
        )}
      </div>

      {/* SUCCESS BANNER */}
      {successMsg && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-sm">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} />
          </div>
          <span className="flex-1">{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-800 p-1">
            <X size={16} />
          </button>
        </div>
      )}

      {/* 2. RATING OVERVIEW SCOREBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/20 border border-slate-100">
        {/* BIG SCORE */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-3 sm:border-r sm:border-slate-200">
          <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
            <span>{stats.rating.toFixed(1)}</span>
            <span className="text-lg text-slate-400 font-normal">/ 5</span>
          </div>

          <div className="flex items-center gap-1 my-2 text-amber-500">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={20}
                fill={s <= Math.round(stats.rating) ? '#F59E0B' : 'none'}
                stroke="#F59E0B"
                strokeWidth={1.8}
              />
            ))}
          </div>

          <div className="text-xs font-bold text-slate-700">
            Based on {stats.reviewCount} verified traveler reviews
          </div>

          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            <Sparkles size={12} className="text-emerald-600" />
            98% Recommend This Plan
          </div>
        </div>

        {/* STAR BARS */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2 px-1 sm:px-4">
          {([5, 4, 3, 2, 1] as const).map((star) => {
            const data = ratingDistribution[star];
            const isFilterActive = selectedFilter === star;
            return (
              <div 
                key={star} 
                onClick={() => setSelectedFilter(selectedFilter === star ? 'all' : star)}
                className={`flex items-center gap-3 text-xs cursor-pointer group py-0.5 px-2 rounded-lg transition-colors ${
                  isFilterActive ? 'bg-amber-100/60 font-bold' : 'hover:bg-white/80'
                }`}
                title={`Click to filter by ${star} star reviews`}
              >
                <div className="flex items-center gap-1 w-12 font-semibold text-slate-700">
                  <span>{star}</span>
                  <Star size={12} fill="#F59E0B" stroke="#F59E0B" />
                </div>

                <div className="flex-1 h-2.5 rounded-full bg-slate-200 overflow-hidden relative">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                    style={{ width: `${data.pct}%` }}
                  />
                </div>

                <div className="w-16 text-right text-slate-500 font-mono text-[11px]">
                  <span>{data.count} ({data.pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. INLINE "WRITE A REVIEW" FORM */}
      {isWriting && (
        <form 
          onSubmit={handleSubmitReview}
          className="my-6 p-5 sm:p-6 rounded-2xl bg-white border-2 border-emerald-500 shadow-xl animate-scale-up"
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                ★
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">Write Your Review for {itinerary.destination}</h4>
                <p className="text-xs text-slate-500">Your authentic experience guides fellow travelers</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setIsWriting(false)} 
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* RATING SELECTOR */}
          <div className="mb-5 p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                Your Overall Rating *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((score) => {
                  const active = (hoverRating || formRating) >= score;
                  return (
                    <button
                      key={score}
                      type="button"
                      onMouseEnter={() => setHoverRating(score)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setFormRating(score)}
                      className="p-1 transition-transform transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        size={30}
                        fill={active ? '#F59E0B' : 'none'}
                        stroke="#F59E0B"
                        strokeWidth={2}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-500 block font-medium">Selected Score:</span>
              <span className="text-sm font-extrabold text-amber-700">
                {ratingLabel(hoverRating || formRating)}
              </span>
            </div>
          </div>

          {/* TRAVELER TYPE PILLS */}
          <div className="mb-4">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Who did you travel with?
            </label>
            <div className="flex flex-wrap gap-2">
              {(['Couple', 'Family', 'Friends', 'Solo', 'Group'] as const).map((type) => {
                const isSelected = formTravelerType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormTravelerType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* NAME & LOCATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Verma"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Your City / Location
              </label>
              <input
                type="text"
                placeholder="e.g. Mumbai, Maharashtra"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* TITLE & DESCRIPTION */}
          <div className="mb-4">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Review Headline / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Magical desert safari and top sunset recommendations!"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="mb-5">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Detailed Feedback & Tips for Other Travelers *
            </label>
            <textarea
              required
              rows={4}
              placeholder="What made this itinerary special? Any specific day highlights, food tips, or pacing advice you loved?"
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              <span>{isSubmitting ? 'Publishing...' : 'Submit Review'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 4. FILTER & SORT CONTROLS */}
      <div className="flex items-center justify-between flex-wrap gap-3 my-4 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedFilter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          {([5, 4, 3, 2, 1] as const).map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setSelectedFilter(selectedFilter === star ? 'all' : star)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                selectedFilter === star
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{star}</span>
              <Star size={11} fill="currentColor" stroke="none" />
              <span>({ratingDistribution[star].count})</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold focus:outline-none focus:border-emerald-500"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* 5. REVIEWS LIST */}
      <div className="space-y-3.5 mt-4">
        {visibleReviews.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <MessageSquare size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">No reviews matching the selected filter</p>
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className="mt-2 text-xs text-emerald-600 font-bold hover:underline"
            >
              Reset Filter to All
            </button>
          </div>
        ) : (
          visibleReviews.map((rev) => {
            const initials = rev.userName
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();
            const helpfulActive = isReviewHelpful(rev.id);

            return (
              <div
                key={rev.id}
                className="p-4 sm:p-5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* USER INFO */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-extrabold text-xs flex items-center justify-center shadow shrink-0">
                      {initials || 'VT'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {rev.userName}
                        </span>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck size={11} className="text-emerald-600" />
                            Verified Traveler
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        {rev.userLocation && (
                          <span className="flex items-center gap-1">
                            <MapPin size={10} className="text-slate-400" />
                            {rev.userLocation}
                          </span>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={10} className="text-slate-400" />
                          {rev.date}
                        </span>
                        {rev.travelerType && (
                          <>
                            <span>•</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[10px]">
                              {rev.travelerType} Trip
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* STARS BADGE */}
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 shrink-0">
                    <Star size={13} fill="#F59E0B" stroke="#F59E0B" />
                    <span className="text-xs font-extrabold text-amber-900">
                      {rev.rating}.0
                    </span>
                  </div>
                </div>

                {/* REVIEW TITLE */}
                <h5 className="font-bold text-slate-900 text-sm mt-3 mb-1.5">
                  {rev.title}
                </h5>

                {/* REVIEW BODY */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {rev.comment}
                </p>

                {/* HELPFUL BUTTON */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => handleHelpfulClick(rev.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                      helpfulActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsUp size={12} className={helpfulActive ? 'text-emerald-600 fill-emerald-600' : 'text-slate-400'} />
                    <span>Helpful ({rev.helpfulCount || 0})</span>
                  </button>

                  <span className="text-[11px] text-slate-400">
                    Verified Itinerary Experience
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ItineraryReviewsSection;
