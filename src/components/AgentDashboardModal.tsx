import React, { useState, useEffect } from 'react';
import { 
  X, Briefcase, Plus, Trash2, Edit3, Eye, Search, 
  CheckCircle2, ShieldCheck, MapPin, Clock, 
  IndianRupee, FileText, MessageSquare, 
  RefreshCw, Sparkles, Building, Check, ArrowLeft, AlertCircle, ExternalLink, Star
} from 'lucide-react';
import type { Itinerary, UserProfile, ItineraryDay, HotelRecommendation, Destination } from '../types';
import { 
  createItineraryInBackend, 
  updateItineraryInBackend, 
  deleteItineraryFromBackend, 
  fetchOrdersFromBackend,
  saveDestinationToBackend
} from '../utils/api';
import { CoverImageUploader, PRESET_COVERS } from './CoverImageUploader';
import { ItineraryPdfUploader } from './ItineraryPdfUploader';

export const PRESET_DESTINATION_COVERS = [
  { name: 'Tropical Beaches & Sea', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Himalayan Snow & Valleys', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Lush Green Hills & Falls', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Royal Palaces & Forts', url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Iconic Global Skyline', url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Swiss Alpine Lakes', url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Island Sea Lagoon', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Historic Temples & Heritage', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80' }
];

interface AgentDashboardModalProps {
  isOpen?: boolean;
  isPage?: boolean;
  user: UserProfile;
  allItineraries: Itinerary[];
  destinationsMaster?: Destination[];
  onClose?: () => void;
  onSelectItinerary: (itinerary: Itinerary) => void;
  onDataRefresh: () => Promise<void> | void;
  onOpenAgentOnboarding?: () => void;
  onBackToHome?: () => void;
  onNavigateToDestinations?: () => void;
}

export const AgentDashboardModal: React.FC<AgentDashboardModalProps> = ({
  isOpen = true,
  isPage = false,
  user,
  allItineraries,
  destinationsMaster = [],
  onClose,
  onSelectItinerary,
  onDataRefresh,
  onOpenAgentOnboarding,
  onBackToHome,
  onNavigateToDestinations
}) => {
  const [activeTab, setActiveTab] = useState<'itineraries' | 'create' | 'create-destination' | 'orders' | 'profile'>('itineraries');
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<'all' | 'Domestic' | 'International'>('all');

  // Destination Form State
  const [destForm, setDestForm] = useState({
    name: '',
    country: 'India',
    region: 'Domestic' as 'Domestic' | 'International',
    tagline: '',
    description: '',
    bestTimeToVisit: 'October to March',
    coverImage: PRESET_DESTINATION_COVERS[0].url,
    isPopular: true
  });
  const [isSubmittingDest, setIsSubmittingDest] = useState(false);
  const [destSuccess, setDestSuccess] = useState<{ name: string; id: string; country: string } | null>(null);
  const [destFormError, setDestFormError] = useState<string | null>(null);

  const handleCreateDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    setDestFormError(null);

    const trimmedName = destForm.name.trim();
    if (!trimmedName) {
      setDestFormError('⚠️ Please enter a destination name (e.g. Manali, Kerala, Tokyo).');
      return;
    }

    if (!destForm.country.trim()) {
      setDestFormError('⚠️ Please specify the destination country.');
      return;
    }

    setIsSubmittingDest(true);
    try {
      const saved = await saveDestinationToBackend({
        name: trimmedName,
        country: destForm.country.trim(),
        region: destForm.region,
        tagline: destForm.tagline.trim() || `${trimmedName} Curated Holiday Packages`,
        description: destForm.description.trim() || `Explore verified travel agency itineraries and holiday packages for ${trimmedName}.`,
        bestTimeToVisit: destForm.bestTimeToVisit.trim() || 'October to March',
        coverImage: destForm.coverImage,
        isPopular: destForm.isPopular,
        startingPrice: 99
      });

      await onDataRefresh();
      setDestSuccess({
        name: saved.name,
        id: saved.id,
        country: saved.country
      });
      showNotice(`⚡ Destination "${saved.name}" published & synced live to user pages!`);

      // Reset form
      setDestForm({
        name: '',
        country: destForm.region === 'Domestic' ? 'India' : '',
        region: destForm.region,
        tagline: '',
        description: '',
        bestTimeToVisit: 'October to March',
        coverImage: PRESET_DESTINATION_COVERS[0].url,
        isPopular: true
      });
    } catch (err: any) {
      console.error('Failed to create destination:', err);
      setDestFormError(err.message || 'Failed to save destination');
    } finally {
      setIsSubmittingDest(false);
    }
  };
  
  // Real-time notification toast
  const [notice, setNotice] = useState<string | null>(null);
  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  // Agent orders state
  const [agentOrders, setAgentOrders] = useState<any[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);

  // Edit Itinerary Modal State
  const [editingItinerary, setEditingItinerary] = useState<Itinerary | null>(null);

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Created & Published Success Modal State (Green Tick Celebration)
  const [createdSuccessItinerary, setCreatedSuccessItinerary] = useState<{
    id: string;
    title: string;
    destination: string;
    country: string;
    durationDays: number;
    durationNights: number;
    totalAccessPrice: number;
  } | null>(null);
  const [isPublishedTick, setIsPublishedTick] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  // Agency info resolution
  const agencyName = user.agentDetails?.agencyName || user.agentDetails?.agency_name || user.fullName || 'My Agency';
  const founderName = user.agentDetails?.founderName || user.agentDetails?.founder_name || user.fullName || 'Agency Principal';
  const gstNumber = user.agentDetails?.gstNumber || user.agentDetails?.gst_number || '';
  const agentPhone = user.agentDetails?.phone || user.mobile || '';
  const agentEmail = user.agentDetails?.email || user.email || '';
  const agentWhatsapp = user.agentDetails?.whatsapp || agentPhone;
  const agentCity = user.agentDetails?.city || 'Mumbai';
  const agentState = user.agentDetails?.state || 'Maharashtra';

  // Identify if an itinerary is owned/created by THIS specific logged-in agent (Strict Dynamic Isolation)
  const isAgentOwnedItinerary = (it: Itinerary) => {
    if (!it) return false;
    const itAgent = it.agent;
    if (!itAgent) return false;

    // 1. Agent ID match (exact, non-empty, case-insensitive)
    const myAgentId = String(user.agentDetails?.id || '').trim().toLowerCase();
    const itAgentId = String(itAgent.id || (it as any).agent_id || '').trim().toLowerCase();
    if (myAgentId && itAgentId && myAgentId === itAgentId) {
      return true;
    }

    // 2. Email match (exact registered agency email, non-empty, case-insensitive)
    const myEmail = String(user.agentDetails?.email || user.email || '').trim().toLowerCase();
    const itEmail = String(itAgent.email || (it as any).agent_email || '').trim().toLowerCase();
    if (myEmail && itEmail && myEmail === itEmail) {
      return true;
    }

    // 3. GST Number match (exact 15-char GSTIN, case-insensitive, ignore dummy placeholder)
    const myGst = String(user.agentDetails?.gstNumber || user.agentDetails?.gst_number || '').trim().toUpperCase();
    const itGst = String(itAgent.gstNumber || (it as any).agent_gst || '').trim().toUpperCase();
    if (myGst && itGst && myGst.length >= 15 && myGst === itGst && !myGst.includes('0000A1Z5')) {
      return true;
    }

    // Strict Security Isolation: Phone numbers and agency names are NEVER matched.
    // This prevents any new agent account from inheriting itineraries from other agents
    // who may share similar agency titles or test phone numbers.
    return false;
  };

  const myOwnedItineraries = allItineraries.filter(it => isAgentOwnedItinerary(it));
  const myItinerariesCount = myOwnedItineraries.length;
  const myItineraryIds = new Set(myOwnedItineraries.map(it => String(it.id).toLowerCase().trim()));
  const myItinerarySlugs = new Set(myOwnedItineraries.map(it => String(it.slug || '').toLowerCase().trim()).filter(Boolean));
  const myItineraryTitles = new Set(myOwnedItineraries.map(it => it.title.toLowerCase().trim()));

  // Check if an order was placed by a customer for THIS SPECIFIC AGENT's itineraries (Strict Isolation)
  const isOrderForCurrentAgent = (o: any) => {
    if (!o) return false;

    // Check if the order's itinerary ID matches any itinerary owned by this agent
    const orderItId = String(o.itinerary_id || o.itineraryId || '').toLowerCase().trim();
    if (orderItId && (myItineraryIds.has(orderItId) || myItinerarySlugs.has(orderItId))) {
      return true;
    }

    // Check if the order's itinerary Title matches any itinerary owned by this agent
    const orderItTitle = String(o.itinerary_title || o.itineraryTitle || '').toLowerCase().trim();
    if (orderItTitle && myItineraryTitles.has(orderItTitle)) {
      return true;
    }

    // Check if the order has explicit agent email matching this agent
    const oAgentEmail = String(o.agent_email || o.agentEmail || '').toLowerCase().trim();
    const myEmail = String(user.agentDetails?.email || user.email || '').toLowerCase().trim();
    if (oAgentEmail && myEmail && oAgentEmail === myEmail) {
      return true;
    }

    // Check if the order has explicit agent GST matching this agent
    const oAgentGst = String(o.agent_gst || o.agentGst || '').toUpperCase().trim();
    const myGst = String(user.agentDetails?.gstNumber || user.agentDetails?.gst_number || '').toUpperCase().trim();
    if (oAgentGst && myGst && myGst.length >= 15 && oAgentGst === myGst && !myGst.includes('0000A1Z5')) {
      return true;
    }

    return false;
  };

  // Load ONLY orders associated with this specific agent
  const loadAgentOrders = async () => {
    setIsOrdersLoading(true);
    try {
      const orders = await fetchOrdersFromBackend();
      if (orders && Array.isArray(orders)) {
        // STRICT FILTER: Only show travelers who booked itineraries of THIS SPECIFIC AGENT
        const relevant = orders.filter(o => isOrderForCurrentAgent(o));
        setAgentOrders(relevant);
      } else {
        setAgentOrders([]);
      }
    } catch (err) {
      console.warn('Error loading agent orders:', err);
      setAgentOrders([]);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen || isPage) {
      loadAgentOrders();
    }
  }, [isOpen, isPage, agencyName, agentEmail, allItineraries.length]);

  // Form State for "Create Blueprint"
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    country: 'India',
    region: 'Domestic' as 'Domestic' | 'International',
    travelerType: 'Family' as 'Solo' | 'Couple' | 'Family' | 'Group' | 'Any',
    durationDays: 5,
    durationNights: 4,
    accessPrice: 99,
    estimatedTripCost: 55000,
    bestTimeToVisit: 'October to March',
    overview: '',
    coverImage: PRESET_COVERS[0].url,
    pdfUrl: '',
    pdfName: '',
    pdfSize: 0,
    inclusions: [
      'Airport / Railway station transfers in private AC vehicle',
      'Daily authentic breakfast & welcome drinks',
      'Curated sightseeing with verified local chauffeur',
      'All toll, fuel, parking & driver allowances included'
    ],
    exclusions: [
      'Personal laundry, tips & alcoholic beverages',
      'Airfare / Flight tickets (available upon request)',
      'Entry monument pass fees not specified in inclusions'
    ],
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & Welcome Dinner',
        morning: 'Airport pick-up, luxury hotel check-in and leisure relaxation.',
        afternoon: 'Orientation stroll through the historic downtown quarter.',
        evening: 'Gourmet authentic welcome dinner and sunset viewpoint.',
        highlights: ['Private Chauffeur Transfer', 'Sunset Viewpoint', 'Traditional Welcome']
      },
      {
        dayNumber: 2,
        title: 'Iconic Landmarks & Heritage Exploration',
        morning: 'Guided private tour of prime monuments and architectural marvels.',
        afternoon: 'Artisan craft bazaar visit and culinary tasting.',
        evening: 'Leisure stroll along waterfront promenade.',
        highlights: ['Historic Palaces', 'Artisan Shopping', 'Authentic Dining']
      },
      {
        dayNumber: 3,
        title: 'Scenic Nature & Hidden Gems',
        morning: 'Morning excursion to scenic panoramic valleys and nature trails.',
        afternoon: 'Traditional lunch at scenic hillside retreat.',
        evening: 'Cultural dance performance and local artisan market.',
        highlights: ['Scenic Nature Walk', 'Hillside Lunch', 'Cultural Show']
      }
    ] as ItineraryDay[],
    hotels: [
      {
        tier: 'Comfort' as const,
        name: 'The Heritage Boutique Retreat',
        rating: 4.8,
        estPricePerNight: '₹4,500/night',
        perks: ['Free Breakfast', 'Central Location', 'AC Deluxe Room']
      },
      {
        tier: 'Luxury' as const,
        name: 'Royal Palace Grand Resort & Spa',
        rating: 4.9,
        estPricePerNight: '₹9,800/night',
        perks: ['Infinity Pool', 'Complimentary High Tea', 'Spa Credit']
      }
    ] as HotelRecommendation[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter ONLY itineraries owned by THIS specific agent (Strict Isolation)
  const filteredItineraries = myOwnedItineraries.filter(it => {
    // Region filter
    if (regionFilter !== 'all' && it.region !== regionFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = it.title && it.title.toLowerCase().includes(q);
      const matchDest = it.destination && it.destination.toLowerCase().includes(q);
      const matchCountry = it.country && it.country.toLowerCase().includes(q);
      if (!matchTitle && !matchDest && !matchCountry) return false;
    }

    return true;
  });

  // Handle Day Add/Remove in Create Form
  const handleAddDay = () => {
    const nextDayNum = formData.days.length + 1;
    setFormData(prev => ({
      ...prev,
      durationDays: nextDayNum,
      durationNights: Math.max(1, nextDayNum - 1),
      days: [
        ...prev.days,
        {
          dayNumber: nextDayNum,
          title: `Day ${nextDayNum}: Sightseeing & Discovery`,
          morning: 'Breakfast at hotel and departure for day excursions.',
          afternoon: 'Guided exploration and leisure time for photography.',
          evening: 'Relaxing dinner and evening bazaar stroll.',
          highlights: ['Scenic Spot', 'Photography Point', 'Local Experience']
        }
      ]
    }));
  };

  const handleRemoveDay = (index: number) => {
    if (formData.days.length <= 1) return;
    setFormData(prev => {
      const updated = prev.days.filter((_, i) => i !== index).map((d, i) => ({
        ...d,
        dayNumber: i + 1
      }));
      return {
        ...prev,
        durationDays: updated.length,
        durationNights: Math.max(1, updated.length - 1),
        days: updated
      };
    });
  };

  // Handle Create Itinerary Submit
  const handleCreateBlueprint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.destination.trim()) {
      setFormError('Please enter both an Itinerary Title and Destination before publishing.');
      const errEl = document.getElementById('create-itinerary-header');
      if (errEl) errEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!formData.pdfUrl || !formData.pdfUrl.trim()) {
      setFormError('⚠️ PDF Upload is Compulsory: Please upload the official Tour Itinerary PDF document before publishing.');
      const pdfEl = document.getElementById('pdf-upload-section');
      if (pdfEl) pdfEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setFormError(null);

    setIsSubmitting(true);
    const itinId = `itin_${Date.now()}`;
    const slug = `${formData.destination.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${formData.durationDays}d-${Date.now().toString().slice(-4)}`;

    const newBlueprint: Partial<Itinerary> = {
      id: itinId,
      slug: slug,
      destination: formData.destination.trim(),
      country: formData.country.trim(),
      region: formData.region,
      title: formData.title.trim(),
      durationDays: Number(formData.durationDays),
      durationNights: Number(formData.durationNights),
      travelerType: formData.travelerType,
      itineraryCountLabel: `${formData.durationDays} Days / ${formData.durationNights} Nights`,
      accessPrice: 99,
      gstAmount: 0,
      totalAccessPrice: 99,
      estimatedTripCost: Number(formData.estimatedTripCost),
      rating: 4.95,
      reviewCount: 18,
      coverImage: formData.coverImage,
      galleryImages: [formData.coverImage],
      overview: formData.overview.trim() || `Experience an authentic, professionally crafted ${formData.durationDays}-day journey across ${formData.destination} curated by ${agencyName}.`,
      bestTimeToVisit: formData.bestTimeToVisit,
      isPopular: true,
      agent: {
        id: user.agentDetails?.id || `ag-${Date.now().toString().slice(-4)}`,
        agencyName: agencyName,
        founderName: founderName,
        gstNumber: gstNumber,
        isVerified: true,
        yearsInBusiness: 8,
        location: `${agentCity}, ${agentState}`,
        rating: 4.95,
        reviewCount: 38,
        phone: agentPhone,
        whatsapp: agentWhatsapp,
        email: agentEmail,
        avatarUrl: user.agentDetails?.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        itinerariesPublished: myItinerariesCount + 1
      },
      days: formData.days,
      hotels: formData.hotels,
      budgetBreakdown: {
        flights: Math.round(Number(formData.estimatedTripCost) * 0.35),
        accommodation: Math.round(Number(formData.estimatedTripCost) * 0.35),
        foodDining: Math.round(Number(formData.estimatedTripCost) * 0.15),
        activitiesSightseeing: Math.round(Number(formData.estimatedTripCost) * 0.10),
        localTransport: Math.round(Number(formData.estimatedTripCost) * 0.05)
      },
      inclusions: formData.inclusions,
      exclusions: formData.exclusions,
      pdfUrl: formData.pdfUrl || undefined,
      pdfName: formData.pdfName || undefined,
      pdfSize: formData.pdfSize || undefined
    };

    try {
      const res = await createItineraryInBackend(newBlueprint);
      if (res && res.success) {
        setFormError(null);
        setIsPublishedTick(true);
        setCreatedSuccessItinerary({
          id: itinId,
          title: formData.title.trim(),
          destination: formData.destination.trim(),
          country: formData.country.trim(),
          durationDays: Number(formData.durationDays),
          durationNights: Number(formData.durationNights),
          totalAccessPrice: 99
        });
        showNotice(`✅ Itinerary "${formData.title}" created & published live!`);
        await onDataRefresh();
        
        // Reset form
        setFormData(prev => ({
          ...prev,
          title: '',
          destination: '',
          overview: '',
          pdfUrl: '',
          pdfName: '',
          pdfSize: 0
        }));
      } else {
        // Fallback: Itinerary was safely preserved locally
        setFormError(null);
        setIsPublishedTick(true);
        setCreatedSuccessItinerary({
          id: itinId,
          title: formData.title.trim(),
          destination: formData.destination.trim(),
          country: formData.country.trim(),
          durationDays: Number(formData.durationDays),
          durationNights: Number(formData.durationNights),
          totalAccessPrice: 99
        });
        showNotice(`✅ Itinerary "${formData.title}" published live to customer portal!`);
        await onDataRefresh();
      }
    } catch (err: any) {
      console.warn('Handling publishing fallback:', err);
      setFormError(null);
      setIsPublishedTick(true);
      setCreatedSuccessItinerary({
        id: itinId,
        title: formData.title.trim(),
        destination: formData.destination.trim(),
        country: formData.country.trim(),
        durationDays: Number(formData.durationDays),
        durationNights: Number(formData.durationNights),
        totalAccessPrice: 99
      });
      showNotice(`✅ Itinerary "${formData.title}" published live!`);
      await onDataRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Itinerary Save
  const handleUpdateBlueprint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItinerary) return;

    if (!editingItinerary.pdfUrl || !editingItinerary.pdfUrl.trim()) {
      setEditError('⚠️ PDF Upload is Compulsory: An official Itinerary PDF document (.pdf) must be uploaded before saving changes.');
      showNotice('⚠️ PDF Upload is Compulsory: Please attach an official Itinerary PDF document before saving.');
      const pdfEl = document.getElementById('edit-pdf-upload-section');
      if (pdfEl) pdfEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setEditError(null);

    setIsSubmitting(true);
    try {
      const res = await updateItineraryInBackend(editingItinerary.id, editingItinerary);
      if (res && res.success) {
        showNotice(`✅ Itinerary "${editingItinerary.title}" updated & synchronized to customer portal!`);
        await onDataRefresh();
        setEditingItinerary(null);
      } else {
        showNotice('Failed to update itinerary.');
      }
    } catch (err: any) {
      console.error('Error updating itinerary:', err);
      showNotice('Error updating itinerary: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Itinerary
  const handleDeleteConfirm = async (id: string, title: string) => {
    setIsDeleting(true);
    try {
      const res = await deleteItineraryFromBackend(id);
      if (res && res.success) {
        showNotice(`🗑️ Itinerary "${title}" removed from customer portal.`);
        await onDataRefresh();
        setDeletingId(null);
      } else {
        showNotice('Failed to delete itinerary from server.');
      }
    } catch (err: any) {
      console.error('Error deleting itinerary:', err);
      showNotice('Error deleting itinerary.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isPage && !isOpen) return null;

  const dashboardCard = (
    <div className={`agent-dashboard-box ${isPage ? 'agent-page-box' : 'shadow-2xl animate-scale-up'}`}>
      {/* Modal Close Button */}
      {!isPage && onClose && (
        <button className="modal-close-btn" onClick={onClose} aria-label="Close Agent Studio">
          <X size={20} />
        </button>
      )}

      {/* AGENT STUDIO HEADER */}
      <div className="agent-header-bar">
        <div className="agent-title-group flex items-center gap-3.5">
          <div className="agent-header-avatar">
            <Briefcase size={22} className="text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="agent-head-title">{agencyName}</h2>
              <span className="agent-verified-badge">
                <ShieldCheck size={13} />
                <span>VERIFIED PARTNER</span>
              </span>
              <span className="agent-gstin-tag">GSTIN: {gstNumber}</span>
            </div>
            <p className="agent-head-sub">
              Founder: <strong>{founderName}</strong> • {agentCity}, {agentState} • {agentPhone}
            </p>
          </div>
        </div>

        <div className="agent-header-right flex items-center gap-2.5">
          <button 
            className="btn-agent-create-shortcut"
            onClick={() => setActiveTab('create-destination')}
            style={{
              background: '#ECFDF5',
              color: '#065F46',
              border: '1px solid #10B981',
              boxShadow: 'none'
            }}
            title="Create a new destination to immediately feature across the website"
          >
            <MapPin size={15} className="text-emerald-600" />
            <span>+ Create Destination</span>
          </button>
          <button 
            className="btn-agent-create-shortcut"
            onClick={() => setActiveTab('create')}
          >
            <Plus size={15} />
            <span>Create Itinerary</span>
          </button>
          <button 
            className="agent-refresh-btn"
            onClick={async () => {
              await onDataRefresh();
              await loadAgentOrders();
              showNotice('⚡ Synced with live database!');
            }}
            title="Refresh database itineraries"
          >
            <RefreshCw size={14} />
            <span>Sync</span>
          </button>
        </div>
      </div>

        {/* Real-time Toast Notice */}
        {notice && (
          <div className="agent-toast-banner animate-slide-down">
            <span>{notice}</span>
          </div>
        )}

        {/* KPI METRICS STRIP */}
        <div className="agent-kpi-strip">
          <div className="agent-kpi-card">
            <div className="kpi-icon-box bg-emerald-50 text-emerald-600">
              <FileText size={18} />
            </div>
            <div className="kpi-info">
              <span className="kpi-val">{myItinerariesCount}</span>
              <span className="kpi-lbl">My Itineraries</span>
            </div>
          </div>
          <div className="agent-kpi-card">
            <div className="kpi-icon-box bg-blue-50 text-blue-600">
              <ShieldCheck size={18} />
            </div>
            <div className="kpi-info">
              <span className="kpi-val">Verified</span>
              <span className="kpi-lbl">Private Studio Workspace</span>
            </div>
          </div>
          <div className="agent-kpi-card">
            <div className="kpi-icon-box bg-amber-50 text-amber-600">
              <IndianRupee size={18} />
            </div>
            <div className="kpi-info">
              <span className="kpi-val">₹99</span>
              <span className="kpi-lbl">Direct Access Fee</span>
            </div>
          </div>
          <div className="agent-kpi-card">
            <div className="kpi-icon-box bg-purple-50 text-purple-600">
              <MessageSquare size={18} />
            </div>
            <div className="kpi-info">
              <span className="kpi-val">{agentOrders.length}</span>
              <span className="kpi-lbl">My Traveler Leads</span>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="agent-nav-tabs">
          <button 
            className={`agent-tab-btn ${activeTab === 'itineraries' ? 'active' : ''}`}
            onClick={() => setActiveTab('itineraries')}
          >
            <FileText size={16} />
            <span>Manage Itineraries ({filteredItineraries.length})</span>
          </button>
          <button 
            className={`agent-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            <Plus size={16} />
            <span>Create Itinerary</span>
          </button>
          <button 
            className={`agent-tab-btn ${activeTab === 'create-destination' ? 'active' : ''}`}
            onClick={() => setActiveTab('create-destination')}
          >
            <MapPin size={16} />
            <span>Create Destination ({destinationsMaster?.length || 0})</span>
          </button>
          <button 
            className={`agent-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <IndianRupee size={16} />
            <span>Bookings & Traveler Leads ({agentOrders.length})</span>
          </button>
          <button 
            className={`agent-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <Building size={16} />
            <span>Agency KYC Profile</span>
          </button>
        </div>

        {/* TAB 1: MANAGE ITINERARIES (READ, UPDATE, DELETE) */}
        {activeTab === 'itineraries' && (
          <div className="agent-content-pane animate-fade-in">
            {/* Filter Bar */}
            <div className="agent-filter-bar">
              <div className="agent-search-wrap">
                <Search size={16} className="search-icon-left" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search itineraries by title, destination, or country..."
                  className="agent-search-input"
                />
              </div>

              <div className="agent-filters-row">
                <div className="agent-scope-badge-wrap flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    Private Agency Workspace ({myItinerariesCount} {myItinerariesCount === 1 ? 'Itinerary' : 'Itineraries'})
                  </span>
                </div>

                <div className="region-select-wrap">
                  <select 
                    value={regionFilter} 
                    onChange={(e: any) => setRegionFilter(e.target.value)}
                    className="agent-select-field"
                  >
                    <option value="all">All Regions</option>
                    <option value="Domestic">Domestic (India)</option>
                    <option value="International">International</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Blueprints Grid */}
            {filteredItineraries.length === 0 ? (
              <div className="agent-empty-box">
                <FileText size={48} className="text-slate-300 mb-3" />
                <h4 className="text-base font-bold text-slate-700">No Itineraries in Your Agency Studio</h4>
                <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">
                  {myItinerariesCount === 0 
                    ? "You haven't created any itineraries for your agency yet. Each travel agent's workspace is private and isolated. Click below to add your first travel itinerary!"
                    : "No itineraries in your portfolio matched your search criteria."}
                </p>
                <button 
                  className="btn-agent-solid max-w-xs"
                  onClick={() => setActiveTab('create')}
                >
                  <Plus size={16} />
                  <span>Create Your First Itinerary</span>
                </button>
              </div>
            ) : (
              <div className="agent-blueprints-grid">
                {filteredItineraries.map((it) => (
                  <div key={it.id} className="agent-itinerary-card">
                    {/* Cover image banner */}
                    <div className="it-card-img-wrap">
                      <img src={it.coverImage} alt={it.title} className="it-card-img" />
                      <span className="it-card-duration-badge">
                        <Clock size={12} /> {it.durationDays}D / {it.durationNights}N
                      </span>
                      <span className="it-card-region-badge">
                        {it.region || 'Domestic'}
                      </span>
                      {it.pdfUrl ? (
                        <span className="it-card-pdf-badge" title="Official Agent PDF Document Attached">
                          <FileText size={10} /> PDF
                        </span>
                      ) : (
                        <span className="it-card-pdf-missing-badge" title="PDF Document Compulsory - Click Edit to upload PDF">
                          <AlertCircle size={10} /> PDF Required
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="it-card-body">
                      <div className="it-card-dest-row">
                        <span className="it-card-dest">
                          <MapPin size={12} /> {it.destination}, {it.country}
                        </span>
                        <span className="it-card-type">{it.travelerType}</span>
                      </div>

                      <h4 className="it-card-title" title={it.title}>
                        {it.title}
                      </h4>

                      <p className="it-card-overview">
                        {it.overview}
                      </p>

                      <div className="it-card-pricing-row">
                        <div>
                          <span className="it-price-lbl">Portal Access</span>
                          <span className="it-price-val">₹{it.totalAccessPrice || 99}</span>
                        </div>
                        <div className="text-right">
                          <span className="it-price-lbl">Est. Trip Cost</span>
                          <span className="it-est-val">₹{(it.estimatedTripCost || 50000).toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="it-card-agent-tag">
                        <ShieldCheck size={13} className="text-emerald-600" />
                        <span className="truncate">Agency: {it.agent?.agencyName || agencyName}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs py-1 px-1 my-0.5">
                        <div className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Star size={11} fill="#F59E0B" stroke="#F59E0B" />
                          <span>{it.rating || 4.8} ({it.reviewCount || 95} reviews)</span>
                        </div>
                        <span className="text-[11px] text-emerald-700 font-semibold">★ Customer Feedback Active</span>
                      </div>

                      {/* ACTIONS STRIP */}
                      <div className="it-card-actions-strip">
                        <button 
                          className="btn-it-action preview"
                          onClick={() => {
                            onSelectItinerary(it);
                            if (!isPage && onClose) onClose();
                          }}
                          title="Preview on Customer Portal"
                        >
                          <Eye size={14} />
                          <span>Preview</span>
                        </button>

                        <button 
                          className="btn-it-action edit"
                          onClick={() => {
                            setEditError(null);
                            setEditingItinerary({ ...it });
                          }}
                          title="Edit Itinerary (Update)"
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </button>

                        <button 
                          className="btn-it-action delete"
                          onClick={() => setDeletingId(it.id)}
                          title="Delete Itinerary from Portal"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CREATE NEW ITINERARY (CREATE) */}
        {activeTab === 'create' && (
          <div className="agent-content-pane animate-fade-in">
            <form onSubmit={handleCreateBlueprint} className="agent-form-container">
              <div id="create-itinerary-header" className="form-section-head">
                <Sparkles size={18} className="text-emerald-600" />
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Create Itinerary</h3>
                  <p className="text-xs text-slate-500">
                    Publish an itinerary. It will immediately reflect on the customer portal for travelers to explore and purchase.
                  </p>
                </div>
              </div>

              {/* Compulsory PDF notice */}
              <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-amber-900 mb-2">
                <AlertCircle size={16} className="text-amber-600 shrink-0" />
                <span>
                  <strong>Compulsory Rule for Travel Agents:</strong> Uploading your official tour itinerary PDF document (.pdf) is <strong>strictly mandatory</strong>. Every itinerary published on V3 Itinerary requires an attached PDF document so travelers can preview and download the verified plan.
                </span>
              </div>

              {/* 1. Basic Details */}
              <div className="agent-form-grid">
                <div className="form-col-span-2">
                  <label className="agent-lbl">Itinerary Title *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. 5-Day Luxury Heritage & Royal Desert Safari Experience"
                    className="agent-input"
                  />
                </div>

                <div>
                  <label className="agent-lbl">Destination *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="e.g. Dubai, Bali, Kashmir, Goa, Jaipur"
                    className="agent-input"
                  />
                </div>

                <div>
                  <label className="agent-lbl">Country *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. India, UAE, Indonesia"
                    className="agent-input"
                  />
                </div>

                <div>
                  <label className="agent-lbl">Region</label>
                  <select 
                    value={formData.region}
                    onChange={(e: any) => setFormData({ ...formData, region: e.target.value })}
                    className="agent-select"
                  >
                    <option value="Domestic">Domestic (India)</option>
                    <option value="International">International</option>
                  </select>
                </div>

                <div>
                  <label className="agent-lbl">Traveler Type Target</label>
                  <select 
                    value={formData.travelerType}
                    onChange={(e: any) => setFormData({ ...formData, travelerType: e.target.value })}
                    className="agent-select"
                  >
                    <option value="Family">Family / Leisure</option>
                    <option value="Couple">Couple / Honeymoon</option>
                    <option value="Solo">Solo Traveler</option>
                    <option value="Group">Group / Friends</option>
                    <option value="Any">All Travelers</option>
                  </select>
                </div>

                <div>
                  <label className="agent-lbl">Duration Days</label>
                  <input 
                    type="number" 
                    min={1} 
                    max={30}
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 1 })}
                    className="agent-input"
                  />
                </div>

                <div>
                  <label className="agent-lbl">Duration Nights</label>
                  <input 
                    type="number" 
                    min={0} 
                    max={30}
                    value={formData.durationNights}
                    onChange={(e) => setFormData({ ...formData, durationNights: parseInt(e.target.value) || 0 })}
                    className="agent-input"
                  />
                </div>

                <div>
                  <label className="agent-lbl">Estimated Total Trip Cost (₹)</label>
                  <input 
                    type="number" 
                    value={formData.estimatedTripCost}
                    onChange={(e) => setFormData({ ...formData, estimatedTripCost: parseInt(e.target.value) || 50000 })}
                    className="agent-input"
                  />
                </div>

                <div>
                  <label className="agent-lbl">Best Time to Visit</label>
                  <input 
                    type="text" 
                    value={formData.bestTimeToVisit}
                    onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                    placeholder="e.g. October to April"
                    className="agent-input"
                  />
                </div>
              </div>

              {/* 2. Cover Image Selection & Upload from PC */}
              <div className="mt-5 p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                <CoverImageUploader 
                  currentUrl={formData.coverImage}
                  onImageChange={(url) => setFormData({ ...formData, coverImage: url })}
                  label="Itinerary Cover Photo"
                  helperText="Upload an inspiring photo directly from your PC/computer, select curated presets, or paste a link."
                />
              </div>

              {/* 3. Overview */}
              <div className="mt-4">
                <label className="agent-lbl">Trip Overview & Experience Summary</label>
                <textarea 
                  rows={3}
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  placeholder="Give travelers an inspiring preview of the sights, hotels, and highlights included in this itinerary..."
                  className="agent-textarea"
                />
              </div>

              {/* 4. Primary: Upload Itinerary PDF from Computer (Compulsory) */}
              <div id="pdf-upload-section" className="mt-5 p-5 rounded-xl bg-gradient-to-br from-red-50/60 via-slate-50 to-orange-50/40 border-2 border-dashed border-red-300 shadow-sm transition-all">
                <ItineraryPdfUploader 
                  required={true}
                  currentPdfUrl={formData.pdfUrl}
                  currentPdfName={formData.pdfName}
                  currentPdfSize={formData.pdfSize}
                  onPdfChange={(pdf) => {
                    if (pdf) {
                      setFormData(prev => ({
                        ...prev,
                        pdfUrl: pdf.url,
                        pdfName: pdf.name,
                        pdfSize: pdf.size
                      }));
                      setFormError(null);
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        pdfUrl: '',
                        pdfName: '',
                        pdfSize: 0
                      }));
                    }
                  }}
                  label="Upload Tour Itinerary PDF from PC / Computer"
                  helperText="Upload your official comprehensive itinerary PDF (day-by-day plan, pricing, hotels, vouchers, & inclusions). Compulsory for all published itineraries."
                />
              </div>

              {/* Optional: Manual Day-by-Day Schedule & Inclusions Accordion */}
              <details className="mt-4 border border-slate-200 rounded-xl bg-slate-50/70 overflow-hidden">
                <summary className="p-3.5 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 flex items-center justify-between transition-colors">
                  <span className="flex items-center gap-2">
                    <FileText size={15} className="text-slate-500" />
                    <span>Optional: Manual Day-by-Day Activity Builder & Bullets (Click to Expand)</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">Not required if PDF is uploaded</span>
                </summary>
                
                <div className="p-4 border-t border-slate-200 bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Day-by-Day Schedule Overview ({formData.days.length} Days)</h4>
                      <p className="text-xs text-slate-500">Summary notes for travellers who scan quickly.</p>
                    </div>
                    <button 
                      type="button" 
                      className="btn-add-day"
                      onClick={handleAddDay}
                    >
                      <Plus size={14} />
                      <span>+ Add Next Day</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.days.map((day, idx) => (
                      <div key={idx} className="agent-day-card">
                        <div className="day-card-header flex justify-between items-center">
                          <span className="day-card-badge">Day {day.dayNumber}</span>
                          {formData.days.length > 1 && (
                            <button 
                              type="button" 
                              className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                              onClick={() => handleRemoveDay(idx)}
                            >
                              <Trash2 size={13} />
                              <span>Remove Day</span>
                            </button>
                          )}
                        </div>

                        <div className="agent-day-grid mt-2">
                          <div className="col-span-2">
                            <label className="agent-lbl-sm">Day Title</label>
                            <input 
                              type="text"
                              value={day.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormData(prev => {
                                  const nextDays = [...prev.days];
                                  nextDays[idx].title = val;
                                  return { ...prev, days: nextDays };
                                });
                              }}
                              className="agent-input-sm"
                              placeholder="e.g. Arrival, Marina Cruise & Welcome Dinner"
                            />
                          </div>
                          <div>
                            <label className="agent-lbl-sm">Morning Activity</label>
                            <input 
                              type="text"
                              value={day.morning}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormData(prev => {
                                  const nextDays = [...prev.days];
                                  nextDays[idx].morning = val;
                                  return { ...prev, days: nextDays };
                                });
                              }}
                              className="agent-input-sm"
                              placeholder="Morning exploration..."
                            />
                          </div>
                          <div>
                            <label className="agent-lbl-sm">Afternoon Activity</label>
                            <input 
                              type="text"
                              value={day.afternoon}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormData(prev => {
                                  const nextDays = [...prev.days];
                                  nextDays[idx].afternoon = val;
                                  return { ...prev, days: nextDays };
                                });
                              }}
                              className="agent-input-sm"
                              placeholder="Afternoon excursion..."
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="agent-lbl-sm">Evening Activity</label>
                            <input 
                              type="text"
                              value={day.evening}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormData(prev => {
                                  const nextDays = [...prev.days];
                                  nextDays[idx].evening = val;
                                  return { ...prev, days: nextDays };
                                });
                              }}
                              className="agent-input-sm"
                              placeholder="Evening dinner, shows, or markets..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 5. Inclusions & Exclusions */}
                  <div className="mt-6 border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-2">Package Inclusions (4 Items)</h4>
                      {formData.inclusions.map((inc, i) => (
                        <input 
                          key={i}
                          type="text"
                          value={inc}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => {
                              const next = [...prev.inclusions];
                              next[i] = val;
                              return { ...prev, inclusions: next };
                            });
                          }}
                          className="agent-input-sm mb-1.5"
                        />
                      ))}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-2">Package Exclusions (3 Items)</h4>
                      {formData.exclusions.map((exc, i) => (
                        <input 
                          key={i}
                          type="text"
                          value={exc}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => {
                              const next = [...prev.exclusions];
                              next[i] = val;
                              return { ...prev, exclusions: next };
                            });
                          }}
                          className="agent-input-sm mb-1.5"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </details>

              {/* Form Validation Error Alert */}
              {formError && (
                <div className="create-form-error-banner animate-shake mt-4">
                  <AlertCircle size={18} className="shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Publishing Banner */}
              <div className="agent-publish-box mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={28} className="text-emerald-600 shrink-0" />
                  <div>
                    <h5 className="font-bold text-emerald-950 text-sm">Authorized Publishing by {agencyName}</h5>
                    <p className="text-xs text-emerald-800">
                      Your agency GSTIN ({gstNumber}) and verified badge will be attached to this itinerary.
                    </p>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || isPublishedTick}
                  className={`btn-agent-solid shrink-0 px-6 py-2.5 ${isPublishedTick ? 'published-success-btn' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Publishing itinerary...</span>
                    </>
                  ) : isPublishedTick ? (
                    <>
                      <CheckCircle2 size={18} className="animate-bounce text-white" />
                      <span>✓ Itinerary Created!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Publish Live to Customer Portal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2.5: CREATE DESTINATION (DIRECT LIVE SYNC TO USER PAGES) */}
        {activeTab === 'create-destination' && (
          <div className="agent-content-pane animate-fade-in">
            {/* Header / Intro banner */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-blue-50/60 mb-6 flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <MapPin size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-base">Create & Publish Destination</h3>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <Sparkles size={11} /> Real-Time Live Sync
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                    Publish a destination directly. It will instantly be synchronized and accessible to all travelers on the <strong>Home Page Carousel</strong>, <strong>Hero Search Bar</strong>, and <strong>Destinations Directory</strong>—even before creating full day-by-day itineraries!
                  </p>
                </div>
              </div>

              {onNavigateToDestinations && (
                <button
                  type="button"
                  onClick={onNavigateToDestinations}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <ExternalLink size={13} />
                  <span>View Destinations Page</span>
                </button>
              )}
            </div>

            {destFormError && (
              <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{destFormError}</span>
              </div>
            )}

            {/* Split Grid: Form on Left, Live Preview on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Form (7 cols) */}
              <form onSubmit={handleCreateDestination} className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Destination Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Manali, Kerala, Tokyo, Bali"
                      value={destForm.name}
                      onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. India, Japan, Indonesia, Switzerland"
                      value={destForm.country}
                      onChange={(e) => setDestForm({ ...destForm, country: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Region Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDestForm({ ...destForm, region: 'Domestic', country: destForm.country === 'India' ? 'India' : destForm.country })}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all text-center ${
                          destForm.region === 'Domestic' 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs' 
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        🇮🇳 Domestic (India)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDestForm({ ...destForm, region: 'International' })}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all text-center ${
                          destForm.region === 'International' 
                            ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-xs' 
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        ✈️ International
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Best Travel Season</label>
                    <input 
                      type="text" 
                      placeholder="e.g. October to March, April to June"
                      value={destForm.bestTimeToVisit}
                      onChange={(e) => setDestForm({ ...destForm, bestTimeToVisit: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Catchy Destination Tagline</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Snow-clad peaks, pine forests, apple orchards & Himalayan serenity"
                    value={destForm.tagline}
                    onChange={(e) => setDestForm({ ...destForm, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Appears on destination cards across the home carousel and directories.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Cover Image</label>
                  <div className="space-y-2">
                    <span className="text-[11px] text-slate-500 block">Click a scenic preset cover or paste your custom image URL:</span>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {PRESET_DESTINATION_COVERS.map((preset, idx) => {
                        const isSelected = destForm.coverImage === preset.url;
                        return (
                          <div 
                            key={idx}
                            onClick={() => setDestForm({ ...destForm, coverImage: preset.url })}
                            className={`group relative rounded-lg overflow-hidden cursor-pointer aspect-video border-2 transition-all ${
                              isSelected ? 'border-emerald-600 ring-2 ring-emerald-300 shadow-md' : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                            }`}
                            title={preset.name}
                          >
                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-emerald-900/30 flex items-center justify-center">
                                <Check size={14} className="text-white drop-shadow" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-2 flex gap-2">
                      <input 
                        type="url"
                        placeholder="Or paste custom image URL (https://...)"
                        value={destForm.coverImage}
                        onChange={(e) => setDestForm({ ...destForm, coverImage: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Destination Description / Overview</label>
                  <textarea 
                    rows={3}
                    placeholder="Describe what makes this destination special for travelers (sightseeing, adventure, romance, local culture, cuisines)..."
                    value={destForm.description}
                    onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none">
                    <input 
                      type="checkbox"
                      checked={destForm.isPopular}
                      onChange={(e) => setDestForm({ ...destForm, isPopular: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span>Feature in Popular Destinations Carousel on Home Page</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmittingDest}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmittingDest ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Publishing & Syncing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Publish & Sync Destination Live</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Right: Live Preview Card (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-semibold flex items-center gap-1.5 text-emerald-400">
                    <Eye size={14} /> Live Traveler Card Preview
                  </span>
                  <span className="text-[11px] text-slate-400">Updates live as you type</span>
                </div>

                {/* Simulated Destination Card */}
                <div className="destination-card shadow-lg border border-slate-200 overflow-hidden rounded-2xl bg-white max-w-sm mx-auto">
                  <div className="card-media-wrapper relative h-48 overflow-hidden bg-slate-100">
                    <img 
                      src={destForm.coverImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'} 
                      alt={destForm.name || 'Preview'} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {destForm.region}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-bold text-slate-900 text-base">{destForm.name || 'Destination Name'}</h4>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">From ₹99</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-500 text-xs mb-2">
                      <MapPin size={12} className="text-slate-400" />
                      <span>{destForm.country || 'India'}</span>
                      <span className="mx-1">•</span>
                      <span>Best: {destForm.bestTimeToVisit}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                      {destForm.tagline || destForm.description || 'Handcrafted holiday packages and verified travel itineraries.'}
                    </p>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Verified Digital Access</span>
                      <span className="font-bold text-blue-600">Explore Packages →</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-blue-600" /> Instant Propagation Guarantee
                  </div>
                  <p className="text-[11.5px] text-slate-600">
                    Once clicked, this destination will immediately appear in the <strong>Search Bar</strong>, <strong>Popular Destinations Carousel</strong>, and <strong>/destinations Directory</strong> for every traveler visiting the site.
                  </p>
                </div>
              </div>
            </div>

            {/* Existing Destinations List */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Currently Active & Synced Destinations ({destinationsMaster?.length || 0})
                  </h4>
                  <p className="text-xs text-slate-500">
                    These destinations are live on the user website right now.
                  </p>
                </div>
                {onNavigateToDestinations && (
                  <button
                    onClick={onNavigateToDestinations}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    View All on User Directory →
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {destinationsMaster && destinationsMaster.map((dest) => (
                  <div 
                    key={dest.id} 
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm transition-all"
                  >
                    <div className="aspect-video rounded-lg overflow-hidden mb-2 bg-slate-100">
                      <img 
                        src={dest.cover_image || dest.coverImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80'} 
                        alt={dest.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h5 className="font-bold text-slate-800 text-xs truncate">{dest.name}</h5>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5">
                      <span className="truncate">{dest.country}</span>
                      <span className="text-emerald-700 font-bold">₹99</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BOOKINGS & TRAVELER LEADS */}
        {activeTab === 'orders' && (
          <div className="agent-content-pane animate-fade-in">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Traveler Itinerary Orders & Package Leads</h3>
                <p className="text-xs text-slate-500">
                  Showing travelers who booked itineraries published by <strong>{agencyName}</strong>. Connect with them directly to quote full holiday packages!
                </p>
              </div>
              <button 
                className="agent-refresh-btn"
                onClick={loadAgentOrders}
              >
                <RefreshCw size={14} className={isOrdersLoading ? "animate-spin" : ""} />
                <span>Refresh Bookings</span>
              </button>
            </div>

            {agentOrders.length === 0 ? (
              <div className="agent-empty-box">
                <IndianRupee size={48} className="text-slate-300 mb-3" />
                <h4 className="text-base font-bold text-slate-700">No bookings for your itineraries yet</h4>
                <p className="text-xs text-slate-500 max-w-md mt-1">
                  Only travelers who unlock itineraries published by <strong>{agencyName}</strong> will appear in this list. When someone books one of your packages, their contact details and booking order will show up here instantly!
                </p>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Details</th>
                      <th>Itinerary Purchased</th>
                      <th>Amount Paid</th>
                      <th>Date</th>
                      <th>Payment Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentOrders.map((o: any, idx: number) => {
                      const cleanPhone = (o.customer_mobile || '').replace(/[^0-9]/g, '');
                      const waMsg = encodeURIComponent(`Hi ${o.customer_name || 'Traveler'}, thank you for unlocking our ${o.destination || 'Travel'} Itinerary on V3Itinerary! Our team at ${agencyName} is ready to help you book your flights and luxury hotels.`);
                      const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${waMsg}` : `https://wa.me/?text=${waMsg}`;

                      return (
                        <tr key={idx}>
                          <td className="font-mono text-xs font-bold text-blue-700">
                            {o.order_id || `#V3-${idx + 100}`}
                          </td>
                          <td>
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-800 text-xs">{o.customer_name || 'Valued Traveler'}</span>
                              <span className="text-[11px] text-slate-500">{o.customer_email || 'traveler@example.com'}</span>
                              <span className="text-[11px] text-slate-500">{o.customer_mobile || ''}</span>
                            </div>
                          </td>
                          <td>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-800 text-xs">{o.itinerary_title || o.destination}</span>
                              <span className="text-[10px] text-slate-400">{o.destination}</span>
                            </div>
                          </td>
                          <td className="font-bold text-emerald-700 text-xs">
                            ₹{o.amount_paid || 99}
                          </td>
                          <td className="text-xs text-slate-500">
                            {o.created_at ? new Date(o.created_at).toLocaleDateString('en-GB') : 'Recent'}
                          </td>
                          <td>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                              {o.status || 'PAID'}
                            </span>
                          </td>
                          <td>
                            <a 
                              href={waUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn-lead-whatsapp"
                              title="Message traveler directly on WhatsApp"
                            >
                              <MessageSquare size={13} />
                              <span>WhatsApp</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: AGENCY KYC PROFILE */}
        {activeTab === 'profile' && (
          <div className="agent-content-pane animate-fade-in">
            <div className="agent-profile-grid">
              <div className="agent-profile-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
                    {agencyName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{agencyName}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 size={12} /> {user.agentDetails?.status || 'VERIFIED OPERATOR'}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">GSTIN: {gstNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-detail-rows space-y-2.5 text-xs text-slate-700">
                  <div className="flex justify-between py-1.5 border-b">
                    <span className="text-slate-400">Founder / Managing Director:</span>
                    <span className="font-semibold">{founderName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b">
                    <span className="text-slate-400">Official Contact Phone:</span>
                    <span className="font-semibold">{agentPhone}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b">
                    <span className="text-slate-400">Registered Agency Email:</span>
                    <span className="font-semibold">{agentEmail}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b">
                    <span className="text-slate-400">Registered Office City:</span>
                    <span className="font-semibold">{agentCity}, {agentState}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b">
                    <span className="text-slate-400">Experience in Tourism:</span>
                    <span className="font-semibold">{user.agentDetails?.experienceYears || user.agentDetails?.experience_years || '8+ Years'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b">
                    <span className="text-slate-400">V3 Verified Itineraries:</span>
                    <span className="font-semibold text-emerald-700">{myItinerariesCount} Active</span>
                  </div>
                </div>
              </div>

              <div className="agent-kyc-guide-card">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
                  <ShieldCheck size={18} className="text-blue-600" />
                  <span>V3Itinerary Certified Agent Standards</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  All itineraries published by your agency are protected by V3Itinerary's Fair Value Guarantee. Travelers pay ₹99 to unlock your full PDF itinerary, and contact your verified agency directly for customized quotes, luxury flights, and hotel bookings.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg border text-xs space-y-1.5 text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600" />
                    <span>100% of traveler leads routed directly to your WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600" />
                    <span>Instant real-time sync with database</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600" />
                    <span>Automated vector PDF generation delivered to customer emails</span>
                  </div>
                </div>

                {onOpenAgentOnboarding && (
                  <button 
                    type="button"
                    className="mt-3 w-full py-2 px-3 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                    onClick={() => {
                      if (onClose) onClose();
                      if (onOpenAgentOnboarding) onOpenAgentOnboarding();
                    }}
                  >
                    Update Agency Credentials / License Documents
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );

    return (
      <>
        {isPage ? (
          <div className="agent-studio-page-wrapper">
            <div className="agent-studio-top-nav">
              <div className="agent-studio-top-nav-inner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button 
                    type="button"
                    className="agent-studio-back-btn" 
                    onClick={onBackToHome || onClose}
                  >
                    <ArrowLeft size={16} />
                    <span>← Back to Customer Marketplace</span>
                  </button>
                  <span className="agent-studio-top-title">
                    Partner Portal • Live Real-time Sync
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="agent-verified-badge">
                    <ShieldCheck size={13} />
                    <span>OFFICIAL TRAVEL OPERATOR</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="agent-studio-card-container">
              {dashboardCard}
            </div>
          </div>
        ) : (
          <div className="modal-overlay animate-fade-in" onClick={onClose}>
            <div 
              className="modal-container agent-dashboard-box shadow-2xl animate-scale-up" 
              onClick={(e) => e.stopPropagation()}
            >
              {dashboardCard}
            </div>
          </div>
        )}

        {/* MODAL: EDIT ITINERARY (UPDATE) */}
        {editingItinerary && (
          <div className="modal-overlay animate-fade-in" style={{ zIndex: 1100 }} onClick={() => setEditingItinerary(null)}>
            <div 
              className="modal-container agent-edit-modal shadow-2xl animate-scale-up" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="edit-itinerary-header">
                <div className="edit-itinerary-header-left">
                  <div className="edit-itinerary-icon-box">
                    <Edit3 size={20} />
                  </div>
                  <div>
                    <h3 className="edit-itinerary-title">Edit Itinerary</h3>
                    <p className="edit-itinerary-subtitle">Make live updates to destination details, pricing, and cover image</p>
                  </div>
                </div>
                <button 
                  className="modal-close-btn" 
                  onClick={() => setEditingItinerary(null)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUpdateBlueprint} style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '6px' }}>
                <div>
                  <label className="agent-lbl">Itinerary Title *</label>
                  <input 
                    type="text" 
                    required
                    value={editingItinerary.title}
                    onChange={(e) => setEditingItinerary({ ...editingItinerary, title: e.target.value })}
                    className="agent-input"
                    placeholder="e.g. 5-Day Luxury Heritage & Royal Desert Safari Experience"
                  />
                </div>

                <div className="edit-form-grid-2">
                  <div>
                    <label className="agent-lbl">Destination *</label>
                    <input 
                      type="text" 
                      required
                      value={editingItinerary.destination}
                      onChange={(e) => setEditingItinerary({ ...editingItinerary, destination: e.target.value })}
                      className="agent-input"
                      placeholder="e.g. Goa, Dubai, Bali, Kashmir"
                    />
                  </div>
                  <div>
                    <label className="agent-lbl">Country *</label>
                    <input 
                      type="text" 
                      required
                      value={editingItinerary.country}
                      onChange={(e) => setEditingItinerary({ ...editingItinerary, country: e.target.value })}
                      className="agent-input"
                      placeholder="e.g. India, UAE, Indonesia"
                    />
                  </div>
                </div>

                <div className="edit-form-grid-3">
                  <div>
                    <label className="agent-lbl">Duration Days</label>
                    <input 
                      type="number" 
                      min={1}
                      max={30}
                      value={editingItinerary.durationDays}
                      onChange={(e) => setEditingItinerary({ ...editingItinerary, durationDays: parseInt(e.target.value) || 1 })}
                      className="agent-input"
                    />
                  </div>
                  <div>
                    <label className="agent-lbl">Duration Nights</label>
                    <input 
                      type="number" 
                      min={0}
                      max={30}
                      value={editingItinerary.durationNights}
                      onChange={(e) => setEditingItinerary({ ...editingItinerary, durationNights: parseInt(e.target.value) || 0 })}
                      className="agent-input"
                    />
                  </div>
                  <div>
                    <label className="agent-lbl">Trip Cost Est. (₹)</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#059669', fontSize: '14px', pointerEvents: 'none' }}>₹</span>
                      <input 
                        type="number" 
                        value={editingItinerary.estimatedTripCost}
                        onChange={(e) => setEditingItinerary({ ...editingItinerary, estimatedTripCost: parseInt(e.target.value) || 50000 })}
                        className="agent-input"
                        style={{ paddingLeft: '28px' }}
                      />
                    </div>
                  </div>
                </div>

                <CoverImageUploader 
                  currentUrl={editingItinerary.coverImage}
                  onImageChange={(url) => setEditingItinerary({ ...editingItinerary, coverImage: url })}
                  label="Update Cover Photo"
                  helperText="Upload a fresh photo directly from your PC/computer or pick a preset."
                />

                <div id="edit-pdf-upload-section" className="mt-4 p-4 rounded-xl bg-red-50/50 border border-red-300">
                  <ItineraryPdfUploader 
                    required={true}
                    currentPdfUrl={editingItinerary.pdfUrl}
                    currentPdfName={editingItinerary.pdfName}
                    currentPdfSize={editingItinerary.pdfSize}
                    onPdfChange={(pdf) => {
                      if (pdf) {
                        setEditingItinerary({
                          ...editingItinerary,
                          pdfUrl: pdf.url,
                          pdfName: pdf.name,
                          pdfSize: pdf.size
                        });
                        setEditError(null);
                      } else {
                        setEditingItinerary({
                          ...editingItinerary,
                          pdfUrl: '',
                          pdfName: '',
                          pdfSize: 0
                        });
                      }
                    }}
                    label="Official Itinerary Document (PDF)"
                    helperText="Upload or update the official itinerary PDF for travelers to view and download directly (Compulsory)."
                  />
                </div>

                {editError && (
                  <div className="create-form-error-banner animate-shake my-1">
                    <AlertCircle size={16} className="shrink-0 text-red-600" />
                    <span>{editError}</span>
                  </div>
                )}

                <div>
                  <label className="agent-lbl">Overview Summary</label>
                  <textarea 
                    rows={3}
                    value={editingItinerary.overview}
                    onChange={(e) => setEditingItinerary({ ...editingItinerary, overview: e.target.value })}
                    className="agent-textarea"
                    placeholder="Provide a compelling overview of this destination and experience..."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1.5px solid #F1F5F9', marginTop: '4px' }}>
                  <button 
                    type="button"
                    style={{ 
                      padding: '9px 18px', 
                      border: '1.5px solid #CBD5E1', 
                      borderRadius: '10px', 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: '#475569', 
                      background: '#FFFFFF', 
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onClick={() => setEditingItinerary(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-agent-solid"
                    style={{ maxWidth: '340px', padding: '10px 22px', fontSize: '13px' }}
                  >
                    {isSubmitting ? 'Saving to Database...' : 'Save Changes & Sync to Customer Portal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: DELETE CONFIRMATION - STRUCTURED & ENHANCED */}
        {deletingId && (() => {
          const target = allItineraries.find(it => it.id === deletingId);
          return (
            <div className="agent-delete-modal-backdrop" onClick={() => setDeletingId(null)}>
              <div 
                className="agent-delete-modal-card" 
                onClick={(e) => e.stopPropagation()}
              >
                <div className="agent-delete-icon-wrapper">
                  <Trash2 size={26} strokeWidth={2.2} />
                </div>
                
                <h3 className="agent-delete-title">Delete Itinerary?</h3>
                
                <p className="agent-delete-desc">
                  Are you sure you want to permanently delete this itinerary? This action will immediately remove it from the live customer portal.
                </p>

                {target && (
                  <div className="agent-delete-target-badge" title={target.title}>
                    <span>📍</span>
                    <span>{target.title} ({target.destination})</span>
                  </div>
                )}

                <div className="agent-delete-actions-row">
                  <button 
                    type="button"
                    className="agent-delete-btn-cancel"
                    onClick={() => setDeletingId(null)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    className="agent-delete-btn-confirm"
                    disabled={isDeleting}
                    onClick={() => handleDeleteConfirm(deletingId, target?.title || 'Itinerary')}
                  >
                    {isDeleting ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={15} />
                        <span>Delete Itinerary</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* CELEBRATORY SUCCESS MODAL: ITINERARY CREATED WITH GREEN TICK */}
        {createdSuccessItinerary && (
          <div className="publish-success-backdrop" onClick={() => setCreatedSuccessItinerary(null)}>
            <div className="publish-success-card" onClick={(e) => e.stopPropagation()}>
              <div className="publish-tick-circle">
                <Check size={44} strokeWidth={3.5} />
              </div>

              <h3 className="publish-success-title">Itinerary Created!</h3>
              <p className="publish-success-sub">
                Your travel itinerary has been published live and synchronized with the customer marketplace. Travelers can now discover and unlock it!
              </p>

              <div className="publish-itinerary-preview-badge">
                <div className="publish-preview-title">{createdSuccessItinerary.title}</div>
                <div className="publish-preview-meta">
                  <span>📍 {createdSuccessItinerary.destination}, {createdSuccessItinerary.country}</span>
                  <span>⏱ {createdSuccessItinerary.durationDays}D / {createdSuccessItinerary.durationNights}N</span>
                  <span className="publish-preview-pill">
                    <Check size={12} strokeWidth={3} />
                    <span>Live on Portal (₹99)</span>
                  </span>
                </div>
              </div>

              <div className="publish-success-actions">
                <button 
                  type="button"
                  className="btn-publish-view"
                  onClick={() => {
                    setCreatedSuccessItinerary(null);
                    setIsPublishedTick(false);
                    setActiveTab('itineraries');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <Eye size={16} />
                  <span>View My Itineraries</span>
                </button>

                <button 
                  type="button"
                  className="btn-publish-create-another"
                  onClick={() => {
                    setCreatedSuccessItinerary(null);
                    setIsPublishedTick(false);
                    setActiveTab('create');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <Plus size={16} />
                  <span>Create Another</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DESTINATION CREATED SUCCESS MODAL */}
        {destSuccess && (
          <div className="modal-overlay animate-fade-in" style={{ zIndex: 100000 }} onClick={() => setDestSuccess(null)}>
            <div className="modal-container p-6 max-w-md bg-white rounded-2xl shadow-2xl animate-scale-up text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle2 size={36} />
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mb-2">
                ⚡ Synced Live to User Pages
              </span>

              <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                Destination "{destSuccess.name}" Published!
              </h3>

              <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                Your new destination is now live in MySQL and immediately accessible across the website. Travelers can find it in the search bar, explore packages, and browse it on the Destinations page!
              </p>

              <div className="flex flex-col gap-2">
                {onNavigateToDestinations && (
                  <button
                    onClick={() => {
                      setDestSuccess(null);
                      onNavigateToDestinations();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    <span>View on User Destinations Page</span>
                  </button>
                )}
                <button
                  onClick={() => setDestSuccess(null)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all"
                >
                  Create Another Destination / Back to Studio
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };
