import { jsPDF } from 'jspdf';
import type { SignTypeState, DesignTokens, PackageMetadata } from '../types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PAGE_W = 612; // letter width in points (8.5")
const PAGE_H = 792; // letter height
const MARGIN = 40;
const CONTENT_W = PAGE_W - 2 * MARGIN;

const EGX_NAVY = '#1a3c5e';
const EGX_GOLD = '#c9a84c';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function addHeader(doc: jsPDF, title: string, pageNum: number) {
  // Top accent line
  doc.setDrawColor(EGX_GOLD);
  doc.setLineWidth(2);
  doc.line(MARGIN, 30, PAGE_W - MARGIN, 30);

  // EGX branding
  doc.setFontSize(18);
  doc.setTextColor(EGX_NAVY);
  doc.setFont('helvetica', 'bold');
  doc.text('EGX', MARGIN, 24);

  doc.setFontSize(10);
  doc.setTextColor('#6b7280');
  doc.setFont('helvetica', 'normal');
  doc.text('Sign Designer', MARGIN + 32, 24);

  // Page title
  doc.setFontSize(14);
  doc.setTextColor(EGX_NAVY);
  doc.setFont('helvetica', 'bold');
  doc.text(title, MARGIN, 50);

  // Page number
  doc.setFontSize(8);
  doc.setTextColor('#9ca3af');
  doc.setFont('helvetica', 'normal');
  doc.text(`Page ${pageNum}`, PAGE_W - MARGIN, 24, { align: 'right' });
}

function addFooter(doc: jsPDF, metadata: PackageMetadata) {
  const y = PAGE_H - 20;
  doc.setFontSize(7);
  doc.setTextColor('#9ca3af');
  doc.setFont('helvetica', 'normal');

  const left = metadata.projectName
    ? `${metadata.projectName} — ${metadata.customerName || 'Draft'}`
    : 'EGX Sign Designer — Draft Package';
  doc.text(left, MARGIN, y);

  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.text(date, PAGE_W - MARGIN, y, { align: 'right' });

  // Bottom accent line
  doc.setDrawColor(EGX_GOLD);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y - 8, PAGE_W - MARGIN, y - 8);
}

// ---------------------------------------------------------------------------
// Page builders
// ---------------------------------------------------------------------------

function addOverviewPage(
  doc: jsPDF,
  signTypes: SignTypeState[],
  signImages: Map<string, string>,
  metadata: PackageMetadata,
) {
  addHeader(doc, 'Package Overview', 1);
  addFooter(doc, metadata);

  const activeTypes = signTypes.filter((st) => st.quantity > 0);
  if (activeTypes.length === 0) {
    doc.setFontSize(11);
    doc.setTextColor('#6b7280');
    doc.text('No sign types have quantities set.', MARGIN, 80);
    return;
  }

  // Grid layout: 3 columns
  const cols = 3;
  const cellW = CONTENT_W / cols;
  const cellH = 200;
  let x = MARGIN;
  let y = 65;

  activeTypes.forEach((st, idx) => {
    if (idx > 0 && idx % cols === 0) {
      x = MARGIN;
      y += cellH;
      if (y + cellH > PAGE_H - 40) {
        doc.addPage();
        addHeader(doc, 'Package Overview (cont.)', Math.ceil((idx + 1) / 9) + 1);
        addFooter(doc, metadata);
        y = 65;
      }
    }

    // Cell background
    doc.setFillColor('#f8f9fa');
    doc.roundedRect(x + 4, y, cellW - 8, cellH - 10, 4, 4, 'F');

    // Sign image
    const imgData = signImages.get(st.id);
    if (imgData) {
      const imgMaxW = cellW - 24;
      const imgMaxH = cellH - 70;
      // Maintain aspect ratio
      const pxPerInch = 25;
      const svgW = st.size.w * pxPerInch + 20;
      const svgH = st.size.h * pxPerInch + 34;
      const scale = Math.min(imgMaxW / svgW, imgMaxH / svgH);
      const drawW = svgW * scale;
      const drawH = svgH * scale;
      const imgX = x + (cellW - drawW) / 2;
      const imgY = y + 8;
      try {
        doc.addImage(imgData, 'PNG', imgX, imgY, drawW, drawH);
      } catch {
        // Skip if image failed
      }
    }

    // Label
    doc.setFontSize(9);
    doc.setTextColor(EGX_NAVY);
    doc.setFont('helvetica', 'bold');
    doc.text(st.typeName, x + cellW / 2, y + cellH - 40, { align: 'center' });

    doc.setFontSize(7);
    doc.setTextColor('#6b7280');
    doc.setFont('helvetica', 'normal');
    doc.text(
      `${st.typeCode} · ${st.size.w}″×${st.size.h}″ · Qty: ${st.quantity}`,
      x + cellW / 2,
      y + cellH - 28,
      { align: 'center' },
    );

    x += cellW;
  });
}

function addDetailPage(
  doc: jsPDF,
  st: SignTypeState,
  tokens: DesignTokens,
  signImage: string | undefined,
  pageNum: number,
  metadata: PackageMetadata,
) {
  doc.addPage();
  addHeader(doc, `${st.typeName} (${st.typeCode})`, pageNum);
  addFooter(doc, metadata);

  // Sign image - large, centered
  if (signImage) {
    const pxPerInch = 25;
    const svgW = st.size.w * pxPerInch + 20;
    const svgH = st.size.h * pxPerInch + 34;
    const maxW = CONTENT_W * 0.7;
    const maxH = 350;
    const scale = Math.min(maxW / svgW, maxH / svgH);
    const drawW = svgW * scale;
    const drawH = svgH * scale;
    const imgX = MARGIN + (CONTENT_W - drawW) / 2;
    try {
      doc.addImage(signImage, 'PNG', imgX, 65, drawW, drawH);
    } catch { /* skip */ }
  }

  // Spec table below image
  let specY = 440;

  doc.setFontSize(10);
  doc.setTextColor(EGX_NAVY);
  doc.setFont('helvetica', 'bold');
  doc.text('Specifications', MARGIN, specY);
  specY += 16;

  const specs: [string, string][] = [
    ['Type', st.typeName],
    ['Code', st.typeCode],
    ['Dimensions', `${st.size.w}″ W × ${st.size.h}″ H`],
    ['Quantity', String(st.quantity)],
    ['Production', tokens.productionMethod.replace(/_/g, ' ')],
    ['Construction', tokens.constructionType.replace(/_/g, ' ')],
    ['Surface', tokens.surfaceTreatment.replace(/_/g, ' ')],
    ['Face Material', tokens.faceMaterial.replace(/_/g, ' ')],
    ['Font', tokens.fontFamily],
    ['Corner Radius', `${tokens.cornerRadius}px`],
  ];

  specs.forEach(([label, value]) => {
    doc.setFontSize(8);
    doc.setTextColor('#6b7280');
    doc.setFont('helvetica', 'normal');
    doc.text(label, MARGIN, specY);

    doc.setTextColor(EGX_NAVY);
    doc.setFont('helvetica', 'bold');
    doc.text(value, MARGIN + 120, specY);

    specY += 14;
  });

  // Color swatches
  specY += 10;
  doc.setFontSize(10);
  doc.setTextColor(EGX_NAVY);
  doc.setFont('helvetica', 'bold');
  doc.text('Colors', MARGIN, specY);
  specY += 14;

  const colors: [string, string][] = [
    ['Face', tokens.faceColor],
    ['Raised Text', tokens.raisedTextColor],
    ['Accent', tokens.accentColor],
    ['Insert BG', tokens.insertBgColor],
    ['Insert Text', tokens.insertTextColor],
  ];

  colors.forEach(([label, hex]) => {
    // Color swatch
    doc.setFillColor(hex);
    doc.roundedRect(MARGIN, specY - 6, 10, 10, 1, 1, 'F');
    doc.setDrawColor('#d1d5db');
    doc.roundedRect(MARGIN, specY - 6, 10, 10, 1, 1, 'S');

    doc.setFontSize(8);
    doc.setTextColor('#6b7280');
    doc.setFont('helvetica', 'normal');
    doc.text(label, MARGIN + 16, specY + 1);

    doc.setTextColor(EGX_NAVY);
    doc.text(hex.toUpperCase(), MARGIN + 120, specY + 1);

    specY += 16;
  });
}

function addSchedulePage(
  doc: jsPDF,
  signTypes: SignTypeState[],
  tokens: DesignTokens,
  pageNum: number,
  metadata: PackageMetadata,
) {
  doc.addPage();
  addHeader(doc, 'Sign Schedule', pageNum);
  addFooter(doc, metadata);

  const activeTypes = signTypes.filter((st) => st.quantity > 0);

  // Table header
  let y = 70;
  const colWidths = [40, 100, 50, 40, 80, 80, 60];
  const headers = ['Code', 'Type', 'Size', 'Qty', 'Material', 'Construction', 'Production'];

  doc.setFillColor(EGX_NAVY);
  doc.rect(MARGIN, y - 10, CONTENT_W, 16, 'F');

  doc.setFontSize(7);
  doc.setTextColor('#ffffff');
  doc.setFont('helvetica', 'bold');

  let colX = MARGIN + 6;
  headers.forEach((h, i) => {
    doc.text(h, colX, y);
    colX += colWidths[i];
  });

  y += 14;

  // Table rows
  activeTypes.forEach((st, idx) => {
    if (y > PAGE_H - 60) {
      doc.addPage();
      addHeader(doc, 'Sign Schedule (cont.)', pageNum + 1);
      addFooter(doc, metadata);
      y = 70;
    }

    // Alternating row bg
    if (idx % 2 === 0) {
      doc.setFillColor('#f9fafb');
      doc.rect(MARGIN, y - 8, CONTENT_W, 14, 'F');
    }

    doc.setFontSize(7);
    doc.setTextColor('#374151');
    doc.setFont('helvetica', 'normal');

    colX = MARGIN + 6;
    const row = [
      st.typeCode,
      st.typeName,
      `${st.size.w}″×${st.size.h}″`,
      String(st.quantity),
      tokens.faceMaterial.replace(/_/g, ' '),
      tokens.constructionType.replace(/_/g, ' '),
      tokens.productionMethod.replace(/_/g, ' '),
    ];

    row.forEach((cell, i) => {
      doc.text(cell, colX, y);
      colX += colWidths[i];
    });

    y += 14;
  });

  // Summary
  y += 10;
  doc.setDrawColor(EGX_GOLD);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 16;

  const totalQty = activeTypes.reduce((sum, st) => sum + st.quantity, 0);
  doc.setFontSize(9);
  doc.setTextColor(EGX_NAVY);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Sign Types: ${activeTypes.length}`, MARGIN, y);
  doc.text(`Total Quantity: ${totalQty}`, MARGIN + 200, y);
}

// ---------------------------------------------------------------------------
// Main export function
// ---------------------------------------------------------------------------

export interface PdfExportOptions {
  signTypes: SignTypeState[];
  designTokens: DesignTokens;
  metadata: PackageMetadata;
  familyName: string;
  signImages: Map<string, string>; // signTypeId → PNG data URL
}

export async function exportPackagePdf(options: PdfExportOptions): Promise<void> {
  const { signTypes, designTokens, metadata, familyName: _familyName, signImages } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  // Page 1: Overview
  addOverviewPage(doc, signTypes, signImages, metadata);

  // Detail pages (one per active type)
  const activeTypes = signTypes.filter((st) => st.quantity > 0);
  let pageNum = 2;

  for (const st of activeTypes) {
    addDetailPage(doc, st, designTokens, signImages.get(st.id), pageNum, metadata);
    pageNum++;
  }

  // Final page: Schedule
  addSchedulePage(doc, signTypes, designTokens, pageNum, metadata);

  // Save
  const filename = metadata.projectName
    ? `${metadata.projectName.replace(/[^a-zA-Z0-9]/g, '-')}-sign-package.pdf`
    : `egx-sign-package-${Date.now()}.pdf`;

  doc.save(filename);
}
