import {
  EVENT,
  FINAL_MISSION_TEXT,
  FOOTER_TEXT,
  PLEDGE_PARAGRAPHS,
  budgetAmount,
  formatJmd,
} from '../config.js';

const PINE = [15, 77, 56];
const BERRY = [159, 29, 29];
const GOLD = [184, 137, 47];
const INK = [28, 28, 28];
const MUTED = [90, 90, 90];

// jsPDF's built-in fonts only cover Latin-1, so emoji and other glyphs must be removed.
function clean(text) {
  return String(text ?? '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[^\x20-\x7E\u00A0-\u00FF]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?;:])/g, '$1')
    .trim();
}

function star(doc, cx, cy, r, color) {
  const points = [];
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? r : r * 0.45;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
  }
  const segments = points.slice(1).map((p, i) => [p[0] - points[i][0], p[1] - points[i][1]]);
  doc.setFillColor(...color);
  doc.lines(segments, points[0][0], points[0][1], [1, 1], 'F', true);
}

function holly(doc, x, y) {
  doc.setFillColor(...PINE);
  doc.ellipse(x - 3.4, y, 3.4, 1.5, 'F');
  doc.ellipse(x + 3.4, y, 3.4, 1.5, 'F');
  doc.setFillColor(...BERRY);
  doc.circle(x, y - 1, 1.2, 'F');
  doc.circle(x - 1.1, y + 0.8, 1.2, 'F');
  doc.circle(x + 1.1, y + 0.8, 1.2, 'F');
}

function target(doc, cx, cy) {
  doc.setDrawColor(...BERRY);
  doc.setLineWidth(0.5);
  doc.circle(cx, cy, 2.6, 'S');
  doc.circle(cx, cy, 1.5, 'S');
  doc.setFillColor(...BERRY);
  doc.circle(cx, cy, 0.5, 'F');
}

export async function downloadAgreementPdf(answers) {
  const { jsPDF } = await import('jspdf');
  const doc = buildAgreementPdf(jsPDF, answers);
  doc.save('Not-So-Secret-Santa-Agreement.pdf');
}

export function buildAgreementPdf(jsPDF, answers) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210;
  const H = 297;
  const left = 24;
  const right = W - 24;
  const contentW = right - left;

  doc.setDrawColor(...PINE);
  doc.setLineWidth(1);
  doc.rect(6, 6, W - 12, H - 12);
  doc.setLineWidth(0.3);
  doc.rect(8, 8, W - 16, H - 16);
  doc.setDrawColor(...BERRY);
  doc.setLineWidth(0.4);
  doc.setLineDashPattern([2, 1.5], 0);
  doc.rect(11, 11, W - 22, H - 22);
  doc.setLineDashPattern([], 0);
  [
    [14, 14],
    [W - 14, 14],
    [14, H - 14],
    [W - 14, H - 14],
  ].forEach(([x, y]) => holly(doc, x, y));

  // ----- Header -----
  let y = 24;
  star(doc, W / 2 - 7, y, 1.6, GOLD);
  star(doc, W / 2, y, 2.2, BERRY);
  star(doc, W / 2 + 7, y, 1.6, GOLD);

  y += 13;
  doc.setFont('times', 'bold');
  doc.setFontSize(30);
  doc.setTextColor(...PINE);
  doc.text('NOT SO SECRET SANTA', W / 2, y, { align: 'center' });

  y += 8;
  doc.setFont('times', 'italic');
  doc.setFontSize(15);
  doc.setTextColor(...BERRY);
  doc.text(`Official Christmas Agreement ${EVENT.year}`, W / 2, y, { align: 'center' });

  y += 6;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.line(W / 2 - 45, y, W / 2 - 4, y);
  doc.line(W / 2 + 4, y, W / 2 + 45, y);
  star(doc, W / 2, y, 1.8, GOLD);
  const rowsTop = y + 6;

  // ----- Bottom-anchored blocks: footer, final mission, signature -----
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.text(FOOTER_TEXT, W / 2, H - 15.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  const missionLines = doc.splitTextToSize(clean(FINAL_MISSION_TEXT), contentW - 16);
  const missionLineH = 4.8;
  const missionH = 13 + missionLines.length * missionLineH + 2;
  const missionTop = H - 22 - missionH;

  doc.setDrawColor(...BERRY);
  doc.setLineWidth(0.9);
  doc.roundedRect(left, missionTop, contentW, missionH, 3, 3, 'S');
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([1.5, 1], 0);
  doc.roundedRect(left - 1.8, missionTop - 1.8, contentW + 3.6, missionH + 3.6, 4, 4, 'S');
  doc.setLineDashPattern([], 0);

  doc.setFontSize(14);
  doc.setTextColor(...BERRY);
  const heading = 'YOUR FINAL MISSION';
  doc.text(heading, W / 2 - 3.5, missionTop + 8.5, { align: 'center' });
  target(doc, W / 2 - 3.5 + doc.getTextWidth(heading) / 2 + 5, missionTop + 7.2);

  doc.setFontSize(10.5);
  doc.setTextColor(...INK);
  doc.text(missionLines, W / 2, missionTop + 15, { align: 'center', lineHeightFactor: 1.3 });

  const sigY = missionTop - 18;
  const sigEnd = left + contentW * 0.58;
  const dateStart = sigEnd + 12;
  doc.setDrawColor(...INK);
  doc.setLineWidth(0.4);
  doc.line(left, sigY, sigEnd, sigY);
  doc.line(dateStart, sigY, right, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...PINE);
  doc.text('SIGNATURE', left, sigY + 4.5);
  doc.text('DATE', dateStart, sigY + 4.5);

  // ----- Pledge box (measured first so the detail rows can fit around it) -----
  doc.setFont('times', 'normal');
  doc.setFontSize(10.5);
  const pledgeW = contentW - 14;
  const pledgeLineH = 4.7;
  const pledgeBlocks = [
    doc.splitTextToSize(`I, ______________________________, ${clean(PLEDGE_PARAGRAPHS[0])}`, pledgeW),
    doc.splitTextToSize(clean(PLEDGE_PARAGRAPHS[1]), pledgeW),
    doc.splitTextToSize(clean(PLEDGE_PARAGRAPHS[2]), pledgeW),
  ];
  const pledgeH = 15 + pledgeBlocks.reduce((h, b) => h + b.length * pledgeLineH, 0) + 2 * 2 + 1;
  const pledgeBottomLimit = sigY - 16;

  // ----- Detail rows, shrinking the font until everything fits -----
  const budget = budgetAmount(answers);
  const rows = [
    ['Event Period', EVENT.period],
    ['Gift Budget', budget ? formatJmd(budget) : '-'],
    ['Gifts', '1'],
    ['Notes / Cards', `${answers.cards} (at least 1 handwritten note)`],
  ];

  const labelW = 54;
  const valueX = left + labelW + 8;
  const valueW = right - valueX;
  const labelLineH = 3.5;

  const measure = (fontSize) => {
    const lineH = fontSize * 0.43;
    const laidOut = rows.map(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      const labelLines = doc.splitTextToSize(label.toUpperCase(), labelW);
      doc.setFontSize(fontSize);
      const valueLines = doc.splitTextToSize(clean(value) || '-', valueW);
      const height = Math.max(valueLines.length * lineH, labelLines.length * labelLineH) + 3;
      return { labelLines, valueLines, height };
    });
    const total = laidOut.reduce((h, r) => h + r.height + 2, 0);
    return { fontSize, lineH, laidOut, total };
  };

  const available = pledgeBottomLimit - pledgeH - 5 - rowsTop;
  let layout = measure(11);
  for (const size of [10.5, 10, 9.5, 9, 8.5]) {
    if (layout.total <= available) break;
    layout = measure(size);
  }

  const spare = Math.max(0, available - layout.total);
  const rowPad = Math.min(4, (spare * 0.6) / rows.length);

  y = rowsTop;
  layout.laidOut.forEach(({ labelLines, valueLines, height }) => {
    const textY = y + 4 + rowPad / 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...PINE);
    doc.text(labelLines, left, textY, { lineHeightFactor: labelLineH / (8 * 0.3528) });

    doc.setFontSize(layout.fontSize);
    doc.setTextColor(...INK);
    doc.text(valueLines, valueX, textY, { lineHeightFactor: layout.lineH / (layout.fontSize * 0.3528) });

    y += height + rowPad;
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.25);
    doc.setLineDashPattern([0.5, 0.8], 0);
    doc.line(left, y, right, y);
    doc.setLineDashPattern([], 0);
    y += 2;
  });

  const pledgeTop = y + 5 + (spare - rowPad * rows.length) / 2;

  doc.setDrawColor(...PINE);
  doc.setLineWidth(0.5);
  doc.roundedRect(left, pledgeTop, contentW, pledgeH, 3, 3, 'S');

  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...PINE);
  doc.text('The Secret Santa Pledge', W / 2, pledgeTop + 8.5, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...INK);
  const pledgeLineFactor = pledgeLineH / (10.5 * 0.3528);
  let py = pledgeTop + 15;
  pledgeBlocks.forEach((block) => {
    doc.text(block, left + 7, py, { lineHeightFactor: pledgeLineFactor });
    py += block.length * pledgeLineH + 2;
  });

  return doc;
}
