import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/focus-visible:ring-2 focus-visible:ring-\[#C67A3D\] focus-visible:ring-offset-2 focus:outline-none /g, '');

fs.writeFileSync('src/App.tsx', content);
