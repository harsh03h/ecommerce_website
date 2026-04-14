import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Search, ShoppingBag, ArrowRight, SlidersHorizontal, Star, X, User as UserIcon, Heart, Share2, Facebook, Twitter, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import { auth, signInWithGoogle, logout, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

// Mock Data for the store
export type ProductVariant = {
  name: string;
  options: string[];
};

export type Product = {
  id: string;
  name: string;
  category: string;
  department?: 'Men' | 'Women' | 'Kids' | 'Gold' | 'Silver' | 'Bridal' | 'Rings';
  price: number;
  image: string;
  images: string[];
  isNew: boolean;
  sales: number;
  description: string;
  variants?: ProductVariant[];
};

const PRODUCTS: Product[] = [
  {
    id: 'c1',
    name: 'Smocked strappy dress',
    category: 'Clothing',
    department: 'Women',
    price: 1500,
    image: 'https://image.hm.com/assets/hm/e4/e3/e4e3a52016071db7561418f47646037827e44bc7.jpg?imwidth=2160',
    images: [
      'https://image.hm.com/assets/hm/fe/51/fe518e61ec358ce58cad5bba0d61ca4a1efe1adf.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/1e/f8/1ef8ae431836ce609b5f1a5e5116ceed5b831fb9.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/1d/e9/1de9c7f11cbd002542733f626e7aeea89b82b90d.jpg?imwidth=2160'
    ],
    isNew: true,
    sales: 120,
    description: 'Authentic handwoven Banarasi silk saree featuring intricate zari work. Perfect for weddings and festive occasions.',
    variants: [
      { name: 'Color', options: ['Crimson Red', 'Royal Blue', 'Emerald Green'] }
    ]
  },
  {
    id: 'j1',
    name: 'Kundan Bridal Set',
    category: 'Jewellery',
    department: 'Bridal',
    price: 1250,
    image: 'https://i.etsystatic.com/30916859/r/il/d45fec/3903175250/il_600x600.3903175250_qkb7.jpg',
    images: [
      'https://i.etsystatic.com/30916859/r/il/d45fec/3903175250/il_600x600.3903175250_qkb7.jpg',
      'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop'
    ],
    isNew: true,
    sales: 45,
    description: 'Exquisite Kundan bridal necklace set with matching earrings and maang tikka, crafted in 22k gold plating.',
    variants: [
      { name: 'Metal Finish', options: ['22k Gold', 'Antique Gold'] },
      { name: 'Stone Color', options: ['Ruby Red', 'Emerald Green', 'Pearl White'] }
    ]
  },
  {
    id: 'c2',
    name: 'Velvet Embroidered Lehenga',
    category: 'Clothing',
    department: 'Women',
    price: 4500,
    image: 'https://tse1.mm.bing.net/th/id/OIP.0KXqDbQ53cVcGX8bQDiQDgHaKL?rs=1&pid=ImgDetMain&o=7&rm=3',
    images: [
      'https://www.kollybollyethnics.com/image/catalog/data/14Feb2022/Maroon-velvet-embroidered-bridal-lehenga-choli-8103.jpg',
      'https://tse3.mm.bing.net/th/id/OIP.sQTqeGvVSwoQbrZR_osnSAHaKL?rs=1&pid=ImgDetMain&o=7&rm=3',
      'https://tse3.mm.bing.net/th/id/OIP.VwIoZYR6kWn966ypwM8ePwHaKt?w=1000&h=1447&rs=1&pid=ImgDetMain&o=7&rm=3'
    ],
    isNew: false,
    sales: 300,
    description: 'Deep maroon velvet lehenga adorned with heavy zardosi and thread embroidery. Includes a matching net dupatta.',
    variants: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', options: ['Deep Maroon', 'Midnight Blue'] }
    ]
  },
  {
    id: 'j2',
    name: 'Diamond Tennis Bracelet',
    category: 'Jewellery',
    department: 'Silver',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=800&auto=format&fit=crop'
    ],
    isNew: false,
    sales: 210,
    description: 'Classic tennis bracelet featuring brilliant-cut VVS diamonds set in 18k white gold. A timeless statement piece.',
    variants: [
      { name: 'Metal', options: ['18k White Gold', '18k Yellow Gold', '18k Rose Gold'] },
      { name: 'Length', options: ['6.5 inches', '7 inches', '7.5 inches'] }
    ]
  },
  {
    id: 'c3',
    name: 'Sweatshirts',
    category: 'Clothing',
    department: 'Men',
    price: 850,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://engine.com.pk/cdn/shop/products/MT3237-TEL_1.jpg?v=1700224175',
      'https://images.unsplash.com/photo-1604644401890-0bd678c83788?q=80&w=800&auto=format&fit=crop',
      'https://tse1.mm.bing.net/th/id/OIP.wWZmc1AuxHM42shwTHtGOwHaJh?rs=1&pid=ImgDetMain&o=7&rm=3'
    ],
    isNew: false,
    sales: 80,
    description: 'Pure Kashmiri Pashmina shawl with subtle hand-embroidery along the borders. Incredibly soft and warm.',
    variants: [
      { name: 'Color', options: ['Ivory White', 'Charcoal Grey', 'Dusty Rose'] }
    ]
  },
  {
    id: 'j3',
    name: 'Polki Drop Earrings',
    category: 'Jewellery',
    department: 'Gold',
    price: 35000,
    image: 'https://tse3.mm.bing.net/th/id/OIP.jvOVBLwN0htTjYCZQAiTrwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
    images: [
      'https://tse1.mm.bing.net/th/id/OIP.cQofW8Q2xZmnrV2Oi8ql4QHaHa?w=1000&h=1000&rs=1&pid=ImgDetMain&o=7&rm=3',
      'https://shop.southindiajewels.com/wp-content/uploads/2024/04/Imitation-Sparkling-Victorian-Polki-Drop-Earrings_1-scaled.jpg',
      'https://i.pinimg.com/originals/ec/64/07/ec6407340f34578f10022152446aa597.jpg'
    ],
    isNew: true,
    sales: 150,
    description: 'Stunning uncut diamond (Polki) drop earrings with emerald accents and pearl hangings.'
  },
  {
    id: 'c4',
    name: 'Women Wedding Suit ',
    category: 'Clothing',
    department: 'Women',
    price: 2500,
    image: 'https://www.libas.in/cdn/shop/files/green-yoke-design-silk-blend-straight-kurta-with-trousers-and-dupatta-libas-1-27531263770774_1400x.jpg?v=1694512762',
    images: [
      'https://www.libas.in/cdn/shop/files/green-yoke-design-silk-blend-straight-kurta-with-trousers-and-dupatta-libas-1-27531263770774_1400x.jpg?v=1694512762',
      'https://assets0.mirraw.com/images/11972064/image_zoom.jpeg?1706792452',
      'https://img.faballey.com/images/Product/XKS09183A/d4.jpg'
    ],
    isNew: true,
    sales: 45,
    description: 'Elegant silk blend Suit set with intricate embroidery and matching Suit.',
    variants: [
      { name: 'Size', options: ['M', 'L', 'XL', 'XXL'] }
    ]
  },
  {
    id: 'j4',
    name: 'Gold Temple Necklace',
    category: 'Jewellery',
    department: 'Gold',
    price: 45000,
    image: 'https://i.pinimg.com/originals/ac/11/9e/ac119e6f01360ef96f5d7a64171fad51.jpg',
    images: [
      'https://i.pinimg.com/originals/ac/11/9e/ac119e6f01360ef96f5d7a64171fad51.jpg',
      'https://i.pinimg.com/originals/ad/08/c0/ad08c0f148af2d360ef095d05996e9ab.jpg',
      'https://tse2.mm.bing.net/th/id/OIP.YBocOgHCb4RnHrCEuDqPDwHaJi?rs=1&pid=ImgDetMain&o=7&rm=3'
    ],
    isNew: false,
    sales: 89,
    description: 'Traditional 22k gold temple jewellery necklace with intricate deity motifs.'
  },
  {
    id: 'c5',
    name: 'Cotton Anarkali Suit',
    category: 'Clothing',
    department: 'Women',
    price: 3200,
    image: 'https://medias.utsavfashion.com/media/catalog/product/cache/1/image/1000x/040ec09b1e35df139433887a97daa66f/p/r/printed-pure-cotton-anarkali-suit-in-white-v1-kmqs146.jpg',
    images: [
      'https://medias.utsavfashion.com/media/catalog/product/cache/1/image/1000x/040ec09b1e35df139433887a97daa66f/p/r/printed-pure-cotton-anarkali-suit-in-white-v1-kmqs146.jpg',
      'https://i.pinimg.com/originals/1a/61/83/1a61836d6a9274507bde2de060ba4b57.jpg',
      'https://th.bing.com/th/id/R.456962bdf2abde2c9b9ffa761eedebbd?rik=D2C%2bjYpE%2fuqQpw&riu=http%3a%2f%2fpeachmode.com%2fcdn%2fshop%2fproducts%2flavender-floral-printed-pure-cotton-anarkali-suit-peachmode-1.jpg%3fv%3d1669070327&ehk=4tPf%2bJFFYm8L8zgic5JYH%2b2LRIbktSanVR7c%2fLKLU0w%3d&risl=&pid=ImgRaw&r=0'
    ],
    isNew: false,
    sales: 210,
    description: 'Comfortable and stylish block-printed cotton Anarkali suit, perfect for everyday elegance.',
    variants: [
      { name: 'Size', options: ['S', 'M', 'L'] }
    ]
  },
  {
    id: 'j5',
    name: 'Oxidized Silver Jhumkas',
    category: 'Jewellery',
    department: 'Silver',
    price: 850,
    image: 'https://i.pinimg.com/originals/f9/d6/0b/f9d60bc1bc6a482b32a51b2e03ed0663.jpg',
    images: [
      'https://i.pinimg.com/originals/f9/d6/0b/f9d60bc1bc6a482b32a51b2e03ed0663.jpg',
      'https://i.etsystatic.com/16916043/r/il/7cebdf/2111585969/il_fullxfull.2111585969_jquu.jpg',
      'https://assets0.mirraw.com/images/8854182/image_zoom.jpeg?1616861497'
    ],
    isNew: true,
    sales: 450,
    description: 'Handcrafted oxidized silver jhumka earrings with tribal motifs and ghungroo drops.'
  },
  {
    id: 'c6',
    name: 'Chanderi Silk Dupatta',
    category: 'Clothing',
    department: 'Women',
    price: 1200,
    image: 'https://i.etsystatic.com/24145065/r/il/7fd8be/3346348133/il_300x300.3346348133_8ja7.jpg',
    images: [
      'https://i.etsystatic.com/24145065/r/il/7fd8be/3346348133/il_300x300.3346348133_8ja7.jpg',
      'https://cdn.shopify.com/s/files/1/0009/3510/0467/products/banarasi_silk_dupatta_red_DUP5731032012505547_1500x.jpg?v=1603799506',
      'https://tse3.mm.bing.net/th/id/OIP.Uhq_AwQc8lk888X_wB5DHgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'
    ],
    isNew: false,
    sales: 180,
    description: 'Lightweight Chanderi silk dupatta with golden zari border and delicate floral motifs.',
    variants: [
      { name: 'Color', options: ['Mustard Yellow', 'Mint Green', 'Peach'] }
    ]
  },
  {
    id: 'j6',
    name: 'Pearl Choker Set',
    category: 'Jewellery',
    department: 'Bridal',
    price: 12500,
    image: 'https://shop.southindiajewels.com/wp-content/uploads/2024/09/1805.5-scaled.jpg',
    images: [
      'https://shop.southindiajewels.com/wp-content/uploads/2024/09/1805.5-scaled.jpg',
      'https://tse2.mm.bing.net/th/id/OIP.20Y4_nQzuexxAEbKDzCVKwHaHa?pid=ImgDet&w=474&h=474&rs=1&o=7&rm=3',
      'https://tse4.mm.bing.net/th/id/OIP.JIFaSw4xjytE6Vghqw9-cAHaHa?pid=ImgDet&w=474&h=474&rs=1&o=7&rm=3'
    ],
    isNew: false,
    sales: 65,
    description: 'Elegant multi-strand freshwater pearl choker with a central kundan pendant.'
  },
  {
    id: 'j7',
    name: 'Solitaire Engagement Ring',
    category: 'Jewellery',
    department: 'Rings',
    price: 15000,
    image: 'https://i.pinimg.com/originals/cf/89/fb/cf89fb1c5ef28ad531d4e870a096e9c7.jpg',
    images: [
      'https://i.pinimg.com/originals/4b/55/7e/4b557eda262fba5dba66ed59bbce35cc.jpg',
      'https://i.pinimg.com/originals/99/74/48/997448bbd54661a85d4bac59a405a517.jpg'
    ],
    isNew: true,
    sales: 30,
    description: 'Stunning 1-carat solitaire diamond engagement ring set in platinum.',
    variants: [
      { name: 'Ring Size', options: ['5', '6', '7', '8', '9'] }
    ]
  },
  {
    id: 'c7',
    name: 'Boys Festive Kurta Pajama',
    category: 'Clothing',
    department: 'Kids',
    price: 1500,
    image: 'https://5.imimg.com/data5/SELLER/Default/2022/9/VR/BZ/IV/2421381/dark-peach-gold-printed-festive-kurta-with-off-white-pajama-for-boys-1000x1000.jpg',
    images: [
      'https://5.imimg.com/data5/SELLER/Default/2022/9/VR/BZ/IV/2421381/dark-peach-gold-printed-festive-kurta-with-off-white-pajama-for-boys-1000x1000.jpg',
      'https://tse2.mm.bing.net/th/id/OIP.KCDkQGt-lA8D1tSW44XidwHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3',
      'https://tse4.mm.bing.net/th/id/OIP.gW0vdKQBK45CQ5JryUBhTQHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3'
    ],
    isNew: true,
    sales: 120,
    description: 'Comfortable cotton kurta pajama set for boys, perfect for festive occasions.',
    variants: [
      { name: 'Age', options: ['2-3 Yrs', '4-5 Yrs', '6-7 Yrs'] }
    ]
  },
  {
    id: 'c8',
    name: 'Mens Linen Shirt',
    category: 'Clothing',
    department: 'Men',
    price: 1800,
    image: 'https://cdna.lystit.com/photos/b9a1-2016/02/05/john-varvatos-lichen-green-linen-shirt-green-product-0-792906595-normal.jpeg',
    images: [
      'https://cdna.lystit.com/photos/b9a1-2016/02/05/john-varvatos-lichen-green-linen-shirt-green-product-0-792906595-normal.jpeg',
      'https://th.bing.com/th/id/R.c77e852f879c5f6127d9e65c893bcc58?rik=brV8L4octnNN0A&riu=http%3a%2f%2fmagiclinen.com%2fcdn%2fshop%2fproducts%2fmens-linen-shirt-nevada-in-matcha-green-1.jpg%3fv%3d1661172505&ehk=Z5SlVGy6MMGC%2bjRT%2bkoCT5Cb9rh7bGHAFNeGolIi0R4%3d&risl=&pid=ImgRaw&r=0',
      'https://cdn.shopify.com/s/files/1/0511/8771/2157/files/Sunnyshirt2.png?v=1716363284'
    ],
    isNew: false,
    sales: 340,
    description: 'Breathable pure linen shirt with a relaxed fit. Ideal for casual outings.',
    variants: [
      { name: 'Size', options: ['M', 'L', 'XL'] },
      { name: 'Color', options: ['White', 'Navy Blue', 'Olive Green'] }
    ]
  }
];

// Mock Initial Reviews
const INITIAL_REVIEWS: Record<string, { id: string; author: string; rating: number; comment: string; date: string }[]> = {
  'c1': [
    { id: 'r1', author: 'Yash', rating: 5, comment: 'Absolutely stunning saree! The silk is incredibly soft and the zari work is flawless.', date: 'Apr 12, 2026' },
    { id: 'r2', author: 'Shriti', rating: 4, comment: 'Beautiful color, exactly as shown in the pictures. Drapes very well.', date: 'Jan 28, 2026' }
  ],
  'j1': [
    { id: 'r3', author: 'Deesha', rating: 5, comment: 'Wore this for my wedding and felt like a queen. The craftsmanship is premium.', date: 'Nov 05, 2025' }
  ]
};

type StoreMode = 'clothing' | 'jewellery';

const shareProduct = (e: React.MouseEvent, product: Product, platform: string) => {
  e.stopPropagation();
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`Check out ${product.name} at Harsh Imporium!`);
  
  let shareUrl = '';
  switch (platform) {
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      break;
    case 'whatsapp':
      shareUrl = `https://wa.me/?text=${text} ${url}`;
      break;
  }
  
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
};

const ShareMenu = ({ product, className = "", iconClassName = "" }: { product: Product, className?: string, iconClassName?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`${className}`} onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-colors ${iconClassName}`}
      >
        <Share2 className="w-4 h-4" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`absolute top-full right-0 mt-2 bg-brand-surface border border-brand-ink/10 shadow-xl rounded-lg p-2 flex gap-2 z-50`}
          >
            <button onClick={(e) => { shareProduct(e, product, 'facebook'); setIsOpen(false); }} className="p-2 hover:bg-brand-ink/5 rounded-full text-brand-ink hover:text-brand-gold transition-colors" title="Share on Facebook">
              <Facebook className="w-4 h-4" />
            </button>
            <button onClick={(e) => { shareProduct(e, product, 'twitter'); setIsOpen(false); }} className="p-2 hover:bg-brand-ink/5 rounded-full text-brand-ink hover:text-brand-gold transition-colors" title="Share on Twitter">
              <Twitter className="w-4 h-4" />
            </button>
            <button onClick={(e) => { shareProduct(e, product, 'whatsapp'); setIsOpen(false); }} className="p-2 hover:bg-brand-ink/5 rounded-full text-brand-ink hover:text-brand-gold transition-colors" title="Share on WhatsApp">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const renderStars = (rating: number, interactive = false, onRate?: (star: number) => void) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          className={`w-3 h-3 md:w-4 md:h-4 ${interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''} ${star <= rating ? 'fill-brand-gold text-brand-gold' : 'text-brand-ink/20'}`}
          onClick={() => interactive && onRate && onRate(star)}
        />
      ))}
    </div>
  );
};

const ProductCard: React.FC<{
  product: Product;
  reviews: any[];
  isSaved: boolean;
  onSelect: (product: Product) => void;
  onToggleWishlist: (e: React.MouseEvent, id: string) => Promise<void> | void;
  onAddToCart: (e: React.MouseEvent, id: string, variants?: Record<string, string>) => void;
}> = ({ 
  product, 
  reviews, 
  isSaved, 
  onSelect, 
  onToggleWishlist, 
  onAddToCart 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-brand-surface">
        {product.isNew && (
          <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 bg-brand-gold text-brand-bg text-[9px] md:text-[10px] uppercase tracking-widest px-2 py-1 md:px-3 md:py-1 font-medium">
            New Arrival
          </div>
        )}
        <div className="absolute top-3 right-3 md:top-4 md:right-4 z-20 flex flex-col gap-2">
          <button 
            onClick={(e) => onToggleWishlist(e, product.id)}
            className="p-2 bg-brand-bg/80 hover:bg-brand-bg rounded-full text-brand-ink transition-colors backdrop-blur-md"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-brand-gold text-brand-gold' : ''}`} />
          </button>
          <ShareMenu 
            product={product} 
            className="relative"
            iconClassName="bg-brand-bg/80 hover:bg-brand-bg text-brand-ink backdrop-blur-md"
          />
        </div>

        <img 
          src={product.images[currentImageIndex] || product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Image Navigation Arrows (Visible on Hover on Desktop, Always on Mobile) */}
        {product.images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
            <button 
              onClick={prevImage}
              className="w-8 h-8 rounded-full bg-white/80 text-brand-ink flex items-center justify-center hover:bg-white transition-colors shadow-sm pointer-events-auto"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={nextImage}
              className="w-8 h-8 rounded-full bg-white/80 text-brand-ink flex items-center justify-center hover:bg-white transition-colors shadow-sm pointer-events-auto"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Image Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
            {product.images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        )}

        <div className="hidden md:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col items-center justify-center gap-3 pointer-events-none">
          <button className="bg-brand-bg/90 text-brand-gold text-[10px] md:text-xs uppercase tracking-widest px-4 py-2 md:px-6 md:py-3 hover:bg-brand-gold hover:text-brand-bg transition-colors backdrop-blur-sm pointer-events-auto w-3/4 max-w-[160px]">
            View Details
          </button>
          <button 
            onClick={(e) => onAddToCart(e, product.id)}
            className="bg-brand-gold text-brand-bg text-[10px] md:text-xs uppercase tracking-widest px-4 py-2 md:px-6 md:py-3 hover:bg-brand-bg hover:text-brand-gold transition-colors backdrop-blur-sm pointer-events-auto w-3/4 max-w-[160px]"
          >
            Add to Cart
          </button>
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-brand-gold mb-1">{product.category}</p>
          <h4 className="font-serif text-base md:text-lg text-brand-ink">{product.name}</h4>
          {reviews.length > 0 && (
            <div className="flex items-center gap-1 md:gap-2 mt-1">
              {renderStars(Math.round(avgRating))}
              <span className="text-[10px] md:text-xs text-brand-ink/50">({reviews.length})</span>
            </div>
          )}
        </div>
        <p className="text-xs md:text-sm tracking-wider text-brand-ink/80 mt-1">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [storeMode, setStoreMode] = useState<StoreMode>('clothing');
  const [department, setDepartment] = useState<'All' | 'Men' | 'Women' | 'Kids'>('All');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'wishlist' | 'profile' | 'orders' | 'about'>('home');
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<{productId: string, quantity: number, variants?: Record<string, string>}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [toast, setToast] = useState<{message: string, id: number} | null>(null);
  
  // Profile State
  const [profileData, setProfileData] = useState<{ displayName: string; phone: string; address: string }>({ displayName: '', phone: '', address: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Review System State
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [reviewForm, setReviewForm] = useState({ author: '', rating: 5, comment: '' });

  // Lock body scroll when modal or mobile menu is open
  useEffect(() => {
    if (selectedProduct || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedProduct, isMobileMenuOpen]);

  // Handle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
  }, [isDarkMode]);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Profile Data
  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData({
            displayName: data.displayName || '',
            phone: data.phone || '',
            address: data.address || ''
          });
        }
      }, (error) => {
        console.error("Error fetching profile", error);
      });
      return () => unsubscribe();
    } else {
      setProfileData({ displayName: '', phone: '', address: '' });
    }
  }, [user]);

  // Listen to Wishlist
  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(collection(db, 'users', user.uid, 'wishlist'), (snapshot) => {
        const items = snapshot.docs.map(doc => doc.id);
        setWishlist(items);
      }, (error) => {
        console.error("Error fetching wishlist", error);
      });
      return () => unsubscribe();
    } else {
      setWishlist([]);
    }
  }, [user]);

  // Listen to Orders
  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(collection(db, 'users', user.uid, 'orders'), (snapshot) => {
        const fetchedOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a: any, b: any) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        });
        setOrders(fetchedOrders);
      }, (error) => {
        console.error("Error fetching orders", error);
      });
      return () => unsubscribe();
    } else {
      setOrders([]);
    }
  }, [user]);

  const toggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!user) {
      signInWithGoogle();
      return;
    }
    const isSaved = wishlist.includes(productId);
    try {
      if (isSaved) {
        await deleteDoc(doc(db, 'users', user.uid, 'wishlist', productId));
      } else {
        await setDoc(doc(db, 'users', user.uid, 'wishlist', productId), {
          productId,
          addedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Error toggling wishlist", error);
    }
  };

  const addToCart = (e: React.MouseEvent, productId: string, variants?: Record<string, string>) => {
    e.stopPropagation();
    const product = PRODUCTS.find(p => p.id === productId);
    setCart(prev => {
      // Check if item with same product ID and same variants exists
      const existingIndex = prev.findIndex(item => {
        if (item.productId !== productId) return false;
        if (!item.variants && !variants) return true;
        if (!item.variants || !variants) return false;
        
        // Compare variants
        const itemKeys = Object.keys(item.variants);
        const newKeys = Object.keys(variants);
        if (itemKeys.length !== newKeys.length) return false;
        
        return itemKeys.every(key => item.variants![key] === variants[key]);
      });

      if (existingIndex >= 0) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += 1;
        return newCart;
      }
      return [...prev, { productId, quantity: 1, variants }];
    });
    
    const id = Date.now();
    setToast({ message: `${product?.name || 'Item'} added to cart`, id });
    setTimeout(() => {
      setToast(prev => prev?.id === id ? null : prev);
    }, 3000);
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        displayName: profileData.displayName,
        phone: profileData.phone,
        address: profileData.address
      }, { merge: true });
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error saving profile", error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const checkout = async () => {
    if (!user) {
      signInWithGoogle();
      return;
    }
    if (cart.length === 0) return;
    
    setIsCheckingOut(true);
    try {
      const totalAmount = cart.reduce((sum, item) => {
        const product = PRODUCTS.find(p => p.id === item.productId);
        return sum + (product?.price || 0) * item.quantity;
      }, 0);

      const orderId = `ord_${Date.now()}`;
      await setDoc(doc(db, 'users', user.uid, 'orders', orderId), {
        items: cart,
        totalAmount,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      setCart([]);
      setIsCartOpen(false);
      setCurrentView('orders');
    } catch (error) {
      console.error("Error creating order", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];
    
    // Filter by Store Mode
    if (storeMode === 'clothing') result = result.filter(p => p.category === 'Clothing');
    if (storeMode === 'jewellery') result = result.filter(p => p.category === 'Jewellery');

    // Filter by Department
    if (department !== 'All') {
      result = result.filter(p => p.department === department);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.description && p.description.toLowerCase().includes(query)) ||
        p.category.toLowerCase().includes(query) ||
        (p.department && p.department.toLowerCase().includes(query))
      );
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      case 'bestsellers':
        result.sort((a, b) => b.sales - a.sales);
        break;
      default:
        break;
    }

    return result;
  }, [storeMode, sortBy, department]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !reviewForm.author.trim() || !reviewForm.comment.trim()) return;

    const newReview = {
      id: Date.now().toString(),
      author: reviewForm.author,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    };

    setReviews(prev => ({
      ...prev,
      [selectedProduct.id]: [newReview, ...(prev[selectedProduct.id] || [])]
    }));

    setReviewForm({ author: '', rating: 5, comment: '' });
  };

  const brandInfo = {
    clothing: { title: 'Harsh Imporium', sub: 'Luxury Clothing' },
    jewellery: { title: 'Anand Jewellars', sub: 'Fine Jewellery' }
  }[storeMode];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-[150] bg-brand-bg flex flex-col p-6 md:hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="font-serif text-2xl text-brand-gold">{brandInfo.title}</h2>
                <p className="text-[9px] uppercase tracking-[0.2em] mt-1 text-brand-ink/60">{brandInfo.sub}</p>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-brand-ink/10 rounded-full text-brand-ink">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-8 text-lg uppercase tracking-widest font-medium">
              <a href="#shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-gold transition-colors border-b border-brand-ink/10 pb-4">Shop</a>
              <a href="#collections" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-gold transition-colors border-b border-brand-ink/10 pb-4">Collections</a>
              {isAuthReady && user ? (
                <>
                  <button onClick={() => { setCurrentView('profile'); setIsMobileMenuOpen(false); }} className="text-left hover:text-brand-gold transition-colors border-b border-brand-ink/10 pb-4">My Profile</button>
                  <button onClick={() => { setCurrentView('wishlist'); setIsMobileMenuOpen(false); }} className="text-left hover:text-brand-gold transition-colors border-b border-brand-ink/10 pb-4">My Wishlist</button>
                  <button onClick={() => { setCurrentView('orders'); setIsMobileMenuOpen(false); }} className="text-left hover:text-brand-gold transition-colors border-b border-brand-ink/10 pb-4">Order History</button>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); setCurrentView('home'); }} className="text-left text-red-400 hover:text-red-300 transition-colors border-b border-brand-ink/10 pb-4">Sign Out</button>
                </>
              ) : (
                <button onClick={() => { signInWithGoogle(); setIsMobileMenuOpen(false); }} className="text-left hover:text-brand-gold transition-colors border-b border-brand-ink/10 pb-4">Log In</button>
              )}
            </div>
            
            <div className="mt-auto pt-8 border-t border-brand-ink/10">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs uppercase tracking-widest text-brand-ink/60">Store Mode</p>
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)} 
                  className="p-2 hover:bg-brand-ink/10 rounded-full transition-colors"
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex bg-brand-ink/5 p-1 rounded-full text-[10px] uppercase tracking-widest border border-brand-ink/10">
                <button 
                  onClick={() => { setStoreMode('clothing'); setIsMobileMenuOpen(false); }}
                  className={`flex-1 py-2 rounded-full transition-colors ${storeMode === 'clothing' ? 'bg-brand-gold text-brand-bg' : 'hover:text-brand-gold'}`}
                >
                  Clothing
                </button>
                <button 
                  onClick={() => { setStoreMode('jewellery'); setIsMobileMenuOpen(false); }}
                  className={`flex-1 py-2 rounded-full transition-colors ${storeMode === 'jewellery' ? 'bg-brand-gold text-brand-bg' : 'hover:text-brand-gold'}`}
                >
                  Jewellery
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="border-b border-brand-ink/10 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 bg-brand-bg/90 backdrop-blur-md z-40">
        <div className="flex items-center gap-4 md:gap-6 w-1/3">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 hover:bg-brand-ink/10 rounded-full transition-colors md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-medium">
            <a href="#shop" className="hover:text-brand-gold transition-colors">Shop</a>
            <a href="#collections" className="hover:text-brand-gold transition-colors">Collections</a>
          </div>
        </div>
        
        <div className="text-center w-1/3 flex flex-col items-center cursor-pointer" onClick={() => setCurrentView('home')}>
          <h1 className="font-serif text-xl md:text-3xl leading-none tracking-tight text-brand-gold transition-all">
            {brandInfo.title}
          </h1>
          <p className="hidden md:block text-[9px] uppercase tracking-[0.2em] mt-1 text-brand-ink/60 transition-all">
            {brandInfo.sub}
          </p>
          
          {/* Desktop Store Mode Toggle */}
          <div className="hidden md:flex bg-brand-ink/5 p-1 rounded-full text-[9px] uppercase tracking-widest mt-4 border border-brand-ink/10">
            <button 
              onClick={() => setStoreMode('clothing')}
              className={`px-3 py-1.5 rounded-full transition-colors ${storeMode === 'clothing' ? 'bg-brand-gold text-brand-bg' : 'hover:text-brand-gold'}`}
            >
              Clothing
            </button>
            <button 
              onClick={() => setStoreMode('jewellery')}
              className={`px-3 py-1.5 rounded-full transition-colors ${storeMode === 'jewellery' ? 'bg-brand-gold text-brand-bg' : 'hover:text-brand-gold'}`}
            >
              Jewellery
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 md:gap-4 w-1/3">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className="p-2 hover:bg-brand-ink/10 rounded-full transition-colors hidden md:block"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {isAuthReady && user ? (
            <div className="relative group/auth hidden md:block">
              <button className="flex items-center gap-2 p-1 pr-3 hover:bg-brand-ink/10 rounded-full transition-colors border border-brand-ink/10">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-brand-gold text-brand-bg flex items-center justify-center text-[10px] font-bold">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="text-[10px] uppercase tracking-widest max-w-[80px] truncate">
                  {user.displayName?.split(' ')[0] || 'Profile'}
                </span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-brand-surface border border-brand-ink/10 shadow-xl opacity-0 invisible group-hover/auth:opacity-100 group-hover/auth:visible transition-all z-50 flex flex-col">
                <div className="p-4 border-b border-brand-ink/10">
                  <p className="text-xs font-medium text-brand-ink truncate">{user.displayName || 'User'}</p>
                  <p className="text-[10px] text-brand-ink/60 truncate">{user.email}</p>
                </div>
                <button onClick={() => setCurrentView('profile')} className="text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-brand-ink/5 transition-colors">My Profile</button>
                <button onClick={() => setCurrentView('wishlist')} className="text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-brand-ink/5 transition-colors">My Wishlist</button>
                <button onClick={() => setCurrentView('orders')} className="text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-brand-ink/5 transition-colors">Order History</button>
                <button onClick={() => { logout(); setCurrentView('home'); }} className="text-left px-4 py-3 text-xs uppercase tracking-widest text-red-400 hover:bg-brand-ink/5 transition-colors border-t border-brand-ink/10">Sign Out</button>
              </div>
            </div>
          ) : (
            <button onClick={signInWithGoogle} className="text-[10px] uppercase tracking-widest hover:text-brand-gold transition-colors hidden md:block">
              Log In
            </button>
          )}
          <button className="p-2 hover:bg-brand-ink/10 rounded-full transition-colors md:hidden">
            <UserIcon className="w-5 h-5" onClick={() => setIsMobileMenuOpen(true)} />
          </button>
          <button className="p-2 hover:bg-brand-ink/10 rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-brand-ink/10 rounded-full transition-colors relative" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag className="w-5 h-5" />
            {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-gold text-brand-bg text-[10px] font-bold rounded-full flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex justify-end"
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="w-full max-w-md bg-brand-surface h-full flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-brand-ink/10 flex justify-between items-center">
                <h2 className="font-serif text-2xl text-brand-ink">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-brand-ink/10 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-12 h-12 text-brand-ink/20 mx-auto mb-4" />
                    <p className="text-brand-ink/60">Your cart is empty.</p>
                  </div>
                ) : (
                  cart.map((item, idx) => {
                    const product = PRODUCTS.find(p => p.id === item.productId);
                    if (!product) return null;
                    return (
                      <div key={idx} className="flex gap-4 border-b border-brand-ink/10 pb-6">
                        <img src={product.image} alt={product.name} className="w-20 h-24 object-cover" referrerPolicy="no-referrer" />
                        <div className="flex-grow">
                          <h4 className="font-serif text-lg text-brand-ink">{product.name}</h4>
                          <p className="text-sm text-brand-ink/70 mt-1">₹{product.price.toLocaleString('en-IN')}</p>
                          {item.variants && Object.entries(item.variants).map(([key, val]) => (
                            <p key={key} className="text-[10px] uppercase tracking-widest text-brand-ink/50 mt-1">{key}: {val}</p>
                          ))}
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-brand-ink/80">Qty: {item.quantity}</p>
                            <button 
                              onClick={() => {
                                setCart(prev => prev.filter((_, i) => i !== idx));
                              }}
                              className="text-[10px] uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="p-6 border-t border-brand-ink/10 bg-brand-bg">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm uppercase tracking-widest text-brand-ink/70">Subtotal</span>
                    <span className="font-serif text-xl text-brand-ink">
                      ₹{cart.reduce((sum, item) => {
                        const product = PRODUCTS.find(p => p.id === item.productId);
                        return sum + (product?.price || 0) * item.quantity;
                      }, 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button 
                    onClick={checkout}
                    disabled={isCheckingOut}
                    className="w-full bg-brand-gold text-brand-bg py-4 text-xs uppercase tracking-widest font-medium hover:bg-brand-ink hover:text-brand-gold transition-colors disabled:opacity-50"
                  >
                    {isCheckingOut ? 'Processing...' : 'Checkout'}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Store Mode Toggle (Visible only on small screens below nav) */}
      <div className="md:hidden flex justify-center bg-brand-bg border-b border-brand-ink/10 py-3 px-4">
        <div className="flex w-full max-w-xs bg-brand-ink/5 p-1 rounded-full text-[9px] uppercase tracking-widest border border-brand-ink/10">
          <button 
            onClick={() => setStoreMode('clothing')}
            className={`flex-1 py-1.5 rounded-full transition-colors ${storeMode === 'clothing' ? 'bg-brand-gold text-brand-bg' : 'hover:text-brand-gold'}`}
          >
            Clothing
          </button>
          <button 
            onClick={() => setStoreMode('jewellery')}
            className={`flex-1 py-1.5 rounded-full transition-colors ${storeMode === 'jewellery' ? 'bg-brand-gold text-brand-bg' : 'hover:text-brand-gold'}`}
          >
            Jewellery
          </button>
        </div>
      </div>

      <main className="flex-grow">
        {currentView === 'home' ? (
          <>
            {/* Hero Section */}
        <section className="relative h-[70vh] md:h-[85vh] flex flex-col md:flex-row border-b border-brand-ink/10">
          {/* Left: Clothing */}
          {storeMode === 'clothing' && (
            <div className="relative group overflow-hidden border-brand-ink/10 w-full h-full">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700 z-10" />
              <img 
                src="https://png.pngtree.com/background/20230519/original/pngtree-the-interior-of-a-clothing-store-with-clothing-on-display-picture-image_2654940.jpg" 
                alt="Harsh Cloth Imporium" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 z-20 p-6 md:p-12 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  key={`hero-clothing-${storeMode}`}
                >
                  <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] mb-3 md:mb-4 text-brand-gold">Harsh Cloth Imporium</p>
                  <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light mb-4 md:mb-6 leading-tight">
                    Elegance in <br /> Every Thread.
                  </h2>
                  <button 
                    onClick={() => { document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="flex items-center gap-3 text-xs md:text-sm uppercase tracking-widest hover:text-brand-gold transition-colors group/btn"
                  >
                    Explore Collection
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </div>
            </div>
          )}

          {/* Right: Jewellery */}
          {storeMode === 'jewellery' && (
            <div className="relative group overflow-hidden w-full h-full">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700 z-10" />
              <img 
                src="https://media.istockphoto.com/id/1406447764/photo/jewellery.jpg?b=1&s=170667a&w=0&k=20&c=buNQFmJqJiaw_RJOCJgASnAZyA_0R0Pq-Ex0BuYi4-I=" 
                alt="Anand Jewellars" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 z-20 p-6 md:p-12 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  key={`hero-jewellery-${storeMode}`}
                >
                  <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] mb-3 md:mb-4 text-brand-gold">Anand Jewellars</p>
                  <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light mb-4 md:mb-6 leading-tight">
                    Timeless <br /> Brilliance.
                  </h2>
                  <button 
                    onClick={() => { document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="flex items-center gap-3 text-xs md:text-sm uppercase tracking-widest hover:text-brand-gold transition-colors group/btn"
                  >
                    Discover Pieces
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </div>
            </div>
          )}
        </section>

        {/* Intro Section */}
        <section className="py-16 md:py-24 px-6 md:px-12 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            key={`intro-${storeMode}`}
          >
            <h3 className="font-serif text-2xl md:text-5xl font-light leading-tight mb-6 md:mb-8">
              {storeMode === 'clothing' && <>A legacy of <span className="italic text-brand-gold">elegance</span> and <span className="italic text-brand-gold">style</span>, woven into every thread.</>}
              {storeMode === 'jewellery' && <>A legacy of <span className="italic text-brand-gold">brilliance</span> and <span className="italic text-brand-gold">trust</span>, crafted for eternity.</>}
            </h3>
            <p className="text-sm md:text-base text-brand-ink/70 max-w-2xl mx-auto leading-relaxed">
              {storeMode === 'clothing' && 'Experience the finest premium textiles from Harsh Cloth Imporium. We curate collections that celebrate traditional weaving techniques while embracing modern sophistication and comfort.'}
              {storeMode === 'jewellery' && 'Experience exquisite ornaments from Anand Jewellars. We curate collections that celebrate traditional craftsmanship while embracing modern sophistication and timeless brilliance.'}
            </p>
          </motion.div>
        </section>

        {/* Jewellery Categories */}
        {storeMode === 'jewellery' && (
          <section className="py-12 md:py-20 px-4 md:px-12 max-w-7xl mx-auto border-t border-brand-ink/10">
            <div className="text-center mb-12">
              <h3 className="font-serif text-2xl md:text-4xl mb-3">Shop by Category</h3>
              <div className="w-12 h-px bg-brand-gold mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { name: 'Gold', image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=600&auto=format&fit=crop' },
                { name: 'Silver', image: 'https://static.wixstatic.com/media/b69f5d_07a8d811cd4b4a21b3af31e4bbdcef6b~mv2.jpg/v1/fill/w_1000,h_1000,al_c,q_85,usm_0.66_1.00_0.01/b69f5d_07a8d811cd4b4a21b3af31e4bbdcef6b~mv2.jpg' },
                { name: 'Bridal', image: 'https://i.pinimg.com/originals/9f/04/f3/9f04f36ab336cc562381a07293611dfc.jpg' },
                { name: 'Rings', image: 'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?cs=srgb&dl=pexels-martabranco-1395306.jpg&fm=jpg' }
              ].map((cat) => (
                <button 
                  key={cat.name}
                  onClick={() => {
                    setDepartment(cat.name as any);
                    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group relative aspect-[4/5] overflow-hidden flex items-center justify-center"
                >
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                  <div className="relative z-10 bg-brand-bg/90 backdrop-blur-sm px-6 py-3 border border-brand-gold/30 group-hover:border-brand-gold transition-colors">
                    <span className="font-serif text-lg md:text-xl text-brand-ink">{cat.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Shop / Filter Section */}
        <section id="shop" className="py-12 md:py-20 px-4 md:px-12 max-w-7xl mx-auto border-t border-brand-ink/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
            <div>
              <h3 className="font-serif text-2xl md:text-4xl mb-3">Curated Collection</h3>
              <div className="w-12 h-px bg-brand-gold mb-6"></div>
              
              {storeMode === 'clothing' && (
                <div className="flex gap-4 md:gap-8 text-xs uppercase tracking-widest font-medium overflow-x-auto pb-2">
                  {['All', 'Men', 'Women', 'Kids'].map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setDepartment(dept as any)}
                      className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${department === dept ? 'border-brand-gold text-brand-gold' : 'border-transparent text-brand-ink/60 hover:text-brand-ink'}`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
              {storeMode === 'jewellery' && (
                <div className="flex gap-4 md:gap-8 text-xs uppercase tracking-widest font-medium overflow-x-auto pb-2">
                  {['All', 'Gold', 'Silver', 'Bridal', 'Rings'].map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setDepartment(dept as any)}
                      className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${department === dept ? 'border-brand-gold text-brand-gold' : 'border-transparent text-brand-ink/60 hover:text-brand-ink'}`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-sm w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-brand-ink/10 pt-4 md:pt-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-gold" />
                <span className="uppercase tracking-widest text-brand-ink/60 text-[10px] md:text-xs">Sort By:</span>
              </div>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-b border-brand-ink/20 text-brand-ink py-1 pr-6 focus:outline-none focus:border-brand-gold cursor-pointer appearance-none uppercase tracking-widest text-[10px] md:text-xs"
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D4AF37'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, 
                    backgroundPosition: 'right center', 
                    backgroundRepeat: 'no-repeat', 
                    backgroundSize: '1em' 
                  }}
                >
                  <option value="featured" className="bg-brand-surface">Featured</option>
                  <option value="newest" className="bg-brand-surface">New Arrivals</option>
                  <option value="bestsellers" className="bg-brand-surface">Bestsellers</option>
                  <option value="price-asc" className="bg-brand-surface">Price: Low to High</option>
                  <option value="price-desc" className="bg-brand-surface">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  reviews={reviews[product.id] || []}
                  isSaved={wishlist.includes(product.id)}
                  onSelect={(p) => {
                    setSelectedProduct(p);
                    setSelectedImageIndex(0);
                    const defaultVariants: Record<string, string> = {};
                    if (p.variants) {
                      p.variants.forEach(v => {
                        defaultVariants[v.name] = v.options[0];
                      });
                    }
                    setSelectedVariants(defaultVariants);
                  }}
                  onToggleWishlist={toggleWishlist}
                  onAddToCart={addToCart}
                />
              ))}
            </AnimatePresence>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-brand-ink/50">
              <p>No products found in this category.</p>
            </div>
          )}
        </section>



        {/* Marquee Section */}
        <section className="py-6 md:py-8 border-y border-brand-ink/10 overflow-hidden bg-brand-bg text-brand-gold">
          <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                {storeMode === 'clothing' && (
                  <>
                    <span className="font-serif text-2xl md:text-3xl italic px-6 md:px-8">Harsh Cloth Imporium</span>
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-brand-ink/20"></span>
                  </>
                )}
                {storeMode === 'jewellery' && (
                  <>
                    <span className="font-serif text-2xl md:text-3xl italic px-6 md:px-8">Anand Jewellars</span>
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-brand-ink/20"></span>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
          </>
        ) : currentView === 'wishlist' ? (
          <section className="py-12 md:py-20 px-4 md:px-12 max-w-7xl mx-auto min-h-[60vh]">
            <h2 className="font-serif text-3xl md:text-5xl mb-8">My Wishlist</h2>
            {wishlist.length === 0 ? (
              <div className="text-center py-20 bg-brand-surface border border-brand-ink/10">
                <Heart className="w-12 h-12 text-brand-ink/20 mx-auto mb-4" />
                <p className="text-brand-ink/60 mb-6">Your wishlist is empty.</p>
                <button onClick={() => setCurrentView('home')} className="bg-brand-gold text-brand-bg px-8 py-3 text-xs uppercase tracking-widest font-medium hover:bg-brand-ink hover:text-brand-gold transition-colors">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
                <AnimatePresence mode="popLayout">
                  {PRODUCTS.filter(p => wishlist.includes(p.id)).map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      reviews={reviews[product.id] || []}
                      isSaved={wishlist.includes(product.id)}
                      onSelect={(p) => {
                        setSelectedProduct(p);
                        setSelectedImageIndex(0);
                        const defaultVariants: Record<string, string> = {};
                        if (p.variants) {
                          p.variants.forEach(v => {
                            defaultVariants[v.name] = v.options[0];
                          });
                        }
                        setSelectedVariants(defaultVariants);
                      }}
                      onToggleWishlist={toggleWishlist}
                      onAddToCart={addToCart}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        ) : currentView === 'profile' && user ? (
          <section className="py-12 md:py-20 px-4 md:px-12 max-w-3xl mx-auto min-h-[60vh]">
            <h2 className="font-serif text-3xl md:text-5xl mb-8">My Profile</h2>
            <div className="bg-brand-surface border border-brand-ink/10 p-6 md:p-10">
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-brand-ink/10">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-20 h-20 rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-brand-gold text-brand-bg flex items-center justify-center text-3xl font-serif">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <h3 className="font-serif text-2xl text-brand-ink">{profileData.displayName || user.displayName || 'User'}</h3>
                  <p className="text-sm text-brand-ink/60 mt-1">{user.email}</p>
                </div>
              </div>

              {isEditingProfile ? (
                <form onSubmit={saveProfile} className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-brand-ink/60 mb-2">Display Name</label>
                    <input 
                      type="text" 
                      value={profileData.displayName}
                      onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                      className="w-full bg-brand-bg border border-brand-ink/20 px-4 py-3 text-sm text-brand-ink focus:outline-none focus:border-brand-gold transition-colors"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-brand-ink/60 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full bg-brand-bg border border-brand-ink/20 px-4 py-3 text-sm text-brand-ink focus:outline-none focus:border-brand-gold transition-colors"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-brand-ink/60 mb-2">Delivery Address</label>
                    <textarea 
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      className="w-full bg-brand-bg border border-brand-ink/20 px-4 py-3 text-sm text-brand-ink focus:outline-none focus:border-brand-gold transition-colors min-h-[100px] resize-y"
                      placeholder="Enter your full delivery address"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="submit" 
                      disabled={isSavingProfile}
                      className="bg-brand-gold text-brand-bg px-8 py-3 text-xs uppercase tracking-widest font-medium hover:bg-brand-ink hover:text-brand-gold transition-colors disabled:opacity-50"
                    >
                      {isSavingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsEditingProfile(false)}
                      className="border border-brand-ink/20 text-brand-ink px-8 py-3 text-xs uppercase tracking-widest font-medium hover:border-brand-ink transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-brand-ink/60 mb-1">Display Name</p>
                      <p className="text-brand-ink">{profileData.displayName || user.displayName || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-brand-ink/60 mb-1">Email Address</p>
                      <p className="text-brand-ink">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-brand-ink/60 mb-1">Phone Number</p>
                      <p className="text-brand-ink">{profileData.phone || 'Not provided'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-[10px] uppercase tracking-widest text-brand-ink/60 mb-1">Delivery Address</p>
                      <p className="text-brand-ink whitespace-pre-line">{profileData.address || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-brand-ink/10">
                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      className="border border-brand-gold text-brand-gold px-8 py-3 text-xs uppercase tracking-widest font-medium hover:bg-brand-gold hover:text-brand-bg transition-colors"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : currentView === 'orders' && user ? (
          <section className="py-12 md:py-20 px-4 md:px-12 max-w-5xl mx-auto min-h-[60vh]">
            <h2 className="font-serif text-3xl md:text-5xl mb-8">Order History</h2>
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-brand-surface border border-brand-ink/10">
                <ShoppingBag className="w-12 h-12 text-brand-ink/20 mx-auto mb-4" />
                <p className="text-brand-ink/60 mb-6">You haven't placed any orders yet.</p>
                <button onClick={() => setCurrentView('home')} className="bg-brand-gold text-brand-bg px-8 py-3 text-xs uppercase tracking-widest font-medium hover:bg-brand-ink hover:text-brand-gold transition-colors">
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {orders.map(order => (
                  <div key={order.id} className="bg-brand-surface border border-brand-ink/10 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-brand-ink/10 gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-brand-ink/60 mb-1">Order Placed</p>
                        <p className="text-sm font-medium text-brand-ink">
                          {order.createdAt ? new Date(order.createdAt.toMillis()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Processing...'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-brand-ink/60 mb-1">Total Amount</p>
                        <p className="text-sm font-medium text-brand-ink">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-brand-ink/60 mb-1">Order ID</p>
                        <p className="text-sm font-medium text-brand-ink">{order.id}</p>
                      </div>
                      <div>
                        <span className="inline-block px-3 py-1 bg-brand-gold/10 text-brand-gold text-[10px] uppercase tracking-widest font-medium">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {(order.items || []).map((item: any, idx: number) => {
                        const product = PRODUCTS.find(p => p.id === item.productId);
                        if (!product) return null;
                        return (
                          <div key={idx} className="flex gap-4 md:gap-6">
                            <img src={product.image} alt={product.name} className="w-20 h-24 md:w-24 md:h-32 object-cover" referrerPolicy="no-referrer" />
                            <div className="flex-grow">
                              <h4 className="font-serif text-lg md:text-xl text-brand-ink">{product.name}</h4>
                              <p className="text-sm text-brand-ink/70 mt-1">₹{product.price.toLocaleString('en-IN')}</p>
                              {item.variants && Object.entries(item.variants).map(([key, val]) => (
                                <p key={key} className="text-[10px] uppercase tracking-widest text-brand-ink/50 mt-1">{key}: {val as string}</p>
                              ))}
                              <p className="text-xs text-brand-ink/80 mt-3">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : currentView === 'about' ? (
          <section className="py-16 md:py-24 px-6 md:px-12 max-w-4xl mx-auto min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-4xl md:text-6xl mb-6">Our Story</h2>
              <div className="w-16 h-px bg-brand-gold mx-auto"></div>
            </motion.div>
            
            <div className="space-y-12 md:space-y-20 text-brand-ink/80 leading-relaxed">
              <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl mb-4 text-brand-ink">A Legacy of Craftsmanship</h3>
                  <p className="mb-4">
                    Founded with a passion for preserving traditional artistry, {brandInfo.title} has grown from a small family atelier into a premier destination for luxury fashion and exquisite jewellery.
                  </p>
                  <p>
                    For generations, we have worked closely with master artisans across India, ensuring that every thread woven and every stone set carries the weight of history and the brilliance of modern design.
                  </p>
                </div>
                <div className="aspect-[4/5] bg-brand-surface relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800&auto=format&fit=crop" 
                    alt="Craftsmanship" 
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="aspect-[4/5] bg-brand-surface relative overflow-hidden order-2 md:order-1">
                  <img 
                    src="https://images.unsplash.com/photo-1571867424488-4565932edb41?q=80&w=800&auto=format&fit=crop" 
                    alt="Our Ethos" 
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="font-serif text-2xl md:text-3xl mb-4 text-brand-ink">Our Ethos</h3>
                  <p className="mb-4">
                    We believe that true luxury lies in authenticity and sustainability. Our commitment extends beyond aesthetics to the ethical sourcing of materials and the fair treatment of our artisans.
                  </p>
                  <p>
                    Whether you are exploring our curated clothing lines or our bespoke bridal jewellery, you are experiencing a piece of art that was created with integrity, passion, and an unwavering dedication to quality.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="bg-brand-surface pt-16 md:pt-20 pb-8 md:pb-10 px-6 md:px-12 border-t border-brand-ink/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
          <div className="sm:col-span-2">
            <h2 className="font-serif text-2xl md:text-3xl mb-2 text-brand-gold">{brandInfo.title}</h2>
            <p className="text-[10px] md:text-xs uppercase tracking-widest text-brand-ink/60 mb-4 md:mb-6">{brandInfo.sub}</p>
            <p className="text-sm text-brand-ink/70 max-w-sm leading-relaxed">
              {storeMode === 'clothing' && 'Your premier destination for luxury clothing. We bring elegance and style to your everyday life.'}
              {storeMode === 'jewellery' && 'Your premier destination for exquisite jewellery. We bring brilliance and timeless beauty to your everyday life.'}
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] md:text-xs uppercase tracking-widest font-semibold mb-4 md:mb-6 text-brand-gold">Explore</h4>
            <ul className="space-y-3 md:space-y-4 text-sm text-brand-ink/80">
              <li><a href="#" className="hover:text-brand-gold transition-colors">New Arrivals</a></li>
              <li><a href="#shop" className="hover:text-brand-gold transition-colors">Shop All</a></li>
              <li><a href="#collections" className="hover:text-brand-gold transition-colors">Collections</a></li>
              <li><button onClick={() => { setCurrentView('about'); window.scrollTo(0,0); }} className="hover:text-brand-gold transition-colors">Our Story</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] md:text-xs uppercase tracking-widest font-semibold mb-4 md:mb-6 text-brand-gold">Visit Us</h4>
            <ul className="space-y-3 md:space-y-4 text-sm text-brand-ink/80">
              <li>Ambedkar Nagar</li>
              <li>Uttar Pradesh, India</li>
              <li className="pt-2 md:pt-4"><a href="mailto:harshgupta07h@gmail.com" className="hover:text-brand-gold transition-colors break-all">harshgupta07h@gmail.com</a></li>
              <li>+91 88758 10604</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-6 md:pt-8 border-t border-brand-ink/10 text-[10px] md:text-xs text-brand-ink/50 uppercase tracking-wider gap-4 md:gap-0">
          <p className="text-center md:text-left">&copy; {new Date().getFullYear()} {brandInfo.title}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-ink transition-colors">Instagram</a>
            <a href="#" className="hover:text-brand-ink transition-colors">Facebook</a>
            <a href="#" className="hover:text-brand-ink transition-colors">Pinterest</a>
          </div>
        </div>
      </footer>

      {/* Product Details & Reviews Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-8"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-surface border-t md:border border-brand-ink/20 w-full max-w-5xl h-[90vh] md:h-auto md:max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col md:flex-row shadow-2xl relative rounded-t-2xl md:rounded-none"
            >
              {/* Mobile Drag Handle */}
              <div className="w-full flex justify-center py-3 md:hidden absolute top-0 left-0 z-20 bg-gradient-to-b from-black/50 to-transparent">
                <div className="w-12 h-1.5 bg-white/30 rounded-full"></div>
              </div>

              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-30 p-2 bg-brand-bg/80 hover:bg-brand-bg rounded-full text-brand-ink transition-colors backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left: Product Image Gallery */}
              <div className="w-full md:w-1/2 flex flex-col bg-brand-bg relative group/gallery">
                <div className="w-full aspect-[3/4] md:aspect-auto md:h-[800px] relative">
                  <img 
                    src={selectedProduct.images?.[selectedImageIndex] || selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Navigation Arrows */}
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-4 opacity-100 md:opacity-0 md:group-hover/gallery:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <button 
                        onClick={() => setSelectedImageIndex(prev => prev === 0 ? selectedProduct.images!.length - 1 : prev - 1)}
                        className="w-10 h-10 rounded-full bg-white/80 text-brand-ink flex items-center justify-center hover:bg-white transition-colors shadow-sm pointer-events-auto"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setSelectedImageIndex(prev => prev === selectedProduct.images!.length - 1 ? 0 : prev + 1)}
                        className="w-10 h-10 rounded-full bg-white/80 text-brand-ink flex items-center justify-center hover:bg-white transition-colors shadow-sm pointer-events-auto"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
                {/* Thumbnails */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="flex justify-center flex-wrap gap-3 md:gap-4 p-4 md:p-6 bg-brand-bg border-t border-brand-ink/5">
                    {selectedProduct.images.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative w-16 h-20 md:w-20 md:h-24 flex-shrink-0 transition-all overflow-hidden rounded-sm ${selectedImageIndex === idx ? 'ring-2 ring-brand-gold opacity-100 scale-105 shadow-md z-10' : 'opacity-50 hover:opacity-100'}`}
                      >
                        <img src={img} alt={`${selectedProduct.name} view ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Details & Reviews */}
              <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col max-h-[800px] overflow-y-auto custom-scrollbar">
                <div className="mb-6 md:mb-8 border-b border-brand-ink/10 pb-6 md:pb-8">
                  <nav className="flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-widest mb-4 text-brand-ink/60">
                    <button 
                      onClick={() => { setSelectedProduct(null); setCurrentView('home'); }}
                      className="hover:text-brand-gold transition-colors"
                    >
                      Home
                    </button>
                    <span>/</span>
                    <button 
                      onClick={() => { 
                        setSelectedProduct(null); 
                        setCurrentView('home');
                        setStoreMode(selectedProduct.category.toLowerCase() as StoreMode);
                      }}
                      className="hover:text-brand-gold transition-colors"
                    >
                      {selectedProduct.category}
                    </button>
                    <span>/</span>
                    <span className="text-brand-gold truncate max-w-[120px] md:max-w-[200px]">{selectedProduct.name}</span>
                  </nav>
                  <h2 className="font-serif text-2xl md:text-4xl text-brand-ink mb-3 md:mb-4">{selectedProduct.name}</h2>
                  <p className="text-lg md:text-xl tracking-wider text-brand-ink/90 mb-4 md:mb-6">₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-brand-ink/70 leading-relaxed mb-6">{selectedProduct.description}</p>
                  
                  {/* Variants */}
                  {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                    <div className="space-y-4 mb-8">
                      {selectedProduct.variants.map((variant) => (
                        <div key={variant.name}>
                          <p className="text-[10px] md:text-xs uppercase tracking-widest text-brand-ink/60 mb-2">{variant.name}</p>
                          <div className="flex flex-wrap gap-2">
                            {variant.options.map((option) => (
                              <button
                                key={option}
                                onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: option }))}
                                className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
                                  selectedVariants[variant.name] === option 
                                    ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' 
                                    : 'border-brand-ink/20 text-brand-ink hover:border-brand-gold/50'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={(e) => addToCart(e, selectedProduct.id, selectedVariants)}
                      className="flex-1 bg-brand-gold text-brand-bg px-6 py-3 text-xs uppercase tracking-widest font-medium hover:bg-brand-ink hover:text-brand-gold transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={(e) => toggleWishlist(e, selectedProduct.id)}
                      className="flex-1 flex items-center justify-center gap-2 border border-brand-gold text-brand-gold px-6 py-3 text-xs uppercase tracking-widest font-medium hover:bg-brand-gold hover:text-brand-bg transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${wishlist.includes(selectedProduct.id) ? 'fill-current' : ''}`} />
                      {wishlist.includes(selectedProduct.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}
                    </button>
                    <div className="flex items-center justify-center">
                      <ShareMenu 
                        product={selectedProduct} 
                        className="relative"
                        iconClassName="border border-brand-ink/20 hover:border-brand-gold text-brand-ink hover:text-brand-gold"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
                    <div>
                      <h3 className="font-serif text-xl md:text-2xl mb-2 flex items-center gap-3">
                        Customer Reviews
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          {renderStars(
                            (reviews[selectedProduct.id] || []).length > 0
                              ? (reviews[selectedProduct.id] || []).reduce((sum, r) => sum + r.rating, 0) / (reviews[selectedProduct.id] || []).length
                              : 0
                          )}
                        </div>
                        <span className="text-xs md:text-sm text-brand-ink/70">
                          {((reviews[selectedProduct.id] || []).length > 0 ? ((reviews[selectedProduct.id] || []).reduce((sum, r) => sum + r.rating, 0) / (reviews[selectedProduct.id] || []).length).toFixed(1) : '0.0')} out of 5
                        </span>
                        <span className="text-xs md:text-sm text-brand-ink/50">
                          ({(reviews[selectedProduct.id] || []).length} reviews)
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const formElement = document.getElementById('review-form');
                        if (formElement) {
                          formElement.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="border border-brand-gold text-brand-gold px-4 py-2 text-xs uppercase tracking-widest font-medium hover:bg-brand-gold hover:text-brand-bg transition-colors self-start sm:self-auto"
                    >
                      Write a Review
                    </button>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4 md:space-y-6 mb-8 md:mb-10 max-h-[250px] md:max-h-[300px] overflow-y-auto pr-2 md:pr-4 custom-scrollbar">
                    {(reviews[selectedProduct.id] || []).length === 0 ? (
                      <p className="text-sm text-brand-ink/50 italic">No reviews yet. Be the first to review this piece.</p>
                    ) : (
                      (reviews[selectedProduct.id] || []).map(review => (
                        <div key={review.id} className="bg-brand-bg/50 p-4 rounded-sm border border-brand-ink/5">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-sm font-medium text-brand-ink">{review.author}</p>
                              <p className="text-[10px] text-brand-ink/40 mt-0.5">{review.date}</p>
                            </div>
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-sm text-brand-ink/80 leading-relaxed mt-3">{review.comment}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Write a Review Form */}
                  <div id="review-form" className="bg-brand-bg p-5 md:p-6 border border-brand-ink/10">
                    <h4 className="text-[10px] md:text-sm uppercase tracking-widest font-medium text-brand-gold mb-4 md:mb-6">Write a Review</h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-4 md:space-y-5">
                      <div>
                        <label className="block text-[10px] md:text-xs uppercase tracking-wider text-brand-ink/60 mb-2">Rating</label>
                        {renderStars(reviewForm.rating, true, (star) => setReviewForm(prev => ({ ...prev, rating: star })))}
                      </div>
                      <div>
                        <input 
                          type="text" 
                          placeholder="Your Name" 
                          value={reviewForm.author}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, author: e.target.value }))}
                          className="w-full bg-transparent border-b border-brand-ink/20 py-2 text-sm text-brand-ink focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-ink/30"
                          required
                        />
                      </div>
                      <div>
                        <textarea 
                          placeholder="Share your thoughts about this piece..." 
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                          className="w-full bg-transparent border-b border-brand-ink/20 py-2 text-sm text-brand-ink focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-ink/30 resize-none h-20"
                          required
                        />
                      </div>
                      <button 
                        type="submit"
                        className="bg-brand-gold text-brand-bg text-[10px] md:text-xs uppercase tracking-widest px-6 md:px-8 py-3 font-medium hover:bg-brand-ink hover:text-brand-gold transition-colors w-full md:w-auto"
                      >
                        Submit Review
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] bg-brand-ink text-brand-bg px-6 py-3 shadow-2xl flex items-center gap-3 text-xs md:text-sm uppercase tracking-widest whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4 text-brand-gold" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(248, 249, 250, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}} />
    </div>
  );
}
