import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const modalStart = content.indexOf('{/* Product Details & Reviews Modal */}');
const modalEnd = content.indexOf('{/* Toast Notification */}');

if (modalStart === -1 || modalEnd === -1) {
  console.error("Could not find modal boundaries");
  process.exit(1);
}

let modalContent = content.substring(modalStart, modalEnd);

// Replace bg-white with bg-brand-surface or bg-brand-bg
modalContent = modalContent.replace(/bg-white/g, 'bg-brand-surface');
// Fix specific ones that should be bg-brand-bg
modalContent = modalContent.replace(/bg-brand-surface group\/gallery/g, 'bg-brand-bg group/gallery');
modalContent = modalContent.replace(/w-full bg-brand-surface border border-brand-ink\/20/g, 'w-full bg-brand-bg border border-brand-ink/20');

// Also fix text-white to text-brand-bg where appropriate, but wait, text-white on #FF9F00 or #FB641B is fine because those are brand colors that don't change in dark mode.
// Actually, text-white on #388E3C (green) is also fine.

const beforeModal = content.substring(0, modalStart);
const afterModal = content.substring(modalEnd);

fs.writeFileSync('src/App.tsx', beforeModal + modalContent + afterModal);
