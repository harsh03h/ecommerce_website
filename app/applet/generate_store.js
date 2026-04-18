const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src/App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

const depts = {
  'Clothing': ['Women', 'Men', 'Kids'],
  'Jewellery': ['Gold', 'Silver', 'Bridal', 'Rings']
};

let products = [];
let idCounter = 1;

for (const [category, departments] of Object.entries(depts)) {
  for (const dept of departments) {
    for (let i = 1; i <= 10; i++) {
      const isJewellery = category === 'Jewellery';
      const pId = `${isJewellery ? 'j' : 'c'}${idCounter++}`;
      
      let name = `${dept} Item ${i}`;
      if (dept === 'Women') name = `Designer Women's Wear ${i}`;
      if (dept === 'Men') name = `Premium Men's Collection ${i}`;
      if (dept === 'Kids') name = `Kids Stylish Outfit ${i}`;
      if (dept === 'Gold') name = `22k Pure Gold Ornament ${i}`;
      if (dept === 'Silver') name = `Sterling Silver Art ${i}`;
      if (dept === 'Bridal') name = `Bridal Heritage Piece ${i}`;
      if (dept === 'Rings') name = `Diamond & Gem Ring ${i}`;

      let price = Math.floor(Math.random() * 5000) + 500;
      if (isJewellery) price = Math.floor(Math.random() * 50000) + 2000;

      const imgBase = `https://picsum.photos/seed/${dept.toLowerCase()}fashion${i}`;
      const image = `${imgBase}main/800/1000`;
      const images = [
        `${imgBase}a/800/1000`,
        `${imgBase}b/800/1000`,
        `${imgBase}c/800/1000`
      ];

      let product = {
        id: pId,
        name,
        category,
        department: dept,
        price,
        image,
        images,
        isNew: Math.random() > 0.7,
        sales: Math.floor(Math.random() * 500),
        description: `A stunning and high-quality ${name.toLowerCase()} for your collection. Crafted with the finest materials to ensure long-lasting elegance and style.`,
        material: isJewellery ? (dept === 'Silver' ? 'silver' : 'gold') : 'cotton',
        occasion: (dept === 'Bridal' || dept === 'Gold') ? 'festive' : 'casual',
      };

      if (category === 'Clothing') {
         product.variants = [{ name: 'Size', options: ['S', 'M', 'L', 'XL'] }];
      } else if (dept === 'Rings') {
         product.variants = [{ name: 'Ring Size', options: ['6', '7', '8', '9'] }];
      } else {
         product.variants = [];
      }

      products.push(product);
    }
  }
}

const productsStr = 'const PRODUCTS: Product[] = ' + JSON.stringify(products, null, 2) + ';';

content = content.replace(/const PRODUCTS: Product\[\] = \[[\s\S]*?\];\n/, productsStr + '\n');
fs.writeFileSync(appPath, content);
console.log("Replaced PRODUCTS successfully! Length: ", products.length);
