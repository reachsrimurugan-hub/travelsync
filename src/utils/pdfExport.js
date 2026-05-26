import { jsPDF } from 'jspdf';
import { formatCurrency, formatDate } from './helpers';
import { calcBudgetTotal } from './tripMapper';

export const exportTripToPDF = (trip) => {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  const name = trip?.tripName || trip?.title || 'My Trip';
  const breakdown = trip?.budgetBreakdown || trip?.budget || {};
  const total = trip?.budgetTotal ?? calcBudgetTotal(breakdown);
  const days = trip?.days || trip?.itinerary || [];

  doc.setFontSize(22);
  doc.setTextColor(255, 107, 53);
  doc.text('TravelSync TripNest', margin, y);
  y += 12;

  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text(name, margin, y);
  y += 10;

  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(`Destination: ${trip?.destination || 'N/A'}`, margin, y);
  y += 7;
  doc.text(`Dates: ${formatDate(trip?.startDate)} - ${formatDate(trip?.endDate)}`, margin, y);
  y += 7;
  doc.text(`Travelers: ${trip?.travelers || 1} | Transport: ${trip?.transportMode || 'N/A'}`, margin, y);
  y += 12;

  doc.setFontSize(14);
  doc.setTextColor(255, 107, 53);
  doc.text(`Total Budget: ${formatCurrency(total)}`, margin, y);
  y += 8;
  doc.setFontSize(10);
  Object.entries(breakdown).forEach(([key, val]) => {
    if (typeof val === 'number') {
      doc.text(`${key}: ${formatCurrency(val)}`, margin, y);
      y += 6;
    }
  });
  y += 6;

  if (days.length) {
    doc.setFontSize(14);
    doc.setTextColor(255, 107, 53);
    doc.text('Itinerary', margin, y);
    y += 8;
    days.forEach((day) => {
      if (y > 270) {
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      doc.text(`Day ${day.day}${day.date ? ` (${day.date})` : ''}: ${day.title || ''}`, margin, y);
      y += 6;
      (day.activities || []).forEach((act) => {
        const title = act.title || act.name || act;
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`  • ${act.time || ''} ${title}${act.location ? ` @ ${act.location}` : ''}`, margin + 4, y);
        y += 5;
      });
      y += 4;
    });
  }

  if (trip?.notes) {
    y += 6;
    doc.setFontSize(12);
    doc.text('Notes', margin, y);
    y += 6;
    doc.setFontSize(9);
    doc.text(doc.splitTextToSize(trip.notes, 170), margin, y);
  }

  doc.save(`${name.replace(/\s+/g, '-').toLowerCase()}-itinerary.pdf`);
};
