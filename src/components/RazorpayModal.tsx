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
    <div className="modal-overlay animate-fade-in" onClick={onClose} style={{ zIndex: 1050 }}>
      <div 
        className="modal-container shadow-2xl animate-scale-up" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "460px",
          width: "92%",
          background: "#0c1b33",
          borderRadius: "20px",
          border: "1px solid rgba(56, 189, 248, 0.25)",
          overflow: "hidden",
          color: "#ffffff"
        }}
      >
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #09172c 0%, #102a4e 100%)",
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          position: "relative"
        }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span style={{
                background: "#0284c7",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "12px",
                padding: "3px 8px",
                borderRadius: "6px",
                letterSpacing: "0.5px"
              }}>
                RAZORPAY LIVE
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={13} /> Live Payment Gateway
              </span>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Unlock Itinerary Blueprint</span>
            <Sparkles size={16} className="text-amber-400" />
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Complete payment via Google Pay (GPay) or Razorpay to instantly view, unlock, and download your comprehensive PDF itinerary.
          </p>
        </div>

        {/* Selected Package Summary */}
        <div style={{
          padding: "14px 20px",
          background: "rgba(15, 39, 74, 0.6)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)"
        }}>
          <div className="flex items-center justify-between">
            <div className="pr-3">
              <span className="text-[11px] uppercase tracking-wider text-sky-400 font-bold">Selected Itinerary</span>
              <div className="text-sm font-semibold text-slate-100 line-clamp-1">{itinerary.title}</div>
              <div className="text-xs text-slate-400">{itinerary.destination} • {itinerary.durationDays}D/{itinerary.durationNights}N Complete Plan</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-slate-400 line-through">₹499</div>
              <div className="text-xl font-extrabold text-emerald-400">₹99.00</div>
              <div className="text-[10px] text-emerald-300">All Taxes Incl.</div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-200 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle size={15} className="shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <User size={13} className="text-sky-400" />
                <span>Full Name <span className="text-rose-400">*</span></span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrorMessage(""); }}
                placeholder="e.g. Rahul Sharma"
                required
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* Mobile & Email 2-col */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Smartphone size={13} className="text-sky-400" />
                  <span>Phone Number <span className="text-rose-400">*</span></span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-2.5 bg-slate-800 border border-r-0 border-slate-700 rounded-l-xl text-xs text-slate-300 font-medium">
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
                    className="w-full px-3 py-2.5 bg-slate-900/90 border border-slate-700 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 rounded-r-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail size={13} className="text-sky-400" />
                  <span>Gmail / Email <span className="text-rose-400">*</span></span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMessage(""); }}
                  placeholder="yourname@gmail.com"
                  required
                  className="w-full px-3 py-2.5 bg-slate-900/90 border border-slate-700 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Supported Payment Logos Tag */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                GPay, PhonePe, Paytm, Cards & NetBanking
              </span>
              <span className="text-slate-400 font-medium">Auto-Capture</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="mt-2 w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Lock size={15} />
              <span>{isProcessing ? "Connecting to Razorpay..." : "Proceed to Pay ₹99 via Razorpay / GPay"}</span>
              <span className="text-sky-200">→</span>
            </button>

            {/* Security Guarantee Strip */}
            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Official Razorpay 256-Bit SSL • Instant PDF Delivered to Gmail</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
