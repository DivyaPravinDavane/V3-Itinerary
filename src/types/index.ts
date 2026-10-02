export interface ItineraryDay {
  dayNumber: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  highlights: string[];
}

export interface HotelRecommendation {
  tier: 'Budget' | 'Comfort' | 'Luxury';
  name: string;
  rating: number;
  estPricePerNight: string;
  perks: string[];
}

export interface TravelAgent {
  id: string;
  agencyName: string;
  founderName: string;
  gstNumber: string;
  isVerified: boolean;
  yearsInBusiness: number;
  location: string;
  rating: number;
  reviewCount: number;
  phone: string;
  whatsapp: string;
  email: string;
  avatarUrl: string;
  itinerariesPublished: number;
}

export interface Itinerary {
  id: string;
  slug: string;
  destination: string;
  country: string;
  region: 'Domestic' | 'International';
  title: string;
  durationDays: number;
  durationNights: number;
  travelerType: 'Solo' | 'Couple' | 'Family' | 'Group' | 'Any';
  itineraryCountLabel: string;
  accessPrice: number; // Base 99
  gstAmount: number; // 17.82
  totalAccessPrice: number; // 116.82
  estimatedTripCost: number; // e.g. 45000
  rating: number;
  reviewCount: number;
  coverImage: string;
  galleryImages: string[];
  overview: string;
  bestTimeToVisit: string;
  agent: TravelAgent;
  days: ItineraryDay[];
  hotels: HotelRecommendation[];
  budgetBreakdown: {
    flights: number;
    accommodation: number;
    foodDining: number;
    activitiesSightseeing: number;
    localTransport: number;
  };
  inclusions: string[];
  exclusions: string[];
  isPopular?: boolean;
}

export interface OrderRecord {
  orderId: string;
  itineraryId: string;
  itineraryTitle: string;
  destination: string;
  amountPaid: number;
  date: string;
  paymentMethod: string;
  razorpayPaymentId: string;
  agentName: string;
  agentPhone: string;
  agentWhatsapp: string;
  agentEmail: string;
  customerAddress?: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  mobile: string;
  isLoggedIn: boolean;
  role?: 'customer' | 'admin' | 'agent';
  agentDetails?: Partial<TravelAgent> & {
    id?: string;
    agencyName?: string;
    agency_name?: string;
    founderName?: string;
    founder_name?: string;
    gstNumber?: string;
    gst_number?: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
    city?: string;
    state?: string;
    status?: string;
    logoUrl?: string;
    logo_url?: string;
    businessProofUrl?: string;
    business_proof_url?: string;
    experienceYears?: string;
    experience_years?: string;
  };
  preferredTravelType: string;
  preferredBudgetTier: string;
  savedItineraryIds: string[];
  purchasedOrders: OrderRecord[];
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: 'Domestic' | 'International';
  tagline?: string;
  description?: string;
  cover_image?: string;
  coverImage?: string;
  galleryImages?: string[];
  best_time_to_visit?: string;
  bestTimeToVisit?: string;
  itinerary_count?: number;
  itineraryCount?: number;
  starting_price?: number;
  startingPrice?: number;
  is_popular?: boolean;
  isPopular?: boolean;
  is_active?: boolean;
}
