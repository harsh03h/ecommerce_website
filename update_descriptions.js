import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\{\s*(?:"id"|id):\s*["']([^"']+)["'][\s\S]*?(?:"name"|name):\s*["']([^"']+)["'][\s\S]*?(?:"category"|category):\s*["']([^"']+)["'][\s\S]*?(?:"description"|description):\s*["']([^"']+)["'][\s\S]*?(?:"material"|material):\s*["']([^"']+)["'][\s\S]*?(?:"occasion"|occasion):\s*["']([^"']+)["']/g;

content = content.replace(regex, (match, id, name, category, oldDesc, material, occasion) => {
    let newDesc = '';
    
    if (category.toLowerCase() === 'clothing') {
        newDesc = `Elevate your wardrobe with the stunning ${name}. Expertly crafted from premium ${material}, this piece offers unparalleled comfort and durability. Perfectly suited for ${occasion} wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.`;
    } else {
        newDesc = `Discover the breathtaking beauty of the ${name}. Forged with exceptional craftsmanship using high-quality ${material}, this masterpiece exudes luxury and sophistication. Ideal for ${occasion} occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.`;
    }

    return match.replace(
        /(?:"description"|description):\s*["']([^"']+)["']/,
        `"description": "${newDesc}"`
    );
});

fs.writeFileSync('src/App.tsx', content);
console.log("Updated descriptions.");
