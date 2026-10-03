import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PopularDestinations } from './components/PopularDestinations';
import { MiddleSection } from './components/MiddleSection';
import { TrustBar } from './components/TrustBar';
import { Footer } from './components/Footer';
import { RazorpayModal } from './components/RazorpayModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { CustomerDashboardModal } from './components/CustomerDashboardModal';
import { TravelAgentOnboardingPage } from './components/TravelAgentOnboardingPage';
import { AuthModal } from './components/AuthModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AgentDashboardModal } from './components/AgentDashboardModal';
import { DestinationPackagesModal } from './components/DestinationPackagesModal';
import { DestinationsPage } from './components/DestinationsPage';
import { ItineraryDetailModal } from './components/ItineraryDetailModal';
import { RazorpayRedirectGateway } from './components/RazorpayRedirectGateway';
import { POPULAR_DESTINATIONS as FALLBACK_POPULAR_DESTINATIONS, ALL_ITINERARIES as FALLBACK_ALL_ITINERARIES } from './data/mockData';
import { checkDestinationMatchesQuery } from './utils/destinationCities';
import { 
  saveOrderToBackend, 
  sendItineraryPdfToEmail, 
  subscribeToRealtimeEvents, 
  fetchItineraries, 
  fetchDestinations,
  toggleWishlistInBackend,
  fetchWishlistFromBackend,
  fetchOrdersFromBackend
} from './utils/api';
import { getItineraryPDFBase64 } from './utils/pdfGenerator';
import type { Itinerary, UserProfile, OrderRecord, Destination } from './types';

export function App() {
  // Initial demo user state (default to logged out so the Login button is visible on top)
  const [user, setUser] = useState<UserProfile>(() => {
    const isExplicitlyLoggedIn = localStorage.getItem('v3_auth_active') === 'true';
    const saved = localStorage.getItem('v3_user_profile');
    let baseData: UserProfile = {
      fullName: '',
      email: '',
      mobile: '',
      isLoggedIn: false, // Start logged out so the Login button is on top
      preferredTravelType: 'Couple',
      preferredBudgetTier: 'Comfort',
      savedItineraryIds: [],
      purchasedOrders: []
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        baseData = { ...baseData, ...parsed };
      } catch (e) { /* ignore */ }
    }

    baseData.isLoggedIn = isExplicitlyLoggedIn;
    return baseData;
  });

  const [allItineraries, setAllItineraries] = useState<Itinerary[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('v3_custom_itineraries');
        const custom: Itinerary[] = local ? JSON.parse(local) : [];
        const deleted = new Set(JSON.parse(localStorage.getItem('v3_deleted_itinerary_ids') || '[]'));
        const map = new Map<string, Itinerary>();
        for (const it of FALLBACK_ALL_ITINERARIES) {
          if (it && it.id && !deleted.has(it.id)) map.set(it.id, it);
        }
        for (const it of custom) {
          if (it && it.id && !deleted.has(it.id)) map.set(it.id, it);
        }
        return Array.from(map.values());
      } catch (e) {}
    }
    return FALLBACK_ALL_ITINERARIES;
  });

  const [popularDestinations, setPopularDestinations] = useState<Itinerary[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('v3_custom_itineraries');
        const custom: Itinerary[] = local ? JSON.parse(local) : [];
        const customPopular = custom.filter(it => it.isPopular);
        return [...customPopular, ...FALLBACK_POPULAR_DESTINATIONS];
      } catch (e) {}
    }
    return FALLBACK_POPULAR_DESTINATIONS;
  });

  const [destinationsMaster, setDestinationsMaster] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Itinerary[]>(FALLBACK_POPULAR_DESTINATIONS);
  const [isViewingAll, setIsViewingAll] = useState(false);
  const [searchFilter, setSearchFilter] = useState({
    isSearchActive: false,
    query: '',
    destination: '',
    duration: '',
    travellers: ''
  });
  const [, setIsDataLoading] = useState(true);

  // Dynamic Data Loader from MySQL with local store synchronization
  const loadData = async () => {
    try {
      const [itinerariesData, destinationsData] = await Promise.all([
        fetchItineraries(),
        fetchDestinations()
      ]);
      if (itinerariesData && itinerariesData.length > 0) {
        setAllItineraries(itinerariesData);
        setPopularDestinations(itinerariesData.filter((it: Itinerary) => it.isPopular));
        setFilteredDestinations(prev => {
          return searchFilter.isSearchActive ? prev : itinerariesData.filter((it: Itinerary) => it.isPopular);
        });
      }
      if (destinationsData && destinationsData.length > 0) {
        setDestinationsMaster(destinationsData);
      }
    } catch (err) {
      console.warn('Error loading dynamic backend data:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  // Initial load and live sync listeners
  useEffect(() => {
    loadData();

    const handleSync = () => {
      loadData();
    };
    window.addEventListener('v3:itinerary_created', handleSync);
    window.addEventListener('v3:itinerary_updated', handleSync);
    window.addEventListener('v3:itinerary_deleted', handleSync);
    return () => {
      window.removeEventListener('v3:itinerary_created', handleSync);
      window.removeEventListener('v3:itinerary_updated', handleSync);
      window.removeEventListener('v3:itinerary_deleted', handleSync);
    };
  }, []);

  // Save user profile state
  useEffect(() => {
    localStorage.setItem('v3_user_profile', JSON.stringify(user));
  }, [user]);

  // Sync user's wishlist and orders directly from MySQL database
  useEffect(() => {
    if (user.email) {
      fetchWishlistFromBackend(user.email).then(savedIds => {
        setUser(prev => {
          const guestIds = prev.savedItineraryIds || [];
          const combined = Array.from(new Set([...guestIds, ...(savedIds || [])]));
          
          // If the user had items saved as guest before logging in, sync them to MySQL
          if (savedIds) {
            const unsynced = guestIds.filter(id => !savedIds.includes(id));
            for (const unsyncedId of unsynced) {
              toggleWishlistInBackend(user.email, unsyncedId).catch(() => {});
            }
          }

          return {
            ...prev,
            savedItineraryIds: combined
          };
        });
      });
      fetchOrdersFromBackend(user.email).then(orders => {
        if (orders && orders.length > 0) {
          setUser(prev => {
            const mappedOrders: OrderRecord[] = orders.map((o: any) => ({
              orderId: o.order_id,
              itineraryId: o.itinerary_id,
              itineraryTitle: o.itinerary_title,
              destination: o.destination,
              amountPaid: parseFloat(o.amount_paid) || 99,
              date: new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              paymentMethod: o.payment_method,
              razorpayPaymentId: o.razorpay_payment_id,
              agentName: o.agent_name,
              agentPhone: o.agent_phone,
              agentEmail: o.agent_email,
              agentWhatsapp: o.agent_whatsapp
            }));
            return {
              ...prev,
              purchasedOrders: mappedOrders
            };
          });
        }
      });
    }
  }, [user.email]);

  // Real-Time Database SSE Stream & phpMyAdmin Detection Listener
  useEffect(() => {
    const unsubscribe = subscribeToRealtimeEvents((event, data) => {
      if (event === 'connected') {
        console.log('⚡ Real-time database SSE connected:', data);
      } else if (
        event === 'database_mutation' ||
        event === 'destination_saved' || 
        event === 'destination_deleted' || 
        event === 'destination_updated' ||
        event === 'itinerary_saved'
      ) {
        console.log('⚡ [Real-Time] SQL change detected in MySQL/phpMyAdmin, syncing frontend...');
        loadData();
      } else if (event === 'wishlist_updated') {
        if (user.email) {
          fetchWishlistFromBackend(user.email).then(savedIds => {
            if (savedIds) setUser(prev => ({ ...prev, savedItineraryIds: savedIds }));
          });
        }
      } else if (event === 'order_created') {
        // If order belongs to this customer or new order broadcast
        if (data.order?.customer_email === user.email) {
          setUser(prev => {
            const exists = prev.purchasedOrders.some(o => o.orderId === data.order.order_id);
            if (exists) return prev;
            const newOrder: OrderRecord = {
              orderId: data.order.order_id,
              itineraryId: data.order.itinerary_id,
              itineraryTitle: data.order.itinerary_title,
              destination: data.order.destination,
              amountPaid: data.order.amount_paid,
              date: new Date(data.order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              paymentMethod: data.order.payment_method,
              razorpayPaymentId: data.order.razorpay_payment_id,
              agentName: data.order.agent_name,
              agentPhone: data.order.agent_phone,
              agentEmail: data.order.agent_email,
              agentWhatsapp: data.order.agent_whatsapp
            };
            return {
              ...prev,
              purchasedOrders: [newOrder, ...prev.purchasedOrders]
            };
          });
        }
      }
    });

    return () => unsubscribe();
  }, [user.email, searchFilter.isSearchActive]);

  // Auto-sync on Window Focus & Tab Switch from phpMyAdmin
  useEffect(() => {
    const handleFocus = () => {
      loadData();
    };
    const handleVisibility = () => {
      if (!document.hidden) loadData();
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    // Background polling fallback every 3 seconds to guarantee immediate sync
    const pollInterval = setInterval(loadData, 3000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(pollInterval);
    };
  }, [searchFilter.isSearchActive]);

  // Modal States
  const [selectedDestinationName, setSelectedDestinationName] = useState<string | null>(null);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [checkoutItinerary, setCheckoutItinerary] = useState<Itinerary | null>(null);
  const [gatewayItinerary, setGatewayItinerary] = useState<Itinerary | null>(null);
  const [fulfilledOrder, setFulfilledOrder] = useState<{ itinerary: Itinerary; order: OrderRecord } | null>(null);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<'trips' | 'saved' | 'orders' | 'profile'>('trips');
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authRole, setAuthRole] = useState<'customer' | 'admin' | 'agent'>('customer');
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dedicated Page Routing ('home' | 'destinations' | 'agent-studio')
  const [currentPage, setCurrentPage] = useState<'home' | 'destinations' | 'agent-studio'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#destinations') return 'destinations';
      if (window.location.hash === '#agent-studio') return 'agent-studio';
    }
    return 'home';
  });

  // Synchronize browser history / URL hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#destinations') {
        setCurrentPage('destinations');
        setSelectedDestinationName(null);
      } else if (hash === '#agent-studio') {
        setCurrentPage('agent-studio');
        setSelectedDestinationName(null);
      } else if (hash === '#home' || hash === '') {
        setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigatePage = (page: 'home' | 'destinations' | 'agent-studio') => {
    setCurrentPage(page);
    setSelectedDestinationName(null);
    window.location.hash = `#${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleHeroSearch = (params: { query: string; destination: string; duration: string; travellers: string }) => {
    const hasFilter = Boolean(params.query.trim() || params.destination || params.duration || params.travellers);

    let results = [...allItineraries];

    if (params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      results = results.filter(it => {
        if (it.destination && it.destination.toLowerCase().includes(q)) return true;
        if (it.country && it.country.toLowerCase().includes(q)) return true;
        if (it.title && it.title.toLowerCase().includes(q)) return true;
        if (it.overview && it.overview.toLowerCase().includes(q)) return true;
        if (it.region && it.region.toLowerCase().includes(q)) return true;
        if (it.slug && it.slug.toLowerCase().includes(q)) return true;
        if (it.travelerType && it.travelerType.toLowerCase().includes(q)) return true;
        if (it.days && Array.isArray(it.days)) {
          const matchDay = it.days.some(d => 
            (d.title && d.title.toLowerCase().includes(q)) ||
            (d.highlights && Array.isArray(d.highlights) && d.highlights.some(h => h.toLowerCase().includes(q))) ||
            (d.morning && d.morning.toLowerCase().includes(q)) ||
            (d.afternoon && d.afternoon.toLowerCase().includes(q)) ||
            (d.evening && d.evening.toLowerCase().includes(q))
          );
          if (matchDay) return true;
        }
        // Match associated cities for destination
        const cityMatch = checkDestinationMatchesQuery(it.destination, it.country, q, allItineraries, it.overview);
        if (cityMatch.isMatch) return true;

        return false;
      });
    }

    if (params.destination) {
      results = results.filter(it => it.destination.toLowerCase() === params.destination.toLowerCase());
    }

    if (params.duration) {
      if (params.duration === '1-3') results = results.filter(it => it.durationDays <= 3);
      else if (params.duration === '4-6') results = results.filter(it => it.durationDays >= 4 && it.durationDays <= 6);
      else if (params.duration === '7-10') results = results.filter(it => it.durationDays >= 7 && it.durationDays <= 10);
      else if (params.duration === '10+') results = results.filter(it => it.durationDays >= 10);
    }

    if (params.travellers) {
      results = results.filter(it => 
        it.travelerType.toLowerCase() === params.travellers.toLowerCase() || 
        it.travelerType.toLowerCase() === 'any'
      );
    }

    setIsViewingAll(false);
    setSearchFilter({
      isSearchActive: hasFilter,
      query: params.query.trim(),
      destination: params.destination,
      duration: params.duration,
      travellers: params.travellers
    });

    setFilteredDestinations(results);

    // Smooth scroll down to results section with sticky header offset
    setTimeout(() => {
      const el = document.getElementById('destinations');
      if (el) {
        const headerOffset = 90;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    }, 80);

    if (hasFilter) {
      if (results.length > 0) {
        showToast(`Found ${results.length} verified ${results.length === 1 ? 'itinerary' : 'itineraries'} matching your search!`);
      } else {
        showToast(`No exact match found. Try adjusting filters.`);
      }
    } else {
      showToast('Showing all curated destinations');
    }
  };

  const handleRemoveFilter = (filterKey: 'query' | 'destination' | 'duration' | 'travellers') => {
    const nextParams = {
      query: filterKey === 'query' ? '' : searchFilter.query,
      destination: filterKey === 'destination' ? '' : searchFilter.destination,
      duration: filterKey === 'duration' ? '' : searchFilter.duration,
      travellers: filterKey === 'travellers' ? '' : searchFilter.travellers
    };
    handleHeroSearch(nextParams);
  };

  const handleClearSearch = () => {
    setSearchFilter({
      isSearchActive: false,
      query: '',
      destination: '',
      duration: '',
      travellers: ''
    });
    setIsViewingAll(false);
    setFilteredDestinations(popularDestinations);
    showToast('Search cleared — showing Popular Destinations');
  };

  const handleViewAll = () => {
    setIsViewingAll(true);
    setSearchFilter({
      isSearchActive: false,
      query: '',
      destination: '',
      duration: '',
      travellers: ''
    });
    setFilteredDestinations(allItineraries);
    scrollToSection('destinations');
    showToast(`Showing all ${allItineraries.length} verified itineraries`);
  };

  const handleBackToPopular = () => {
    setIsViewingAll(false);
    setSearchFilter({
      isSearchActive: false,
      query: '',
      destination: '',
      duration: '',
      travellers: ''
    });
    setFilteredDestinations(popularDestinations);
  };

  const handleToggleSave = async (itineraryId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const matchingIt = allItineraries.find(it => it.id === itineraryId);
    const destName = matchingIt ? matchingIt.destination.toLowerCase() : itineraryId.replace(/^dest-/, '').toLowerCase();
    const destSlug = `dest-${destName.replace(/\s+/g, '-')}`;

    const isCurrentlySaved = user.savedItineraryIds.some(id => 
      id === itineraryId || 
      id.toLowerCase() === destName || 
      id.toLowerCase() === destSlug
    );

    let updatedSaved: string[];

    if (isCurrentlySaved) {
      updatedSaved = user.savedItineraryIds.filter(id => 
        id !== itineraryId && 
        id.toLowerCase() !== destName && 
        id.toLowerCase() !== destSlug
      );
      showToast('Removed from Saved Wishlist');
    } else {
      updatedSaved = [...user.savedItineraryIds, itineraryId];
      showToast('❤️ Saved to your Wishlist!');
    }

    setUser(prev => ({
      ...prev,
      savedItineraryIds: updatedSaved
    }));

    if (user.email) {
      try {
        await toggleWishlistInBackend(user.email, itineraryId);
        if (isCurrentlySaved && user.savedItineraryIds.includes(destSlug) && destSlug !== itineraryId) {
          await toggleWishlistInBackend(user.email, destSlug);
        }
      } catch (err) {
        console.warn('Wishlist sync error:', err);
      }
    }
  };

  const handleStartCheckout = (itinerary: Itinerary) => {
    // Close detail modal and open full Razorpay checkout gateway cleanly
    setSelectedItinerary(null);
    setGatewayItinerary(itinerary);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSuccess = (
    paymentId: string, 
    orderId: string, 
    itineraryOverride?: Itinerary, 
    verifiedEmail?: string,
    customerDetails?: { name: string; address: string; phone: string; email: string }
  ) => {
    const targetItinerary = itineraryOverride || gatewayItinerary || checkoutItinerary;
    if (!targetItinerary) return;

    const targetEmail = verifiedEmail || customerDetails?.email || user.email;
    const targetName = customerDetails?.name || user.fullName || 'Valued Traveler';
    const targetPhone = customerDetails?.phone || user.mobile || '';
    const targetAddress = customerDetails?.address || '';

    // Confetti explosion
    try {
      confetti({
        particleCount: 140,
        spread: 85,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    const newOrder: OrderRecord = {
      orderId: orderId,
      itineraryId: targetItinerary.id,
      itineraryTitle: targetItinerary.title,
      destination: targetItinerary.destination,
      amountPaid: 99.00,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      paymentMethod: 'UPI / Razorpay Gateway',
      razorpayPaymentId: paymentId,
      agentName: targetItinerary.agent.agencyName,
      agentPhone: targetItinerary.agent.phone,
      agentWhatsapp: targetItinerary.agent.whatsapp,
      agentEmail: targetItinerary.agent.email,
      customerAddress: targetAddress
    };

    // 1. Store in real-time database via backend API
    saveOrderToBackend(
      newOrder, 
      targetItinerary.title, 
      targetItinerary.destination, 
      targetName, 
      targetEmail, 
      targetPhone, 
      targetAddress
    );

    // Update current user state with authentic details
    if (customerDetails?.name || customerDetails?.phone || customerDetails?.email) {
      setUser(prev => ({
        ...prev,
        fullName: targetName,
        email: targetEmail,
        mobile: targetPhone,
        isLoggedIn: true
      }));
    }

    // 2. Automatically dispatch the generated PDF blueprint directly to the customer's authentic Gmail!
    try {
      const pdfBase64 = getItineraryPDFBase64(targetItinerary, newOrder, targetName);
      sendItineraryPdfToEmail({
        toEmail: targetEmail,
        customerName: targetName,
        itineraryTitle: targetItinerary.title,
        destination: targetItinerary.destination,
        orderId: orderId,
        amountPaid: 99.00,
        pdfBase64: pdfBase64,
        agentName: targetItinerary.agent.agencyName,
        agentPhone: targetItinerary.agent.phone,
        agentEmail: targetItinerary.agent.email
      });
    } catch (emailErr) {
      console.warn('PDF email dispatch error:', emailErr);
    }

    localStorage.setItem('v3_auth_active', 'true');

    setUser(prev => ({
      ...prev,
      email: targetEmail,
      isLoggedIn: true,
      role: prev.role || 'customer',
      purchasedOrders: [newOrder, ...prev.purchasedOrders]
    }));

    setGatewayItinerary(null);
    setCheckoutItinerary(null);
    setSelectedItinerary(targetItinerary); // Immediately display the full unlocked itinerary with the PDF!
    showToast(`🎉 Payment Verified! Itinerary PDF emailed to ${targetEmail} & unlocked below.`);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isPurchased = (itineraryId: string) => {
    return user.purchasedOrders.some(order => order.itineraryId === itineraryId);
  };

  const handleOpenAuth = (mode?: 'login' | 'signup', role?: 'customer' | 'admin' | 'agent') => {
    if (mode) setAuthMode(mode);
    if (role) setAuthRole(role);
    setAuthModalOpen(true);
  };

  return (
    <div className="v3-app-root">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification animate-slide-down">
          {toastMessage}
        </div>
      )}

      {/* Top Navigation Header */}
      <Navbar 
        user={user}
        currentPage={currentPage}
        onNavigatePage={handleNavigatePage}
        onOpenAuth={handleOpenAuth}
        onLogout={() => {
          localStorage.removeItem('v3_auth_active');
          setUser(prev => ({ ...prev, isLoggedIn: false }));
          showToast('Signed out successfully');
        }}
        onOpenDashboard={(tab) => {
          setDashboardTab(tab);
          setDashboardOpen(true);
        }}
        onOpenAdminDashboard={() => setAdminDashboardOpen(true)}
        onOpenAgentDashboard={() => handleNavigatePage('agent-studio')}
        onOpenAgentModal={() => setAgentModalOpen(true)}
        onScrollToSection={scrollToSection}
        isAgentPageOpen={agentModalOpen}
      />

      {/* Main Page Body — replaced by gateway, destination packages page, or dedicated Destinations page */}
      {gatewayItinerary ? (
        <RazorpayRedirectGateway 
          itinerary={gatewayItinerary}
          customerName={user.fullName}
          customerEmail={user.email}
          customerMobile={user.mobile}
          onSuccess={(paymentId, orderId, verifiedEmail, customerDetails) => {
            handlePaymentSuccess(paymentId, orderId, gatewayItinerary, verifiedEmail, customerDetails);
          }}
          onCancel={() => {
            const it = gatewayItinerary;
            setGatewayItinerary(null);
            setSelectedItinerary(it);
          }}
        />
      ) : selectedDestinationName ? (
        <DestinationPackagesModal 
          destinationName={selectedDestinationName}
          allItineraries={allItineraries}
          savedIds={user.savedItineraryIds}
          isPurchased={isPurchased}
          backLabel={currentPage === 'destinations' ? '← Back to All Destinations' : '← Back to Home'}
          onClose={() => {
            setSelectedDestinationName(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectPackage={(itinerary) => {
            setSelectedItinerary(itinerary);
          }}
          onPayToView={(itinerary) => {
            handleStartCheckout(itinerary);
          }}
          onToggleSave={handleToggleSave}
          onSelectDestination={(newDest) => {
            setSelectedDestinationName(newDest);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentPage === 'destinations' ? (
        <>
          <DestinationsPage 
            destinationsMaster={destinationsMaster}
            allItineraries={allItineraries}
            savedIds={user.savedItineraryIds}
            onSelectDestination={(destName) => {
              setSelectedDestinationName(destName);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectItinerary={(itinerary) => {
              setSelectedItinerary(itinerary);
            }}
            onToggleSave={handleToggleSave}
            onBackToHome={() => handleNavigatePage('home')}
          />

          {/* Footer */}
          <Footer 
            onOpenAgentModal={() => setAgentModalOpen(true)}
            onScrollToSection={scrollToSection}
            onSelectDestination={(name) => {
              setSelectedDestinationName(name);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigatePage={handleNavigatePage}
          />
        </>
      ) : currentPage === 'agent-studio' ? (
        <>
          <AgentDashboardModal 
            isPage={true}
            user={user}
            allItineraries={allItineraries}
            onBackToHome={() => handleNavigatePage('home')}
            onClose={() => handleNavigatePage('home')}
            onSelectItinerary={(it) => setSelectedItinerary(it)}
            onDataRefresh={loadData}
            onOpenAgentOnboarding={() => setAgentModalOpen(true)}
          />

          {/* Footer */}
          <Footer 
            onOpenAgentModal={() => setAgentModalOpen(true)}
            onScrollToSection={scrollToSection}
            onSelectDestination={(name) => {
              setSelectedDestinationName(name);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigatePage={handleNavigatePage}
          />
        </>
      ) : (
        <>
          <main>
            {/* 1. Hero Section with Search Engine and Trust Bar */}
            <HeroSection 
              onSearch={handleHeroSearch}
              activeFilter={searchFilter}
              availableDestinations={destinationsMaster}
            />

            {/* 2. Popular Destinations & Live Search Results Engine */}
            <PopularDestinations 
              destinations={filteredDestinations}
              destinationsMaster={destinationsMaster}
              savedIds={user.savedItineraryIds}
              searchFilter={searchFilter}
              isViewingAll={isViewingAll}
              onClearSearch={handleClearSearch}
              onRemoveFilter={handleRemoveFilter}
              onToggleSave={handleToggleSave}
              onSelectDestination={(destName) => {
                setSelectedDestinationName(destName);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectItinerary={(itinerary) => {
                setSelectedItinerary(itinerary);
              }}
              onBuyItinerary={(itinerary) => {
                handleStartCheckout(itinerary);
              }}
              onViewAll={handleViewAll}
              onBackToPopular={handleBackToPopular}
              onNavigateToDestinationsPage={() => handleNavigatePage('destinations')}
            />

            {/* 3. Middle Section: How It Works + Agent Promo + Stats */}
            <MiddleSection 
              onOpenAgentModal={() => setAgentModalOpen(true)}
            />

            {/* 4. Trust Pillars & Pricing Guardrail Strip */}
            <TrustBar />
          </main>

          {/* Footer */}
          <Footer 
            onOpenAgentModal={() => setAgentModalOpen(true)}
            onScrollToSection={scrollToSection}
            onSelectDestination={(name) => {
              setSelectedDestinationName(name);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigatePage={handleNavigatePage}
          />
        </>
      )}

      {/* MODAL 1: Package Split Detail Popup with Picture, Summary & Razorpay */}
      {selectedItinerary && (
        <ItineraryDetailModal 
          itinerary={selectedItinerary}
          onClose={() => setSelectedItinerary(null)}
          onBuy={handleStartCheckout}
          isSaved={Boolean(
            selectedItinerary && (
              user.savedItineraryIds.includes(selectedItinerary.id) ||
              user.savedItineraryIds.includes(`dest-${selectedItinerary.destination.toLowerCase().replace(/\s+/g, '-')}`) ||
              user.savedItineraryIds.some(sid => sid.toLowerCase() === selectedItinerary.destination.toLowerCase())
            )
          )}
          onToggleSave={handleToggleSave}
          isPurchased={isPurchased(selectedItinerary.id)}
          order={user.purchasedOrders.find(o => o.itineraryId === selectedItinerary.id)}
          customerName={user.fullName}
          customerEmail={user.email}
          onOpenOrderSuccess={() => {}}
        />
      )}

      {/* MODAL 2: Fallback In-App Modal */}
      {checkoutItinerary && (
        <RazorpayModal 
          itinerary={checkoutItinerary}
          onClose={() => setCheckoutItinerary(null)}
          onSuccess={handlePaymentSuccess}
          customerName={user.fullName}
          customerEmail={user.email}
          customerMobile={user.mobile}
        />
      )}

      {/* MODAL 3: Order Fulfillment & Agent Direct Connectors */}
      {fulfilledOrder && (
        <OrderSuccessModal 
          itinerary={fulfilledOrder.itinerary}
          order={fulfilledOrder.order}
          customerName={user.fullName}
          onClose={() => setFulfilledOrder(null)}
          onViewMyTrips={() => {
            setFulfilledOrder(null);
            setDashboardTab('trips');
            setDashboardOpen(true);
          }}
        />
      )}

      {/* MODAL 4: Customer Dashboard Hub ("My Trips", "Saved", "Invoices") */}
      {dashboardOpen && (
        <CustomerDashboardModal 
          user={user}
          allItineraries={allItineraries}
          initialTab={dashboardTab}
          onClose={() => setDashboardOpen(false)}
          onSelectItinerary={(it) => {
            setDashboardOpen(false);
            setSelectedItinerary(it);
          }}
          onRemoveSaved={handleToggleSave}
          onUpdatePreferences={(type, budget) => {
            setUser(prev => ({
              ...prev,
              preferredTravelType: type,
              preferredBudgetTier: budget
            }));
            showToast('Preferences updated');
          }}
          onOpenAuth={handleOpenAuth}
        />
      )}

      {/* MODAL 5: Full Travel Agent Onboarding Page with Document Upload */}
      <TravelAgentOnboardingPage 
        isOpen={agentModalOpen}
        onClose={() => setAgentModalOpen(false)}
      />

      {/* MODAL 6: Customer, Travel Agent & Admin Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        initialMode={authMode}
        initialRole={authRole}
        onClose={() => setAuthModalOpen(false)}
        onOpenAgentOnboarding={() => {
          setAuthModalOpen(false);
          setAgentModalOpen(true);
        }}
        onLoginSuccess={(profile) => {
          localStorage.setItem('v3_auth_active', 'true');
          setUser(prev => ({
            ...prev,
            ...profile,
            isLoggedIn: true
          }));
          if (profile.role === 'admin') {
            showToast('🛡️ Signed in as V3 Platform Administrator');
          } else if (profile.role === 'agent') {
            showToast(`💼 Welcome to Travel Agent Studio, ${profile.agentDetails?.agencyName || profile.fullName}!`);
            handleNavigatePage('agent-studio');
          } else {
            showToast(`Welcome back, ${profile.fullName || user.fullName}!`);
          }
        }}
      />

      {/* MODAL 7: Platform Admin Operations & KYC Console */}
      <AdminDashboardModal 
        isOpen={adminDashboardOpen}
        allItineraries={allItineraries}
        onClose={() => setAdminDashboardOpen(false)}
        onSelectItinerary={(it) => {
          setAdminDashboardOpen(false);
          setSelectedItinerary(it);
        }}
      />
    </div>
  );
}

export default App;
