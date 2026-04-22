import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Search, ShoppingBag, ArrowRight, SlidersHorizontal, Star, X, User as UserIcon, Heart, Share2, Facebook, Twitter, ChevronLeft, ChevronRight, Sun, Moon, ShieldCheck, Truck, RefreshCw, Headphones, ShoppingCart, PackageOpen, MapPin, Phone, Mail, Clock, Sparkles, Trash2, CreditCard, Banknote, Smartphone } from 'lucide-react';

import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';
import { ImageZoom } from './components/ImageZoom';

// Mock Data for the store
export type ProductVariant = {
  name: string;
  options: string[];
};

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin?: boolean;
  photoURL?: string;
}

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
  material?: string;
  occasion?: string;
  variants?: ProductVariant[];
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type OrderItem = {
  productId: string;
  quantity: number;
  variants?: Record<string, string>;
};

export type Order = {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt?: any;
};

export const PRODUCTS: Product[] = [
  {
    "id": "c1",
    name: 'Smocked strappy dress',
    category: 'Clothing',
    department: 'Women',
    price: 1800,
    image: 'https://image.hm.com/assets/hm/e4/e3/e4e3a52016071db7561418f47646037827e44bc7.jpg?imwidth=2160',
    images: [
      'https://image.hm.com/assets/hm/fe/51/fe518e61ec358ce58cad5bba0d61ca4a1efe1adf.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/1e/f8/1ef8ae431836ce609b5f1a5e5116ceed5b831fb9.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/1d/e9/1de9c7f11cbd002542733f626e7aeea89b82b90d.jpg?imwidth=2160'
    ],
    "isNew": false,
    "sales": 68,
    "description": "Elevate your wardrobe with the stunning Smocked strappy dress. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "c2",
    "name": "Women Bodycon Black Midi/Calf Length Dress",
    "category": "Clothing",
    "department": "Women",
    "price": 1500,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/dress/g/m/1/m-338tk10091a-selvia-original-imahgkfasxncjxf2.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/dress/g/m/1/m-338tk10091a-selvia-original-imahgkfasxncjxf2.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/dress/8/b/l/m-338tk10091a-selvia-original-imahgkfaz7hztpfz.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/dress/g/e/q/m-338tk10091a-selvia-original-imahgkfaghmstykh.jpeg?q=90'
    ],
    "isNew": false,
    "sales": 135,
    "description": "Elevate your wardrobe with the stunning Women Bodycon Black Midi/Calf Length Dress. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "c3",
    "name": "Fit and Flare Black Below Knee Dress",
    "category": "Clothing",
    "department": "Women",
    "price": 2999,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/dress/1/k/x/xl-dnvc1190-chaukas-original-imahhhhg2yzazfym.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/dress/r/8/1/5xl-dnvc1190-chaukas-original-imahhhhgx4zzenrk.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/dress/0/5/2/xl-dnvc1190-chaukas-original-imahhhhgstus7ttf.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/dress/h/o/m/xl-dnvc1190-chaukas-original-imahhhhgbhjupqfa.jpeg?q=90'
    ],
    "isNew": true,
    "sales": 698,
    "description": "Elevate your wardrobe with the stunning Fit and Flare Black Below Knee Dress. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "c4",
    "name": "Women Maxi Multicolor Full Length Dress",
    "category": "Clothing",
    "department": "Women",
    "price": 1977,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/dress/b/n/6/xl-women-fit-and-flare-multicolor-dress-qena-original-imah4y6ghygejysr.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/dress/b/n/6/xl-women-fit-and-flare-multicolor-dress-qena-original-imah4y6ghygejysr.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/dress/f/h/c/xl-women-fit-and-flare-multicolor-dress-qena-original-imah4y6gakrhgjpa.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/dress/q/i/y/xl-women-fit-and-flare-multicolor-dress-qena-original-imah4y6gyhdzy3bh.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/dress/z/d/u/xl-women-fit-and-flare-multicolor-dress-qena-original-imah4y6ghspqsmga.jpeg?q=90'
    ],
    "isNew": false,
    "sales": 618,
    "description": "Elevate your wardrobe with the stunning Women Maxi Multicolor Full Length Dress. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "c5",
    "name": "Embellished, Solid/Plain",
    "category": "Clothing",
    "department": "Women",
    "price": 3924,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/sari/u/p/2/free-nc-satin-3-desty-unstitched-original-imahh2tgwythf3cx.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/sari/u/p/2/free-nc-satin-3-desty-unstitched-original-imahh2tgwythf3cx.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/sari/a/p/b/free-nc-satin-3-desty-unstitched-original-imahh2tgr6pg2fqc.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/sari/v/w/q/free-fandy-vivan-fab-unstitched-original-imahgzzh6vyqbzsw.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/sari/1/f/k/free-fandy-vivan-fab-unstitched-original-imahgzzhpzjyysc5.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/sari/6/p/7/free-fandy-vivan-fab-unstitched-original-imahgzzhhtypjznu.jpeg?q=90'
    ],
    "isNew": false,
    "sales": 42,
    "description": "Elevate your wardrobe with the stunning Embellished, Solid/Plain. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "c6",
    "name": "Self Design Georgette Saree",
    "category": "Clothing",
    "department": "Women",
    "price": 5214,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/shopsy-sari/q/k/5/free-new-swiroski-daimond-hotfix-saree-diamond-saree-lichi-soft-original-imahfh3cavexahch.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/shopsy-sari/q/k/5/free-new-swiroski-daimond-hotfix-saree-diamond-saree-lichi-soft-original-imahfh3cavexahch.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/sari/s/i/o/free-hotfix-sadi-for-women-new-swiroski-diamond-also-hotfix-work-original-imaheb4ymbzbhypg.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/shopsy-sari/s/g/v/free-new-swiroski-daimond-hotfix-saree-diamond-saree-lichi-soft-original-imahfh3ch7wpcggz.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/shopsy-sari/8/3/y/free-new-swiroski-daimond-hotfix-saree-diamond-saree-lichi-soft-original-imahfh3czfbryp8x.jpeg?q=90'
    ],
    "isNew": true,
    "sales": 413,
    "description": "Elevate your wardrobe with the stunning Self Design Georgette Saree. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "c7",
    "name": "Deklook Women Self Design Flared Green Skirt",
    "category": "Clothing",
    "department": "Women",
    "price": 1155,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/skirt/p/3/f/30-1-d777-black-deklook-original-imahgyfjnkvnq9gt.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/skirt/p/3/f/30-1-d777-black-deklook-original-imahgyfjnkvnq9gt.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/skirt/i/y/q/28-1-d777-black-deklook-original-imahgyfjpnna7qzn.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/skirt/z/f/g/28-1-d777-black-deklook-original-imahgyfjfhss27xy.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/skirt/2/4/e/28-1-d777-black-deklook-original-imahgyfjmt67b73h.jpeg?q=90',
    ],
    "isNew": false,
    "sales": 34,
    "description": "Elevate your wardrobe with the stunning Deklook Women Self Design Flared Green Skirt. Expertly crafted from premium cotton Blend, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton Blend",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "c8",
    "name": "Vestis Women Solid Pencil Blue Skirt",
    "category": "Clothing",
    "department": "Women",
    "price": 1848,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/skirt/o/u/j/28-1-28-ak-fashion-original-imahga95thybgtxg.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/skirt/o/u/j/28-1-28-ak-fashion-original-imahga95thybgtxg.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/skirt/v/l/u/28-1-28-ak-fashion-original-imahga95wp9xxnkh.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/skirt/f/r/d/28-1-28-vestis-original-imahh3zwvx2hwdpc.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/skirt/q/o/m/28-1-28-vestis-original-imahh3zwhghr8re9.jpeg?q=90'
    ],
    "isNew": false,
    "sales": 558,
    "description": "Elevate your wardrobe with the stunning Vestis Women Solid Pencil Blue Skirt. Expertly crafted from premium Jeans, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "Jeans",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "c9",
    "name": "Sahaj Women Printed Wrap Around Multicolor Skirt",
    "category": "Clothing",
    "department": "Women",
    "price": 1145,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/skirt/s/e/c/free-1-jaipuri-print-warp-around-cotton-repar-skirt-for-women-original-imahm6bgsu2ghx74.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/skirt/s/e/c/free-1-jaipuri-print-warp-around-cotton-repar-skirt-for-women-original-imahm6bgsu2ghx74.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/skirt/h/9/2/free-1-jaipuri-print-warp-around-cotton-repar-skirt-for-women-original-imahm6bgczxzqzgn.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/skirt/p/h/x/free-1-jaipuri-print-warp-around-cotton-repar-skirt-for-women-original-imahm6bgmr2s9j3u.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/skirt/i/c/n/free-1-jaipuri-print-warp-around-cotton-repar-skirt-for-women-original-imahm6bgbpcymsje.jpeg?q=90'
    ],
    "isNew": false,
    "sales": 337,
    "description": "Elevate your wardrobe with the stunning Sahaj Women Printed Wrap Around Multicolor Skirt. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "c10",
    "name": "PEDR TRENDS Embroidered Semi Stitched Lehenga Choli ",
    "category": "Clothing",
    "department": "Women",
    "price": 3665,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/lehenga-choli/e/g/b/free-full-sleeve-lengha-18-pedr-trends-original-imahm9sgdhkrteak.jpeg?q=90",
    "images": [
     'https://rukminim1.flixcart.com/image/1280/1280/xif0q/lehenga-choli/e/g/b/free-full-sleeve-lengha-18-pedr-trends-original-imahm9sgdhkrteak.jpeg?q=90',
     'https://rukminim1.flixcart.com/image/1280/1280/xif0q/lehenga-choli/f/k/p/free-full-sleeve-lengha-18-pedr-trends-original-imahm9sgpqbtzsr3.jpeg?q=90',
     'https://rukminim1.flixcart.com/image/1280/1280/xif0q/lehenga-choli/y/o/n/free-full-sleeve-lengha-18-pedr-trends-original-imahm9sgvfzefbht.jpeg?q=90',
     
    ],
    "isNew": false,
    "sales": 456,
    "description": "Elevate your wardrobe with the stunning PEDR TRENDS Embroidered Semi Stitched Lehenga Choli . Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "c11",
    "name": "GSH Men Straight Fit Mid Rise Dark Blue Jeans",
    "category": "Clothing",
    "department": "Men",
    "price": 4001,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/jean/n/p/p/30-mens-jeans-001-gsh-original-imahmcvubwph23gh.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/jean/n/p/p/30-mens-jeans-001-gsh-original-imahmcvubwph23gh.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/jean/y/z/b/30-mens-jeans-001-gsh-original-imahmcvuhfubfbyq.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/jean/y/e/9/32-mens-jeans-001-gsh-original-imahmcvv7893kck3.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/jean/6/l/0/30-mens-jeans-001-gsh-original-imahmcvvcn4rcxcf.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/jean/r/m/h/34-mens-jeans-001-gsh-original-imahmcvv8gtfumaz.jpeg?q=90'
    ],
    "isNew": true,
    "sales": 604,
    "description": "Elevate your wardrobe with the stunning GSH Men Straight Fit Mid Rise Dark Blue Jeans. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "28",
          "30",
          "32",
          "34"
        ]
      }
    ]
  },
  {
    "id": "c12",
    "name": "Men Regular Mid Rise Black Jeans",
    "category": "Clothing",
    "department": "Men",
    "price": 3074,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/jean/n/l/i/28-mr-dmg-hvy-kazamajeans-original-imah9b5xkcc6ura3.jpeg?q=90",
    "images": [
    'https://rukminim1.flixcart.com/image/1280/1280/xif0q/jean/n/l/i/28-mr-dmg-hvy-kazamajeans-original-imah9b5xkcc6ura3.jpeg?q=90',
    'https://rukminim1.flixcart.com/image/1280/1280/xif0q/jean/e/i/p/32-mr-dmg-hvy-kazamajeans-original-imah9bfdvjv7ahvf.jpeg?q=90',
    'https://rukminim1.flixcart.com/image/1280/1280/xif0q/jean/4/n/k/30-mr-dmg-hvy-kazamajeans-original-imah9bfdphbmgu35.jpeg?q=90',
    'https://rukminim1.flixcart.com/image/1280/1280/xif0q/jean/j/i/y/32-mr-dmg-hvy-kazamajeans-original-imah9bfdqasb7wsp.jpeg?q=90'
    ],
    "isNew": false,
    "sales": 65,
    "description": "Elevate your wardrobe with the stunning Men Regular Mid Rise Black Jeans. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "28",
          "30",
          "32",
          "34"
        ]
      }
    ]
  },
  {
    "id": "VTEXX Men Regular Fit Solid Spread Collar Formal Shirt",
    "name": "VTEXX Men Regular Fit Solid Spread Collar Formal Shirt",
    "category": "Clothing",
    "department": "Men",
    "price": 3742,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/shirt/3/2/7/3xl-16lst-mstrd-vtexx-original-imah8sgztpp232gj.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/shirt/3/2/7/3xl-16lst-mstrd-vtexx-original-imah8sgztpp232gj.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/shirt/i/u/e/3xl-16lst-mstrd-vtexx-original-imah8sgzaczjhggg.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/shirt/a/t/z/3xl-16lst-mstrd-vtexx-original-imah8sgzz3v9dhxc.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/shirt/4/a/z/3xl-16lst-mstrd-vtexx-original-imah8sgzqbgagfeu.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/shirt/n/t/4/3xl-16lst-mstrd-vtexx-original-imah8sgzkcx5aygw.jpeg?q=90'
    ],
    "isNew": true,
    "sales": 705,
    "description": "Elevate your wardrobe with the stunning VTEXX Men Regular Fit Solid Spread Collar Formal Shirt. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "Livitro Men Slim Fit Graphic Print Slim Collar Formal Shirt",
    "name": "Livitro Men Slim Fit Graphic Print Slim Collar Formal Shirt",
    "category": "Clothing",
    "department": "Men",
    "price": 2950,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/shirt/0/0/z/s-light-blue-livitro-original-imahjv2gtaymzqsj.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/shirt/0/0/z/s-light-blue-livitro-original-imahjv2gtaymzqsj.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/shirt/f/y/z/s-light-blue-livitro-original-imahjv2gkapjuhfy.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/shirt/d/z/t/s-light-blue-livitro-original-imahjv2g7ygd7gb2.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/shirt/c/q/b/s-light-blue-livitro-original-imahjv2gemphhsnu.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/shirt/c/e/6/s-light-blue-livitro-original-imahjv2gcrbjun6z.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/shirt/k/f/u/s-light-blue-livitro-original-imahjv2gd5pwbygn.jpeg?q=90'
    ],
    "isNew": false,
    "sales": 702,
    "description": "Elevate your wardrobe with the stunning Livitro Men Slim Fit Graphic Print Slim Collar Formal Shirt. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "Rabhya Fashion Men Solid, Self Design, Striped Red Track Pants",
    "name": "Rabhya Fashion Men Solid, Self Design, Striped Red Track Pants",
    "category": "Clothing",
    "department": "Men",
    "price": 2271,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/track-pant/s/x/v/xl-rf-tp-str-red-rabhya-fashion-original-imahm9rkjtg3zt4f.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/track-pant/s/x/v/xl-rf-tp-str-red-rabhya-fashion-original-imahm9rkjtg3zt4f.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/track-pant/9/r/r/xl-rf-tp-str-red-rabhya-fashion-original-imahm9rkrv32xhh7.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/track-pant/e/n/n/xl-rf-tp-str-red-rabhya-fashion-original-imahm9rkppdfxgrm.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/track-pant/r/p/u/l-rf-tp-str-red-rabhya-fashion-original-imahm9rkthafsrf2.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/track-pant/l/b/g/s-rf-tp-str-red-rabhya-fashion-original-imahm9rkrmjjhnmf.jpeg?q=90'
    ],
    "isNew": false,
    "sales": 258,
    "description": "Elevate your wardrobe with the stunning Rabhya Fashion Men Solid, Self Design, Striped Red Track Pants. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "28",
          "30",
          "32",
          "34"
        ]
      }
    ]
  },
  {
    "id": "c16",
    "name": "INDICLUB Self Design Men Beige Cargo Shorts",
    "category": "Clothing",
    "department": "Men",
    "price": 376,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/short/i/s/g/l-srtcodr0b-indiclub-original-imahgakzurfcases.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/short/i/s/g/l-srtcodr0b-indiclub-original-imahgakzurfcases.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/short/o/d/2/4xl-srtcodr0b-indiclub-original-imahgahyjma2cukv.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/short/d/y/4/m-srtcodr0b-indiclub-original-imahgahyu3yhgfcq.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/short/d/y/v/xl-srtcodr0b-indiclub-original-imahgahyhb9jxb88.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/short/y/x/m/xl-srtcodr0b-indiclub-original-imahgahyhgarfkfe.jpeg?q=90'
    ],
    "isNew": true,
    "sales": 487,
    "description": "Elevate your wardrobe with the stunning INDICLUB Self Design Men Beige Cargo Shorts. Expertly crafted from premium Nylon, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "Nylon",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "c17",
    "name": "Men Full Sleeve Sweatshirt",
    "category": "Clothing",
    "department": "Men",
    "price": 2225,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/sweatshirt/w/v/a/m-2003-sw-los-ofwt-magneto-original-imahhrvgdxwc8pcg.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/sweatshirt/w/v/a/m-2003-sw-los-ofwt-magneto-original-imahhrvgdxwc8pcg.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/sweatshirt/k/y/f/m-2003-sw-los-ofwt-magneto-original-imahhrvgrgzde9jg.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/sweatshirt/t/y/c/m-2003-sw-los-ofwt-magneto-original-imahhrvgzqvyakr4.jpeg?q=90',
      
    ],
    "isNew": false,
    "sales": 248,
    "description": "Elevate your wardrobe with the stunning Men Full Sleeve Sweatshirt. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "c18",
    "name": "N.B.F Self Design Sherwani",
    "category": "Clothing",
    "department": "Men",
    "price": 3982,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/sherwani/h/t/y/xl-rj-399-n-b-f-fashion-original-imahjgx325tcf62p.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/sherwani/h/t/y/xl-rj-399-n-b-f-fashion-original-imahjgx325tcf62p.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/sherwani/7/1/5/xl-rj-399-n-b-f-fashion-original-imahjgx3ykeryuvh.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/sherwani/i/7/k/xl-rj-399-n-b-f-fashion-original-imahjgx3ysy4sufg.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/sherwani/l/9/8/xl-rj-399-n-b-f-fashion-original-imahjgx3gdgyxhym.jpeg?q=90'
    ],
    "isNew": false,
    "sales": 267,
    "description": "Elevate your wardrobe with the stunning N.B.F Self Design Sherwani. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "c19",
    "name": "White Embroidered Sherwani with Pajama, Maroon Dupatta & Mala Embroidered Sherwani",
    "category": "Clothing",
    "department": "Men",
    "price": 9999,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/sherwani/m/8/l/s-rd61-diamond-style-original-imahgeyze6yaru5f.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/sherwani/m/8/l/s-rd61-diamond-style-original-imahgeyze6yaru5f.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/sherwani/o/k/f/s-rd61-diamond-style-original-imahgeyz3jxcygq7.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/sherwani/j/i/3/s-rd61-diamond-style-original-imahgeyzb4ca7r97.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/sherwani/l/t/k/s-rd61-diamond-style-original-imahgeyz4u9tb4a5.jpeg?q=90',

    ],
    "isNew": false,
    "sales": 136,
    "description": "Elevate your wardrobe with the stunning White Embroidered Sherwani with Pajama, Maroon Dupatta & Mala Embroidered Sherwani. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "c20",
    "name": "Men Solid Polo Neck Cotton Blend Green T-Shirt",
    "category": "Clothing",
    "department": "Men",
    "price": 2963,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/t-shirt/i/d/k/xs-db1024-3bros-original-imahfxj9zxzbsmz9.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/t-shirt/i/d/k/xs-db1024-3bros-original-imahfxj9zxzbsmz9.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/t-shirt/2/h/k/xs-db1024-3bros-original-imahfxj94rfkzwxc.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/t-shirt/e/l/k/xs-db1024-3bros-original-imahfxj9ntfjfsfm.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/t-shirt/c/d/w/xs-db1024-3bros-original-imahfxj9fpsyuqcz.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/t-shirt/y/e/p/xs-db1024-3bros-original-imahfxj959zgeyyb.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/t-shirt/h/4/g/xs-db1024-3bros-original-imahfxj9hhsspb2r.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/t-shirt/2/z/o/xs-db1024-3bros-original-imahfxj9ukze5b7p.jpeg?q=90'
    ],
    "isNew": true,
    "sales": 678,
    "description": "Elevate your wardrobe with the stunning Men Solid Polo Neck Cotton Blend Green T-Shirt. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "c21",
    "name": "Boys & Girls Printed Polyester Regular T Shirt",
    "category": "Clothing",
    "department": "Kids",
    "price": 635,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-t-shirt/4/4/s/13-14-years-hee40-virat18-kids-jersey-25-rcb-msv-original-imahhb7dhhwsb8dx.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-t-shirt/4/4/s/13-14-years-hee40-virat18-kids-jersey-25-rcb-msv-original-imahhb7dhhwsb8dx.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-t-shirt/u/8/d/13-14-years-hee40-virat18-kids-jersey-25-rcb-msv-original-imahhb7dhzjncwg7.jpeg?q=90',
      
    ],
    "isNew": true,
    "sales": 754,
    "description": "Elevate your wardrobe with the stunning Boys & Girls Printed Polyester Regular T Shirt. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "2 - 4 Years",
          "4 - 6 Years",
          "6 - 8 Years",
          "8 - 10 Years",
          "10 - 12 Years",
          "12 - 14 Years"
        ]
      }
    ]
  },
  {
    "id": "c22",
    "name": "Printed Pure Cotton Regular T Shirt",
    "category": "Clothing",
    "department": "Kids",
    "price": 599,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-t-shirt/g/n/9/15-16-years-kil-bpolo-c-s-olv-wte-blk-1pck-killer-original-imahgnxtzrbfwcmu.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-t-shirt/g/n/9/15-16-years-kil-bpolo-c-s-olv-wte-blk-1pck-killer-original-imahgnxtzrbfwcmu.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-t-shirt/k/t/s/15-16-years-kil-bpolo-c-s-olv-wte-blk-1pck-killer-original-imahgnxthvweshjc.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-t-shirt/h/k/s/15-16-years-kil-bpolo-c-s-olv-wte-blk-1pck-killer-original-imahgnxtbtwjqzpg.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-t-shirt/k/g/u/15-16-years-kil-bpolo-c-s-olv-wte-blk-1pck-killer-original-imahgnxththdxbbh.jpeg?q=90'
    ],
    "isNew": false,
    "sales": 566,
    "description": "Elevate your wardrobe with the stunning Printed Pure Cotton Regular T Shirt. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "2 - 4 Years",
          "4 - 6 Years",
          "6 - 8 Years",
          "8 - 10 Years",
          "10 - 12 Years",
          "12 - 14 Years"
        ]
      }
    ]
  },
  {
    "id": "c23",
    "name": "Boys Festive & Party, Wedding Kurta and Pyjama Set",
    "category": "Clothing",
    "department": "Kids",
    "price": 1296,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/i/c/s/4-5-years-sequence-kurta-set-kids-shreeji-enterprise-original-imahgrwb7zk8gqfj.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/i/c/s/4-5-years-sequence-kurta-set-kids-shreeji-enterprise-original-imahgrwb7zk8gqfj.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/4/2/b/8-9-years-sequence-kurta-set-kids-shreeji-enterprise-original-imahgrwbkegsheey.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/c/d/r/8-9-years-sequence-kurta-set-kids-shreeji-enterprise-original-imahgrwbvuxfjbtn.jpeg?q=90',
      
    ],
    "isNew": false,
    "sales": 606,
    "description": "Elevate your wardrobe with the stunning Boys Festive & Party, Wedding Kurta and Pyjama Set. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "2 - 4 Years",
          "4 - 6 Years",
          "6 - 8 Years",
          "8 - 10 Years",
          "10 - 12 Years",
          "12 - 14 Years"
        ]
      }
    ]
  },
  {
    "id": "c24",
    "name": "Festive & Party Blazer and Pant Set",
    "category": "Clothing",
    "department": "Kids",
    "price": 2297,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/z/l/e/6-9-months-black-suite-rkdress-original-imahhctuhpsk6ybe.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/z/l/e/6-9-months-black-suite-rkdress-original-imahhctuhpsk6ybe.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/8/u/j/6-9-months-black-suite-rkdress-original-imahhctupnpuysdq.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/j/j/g/6-9-months-black-suite-rkdress-original-imahhctu6gkfgxgk.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/3/8/v/6-9-months-black-suite-rkdress-original-imahhctuckzztwh9.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/h/w/b/6-9-months-black-suite-rkdress-original-imahhctu3k9hvm3x.jpeg?q=90',
      ''
    ],
    "isNew": false,
    "sales": 604,
    "description": "Elevate your wardrobe with the stunning Festive & Party Blazer and Pant Set. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "2 - 4 Years",
          "4 - 6 Years",
          "6 - 8 Years",
          "8 - 10 Years",
          "10 - 12 Years",
          "12 - 14 Years"
        ]
      }
    ]
  },
  {
    "id": "c25",
    "name": "Girls Festive & Party Kurta and Sharara Set",
    "category": "Clothing",
    "department": "Kids",
    "price": 2793,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/n/c/2/13-14-years-k-d-m-kids-red-sarasara-set-kdm-fashion-original-imahhzsdkhkyjzbh.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/n/c/2/13-14-years-k-d-m-kids-red-sarasara-set-kdm-fashion-original-imahhzsdkhkyjzbh.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/4/f/x/13-14-years-k-d-m-kids-red-sarasara-set-kdm-fashion-original-imahhzsdzgmjy8up.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/q/h/k/6-7-years-k-d-m-kids-red-sarasara-set-kdm-fashion-original-imahktqnwqxvnyyq.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/y/q/m/13-14-years-k-d-m-kids-red-sarasara-set-kdm-fashion-original-imahhzsd9dcrr5bx.jpeg?q=90'
    ],
    "isNew": false,
    "sales": 299,
    "description": "Elevate your wardrobe with the stunning Girls Festive & Party Kurta and Sharara Set. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "2 - 4 Years",
          "4 - 6 Years",
          "6 - 8 Years",
          "8 - 10 Years",
          "10 - 12 Years",
          "12 - 14 Years"
        ]
      }
    ]
  },
  {
    "id": "c26",
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
    "isNew": true,
    "sales": 170,
    "description": "Elevate your wardrobe with the stunning Boys Festive Kurta Pajama. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "2 - 4 Years",
          "4 - 6 Years",
          "6 - 8 Years",
          "8 - 10 Years",
          "10 - 12 Years",
          "12 - 14 Years"
        ]
      }
    ]
  },
  {
    "id": "c27",
    name: 'Kids Party Dress',
    category: 'Clothing',
    department: 'Kids',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622290319146-7b63df48a635?q=80&w=800&auto=format&fit=crop'
    ],
    "isNew": false,
    "sales": 496,
    "description": "Elevate your wardrobe with the stunning Kids Party Dress. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "2 - 4 Years",
          "4 - 6 Years",
          "6 - 8 Years",
          "8 - 10 Years",
          "10 - 12 Years",
          "12 - 14 Years"
        ]
      }
    ]
  },
  {
    "id": "c28",
     name: 'Kids Denim Jacket',
    category: 'Clothing',
    department: 'Kids',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=800&auto=format&fit=crop'
    ],
    "isNew": false,
    "sales": 448,
    "description": "Elevate your wardrobe with the stunning Kids Denim Jacket. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "c29",
    "name": "CAVENDERS Brief For Boys",
    "category": "Clothing",
    "department": "Kids",
    "price": 347,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/shopsy-kids-brief/y/5/o/12-13-years-259-printed-briefs-and-trunks-underwear-cotton-original-imah5h8ck4hhqegj.jpeg?q=90",
    "images": [
      "https://rukminim1.flixcart.com/image/1280/1280/xif0q/shopsy-kids-brief/y/5/o/12-13-years-259-printed-briefs-and-trunks-underwear-cotton-original-imah5h8ck4hhqegj.jpeg?q=90"
    ],
    "isNew": true,
    "sales": 655,
    "description": "Elevate your wardrobe with the stunning CAVENDERS Brief For Boys. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "c30",
    "name": "Girls Festive & Party Kurta and Pyjama Set",
    "category": "Clothing",
    "department": "Kids",
    "price": 1209,
    "image": "https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/o/y/e/9-10-years-set-barkatdesigningplanet-original-imah9fzfq8ceqtje.jpeg?q=90",
    "images": [
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/o/y/e/9-10-years-set-barkatdesigningplanet-original-imah9fzfq8ceqtje.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/z/q/i/9-10-years-set-barkatdesigningplanet-original-imah9fzft63wrnhw.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/h/r/x/10-11-years-plazoo-set-barkatdesigningplanet-original-imags9xzd6asksnd.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/r/g/v/10-11-years-plazoo-set-barkatdesigningplanet-original-imags9xzmyzehzek.jpeg?q=90',
      'https://rukminim1.flixcart.com/image/1280/1280/xif0q/kids-ethnic-set/6/x/e/10-11-years-plazoo-set-barkatdesigningplanet-original-imags9xzyqkfrzft.jpeg?q=90'
    ],
    "isNew": true,
    "sales": 59,
    "description": "Elevate your wardrobe with the stunning Girls Festive & Party Kurta and Pyjama Set. Expertly crafted from premium cotton, this piece offers unparalleled comfort and durability. Perfectly suited for casual wear, its timeless silhouette and meticulous attention to detail ensure you'll stand out with effortless style. Experience the perfect blend of fashion and functionality.",
    "material": "cotton",
    "occasion": "casual",
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      }
    ]
  },
  {
    "id": "j31",
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
    "isNew": false,
    "sales": 4,
    "description": "Discover the breathtaking beauty of the Kundan Bridal Set. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j32",
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
    "isNew": true,
    "sales": 0,
    "description": "Discover the breathtaking beauty of the Diamond Tennis Bracelet. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j33",
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
    "isNew": false,
    "sales": 178,
    "description": "Discover the breathtaking beauty of the Polki Drop Earrings. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j34",
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

    "isNew": false,
    "sales": 592,
    "description": "Discover the breathtaking beauty of the Gold Temple Necklace. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j35",
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
    "isNew": false,
    "sales": 222,
    "description": "Discover the breathtaking beauty of the Oxidized Silver Jhumkas. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j36",
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
    "isNew": false,
    "sales": 169,
    "description": "Discover the breathtaking beauty of the Pearl Choker Set. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j37",
    name: 'Solitaire Engagement Ring',
    category: 'Jewellery',
    department: 'Rings',
    price: 15000,
    image: 'https://i.pinimg.com/originals/cf/89/fb/cf89fb1c5ef28ad531d4e870a096e9c7.jpg',
    images: [
      'https://i.pinimg.com/originals/4b/55/7e/4b557eda262fba5dba66ed59bbce35cc.jpg',
      'https://i.pinimg.com/originals/99/74/48/997448bbd54661a85d4bac59a405a517.jpg'
    ],
    "isNew": false,
    "sales": 725,
    "description": "Discover the breathtaking beauty of the Solitaire Engagement Ring. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j38",
    "name": "Traditional Lakshmi Haar",
    "category": "Jewellery",
    "department": "Gold",
    "price": 11557,
    "image": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800&h=1000",
    "images": [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800&h=1000"
    ],
    "isNew": true,
    "sales": 364,
    "description": "Discover the breathtaking beauty of the Traditional Lakshmi Haar. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j39",
    "name": "Gold & Pearl Drop Earrings",
    "category": "Jewellery",
    "department": "Gold",
    "price": 73872,
    "image": "https://cdn.caratlane.com/media/catalog/product/J/E/JE00581-YGP9PE_1_lar.jpg",
    "images": [
      'https://cdn.caratlane.com/media/catalog/product/J/E/JE00581-YGP9PE_1_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/J/E/JE00581-YGP9PE_3_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/J/E/JE00581-YGP9PE_4_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/J/E/JE00581-YGP9PE_5_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/J/E/JE00581-YGP9PE_6_lar.jpg'
    ],
    "isNew": true,
    "sales": 640,
    "description": "Discover the breathtaking beauty of the Gold & Pearl Drop Earrings. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j40",
    "name": "Textured Gold Cuff",
    "category": "Jewellery",
    "department": "Gold",
    "price": 39434,
    "image": "https://cdn.caratlane.com/media/catalog/product/K/E/KE07271-2Y0000_1_lar.jpg",
    "images": [
      'https://cdn.caratlane.com/media/catalog/product/K/E/KE07271-2Y0000_1_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/K/E/KE07271-2Y0000_3_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/K/E/KE07271-2Y0000_4_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/K/E/KE07271-2Y0000_16_video.mp4'
    ],
    "isNew": false,
    "sales": 373,
    "description": "Discover the breathtaking beauty of the Textured Gold Cuff. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j41",
    "name": "Oxidized Silver Tribal Choker",
    "category": "Jewellery",
    "department": "Silver",
    "price": 34286,
    "image": "https://cdn.caratlane.com/media/catalog/product/B/E/BE01385-SSS300_1_lar.jpg",
    "images": [
      "https://cdn.caratlane.com/media/catalog/product/B/E/BE01385-SSS300_1_lar.jpg",
      'https://cdn.caratlane.com/media/catalog/product/B/E/BE01385-SSS300_3_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/B/E/BE01385-SSS300_5_lar.jpg'
    ],
    "isNew": false,
    "sales": 417,
    "description": "Discover the breathtaking beauty of the Oxidized Silver Tribal Choker. Forged with exceptional craftsmanship using high-quality silver, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "silver",
    "occasion": "casual",
    "variants": []
  },
  {
    "id": "j42",
    "name": "Sterling Silver Anklet",
    "category": "Jewellery",
    "department": "Silver",
    "price": 64409,
    "image": "https://cdn.caratlane.com/media/catalog/product/B/L/BL01016-SSS3RF_1_lar.jpg",
    "images": [
      "https://cdn.caratlane.com/media/catalog/product/B/L/BL01016-SSS3RF_1_lar.jpg",
      'https://cdn.caratlane.com/media/catalog/product/B/L/BL01016-SSS3RF_3_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/B/L/BL01016-SSS3RF_4_lar.jpg'
    ],
    "isNew": false,
    "sales": 23,
    "description": "Discover the breathtaking beauty of the Sterling Silver Anklet. Forged with exceptional craftsmanship using high-quality silver, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "silver",
    "occasion": "casual",
    "variants": []
  },
  {
    "id": "j43",
    "name": "Artistic Silver Nose Pin",
    "category": "Jewellery",
    "department": "Silver",
    "price": 3875,
    "image": "https://cdn.caratlane.com/media/catalog/product/J/N/JN00427-1RP900_3_lar.jpg",
    "images": [
      'https://cdn.caratlane.com/media/catalog/product/J/N/JN00427-1RP900_3_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/J/N/JN00427-1RP900_4_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/J/N/JN00427-1RP900_5_lar.jpg'
    ],
    "isNew": false,
    "sales": 656,
    "description": "Discover the breathtaking beauty of the Artistic Silver Nose Pin. Forged with exceptional craftsmanship using high-quality silver, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "silver",
    "occasion": "casual",
    "variants": []
  },
  {
    "id": "j44",
    "name": "Vintage Silver Danglers",
    "category": "Jewellery",
    "department": "Silver",
    "price": 18372,
    "image": "https://cdn.caratlane.com/media/catalog/product/B/E/BE01379-SSS300_1_lar.jpg",
    "images": [
      'https://cdn.caratlane.com/media/catalog/product/B/E/BE01379-SSS300_1_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/B/E/BE01379-SSS300_3_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/B/E/BE01379-SSS300_4_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/B/E/BE01379-SSS300_5_lar.jpg'
    ],
    "isNew": false,
    "sales": 651,
    "description": "Discover the breathtaking beauty of the Vintage Silver Danglers. Forged with exceptional craftsmanship using high-quality silver, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "silver",
    "occasion": "casual",
    "variants": []
  },
  {
    "id": "j45",
    "name": "Bohemian Statement Ring",
    "category": "Jewellery",
    "department": "Silver",
    "price": 6549,
    "image": "https://cdn.notonthehighstreet.com/fs/f0/54/a6a7-bce6-4260-9791-632b3c3cc590/original_wide-boho-statement-ring.jpg",
    "images": [
      "https://cdn.notonthehighstreet.com/fs/f0/54/a6a7-bce6-4260-9791-632b3c3cc590/original_wide-boho-statement-ring.jpg"
    ],
    "isNew": false,
    "sales": 455,
    "description": "Discover the breathtaking beauty of the Bohemian Statement Ring. Forged with exceptional craftsmanship using high-quality silver, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "silver",
    "occasion": "casual",
    "variants": []
  },
  {
    "id": "j46",
    "name": "Silver Ghungroo Bracelet",
    "category": "Jewellery",
    "department": "Silver",
    "price": 71953,
    "image": "http://5.imimg.com/data5/SELLER/Default/2022/11/HU/BN/XR/51510804/ghungroo-bracelet-1000x1000.jpeg",
    "images": [
      'http://5.imimg.com/data5/SELLER/Default/2022/11/HU/BN/XR/51510804/ghungroo-bracelet-1000x1000.jpeg',
      'https://www.festmarket.com/wp-content/uploads/2021/08/Oxidized-Silver-Ghungroo-Bracelet_cover2.jpg'
    ],
    "isNew": false,
    "sales": 460,
    "description": "Discover the breathtaking beauty of the Silver Ghungroo Bracelet. Forged with exceptional craftsmanship using high-quality silver, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "silver",
    "occasion": "casual",
    "variants": []
  },
  {
    "id": "j47",
    "name": "Enamelled Silver Jhumkis",
    "category": "Jewellery",
    "department": "Silver",
    "price": 29330,
    "image": "https://shop.southindiajewels.com/wp-content/uploads/2022/09/Fish-Design-German-Silver-Jhumkas.jpg",
    "images": [
      'https://shop.southindiajewels.com/wp-content/uploads/2022/09/Fish-Design-German-Silver-Jhumkas.jpg',
      'https://shop.southindiajewels.com/wp-content/uploads/2022/09/Fish-Design-German-Silver-Jhumkas.jpg'
    ],
    "isNew": true,
    "sales": 375,
    "description": "Discover the breathtaking beauty of the Enamelled Silver Jhumkis. Forged with exceptional craftsmanship using high-quality silver, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "silver",
    "occasion": "casual",
    "variants": []
  },
  {
    "id": "j48",
    "name": "Minimalist Silver Chain",
    "category": "Jewellery",
    "department": "Silver",
    "price": 17863,
    "image": "https://www.gorjana.com/cdn/shop/files/196-114-S-001_563a928a-e007-40a3-8d40-5acec64cb08c.jpg?v=1740774835&width=1080",
    "images": [
      'https://www.gorjana.com/cdn/shop/files/196-114-S-001_563a928a-e007-40a3-8d40-5acec64cb08c.jpg?v=1740774835&width=1080',
      'https://www.gorjana.com/cdn/shop/files/196-114-S_3_769f6185-91bb-4bb5-95ae-700c2a5010b8.jpg?v=1740774835&width=1080',
      'https://www.gorjana.com/cdn/shop/files/COR24_MOD_196-114-S_04.jpg?v=1740774835&width=1080'
    ],
    "isNew": false,
    "sales": 660,
    "description": "Discover the breathtaking beauty of the Minimalist Silver Chain. Forged with exceptional craftsmanship using high-quality silver, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "silver",
    "occasion": "casual",
    "variants": []
  },
  {
    "id": "j49",
    "name": "Filigree Silver Pendant",
    "category": "Jewellery",
    "department": "Silver",
    "price": 9559,
    "image": "https://i.pinimg.com/736x/3d/31/a2/3d31a22e6cdde750ac505295ecdc55c5.jpg",
    "images": [
      'https://i.pinimg.com/736x/3d/31/a2/3d31a22e6cdde750ac505295ecdc55c5.jpg',
      'https://lefkarasilver.com/wp-content/uploads/2020/03/filigree-pendant-fp22c-g2.0-1.jpg',
      'https://lefkarasilver.com/wp-content/uploads/2020/03/filigree-pendant-fp35Lc-g8.2-1.jpg',
      'https://lefkarasilver.com/wp-content/uploads/2020/03/filigree-pendant-fp21bM-g4.9-1.jpg'
    ],
    "isNew": false,
    "sales": 629,
    "description": "Discover the breathtaking beauty of the Filigree Silver Pendant. Forged with exceptional craftsmanship using high-quality silver, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "silver",
    "occasion": "casual",
    "variants": []
  },
  {
    "id": "j50",
    "name": "Chunky Silver Cuff",
    "category": "Jewellery",
    "department": "Silver",
    "price": 86506,
    "image": "https://i5.walmartimages.com/seo/HZMAN-Chunky-Silver-Cuff-Bracelets-for-Women-Thick-Wide-Bangle-Bracelet-Hammered-Open-Hinge-Wrist-Cuff-Bracelet-Jewelry-Gift_a7ccbdd3-5d76-4f30-9a72-d557466e039f.c5add0f039e45c48ddbcbc5576b14199.jpeg",
    "images": [
      'https://i5.walmartimages.com/seo/HZMAN-Chunky-Silver-Cuff-Bracelets-for-Women-Thick-Wide-Bangle-Bracelet-Hammered-Open-Hinge-Wrist-Cuff-Bracelet-Jewelry-Gift_a7ccbdd3-5d76-4f30-9a72-d557466e039f.c5add0f039e45c48ddbcbc5576b14199.jpeg',
      'https://a.1stdibscdn.com/antique-chunky-silver-cuff-bangle-leaf-engraved-edwardian-for-sale-picture-12/j_23462/j_174854421667683656912/PXL_20221102_125846693_2_master.jpg',
      'https://i.pinimg.com/originals/43/d2/76/43d276dd9f0a84dfa65d09bb41885b80.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/71vHXqM1tEL._AC_SL1500_.jpg'
    ],
    "isNew": false,
    "sales": 450,
    "description": "Discover the breathtaking beauty of the Chunky Silver Cuff. Forged with exceptional craftsmanship using high-quality silver, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "silver",
    "occasion": "casual",
    "variants": []
  },
  {
    "id": "j51",
    "name": "Royal Polki Matha Patti",
    "category": "Jewellery",
    "department": "Bridal",
    "price": 22011,
    "image": "https://tse3.mm.bing.net/th/id/OIP.d3jXvW34fHIDMO9_kqB65QHaHa?pid=Api&h=220&P=0",
    "images": [
      'https://tse3.mm.bing.net/th/id/OIP.d3jXvW34fHIDMO9_kqB65QHaHa?pid=Api&h=220&P=0',
      'https://tse2.mm.bing.net/th/id/OIP.knUivHL1Y3zH4axXJTmu5gHaHa?pid=Api&h=220&P=0',
      'https://gehnashop.com/cdn/shop/files/royal-look-bridal-kundan-matha-patti-by-gehna-shop-gehna-shop-royal-look-bridal-kundan-matha-patti-online-by-gehna-shop-42079240257851.jpg?v=1687985114'
    ],
    "isNew": true,
    "sales": 190,
    "description": "Discover the breathtaking beauty of the Royal Polki Matha Patti. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j52",
    "name": "Heavy Kundan Bridal Set",
    "category": "Jewellery",
    "department": "Bridal",
    "price": 65734,
    "image": "https://5.imimg.com/data5/ECOM/Default/2024/3/400738034/AM/EA/IB/77950844/zevar-jewelry-sets-radiant-heavy-kundan-green-bridal-set-a-symphony-of-elegance-41627976007913-500x500.jpg",
    "images": [
      'https://5.imimg.com/data5/ECOM/Default/2024/3/400738034/AM/EA/IB/77950844/zevar-jewelry-sets-radiant-heavy-kundan-green-bridal-set-a-symphony-of-elegance-41627976007913-500x500.jpg',
      'http://zevar.com/cdn/shop/files/zevar-bridal-jewelry-set-green-heavy-kundan-bridal-jewelry-set-zevar-wedding-collection-green-heavy-kundan-bridal-jewelry-set-zevar-wedding-collection-1195160063.webp?v=1759092543',
      'http://ishhaara.com/cdn/shop/files/ishhaara-drop-shaped-heavy-kundan-bridal-set-32459866931243.jpg?v=1723808676'
    ],
    "isNew": true,
    "sales": 717,
    "description": "Discover the breathtaking beauty of the Heavy Kundan Bridal Set. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j53",
    "name": "Bridal Pearl Nath",
    "category": "Jewellery",
    "department": "Bridal",
    "price": 30828,
    "image": "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800&h=1000",
    "images": [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800&h=1000"
    ],
    "isNew": true,
    "sales": 655,
    "description": "Discover the breathtaking beauty of the Bridal Pearl Nath. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j54",
    "name": "Elaborate Meenakari Choker",
    "category": "Jewellery",
    "department": "Bridal",
    "price": 39824,
    "image": "https://medias.utsavfashion.com/media/catalog/product/cache/1/image/500x/040ec09b1e35df139433887a97daa66f/m/e/meenakari-choker-necklace-set-v1-jqt710.jpg",
    "images": [
      'https://medias.utsavfashion.com/media/catalog/product/cache/1/image/500x/040ec09b1e35df139433887a97daa66f/m/e/meenakari-choker-necklace-set-v1-jqt710.jpg',
      'https://img.perniaspopupshop.com/catalog/product/k/o/KOHA012383_1.jpg?impolicy=zoomimage',
      'https://medias.utsavfashion.com/media/catalog/product/cache/1/image/500x/040ec09b1e35df139433887a97daa66f/m/e/meenakari-choker-necklace-set-v1-jqt711.jpg',
      'https://assets0.mirraw.com/images/6931668/MRR24-1_zoom.jpg?1554982918'
    ],
    "isNew": false,
    "sales": 606,
    "description": "Discover the breathtaking beauty of the Elaborate Meenakari Choker. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j55",
    "name": "Bridal Chura Sets",
    "category": "Jewellery",
    "department": "Bridal",
    "price": 60260,
    "image": "https://tse3.mm.bing.net/th/id/OIP.ffv_dCsr6xmko2gfj-rf-QHaHa?pid=Api&h=220&P=0",
    "images": [
      'https://tse3.mm.bing.net/th/id/OIP.ffv_dCsr6xmko2gfj-rf-QHaHa?pid=Api&h=220&P=0',
      'https://i.pinimg.com/originals/1d/3c/45/1d3c458242427e27868e6ad3827b6593.jpg',
      'https://tse1.mm.bing.net/th/id/OIP.dj4CydsLcotmQtcoS2RObQHaHa?pid=Api&h=220&P=0'
    ],
    "isNew": false,
    "sales": 797,
    "description": "Discover the breathtaking beauty of the Bridal Chura Sets. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j56",
    "name": "Emerald Drop Maang Tikka",
    "category": "Jewellery",
    "department": "Bridal",
    "price": 21701,
    "image": "https://5.imimg.com/data5/UQ/OG/FT/SELLER-2816813/star-shaped-gold-finish-cz-carved-tops-earring-1000x1000.JPG",
    "images": [
      'https://5.imimg.com/data5/UQ/OG/FT/SELLER-2816813/star-shaped-gold-finish-cz-carved-tops-earring-1000x1000.JPG',
      'https://tse4.mm.bing.net/th/id/OIP.yPorwrNpOV2q55deN_cNhQHaJ3?pid=Api&h=220&P=0',
      'https://tse1.mm.bing.net/th/id/OIP.HyddXA_axb4HVPlpMDFcZgHaJ4?pid=Api&h=220&P=0',
      'https://i.etsystatic.com/47513053/r/il/a2c228/6184011559/il_1080xN.6184011559_mhbr.jpg',
      'https://i.etsystatic.com/20875812/r/il/e36f99/6263195135/il_1080xN.6263195135_436e.jpg'
    ],
    "isNew": true,
    "sales": 602,
    "description": "Discover the breathtaking beauty of the Emerald Drop Maang Tikka. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j57",
    "name": "Jadau Bridal Haaram",
    "category": "Jewellery",
    "department": "Bridal",
    "price": 59945,
    "image": "https://eternajewels.in/cdn/shop/files/8E473414-1041-486F-9E2B-545A418921D8.jpg?v=1752894276&width=990",
    "images": [
      'https://eternajewels.in/cdn/shop/files/8E473414-1041-486F-9E2B-545A418921D8.jpg?v=1752894276&width=990',
      'http://aarveejewellery.in/cdn/shop/files/Jadaukundansemibridalset.jpg?v=1709096562',
      'https://tse2.mm.bing.net/th/id/OIP.cIbWGQDVaAXFrkJMkOgUbgHaJ4?pid=Api&h=220&P=0'
    ],
    "isNew": false,
    "sales": 266,
    "description": "Discover the breathtaking beauty of the Jadau Bridal Haaram. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j58",
    "name": "Diamond & Gold Maatha Patti",
    "category": "Jewellery",
    "department": "Bridal",
    "price": 28807,
    "image": "https://cdn.shopify.com/s/files/1/2184/2541/files/IMG_0391_35dea7ca-c4ea-4bbd-95e8-f4ca0bea3582.jpg?v=1685946158",
    "images": [
      'https://cdn.shopify.com/s/files/1/2184/2541/files/IMG_0391_35dea7ca-c4ea-4bbd-95e8-f4ca0bea3582.jpg?v=1685946158',
      'https://tse1.mm.bing.net/th/id/OIP.e57IAPebwhvsvfq8NKK13wHaHa?pid=Api&h=220&P=0',
      'https://i.pinimg.com/originals/64/8a/3c/648a3ca798a0c8dd94427c36edda4bd9.jpg',
      
    ],
    "isNew": true,
    "sales": 631,
    "description": "Discover the breathtaking beauty of the Diamond & Gold Maatha Patti. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j59",
    "name": "Exquisite Bridal Passa",
    "category": "Jewellery",
    "department": "Bridal",
    "price": 47077,
    "image": "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=800&h=1000",
    "images": [
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=800&h=1000"
    ],
    "isNew": false,
    "sales": 100,
    "description": "Discover the breathtaking beauty of the Exquisite Bridal Passa. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j60",
    "name": "Traditional Temple Bridal Set",
    "category": "Jewellery",
    "department": "Bridal",
    "price": 76250,
    "image": "https://i.etsystatic.com/26473799/r/il/2dcc71/3075227211/il_fullxfull.3075227211_44sp.jpg",
    "images": [
      "https://i.etsystatic.com/26473799/r/il/2dcc71/3075227211/il_fullxfull.3075227211_44sp.jpg"
    ],
    "isNew": false,
    "sales": 798,
    "description": "Discover the breathtaking beauty of the Traditional Temple Bridal Set. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for festive occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "festive",
    "variants": []
  },
  {
    "id": "j61",
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
    "isNew": true,
    "sales": 350,
    "description": "Discover the breathtaking beauty of the Kundan Bridal Set. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "casual",
    "variants": [
      {
        "name": "Ring Size",
        "options": [
          "6",
          "7",
          "8",
          "9"
        ]
      }
    ]
  },
  {
    "id": "j62",
    "name": "Vintage Sapphire Halo Ring",
    "category": "Jewellery",
    "department": "Rings",
    "price": 51926,
    "image": "https://d17anp2eo56k6j.cloudfront.net/media/catalog/product/v/i/victorian-style-sapphire-and-diamond-halo-ring_1_30-1-10074.jpg",
    "images": [
      "https://d17anp2eo56k6j.cloudfront.net/media/catalog/product/v/i/victorian-style-sapphire-and-diamond-halo-ring_1_30-1-10074.jpg",
      'https://www.jewelryfinds.com/siteuploads/photogalleryimg/18916_prod_2006-ring-beauty.jpg'
    ],
    "isNew": true,
    "sales": 111,
    "description": "Discover the breathtaking beauty of the Vintage Sapphire Halo Ring. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "casual",
    "variants": [
      {
        "name": "Ring Size",
        "options": [
          "6",
          "7",
          "8",
          "9"
        ]
      }
    ]
  },
  {
    "id": "j63",
    "name": "18k Gold Eternity Band",
    "category": "Jewellery",
    "department": "Rings",
    "price": 74049,
    "image": "https://a.1stdibscdn.com/15-carat-18k-yellow-gold-radiant-cut-fancy-yellow-diamond-eternity-band-for-sale/1121189/j_124768821623210027842/12476882_master.jpeg",
    "images": [
      "https://a.1stdibscdn.com/15-carat-18k-yellow-gold-radiant-cut-fancy-yellow-diamond-eternity-band-for-sale/1121189/j_124768821623210027842/12476882_master.jpeg"
    ],
    "isNew": false,
    "sales": 112,
    "description": "Discover the breathtaking beauty of the 18k Gold Eternity Band. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "casual",
    "variants": [
      {
        "name": "Ring Size",
        "options": [
          "6",
          "7",
          "8",
          "9"
        ]
      }
    ]
  },
  {
    "id": "j64",
    "name": "Rose Gold Moissanite Ring",
    "category": "Jewellery",
    "department": "Rings",
    "price": 36825,
    "image": "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=800&h=1000",
    "images": [
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=800&h=1000"
    ],
    "isNew": false,
    "sales": 127,
    "description": "Discover the breathtaking beauty of the Rose Gold Moissanite Ring. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "casual",
    "variants": [
      {
        "name": "Ring Size",
        "options": [
          "6",
          "7",
          "8",
          "9"
        ]
      }
    ]
  },
  {
    "id": "j65",
    "name": "Classic Platinum Wedding Band",
    "category": "Jewellery",
    "department": "Rings",
    "price": 78320,
    "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800&h=1000",
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800&h=1000"
    ],
    "isNew": true,
    "sales": 438,
    "description": "Discover the breathtaking beauty of the Classic Platinum Wedding Band. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "casual",
    "variants": [
      {
        "name": "Ring Size",
        "options": [
          "6",
          "7",
          "8",
          "9"
        ]
      }
    ]
  },
  {
    "id": "j66",
    "name": "Ruby Cluster Ring",
    "category": "Jewellery",
    "department": "Rings",
    "price": 51467,
    "image": "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800&h=1000",
    "images": [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800&h=1000"
    ],
    "isNew": true,
    "sales": 384,
    "description": "Discover the breathtaking beauty of the Ruby Cluster Ring. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "casual",
    "variants": [
      {
        "name": "Ring Size",
        "options": [
          "6",
          "7",
          "8",
          "9"
        ]
      }
    ]
  },
  {
    "id": "j67",
    "name": "Minimalist Gold Stacking Rings",
    "category": "Jewellery",
    "department": "Rings",
    "price": 49926,
    "image": "https://cdn.caratlane.com/media/catalog/product/K/R/KR02251-2Y0000_1_lar.jpg",
    "images": [
      "https://cdn.caratlane.com/media/catalog/product/K/R/KR02251-2Y0000_1_lar.jpg",
      'https://cdn.caratlane.com/media/catalog/product/K/R/KR02251-2Y0000_3_lar.jpg'
    ],
    "isNew": false,
    "sales": 756,
    "description": "Discover the breathtaking beauty of the Minimalist Gold Stacking Rings. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "casual",
    "variants": [
      {
        "name": "Ring Size",
        "options": [
          "6",
          "7",
          "8",
          "9"
        ]
      }
    ]
  },
  {
    "id": "j68",
    "name": "Emerald Cut Engagement Ring",
    "category": "Jewellery",
    "department": "Rings",
    "price": 26373,
    "image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800&h=1000",
    "images": [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800&h=1000"
    ],
    "isNew": false,
    "sales": 98,
    "description": "Discover the breathtaking beauty of the Emerald Cut Engagement Ring. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "casual",
    "variants": [
      {
        "name": "Ring Size",
        "options": [
          "6",
          "7",
          "8",
          "9"
        ]
      }
    ]
  },
  {
    "id": "j69",
    "name": "Oval Diamond Halo Ring",
    "category": "Jewellery",
    "department": "Rings",
    "price": 26515,
    "image":"https://cdn.caratlane.com/media/catalog/product/J/R/JR06389-1YP600_1_lar.jpg",
    "images": [
      'https://cdn.caratlane.com/media/catalog/product/J/R/JR06389-1YP600_1_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/J/R/JR06389-1YP600_2_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/J/R/JR06389-1YP600_4_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/J/R/JR06389-1YP600_6_lar.jpg'
    ],
    "isNew": false,
    "sales": 555,
    "description": "Discover the breathtaking beauty of the Oval Diamond Halo Ring. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "casual",
    "variants": [
      {
        "name": "Ring Size",
        "options": [
          "6",
          "7",
          "8",
          "9"
        ]
      }
    ]
  },
  {
    "id": "j70",
    "name": "Art Deco Sapphire Ring",
    "category": "Jewellery",
    "department": "Rings",
    "price": 49391,
    "image": "https://cdn.caratlane.com/media/catalog/product/J/R/JR03628-YGS300_1_lar.jpg",
    "images": [
      'https://cdn.caratlane.com/media/catalog/product/J/R/JR03628-YGS300_1_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/J/R/JR03628-YGS300_3_lar.jpg',
      'https://cdn.caratlane.com/media/catalog/product/J/R/JR03628-YGS300_6_lar.jpg'
    ],
    "isNew": true,
    "sales": 530,
    "description": "Discover the breathtaking beauty of the Art Deco Sapphire Ring. Forged with exceptional craftsmanship using high-quality gold, this masterpiece exudes luxury and sophistication. Ideal for casual occasions, it serves as a mesmerizing statement piece that perfectly complements your unique charm. A true symbol of timeless elegance.",
    "material": "gold",
    "occasion": "casual",
    "variants": [
      {
        "name": "Ring Size",
        "options": [
          "6",
          "7",
          "8",
          "9"
        ]
      }
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
        aria-label="Share product"
        aria-expanded={isOpen}
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
            <button 
              onClick={(e) => { shareProduct(e, product, 'facebook'); setIsOpen(false); }} 
              className="p-2 hover:bg-brand-ink/5 rounded-full text-brand-ink hover:text-brand-gold transition-colors" 
              title="Share on Facebook"
              aria-label="Share on Facebook"
            >
              <Facebook className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { shareProduct(e, product, 'twitter'); setIsOpen(false); }} 
              className="p-2 hover:bg-brand-ink/5 rounded-full text-brand-ink hover:text-brand-gold transition-colors" 
              title="Share on Twitter"
              aria-label="Share on Twitter"
            >
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
  reviews: Review[];
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
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer bg-brand-bg rounded-xl sm:rounded-2xl transition-all duration-300 relative z-0 hover:z-10 flex flex-col h-full"
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden mb-3 md:mb-4 bg-brand-surface rounded-t-xl sm:rounded-t-2xl">
        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 flex flex-col gap-1.5">
          {product.isNew && (
            <div className="bg-brand-ink text-brand-surface text-[8px] md:text-[10px] uppercase tracking-widest px-2 py-0.5 md:px-3 md:py-1 font-bold shadow-sm">
              New
            </div>
          )}
          {product.sales > 400 && (
            <div className="bg-brand-gold text-brand-bg text-[8px] md:text-[10px] uppercase tracking-widest px-2 py-0.5 md:px-3 md:py-1 font-bold shadow-sm">
              Sale
            </div>
          )}
        </div>
        <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 flex flex-col gap-2">
          <button 
            onClick={(e) => onToggleWishlist(e, product.id)}
            className="p-1.5 md:p-2 bg-brand-bg/80 hover:bg-brand-bg rounded-full text-brand-ink transition-colors backdrop-blur-md"
            aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-3 h-3 md:w-4 md:h-4 ${isSaved ? 'fill-brand-gold text-brand-gold' : ''}`} />
          </button>
          <ShareMenu 
            product={product} 
            className="relative"
            iconClassName="bg-brand-bg/80 hover:bg-brand-bg text-brand-ink backdrop-blur-md p-1.5 md:p-2"
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
              className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-brand-surface/80 text-brand-ink flex items-center justify-center hover:bg-brand-surface transition-colors shadow-sm pointer-events-auto"
             aria-label="Previous image">
              <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            <button 
              onClick={nextImage}
              className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-brand-surface/80 text-brand-ink flex items-center justify-center hover:bg-brand-surface transition-colors shadow-sm pointer-events-auto"
             aria-label="Next image">
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        )}

        {/* Image Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 md:bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
            {product.images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 md:h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-3 md:w-4 bg-brand-surface shadow-[0_0_4px_rgba(0,0,0,0.5)]' : 'w-1 md:w-1.5 bg-brand-surface/70'}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 md:gap-2 flex-grow px-1.5 md:px-2 pb-2">
        <div className="flex flex-col xl:flex-row justify-between items-start gap-1">
          <div className="flex-1 w-full truncate">
            <p className="text-[7px] sm:text-[8px] md:text-[10px] uppercase tracking-widest text-brand-gold mb-0.5 md:mb-1">{product.category}</p>
            <h4 className="font-serif text-[10px] sm:text-xs md:text-lg text-brand-ink truncate leading-tight w-full" title={product.name}>{product.name}</h4>
            {reviews.length > 0 && (
              <div className="flex items-center gap-0.5 md:gap-2 mt-0.5 md:mt-1">
                {renderStars(Math.round(avgRating))}
                <span className="text-[8px] md:text-xs text-brand-ink/50 ml-0.5">({reviews.length})</span>
              </div>
            )}
          </div>
          <p className="text-[10px] sm:text-[11px] md:text-sm font-medium tracking-wider text-brand-ink/80 pt-0.5 whitespace-nowrap">₹{product.price.toLocaleString('en-IN')}</p>
        </div>
        
        <div className="flex flex-row gap-1.5 md:gap-2 mt-auto pt-3 w-full">
          <button 
             onClick={(e) => {
               e.stopPropagation();
               onSelect(product);
             }}
             className="w-1/2 flex-1 border border-brand-ink/20 text-brand-ink text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest px-1 py-2 md:py-2.5 hover:border-brand-gold hover:text-brand-gold transition-colors font-medium text-center truncate flex justify-center items-center"
          >
            <span className="hidden sm:inline">Quick View</span>
            <span className="sm:hidden">View</span>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(e, product.id);
            }}
            className="w-1/2 flex-1 bg-brand-ink text-brand-surface text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest px-1 py-2 md:py-2.5 hover:bg-brand-gold hover:text-brand-bg transition-colors font-medium text-center truncate flex justify-center items-center"
          >
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [storeMode, setStoreMode] = useState<StoreMode>('clothing');
  const [department, setDepartment] = useState<'All' | 'Men' | 'Women' | 'Kids' | 'Gold' | 'Silver' | 'Bridal' | 'Rings'>('All');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');
  const [material, setMaterial] = useState('all');
  const [occasion, setOccasion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'wishlist' | 'profile' | 'orders' | 'about' | 'contact' | 'login' | 'admin' | 'cart' | 'checkout'>('home');
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<{productId: string, quantity: number, variants?: Record<string, string>}[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersPage, setOrdersPage] = useState(1);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    paymentMethod: 'cod',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [checkoutErrors, setCheckoutErrors] = useState<Record<string, string>>({});
  const [hasSubmittedCheckout, setHasSubmittedCheckout] = useState(false);

  useEffect(() => {
    const errors: Record<string, string> = {};
    if (!checkoutData.fullName.trim()) errors.fullName = "Full name is required";
    if (!checkoutData.phone.trim()) errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(checkoutData.phone.replace(/\D/g, ''))) errors.phone = "Invalid phone number";
    
    if (!checkoutData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutData.email)) errors.email = "Invalid email";
    
    if (!checkoutData.address.trim()) errors.address = "Address is required";
    if (!checkoutData.city.trim()) errors.city = "City is required";
    
    if (!checkoutData.pincode.trim()) errors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(checkoutData.pincode)) errors.pincode = "Invalid pincode";
    
    if (!checkoutData.state.trim()) errors.state = "State is required";

    if (checkoutData.paymentMethod === 'card') {
      if (!checkoutData.cardNumber.trim()) errors.cardNumber = "Card number is required";
      else if (!/^\d{16}$/.test(checkoutData.cardNumber.replace(/\D/g, ''))) errors.cardNumber = "Card number must be 16 digits";
      
      if (!checkoutData.expiry.trim()) errors.expiry = "Expiry date is required";
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(checkoutData.expiry)) errors.expiry = "Use MM/YY format";

      if (!checkoutData.cvv.trim()) errors.cvv = "CVV is required";
      else if (!/^\d{3,4}$/.test(checkoutData.cvv)) errors.cvv = "Invalid CVV";
    }
    
    setCheckoutErrors(errors);
  }, [checkoutData]);

  const [toast, setToast] = useState<{message: string, id: number} | null>(null);
  
  // Profile State
  const [profileData, setProfileData] = useState<{ displayName: string; phone: string; address: string }>({ displayName: '', phone: '', address: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setCurrentView('home');
  };

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
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            localStorage.removeItem('auth_token');
            setUser(null);
          }
        } catch (err) {
          console.error("Auth check failed", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
    };
    checkAuth();
  }, []);

  // Listen to Profile Data
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const res = await fetch(`/api/users/${user.uid}`);
          if (res.ok) {
            const data = await res.json();
            setProfileData({
              displayName: data.displayName || '',
              phone: data.phone || '',
              address: data.address || ''
            });
          }
        } catch (error) {
          console.error("Error fetching profile", error);
        }
      };
      fetchProfile();
    } else {
      setProfileData({ displayName: '', phone: '', address: '' });
    }
  }, [user]);

  // Listen to Wishlist
  useEffect(() => {
    if (user) {
      const fetchWishlist = async () => {
        try {
          const res = await fetch(`/api/wishlist/${user.uid}`);
          if (res.ok) {
            const data = await res.json();
            setWishlist(data);
          }
        } catch (error) {
          console.error("Error fetching wishlist", error);
        }
      };
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  // Listen to Orders
  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const res = await fetch(`/api/orders/${user.uid}`);
          if (res.ok) {
            const data = await res.json();
            const fetchedOrders = data.map((o: any) => ({
              ...o,
              id: o._id || o.id,
              createdAt: { toMillis: () => new Date(o.createdAt).getTime(), toDate: () => new Date(o.createdAt) }
            }));
            setOrders(fetchedOrders);
          }
        } catch (error) {
          console.error("Error fetching orders", error);
        }
      };
      fetchOrders();
      const iv = setInterval(fetchOrders, 10000);
      return () => clearInterval(iv);
    } else {
      setOrders([]);
    }
  }, [user]);

  const toggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!user) {
      setCurrentView('login');
      return;
    }
    const isSaved = wishlist.includes(productId);
    const newWs = isSaved ? wishlist.filter(id => id !== productId) : [...wishlist, productId];
    setWishlist(newWs); // optimistic update
    
    try {
      await fetch(`/api/wishlist/${user.uid}`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ productIds: newWs }) 
      });
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
      await fetch(`/api/users/${user.uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: profileData.displayName,
          phone: profileData.phone,
          address: profileData.address
        })
      });
      setUser(prev => prev ? { ...prev, displayName: profileData.displayName } : null);
      setIsEditingProfile(false);
      
      const id = Date.now();
      setToast({ message: "Profile updated successfully", id });
      setTimeout(() => {
        setToast(prev => prev?.id === id ? null : prev);
      }, 3000);
      
    } catch (error) {
      console.error("Error saving profile", error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const proceedToCheckout = () => {
    if (!user) {
      setCurrentView('login');
      return;
    }
    if (cart.length === 0) return;
    
    // Pre-fill fields if available
    if (profileData) {
      setCheckoutData(prev => ({
        ...prev,
        fullName: profileData.displayName || '',
        phone: profileData.phone || '',
        address: profileData.address || ''
      }));
    }
    
    setCurrentView('checkout');
  };

  const completeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || cart.length === 0) return;
    
    setHasSubmittedCheckout(true);
    if (Object.keys(checkoutErrors).length > 0) {
      const id = Date.now();
      setToast({ message: "Please fix the errors in the form before paying.", id });
      setTimeout(() => setToast(prev => prev?.id === id ? null : prev), 3000);
      return;
    }
    
    setIsCheckingOut(true);
    try {
      const totalAmount = cart.reduce((sum, item) => {
        const product = PRODUCTS.find(p => p.id === item.productId);
        return sum + (product?.price || 0) * item.quantity;
      }, 0);

      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          items: cart,
          totalAmount,
          status: 'pending',
          shippingInfo: {
            fullName: checkoutData.fullName,
            phone: checkoutData.phone,
            email: checkoutData.email,
            address: checkoutData.address,
            city: checkoutData.city,
            pincode: checkoutData.pincode,
            state: checkoutData.state
          },
          paymentMethod: checkoutData.paymentMethod
        })
      });
      
      setCart([]);
      setCurrentView('orders');
      
      const id = Date.now();
      setToast({ message: "Order placed successfully!", id });
      setTimeout(() => setToast(prev => prev?.id === id ? null : prev), 3000);
    } catch (error) {
      console.error("Error creating order", error);
      const id = Date.now();
      setToast({ message: "Failed to place order. Please try again.", id });
      setTimeout(() => setToast(prev => prev?.id === id ? null : prev), 3000);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleReorder = (order: Order) => {
    setCart(prev => {
      let newCart = [...prev];
      order.items.forEach(newItem => {
        const existingIndex = newCart.findIndex(item => {
          if (item.productId !== newItem.productId) return false;
          if (!item.variants && !newItem.variants) return true;
          if (!item.variants || !newItem.variants) return false;
          const itemKeys = Object.keys(item.variants);
          const newKeys = Object.keys(newItem.variants);
          if (itemKeys.length !== newKeys.length) return false;
          return itemKeys.every(key => item.variants![key] === newItem.variants![key]);
        });
        if (existingIndex >= 0) {
          newCart[existingIndex].quantity += newItem.quantity;
        } else {
          newCart.push({ ...newItem });
        }
      });
      return newCart;
    });
    const id = Date.now();
    setToast({ message: "Items added to cart", id });
    setTimeout(() => setToast(prev => prev?.id === id ? null : prev), 3000);
    setCurrentView('cart');
  };

  const confirmCancelOrder = () => {
    if (!orderToCancel) return;
    setOrders(prev => prev.map(o => o.id === orderToCancel ? { ...o, status: 'cancelled' } : o));
    setOrderToCancel(null);
    const id = Date.now();
    setToast({ message: "Order cancelled successfully", id });
    setTimeout(() => setToast(prev => prev?.id === id ? null : prev), 3000);
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

    // Filter by Price Range
    if (priceRange !== 'all') {
      if (priceRange === 'under-1000') result = result.filter(p => p.price < 1000);
      else if (priceRange === '1000-5000') result = result.filter(p => p.price >= 1000 && p.price <= 5000);
      else if (priceRange === 'over-5000') result = result.filter(p => p.price > 5000);
    }

    // Filter by Material
    if (material !== 'all') {
      result = result.filter(p => p.material === material);
    }

    // Filter by Occasion
    if (occasion !== 'all') {
      result = result.filter(p => p.occasion === occasion);
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
    const authorName = user ? (profileData.displayName || user.displayName || 'User') : reviewForm.author;
    if (!selectedProduct || !authorName.trim() || !reviewForm.comment.trim()) return;

    const newReview = {
      id: Date.now().toString(),
      author: authorName,
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
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 hover:bg-brand-ink/10 rounded-full text-brand-ink"
                aria-label="Close mobile menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-8 relative">
              <Search className="w-5 h-5 text-brand-ink/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchQuery(localSearch);
                    setCurrentView('home');
                    setIsMobileMenuOpen(false);
                    setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }
                }}
                className="w-full bg-brand-surface border border-brand-ink/20 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:border-brand-gold text-brand-ink placeholder:text-brand-ink/40"
              />
            </div>

            <div className="flex flex-col gap-8 text-lg uppercase tracking-widest font-medium">
              <button 
                onClick={() => {
                  setCurrentView('home'); 
                  setIsMobileMenuOpen(false);
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                }} 
                className="text-left hover:text-brand-gold transition-colors border-b border-brand-ink/10 pb-4"
              >
                Home
              </button>
              <button 
                onClick={() => {
                  setCurrentView('home'); 
                  setIsMobileMenuOpen(false);
                  setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }} 
                className="text-left hover:text-brand-gold transition-colors border-b border-brand-ink/10 pb-4"
              >
                Shop
              </button>
              {isAuthReady && user ? (
                <>
                  <button onClick={() => { setCurrentView('profile'); setIsMobileMenuOpen(false); }} className="text-left hover:text-brand-gold transition-colors border-b border-brand-ink/10 pb-4">My Profile</button>
                  <button onClick={() => { setCurrentView('wishlist'); setIsMobileMenuOpen(false); }} className="text-left hover:text-brand-gold transition-colors border-b border-brand-ink/10 pb-4">My Wishlist</button>
                  <button onClick={() => { setCurrentView('orders'); setIsMobileMenuOpen(false); }} className="text-left hover:text-brand-gold transition-colors border-b border-brand-ink/10 pb-4">Order History</button>
                  {user.isAdmin && (
                    <button onClick={() => { setCurrentView('admin'); setIsMobileMenuOpen(false); }} className="text-left text-brand-gold hover:text-brand-gold/80 transition-colors border-b border-brand-ink/10 pb-4">Admin Panel</button>
                  )}
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-left text-red-400 hover:text-red-300 transition-colors border-b border-brand-ink/10 pb-4">Sign Out</button>
                </>
              ) : (
                <button onClick={() => { setCurrentView('login'); setIsMobileMenuOpen(false); }} className="text-left hover:text-brand-gold transition-colors border-b border-brand-ink/10 pb-4">Log In</button>
              )}
            </div>
            
            <div className="mt-auto pt-8 border-t border-brand-ink/10">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs uppercase tracking-widest text-brand-ink/60">Store Mode</p>
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)} 
                  className="p-2 hover:bg-brand-ink/10 rounded-full transition-colors"
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex bg-brand-surface p-1 rounded-full text-[10px] font-bold tracking-widest border border-brand-ink/10 shadow-sm">
                <button 
                  onClick={() => { setStoreMode('clothing'); setIsMobileMenuOpen(false); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full transition-all duration-300 ${storeMode === 'clothing' ? 'bg-brand-gold text-brand-bg shadow-md' : 'text-brand-gold hover:bg-brand-gold/10'}`}
                >
                  <Sparkles className="w-3 h-3" />
                  CLOTHING
                </button>
                <button 
                  onClick={() => { setStoreMode('jewellery'); setIsMobileMenuOpen(false); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full transition-all duration-300 ${storeMode === 'jewellery' ? 'bg-brand-gold text-brand-bg shadow-md' : 'text-brand-gold hover:bg-brand-gold/10'}`}
                >
                  <Star className="w-3 h-3" />
                  JEWELLERY
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
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:flex gap-8 text-[15px] font-medium">
            <button onClick={() => setCurrentView('home')} className={`transition-colors ${currentView === 'home' ? 'text-brand-gold' : 'text-brand-ink/70 hover:text-brand-ink'}`}>Home</button>
            <button onClick={() => { setCurrentView('home'); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-brand-ink/70 hover:text-brand-ink transition-colors">Products</button>
            <button onClick={() => setCurrentView('contact')} className={`transition-colors ${currentView === 'contact' ? 'text-brand-gold' : 'text-brand-ink/70 hover:text-brand-ink'}`}>Contact</button>
          </div>
        </div>
        
        <div className="text-center w-1/3 flex flex-col items-center cursor-pointer" onClick={() => setCurrentView('home')}>
          <h1 className="font-serif text-base sm:text-xl md:text-3xl leading-none tracking-tight text-brand-gold transition-all">
            {brandInfo.title}
          </h1>
          <p className="hidden md:block text-[9px] uppercase tracking-[0.2em] mt-1 text-brand-ink/60 transition-all">
            {brandInfo.sub}
          </p>
          
          {/* Desktop Store Mode Toggle */}
          <div className="hidden md:flex bg-brand-surface p-1 rounded-full text-[11px] font-bold tracking-widest mt-4 border border-brand-ink/10 shadow-sm">
            <button 
              onClick={() => setStoreMode('clothing')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${storeMode === 'clothing' ? 'bg-brand-gold text-brand-bg shadow-md' : 'text-brand-gold hover:bg-brand-gold/10'}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              CLOTHING
            </button>
            <button 
              onClick={() => setStoreMode('jewellery')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${storeMode === 'jewellery' ? 'bg-brand-gold text-brand-bg shadow-md' : 'text-brand-gold hover:bg-brand-gold/10'}`}
            >
              <Star className="w-3.5 h-3.5" />
              JEWELLERY
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 md:gap-4 w-1/3">
          <div className="hidden md:flex items-center bg-brand-surface border border-brand-ink/20 rounded-full px-3 py-1.5 focus-within:border-brand-gold transition-colors">
            <Search className="w-4 h-4 text-brand-ink/60" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchQuery(localSearch);
                  setCurrentView('home');
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-transparent border-none focus:outline-none text-xs ml-2 w-32 lg:w-48 text-brand-ink placeholder:text-brand-ink/40"
            />
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className="p-2 hover:bg-brand-ink/10 rounded-full transition-colors hidden md:block"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
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
                {user.isAdmin && (
                  <button onClick={() => setCurrentView('admin')} className="text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-brand-ink/5 transition-colors text-brand-gold">Admin Panel</button>
                )}
                <button onClick={() => handleLogout()} className="text-left px-4 py-3 text-xs uppercase tracking-widest text-red-400 hover:bg-brand-ink/5 transition-colors border-t border-brand-ink/10">Sign Out</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setCurrentView('login')} className="text-[10px] uppercase tracking-widest hover:text-brand-gold transition-colors hidden md:block">
              Log In
            </button>
          )}
          <button 
            className="p-2 hover:bg-brand-ink/10 rounded-full transition-colors md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open user menu"
          >
            <UserIcon className="w-5 h-5" />
          </button>
          <button 
            className="p-2 hover:bg-brand-ink/10 rounded-full transition-colors relative" 
            onClick={() => setCurrentView('cart')}
            aria-label={`Open cart, ${cart.reduce((sum, item) => sum + item.quantity, 0)} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-gold text-brand-bg text-[10px] font-bold rounded-full flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

{/* Cart Drawer Removed */}

      {/* Mobile Store Mode Toggle (Visible only on small screens below nav) */}
      <div className="md:hidden flex justify-center bg-brand-bg border-b border-brand-ink/10 py-3 px-4">
        <div className="flex w-full max-w-xs bg-brand-surface p-1 rounded-full text-[10px] font-bold tracking-widest border border-brand-ink/10 shadow-sm">
          <button 
            onClick={() => setStoreMode('clothing')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full transition-all duration-300 ${storeMode === 'clothing' ? 'bg-brand-gold text-brand-bg shadow-md' : 'text-brand-gold hover:bg-brand-gold/10'}`}
          >
            <Sparkles className="w-3 h-3" />
            CLOTHING
          </button>
          <button 
            onClick={() => setStoreMode('jewellery')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full transition-all duration-300 ${storeMode === 'jewellery' ? 'bg-brand-gold text-brand-bg shadow-md' : 'text-brand-gold hover:bg-brand-gold/10'}`}
          >
            <Star className="w-3 h-3" />
            JEWELLERY
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
                src="https://i.pinimg.com/736x/90/a8/a0/90a8a061bc471f400e3e8bc2816582fe.jpg" 
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

        {/* Browse By Section */}
        {currentView === 'home' && (
          <section className="py-12 md:py-20 px-4 md:px-12 max-w-7xl mx-auto bg-brand-bg">
            <div className="text-center mb-10">
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-brand-gold mb-3 font-semibold">BROWSE BY</p>
              <h2 className="font-serif text-3xl md:text-4xl text-brand-ink">
                {storeMode === 'clothing' ? 'Browse Our Clothing' : 'Browse Our Jewellery'}
              </h2>
            </div>
            
            {storeMode === 'clothing' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Sarees */}
                <div 
                  className="relative h-[300px] md:h-[350px] rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => { setDepartment('Women'); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  <img src="https://tse1.explicit.bing.net/th/id/OIP.CuO9E3RfGo-7RYwc0OJ44gHaKt?rs=1&pid=ImgDetMain&o=7&rm=3" alt="Sarees" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-white font-bold text-xl mb-1">Sarees</h3>
                    <p className="text-brand-gold text-xs font-medium">120+ styles</p>
                  </div>
                </div>
                
                {/* Suits & Kurtas */}
                <div 
                  className="relative h-[300px] md:h-[350px] rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => { setDepartment('Women'); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  <img src="https://i.pinimg.com/736x/58/1a/05/581a050a55d0be374af6cc7053c9c8b6.jpg" alt=" Suits & Kurtas" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-white font-bold text-xl mb-1">Suits & Kurtas</h3>
                    <p className="text-brand-gold text-xs font-medium">200+ styles</p>
                  </div>
                </div>
                
                {/* Lehengas */}
                <div 
                  className="relative h-[300px] md:h-[350px] rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => { setDepartment('Women'); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  <img src="https://tse3.mm.bing.net/th/id/OIP.1O6OLaqd-eWOAS6avNkFJAHaI4?rs=1&pid=ImgDetMain&o=7&rm=3" alt="Lehengas" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-white font-bold text-xl mb-1">Lehengas</h3>
                    <p className="text-brand-gold text-xs font-medium">80+ styles</p>
                  </div>
                </div>
                
                {/* Sherwanis */}
                <div 
                  className="relative h-[300px] md:h-[350px] rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => { setDepartment('Men'); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  <img src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&auto=format&fit=crop" alt="Sherwanis" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-white font-bold text-xl mb-1">Sherwanis</h3>
                    <p className="text-brand-gold text-xs font-medium">50+ styles</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Gold Sets */}
                <div 
                  className="relative h-[300px] md:h-[350px] rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => { setDepartment('Gold'); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop" alt="Gold Sets" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-white font-bold text-xl mb-1">Gold Sets</h3>
                    <p className="text-brand-gold text-xs font-medium">150+ styles</p>
                  </div>
                </div>
                
                {/* Silver */}
                <div 
                  className="relative h-[300px] md:h-[350px] rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => { setDepartment('Silver'); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  <img src="https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=800&auto=format&fit=crop" alt="Silver" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-white font-bold text-xl mb-1">Silver</h3>
                    <p className="text-brand-gold text-xs font-medium">200+ styles</p>
                  </div>
                </div>
                
                {/* Bridal */}
                <div 
                  className="relative h-[300px] md:h-[350px] rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => { setDepartment('Bridal'); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  <img src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop" alt="Bridal" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-white font-bold text-xl mb-1">Bridal</h3>
                    <p className="text-brand-gold text-xs font-medium">90+ styles</p>
                  </div>
                </div>
                
                {/* Rings */}
                <div 
                  className="relative h-[300px] md:h-[350px] rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => { setDepartment('Rings'); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop" alt="Rings" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-white font-bold text-xl mb-1">Rings</h3>
                    <p className="text-brand-gold text-xs font-medium">300+ styles</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Shop / Filter Section */}
        <section id="shop" className="py-12 md:py-20 px-4 md:px-12 max-w-7xl mx-auto border-t border-brand-ink/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
            <div>
              <nav className="flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-widest mb-4 text-brand-ink/60">
                <button onClick={() => { setCurrentView('home'); setDepartment('All'); }} className="hover:text-brand-gold transition-colors">Home</button>
                <span>/</span>
                <button onClick={() => setDepartment('All')} className={`transition-colors ${department === 'All' ? 'text-brand-gold' : 'hover:text-brand-gold'}`}>
                  {storeMode === 'clothing' ? 'Clothing' : 'Jewellery'}
                </button>
                {department !== 'All' && (
                  <>
                    <span>/</span>
                    <span className="text-brand-gold">{department}</span>
                  </>
                )}
              </nav>
              <h3 className="font-serif text-2xl md:text-4xl mb-3">Curated Collection</h3>
              <div className="w-12 h-px bg-brand-gold mb-6"></div>
              
              {storeMode === 'clothing' && (
                <div className="flex gap-4 md:gap-8 text-xs uppercase tracking-widest font-medium overflow-x-auto pb-2">
                  {['All', 'Men', 'Women', 'Kids'].map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setDepartment(dept as 'All' | 'Men' | 'Women' | 'Kids' | 'Gold' | 'Silver' | 'Bridal' | 'Rings')}
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
                      onClick={() => setDepartment(dept as 'All' | 'Men' | 'Women' | 'Kids' | 'Gold' | 'Silver' | 'Bridal' | 'Rings')}
                      className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${department === dept ? 'border-brand-gold text-brand-gold' : 'border-transparent text-brand-ink/60 hover:text-brand-ink'}`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-brand-ink/10 pt-4 md:pt-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-gold" />
                <span className="uppercase tracking-widest text-brand-ink/60 text-[10px] md:text-xs">Filters:</span>
              </div>
              
              <div className="grid grid-cols-2 lg:flex lg:flex-row gap-3 w-full md:w-auto">
                <div className="relative">
                  <select 
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full bg-transparent border border-brand-ink/20 rounded-none text-brand-ink py-2 pl-3 pr-8 focus:outline-none focus:border-brand-gold cursor-pointer appearance-none uppercase tracking-widest text-[10px] md:text-xs transition-colors hover:border-brand-ink/40"
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D4AF37'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, 
                      backgroundPosition: 'calc(100% - 0.5rem) center', 
                      backgroundRepeat: 'no-repeat', 
                      backgroundSize: '1em' 
                    }}
                  >
                    <option value="all" className="bg-brand-surface">All Prices</option>
                    <option value="under-1000" className="bg-brand-surface">Under ₹1,000</option>
                    <option value="1000-5000" className="bg-brand-surface">₹1,000 - ₹5,000</option>
                    <option value="over-5000" className="bg-brand-surface">Over ₹5,000</option>
                  </select>
                </div>

                <div className="relative">
                  <select 
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full bg-transparent border border-brand-ink/20 rounded-none text-brand-ink py-2 pl-3 pr-8 focus:outline-none focus:border-brand-gold cursor-pointer appearance-none uppercase tracking-widest text-[10px] md:text-xs transition-colors hover:border-brand-ink/40"
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D4AF37'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, 
                      backgroundPosition: 'calc(100% - 0.5rem) center', 
                      backgroundRepeat: 'no-repeat', 
                      backgroundSize: '1em' 
                    }}
                  >
                    <option value="all" className="bg-brand-surface">All Materials</option>
                    {storeMode === 'clothing' ? (
                      <>
                        <option value="cotton" className="bg-brand-surface">Cotton</option>
                        <option value="silk" className="bg-brand-surface">Silk</option>
                        <option value="velvet" className="bg-brand-surface">Velvet</option>
                      </>
                    ) : (
                      <>
                        <option value="gold" className="bg-brand-surface">Gold</option>
                        <option value="silver" className="bg-brand-surface">Silver</option>
                        <option value="diamond" className="bg-brand-surface">Diamond</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="relative">
                  <select 
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full bg-transparent border border-brand-ink/20 rounded-none text-brand-ink py-2 pl-3 pr-8 focus:outline-none focus:border-brand-gold cursor-pointer appearance-none uppercase tracking-widest text-[10px] md:text-xs transition-colors hover:border-brand-ink/40"
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D4AF37'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, 
                      backgroundPosition: 'calc(100% - 0.5rem) center', 
                      backgroundRepeat: 'no-repeat', 
                      backgroundSize: '1em' 
                    }}
                  >
                    <option value="all" className="bg-brand-surface">All Occasions</option>
                    <option value="casual" className="bg-brand-surface">Casual</option>
                    <option value="festive" className="bg-brand-surface">Festive</option>
                    <option value="bridal" className="bg-brand-surface">Bridal</option>
                    <option value="party" className="bg-brand-surface">Party</option>
                  </select>
                </div>

                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-transparent border border-brand-ink/20 rounded-none text-brand-ink py-2 pl-3 pr-8 focus:outline-none focus:border-brand-gold cursor-pointer appearance-none uppercase tracking-widest text-[10px] md:text-xs transition-colors hover:border-brand-ink/40"
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D4AF37'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, 
                      backgroundPosition: 'calc(100% - 0.5rem) center', 
                      backgroundRepeat: 'no-repeat', 
                      backgroundSize: '1em' 
                    }}
                  >
                    <option value="featured" className="bg-brand-surface">Sort: Featured</option>
                    <option value="newest" className="bg-brand-surface">Sort: Newest</option>
                    <option value="bestsellers" className="bg-brand-surface">Sort: Best</option>
                    <option value="price-asc" className="bg-brand-surface">Low to High</option>
                    <option value="price-desc" className="bg-brand-surface">High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 md:gap-x-6 md:gap-y-10 w-full">
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
                      p.variants.forEach(variant => {
                        defaultVariants[variant.name] = variant.options[0];
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
            <div className="text-center py-24 bg-brand-surface border border-brand-ink/10 flex flex-col items-center justify-center rounded-sm">
              <div className="w-20 h-20 bg-brand-ink/5 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-brand-ink/30" />
              </div>
              <h3 className="font-serif text-2xl text-brand-ink mb-3">No results found</h3>
              <p className="text-brand-ink/60 mb-8 max-w-md mx-auto text-sm">
                No products found matching your query. Try clearing your filters or searching for something else.
              </p>
              {(searchQuery.trim() !== '' || department !== 'All' || priceRange !== 'all') && (
                <button 
                  onClick={() => {
                    setLocalSearch('');
                    setSearchQuery('');
                    setDepartment('All');
                    setPriceRange('all');
                    setMaterial('all');
                    setOccasion('all');
                  }} 
                  className="bg-brand-ink text-brand-gold px-8 py-3 text-xs uppercase tracking-widest font-medium hover:bg-brand-gold hover:text-brand-bg transition-colors"
                >
                  Clear All Filters
                </button>
              )}
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

        {/* Customer Love Section */}
        <section className="py-16 md:py-24 bg-brand-bg">
          <div className="max-w-7xl mx-auto px-4 md:px-12">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block border border-brand-ink/10 rounded-full px-6 py-2 mb-6 bg-brand-bg">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-brand-gold font-bold">CUSTOMER LOVE</p>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl text-brand-ink mb-4">What Our Customers Say</h2>
              <p className="text-brand-ink/60 max-w-xl mx-auto text-sm md:text-base">
                Real stories from real customers who found their perfect piece with us.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Testimonial 1 */}
              <div className="bg-brand-surface p-8 rounded-2xl border border-brand-ink/10 shadow-sm flex flex-col h-full">
                <div className="text-brand-gold text-4xl font-serif leading-none mb-6">"</div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />)}
                </div>
                <p className="text-brand-ink/80 leading-relaxed mb-8 flex-grow">
                  I bought my wedding lehenga from Harsh Cloth Emporium and I could not be happier! The fabric quality is outstanding and the embroidery work is stunning. Highly recommended!
                </p>
                <div className="inline-block bg-brand-gold/10 text-brand-gold text-xs font-medium px-4 py-1.5 rounded-full mb-6 self-start">
                  Bridal Lehenga
                </div>
                <div className="h-px bg-brand-ink/10 w-full mb-6"></div>
                <div className="flex items-center gap-4">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Amrita" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-brand-ink text-sm">Amrita</h4>
                    <p className="text-xs text-brand-ink/50">Gorakhpur</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 (Highlighted) */}
              <div className="bg-brand-gold p-8 rounded-2xl shadow-lg flex flex-col h-full transform md:-translate-y-4">
                <div className="text-brand-bg text-4xl font-serif leading-none mb-6">"</div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand-bg text-brand-bg" />)}
                </div>
                <p className="text-brand-bg/90 leading-relaxed mb-8 flex-grow">
                  Anand Jewellers is our go-to for every family occasion. The kundan necklace set for our daughter's wedding was absolutely breathtaking. Excellent craftsmanship!
                </p>
                <div className="inline-block bg-brand-bg/20 text-brand-bg text-xs font-medium px-4 py-1.5 rounded-full mb-6 self-start">
                  Kundan Set
                </div>
                <div className="h-px bg-brand-bg/20 w-full mb-6"></div>
                <div className="flex items-center gap-4">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" alt="Satvik Agrahari" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-brand-bg text-sm">Satvik Agrahari</h4>
                    <p className="text-xs text-brand-bg/80">Lucknow</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-brand-surface p-8 rounded-2xl border border-brand-ink/10 shadow-sm flex flex-col h-full">
                <div className="text-brand-gold text-4xl font-serif leading-none mb-6">"</div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />)}
                </div>
                <p className="text-brand-ink/80 leading-relaxed mb-8 flex-grow">
                  Bought a sherwani for my brother's reception. The fit was perfect and the material quality was premium. The staff was super helpful in selecting the right piece.
                </p>
                <div className="inline-block bg-brand-gold/10 text-brand-gold text-xs font-medium px-4 py-1.5 rounded-full mb-6 self-start">
                  Men's Sherwani
                </div>
                <div className="h-px bg-brand-ink/10 w-full mb-6"></div>
                <div className="flex items-center gap-4">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop" alt="Yash Gupta" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-brand-ink text-sm">Yash Gupta</h4>
                    <p className="text-xs text-brand-ink/50">Ambedkar Nagar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Shop With Us Section */}
        <section className="py-16 md:py-24 bg-brand-ink text-brand-bg">
          <div className="max-w-7xl mx-auto px-4 md:px-12">
            <div className="text-center mb-12 md:mb-16">
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-brand-gold mb-4 font-semibold">Why Shop With Us</p>
              <h2 className="font-serif text-3xl md:text-5xl text-brand-bg">The Harsh & Anand Promise</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-brand-gold/20 flex items-center justify-center mb-6 text-brand-gold">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-brand-bg">100% Authentic</h3>
                <p className="text-sm text-brand-bg/80 leading-relaxed max-w-xs mx-auto">
                  Every product is handpicked for quality and authenticity. We guarantee genuine fabrics and real jewellery.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-brand-gold/20 flex items-center justify-center mb-6 text-brand-gold">
                  <Truck className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-brand-bg">Fast Delivery</h3>
                <p className="text-sm text-brand-bg/80 leading-relaxed max-w-xs mx-auto">
                  Same-day delivery in Uttar Pradesh. Pan-India shipping within 3-5 business days.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-brand-gold/20 flex items-center justify-center mb-6 text-brand-gold">
                  <RefreshCw className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-brand-bg">Easy Returns</h3>
                <p className="text-sm text-brand-bg/80 leading-relaxed max-w-xs mx-auto">
                  7-day hassle-free return policy. Not satisfied? We make it right.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-brand-gold/20 flex items-center justify-center mb-6 text-brand-gold">
                  <Headphones className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl mb-3 text-brand-bg">24/7 Support</h3>
                <p className="text-sm text-brand-bg/80 leading-relaxed max-w-xs mx-auto">
                  Our team is always here to help you find the perfect piece for any occasion.
                </p>
              </div>
            </div>
          </div>
        </section>
          </>
        ) : currentView === 'contact' ? (
          <section className="min-h-[70vh] bg-brand-bg">
            {/* Header */}
            <div className="bg-brand-ink py-12 md:py-16 px-4 md:px-12">
              <div className="max-w-7xl mx-auto">
                <h1 className="font-serif text-4xl md:text-5xl text-brand-bg mb-2">Contact Us</h1>
                <p className="text-brand-gold text-sm md:text-base">We'd love to hear from you</p>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                
                {/* Left Column - Info */}
                <div>
                  <h2 className="font-serif text-2xl text-brand-ink mb-8">Visit Our Store</h2>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <MapPin className="w-5 h-5 text-brand-gold" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-brand-ink mb-1">Address</h3>
                        <p className="text-brand-ink/70 text-sm leading-relaxed">
                          Ambedkar Nagar, Uttar Pradesh,<br />
                          Uttar Pradesh 224132
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Phone className="w-5 h-5 text-brand-gold" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-brand-ink mb-1">Phone</h3>
                        <p className="text-brand-ink/70 text-sm">+91 8875810604</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Mail className="w-5 h-5 text-brand-gold" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-brand-ink mb-1">Email</h3>
                        <p className="text-brand-ink/70 text-sm">harshgupta07h@gmail.com</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Clock className="w-5 h-5 text-brand-gold" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-brand-ink mb-1">Hours</h3>
                        <p className="text-brand-ink/70 text-sm">Mon–Sun: 10:00 AM – 8:00 PM</p>
                      </div>
                    </div>
                  </div>

                  {/* Map Image Placeholder */}
                  <div className="rounded-lg overflow-hidden border border-brand-ink/10 h-48 md:h-64 relative">
                    <img 
                      src="https://tse2.mm.bing.net/th/id/OIP.t9Q5l1H1tQ4z8a3Cj-c5XQHaEK?rs=1&pid=ImgDetMain" 
                      alt="Map of Uttar Pradesh" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-brand-surface px-3 py-1.5 rounded shadow-sm text-sm font-medium text-blue-600 flex items-center gap-1 cursor-pointer hover:bg-brand-ink/5">
                      Maps <ArrowRight className="w-3 h-3 -rotate-45" />
                    </div>
                  </div>
                </div>

                {/* Right Column - Form */}
                <div className="bg-brand-surface p-8 md:p-10 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-brand-ink/5">
                  <h2 className="font-serif text-2xl text-brand-ink mb-8">Send Us a Message</h2>
                  
                  <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setToast({ message: 'Message sent successfully!', id: Date.now() }); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs text-brand-ink mb-2 font-medium">Full Name *</label>
                        <input 
                          type="text" 
                          required
                          className="w-full border border-brand-ink/20 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#A0522D] transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-brand-ink mb-2 font-medium">Phone Number</label>
                        <input 
                          type="tel" 
                          className="w-full border border-brand-ink/20 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#A0522D] transition-colors"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-brand-ink mb-2 font-medium">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        className="w-full border border-brand-ink/20 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#A0522D] transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-brand-ink mb-2 font-medium">Subject</label>
                      <input 
                        type="text" 
                        className="w-full border border-brand-ink/20 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#A0522D] transition-colors"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-brand-ink mb-2 font-medium">Message *</label>
                      <textarea 
                        required
                        rows={4}
                        className="w-full border border-brand-ink/20 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#A0522D] transition-colors resize-y"
                        placeholder="Tell us about your requirements..."
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-brand-gold hover:bg-brand-gold/80 text-brand-bg font-medium py-3.5 rounded transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </section>
        ) : currentView === 'wishlist' ? (
          <section className="py-12 md:py-20 px-4 md:px-12 max-w-7xl mx-auto min-h-[60vh]">
            <h2 className="font-serif text-3xl md:text-5xl mb-8">My Wishlist</h2>
            {wishlist.length === 0 ? (
              <div className="text-center py-24 bg-brand-surface border border-brand-ink/10 flex flex-col items-center justify-center rounded-sm">
                <div className="w-24 h-24 bg-brand-ink/5 rounded-full flex items-center justify-center mb-6">
                  <Heart className="w-12 h-12 text-brand-ink/30" />
                </div>
                <h3 className="font-serif text-3xl text-brand-ink mb-3">No favorites yet</h3>
                <p className="text-brand-ink/60 mb-8 max-w-md mx-auto text-sm md:text-base">Save the items you love here so you can easily find them later. Tap the heart icon on any product to add it to your wishlist.</p>
                <button onClick={() => setCurrentView('home')} className="bg-brand-gold text-brand-bg px-10 py-4 text-xs uppercase tracking-widest font-medium hover:bg-brand-ink hover:text-brand-gold transition-colors">
                  Discover Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 md:gap-x-6 md:gap-y-10 w-full">
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
                  <img src={user.photoURL} alt="Profile" className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-gold text-brand-bg flex items-center justify-center text-2xl md:text-3xl font-serif">
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
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                      type="submit" 
                      disabled={isSavingProfile}
                      className="w-full sm:w-auto bg-brand-gold text-brand-bg px-8 py-3 text-xs uppercase tracking-widest font-medium hover:bg-brand-ink hover:text-brand-gold transition-colors disabled:opacity-50"
                    >
                      {isSavingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsEditingProfile(false)}
                      className="w-full sm:w-auto border border-brand-ink/20 text-brand-ink px-8 py-3 text-xs uppercase tracking-widest font-medium hover:border-brand-ink transition-colors"
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
              <div className="text-center py-24 bg-brand-surface border border-brand-ink/10 flex flex-col items-center justify-center rounded-sm">
                <div className="w-24 h-24 bg-brand-ink/5 rounded-full flex items-center justify-center mb-6">
                  <PackageOpen className="w-12 h-12 text-brand-ink/30" />
                </div>
                <h3 className="font-serif text-3xl text-brand-ink mb-3">No orders found</h3>
                <p className="text-brand-ink/60 mb-8 max-w-md mx-auto text-sm md:text-base">You haven't placed any orders yet. Once you make a purchase, your order details and status will appear here.</p>
                <button onClick={() => setCurrentView('home')} className="bg-brand-gold text-brand-bg px-10 py-4 text-xs uppercase tracking-widest font-medium hover:bg-brand-ink hover:text-brand-gold transition-colors">
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {orders.slice((ordersPage - 1) * 5, ordersPage * 5).map(order => (
                  <div key={order.id} className="bg-brand-surface border border-brand-ink/10 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-brand-ink/10 gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-brand-ink/60 mb-1">Order Placed</p>
                        <p className="text-sm font-medium text-brand-ink">
                          {order.createdAt ? new Date(order.createdAt.toMillis ? order.createdAt.toMillis() : order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Processing...'}
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
                      <div className="flex flex-col items-end gap-2">
                        <span className={`inline-block px-3 py-1 text-[10px] uppercase tracking-widest font-medium ${order.status === 'cancelled' ? 'bg-red-500/10 text-red-600' : 'bg-brand-gold/10 text-brand-gold'}`}>
                          {order.status}
                        </span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleReorder(order)}
                            className="inline-block px-3 py-1 bg-brand-ink hover:bg-brand-gold text-brand-surface text-[10px] uppercase tracking-widest font-medium transition-colors border border-brand-ink rounded cursor-pointer"
                          >
                            Reorder
                          </button>
                          <button 
                            onClick={() => {
                              const printWindow = window.open('', '_blank');
                            if (printWindow) {
                              const productDetails = (order.items || []).map((item: any) => {
                                const p = PRODUCTS.find(p => p.id === item.productId);
                                let variantsHtml = '';
                                if (item.variants && Object.keys(item.variants).length > 0) {
                                  variantsHtml = `<br/><span style="font-size: 10px; color: #666; text-transform: uppercase;">${Object.entries(item.variants).map(([k,v]) => `${k}: ${v}`).join(' | ')}</span>`;
                                }
                                return p ? `<tr>
                                  <td style="padding: 12px; border-bottom: 1px solid #ddd;">${p.name} (Qty: ${item.quantity})${variantsHtml}</td>
                                  <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">₹${(p.price * item.quantity).toLocaleString('en-IN')}</td>
                                </tr>` : '';
                              }).join('');

                              const subtotal = order.totalAmount || 0;
                              const tax = Math.round(subtotal * 0.18);
                              const total = subtotal + tax;

                              printWindow.document.write(`
                                <!DOCTYPE html>
                                <html>
                                  <head>
                                    <title>Premium Invoice - ${order.id}</title>
                                    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
                                    <style>
                                      :root {
                                        --ink: #1a1a1a;
                                        --gold: #c5a059;
                                        --surface: #ffffff;
                                        --muted: #f9f9f9;
                                        --border: #eaeaea;
                                      }
                                      body { 
                                        font-family: 'Inter', sans-serif; 
                                        color: var(--ink); 
                                        max-width: 850px; 
                                        margin: 0 auto; 
                                        padding: 60px 40px;
                                        background-color: var(--surface);
                                        -webkit-font-smoothing: antialiased;
                                      }
                                      .invoice-container {
                                        border: 1px solid var(--border);
                                        padding: 50px;
                                        box-shadow: 0 10px 30px rgba(0,0,0,0.02);
                                      }
                                      .header { 
                                        text-align: center; 
                                        margin-bottom: 50px; 
                                        padding-bottom: 30px;
                                        position: relative;
                                      }
                                      .header::after {
                                        content: '';
                                        position: absolute;
                                        bottom: 0;
                                        left: 50%;
                                        transform: translateX(-50%);
                                        width: 60px;
                                        height: 2px;
                                        background-color: var(--gold);
                                      }
                                      .shop-title {
                                        font-family: 'Playfair Display', serif;
                                        font-size: 32px;
                                        font-weight: 700;
                                        margin: 0 0 10px 0;
                                        letter-spacing: 1px;
                                        color: var(--ink);
                                      }
                                      .shop-subtitle {
                                        font-size: 12px;
                                        text-transform: uppercase;
                                        letter-spacing: 3px;
                                        color: var(--gold);
                                        margin: 0 0 15px 0;
                                        font-weight: 500;
                                      }
                                      .shop-address {
                                        font-size: 13px;
                                        color: #666;
                                        line-height: 1.6;
                                      }
                                      .invoice-meta {
                                        display: flex;
                                        justify-content: space-between;
                                        background-color: var(--muted);
                                        padding: 25px 30px;
                                        border-left: 3px solid var(--gold);
                                        margin-bottom: 40px;
                                        font-size: 13px;
                                      }
                                      .meta-block strong {
                                        font-size: 10px;
                                        text-transform: uppercase;
                                        letter-spacing: 1.5px;
                                        color: #888;
                                        display: block;
                                        margin-bottom: 8px;
                                      }
                                      .meta-value {
                                        font-weight: 500;
                                        font-size: 14px;
                                        color: var(--ink);
                                      }
                                      .invoice-details { 
                                        display: flex; 
                                        justify-content: space-between; 
                                        margin-bottom: 50px; 
                                      }
                                      .bill-to h3 {
                                        font-family: 'Playfair Display', serif;
                                        font-size: 18px;
                                        margin: 0 0 15px 0;
                                        color: var(--ink);
                                      }
                                      .bill-to p {
                                        margin: 0 0 5px 0;
                                        font-size: 14px;
                                        color: #555;
                                        line-height: 1.5;
                                      }
                                      table { 
                                        width: 100%; 
                                        border-collapse: collapse; 
                                        margin-bottom: 40px; 
                                      }
                                      th { 
                                        border-bottom: 1px solid var(--border); 
                                        padding: 15px; 
                                        text-align: left; 
                                        font-size: 11px;
                                        text-transform: uppercase;
                                        letter-spacing: 1.5px;
                                        color: #888;
                                        font-weight: 600;
                                      }
                                      td {
                                        padding: 20px 15px;
                                        border-bottom: 1px solid var(--border);
                                        font-size: 14px;
                                        color: #333;
                                      }
                                      .item-name {
                                        font-weight: 500;
                                        color: var(--ink);
                                      }
                                      .totals { 
                                        margin-left: auto; 
                                        width: 350px; 
                                      }
                                      .totals-row { 
                                        display: flex; 
                                        justify-content: space-between; 
                                        padding: 12px 0; 
                                        font-size: 14px;
                                        color: #555;
                                      }
                                      .totals-row.final { 
                                        border-top: 1px solid var(--ink); 
                                        border-bottom: 1px solid var(--ink); 
                                        font-weight: 600; 
                                        font-size: 18px; 
                                        color: var(--ink);
                                        margin-top: 10px;
                                        padding: 20px 0;
                                      }
                                      .footer {
                                        margin-top: 80px; 
                                        text-align: center; 
                                      }
                                      .footer p {
                                        color: #888; 
                                        font-size: 12px; 
                                        line-height: 1.6;
                                        margin: 0;
                                      }
                                      .thank-you {
                                        font-family: 'Playfair Display', serif;
                                        font-size: 24px;
                                        font-style: italic;
                                        color: var(--ink);
                                        margin-bottom: 15px;
                                      }
                                      @media print { 
                                        body { padding: 0; background-color: white; } 
                                        .invoice-container { border: none; box-shadow: none; padding: 0; }
                                      }
                                    </style>
                                  </head>
                                  <body>
                                    <div class="invoice-container">
                                      <div class="header">
                                        <h1 class="shop-title">${brandInfo.title}</h1>
                                        <p class="shop-subtitle">${brandInfo.sub}</p>
                                        <div class="shop-address">
                                          Ambedkar Nagar, Uttar Pradesh<br/>
                                          harshgupta07h@gmail.com | Ph: +91 8875810604
                                        </div>
                                      </div>
                                      
                                      <div class="invoice-meta">
                                        <div class="meta-block">
                                          <strong>Invoice Number</strong>
                                          <div class="meta-value">INV-${order.id.slice(-8).toUpperCase()}</div>
                                        </div>
                                        <div class="meta-block">
                                          <strong>Date of Issue</strong>
                                          <div class="meta-value">${order.createdAt ? new Date(order.createdAt.toMillis ? order.createdAt.toMillis() : order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Processing'}</div>
                                        </div>
                                        <div class="meta-block">
                                          <strong>Payment Method</strong>
                                          <div class="meta-value">${order.paymentMethod?.toUpperCase() || 'N/A'}</div>
                                        </div>
                                      </div>

                                      <div class="invoice-details">
                                        <div class="bill-to">
                                          <h3>Billed To</h3>
                                          <p><strong style="color: var(--ink)">${order.shippingInfo?.fullName || 'Customer'}</strong></p>
                                          <p>${order.shippingInfo?.address || 'N/A'}</p>
                                          <p>${order.shippingInfo?.city || ''}, ${order.shippingInfo?.state || ''} ${order.shippingInfo?.pincode || ''}</p>
                                          <p style="margin-top: 10px">Ph: ${order.shippingInfo?.phone || 'N/A'}</p>
                                          <p>${order.shippingInfo?.email || ''}</p>
                                        </div>
                                      </div>

                                      <table>
                                        <thead>
                                          <tr>
                                            <th>Item Description</th>
                                            <th style="text-align: center;">Qty</th>
                                            <th style="text-align: right;">Amount</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          ${(order.items || []).map((item: any) => {
                                            const p = PRODUCTS.find(p => p.id === item.productId);
                                            let variantsHtml = '';
                                            if (item.variants && Object.keys(item.variants).length > 0) {
                                              variantsHtml = `<div style="font-size: 10px; color: #666; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em;">${Object.entries(item.variants).map(([k,v]) => `${k}: ${v}`).join(' | ')}</div>`;
                                            }
                                            return p ? `<tr>
                                              <td>
                                                <div class="item-name">${p.name}</div>
                                                ${variantsHtml}
                                              </td>
                                              <td style="text-align: center; color: #666">${item.quantity}</td>
                                              <td style="text-align: right; color: var(--ink); font-weight: 500">₹${(p.price * item.quantity).toLocaleString('en-IN')}</td>
                                            </tr>` : '';
                                          }).join('')}
                                        </tbody>
                                      </table>

                                      <div class="totals">
                                        <div class="totals-row">
                                          <span>Subtotal</span>
                                          <span>₹${subtotal.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div class="totals-row">
                                          <span>Estimated Tax (18%)</span>
                                          <span>₹${tax.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div class="totals-row final">
                                          <span>Total</span>
                                          <span>₹${total.toLocaleString('en-IN')}</span>
                                        </div>
                                      </div>

                                      <div class="footer">
                                        <div class="thank-you">Thank you for your business.</div>
                                        <p>This is a computer generated premium invoice<br/>and does not require a physical signature.</p>
                                      </div>
                                    </div>
                                    <script>
                                      window.onload = () => { setTimeout(() => { window.print(); }, 800); }
                                    </script>
                                  </body>
                                </html>
                              `);
                              printWindow.document.close();
                            }
                          }}
                          className="inline-block px-3 py-1 bg-brand-ink/5 hover:bg-brand-ink/10 text-brand-ink text-[10px] uppercase tracking-widest font-medium transition-colors border border-brand-ink/20 rounded cursor-pointer"
                        >
                          View Bill
                        </button>
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => setOrderToCancel(order.id)}
                            className="inline-block px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] uppercase tracking-widest font-medium transition-colors border border-red-200 rounded cursor-pointer"
                          >
                            Cancel Order
                          </button>
                        )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Fulfillment Timeline */}
                    <div className="mb-12 mt-6 pt-6 border-t border-brand-ink/5">
                      <div className="relative flex justify-between items-center w-full max-w-3xl mx-auto px-4 md:px-8">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-brand-ink/10 -translate-y-1/2 z-0"></div>
                        
                        {/* Dynamic Progress Line */}
                        <div className="absolute top-1/2 left-8 h-[2px] bg-brand-gold -translate-y-1/2 z-0 transition-all duration-500" 
                             style={{ 
                               width: order.status === 'delivered' ? 'calc(100% - 64px)' : 
                                      order.status === 'shipped' ? 'calc(66.66% - 32px)' : 
                                      order.status === 'processing' ? 'calc(33.33% - 16px)' : '0%' 
                             }}>
                        </div>

                        {[
                          { key: 'pending', label: 'Placed', icon: PackageOpen },
                          { key: 'processing', label: 'Processing', icon: RefreshCw },
                          { key: 'shipped', label: 'Shipped', icon: Truck },
                          { key: 'delivered', label: 'Delivered', icon: ShieldCheck }
                        ].map((step, stepIdx) => {
                          const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
                          const currentIdx = statusOrder.indexOf(order.status?.toLowerCase() || 'pending');
                          const isCompleted = stepIdx <= currentIdx;
                          const isActive = stepIdx === currentIdx;
                          const StepIcon = step.icon;

                          return (
                            <div key={step.key} className="relative z-10 flex flex-col items-center">
                              <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-brand-gold text-brand-bg border-4 border-brand-surface shadow-sm' : 'bg-brand-surface text-brand-ink/30 border-2 border-brand-ink/10'} ${isActive ? 'ring-4 ring-brand-gold/20' : ''}`}>
                                <StepIcon className="w-4 h-4 md:w-5 md:h-5" />
                              </div>
                              <span className={`absolute top-14 text-[9px] md:text-xs font-bold uppercase tracking-widest text-center w-24 ${isCompleted ? 'text-brand-ink' : 'text-brand-ink/40'} ${isActive ? 'text-brand-gold' : ''}`}>
                                {step.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    
                    <div className="space-y-6 mt-16 pt-6 border-t border-brand-ink/5">
                      {(order.items || []).map((item: OrderItem, idx: number) => {
                        const product = PRODUCTS.find(p => p.id === item.productId);
                        if (!product) return null;
                        return (
                          <div key={idx} className="flex gap-4 md:gap-6">
                            <img src={product.image} alt={product.name} className="w-20 h-24 md:w-24 md:h-32 object-cover" referrerPolicy="no-referrer" />
                            <div className="flex-grow">
                              <h4 className="font-serif text-base md:text-xl text-brand-ink">{product.name}</h4>
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
                
                {/* Pagination Controls */}
                {orders.length > 5 && (
                  <div className="flex justify-center items-center gap-4 mt-12 bg-brand-surface p-4 rounded-xl shadow-sm border border-brand-ink/5">
                    <button 
                      onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                      disabled={ordersPage === 1}
                      className="p-2 disabled:opacity-50 hover:bg-brand-ink/5 rounded-full transition-colors"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-2">
                      {Array.from({ length: Math.ceil(orders.length / 5) }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setOrdersPage(i + 1)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${ordersPage === i + 1 ? 'bg-brand-ink text-brand-surface' : 'hover:bg-brand-ink/5 text-brand-ink/70'}`}
                          aria-label={`Go to page ${i + 1}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setOrdersPage(p => Math.min(Math.ceil(orders.length / 5), p + 1))}
                      disabled={ordersPage === Math.ceil(orders.length / 5)}
                      className="p-2 disabled:opacity-50 hover:bg-brand-ink/5 rounded-full transition-colors"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Cancel Modal */}
            <AnimatePresence>
              {orderToCancel && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-brand-ink/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
                  onClick={() => setOrderToCancel(null)}
                >
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-brand-surface border border-brand-ink/10 p-6 md:p-8 max-w-sm w-full relative shadow-2xl rounded-2xl"
                    onClick={e => e.stopPropagation()}
                  >
                    <button 
                      onClick={() => setOrderToCancel(null)}
                      className="absolute top-4 right-4 text-brand-ink/50 hover:text-brand-ink"
                      aria-label="Close cancellation modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-6">
                      <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-brand-ink mb-2">Cancel Order?</h3>
                    <p className="text-brand-ink/70 text-sm mb-8 leading-relaxed">Are you sure you want to cancel this order? This action cannot be undone.</p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setOrderToCancel(null)}
                        className="flex-1 py-3 text-sm font-medium border border-brand-ink/20 hover:bg-brand-ink/5 transition-colors rounded-xl"
                      >
                        Keep Order
                      </button>
                      <button 
                        onClick={confirmCancelOrder}
                        className="flex-1 py-3 text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors rounded-xl shadow-lg shadow-red-600/20"
                      >
                        Yes, Cancel
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        ) : currentView === 'login' ? (
          <Login onLoginSuccess={(view, token, userData) => { setCurrentView(view); setUser(userData); }} />
        ) : currentView === 'admin' && user?.isAdmin ? (
          <AdminPanel user={user} />
        ) : currentView === 'cart' || currentView === 'checkout' ? (
          <div>
            {/* Header */}
            <div className="bg-[#2a1306] py-12 md:py-20 px-4 md:px-12 relative overflow-hidden">
               <div className="max-w-7xl mx-auto relative z-10">
                 <div className="inline-block border border-brand-gold/30 rounded-full px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold mb-4 text-brand-gold">
                   YOUR BAG
                 </div>
                 <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">
                   {currentView === 'cart' ? 'Shopping Cart' : 'Checkout'}
                 </h1>
                 <p className="text-brand-gold/80">{cart.reduce((sum, item) => sum + item.quantity, 0)} items in your cart</p>
               </div>
               
               {/* Decorative background circle */}
               <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-[#3a1d0b] rounded-full blur-[80px] -translate-y-1/4 translate-x-1/4 opacity-60 pointer-events-none"></div>
            </div>

            <div className="bg-[#f9f9f9] min-h-[50vh] py-12 px-4 md:px-12">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                
                {/* Left Column (Items or Checkout Forms) */}
                <div className="flex-grow space-y-6">
                  {currentView === 'cart' ? (
                    <>
                      <div className="bg-brand-surface rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-brand-ink/5 p-6 md:p-8">
                        {cart.length === 0 ? (
                          <div className="text-center py-12">
                            <ShoppingCart className="w-12 h-12 text-brand-ink/20 mx-auto mb-4" />
                            <h3 className="font-serif text-2xl text-brand-ink mb-2">Your cart is empty</h3>
                            <button onClick={() => setCurrentView('home')} className="mt-6 text-brand-gold font-medium uppercase text-xs tracking-widest hover:text-brand-ink transition-colors">Start Shopping</button>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {cart.map((item, idx) => {
                              const product = PRODUCTS.find(p => p.id === item.productId);
                              if (!product) return null;
                              return (
                                <div key={idx} className="flex items-center gap-6 relative group">
                                  <img src={product.image} alt={product.name} className="w-24 h-32 object-cover rounded shadow-sm" referrerPolicy="no-referrer" />
                                  <div className="flex-grow py-1 pr-8">
                                    <p className="text-[#da7c44] text-xs font-medium mb-1">{product.category}</p>
                                    <h4 className="font-serif text-lg font-bold text-brand-ink">{product.name}</h4>
                                    {item.variants && Object.keys(item.variants).length > 0 && (
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {Object.entries(item.variants).map(([key, val]) => (
                                          <span key={key} className="text-[10px] uppercase tracking-widest bg-brand-ink/5 text-brand-ink/70 px-2 py-0.5 rounded-sm">
                                            {key}: <span className="font-bold text-brand-ink">{val as string}</span>
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center gap-4 mt-5">
                                      <div className="flex items-center bg-[#f4f4f4] rounded-full px-3 py-1.5">
                                        <button 
                                          onClick={() => {
                                             if (item.quantity > 1) {
                                                setCart(prev => prev.map((c, i) => i === idx ? { ...c, quantity: c.quantity - 1 } : c));
                                             }
                                          }}
                                          className="text-brand-ink/50 hover:text-brand-ink px-2"
                                          aria-label={`Decrease quantity for ${product.name}`}
                                        >−</button>
                                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                        <button 
                                          onClick={() => {
                                             setCart(prev => prev.map((c, i) => i === idx ? { ...c, quantity: c.quantity + 1 } : c));
                                          }}
                                          className="text-brand-ink/50 hover:text-brand-ink px-2"
                                          aria-label={`Increase quantity for ${product.name}`}
                                        >+</button>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col items-end py-1 h-full min-h-[100px]">
                                    <button 
                                      onClick={() => setCart(prev => prev.filter((_, i) => i !== idx))}
                                      className="text-brand-ink/30 hover:text-red-500 transition-colors mb-auto p-1"
                                      aria-label={`Remove ${product.name} from cart`}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="text-right">
                                      <span className="font-bold text-brand-ink text-lg">₹{(product.price * item.quantity).toLocaleString('en-IN')}</span>
                                      <p className="text-xs text-brand-ink/40">₹{product.price.toLocaleString('en-IN')} each</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      
                      <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 text-[#da7c44] font-medium text-sm hover:text-brand-ink transition-colors mt-6 px-2">
                        <span>←</span> Continue Shopping
                      </button>
                    </>
                  ) : (
                    <form id="checkout-form" onSubmit={completeCheckout} className="space-y-6 w-full max-w-2xl">
                      {/* Personal Information */}
                      <div className="bg-brand-surface rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 md:p-8">
                        <h3 className="font-serif text-xl font-bold mb-6 text-brand-ink">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-xs font-bold text-brand-ink/80 mb-2">Full Name *</label>
                            <input type="text" className={`w-full border ${checkoutErrors.fullName && hasSubmittedCheckout ? 'border-red-500' : 'border-brand-ink/10'} rounded-lg p-3 text-sm focus:outline-none focus:border-brand-gold bg-transparent`} value={checkoutData.fullName} onChange={e => setCheckoutData({...checkoutData, fullName: e.target.value})} />
                            {checkoutErrors.fullName && hasSubmittedCheckout && <p className="text-red-500 text-xs mt-1">{checkoutErrors.fullName}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-brand-ink/80 mb-2">Phone Number *</label>
                            <input type="tel" className={`w-full border ${checkoutErrors.phone && hasSubmittedCheckout ? 'border-red-500' : 'border-brand-ink/10'} rounded-lg p-3 text-sm focus:outline-none focus:border-brand-gold bg-transparent`} value={checkoutData.phone} onChange={e => setCheckoutData({...checkoutData, phone: e.target.value})} maxLength={10} />
                            {checkoutErrors.phone && hasSubmittedCheckout && <p className="text-red-500 text-xs mt-1">{checkoutErrors.phone}</p>}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-brand-ink/80 mb-2">Email Address *</label>
                          <input type="email" className={`w-full border ${checkoutErrors.email && hasSubmittedCheckout ? 'border-red-500' : 'border-brand-ink/10'} rounded-lg p-3 text-sm focus:outline-none focus:border-brand-gold bg-transparent`} value={checkoutData.email} onChange={e => setCheckoutData({...checkoutData, email: e.target.value})} />
                          {checkoutErrors.email && hasSubmittedCheckout && <p className="text-red-500 text-xs mt-1">{checkoutErrors.email}</p>}
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="bg-brand-surface rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 md:p-8">
                        <h3 className="font-serif text-xl font-bold mb-6 text-brand-ink">Delivery Address</h3>
                        <div className="mb-4">
                          <label className="block text-xs font-bold text-brand-ink/80 mb-2">Full Address *</label>
                          <textarea placeholder="House No, Street, Locality" className={`w-full border ${checkoutErrors.address && hasSubmittedCheckout ? 'border-red-500' : 'border-brand-ink/10'} rounded-lg p-3 text-sm focus:outline-none focus:border-brand-gold bg-transparent`} rows={2} value={checkoutData.address} onChange={e => setCheckoutData({...checkoutData, address: e.target.value})}></textarea>
                          {checkoutErrors.address && hasSubmittedCheckout && <p className="text-red-500 text-xs mt-1">{checkoutErrors.address}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-brand-ink/80 mb-2">City *</label>
                            <input type="text" className={`w-full border ${checkoutErrors.city && hasSubmittedCheckout ? 'border-red-500' : 'border-brand-ink/10'} rounded-lg p-3 text-sm focus:outline-none focus:border-brand-gold bg-transparent`} value={checkoutData.city} onChange={e => setCheckoutData({...checkoutData, city: e.target.value})} />
                            {checkoutErrors.city && hasSubmittedCheckout && <p className="text-red-500 text-xs mt-1">{checkoutErrors.city}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-brand-ink/80 mb-2">Pincode *</label>
                            <input type="text" maxLength={6} className={`w-full border ${checkoutErrors.pincode && hasSubmittedCheckout ? 'border-red-500' : 'border-brand-ink/10'} rounded-lg p-3 text-sm focus:outline-none focus:border-brand-gold bg-transparent`} value={checkoutData.pincode} onChange={e => setCheckoutData({...checkoutData, pincode: e.target.value})} />
                            {checkoutErrors.pincode && hasSubmittedCheckout && <p className="text-red-500 text-xs mt-1">{checkoutErrors.pincode}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-brand-ink/80 mb-2">State *</label>
                            <input type="text" className={`w-full border ${checkoutErrors.state && hasSubmittedCheckout ? 'border-red-500' : 'border-brand-ink/10'} rounded-lg p-3 text-sm focus:outline-none focus:border-brand-gold bg-transparent`} value={checkoutData.state} onChange={e => setCheckoutData({...checkoutData, state: e.target.value})} />
                            {checkoutErrors.state && hasSubmittedCheckout && <p className="text-red-500 text-xs mt-1">{checkoutErrors.state}</p>}
                          </div>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="bg-brand-surface rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 md:p-8">
                        <h3 className="font-serif text-xl font-bold mb-6 text-brand-ink">Payment Method</h3>
                        <div className="space-y-3">
                          <label className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-all ${checkoutData.paymentMethod === 'cod' ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-ink/10'}`}>
                            <div className="flex items-center pt-1">
                              <input type="radio" value="cod" checked={checkoutData.paymentMethod === 'cod'} onChange={e => setCheckoutData({...checkoutData, paymentMethod: e.target.value})} className="accent-brand-gold w-4 h-4" />
                            </div>
                            <div className="text-brand-gold mt-1"><Banknote className="w-5 h-5" /></div>
                            <div>
                              <div className="font-bold text-sm text-brand-ink">Cash on Delivery</div>
                              <div className="text-xs text-brand-ink/60 mt-1">Pay when your order arrives</div>
                            </div>
                          </label>
                          <label className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-all ${checkoutData.paymentMethod === 'upi' ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-ink/10'}`}>
                            <div className="flex items-center pt-1">
                              <input type="radio" value="upi" checked={checkoutData.paymentMethod === 'upi'} onChange={e => setCheckoutData({...checkoutData, paymentMethod: e.target.value})} className="accent-brand-gold w-4 h-4" />
                            </div>
                            <div className="text-brand-gold mt-1"><Smartphone className="w-5 h-5" /></div>
                            <div>
                              <div className="font-bold text-sm text-brand-ink">UPI / Online Payment</div>
                              <div className="text-xs text-brand-ink/60 mt-1">PhonePe, GPay, Paytm, etc.</div>
                            </div>
                          </label>
                          <label className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-all ${checkoutData.paymentMethod === 'card' ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-ink/10'}`}>
                            <div className="flex items-center pt-1">
                              <input type="radio" value="card" checked={checkoutData.paymentMethod === 'card'} onChange={e => setCheckoutData({...checkoutData, paymentMethod: e.target.value})} className="accent-brand-gold w-4 h-4" />
                            </div>
                            <div className="text-brand-gold mt-1"><CreditCard className="w-5 h-5" /></div>
                            <div>
                              <div className="font-bold text-sm text-brand-ink">Credit / Debit Card</div>
                              <div className="text-xs text-brand-ink/60 mt-1">Visa, MasterCard, Amex, RuPay</div>
                            </div>
                          </label>
                          {checkoutData.paymentMethod === 'card' && (
                            <div className="mt-4 pl-12 pr-4 space-y-4">
                              <div>
                                <label className="block text-xs font-bold text-brand-ink/80 mb-1">Card Number *</label>
                                <input type="text" maxLength={16} placeholder="0000 0000 0000 0000" className={`w-full border ${checkoutErrors.cardNumber && hasSubmittedCheckout ? 'border-red-500' : 'border-brand-ink/10'} rounded-lg p-3 text-sm focus:outline-none focus:border-brand-gold bg-transparent`} value={checkoutData.cardNumber} onChange={e => setCheckoutData({...checkoutData, cardNumber: e.target.value.replace(/\D/g, '')})} />
                                {checkoutErrors.cardNumber && hasSubmittedCheckout && <p className="text-red-500 text-xs mt-1">{checkoutErrors.cardNumber}</p>}
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-brand-ink/80 mb-1">Expiry (MM/YY) *</label>
                                  <input type="text" maxLength={5} placeholder="MM/YY" className={`w-full border ${checkoutErrors.expiry && hasSubmittedCheckout ? 'border-red-500' : 'border-brand-ink/10'} rounded-lg p-3 text-sm focus:outline-none focus:border-brand-gold bg-transparent`} value={checkoutData.expiry} onChange={e => {
                                    let val = e.target.value.replace(/\D/g, '');
                                    if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                                    setCheckoutData({...checkoutData, expiry: val});
                                  }} />
                                  {checkoutErrors.expiry && hasSubmittedCheckout && <p className="text-red-500 text-xs mt-1">{checkoutErrors.expiry}</p>}
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-brand-ink/80 mb-1">CVV *</label>
                                  <input type="password" maxLength={4} placeholder="123" className={`w-full border ${checkoutErrors.cvv && hasSubmittedCheckout ? 'border-red-500' : 'border-brand-ink/10'} rounded-lg p-3 text-sm focus:outline-none focus:border-brand-gold bg-transparent`} value={checkoutData.cvv} onChange={e => setCheckoutData({...checkoutData, cvv: e.target.value.replace(/\D/g, '')})} />
                                  {checkoutErrors.cvv && hasSubmittedCheckout && <p className="text-red-500 text-xs mt-1">{checkoutErrors.cvv}</p>}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </form>
                  )}
                </div>

                {/* Right Column (Order Summary) */}
                <div className="w-full lg:w-[380px] flex-shrink-0">
                  <div className="bg-brand-surface rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-brand-ink/5 p-6 md:p-8 sticky top-24 relative overflow-hidden">
                     <h3 className="font-serif text-xl font-bold mb-6 text-brand-ink">Order Summary</h3>
                     
                     {currentView === 'cart' ? (
                       <div className="space-y-4 mb-6 border-b border-brand-ink/10 pb-6">
                         {cart.map((item, idx) => {
                           const product = PRODUCTS.find(p => p.id === item.productId);
                           if (!product) return null;
                           return (
                             <div key={idx} className="flex justify-between items-start text-sm">
                               <div className="flex-grow pr-4">
                                 <span className="text-brand-ink/70 break-words block leading-snug">{product.name} <span className="text-brand-ink/40 text-[10px] ml-1">x{item.quantity}</span></span>
                                 {item.variants && Object.keys(item.variants).length > 0 && (
                                   <span className="text-[10px] text-brand-ink/50 uppercase tracking-widest block mt-1">
                                     {Object.entries(item.variants).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                                   </span>
                                 )}
                               </div>
                               <span className="font-bold text-brand-ink font-serif whitespace-nowrap mt-0.5">₹{(product.price * item.quantity).toLocaleString('en-IN')}</span>
                             </div>
                           );
                         })}
                       </div>
                     ) : (
                       <div className="space-y-5 mb-6 border-b border-brand-ink/10 pb-6">
                         {cart.map((item, idx) => {
                           const product = PRODUCTS.find(p => p.id === item.productId);
                           if (!product) return null;
                           return (
                             <div key={idx} className="flex gap-3 text-sm items-start">
                               <img src={product.image} className="w-12 h-16 object-cover rounded shadow-sm flex-shrink-0" alt={product.name} referrerPolicy="no-referrer" />
                               <div className="flex-grow pt-0.5">
                                  <div className="text-brand-ink/80 text-xs font-semibold leading-tight pr-4">{product.name}</div>
                                  {item.variants && Object.keys(item.variants).length > 0 && (
                                    <div className="text-[9px] text-brand-ink/50 uppercase tracking-widest mt-1">
                                      {Object.entries(item.variants).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                                    </div>
                                  )}
                                  <div className="flex justify-between items-end mt-1.5">
                                    <div className="text-[10px] text-brand-ink/50 uppercase tracking-widest">Qty: {item.quantity}</div>
                                    <div className="text-xs font-bold text-[#da7c44] font-serif">₹{(product.price * item.quantity).toLocaleString('en-IN')}</div>
                                  </div>
                               </div>
                             </div>
                           )
                         })}
                       </div>
                     )}

                     <div className="space-y-4 text-sm">
                       <div className="flex justify-between items-center">
                         <span className="text-brand-ink/60">Subtotal</span>
                         <span className="text-brand-ink font-serif font-bold">₹{cart.reduce((s,i) => s + ((PRODUCTS.find(p => p.id === i.productId)?.price || 0) * i.quantity), 0).toLocaleString('en-IN')}</span>
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="text-brand-ink/60">Delivery</span>
                         <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Free</span>
                       </div>
                       
                       {currentView === 'cart' && (
                         <div className="bg-[#f0fdf4] text-[#166534] px-4 py-3 rounded-lg text-xs font-semibold flex items-center gap-2 mt-4 shadow-sm border border-green-100">
                           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                           You saved on delivery charges!
                         </div>
                       )}

                       <div className="flex justify-between border-t border-brand-ink/10 pt-4 mt-6 items-center">
                         <span className="text-lg font-bold text-brand-ink">Total</span>
                         <span className="text-2xl font-bold text-[#da7c44] font-serif">₹{cart.reduce((s,i) => s + ((PRODUCTS.find(p => p.id === i.productId)?.price || 0) * i.quantity), 0).toLocaleString('en-IN')}</span>
                       </div>
                     </div>

                     {currentView === 'cart' ? (
                       <button 
                         onClick={proceedToCheckout}
                         disabled={cart.length === 0}
                         className="w-full bg-[#da7c44] text-white py-4 rounded-lg font-bold hover:bg-[#c76530] transition-colors mt-8 flex justify-center items-center gap-2 shadow-[0_4px_14px_rgba(218,124,68,0.4)] disabled:opacity-50"
                       >
                         Proceed to Checkout →
                       </button>
                     ) : (
                       <div className="mt-8 flex flex-col gap-4">
                         <button 
                           type="submit" form="checkout-form"
                           disabled={isCheckingOut || cart.length === 0}
                           className="w-full bg-[#da7c44] text-white py-4 rounded-lg font-bold hover:bg-[#c76530] transition-colors flex justify-center items-center gap-2 shadow-[0_4px_14px_rgba(218,124,68,0.4)] disabled:opacity-50"
                         >
                           {isCheckingOut ? 'Processing...' : 'Place Order'}
                         </button>
                         <button 
                           type="button"
                           onClick={() => setCurrentView('cart')}
                           className="text-center text-[#da7c44] text-xs font-medium hover:text-brand-ink transition-colors"
                         >
                           ← Back to Cart
                         </button>
                       </div>
                     )}

                     {currentView === 'cart' && (
                       <div className="flex justify-center items-center mt-8 pt-6 border-t border-brand-ink/5 text-[10px] text-brand-ink/40 font-medium">
                          <div className="flex items-center gap-1.5 px-3"><ShieldCheck className="w-3.5 h-3.5" /> Secure</div>
                          <div className="flex items-center gap-1.5 border-x border-brand-ink/10 px-3"><ShieldCheck className="w-3.5 h-3.5" /> Safe Pay</div>
                          <div className="flex items-center gap-1.5 px-3"><Truck className="w-3.5 h-3.5" /> Free Ship</div>
                       </div>
                     )}
                  </div>
                </div>

              </div>
            </div>
          </div>
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
                    src="https://infifashion.com/wp-content/uploads/2023/09/image-61-1024x682.webp" 
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
          <div className="sm:col-span-2">
            <h2 className="font-serif text-2xl md:text-3xl mb-2 text-brand-gold">{brandInfo.title}</h2>
            <p className="text-[10px] md:text-xs uppercase tracking-widest text-brand-ink/60 mb-4 md:mb-6">{brandInfo.sub}</p>
            <p className="text-sm text-brand-ink/70 max-w-sm leading-relaxed mb-6">
              {storeMode === 'clothing' && 'Your premier destination for luxury clothing. We bring elegance and style to your everyday life.'}
              {storeMode === 'jewellery' && 'Your premier destination for exquisite jewellery. We bring brilliance and timeless beauty to your everyday life.'}
            </p>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-brand-ink">Subscribe to our Newsletter</label>
              <div className="flex items-center w-full max-w-sm">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-brand-bg md:bg-brand-surface border border-brand-ink/20 border-r-0 px-4 py-2 text-sm text-brand-ink focus:outline-none focus:border-brand-gold transition-colors"
                />
                <button className="bg-brand-ink text-brand-gold px-4 py-2 text-sm uppercase tracking-widest border border-brand-ink hover:bg-brand-gold hover:text-brand-bg transition-colors font-medium">Subscribe</button>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] md:text-xs uppercase tracking-widest font-semibold mb-4 md:mb-6 text-brand-gold">Shop Collections</h4>
            <ul className="space-y-3 md:space-y-4 text-sm text-brand-ink/80">
              <li><button onClick={() => { setCurrentView('home'); setDepartment('All'); window.scrollTo(0, 0); }} className="hover:text-brand-gold transition-colors">New Arrivals</button></li>
              <li><button onClick={() => { setCurrentView('home'); setDepartment('Women'); window.scrollTo(0, 0); }} className="hover:text-brand-gold transition-colors">Women's Collection</button></li>
              <li><button onClick={() => { setCurrentView('home'); setDepartment('Men'); window.scrollTo(0, 0); }} className="hover:text-brand-gold transition-colors">Men's Collection</button></li>
              <li><button onClick={() => { setCurrentView('home'); setDepartment('Kids'); window.scrollTo(0, 0); }} className="hover:text-brand-gold transition-colors">Kids' Collection</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] md:text-xs uppercase tracking-widest font-semibold mb-4 md:mb-6 text-brand-gold">Discover</h4>
            <ul className="space-y-3 md:space-y-4 text-sm text-brand-ink/80">
              <li><button onClick={() => { setCurrentView('about'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="hover:text-brand-gold transition-colors">Our Story</button></li>
              <li><button onClick={() => setCurrentView('contact')} className="hover:text-brand-gold transition-colors">Contact Us</button></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-gold transition-colors">Shipping & Returns</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-gold transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-6 md:pt-8 border-t border-brand-ink/10 text-[10px] md:text-xs text-brand-ink/50 uppercase tracking-wider gap-4 md:gap-0">
          <div className="flex flex-col items-center md:items-start gap-1.5">
            <p className="text-center md:text-left">&copy; {new Date().getFullYear()} {brandInfo.title}. All rights reserved.</p>
            <p className="text-[9px] md:text-[10px] normal-case tracking-normal">
              Designed & Developed by <a href="https://portfolioharsh29.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors font-medium border-b border-brand-gold/30 hover:border-brand-gold pb-0.5">Harsh Gupta</a>
            </p>
          </div>
          <div className="flex gap-4 md:gap-6 items-center flex-wrap justify-center mt-4 md:mt-0">
            <span>Secure Payments</span>
            <div className="h-4 w-px bg-brand-ink/20"></div>
            <span>Fast Delivery</span>
            <div className="h-4 w-px bg-brand-ink/20"></div>
            <span>Easy Returns</span>
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
              className="bg-brand-surface border-t md:border border-brand-ink/20 w-full max-w-6xl h-[95vh] md:h-[90vh] flex flex-col shadow-2xl relative rounded-t-2xl md:rounded-none overflow-hidden"
            >
              {/* Header / Close Button */}
              <div className="absolute top-4 right-4 z-50">
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 bg-brand-surface/90 hover:bg-brand-surface rounded-full text-brand-ink transition-colors backdrop-blur-md shadow-md"
                  aria-label="Close product details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Drag Handle */}
              <div className="w-full flex justify-center py-3 md:hidden absolute top-0 left-0 z-40 pointer-events-none">
                <div className="w-12 h-1.5 bg-brand-ink/20 rounded-full"></div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar w-full flex flex-col pb-20 md:pb-0">
                {/* Top Section: Image + Details */}
                <div className="flex flex-col md:flex-row w-full">
                  {/* Left: Product Image Gallery */}
                  <div className="w-full md:w-5/12 flex flex-col md:flex-row bg-brand-surface p-4 md:p-8 gap-4 border-r border-brand-ink/5">
                    {/* Vertical Thumbnails (Desktop) */}
                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                      <div className="hidden md:flex flex-col gap-3 w-16 flex-shrink-0 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
                        {selectedProduct.images.map((img, idx) => (
                          <button 
                            key={idx}
                            onClick={() => setSelectedImageIndex(idx)}
                            className={`relative w-full aspect-[3/4] transition-all overflow-hidden border ${selectedImageIndex === idx ? 'border-[#2874F0] ring-1 ring-[#2874F0]' : 'border-brand-ink/10 hover:border-brand-ink/30'}`}
                          >
                            <img src={img} alt={`${selectedProduct.name} view ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Main Image */}
                    <div className="flex-grow relative aspect-[4/5] md:aspect-auto md:h-[500px] bg-brand-bg group/gallery flex items-center justify-center">
                      <ImageZoom 
                        src={selectedProduct.images?.[selectedImageIndex] || selectedProduct.image} 
                        alt={selectedProduct.name}
                        className="w-full h-full"
                      />
                      
                      {/* Navigation Arrows */}
                      {selectedProduct.images && selectedProduct.images.length > 1 && (
                        <div className="absolute inset-0 flex items-center justify-between px-2 opacity-100 md:opacity-0 md:group-hover/gallery:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <button 
                            onClick={() => setSelectedImageIndex(prev => prev === 0 ? selectedProduct.images!.length - 1 : prev - 1)}
                            className="w-8 h-8 rounded-full bg-brand-surface/90 text-brand-ink flex items-center justify-center hover:bg-brand-surface transition-colors shadow-md pointer-events-auto border border-brand-ink/10"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setSelectedImageIndex(prev => prev === selectedProduct.images!.length - 1 ? 0 : prev + 1)}
                            className="w-8 h-8 rounded-full bg-brand-surface/90 text-brand-ink flex items-center justify-center hover:bg-brand-surface transition-colors shadow-md pointer-events-auto border border-brand-ink/10"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Horizontal Thumbnails (Mobile) */}
                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                      <div className="flex md:hidden justify-center gap-2 mt-2">
                        {selectedProduct.images.map((img, idx) => (
                          <button 
                            key={idx}
                            onClick={() => setSelectedImageIndex(idx)}
                            className={`relative w-12 h-16 flex-shrink-0 transition-all overflow-hidden border ${selectedImageIndex === idx ? 'border-[#2874F0]' : 'border-brand-ink/10'}`}
                          >
                            <img src={img} alt={`${selectedProduct.name} view ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Details */}
                  <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col">
                    <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest mb-4 text-brand-ink/60">
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
                      <span className="text-brand-ink/80 truncate max-w-[120px] md:max-w-[200px]">{selectedProduct.name}</span>
                    </nav>
                    
                    <h2 className="text-lg md:text-xl text-brand-ink mb-2 font-medium">{selectedProduct.name}</h2>
                    
                    {/* Rating Summary */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center bg-green-600 text-white px-1.5 py-0.5 rounded-sm text-xs font-bold gap-1">
                        {((reviews[selectedProduct.id] || []).length > 0 ? ((reviews[selectedProduct.id] || []).reduce((sum, r) => sum + r.rating, 0) / (reviews[selectedProduct.id] || []).length).toFixed(1) : '0.0')}
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                      <span className="text-sm text-brand-ink/50 font-medium">
                        {(reviews[selectedProduct.id] || []).length} Ratings & Reviews
                      </span>
                    </div>

                    <div className="flex items-end gap-3 mb-6">
                      <p className="text-2xl md:text-3xl font-medium text-brand-ink">₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                    </div>
                    
                    {/* Variants */}
                    {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                      <div className="space-y-5 mb-8">
                        {selectedProduct.variants.map((variant) => (
                          <div key={variant.name} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                            <p className="text-sm font-medium text-brand-ink/60 w-16">{variant.name}</p>
                            <div className="flex flex-wrap gap-3">
                              {variant.options.map((option) => (
                                <button
                                  key={option}
                                  onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: option }))}
                                  className={`px-4 py-2 text-sm font-medium border transition-colors ${
                                    selectedVariants[variant.name] === option 
                                      ? 'border-brand-gold text-brand-gold bg-brand-gold/5' 
                                      : 'border-brand-ink/20 text-brand-ink hover:border-brand-ink/50'
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

                    {/* Desktop Buttons */}
                    <div className="hidden md:flex flex-row gap-4 mt-auto pt-6 border-t border-brand-ink/10">
                      <button 
                        onClick={(e) => addToCart(e, selectedProduct.id, selectedVariants)}
                        className="flex-1 bg-brand-gold text-brand-bg px-6 py-4 text-sm font-bold uppercase tracking-wide hover:bg-brand-ink hover:text-brand-gold transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        ADD TO CART
                      </button>
                      <button 
                        onClick={(e) => {
                          addToCart(e, selectedProduct.id, selectedVariants);
                          setSelectedProduct(null);
                          setCurrentView('cart');
                        }}
                        className="flex-1 bg-brand-ink text-brand-gold px-6 py-4 text-sm font-bold uppercase tracking-wide hover:bg-brand-gold hover:text-brand-bg transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        BUY NOW
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-6">
                      <button 
                        onClick={(e) => toggleWishlist(e, selectedProduct.id)}
                        className="flex items-center gap-2 text-sm font-medium text-brand-ink/70 hover:text-brand-gold transition-colors"
                      >
                        <Heart className={`w-5 h-5 ${wishlist.includes(selectedProduct.id) ? 'fill-brand-gold text-brand-gold' : ''}`} />
                        {wishlist.includes(selectedProduct.id) ? 'Saved' : 'Save for later'}
                      </button>
                      <ShareMenu 
                        product={selectedProduct} 
                        className="relative"
                        iconClassName="text-brand-ink/70 hover:text-brand-gold"
                      />
                    </div>

                    <div className="mt-8 pt-6 border-t border-brand-ink/10">
                      <h3 className="text-lg font-medium text-brand-ink mb-3">Product Description</h3>
                      <p className="text-sm text-brand-ink/80 leading-relaxed">{selectedProduct.description}</p>
                    </div>
                  </div>
                </div>

                {/* Middle Section: Similar Products */}
                <div className="w-full border-t border-brand-ink/10 p-6 md:p-8 bg-brand-surface">
                  <h3 className="text-xl font-medium text-brand-ink mb-6">Similar Products</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {PRODUCTS.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 4).map(product => {
                      const isSaved = wishlist.includes(product.id);
                      return (
                        <div 
                          key={product.id} 
                          className="group cursor-pointer flex flex-col bg-brand-surface border border-brand-ink/5 hover:shadow-lg transition-shadow rounded-sm overflow-hidden"
                          onClick={() => {
                            setSelectedProduct(product);
                            setSelectedImageIndex(0);
                            const defaultVariants: Record<string, string> = {};
                            if (product.variants) {
                              product.variants.forEach(v => {
                                defaultVariants[v.name] = v.options[0];
                              });
                            }
                            setSelectedVariants(defaultVariants);
                            // Scroll modal to top
                            const modalContent = document.querySelector('.custom-scrollbar');
                            if (modalContent) modalContent.scrollTop = 0;
                          }}
                        >
                          <div className="relative aspect-[4/5] overflow-hidden bg-brand-bg p-4">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleWishlist(e, product.id); }}
                              className="absolute top-3 right-3 p-1.5 bg-brand-surface rounded-full text-brand-ink/40 hover:text-brand-gold transition-colors shadow-sm"
                              aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                            >
                              <Heart className={`w-4 h-4 ${isSaved ? 'fill-brand-gold text-brand-gold' : ''}`} />
                            </button>
                          </div>
                          <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-sm text-brand-ink/80 font-medium truncate mb-1">{product.name}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center bg-green-600 text-white px-1.5 py-0.5 rounded-sm text-[10px] font-bold gap-0.5">
                                {((reviews[product.id] || []).length > 0 ? ((reviews[product.id] || []).reduce((sum, r) => sum + r.rating, 0) / (reviews[product.id] || []).length).toFixed(1) : '0.0')}
                                <Star className="w-2.5 h-2.5 fill-current" />
                              </div>
                              <span className="text-xs text-brand-ink/50">({(reviews[product.id] || []).length})</span>
                            </div>
                            <p className="text-base font-medium text-brand-ink mt-auto">₹{product.price.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Bottom: Dedicated Reviews Section */}
                <div className="w-full border-t border-brand-ink/10 bg-brand-surface p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-6">
                    <div>
                      <h3 className="text-xl font-medium text-brand-ink mb-2">
                        Ratings & Reviews
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-[#388E3C] text-2xl font-bold text-brand-ink">
                          {((reviews[selectedProduct.id] || []).length > 0 ? ((reviews[selectedProduct.id] || []).reduce((sum, r) => sum + r.rating, 0) / (reviews[selectedProduct.id] || []).length).toFixed(1) : '0.0')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1 mb-1 text-green-600">
                            {renderStars(
                              (reviews[selectedProduct.id] || []).length > 0
                                ? (reviews[selectedProduct.id] || []).reduce((sum, r) => sum + r.rating, 0) / (reviews[selectedProduct.id] || []).length
                                : 0
                            )}
                          </div>
                          <span className="text-sm text-brand-ink/50 font-medium">
                            {(reviews[selectedProduct.id] || []).length} Ratings & {(reviews[selectedProduct.id] || []).length} Reviews
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const formElement = document.getElementById('review-form');
                        if (formElement) {
                          formElement.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="bg-brand-surface border border-brand-ink/20 text-brand-ink px-6 py-3 text-sm font-medium hover:shadow-md transition-all self-start sm:self-auto shadow-sm"
                    >
                      Rate Product
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Reviews List */}
                    <div className="lg:col-span-2">
                      <div className="space-y-0 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {(reviews[selectedProduct.id] || []).length === 0 ? (
                          <div className="py-8 text-center border-b border-brand-ink/10">
                            <p className="text-base text-brand-ink/50">No reviews yet. Be the first to review this product.</p>
                          </div>
                        ) : (
                          (reviews[selectedProduct.id] || []).map(review => (
                            <div key={review.id} className="py-6 border-b border-brand-ink/10 last:border-0">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="flex items-center bg-green-600 text-white px-1.5 py-0.5 rounded-sm text-xs font-bold gap-1">
                                  {review.rating}
                                  <Star className="w-3 h-3 fill-current" />
                                </div>
                                <p className="text-sm font-medium text-brand-ink">{review.comment.length > 30 ? review.comment.substring(0, 30) + '...' : review.comment}</p>
                              </div>
                              <p className="text-sm text-brand-ink/80 leading-relaxed mb-4">{review.comment}</p>
                              <div className="flex items-center gap-4 text-xs text-brand-ink/50 font-medium">
                                <span>{review.author}</span>
                                <span className="w-1 h-1 rounded-full bg-brand-ink/20"></span>
                                <span>{review.date}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Write a Review Form */}
                    <div className="lg:col-span-1">
                      <div id="review-form" className="bg-brand-surface p-6 border border-brand-ink/10 rounded-sm sticky top-6">
                        <h4 className="text-base font-medium text-brand-ink mb-6">Write a Review</h4>
                        <form onSubmit={handleReviewSubmit} className="space-y-5">
                          <div>
                            <label className="block text-sm font-medium text-brand-ink/70 mb-2">Rating</label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                  className="focus:outline-none"
                                >
                                  <Star className={`w-8 h-8 ${star <= reviewForm.rating ? 'fill-green-600 text-green-600' : 'text-brand-ink/20'}`} />
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {!user && (
                            <div>
                              <label className="block text-sm font-medium text-brand-ink/70 mb-2">Name</label>
                              <input 
                                type="text" 
                                value={reviewForm.author}
                                onChange={(e) => setReviewForm(prev => ({ ...prev, author: e.target.value }))}
                                className="w-full bg-brand-bg border border-brand-ink/20 px-4 py-2.5 text-sm text-brand-ink focus:outline-none focus:border-[#2874F0] transition-colors rounded-sm"
                                required
                              />
                            </div>
                          )}
                          
                          <div>
                            <label className="block text-sm font-medium text-brand-ink/70 mb-2">Review</label>
                            <textarea 
                              placeholder="Description" 
                              value={reviewForm.comment}
                              onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                              className="w-full bg-brand-bg border border-brand-ink/20 px-4 py-2.5 text-sm text-brand-ink focus:outline-none focus:border-[#2874F0] transition-colors resize-none h-28 rounded-sm"
                              required
                            />
                          </div>
                          <button 
                            type="submit"
                            className="bg-brand-gold text-brand-bg text-sm font-bold uppercase tracking-wide px-8 py-3.5 hover:bg-brand-ink hover:text-brand-gold transition-colors w-full shadow-sm"
                          >
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Bottom Bar for Mobile */}
              <div className="md:hidden absolute bottom-0 left-0 right-0 bg-brand-surface border-t border-brand-ink/10 p-3 flex gap-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <button 
                  onClick={(e) => addToCart(e, selectedProduct.id, selectedVariants)}
                  className="flex-1 bg-brand-surface border border-brand-ink/20 text-brand-ink px-4 py-3 text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  ADD TO CART
                </button>
                <button 
                  onClick={(e) => {
                    addToCart(e, selectedProduct.id, selectedVariants);
                    setSelectedProduct(null);
                    setCurrentView('cart');
                  }}
                  className="flex-1 bg-brand-gold text-brand-bg px-4 py-3 text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  BUY NOW
                </button>
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
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] bg-brand-ink text-brand-bg px-6 py-3 shadow-2xl flex items-center gap-3 text-xs md:text-sm uppercase tracking-widest w-[90%] md:w-auto max-w-md justify-center text-center"
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
      `}} />
    </div>
  );
}
