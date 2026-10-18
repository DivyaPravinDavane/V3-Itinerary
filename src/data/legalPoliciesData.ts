export type PolicyTabKey = 'privacy' | 'terms' | 'refund' | 'gst';

export interface PolicySection {
  id: string;
  title: string;
  badge?: string;
  paragraphs: string[];
  bulletPoints?: string[];
  callout?: {
    type: 'info' | 'warning' | 'success';
    text: string;
  };
}

export interface PolicyDocument {
  key: PolicyTabKey;
  title: string;
  shortTitle: string;
  tagline: string;
  effectiveDate: string;
  lastUpdated: string;
  badge: string;
  sections: PolicySection[];
}

export const LEGAL_POLICIES: Record<PolicyTabKey, PolicyDocument> = {
  privacy: {
    key: 'privacy',
    title: 'Privacy Policy',
    shortTitle: 'Privacy Policy',
    tagline: 'Your privacy and data security are fundamental to how we build V3 Itinerary.',
    effectiveDate: 'January 1, 2026',
    lastUpdated: 'October 18, 2026',
    badge: 'DPDP Act 2023 Compliant',
    sections: [
      {
        id: 'overview',
        title: '1. Introduction & Scope',
        paragraphs: [
          'V3Itinerary Platforms India Pvt Ltd ("V3Itinerary", "we", "our", or "us") operates the website https://v3itinerary.com. We are committed to safeguarding the privacy and personal data of our users, travelers, and registered travel planners.',
          'This Privacy Policy outlines how we collect, store, process, and protect your information when you browse our catalog, purchase a verified travel itinerary, or register as a certified travel agent in accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000 of India.'
        ],
        callout: {
          type: 'info',
          text: 'We never sell, rent, or trade your personal data to third-party marketing companies. Data is exclusively used to fulfill your itinerary access and connect you with certified planners.'
        }
      },
      {
        id: 'data-collected',
        title: '2. Information We Collect',
        paragraphs: [
          'We collect only the minimal data required to provide seamless itinerary access and verified travel connections:'
        ],
        bulletPoints: [
          'Personal Identifiers: Full name, email address, and WhatsApp/mobile phone number provided during checkout or account registration.',
          'Travel Preferences: Destination interests, preferred travel style (Solo, Couple, Family, Friends), and budget tier (Backpacker, Comfort, Luxury).',
          'Payment Details: All payments are processed directly via Razorpay Software Private Ltd. V3 Itinerary does NOT store raw credit/debit card numbers, CVVs, or UPI PINs on our servers.',
          'Agent Business Credentials: For travel planners, we collect registered agency name, trade address, and mandatory 15-digit GSTIN (Goods and Services Tax Identification Number) certificates verified by our administrative team.',
          'Device & Technical Logs: IP address, browser type, operating system, and session timestamps used strictly for platform security, fraud prevention, and performance telemetry.'
        ]
      },
      {
        id: 'data-use',
        title: '3. How We Use Your Information',
        paragraphs: [
          'Your information is used strictly for legitimate business operations:'
        ],
        bulletPoints: [
          'Immediate delivery of purchased digital itinerary blueprints to your browser and registered email.',
          'Facilitating direct, secure contact with the certified local travel agent who authored your selected itinerary.',
          'Generating GST-compliant tax invoices and verifiable transaction receipts.',
          'Authenticating verified customer ratings, reviews, and community feedback.',
          'Customer concierge support and 24x7 resolution of order inquiries.'
        ]
      },
      {
        id: 'security-measures',
        title: '4. Data Security & Storage',
        paragraphs: [
          'We implement enterprise-grade technical and organizational safeguards to protect your personal information against unauthorized access, loss, or disclosure:',
          'All communications between your browser and our servers are encrypted using 256-bit TLS/SSL encryption. Databases are secured in encrypted, access-restricted cloud environments with regular automated backups and continuous vulnerability scanning.'
        ],
        callout: {
          type: 'success',
          text: 'Payment transactions are processed under PCI-DSS Level 1 compliance through Razorpay, ensuring bank-grade financial security.'
        }
      },
      {
        id: 'user-rights',
        title: '5. Your Rights Under DPDP Act 2023',
        paragraphs: [
          'As a data principal under Indian law, you hold comprehensive rights over your personal information:'
        ],
        bulletPoints: [
          'Right to Access: You can request a summary of the personal data we hold about you and past orders.',
          'Right to Correction: You can update or rectify inaccurate profile information anytime in your Customer Dashboard.',
          'Right to Erasure: You may request deletion of your account and personal identifiers, subject to statutory tax and financial retention laws.',
          'Right to Grievance Redressal: You have the right to swift resolution of any data-related queries through our Grievance Officer.'
        ]
      },
      {
        id: 'grievance',
        title: '6. Grievance Redressal Officer',
        paragraphs: [
          'In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and DPDP Act 2023, the contact details of our Grievance Officer are:'
        ],
        bulletPoints: [
          'Officer Name: Grievance Officer, V3Itinerary Platforms India Pvt Ltd',
          'Registered Office: Platina Tower, Bandra-Kurla Complex (BKC), Bandra East, Mumbai, Maharashtra 400051, India',
          'Email: grievance@v3itinerary.com / support@v3itinerary.com',
          'Direct Helpline: +91 1800-834-8747 (Mon-Sat, 9:30 AM to 6:30 PM IST)',
          'Response SLA: Acknowledgment within 24 hours; complete resolution within 15 working days.'
        ]
      }
    ]
  },

  terms: {
    key: 'terms',
    title: 'Terms and Conditions',
    shortTitle: 'Terms & Conditions',
    tagline: 'Clear, transparent rules governing your use of the V3 Itinerary marketplace.',
    effectiveDate: 'January 1, 2026',
    lastUpdated: 'October 18, 2026',
    badge: 'Legal Terms of Service',
    sections: [
      {
        id: 'agreement',
        title: '1. Agreement to Terms',
        paragraphs: [
          'Welcome to V3Itinerary.com! These Terms and Conditions constitute a legally binding agreement between you (the "User", "Traveler", or "Partner") and V3Itinerary Platforms India Pvt Ltd ("Company", "we", "us").',
          'By accessing our website, purchasing an itinerary, or registering as an agent, you acknowledge that you have read, understood, and agreed to be bound by these Terms and our Privacy Policy.'
        ]
      },
      {
        id: 'marketplace-nature',
        title: '2. Marketplace Model & ₹99 Pricing Rule',
        paragraphs: [
          'V3 Itinerary operates as a specialized digital marketplace connecting leisure travelers with certified, GST-registered travel planners and local tour creators.',
          'What the ₹99 fee covers: The nominal ₹99 unlocking fee grants you immediate digital access, high-definition viewing, and permanent PDF download of the comprehensive trip plan (day-wise route schedule, sightseeing time allocation, local food recommendations, secret spots, budget breakdowns, and verified agent contact details).',
          'What the ₹99 fee does NOT cover: V3 Itinerary is not a travel agency, airline, or hotel operator. The ₹99 fee unlocks the curated plan. On-ground flight tickets, hotel reservations, transport rentals, and activity tickets are booked separately directly with the respective service providers or via the verified travel agent.'
        ],
        callout: {
          type: 'warning',
          text: 'Non-Deceptive Pricing Guardrail: ₹99 unlocks the comprehensive digital itinerary dossier. All subsequent on-ground bookings are negotiated and finalized directly between traveler and verified agent.'
        }
      },
      {
        id: 'agent-verification',
        title: '3. Mandatory Agent GST Verification',
        paragraphs: [
          'To ensure traveler safety and prevent deceptive travel claims, V3 Itinerary enforces 100% mandatory GSTIN verification for every travel agent publishing itineraries on the platform.',
          'Agents warrant that itineraries uploaded are genuine, practical, based on actual operational experience, and free from misleading itineraries or inflated pricing estimates.'
        ]
      },
      {
        id: 'ip-license',
        title: '4. Intellectual Property & Digital License',
        paragraphs: [
          'Upon successful payment of ₹99, V3 Itinerary grants you a personal, non-exclusive, non-transferable, revocable license to download, store, print, and use the purchased itinerary for private, non-commercial travel planning.',
          'You may NOT resell, redistribute, sub-license, syndicate, publish publicly online, or extract the itinerary data for commercial reuse without explicit written authorization from V3Itinerary Platforms India Pvt Ltd.'
        ]
      },
      {
        id: 'user-conduct',
        title: '5. Acceptable User Conduct',
        paragraphs: [
          'When interacting with our platform and verified travel agents, you agree that you will not:'
        ],
        bulletPoints: [
          'Provide false, misleading, or unauthorized contact information during checkout.',
          'Attempt to disrupt or compromise website security, databases, or API infrastructure.',
          'Harass, spam, or solicit travel planners for unlawful or unauthorized purposes.',
          'Scrape, crawl, or harvest itinerary data through automated scripts or bots.'
        ]
      },
      {
        id: 'liability',
        title: '6. Limitation of Liability',
        paragraphs: [
          'While V3 Itinerary rigorously verifies travel planner credentials and inspects uploaded trip plans, actual travel conditions (weather, flight cancellations, road closures, government advisories) are beyond our control.',
          'In no event shall V3Itinerary Platforms India Pvt Ltd be liable for indirect, incidental, or consequential damages resulting from your travel execution. In any circumstance, our maximum aggregate liability shall be strictly limited to the actual amount paid by you for the specific itinerary (i.e. ₹99.00).'
        ]
      },
      {
        id: 'jurisdiction',
        title: '7. Governing Law & Jurisdiction',
        paragraphs: [
          'These Terms and Conditions shall be governed by and construed in accordance with the substantive laws of India.',
          'Any disputes arising from or connected to these Terms shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra, India.'
        ]
      }
    ]
  },

  refund: {
    key: 'refund',
    title: 'Refund & Cancellation Policy',
    shortTitle: 'Refund Policy',
    tagline: 'Instant digital delivery terms, clear buyer protection, and fair refund guarantees.',
    effectiveDate: 'January 1, 2026',
    lastUpdated: 'October 18, 2026',
    badge: '100% Buyer Protection Guaranteed',
    sections: [
      {
        id: 'digital-nature',
        title: '1. Nature of Digital Products & Instant Access',
        paragraphs: [
          'All itineraries published on V3 Itinerary are digital products provided in electronic format (interactive web viewing + downloadable PDF dossier).',
          'Upon successful completion of payment through Razorpay, access is granted instantaneously on your screen, and an automated backup copy is dispatched immediately to your provided email address.'
        ]
      },
      {
        id: 'general-policy',
        title: '2. General Non-Refundable Rule',
        paragraphs: [
          'Because our itineraries are irrevocable digital assets that can be viewed, saved, and downloaded immediately upon payment, all sales are generally final and non-refundable once digital access has been granted.'
        ],
        callout: {
          type: 'info',
          text: 'Instant digital consumption means that once proprietary route secrets, day-by-day timing, and direct agent contacts are unlocked, standard physical return policies do not apply.'
        }
      },
      {
        id: 'refund-scenarios',
        title: '3. Eligible Refund Scenarios (Buyer Protection Guarantee)',
        paragraphs: [
          'We stand behind our quality promise. You are entitled to a full 100% refund in any of the following circumstances:'
        ],
        bulletPoints: [
          'Duplicate Billing: If a network glitch or duplicate payment submission resulted in multiple charges for the same itinerary.',
          'Technical Delivery Failure: If payment was debited from your bank or card, but the platform failed to unlock the itinerary and our technical team could not provide the file within 24 hours of receiving your support ticket.',
          'Damaged / Inaccessible File: If the downloaded itinerary PDF is corrupted, unreadable, or missing critical sections, and our concierge is unable to provide a functional replacement.',
          'Deactivated Agent Contact: If the verified travel agent contact credentials provided in the unlocked dossier are proven to be inactive or unreachable at the time of purchase.'
        ]
      },
      {
        id: 'how-to-request',
        title: '4. How to Request a Refund',
        paragraphs: [
          'To submit a refund claim under our Buyer Protection Guarantee, please follow these simple steps:'
        ],
        bulletPoints: [
          'Send an email to support@v3itinerary.com within 7 days of purchase.',
          'Include your Order ID (e.g., V3I-20261018-XXXX) and Razorpay Payment Reference ID.',
          'Attach a brief description or screenshot of the technical error or duplicate debit.',
          'Our Customer Concierge team will review your case and respond with a resolution within 24 hours.'
        ]
      },
      {
        id: 'refund-timeline',
        title: '5. Refund Processing Timeline',
        paragraphs: [
          'Once approved, refunds are initiated immediately through the Razorpay gateway back to your original payment method. Depending on your bank or payment provider:',
          'UPI Payments (GPay, PhonePe, Paytm): 1 to 2 business days.',
          'Debit / Credit Cards (Visa, Mastercard, RuPay): 3 to 7 business days.',
          'NetBanking: 3 to 5 business days.'
        ],
        callout: {
          type: 'success',
          text: 'Zero deduction: Approved refunds are processed in full (100% of the ₹99 fee paid) with zero cancellation or processing fee deductions.'
        }
      },
      {
        id: 'ground-cancellations',
        title: '6. Cancellation of On-Ground Travel Bookings',
        paragraphs: [
          'Please note that any on-ground travel services, hotel bookings, flights, or guided tours arranged separately between you and the verified travel agent are governed entirely by the agent\'s and respective hotel/airline cancellation policies. V3 Itinerary is not a party to those bilateral contracts.'
        ]
      }
    ]
  },

  gst: {
    key: 'gst',
    title: 'GST Compliance Guidelines',
    shortTitle: 'GST Compliance',
    tagline: '100% mandatory tax compliance, verified GSTIN certificates, and transparent invoicing.',
    effectiveDate: 'January 1, 2026',
    lastUpdated: 'October 18, 2026',
    badge: '100% Tax Compliant',
    sections: [
      {
        id: 'statutory-framework',
        title: '1. Statutory Framework & SAC Code',
        paragraphs: [
          'V3Itinerary Platforms India Pvt Ltd operates under strict compliance with the Central Goods and Services Tax Act, 2017 (CGST), State Goods and Services Tax Act (SGST), and Integrated Goods and Services Tax Act (IGST).',
          'Digital itinerary publishing and reservation facilitation services provided on the platform are categorized under SAC Code 998553 (Tour operator and travel arrangement booking services).'
        ]
      },
      {
        id: 'agent-verification',
        title: '2. Mandatory Agent GSTIN Verification',
        paragraphs: [
          'To protect travelers from fly-by-night operators and unverified freelancers, V3 Itinerary requires every travel planner to provide a verified 15-digit GSTIN.',
          'Before an agent\'s itinerary is published on our marketplace, our admin compliance desk verifies the GSTIN status against the official government GST portal to confirm active status and legal entity alignment.'
        ]
      },
      {
        id: 'tax-invoices',
        title: '3. Automated Tax Invoices for Consumers',
        paragraphs: [
          'Every customer purchasing an itinerary receives an automated GST-compliant tax invoice containing:',
          '1. Company Legal Name, Registered Office Address, and GSTIN of V3 Itinerary Platforms India Pvt Ltd.',
          '2. Unique Sequential Tax Invoice Number and Date of Issuance.',
          '3. Itemized description with SAC Code 998553 and break-up of CGST, SGST, or IGST.',
          '4. Customer billing details and Razorpay transaction reference.'
        ],
        callout: {
          type: 'success',
          text: 'Invoices can be downloaded anytime from your Customer Dashboard under the "Orders & Invoices" tab.'
        }
      }
    ]
  }
};
