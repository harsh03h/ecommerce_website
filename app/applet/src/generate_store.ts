import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appPath = path.join(__dirname, 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

const imagesDict: Record<string, string[]> = {
  'Women': [
    '1515886657613-9f3515b0c78f', // fashion woman
    '1494790108377-be9c29b29330',
    '1434389678129-373eb5245842',
    '1509631179647-0c4422b406af',
    '1516762689617-e1cffcef479d',
    '1524041255072-7da0526d9607',
    '1529139574466-a30ced9df1e9',
    '1550614000-4b95f190ca86',
    '1485968940801-6b89c72cbbdf',
    '1483985988355-64d4b14dcd69',
    '1550639525-c97d455badce'
  ],
  'Men': [
    '1480455624315-08183063fbf8', // men fashion
    '1516826957135-738b8d91bfd5',
    '1507003211169-0a1dd7228f2d',
    '1500648767791-00dcc994a43e',
    '1492288922247-9f17041dc015',
    '1506152988166-5de3bd062e5b',
    '1512413913045-8f673e449a5b',
    '1521572267360-ee0c42cf0ebc',
    '1446214814726-e644b419875e',
    '1472535071195-2dfb9b63c7b2',
    '1490214643033-f11ef3b508f7'
  ],
  'Kids': [
    '1519238263530-99abad111f41', // kids
    '1622290291468-a28f7a7dc6a8',
    '1514090259021-dca9e87178a9',
    '1503919545829-bd0f0a4f5fbc',
    '1545642412-ee9d2d0c1e84',
    '1601664188737-1473fa0c1ce6',
    '1503454537195-1f953258efdb',
    '1471203049176-ed66526fcbe5',
    '1518831959646-742c3a14ebf7',
    '1502422051664-b25c3453b519',
    '1524355523956-6a99cecdacde'
  ],
  'Gold': [
    '1611591437281-460bfbe1220a', // gold jewelry
    '1599643477877-530eb83abc8e',
    '1601121141461-9d6647bca1ed',
    '1599643478514-46b1db90ef40',
    '1629851163478-f71f654b953d',
    '1535632066927-ab7c9ab60908',
    '1596944924616-7b38e7cfac36',
    '1515562141207-7a88fb7ce338',
    '1573408301185-9146522cbbbb',
    '1605100804763-247f67b254a6',
    '1611591437281-460bfbe1220a'
  ],
  'Silver': [
    '1535632066927-ab7c9ab60908',
    '1599643477877-530eb83abc8e',
    '1629851163478-f71f654b953d',
    '1615361200141-f8e28f0de278',
    '1573408301185-9146522cbbbb',
    '1515562141207-7a88fb7ce338',
    '1535632066927-ab7c9ab60908',
    '1599643477877-530eb83abc8e',
    '1601121141461-9d6647bca1ed',
    '1605100804763-247f67b254a6' // rings etc
  ],
  'Bridal': [
    '1601121141461-9d6647bca1ed',
    '1599643478514-46b1db90ef40',
    '1599643477877-530eb83abc8e',
    '1611591437281-460bfbe1220a',
    '1535632066927-ab7c9ab60908',
    '1595777457583-95e059d581b8',
    '1515562141207-7a88fb7ce338',
    '1605100804763-247f67b254a6',
    '1601121141461-9d6647bca1ed',
    '1599643478514-46b1db90ef40'
  ],
  'Rings': [
    '1605100804763-247f67b254a6',
    '1515562141207-7a88fb7ce338',
    '1615361200141-f8e28f0de278',
    '1601121141461-9d6647bca1ed',
    '1535632066927-ab7c9ab60908',
    '1599643477877-530eb83abc8e',
    '1573408301185-9146522cbbbb',
    '1611591437281-460bfbe1220a',
    '1596944924616-7b38e7cfac36',
    '1605100804763-247f67b254a6',
    '1515562141207-7a88fb7ce338'
  ]
};

const namesDict: Record<string, string[]> = {
  'Women': [
    "Aurelia Silk Wrap Dress", "Crimson Flow Maxi", "Midnight Velvet Gown", "Chiffon Summer Blouse",
    "Tailored Linen Blazer", "Pleated Midi Skirt", "Cashmere Blend Cardigan", "Indigo Denim Jacket",
    "Floral Embroidered Tunic", "Satin Slip Dress", "Bohemian Peasant Top"
  ],
  'Men': [
    "Oxford Button-Down Shirt", "Tailored Wool Trousers", "Classic Navy Blazer", "Cashmere Crewneck Sweater",
    "Vintage Leather Jacket", "Slim Fit Chinos", "Herringbone Tweed Coat", "Cotton Pique Polo",
    "Selvedge Denim Jeans", "Linen Resort Shirt", "Merino Wool V-Neck"
  ],
  'Kids': [
    "Playtime Denim Overalls", "Cotton Print Romper", "Festive Silk Kurta", "Floral Party Dress",
    "Striped Cotton Tee", "Cozy Knit Cardigan", "Polka Dot Raincoat", "Summer Linen Shorts",
    "Embroidered Twirl Skirt", "Dinosaur Print Hoodie", "Classic School Uniform Set"
  ],
  'Gold': [
    "22k Heritage Temple Necklace", "Kundan & Emerald Choker", "Gold Filigree Bangles", "Polki Diamond Studs",
    "Antique Gold Jhumkas", "18k Solid Gold Chain", "Ruby Inset Pendant", "Traditional Lakshmi Haar",
    "Gold & Pearl Drop Earrings", "Textured Gold Cuff", "22k Gold Mangalsutra"
  ],
  'Silver': [
    "Oxidized Silver Tribal Choker", "Sterling Silver Anklet", "Artistic Silver Nose Pin", "Vintage Silver Danglers",
    "Bohemian Statement Ring", "Silver Ghungroo Bracelet", "Enamelled Silver Jhumkis", "Minimalist Silver Chain",
    "Filigree Silver Pendant", "Chunky Silver Cuff", "925 Sterling Hoops"
  ],
  'Bridal': [
    "Royal Polki Matha Patti", "Heavy Kundan Bridal Set", "Bridal Pearl Nath", "Elaborate Meenakari Choker",
    "Bridal Chura Sets", "Emerald Drop Maang Tikka", "Jadau Bridal Haaram", "Diamond & Gold Maatha Patti",
    "Exquisite Bridal Passa", "Traditional Temple Bridal Set", "Kundan Armlet (Bajuband)"
  ],
  'Rings': [
    "Solitaire Diamond Engagement Ring", "Vintage Sapphire Halo Ring", "18k Gold Eternity Band", "Rose Gold Moissanite Ring",
    "Classic Platinum Wedding Band", "Ruby Cluster Ring", "Minimalist Gold Stacking Rings", "Emerald Cut Engagement Ring",
    "Oval Diamond Halo Ring", "Art Deco Sapphire Ring", "Pear Shaped Diamond Ring"
  ]
};

let products: any[] = [];
let idCounter = 1;

for (const [category, departments] of Object.entries({'Clothing': ['Women', 'Men', 'Kids'], 'Jewellery': ['Gold', 'Silver', 'Bridal', 'Rings']})) {
  for (const dept of departments) {
    for (let i = 0; i < 10; i++) {
      const isJewellery = category === 'Jewellery';
      const pId = `${isJewellery ? 'j' : 'c'}${idCounter++}`;
      
      let name = namesDict[dept][i] || `${dept} Premium Item ${i+1}`;
      let price = Math.floor(Math.random() * 5000) + 1500;
      if (isJewellery) price = Math.floor(Math.random() * 80000) + 8000;

      const imgId = imagesDict[dept][i % imagesDict[dept].length];
      const image = `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&q=80&w=800&h=1000`;
      
      const images = [image]; // Usually in e-commerce, variations use the same high qual image for mocks.

      let product: any = {
        id: pId,
        name,
        category,
        department: dept,
        price,
        image,
        images,
        isNew: Math.random() > 0.6,
        sales: Math.floor(Math.random() * 800),
        description: `Experience the elegant craftsmanship of the ${name}. Perfectly designed for your sophisticated taste.`,
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
