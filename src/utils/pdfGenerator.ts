import jsPDF from 'jspdf';
import type { Itinerary, OrderRecord } from '../types';

function buildItineraryDoc(itinerary: Itinerary, order: OrderRecord, customerName: string): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  // Header Banner
  doc.setFillColor(15, 44, 89); // #0F2C59
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('V3Itinerary.com', margin, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Verified • Value • Variety — Certified Digital Travel Blueprint', margin, 18);

  doc.setFontSize(8);
  doc.text(`Order Ref: ${order.orderId}  |  GSTIN: ${itinerary.agent.gstNumber}`, pageWidth - margin, 12, { align: 'right' });
  doc.text(`Issued to: ${customerName} (${order.date})`, pageWidth - margin, 18, { align: 'right' });

  y = 36;

  // Title & Destination
  doc.setTextColor(15, 44, 89);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(itinerary.title, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7 + 2;

  // Key Highlights Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, y, contentWidth, 20, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');

  const col1 = margin + 6;
  const col2 = margin + 50;
  const col3 = margin + 98;
  const col4 = margin + 142;

  doc.text('Duration:', col1, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 44, 89);
  doc.text(`${itinerary.durationDays} Days / ${itinerary.durationNights} Nights`, col1, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Traveler Style:', col2, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 44, 89);
  doc.text(`${itinerary.travelerType}`, col2, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Est. Ground Budget:', col3, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6);
  doc.text(`₹${itinerary.estimatedTripCost.toLocaleString('en-IN')}`, col3, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Best Travel Season:', col4, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text(itinerary.bestTimeToVisit.split('(')[0].trim(), col4, y + 13);

  y += 26;

  // Verified Agent Section
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(4, 120, 87);
  doc.text('✓ Certified Travel Agent Details (Verified by V3Itinerary Compliance)', margin + 6, y + 7);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text(`Agency: ${itinerary.agent.agencyName}  |  Founder: ${itinerary.agent.founderName}`, margin + 6, y + 13);
  doc.setFont('helvetica', 'bold');
  doc.text(`Direct WhatsApp / Phone: ${itinerary.agent.phone}  |  Email: ${itinerary.agent.email}`, margin + 6, y + 18);

  y += 28;

  // Day-by-Day Schedule
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 44, 89);
  doc.text('Curated Day-by-Day Master Itinerary', margin, y);
  y += 6;

  for (const day of itinerary.days) {
    // Check page break
    if (y > 245) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text(`Day ${day.dayNumber}: ${day.title}`, margin + 3, y + 5);
    y += 10;

    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    doc.setFont('helvetica', 'bold');
    doc.text('Morning:', margin + 4, y);
    doc.setFont('helvetica', 'normal');
    const morningLines = doc.splitTextToSize(day.morning, contentWidth - 28);
    doc.text(morningLines, margin + 22, y);
    y += morningLines.length * 4.2 + 2;

    doc.setFont('helvetica', 'bold');
    doc.text('Afternoon:', margin + 4, y);
    doc.setFont('helvetica', 'normal');
    const afternoonLines = doc.splitTextToSize(day.afternoon, contentWidth - 28);
    doc.text(afternoonLines, margin + 22, y);
    y += afternoonLines.length * 4.2 + 2;

    doc.setFont('helvetica', 'bold');
    doc.text('Evening:', margin + 4, y);
    doc.setFont('helvetica', 'normal');
    const eveningLines = doc.splitTextToSize(day.evening, contentWidth - 28);
    doc.text(eveningLines, margin + 22, y);
    y += eveningLines.length * 4.2 + 4;
  }

  // Check page break for Hotel Recommendations & Inclusions
  if (y > 220) {
    doc.addPage();
    y = 20;
  }

  y += 4;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 44, 89);
  doc.text('Curated Hotel Recommendations by Tier', margin, y);
  y += 6;

  for (const h of itinerary.hotels) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(`• [${h.tier}] ${h.name} (${h.rating} ★)`, margin + 4, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Est: ${h.estPricePerNight}  |  Perks: ${h.perks.join(', ')}`, margin + 8, y + 4.5);
    y += 9;
  }

  y += 4;
  // Disclaimer Guardrail
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text('Non-Deceptive Pricing Guardrail (PRD Rule 11):', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text('₹99 is the nominal digital blueprint fee. On-ground hotel bookings, flights and cabs are customized directly with the verified agent.', margin + 4, y + 10);

  // Footer on all pages
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`V3Itinerary.com  |  Support: 24x7 Helpline +91 1800-V3-TRIP  |  Page ${i} of ${totalPages}`, pageWidth / 2, 290, { align: 'center' });
  }

  return doc;
}

export function generateItineraryPDF(itinerary: Itinerary, order: OrderRecord, customerName: string) {
  const doc = buildItineraryDoc(itinerary, order, customerName);
  doc.save(`V3Itinerary_${itinerary.destination}_${order.orderId}.pdf`);
}

export function createItineraryPDFBlobUrl(itinerary: Itinerary, order: OrderRecord, customerName: string): string {
  const doc = buildItineraryDoc(itinerary, order, customerName);
  const blob = doc.output('blob');
  return URL.createObjectURL(blob);
}

export function getItineraryPDFBase64(itinerary: Itinerary, order: OrderRecord, customerName: string): string {
  const doc = buildItineraryDoc(itinerary, order, customerName);
  const dataUri = doc.output('datauristring');
  return dataUri.split(',')[1] || dataUri;
}
