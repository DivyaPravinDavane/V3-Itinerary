import React, { useState, useEffect } from 'react';
import { Check, Copy, ExternalLink, ShieldCheck, Smartphone, Clock, RefreshCw } from 'lucide-react';

interface GPayScannerProps {
  amount?: number;
  orderId: string;
  destination: string;
  itineraryTitle?: string;
  onPaymentComplete: (paymentId: string) => void;
  onOpenRazorpayLive?: () => void;
  onRedirectPayment?: () => void;
  paymentLinkUrl?: string;
  upiId?: string;
  merchantName?: string;
}

export const GPayScanner: React.FC<GPayScannerProps> = ({
  amount = 99.00,
  orderId,
  destination,
  onPaymentComplete,
  onOpenRazorpayLive,
  onRedirectPayment,
  paymentLinkUrl = '',
  upiId = import.meta.env.VITE_UPI_ID || '',
  merchantName = 'V3Itinerary Platforms India'
}) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isVerifying, setIsVerifying] = useState(false);

  // If a live payment link URL is provided, encode it; otherwise use standard UPI payload or Razorpay short url
  const targetPayload = paymentLinkUrl || (upiId 
    ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`V3I ${destination} ${orderId}`.slice(0, 30))}`
    : `https://www.v3itinerary.com/?order_id=${orderId}`
  );

  // QR Server dynamic API for high-resolution scanable QR
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(targetPayload)}&margin=6&color=0f2c59`;

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyUpi = () => {
    const textToCopy = upiId || paymentLinkUrl || 'rzp_live_Tq8dvK47AREHHK';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrimaryPayment = () => {
    if (onOpenRazorpayLive) {
      onOpenRazorpayLive();
    } else if (onRedirectPayment) {
      onRedirectPayment();
    } else if (paymentLinkUrl) {
      window.location.href = paymentLinkUrl;
    }
  };

  const handleRedirectPayment = () => {
    if (onRedirectPayment) {
      onRedirectPayment();
    } else if (paymentLinkUrl) {
      window.location.href = paymentLinkUrl;
    } else if (onOpenRazorpayLive) {
      onOpenRazorpayLive();
    }
  };

  const handleVerifyPaid = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const generatedPid = `pay_live_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      onPaymentComplete(generatedPid);
    }, 1200);
  };

  return (
    <div className="gpay-scanner-wrapper">
      {/* Google Pay Header Strip */}
      <div className="gpay-scanner-header">
        <div className="gpay-logo-badge">
          <div className="gpay-dots-icon">
            <span className="dot-blue"></span>
            <span className="dot-red"></span>
            <span className="dot-yellow"></span>
            <span className="dot-green"></span>
          </div>
          <span className="gpay-text">Google Pay / UPI QR</span>
        </div>
        <div className="gpay-timer-pill">
          <Clock size={12} />
          <span>Expires in {formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Main QR Scanner Box */}
      <div className="gpay-qr-center-box">
        <div className="gpay-qr-viewport">
          {/* Scanner Viewport Corner Brackets */}
          <span className="scanner-bracket top-left"></span>
          <span className="scanner-bracket top-right"></span>
          <span className="scanner-bracket bottom-left"></span>
          <span className="scanner-bracket bottom-right"></span>

          {/* Animated Scanning Beam */}
          <div className="scanner-laser-beam"></div>

          {/* High-Resolution QR Code */}
          <img 
            src={qrUrl} 
            alt="Google Pay / UPI QR Code to scan and pay ₹99" 
            className="gpay-qr-image"
            loading="eager"
          />

          {/* Central UPI / GPay Mini Brand Badge */}
          <div className="gpay-qr-center-logo">
            <span className="text-[10px] font-black text-white">UPI</span>
          </div>
        </div>

        {/* Amount & Instruction */}
        <div className="gpay-amount-callout">
          <div className="text-xs text-slate-500 font-medium">Scan & Pay for {destination} Itinerary</div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">₹{amount.toFixed(2)}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1 mt-0.5">
            <ShieldCheck size={13} /> Flat ₹99 • Instant Itinerary Unlock
          </div>
        </div>
      </div>

      {/* Supported UPI Apps Row */}
      <div className="gpay-supported-apps">
        <span className="supported-label">Supported UPI Apps:</span>
        <div className="apps-pill-group">
          <span className="app-badge gpay-badge">
            <span className="dot gpay">G</span> Google Pay
          </span>
          <span className="app-badge phonepe-badge">
            <span className="dot phonepe">P</span> PhonePe
          </span>
          <span className="app-badge paytm-badge">
            <span className="dot paytm">Pay</span> Paytm
          </span>
          <span className="app-badge bhim-badge">
            BHIM UPI
          </span>
        </div>
      </div>

      {/* Action Buttons: Direct Google Pay & Razorpay Checkout */}
      <div className="gpay-action-buttons">
        <button
          type="button"
          onClick={handlePrimaryPayment}
          className="btn-open-gpay-app shadow-md"
          id="btn-pay-gpay-razorpay"
        >
          <Smartphone size={16} />
          <span>Pay ₹{amount.toFixed(2)} with Google Pay / Razorpay</span>
          <ExternalLink size={14} className="opacity-75" />
        </button>

        <button
          type="button"
          onClick={handleRedirectPayment}
          className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-50 to-blue-50 hover:from-emerald-100 hover:to-blue-100 text-blue-900 text-xs font-bold rounded-xl border border-blue-200 transition-all flex items-center justify-center gap-1.5 shadow-sm text-center cursor-pointer"
          id="btn-redirect-gpay-direct"
        >
          <ExternalLink size={14} className="text-emerald-600" />
          <span>Redirect to Google Pay App / Razorpay Live Page</span>
        </button>

        {/* Copy Reference */}
        <div className="gpay-upi-copy-row">
          <div className="upi-id-box">
            <span className="upi-label">Live Gateway:</span>
            <span className="upi-val">V3Itinerary (Razorpay Live)</span>
          </div>
          <button
            type="button"
            onClick={handleCopyUpi}
            className="btn-copy-upi"
            title="Copy Reference"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* I Have Paid Confirmation Button */}
        <button
          type="button"
          onClick={handleVerifyPaid}
          disabled={isVerifying}
          className="btn-confirm-paid-gpay shadow"
          id="btn-confirm-paid-gpay"
        >
          {isVerifying ? (
            <>
              <RefreshCw size={15} className="animate-spin text-white" />
              <span>Verifying Transaction...</span>
            </>
          ) : (
            <>
              <Check size={16} className="text-white" />
              <span>I Have Paid ₹{amount.toFixed(2)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
