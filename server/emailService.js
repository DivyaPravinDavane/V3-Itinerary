import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Creates the active Nodemailer transporter.
 * Uses Gmail SMTP if credentials exist in .env, otherwise creates a test/mock transporter.
 */
async function getTransporter() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailPass && gmailUser.includes('@')) {
    console.log(`📧 [EmailService] Using Authentic Gmail SMTP for: ${gmailUser}`);
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });
  }

  // Fallback: create automated test account or local logging transporter
  console.log('ℹ️ [EmailService] GMAIL_USER / GMAIL_APP_PASSWORD not set in .env. Creating test transport...');
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (e) {
    // Basic fallback stream transporter
    return nodemailer.createTransport({
      jsonTransport: true
    });
  }
}

/**
 * Sends the generated Itinerary PDF directly to the specified Gmail address as an attachment.
 */
export async function sendItineraryPdfEmail({
  toEmail,
  customerName = 'Valued Traveler',
  itineraryTitle,
  destination,
  orderId,
  amountPaid = 99.00,
  pdfBase64,
  agentName = 'V3 Certified Curators',
  agentPhone = '+91 98203 89694',
  agentEmail = 'support@v3itinerary.com'
}) {
  try {
    if (!toEmail) {
      throw new Error('Target recipient email is required');
    }

    const transporter = await getTransporter();
    const senderEmail = process.env.GMAIL_USER || 'itinerary-delivery@v3itinerary.com';
    const cleanFilename = `${(destination || 'Travel').replace(/[^a-zA-Z0-9]/g, '_')}_Itinerary_Blueprint.pdf`;

    // Email HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px 0; }
          .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
          .header-bar { background: #0c2340; padding: 28px 24px; text-align: center; color: #ffffff; }
          .header-title { font-size: 22px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: -0.5px; }
          .header-sub { font-size: 13px; color: #93c5fd; margin: 0; }
          .body-content { padding: 32px 28px; }
          .order-callout { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 20px 0; }
          .order-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; }
          .order-lbl { color: #64748b; font-weight: 600; }
          .order-val { color: #0f172a; font-weight: 700; }
          .attachment-badge { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 14px 18px; margin: 24px 0; }
          .agent-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-top: 20px; font-size: 12.5px; }
          .footer-text { text-align: center; font-size: 11px; color: #94a3b8; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header-bar">
            <h1 class="header-title">V3Itinerary.com</h1>
            <p class="header-sub">Verified • Value • Variety — Certified Digital Travel Blueprint</p>
          </div>

          <div class="body-content">
            <h2 style="font-size: 18px; color: #0f172a; margin-top: 0;">Hello ${customerName},</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
              Thank you for choosing <strong>V3Itinerary.com</strong>! Your digital travel blueprint for <strong>${destination}</strong> is attached to this email as an offline PDF.
            </p>

            <div class="order-callout">
              <div class="order-row">
                <span class="order-lbl">Itinerary Package:</span>
                <span class="order-val">${itineraryTitle || destination}</span>
              </div>
              <div class="order-row">
                <span class="order-lbl">Order Reference:</span>
                <span class="order-val">${orderId}</span>
              </div>
              <div class="order-row">
                <span class="order-lbl">Amount Paid:</span>
                <span class="order-val" style="color: #059669;">₹${Number(amountPaid).toFixed(2)} (All Taxes Included)</span>
              </div>
              <div class="order-row">
                <span class="order-lbl">Status:</span>
                <span class="order-val" style="color: #2563eb;">Payment Verified & Unlocked</span>
              </div>
            </div>

            <div class="attachment-badge">
              <strong style="color: #065f46; font-size: 13.5px;">📎 PDF Attachment Included:</strong>
              <div style="font-size: 12.5px; color: #047857; margin-top: 4px;">
                <strong>${cleanFilename}</strong> is attached to this email. You can download and save it to your phone or laptop for offline use during your trip.
              </div>
            </div>

            <div class="agent-card">
              <strong style="color: #0f172a;">Certified Travel Agent Assistance:</strong>
              <div style="color: #475569; margin-top: 4px;">
                Agency: <strong>${agentName}</strong><br>
                Phone / WhatsApp: <strong>${agentPhone}</strong><br>
                Email: <strong>${agentEmail}</strong>
              </div>
            </div>

            <p style="font-size: 12px; color: #64748b; margin-top: 24px; line-height: 1.5;">
              <strong>Note on Pricing:</strong> The ₹99 nominal fee guarantees complete verified digital access. All hotel bookings, flights, and private transfers are coordinated directly with your certified agent at zero commission.
            </p>
          </div>

          <div class="footer-text">
            © 2026 V3Itinerary Platforms India Pvt Ltd. All rights reserved.<br>
            24x7 Customer Support: support@v3itinerary.com • +91 1800-V3-TRIP
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"V3Itinerary Support" <${senderEmail}>`,
      to: toEmail,
      subject: `✈️ Your Travel Blueprint: ${destination} (${orderId})`,
      text: `Hello ${customerName},\n\nThank you for purchasing the ${destination} Itinerary Blueprint from V3Itinerary.com! Your order ${orderId} has been confirmed. Please find your complete itinerary PDF attached.\n\nSupport: support@v3itinerary.com`,
      html: htmlContent,
      attachments: pdfBase64 ? [
        {
          filename: cleanFilename,
          content: Buffer.from(pdfBase64, 'base64'),
          contentType: 'application/pdf'
        }
      ] : []
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [EmailService] Itinerary PDF successfully dispatched to: ${toEmail} (Message ID: ${info.messageId})`);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`🔗 [EmailService] Test Email Preview URL: ${previewUrl}`);
    }

    return {
      success: true,
      recipient: toEmail,
      messageId: info.messageId,
      previewUrl: previewUrl || null
    };
  } catch (error) {
    console.error('❌ [EmailService] Failed to send email:', error);
    throw error;
  }
}

export default {
  sendItineraryPdfEmail
};
