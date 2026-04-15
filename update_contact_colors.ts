import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Fix Contact Section
content = content.replace(/text-\[\#0B1325\]/g, 'text-brand-ink');
content = content.replace(/text-\[\#0B1325\]\/70/g, 'text-brand-ink/70');
content = content.replace(/text-\[\#0B1325\]\/60/g, 'text-brand-ink/60');
content = content.replace(/text-\[\#0B1325\]\/50/g, 'text-brand-ink/50');
content = content.replace(/text-\[\#0B1325\]\/80/g, 'text-brand-ink/80');
content = content.replace(/bg-white p-8 md:p-10/g, 'bg-brand-surface p-8 md:p-10');

fs.writeFileSync('src/App.tsx', content);
