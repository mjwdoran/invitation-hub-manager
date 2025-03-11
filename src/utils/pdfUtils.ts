
import jsPDF from 'jspdf';
import { Contact } from '@/lib/types';

// Avery 5160 label specifications (in inches)
// - 3 columns, 10 rows (30 labels per page)
// - Letter size page (8.5 x 11 inches)
const AVERY_5160 = {
  pageWidth: 8.5,
  pageHeight: 11,
  marginTop: 0.5,
  marginRight: 0.3125,
  marginBottom: 0.5,
  marginLeft: 0.3125,
  labelWidth: 2.625,
  labelHeight: 1,
  horizontalGap: 0.125,
  verticalGap: 0,
  columns: 3,
  rows: 10
};

// Convert inches to points (72 points per inch for PDF)
const inchesToPoints = (inches: number) => inches * 72;

export const generateMailingLabelsPDF = (contacts: Contact[]) => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [AVERY_5160.pageWidth, AVERY_5160.pageHeight]
  });

  // Set font
  doc.setFont('helvetica');
  doc.setFontSize(10);

  // Calculate positions
  const startX = AVERY_5160.marginLeft;
  const startY = AVERY_5160.marginTop;

  // Iterate through contacts
  contacts.forEach((contact, index) => {
    // Calculate label position
    const column = index % AVERY_5160.columns;
    const row = Math.floor((index % (AVERY_5160.columns * AVERY_5160.rows)) / AVERY_5160.columns);
    const page = Math.floor(index / (AVERY_5160.columns * AVERY_5160.rows));

    // Add new page if needed
    if (page > 0 && row === 0 && column === 0) {
      doc.addPage();
    }

    // Calculate x and y positions
    const x = startX + (column * (AVERY_5160.labelWidth + AVERY_5160.horizontalGap));
    const y = startY + (row * AVERY_5160.labelHeight);

    // Format the address
    const fullName = `${contact.firstName} ${contact.lastName}`;
    const addressLine1 = contact.streetAddress;
    const addressLine2 = `${contact.city}, ${contact.state} ${contact.postalCode}`;

    // Draw the label
    doc.text(fullName, x + 0.1, y + 0.2);
    doc.text(addressLine1, x + 0.1, y + 0.4);
    doc.text(addressLine2, x + 0.1, y + 0.6);
  });

  // Return the PDF as a data URL
  return doc.output('dataurlstring');
};
