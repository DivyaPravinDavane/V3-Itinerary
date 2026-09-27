import type { OrderRecord } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL 
  ? `${(import.meta as any).env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : 'http://localhost:5000/api';

export interface RealtimeStats {
  totalOrders: number;
  totalRevenue: number;
  verifiedAgents: number;
  registeredUsers: number;
  recentOrders: any[];
  databaseEngine: string;
  dbPath: string;
  isMysqlConnected: boolean;
  timestamp: string;
}

/**
 * Subscribe to Real-Time Database SSE Stream
 * Automatically reconnects if connection drops.
 */
export function subscribeToRealtimeEvents(onEvent: (event: string, data: any) => void): () => void {
  let eventSource: EventSource | null = null;
  let reconnectTimeout: any = null;

  function connect() {
    try {
      eventSource = new EventSource(`${API_BASE_URL}/realtime/stream`);

      eventSource.addEventListener('connected', (e) => {
        try {
          const payload = JSON.parse(e.data);
          onEvent('connected', payload);
        } catch (err) {
          // ignore
        }
      });

      eventSource.addEventListener('order_created', (e) => {
        try {
          const payload = JSON.parse(e.data);
          onEvent('order_created', payload);
        } catch (err) {
          // ignore
        }
      });

      eventSource.addEventListener('agent_registered', (e) => {
        try {
          const payload = JSON.parse(e.data);
          onEvent('agent_registered', payload);
        } catch (err) {
          // ignore
        }
      });

      eventSource.addEventListener('agent_status_updated', (e) => {
        try {
          const payload = JSON.parse(e.data);
          onEvent('agent_status_updated', payload);
        } catch (err) {
          // ignore
        }
      });

      eventSource.addEventListener('wishlist_updated', (e) => {
        try {
          const payload = JSON.parse(e.data);
          onEvent('wishlist_updated', payload);
        } catch (err) {
          // ignore
        }
      });

      eventSource.addEventListener('email_dispatched', (e) => {
        try {
          const payload = JSON.parse(e.data);
          onEvent('email_dispatched', payload);
        } catch (err) {
          // ignore
        }
      });

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        reconnectTimeout = setTimeout(connect, 4000);
      };
    } catch (err) {
      reconnectTimeout = setTimeout(connect, 4000);
    }
  }

  connect();

  return () => {
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    if (eventSource) eventSource.close();
  };
}

/**
 * Save paid order to real-time database (instant ACID write + broadcast)
 */
export async function saveOrderToBackend(
  order: OrderRecord,
  itineraryTitle?: string,
  destination?: string,
  customerName?: string,
  customerEmail?: string,
  customerMobile?: string,
  customerAddress?: string
) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: order.orderId,
        itineraryId: order.itineraryId,
        itineraryTitle: itineraryTitle || order.itineraryTitle,
        destination: destination || order.destination,
        customerName: customerName || 'Valued Traveler',
        customerEmail: customerEmail || 'traveler@v3itinerary.com',
        customerMobile: customerMobile || '',
        customerAddress: customerAddress || order.customerAddress || '',
        amountPaid: order.amountPaid || 99.00,
        paymentMethod: order.paymentMethod || 'UPI / Razorpay Gateway',
        razorpayPaymentId: order.razorpayPaymentId,
        razorpayOrderId: order.orderId,
        agentName: order.agentName,
        agentPhone: order.agentPhone,
        agentEmail: order.agentEmail,
        agentWhatsapp: order.agentWhatsapp
      })
    });

    if (!response.ok) {
      console.warn(`Real-time backend responded with status ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('Real-time database sync notice:', err);
    return null;
  }
}

/**
 * Initiate an order when user clicks Proceed to Razorpay (Status = INITIATED)
 */
export async function initiateOrderInBackend(orderData: {
  orderId: string;
  itineraryId: string;
  itineraryTitle: string;
  destination: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  customerAddress: string;
  amountPaid?: number;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  agentWhatsapp?: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Error initiating order in MySQL:', err);
  }
  return null;
}

/**
 * Update an order status in MySQL (e.g. CANCELLED, FAILED, PAID)
 */
export async function updateOrderStatusInBackend(
  orderId: string, 
  status: 'INITIATED' | 'CANCELLED' | 'FAILED' | 'PAID', 
  details?: { razorpayPaymentId?: string; reason?: string }
) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/update-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        status,
        razorpayPaymentId: details?.razorpayPaymentId,
        reason: details?.reason
      })
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn(`Error updating order status to ${status} in MySQL:`, err);
  }
  return null;
}

/**
 * Fetch orders from real-time backend
 */
export async function fetchOrdersFromBackend(email?: string) {
  try {
    const url = email 
      ? `${API_BASE_URL}/orders?email=${encodeURIComponent(email)}` 
      : `${API_BASE_URL}/orders`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return data.orders || [];
  } catch (e) {
    return [];
  }
}

/**
 * Fetch live real-time statistics
 */
export async function fetchRealtimeStats(): Promise<RealtimeStats | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/realtime/stats`);
    if (res.ok) {
      const data = await res.json();
      return data.stats;
    }
  } catch (e) {
    // backend offline
  }
  return null;
}

/**
 * Fetch live activity feed
 */
export async function fetchRealtimeActivities() {
  try {
    const res = await fetch(`${API_BASE_URL}/realtime/activities`);
    if (res.ok) {
      const data = await res.json();
      return data.activities || [];
    }
  } catch (e) {
    // offline
  }
  return [];
}

/**
 * Upload Document or Logo to Backend File Storage
 */
export async function uploadDocumentToBackend(file: File): Promise<{
  success: boolean;
  url: string;
  fileName: string;
  originalName: string;
  size: number;
} | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const fileBase64 = reader.result as string;
        const res = await fetch(`${API_BASE_URL}/upload-document`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileBase64,
            mimeType: file.type
          })
        });
        if (res.ok) {
          const data = await res.json();
          resolve(data);
          return;
        }
        resolve(null);
      } catch (err) {
        console.warn('Document upload error:', err);
        resolve(null);
      }
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

/**
 * Register Agent in Real-Time Database with full onboarding profile
 */
export async function registerAgentInBackend(agentData: {
  agencyName: string;
  contactPerson?: string;
  founderName?: string;
  gstNumber?: string;
  gstin?: string;
  email: string;
  phone: string;
  mobile?: string;
  whatsapp?: string;
  city?: string;
  state?: string;
  experienceYears?: string | number;
  businessType?: string;
  specialisations?: string[];
  aboutAgency?: string;
  destinationsSold?: string;
  plannedUploads?: string;
  businessProofDoc?: { name: string; url?: string; size?: number };
  logoDoc?: { name: string; url?: string };
  socialLink?: string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/agents/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agentData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Agent registration error:', err);
    return null;
  }
}

/**
 * Fetch verified agents list from backend
 */
export async function fetchAgentsFromBackend() {
  try {
    const res = await fetch(`${API_BASE_URL}/agents`);
    if (res.ok) {
      const data = await res.json();
      return data.agents || [];
    }
  } catch (e) {
    // offline
  }
  return [];
}

/**
 * Sync Wishlist in Real-Time Database
 */
export async function toggleWishlistInBackend(userEmail: string, itineraryId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/wishlist/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, itineraryId })
    });
    return await res.json();
  } catch (e) {
    return null;
  }
}

/**
 * Check backend health and real-time database connection
 */
export async function checkBackendStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Backend offline
  }
  return null;
}

/**
 * Dispatches the itinerary PDF directly to the customer's authentic Gmail address
 */
export async function sendItineraryPdfToEmail({
  toEmail,
  customerName,
  itineraryTitle,
  destination,
  orderId,
  amountPaid = 99.00,
  pdfBase64,
  agentName,
  agentPhone,
  agentEmail
}: {
  toEmail: string;
  customerName: string;
  itineraryTitle: string;
  destination: string;
  orderId: string;
  amountPaid?: number;
  pdfBase64: string;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/send-pdf-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        toEmail,
        customerName,
        itineraryTitle,
        destination,
        orderId,
        amountPaid,
        pdfBase64,
        agentName,
        agentPhone,
        agentEmail
      })
    });

    if (!res.ok) {
      console.warn(`Failed to dispatch email: ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.warn('Error calling /api/send-pdf-email:', err);
    return null;
  }
}

/**
 * Fetch all dynamic itineraries from the MySQL database via API
 */
export async function fetchItineraries() {
  try {
    const res = await fetch(`${API_BASE_URL}/itineraries`);
    if (!res.ok) {
      console.warn(`Failed to fetch itineraries: ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return data.itineraries || [];
  } catch (err) {
    console.warn('Error fetching itineraries from backend:', err);
    return [];
  }
}

/**
 * Fetch all dynamic destinations from MySQL master table via API
 */
export async function fetchDestinations() {
  try {
    const res = await fetch(`${API_BASE_URL}/destinations`);
    if (!res.ok) {
      console.warn(`Failed to fetch destinations: ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return data.destinations || [];
  } catch (err) {
    console.warn('Error fetching destinations from backend:', err);
    return [];
  }
}

/**
 * Fetch user saved wishlist itinerary IDs from MySQL
 */
export async function fetchWishlistFromBackend(email: string): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/wishlist?email=${encodeURIComponent(email)}`);
    if (res.ok) {
      const data = await res.json();
      return data.savedIds || [];
    }
  } catch (err) {
    console.warn('Error fetching wishlist:', err);
  }
  return [];
}

/**
 * Toggle featured (is_popular) status of an itinerary directly in MySQL
 */
export async function updateItineraryFeaturedStatus(id: string, isPopular: boolean) {
  try {
    const res = await fetch(`${API_BASE_URL}/itineraries/${id}/featured`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPopular })
    });
    return await res.json();
  } catch (err) {
    console.warn('Error updating featured status:', err);
    return null;
  }
}

/**
 * Create or save new itinerary blueprint directly to MySQL
 */
export async function createItineraryInBackend(itineraryData: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/itineraries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itineraryData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Error creating itinerary:', err);
    return null;
  }
}

/**
 * Delete itinerary blueprint directly from MySQL
 */
export async function deleteItineraryFromBackend(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/itineraries/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err) {
    console.warn('Error deleting itinerary:', err);
    return null;
  }
}

