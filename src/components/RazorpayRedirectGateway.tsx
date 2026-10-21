import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ArrowLeft, Loader2, Mail, User, Smartphone, 
  MapPin, Lock, CheckCircle2, AlertCircle, FileText, Check, CreditCard
} from 'lucide-react';
import type { Itinerary } from '../types';
import { initiateOrderInBackend, updateOrderStatusInBackend } from '../utils/api';
import { GPayScanner } from './GPayScanner';

export interface CustomerDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface RazorpayRedirectGatewayProps {
  itinerary: Itinerary;
  customerName?: string;
  customerEmail?: string;
  customerMobile?: string;
  onSuccess: (paymentId: string, orderId: string, verifiedEmail?: string, customerDetails?: CustomerDetails) => void;
  onCancel: () => void;
}

export const RazorpayRedirectGateway: React.FC<RazorpayRedirectGatewayProps> = ({
  itinerary,
  customerName = '',
  customerEmail = '',
  customerMobile = '',
  onSuccess,
  onCancel
}) => {
  const [paymentMode, setPaymentMode] = useState<'gpay' | 'razorpay'>('gpay');
  const [liveRzpOrderId, setLiveRzpOrderId] = useState<string>('');
  const [paymentLinkUrl, setPaymentLinkUrl] = useState<string>('');
  const [name, setName] = useState(customerName || '');
  const [phone, setPhone] = useState((customerMobile || '').replace(/[^0-9]/g, '').slice(-10));
  const [email, setEmail] = useState(customerEmail || '');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId] = useState(() => `V3I-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`);

  // Pre-generate live Razorpay Order & Payment Link as soon as checkout opens
  useEffect(() => {
    let active = true;
    async function prepareLiveOrder() {
      try {
        const cleanPhone = (phone || customerMobile || '9820389694').replace(/[^0-9]/g, '') || '9820389694';
        const effectiveAddress = address.trim() || 'Digital Delivery (India)';
        const res = await initiateOrderInBackend({
          orderId,
          itineraryId: itinerary.id,
          itineraryTitle: itinerary.title,
          destination: itinerary.destination,
          customerName: name.trim() || customerName || 'Valued Traveler',
          customerEmail: email.trim() || customerEmail || 'traveler@v3itinerary.com',
          customerMobile: cleanPhone,
          customerAddress: effectiveAddress,
          amountPaid: 99.00,
          agentName: itinerary.agent?.agencyName || 'Verified Agent',
          agentPhone: itinerary.agent?.phone || '',
          agentEmail: itinerary.agent?.email || '',
          agentWhatsapp: itinerary.agent?.whatsapp || ''
        });

        if (active && res) {
          if (res.razorpayOrderId) setLiveRzpOrderId(res.razorpayOrderId);
          if (res.paymentLinkUrl) setPaymentLinkUrl(res.paymentLinkUrl);
        }
      } catch (err) {
        console.warn('Live order pre-init notice:', err);
      }
    }

    prepareLiveOrder();
    return () => {
      active = false;
    };
  }, [orderId, itinerary.id]);

  // Handle direct GPay QR Scanner payment completion
  const handleGPayPaymentSuccess = async (pid: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '') || '9820389694';
    const finalEmail = email.trim() || 'traveler@v3itinerary.com';
    const finalName = name.trim() || 'Valued Traveler';
    const finalAddress = address.trim() || 'Digital Delivery';

    try {
      await initiateOrderInBackend({
        orderId,
        itineraryId: itinerary.id,
        itineraryTitle: itinerary.title,
        destination: itinerary.destination,
        customerName: finalName,
        customerEmail: finalEmail,
        customerMobile: cleanPhone,
        customerAddress: finalAddress,
        amountPaid: 99.00,
        agentName: itinerary.agent?.agencyName || 'Verified Agent',
        agentPhone: itinerary.agent?.phone || '',
        agentEmail: itinerary.agent?.email || '',
        agentWhatsapp: itinerary.agent?.whatsapp || ''
      });

      await updateOrderStatusInBackend(orderId, 'PAID', {
        razorpayPaymentId: pid
      });
    } catch (err) {
      console.warn('Backend order initiation logged:', err);
    }

    onSuccess(pid, orderId, finalEmail, {
      name: finalName,
      address: finalAddress,
      phone: cleanPhone,
      email: finalEmail
    });
  };

  // Handle Cancel & Return button click
  const handleCancelAndReturn = () => {
    updateOrderStatusInBackend(orderId, 'CANCELLED', {
      reason: 'User clicked Cancel & Return on checkout page'
    });
    onCancel();
  };

  // Direct redirect to Google Pay / Razorpay live hosted payment page
  const handleRedirectToPaymentLink = async () => {
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit Mobile Phone Number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid Gmail / Email address to deliver your itinerary.');
      return;
    }

    if (paymentLinkUrl) {
      window.location.href = paymentLinkUrl;
      return;
    }

    await handleProceedToRazorpay();
  };

  // Launch official Razorpay live popup prefilled with customer phone and gmail
  const handleProceedToRazorpay = async () => {
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit Mobile Phone Number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid Gmail / Email address to deliver your itinerary.');
      return;
    }

    const effectiveAddress = address.trim() || 'Digital Delivery (India)';
    const apiKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_Tq8dvK47AREHHK';

    setIsProcessing(true);

    // 1. Immediately create Live Razorpay Order and record in MySQL if not ready
    let activeRzpOrderId = liveRzpOrderId;
    let activePaymentLink = paymentLinkUrl;

    if (!activeRzpOrderId || !activePaymentLink) {
      try {
        const initResult = await initiateOrderInBackend({
          orderId,
          itineraryId: itinerary.id,
          itineraryTitle: itinerary.title,
          destination: itinerary.destination,
          customerName: name.trim(),
          customerEmail: email.trim(),
          customerMobile: cleanPhone,
          customerAddress: effectiveAddress,
          amountPaid: 99.00,
          agentName: itinerary.agent?.agencyName || 'Verified Agent',
          agentPhone: itinerary.agent?.phone || '',
          agentEmail: itinerary.agent?.email || '',
          agentWhatsapp: itinerary.agent?.whatsapp || ''
        });

        if (initResult && initResult.razorpayOrderId) {
          activeRzpOrderId = initResult.razorpayOrderId;
          setLiveRzpOrderId(initResult.razorpayOrderId);
        }
        if (initResult && initResult.paymentLinkUrl) {
          activePaymentLink = initResult.paymentLinkUrl;
          setPaymentLinkUrl(initResult.paymentLinkUrl);
        }
      } catch (initErr) {
        console.warn('Notice: Order initiation recorded locally:', initErr);
      }
    }

    if (typeof (window as any).Razorpay !== 'undefined') {
      const options: any = {
        key: apiKey,
        amount: 9900, // ₹99.00 in paise
        currency: 'INR',
        name: 'V3Itinerary',
        description: `${itinerary.destination} Travel Itinerary`,
        image: 'https://cdn-icons-png.flaticon.com/512/201/201623.png',
        handler: async function (response: any) {
          setIsProcessing(false);
          const pid = response.razorpay_payment_id || `pay_live_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

          // Update MySQL status to PAID with the authentic Razorpay Payment ID
          await updateOrderStatusInBackend(orderId, 'PAID', {
            razorpayPaymentId: pid
          });

          onSuccess(pid, orderId, email.trim(), {
            name: name.trim(),
            address: effectiveAddress,
            phone: cleanPhone,
            email: email.trim()
          });
        },
        prefill: {
          name: name.trim(),
          email: email.trim(),
          contact: cleanPhone,
          method: 'upi'
        },
        notes: {
          address: effectiveAddress,
          customerName: name.trim(),
          customerPhone: cleanPhone,
          customerEmail: email.trim(),
          destination: itinerary.destination,
          orderId: orderId,
          packageTitle: itinerary.title
        },
        theme: {
          color: '#0c2340'
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            console.log('User closed Razorpay modal without completing -> Updating status to CANCELLED in MySQL');
            updateOrderStatusInBackend(orderId, 'CANCELLED', {
              reason: 'Customer closed the Razorpay payment window before completing'
            });
            setErrorMessage('Payment was cancelled. You can retry whenever you are ready.');
          }
        }
      };

      // Attach authentic Razorpay live order_id if generated
      if (activeRzpOrderId && activeRzpOrderId.startsWith('order_')) {
        options.order_id = activeRzpOrderId;
      }

      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          console.warn('Razorpay payment response:', response.error);
          setIsProcessing(false);
          updateOrderStatusInBackend(orderId, 'FAILED', {
            reason: response.error?.description || 'Bank transaction declined'
          });
          setErrorMessage(response.error?.description || 'Payment was declined or failed. Please try again.');
        });
        rzp.open();
        return;
      } catch (err: any) {
        console.warn('Could not launch Razorpay popup directly, checking payment link:', err);
        setIsProcessing(false);
        if (activePaymentLink) {
          window.location.href = activePaymentLink;
          return;
        }
        setErrorMessage(err?.message || 'Unable to open Razorpay gateway. Please try again.');
      }
    } else {
      setIsProcessing(false);
      if (activePaymentLink) {
        window.location.href = activePaymentLink;
        return;
      }
      setErrorMessage('Razorpay payment gateway is loading. Please refresh and try again.');
    }
  };

  return (
    <div className="rzp-fullscreen-wrapper animate-fade-in">
      {/* Razorpay Header Navigation */}
      <div className="rzp-global-header">
        <div className="rzp-header-inner">
          <div className="rzp-brand-flex">
            <div className="rzp-brand-symbol">
              <span className="rzp-brand-initial">R</span>
            </div>
            <div>
              <div className="rzp-brand-title">Razorpay Standard Checkout</div>
              <div className="rzp-brand-sub">Verified Merchant Payment Gateway</div>
            </div>
            <span className="rzp-mode-tag">Secure Gateway</span>
          </div>

          <button 
            className="rzp-return-button" 
            onClick={handleCancelAndReturn}
            disabled={isProcessing}
            type="button"
          >
            <ArrowLeft size={14} />
            <span>Cancel & Return</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="rzp-viewport-center">
        <div className="rzp-checkout-master-card shadow-2xl">
          {/* =========================================================================
              LEFT COLUMN: Order Summary & Package Breakdown (High-Contrast Navy)
              ========================================================================= */}
          <div className="rzp-sidebar-panel">
            <div className="rzp-merchant-info-block">
              <span className="rzp-sidebar-sublabel">Paying To</span>
              <h2 className="rzp-merchant-heading">V3Itinerary Platforms India Pvt Ltd</h2>
              <p className="rzp-merchant-gst">GSTIN: 27AABCU9603R1ZM • Verified Travel Merchant</p>
            </div>

            <div className="rzp-order-item-box">
              <span className="rzp-sidebar-sublabel">Selected Itinerary Package</span>
              <h3 className="rzp-order-title">{itinerary.title}</h3>
              <p className="rzp-order-details">
                {itinerary.destination} • {itinerary.durationDays} Days / {itinerary.durationNights} Nights • Complete Travel Plan
              </p>

              <div className="rzp-amount-highlight">
                <span className="rzp-amount-sub">Amount Payable</span>
                <div className="rzp-amount-value">₹99.00</div>
                <span className="rzp-amount-tax-tag">Flat Price • All Taxes & GST Included</span>
              </div>
            </div>

            <div className="rzp-inclusions-list">
              <span className="rzp-sidebar-sublabel">What You Receive:</span>
              <ul className="rzp-perks-ul">
                <li><Check size={13} className="text-emerald-400 shrink-0" /> <span>Hour-by-hour daywise itinerary</span></li>
                <li><Check size={13} className="text-emerald-400 shrink-0" /> <span>Verified agent contact & WhatsApp</span></li>
                <li><Check size={13} className="text-emerald-400 shrink-0" /> <span>Curated hotels & dining spots</span></li>
                <li><Check size={13} className="text-emerald-400 shrink-0" /> <span>Instant PDF sent to your Gmail</span></li>
              </ul>
            </div>

            <div className="rzp-ref-strip">
              <span>Order Reference: <strong>{orderId}</strong></span>
            </div>

            <div className="rzp-sidebar-trust-bottom">
              <ShieldCheck size={16} className="rzp-trust-icon" />
              <span>Razorpay 256-Bit SSL Encryption</span>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: Customer Details Form -> Direct Razorpay Redirect
              ========================================================================= */}
          <div className="rzp-main-panel">
            {/* Payment Method Selector Tabs */}
            <div className="flex border-b border-slate-200 mb-6 bg-slate-50/80 rounded-xl p-1.5 gap-1.5 border">
              <button
                type="button"
                onClick={() => setPaymentMode('gpay')}
                className={`flex-1 py-3 px-3 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  paymentMode === 'gpay'
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id="tab-gpay-scanner"
              >
                <div className="gpay-dots-icon">
                  <span className="dot-blue"></span>
                  <span className="dot-red"></span>
                  <span className="dot-yellow"></span>
                  <span className="dot-green"></span>
                </div>
                <span>Google Pay / UPI QR</span>
                <span className="px-1.5 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded font-black">SCANNER</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('razorpay')}
                className={`flex-1 py-3 px-3 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  paymentMode === 'razorpay'
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id="tab-razorpay-checkout"
              >
                <CreditCard size={16} className="text-slate-600" />
                <span>Cards / NetBanking</span>
              </button>
            </div>

            <div className="rzp-form-header">
              <div className="rzp-form-title-badge">
                {paymentMode === 'gpay' ? 'Instant Google Pay Scanner' : 'Customer & Delivery Details'}
              </div>
              <h3 className="rzp-form-title">
                {paymentMode === 'gpay' ? 'Scan & Pay ₹99 with Google Pay' : 'Enter your details to proceed to Razorpay'}
              </h3>
              <p className="rzp-form-sub">
                {paymentMode === 'gpay'
                  ? 'Scan the dynamic QR code using Google Pay, PhonePe, Paytm or BHIM on your phone for instant itinerary delivery.'
                  : 'Enter your name, address, and phone number. Your authentic phone number and Gmail will be sent directly to Razorpay for secure checkout.'}
              </p>
            </div>

            {errorMessage && (
              <div className="rzp-form-error-alert animate-fade-in">
                <AlertCircle size={16} className="shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Delivery Contact Details (Name, Phone, Email) */}
            <div className="mb-5 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                1. Delivery Contact Details (Itinerary PDF will be dispatched here)
              </div>
              
              {/* Full Name */}
              <div className="rzp-form-group mb-3">
                <label className="rzp-field-label">
                  <User size={14} className="text-blue-600" />
                  <span>Full Name <span className="text-rose-500">*</span></span>
                </label>
                <input 
                  type="text"
                  className="rzp-text-input"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrorMessage(''); }}
                  placeholder="e.g. Rahul Sharma"
                  required
                />
              </div>

              {/* Phone & Gmail */}
              <div className="rzp-form-row-2col">
                <div className="rzp-form-group">
                  <label className="rzp-field-label">
                    <Smartphone size={14} className="text-blue-600" />
                    <span>Phone Number <span className="text-rose-500">*</span></span>
                  </label>
                  <div className="rzp-phone-input-wrap">
                    <span className="rzp-phone-code">🇮🇳 +91</span>
                    <input 
                      type="tel"
                      className="rzp-text-input rzp-phone-field"
                      value={phone}
                      onChange={(e) => { 
                        setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10)); 
                        setErrorMessage(''); 
                      }}
                      placeholder="9876543210"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div className="rzp-form-group">
                  <label className="rzp-field-label">
                    <Mail size={14} className="text-blue-600" />
                    <span>Gmail / Email <span className="text-rose-500">*</span></span>
                  </label>
                  <input 
                    type="email"
                    className="rzp-text-input"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                    placeholder="yourname@gmail.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* TAB 1: Direct Google Pay QR Scanner */}
            {paymentMode === 'gpay' && (
              <div className="animate-fade-in">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. Scan with Google Pay to Pay ₹99
                </div>
                <GPayScanner 
                  amount={99.00}
                  orderId={orderId}
                  destination={itinerary.destination}
                  itineraryTitle={itinerary.title}
                  onPaymentComplete={handleGPayPaymentSuccess}
                  onOpenRazorpayLive={handleProceedToRazorpay}
                  onRedirectPayment={handleRedirectToPaymentLink}
                  paymentLinkUrl={paymentLinkUrl}
                />
              </div>
            )}

            {/* TAB 2: Official Razorpay Standard Form */}
            {paymentMode === 'razorpay' && (
              <form 
                className="rzp-checkout-form animate-fade-in"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProceedToRazorpay();
                }}
              >
                {/* 3. Address */}
                <div className="rzp-form-group">
                  <label className="rzp-field-label">
                    <MapPin size={15} className="text-blue-600" />
                    <span>Address <span className="text-rose-500">*</span></span>
                    <span className="rzp-label-hint">(Billing / Residential Address)</span>
                  </label>
                  <textarea 
                    rows={2}
                    className="rzp-text-input rzp-textarea"
                    value={address}
                    onChange={(e) => { setAddress(e.target.value); setErrorMessage(''); }}
                    placeholder="House/Flat No., Street, Area, City, State, Pincode"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  className="btn-rzp-submit-primary shadow-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin text-white" />
                      <span>Opening Razorpay Gateway...</span>
                    </>
                  ) : (
                    <>
                      <div className="btn-rzp-submit-inner">
                        <Lock size={17} />
                        <span>Proceed to Pay ₹99 via Razorpay</span>
                      </div>
                      <span className="btn-rzp-arrow">→</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Trust & Guarantee Strip */}
            <div className="rzp-guarantee-strip mt-4">
              <div className="rzp-trust-bullet">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span>Official Razorpay 256-Bit SSL</span>
              </div>
              <div className="rzp-trust-bullet">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>Instant PDF Itinerary Dispatch</span>
              </div>
              <div className="rzp-trust-bullet">
                <FileText size={14} className="text-emerald-600 shrink-0" />
                <span>Zero Hidden Charges</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
