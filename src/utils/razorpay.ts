import type { Itinerary } from "../types";
import { initiateOrderInBackend, updateOrderStatusInBackend, createRazorpayOrder } from "./api";

export interface RazorpayPaymentParams {
  itinerary: Itinerary;
  amount?: number; // in INR, defaults to 99
  customerName?: string;
  customerEmail?: string;
  customerMobile?: string;
  onSuccess: (paymentId: string, orderId: string, verifiedCustomer?: { name: string; email: string; phone: string }) => void;
  onFailure?: (error: any) => void;
  onDismiss?: () => void;
}

/**
 * Checks whether a real, active Razorpay API key (test or live) is configured
 */
export const hasCustomRazorpayKey = (): boolean => {
  const key = (import.meta.env.VITE_RAZORPAY_KEY_ID || "").trim();
  return Boolean(
    key && 
    typeof key === "string" && 
    key.length > 10 && 
    (key.startsWith("rzp_live_") || key.startsWith("rzp_test_")) && 
    key !== "rzp_live_Tq8dvK47AREHHK" &&
    key !== "your_razorpay_key_id_here"
  );
};

export const getRazorpayKeyId = (): string => {
  const key = (import.meta.env.VITE_RAZORPAY_KEY_ID || "").trim();
  return key || "rzp_live_Tq8dvK47AREHHK";
};

/**
 * Opens official Razorpay Standard Checkout popup directly (Google Pay, UPI, Cards, NetBanking)
 */
export const openRazorpayCheckout = async ({
  itinerary,
  amount = 99,
  customerName = "Valued Traveler",
  customerEmail = "",
  customerMobile = "",
  onSuccess,
  onFailure,
  onDismiss
}: RazorpayPaymentParams) => {
  const apiKey = getRazorpayKeyId();
  const generatedOrderId = `V3I-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
  const cleanPhone = (customerMobile || "").replace(/[^0-9]/g, "").slice(-10);
  const cleanName = (customerName || "").trim() || "Valued Traveler";
  const cleanEmail = (customerEmail || "").trim();

  // 1. Immediately log INITIATED in MySQL
  try {
    await initiateOrderInBackend({
      orderId: generatedOrderId,
      itineraryId: itinerary.id,
      itineraryTitle: itinerary.title,
      destination: itinerary.destination,
      customerName: cleanName,
      customerEmail: cleanEmail,
      customerMobile: cleanPhone,
      customerAddress: "",
      amountPaid: amount,
      agentName: itinerary.agent?.agencyName || "Verified Agent",
      agentPhone: itinerary.agent?.phone || "",
      agentEmail: itinerary.agent?.email || "",
      agentWhatsapp: itinerary.agent?.whatsapp || ""
    });
  } catch (initErr) {
    console.warn("Initiated order notice:", initErr);
  }

  // 2. Request official server-side Razorpay Order ID (required for live UPI / Google Pay auto-capture)
  let serverOrderId = "";
  try {
    const orderRes = await createRazorpayOrder(amount, generatedOrderId, {
      destination: itinerary.destination,
      itineraryId: itinerary.id,
      orderRef: generatedOrderId
    });
    if (orderRes?.order?.id) {
      serverOrderId = orderRes.order.id;
    }
  } catch (orderErr) {
    console.warn("Backend order creation notice:", orderErr);
  }

  // 3. Ensure Razorpay checkout script is ready
  if (typeof (window as any).Razorpay === "undefined") {
    try {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
        document.body.appendChild(script);
      });
    } catch (sdkErr) {
      console.error(sdkErr);
      if (onFailure) onFailure(sdkErr);
      return;
    }
  }

  const options: any = {
    key: apiKey,
    amount: Math.round(amount * 100), // in paise (9900 = ₹99.00)
    currency: "INR",
    name: "V3Itinerary Platforms India Pvt Ltd",
    description: `${itinerary.destination} Complete Travel Itinerary`,
    image: "https://v3itinerary.com/favicon.png",
    handler: async function (response: any) {
      const pid = response.razorpay_payment_id || `pay_rzp_${Date.now()}`;

      // Update status to PAID in MySQL
      try {
        await updateOrderStatusInBackend(generatedOrderId, "PAID", {
          razorpayPaymentId: pid
        });
      } catch (e) {
        console.warn("MySQL update notice:", e);
      }

      onSuccess(pid, generatedOrderId, {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone
      });
    },
    prefill: {
      name: cleanName !== "Valued Traveler" ? cleanName : "",
      email: cleanEmail,
      contact: cleanPhone
    },
    notes: {
      orderId: generatedOrderId,
      itineraryId: itinerary.id,
      destination: itinerary.destination,
      packageTitle: itinerary.title
    },
    theme: {
      color: "#0F2C59"
    },
    modal: {
      ondismiss: function () {
        updateOrderStatusInBackend(generatedOrderId, "CANCELLED", {
          reason: "User closed Razorpay modal"
        });
        if (onDismiss) onDismiss();
      }
    }
  };

  if (serverOrderId) {
    options.order_id = serverOrderId;
  }

  try {
    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", function (response: any) {
      console.warn("Razorpay payment failed:", response.error);
      updateOrderStatusInBackend(generatedOrderId, "FAILED", {
        reason: response.error?.description || "Payment failed or declined"
      });
      if (onFailure) onFailure(response.error);
    });
    rzp.open();
  } catch (err: any) {
    console.error("Could not launch Razorpay popup:", err);
    updateOrderStatusInBackend(generatedOrderId, "FAILED", {
      reason: err?.message || "Gateway launch failure"
    });
    if (onFailure) onFailure(err);
  }
};
