import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Search, ShoppingBag, ArrowRight, SlidersHorizontal, Star, X, User as UserIcon } from 'lucide-react';
import { auth, signInWithGoogle, logout } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

// Mock Data for the store
const PRODUCTS = [
  {
    id: 'c1',
    name: 'Banarasi Silk Saree',
    category: 'Clothing',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d615ef?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d615ef?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733958-61982c4eb0e0?q=80&w=800&auto=format&fit=crop'
    ],
    isNew: true,
    sales: 120,
    description: 'Authentic handwoven Banarasi silk saree featuring intricate zari work. Perfect for weddings and festive occasions.'
  },
  {
    id: 'j1',
    name: 'Kundan Bridal Set',
    category: 'Jewellery',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1599643478524-fb66f70a00ea?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1599643478524-fb66f70a00ea?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop'
    ],
    isNew: true,
    sales: 45,
    description: 'Exquisite Kundan bridal necklace set with matching earrings and maang tikka, crafted in 22k gold plating.'
  },
  {
    id: 'c2',
    name: 'Velvet Embroidered Lehenga',
    category: 'Clothing',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop'
    ],
    isNew: false,
    sales: 300,
    description: 'Deep maroon velvet lehenga adorned with heavy zardosi and thread embroidery. Includes a matching net dupatta.'
  },
  {
    id: 'j2',
    name: 'Diamond Tennis Bracelet',
    category: 'Jewellery',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=800&auto=format&fit=crop'
    ],
    isNew: false,
    sales: 210,
    description: 'Classic tennis bracelet featuring brilliant-cut VVS diamonds set in 18k white gold. A timeless statement piece.'
  },
  {
    id: 'c3',
    name: 'Pashmina Shawl',
    category: 'Clothing',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1583391733958-61982c4eb0e0?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583391733958-61982c4eb0e0?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604644401890-0bd678c83788?q=80&w=800&auto=format&fit=crop'
    ],
    isNew: false,
    sales: 80,
    description: 'Pure Kashmiri Pashmina shawl with subtle hand-embroidery along the borders. Incredibly soft and warm.'
  },
  {
    id: 'j3',
    name: 'Polki Drop Earrings',
    category: 'Jewellery',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?q=80&w=800&auto=format&fit=crop'
    ],
    isNew: true,
    sales: 150,
    description: 'Stunning uncut diamond (Polki) drop earrings with emerald accents and pearl hangings.'
  }
];

// Mock Initial Reviews
const INITIAL_REVIEWS: Record<string, { id: string; author: string; rating: number; comment: string; date: string }[]> = {
  'c1': [
    { id: 'r1', author: 'Priya S.', rating: 5, comment: 'Absolutely stunning saree! The silk is incredibly soft and the zari work is flawless.', date: 'Oct 12, 2023' },
    { id: 'r2', author: 'Anjali M.', rating: 4, comment: 'Beautiful color, exactly as shown in the pictures. Drapes very well.', date: 'Sep 28, 2023' }
  ],
  'j1': [
    { id: 'r3', author: 'Neha K.', rating: 5, comment: 'Wore this for my wedding and felt like a queen. The craftsmanship is premium.', date: 'Nov 05, 2023' }
  ]
};

type StoreMode = 'clothing' | 'jewellery';

export default function App() {
  const [storeMode, setStoreMode] = useState<StoreMode>('clothing');
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Review System State
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];
    
    // Filter by Store Mode
    if (storeMode === 'clothing') result = result.filter(p => p.category === 'Clothing');
    if (storeMode === 'jewellery') result = result.filter(p => p.category === 'Jewellery');

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
  }, [storeMode, sortBy]);

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

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-3 h-3 md:w-4 md:h-4 ${interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''} ${star <= rating ? 'fill-brand-gold text-brand-gold' : 'text-brand-ink/20'}`}
            onClick={() => interactive && setReviewForm(prev => ({ ...prev, rating: star }))}
          />
        ))}
      </div>
    );
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
                  <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-gold transition-colors border-b border-brand-ink/10 pb-4">My Wishlist</a>
                  <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-gold transition-colors border-b border-brand-ink/10 pb-4">Order History</a>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-left text-red-400 hover:text-red-300 transition-colors border-b border-brand-ink/10 pb-4">Sign Out</button>
                </>
              ) : (
                <button onClick={() => { signInWithGoogle(); setIsMobileMenuOpen(false); }} className="text-left hover:text-brand-gold transition-colors border-b border-brand-ink/10 pb-4">Log In</button>
              )}
            </div>
            
            <div className="mt-auto pt-8 border-t border-brand-ink/10">
              <p className="text-xs uppercase tracking-widest text-brand-ink/60 mb-4">Store Mode</p>
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
        
        <div className="text-center w-1/3 flex flex-col items-center">
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
                <button className="text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-brand-ink/5 transition-colors">My Wishlist</button>
                <button className="text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-brand-ink/5 transition-colors">Order History</button>
                <button onClick={logout} className="text-left px-4 py-3 text-xs uppercase tracking-widest text-red-400 hover:bg-brand-ink/5 transition-colors border-t border-brand-ink/10">Sign Out</button>
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
          <button className="p-2 hover:bg-brand-ink/10 rounded-full transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-gold rounded-full"></span>
          </button>
        </div>
      </nav>

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
        {/* Hero Section */}
        <section className="relative h-[70vh] md:h-[85vh] flex flex-col md:flex-row border-b border-brand-ink/10">
          {/* Left: Clothing */}
          {storeMode === 'clothing' && (
            <div className="relative group overflow-hidden border-brand-ink/10 w-full h-full">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1287&auto=format&fit=crop" 
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
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1470&auto=format&fit=crop" 
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

        {/* Shop / Filter Section */}
        <section id="shop" className="py-12 md:py-20 px-4 md:px-12 max-w-7xl mx-auto border-t border-brand-ink/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
            <div>
              <h3 className="font-serif text-2xl md:text-4xl">Curated Collection</h3>
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
              {filteredProducts.map((product, idx) => {
                const productReviews = reviews[product.id] || [];
                const avgRating = productReviews.length > 0 
                  ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length 
                  : 0;

                return (
                  <motion.div 
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group cursor-pointer"
                    onClick={() => {
                      setSelectedProduct(product);
                      setSelectedImageIndex(0);
                    }}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-brand-surface">
                      {product.isNew && (
                        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 bg-brand-gold text-brand-bg text-[9px] md:text-[10px] uppercase tracking-widest px-2 py-1 md:px-3 md:py-1 font-medium">
                          New Arrival
                        </div>
                      )}
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button className="bg-brand-bg/90 text-brand-gold text-[10px] md:text-xs uppercase tracking-widest px-4 py-2 md:px-6 md:py-3 hover:bg-brand-gold hover:text-brand-bg transition-colors backdrop-blur-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-brand-gold mb-1">{product.category}</p>
                        <h4 className="font-serif text-base md:text-lg text-brand-ink">{product.name}</h4>
                        {productReviews.length > 0 && (
                          <div className="flex items-center gap-1 md:gap-2 mt-1">
                            {renderStars(Math.round(avgRating))}
                            <span className="text-[10px] md:text-xs text-brand-ink/50">({productReviews.length})</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs md:text-sm tracking-wider text-brand-ink/80 mt-1">₹{product.price.toLocaleString('en-IN')}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-brand-ink/50">
              <p>No products found in this category.</p>
            </div>
          )}
        </section>

        {/* Featured Collections */}
        <section id="collections" className="py-12 border-t border-brand-ink/10 bg-brand-surface">
          <div className="grid grid-cols-1">
            
            {/* Clothing Collection */}
            {storeMode === 'clothing' && (
              <div className="p-6 md:p-12 lg:p-20 border-brand-ink/10 flex flex-col justify-center items-center text-center">
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                  <span className="w-8 md:w-12 h-px bg-brand-gold"></span>
                  <span className="text-[10px] md:text-xs uppercase tracking-widest font-medium text-brand-gold">Harsh Imporium</span>
                  <span className="w-8 md:w-12 h-px bg-brand-gold"></span>
                </div>
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6">The Silk Route</h3>
                <p className="text-sm md:text-base text-brand-ink/70 mb-8 md:mb-10 leading-relaxed max-w-md">
                  Discover our latest collection of hand-woven silks and premium fabrics, designed for those who appreciate the finer details in everyday wear.
                </p>
                <div className="aspect-[3/4] relative w-full max-w-xs md:max-w-sm mx-auto oval-mask overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1610030469983-98e550d615ef?q=80&w=1287&auto=format&fit=crop" 
                    alt="Silk Collection" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}

            {/* Jewellery Collection */}
            {storeMode === 'jewellery' && (
              <div className="p-6 md:p-12 lg:p-20 flex flex-col justify-center items-center text-center">
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                  <span className="w-8 md:w-12 h-px bg-brand-gold"></span>
                  <span className="text-[10px] md:text-xs uppercase tracking-widest font-medium text-brand-gold">Anand Jewellars</span>
                  <span className="w-8 md:w-12 h-px bg-brand-gold"></span>
                </div>
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6">Bridal Heritage</h3>
                <p className="text-sm md:text-base text-brand-ink/70 mb-8 md:mb-10 leading-relaxed max-w-md">
                  Intricately crafted gold and diamond sets that capture the essence of your most special moments. A testament to generations of artistry.
                </p>
                <div className="aspect-[3/4] relative w-full max-w-xs md:max-w-sm mx-auto oval-mask overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1599643478524-fb66f70a00ea?q=80&w=1287&auto=format&fit=crop" 
                    alt="Bridal Jewellery" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}

          </div>
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
              <li><a href="#" className="hover:text-brand-gold transition-colors">Our Story</a></li>
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
              className="bg-brand-surface border-t md:border border-brand-ink/20 w-full max-w-5xl h-[90vh] md:h-auto md:max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl relative rounded-t-2xl md:rounded-none"
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
              <div className="w-full md:w-2/5 flex flex-col bg-brand-bg">
                <div className="w-full aspect-square md:aspect-auto md:flex-grow relative">
                  <img 
                    src={selectedProduct.images?.[selectedImageIndex] || selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Thumbnails */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="flex gap-2 md:gap-3 p-3 md:p-4 overflow-x-auto custom-scrollbar bg-brand-surface border-t border-brand-ink/10">
                    {selectedProduct.images.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 transition-all ${selectedImageIndex === idx ? 'ring-2 ring-brand-gold ring-offset-2 ring-offset-brand-surface opacity-100' : 'opacity-60 hover:opacity-100'}`}
                      >
                        <img src={img} alt={`${selectedProduct.name} view ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Details & Reviews */}
              <div className="w-full md:w-3/5 p-6 md:p-12 flex flex-col">
                <div className="mb-6 md:mb-8 border-b border-brand-ink/10 pb-6 md:pb-8">
                  <p className="text-[10px] md:text-xs uppercase tracking-widest text-brand-gold mb-2">{selectedProduct.category}</p>
                  <h2 className="font-serif text-2xl md:text-4xl text-brand-ink mb-3 md:mb-4">{selectedProduct.name}</h2>
                  <p className="text-lg md:text-xl tracking-wider text-brand-ink/90 mb-4 md:mb-6">₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-brand-ink/70 leading-relaxed">{selectedProduct.description}</p>
                </div>

                <div className="flex-grow">
                  <h3 className="font-serif text-xl md:text-2xl mb-4 md:mb-6 flex items-center gap-3">
                    Customer Reviews
                    <span className="text-xs md:text-sm font-sans text-brand-ink/50 font-normal">
                      ({(reviews[selectedProduct.id] || []).length})
                    </span>
                  </h3>

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
                  <div className="bg-brand-bg p-5 md:p-6 border border-brand-ink/10">
                    <h4 className="text-[10px] md:text-sm uppercase tracking-widest font-medium text-brand-gold mb-4 md:mb-6">Write a Review</h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-4 md:space-y-5">
                      <div>
                        <label className="block text-[10px] md:text-xs uppercase tracking-wider text-brand-ink/60 mb-2">Rating</label>
                        {renderStars(reviewForm.rating, true)}
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
