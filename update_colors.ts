import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/#C67A3D/g, '#A0522D');
content = content.replace(/#B56A2D/g, '#8B4513');

fs.writeFileSync('src/App.tsx', content);
