import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Search, ShoppingBag, ArrowRight, SlidersHorizontal, Star, X } from 'lucide-react';

// Mock Data for the store
const PRODUCTS = [
  {
    id: 'c1',
    name: 'Banarasi Silk Saree',
    category: 'Clothing',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d615ef?q=80&w=800&auto=format&fit=crop',
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

export default function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  
  // Review System State
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [reviewForm, setReviewForm] = useState({ author: '', rating: 5, comment: '' });

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];
    
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
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
  }, [activeCategory, sortBy]);

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
            className={`w-4 h-4 ${interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''} ${star <= rating ? 'fill-brand-gold text-brand-gold' : 'text-brand-ink/20'}`}
            onClick={() => interactive && setReviewForm(prev => ({ ...prev, rating: star }))}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Navigation */}
      <nav className="border-b border-brand-ink/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-brand-bg/90 backdrop-blur-md z-40">
        <div className="flex items-center gap-6">
          <button className="p-2 -ml-2 hover:bg-brand-ink/10 rounded-full transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-medium">
            <a href="#clothing" className="hover:text-brand-gold transition-colors">Clothing</a>
            <a href="#jewellery" className="hover:text-brand-gold transition-colors">Jewellery</a>
            <a href="#shop" className="hover:text-brand-gold transition-colors">Shop</a>
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="font-serif text-2xl md:text-3xl leading-none tracking-tight text-brand-gold">
            Harsh & Anand
          </h1>
          <p className="text-[9px] uppercase tracking-[0.2em] mt-1 text-brand-ink/60">
            Cloth Imporium & Jewellars
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-brand-ink/10 rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-brand-ink/10 rounded-full transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-gold rounded-full"></span>
          </button>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[85vh] flex flex-col md:flex-row border-b border-brand-ink/10">
          {/* Left: Clothing */}
          <div className="flex-1 relative group overflow-hidden border-b md:border-b-0 md:border-r border-brand-ink/10">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1287&auto=format&fit=crop" 
              alt="Harsh Cloth Imporium" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <p className="text-xs uppercase tracking-[0.2em] mb-4 text-brand-gold">Harsh Cloth Imporium</p>
                <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light mb-6">
                  Elegance in <br /> Every Thread.
                </h2>
                <button 
                  onClick={() => { setActiveCategory('Clothing'); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="flex items-center gap-3 text-sm uppercase tracking-widest hover:text-brand-gold transition-colors group/btn"
                >
                  Explore Collection
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Right: Jewellery */}
          <div className="flex-1 relative group overflow-hidden">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1470&auto=format&fit=crop" 
              alt="Anand Jewellars" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <p className="text-xs uppercase tracking-[0.2em] mb-4 text-brand-gold">Anand Jewellars</p>
                <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light mb-6">
                  Timeless <br /> Brilliance.
                </h2>
                <button 
                  onClick={() => { setActiveCategory('Jewellery'); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="flex items-center gap-3 text-sm uppercase tracking-widest hover:text-brand-gold transition-colors group/btn"
                >
                  Discover Pieces
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-serif text-3xl md:text-5xl font-light leading-tight mb-8">
              A legacy of <span className="italic text-brand-gold">craftsmanship</span> and <span className="italic text-brand-gold">trust</span>, brought together under one roof.
            </h3>
            <p className="text-brand-ink/70 max-w-2xl mx-auto leading-relaxed">
              Experience the perfect harmony of premium textiles from Harsh Cloth Imporium and exquisite ornaments from Anand Jewellars. We curate collections that celebrate tradition while embracing modern sophistication.
            </p>
          </motion.div>
        </section>

        {/* Shop / Filter Section */}
        <section id="shop" className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-brand-ink/10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div>
              <h3 className="font-serif text-3xl md:text-4xl mb-6">Curated Collection</h3>
              <div className="flex gap-6 text-sm uppercase tracking-widest">
                {['All', 'Clothing', 'Jewellery'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`pb-1 border-b-2 transition-colors ${activeCategory === cat ? 'border-brand-gold text-brand-gold' : 'border-transparent text-brand-ink/60 hover:text-brand-ink'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-brand-gold" />
              <span className="uppercase tracking-widest text-brand-ink/60 text-xs">Sort By:</span>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-b border-brand-ink/20 text-brand-ink py-1 pr-6 focus:outline-none focus:border-brand-gold cursor-pointer appearance-none uppercase tracking-widest text-xs"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredProducts.map((product, idx) => {
              const productReviews = reviews[product.id] || [];
              const avgRating = productReviews.length > 0 
                ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length 
                : 0;

              return (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-brand-surface">
                    {product.isNew && (
                      <div className="absolute top-4 left-4 z-10 bg-brand-gold text-brand-bg text-[10px] uppercase tracking-widest px-3 py-1 font-medium">
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
                      <button className="bg-brand-bg/90 text-brand-gold text-xs uppercase tracking-widest px-6 py-3 hover:bg-brand-gold hover:text-brand-bg transition-colors backdrop-blur-sm">
                        View Details & Reviews
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-brand-gold mb-1">{product.category}</p>
                      <h4 className="font-serif text-lg text-brand-ink">{product.name}</h4>
                      {productReviews.length > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(Math.round(avgRating))}
                          <span className="text-xs text-brand-ink/50">({productReviews.length})</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm tracking-wider text-brand-ink/80 mt-1">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-brand-ink/50">
              <p>No products found in this category.</p>
            </div>
          )}
        </section>

        {/* Featured Collections */}
        <section id="collections" className="py-12 border-t border-brand-ink/10 bg-brand-surface">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Clothing Collection */}
            <div className="p-6 md:p-12 lg:p-20 border-b md:border-b-0 md:border-r border-brand-ink/10 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-px bg-brand-gold"></span>
                <span className="text-xs uppercase tracking-widest font-medium text-brand-gold">Harsh Imporium</span>
              </div>
              <h3 className="font-serif text-4xl md:text-5xl mb-6">The Silk Route</h3>
              <p className="text-brand-ink/70 mb-10 leading-relaxed max-w-md">
                Discover our latest collection of hand-woven silks and premium fabrics, designed for those who appreciate the finer details in everyday wear.
              </p>
              <div className="aspect-[3/4] relative w-full max-w-sm mx-auto md:mx-0 oval-mask overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1610030469983-98e550d615ef?q=80&w=1287&auto=format&fit=crop" 
                  alt="Silk Collection" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Jewellery Collection */}
            <div className="p-6 md:p-12 lg:p-20 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-px bg-brand-gold"></span>
                <span className="text-xs uppercase tracking-widest font-medium text-brand-gold">Anand Jewellars</span>
              </div>
              <h3 className="font-serif text-4xl md:text-5xl mb-6">Bridal Heritage</h3>
              <p className="text-brand-ink/70 mb-10 leading-relaxed max-w-md">
                Intricately crafted gold and diamond sets that capture the essence of your most special moments. A testament to generations of artistry.
              </p>
              <div className="aspect-[3/4] relative w-full max-w-sm mx-auto md:mx-0 oval-mask overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1599643478524-fb66f70a00ea?q=80&w=1287&auto=format&fit=crop" 
                  alt="Bridal Jewellery" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Marquee Section */}
        <section className="py-8 border-y border-brand-ink/10 overflow-hidden bg-brand-bg text-brand-gold">
          <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                <span className="font-serif text-3xl italic px-8">Harsh Cloth Imporium</span>
                <span className="w-2 h-2 rounded-full bg-brand-ink/20"></span>
                <span className="font-serif text-3xl italic px-8">Anand Jewellars</span>
                <span className="w-2 h-2 rounded-full bg-brand-ink/20"></span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-surface pt-20 pb-10 px-6 md:px-12 border-t border-brand-ink/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl mb-2 text-brand-gold">Harsh & Anand</h2>
            <p className="text-xs uppercase tracking-widest text-brand-ink/60 mb-6">Cloth Imporium & Jewellars</p>
            <p className="text-sm text-brand-ink/70 max-w-sm leading-relaxed">
              Your premier destination for luxury clothing and exquisite jewellery. We bring elegance and brilliance to your everyday life.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-6 text-brand-gold">Explore</h4>
            <ul className="space-y-4 text-sm text-brand-ink/80">
              <li><a href="#" className="hover:text-brand-gold transition-colors">New Arrivals</a></li>
              <li><a href="#shop" className="hover:text-brand-gold transition-colors">Shop All</a></li>
              <li><a href="#collections" className="hover:text-brand-gold transition-colors">Collections</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Our Story</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-6 text-brand-gold">Visit Us</h4>
            <ul className="space-y-4 text-sm text-brand-ink/80">
              <li>123 Heritage Market</li>
              <li>New Delhi, India 110001</li>
              <li className="pt-4"><a href="mailto:contact@harshanand.com" className="hover:text-brand-gold transition-colors">contact@harshanand.com</a></li>
              <li>+91 98765 43210</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-brand-ink/10 text-xs text-brand-ink/50 uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} Harsh & Anand. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-surface border border-brand-ink/20 w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-brand-bg/50 hover:bg-brand-bg rounded-full text-brand-ink transition-colors backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left: Product Image */}
              <div className="w-full md:w-2/5 aspect-square md:aspect-auto relative bg-brand-bg">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right: Details & Reviews */}
              <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col">
                <div className="mb-8 border-b border-brand-ink/10 pb-8">
                  <p className="text-xs uppercase tracking-widest text-brand-gold mb-2">{selectedProduct.category}</p>
                  <h2 className="font-serif text-3xl md:text-4xl text-brand-ink mb-4">{selectedProduct.name}</h2>
                  <p className="text-xl tracking-wider text-brand-ink/90 mb-6">₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-brand-ink/70 leading-relaxed">{selectedProduct.description}</p>
                </div>

                <div className="flex-grow">
                  <h3 className="font-serif text-2xl mb-6 flex items-center gap-3">
                    Customer Reviews
                    <span className="text-sm font-sans text-brand-ink/50 font-normal">
                      ({(reviews[selectedProduct.id] || []).length})
                    </span>
                  </h3>

                  {/* Reviews List */}
                  <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
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
                  <div className="bg-brand-bg p-6 border border-brand-ink/10">
                    <h4 className="text-sm uppercase tracking-widest font-medium text-brand-gold mb-6">Write a Review</h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-5">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-brand-ink/60 mb-2">Rating</label>
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
                        className="bg-brand-gold text-brand-bg text-xs uppercase tracking-widest px-8 py-3 font-medium hover:bg-brand-ink hover:text-brand-gold transition-colors w-full md:w-auto"
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
