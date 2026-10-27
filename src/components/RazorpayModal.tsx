import React, { useState } from "react";
import { X, ShieldCheck, Mail, User, Smartphone, Lock, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import type { Itinerary } from "../types";
import { openRazorpayCheckout } from "../utils/razorpay";

interface RazorpayModalProps {
  itinerary: Itinerary | null;
  onClose: () => void;
  onSuccess: (paymentId: string, orderId: string, verifiedCustomer?: { name: string; email: string; phone: string }) => void;
  customerName?: string;
  customerEmail?: string;
  customerMobile?: string;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  itinerary,
  onClose,
  onSuccess,
  customerName = "",
  customerEmail = "",
  customerMobile = ""
}) => {
  const [name, setName] = useState(customerName || "");
  const [phone, setPhone] = useState((customerMobile || "").replace(/[^0-9]/g, "").slice(-10));
  const [email, setEmail] = useState(customerEmail || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!itinerary) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter your Full Name.");
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit Mobile Phone Number.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid Gmail / Email address to deliver your PDF itinerary.");
      return;
    }

    setIsProcessing(true);

    try {
      await openRazorpayCheckout({
        itinerary,
        amount: 99.00,
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerMobile: cleanPhone,
        onSuccess: (pid, oid, customer) => {
          setIsProcessing(false);
          onClose();
          onSuccess(pid, oid, customer || { name: name.trim(), email: email.trim(), phone: cleanPhone });
        },
        onDismiss: () => {
          setIsProcessing(false);
        },
        onFailure: (err) => {
          setIsProcessing(false);
          setErrorMessage(err?.description || err?.message || "Payment could not be completed. Please try again.");
        }
      });
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err?.message || "Unable to launch Razorpay gateway. Please try again.");
    }
  };

  return (
    <div 
      className="modal-overlay animate-fade-in" 
      onClick={onClose} 
      style={{ 
        zIndex: 2500,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(7, 18, 36, 0.8)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        overflowY: "auto"
      }}
    >
      <div 
        className="animate-scale-up" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "480px",
          width: "100%",
          background: "#0a192f",
          borderRadius: "20px",
          border: "1px solid rgba(56, 189, 248, 0.3)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 20px rgba(2, 132, 199, 0.2)",
          overflow: "hidden",
          color: "#ffffff",
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #09172c 0%, #102a4e 100%)",
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          position: "relative"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                background: "#0284c7",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "11px",
                padding: "3px 8px",
                borderRadius: "6px",
                letterSpacing: "0.5px"
              }}>
                RAZORPAY LIVE
              </span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#34d399", display: "flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={13} /> Live Payment Gateway
              </span>
            </div>
            <button 
              onClick={onClose}
              style={{
                color: "#94a3b8",
                background: "rgba(255, 255, 255, 0.05)",
                border: "none",
                borderRadius: "8px",
                padding: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s"
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", margin: "6px 0 4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Unlock Itinerary Blueprint</span>
            <Sparkles size={16} style={{ color: "#fbbf24" }} />
          </h3>
          <p style={{ fontSize: "12px", color: "#cbd5e1", margin: 0, lineHeight: 1.4 }}>
            Complete payment via Google Pay (GPay) or Razorpay to instantly view, unlock, and download your comprehensive PDF itinerary.
          </p>
        </div>

        {/* Selected Package Summary */}
        <div style={{
          padding: "14px 24px",
          background: "rgba(15, 39, 74, 0.6)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ paddingRight: "12px" }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#38bdf8", fontWeight: 700, display: "block" }}>
              Selected Itinerary
            </span>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#f1f5f9", marginTop: "2px" }}>
              {itinerary.title}
            </div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
              {itinerary.destination} • {itinerary.durationDays}D/{itinerary.durationNights}N Complete Plan
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: "11px", color: "#94a3b8", textDecoration: "line-through" }}>₹499</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#34d399", lineHeight: 1.1 }}>₹99.00</div>
            <div style={{ fontSize: "10px", color: "#6ee7b7", marginTop: "2px" }}>All Taxes Incl.</div>
          </div>
        </div>

        {/* Form Body */}
        <div style={{ padding: "20px 24px" }}>
          {errorMessage && (
            <div style={{
              marginBottom: "16px",
              padding: "10px 14px",
              background: "rgba(136, 19, 55, 0.4)",
              border: "1px solid rgba(244, 63, 94, 0.5)",
              borderRadius: "10px",
              color: "#fecdd3",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0, color: "#fb7185" }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Full Name */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                <User size={13} style={{ color: "#38bdf8" }} />
                <span>Full Name <span style={{ color: "#f87171" }}>*</span></span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrorMessage(""); }}
                placeholder="e.g. Rahul Sharma"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 14px",
                  background: "#071326",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  borderRadius: "10px",
                  fontSize: "13px",
                  color: "#ffffff",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
              />
            </div>

            {/* Mobile & Email 2-col */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                  <Smartphone size={13} style={{ color: "#38bdf8" }} />
                  <span>Phone Number <span style={{ color: "#f87171" }}>*</span></span>
                </label>
                <div style={{ display: "flex", width: "100%", boxSizing: "border-box" }}>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0 10px",
                    background: "#0e223d",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    borderRight: "none",
                    borderRadius: "10px 0 0 10px",
                    fontSize: "12px",
                    color: "#94a3b8",
                    fontWeight: 600
                  }}>
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { 
                      setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10)); 
                      setErrorMessage(""); 
                    }}
                    placeholder="9876543210"
                    maxLength={10}
                    required
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "10px 12px",
                      background: "#071326",
                      border: "1px solid rgba(56, 189, 248, 0.3)",
                      borderRadius: "0 10px 10px 0",
                      fontSize: "13px",
                      color: "#ffffff",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                  <Mail size={13} style={{ color: "#38bdf8" }} />
                  <span>Gmail / Email <span style={{ color: "#f87171" }}>*</span></span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMessage(""); }}
                  placeholder="yourname@gmail.com"
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "10px 12px",
                    background: "#071326",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    borderRadius: "10px",
                    fontSize: "13px",
                    color: "#ffffff",
                    outline: "none"
                  }}
                />
              </div>
            </div>

            {/* Supported Payment Logos Tag */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", paddingTop: "2px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ display: "inline-block", width: "7px", height: "7px", borderRadius: "50%", background: "#34d399" }}></span>
                GPay, PhonePe, Paytm, Cards & NetBanking
              </span>
              <span style={{ color: "#38bdf8", fontWeight: 600 }}>Auto-Capture</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              style={{
                marginTop: "6px",
                width: "100%",
                padding: "13px 18px",
                background: "linear-gradient(135deg, #1d4ed8 0%, #0284c7 100%)",
                border: "none",
                borderRadius: "12px",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "14px",
                boxShadow: "0 6px 20px rgba(2, 132, 199, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: isProcessing ? "not-allowed" : "pointer",
                opacity: isProcessing ? 0.7 : 1,
                transition: "all 0.2s"
              }}
            >
              <Lock size={15} />
              <span>{isProcessing ? "Connecting to Razorpay..." : "Proceed to Pay ₹99 via Razorpay / GPay"}</span>
              <span style={{ color: "#93c5fd", fontWeight: 800 }}>→</span>
            </button>

            {/* Security Guarantee Strip */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "11px", color: "#94a3b8", paddingTop: "4px" }}>
              <ShieldCheck size={14} style={{ color: "#34d399" }} />
              <span>Official Razorpay 256-Bit SSL • Instant PDF Delivered to Gmail</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
