import type { Itinerary, ItineraryReview } from '../types';

const STORAGE_KEY_REVIEWS_PREFIX = 'v3_itinerary_user_reviews_';
const STORAGE_KEY_RATING_OVERRIDES = 'v3_itinerary_rating_overrides';
const STORAGE_KEY_HELPFUL_PREFIX = 'v3_review_helpful_';

// Seed realistic curated reviews tailored to destinations
const CURATED_REVIEWS_POOL: Record<string, Array<{ name: string; location: string; rating: number; title: string; comment: string; travelerType: ItineraryReview['travelerType']; daysAgo: number }>> = {
  Dubai: [
    {
      name: 'Aditya & Neha Sharma',
      location: 'Mumbai',
      rating: 5,
      title: 'Flawless execution & desert safari was magical!',
      comment: 'The day-by-day plan was timed to perfection. The Marina dhow cruise was sensational and the morning Burj Khalifa tip saved us 2 hours of queuing. Truly verified advice!',
      travelerType: 'Couple',
      daysAgo: 4
    },
    {
      name: 'Dr. Rajiv Menon',
      location: 'Bengaluru',
      rating: 5,
      title: 'Saved our family thousands of dirhams',
      comment: 'Everything from the metro connections to the evening fountain view spots was spot on. Our kids loved the desert dune bashing. Highly recommended blueprint.',
      travelerType: 'Family',
      daysAgo: 11
    },
    {
      name: 'Kavita Deshmukh',
      location: 'Pune',
      rating: 4,
      title: 'Very practical and realistic schedule',
      comment: 'Most online itineraries are impossibly packed. This one gave us breathing room between sights and recommended great authentic local restaurants in Deira.',
      travelerType: 'Friends',
      daysAgo: 19
    }
  ],
  Goa: [
    {
      name: 'Siddharth Rao',
      location: 'Hyderabad',
      rating: 5,
      title: 'Best hidden beaches in South Goa discovered!',
      comment: 'Skip the generic tourist traps! The butterfly beach boat trip and secluded sundowner recommendations in this itinerary made our vacation unforgettable.',
      travelerType: 'Couple',
      daysAgo: 3
    },
    {
      name: 'Ananya Roy',
      location: 'Kolkata',
      rating: 5,
      title: 'Perfect mix of parties and serene heritage',
      comment: 'The Fontainhas Latin Quarter walking route and spice plantation lunch were highlights. The rental scooter and cab fare guidance was 100% accurate.',
      travelerType: 'Solo',
      daysAgo: 9
    },
    {
      name: 'Varun Grover',
      location: 'Delhi NCR',
      rating: 4,
      title: 'Great family itinerary for first timers',
      comment: 'Traveling with elderly parents can be challenging, but the pacing suggested for Old Goa churches and sunset cruise was super relaxed and enjoyable.',
      travelerType: 'Family',
      daysAgo: 15
    }
  ],
  Kashmir: [
    {
      name: 'Farhan & Sana',
      location: 'Lucknow',
      rating: 5,
      title: 'A true paradise on earth made effortless',
      comment: 'The Shikara sunrise ride timing and Gulmarg Phase 2 gondola pass tips were invaluable. Local driver contact provided by the agency was polite and knowledgeable.',
      travelerType: 'Couple',
      daysAgo: 2
    },
    {
      name: 'Pooja Agarwal',
      location: 'Jaipur',
      rating: 5,
      title: 'Pahalgam and Betaab valley tips were gold',
      comment: 'The houseboat stay recommendation in Nigeen lake was so quiet compared to Dal lake. Felt safe, well-guided, and authentic throughout.',
      travelerType: 'Family',
      daysAgo: 8
    }
  ],
  Bali: [
    {
      name: 'Rohan Mehra',
      location: 'Bengaluru',
      rating: 5,
      title: 'Ubud cultural trail & Nusa Penida day trip was 10/10',
      comment: 'The speedboat booking guidance and sunrise trekking at Mount Batur were clearly detailed. Never felt lost or overcharged anywhere.',
      travelerType: 'Friends',
      daysAgo: 5
    },
    {
      name: 'Sneha Patel',
      location: 'Ahmedabad',
      rating: 5,
      title: 'Romantic sunsets and private pool villa recommendations',
      comment: 'Everything was curated with genuine taste. Seminyak beach clubs and Uluwatu temple fire dance timings were exact.',
      travelerType: 'Couple',
      daysAgo: 14
    }
  ]
};

// Generic fallback curated reviews for any destination
const GENERIC_REVIEWS_POOL = [
  {
    name: 'Priyanka Chopra',
    location: 'Chandigarh',
    rating: 5,
    title: 'Extremely detailed and practical daily schedule',
    comment: 'Having the day divided into morning, afternoon, and evening with estimated transit times made our holiday completely stress-free. The downloadable PDF was super handy offline!',
    travelerType: 'Family' as const,
    daysAgo: 6
  },
  {
    name: 'Aakash Verma',
    location: 'Chennai',
    rating: 5,
    title: 'Verified advice that saved us time and money',
    comment: 'The insider tips for ticket bookings and best photo vantage points made all the difference. Booking this ₹99 blueprint was the best travel decision we made.',
    travelerType: 'Couple' as const,
    daysAgo: 12
  },
  {
    name: 'Meera Iyer',
    location: 'Kochi',
    rating: 4,
    title: 'Honest recommendations and great food suggestions',
    comment: 'The local cafe and hidden viewpoints suggestions were delightful. Great balance between top tourist highlights and calm cultural spots.',
    travelerType: 'Solo' as const,
    daysAgo: 18
  }
];

function formatDateFromDaysAgo(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Get all reviews for an itinerary (Curated baseline + User submitted reviews)
 */
export function getItineraryReviews(itinerary: Itinerary): ItineraryReview[] {
  if (!itinerary || !itinerary.id) return [];

  // 1. Get user submitted reviews from localStorage
  let userReviews: ItineraryReview[] = [];
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_REVIEWS_PREFIX}${itinerary.id}`);
    if (raw) {
      userReviews = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load user reviews from storage:', e);
  }

  // 2. Generate curated base reviews for this itinerary
  const destKey = Object.keys(CURATED_REVIEWS_POOL).find(
    (k) => itinerary.destination?.toLowerCase().includes(k.toLowerCase()) || 
           itinerary.country?.toLowerCase().includes(k.toLowerCase())
  );

  const pool = destKey ? CURATED_REVIEWS_POOL[destKey] : GENERIC_REVIEWS_POOL;

  const baseReviews: ItineraryReview[] = pool.map((item, idx) => ({
    id: `curated-${itinerary.id}-${idx}`,
    itineraryId: itinerary.id,
    userName: item.name,
    userLocation: item.location,
    rating: item.rating,
    title: item.title,
    comment: item.comment,
    date: formatDateFromDaysAgo(item.daysAgo),
    travelerType: item.travelerType,
    verifiedPurchase: true,
    helpfulCount: 4 + (idx * 3)
  }));

  // User reviews first (newest), followed by curated base reviews
  return [...userReviews, ...baseReviews];
}

/**
 * Get effective dynamic rating and count for an itinerary
 */
export function getEffectiveRatingAndCount(itinerary: Itinerary): { rating: number; reviewCount: number } {
  if (!itinerary) return { rating: 4.8, reviewCount: 120 };

  try {
    const rawOverrides = localStorage.getItem(STORAGE_KEY_RATING_OVERRIDES);
    if (rawOverrides) {
      const overrides = JSON.parse(rawOverrides);
      if (overrides[itinerary.id]) {
        return {
          rating: overrides[itinerary.id].rating,
          reviewCount: overrides[itinerary.id].reviewCount
        };
      }
    }
  } catch (e) {
    // Ignore
  }

  return {
    rating: itinerary.rating || 4.8,
    reviewCount: itinerary.reviewCount || 95
  };
}

/**
 * Add a new traveler review for an itinerary
 */
export function addItineraryReview(
  itinerary: Itinerary,
  reviewInput: {
    userName: string;
    userLocation?: string;
    rating: number;
    title: string;
    comment: string;
    travelerType: ItineraryReview['travelerType'];
  }
): { reviews: ItineraryReview[]; newRating: number; newReviewCount: number; newReview: ItineraryReview } {
  const newReview: ItineraryReview = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    itineraryId: itinerary.id,
    userName: reviewInput.userName.trim() || 'Verified Traveler',
    userLocation: reviewInput.userLocation?.trim() || 'India',
    rating: Math.min(5, Math.max(1, reviewInput.rating)),
    title: reviewInput.title.trim(),
    comment: reviewInput.comment.trim(),
    date: 'Just now',
    travelerType: reviewInput.travelerType || 'Solo',
    verifiedPurchase: true,
    helpfulCount: 0
  };

  // 1. Read existing user reviews
  let userReviews: ItineraryReview[] = [];
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_REVIEWS_PREFIX}${itinerary.id}`);
    if (raw) {
      userReviews = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse user reviews', e);
  }

  userReviews.unshift(newReview);

  try {
    localStorage.setItem(
      `${STORAGE_KEY_REVIEWS_PREFIX}${itinerary.id}`,
      JSON.stringify(userReviews)
    );
  } catch (e) {
    console.error('Failed to save review to localStorage', e);
  }

  // 2. Compute new rating and reviewCount
  const current = getEffectiveRatingAndCount(itinerary);
  const newReviewCount = current.reviewCount + 1;
  const weightedSum = (current.rating * current.reviewCount) + newReview.rating;
  const newRating = parseFloat((weightedSum / newReviewCount).toFixed(1));

  // 3. Save rating override
  try {
    const rawOverrides = localStorage.getItem(STORAGE_KEY_RATING_OVERRIDES);
    const overrides = rawOverrides ? JSON.parse(rawOverrides) : {};
    overrides[itinerary.id] = {
      rating: newRating,
      reviewCount: newReviewCount
    };
    localStorage.setItem(STORAGE_KEY_RATING_OVERRIDES, JSON.stringify(overrides));
  } catch (e) {
    console.error('Failed to save rating override', e);
  }

  // 4. Dispatch browser event for live real-time sync across all components
  try {
    window.dispatchEvent(
      new CustomEvent('v3:review_added', {
        detail: {
          itineraryId: itinerary.id,
          review: newReview,
          newRating,
          newReviewCount
        }
      })
    );
  } catch (e) {
    // Ignore in non-browser env
  }

  const allReviews = getItineraryReviews(itinerary);

  return {
    reviews: allReviews,
    newRating,
    newReviewCount,
    newReview
  };
}

/**
 * Increment helpful count for a review
 */
export function toggleReviewHelpful(reviewId: string): boolean {
  try {
    const key = `${STORAGE_KEY_HELPFUL_PREFIX}${reviewId}`;
    const hasVoted = localStorage.getItem(key);
    if (hasVoted) {
      localStorage.removeItem(key);
      return false;
    } else {
      localStorage.setItem(key, '1');
      return true;
    }
  } catch (e) {
    return false;
  }
}

export function isReviewHelpful(reviewId: string): boolean {
  try {
    return !!localStorage.getItem(`${STORAGE_KEY_HELPFUL_PREFIX}${reviewId}`);
  } catch (e) {
    return false;
  }
}
