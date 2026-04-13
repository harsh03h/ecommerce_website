/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Menu, Search, ShoppingBag, ArrowRight } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-brand-ink/20 px-6 py-4 flex items-center justify-between sticky top-0 bg-brand-bg/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-6">
          <button className="p-2 -ml-2 hover:bg-brand-ink/5 rounded-full transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-medium">
            <a href="#clothing" className="hover:text-brand-gold transition-colors">Clothing</a>
            <a href="#jewellery" className="hover:text-brand-gold transition-colors">Jewellery</a>
            <a href="#collections" className="hover:text-brand-gold transition-colors">Collections</a>
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="font-serif text-2xl md:text-3xl leading-none tracking-tight">
            Harsh & Anand
          </h1>
          <p className="text-[9px] uppercase tracking-[0.2em] mt-1 text-brand-ink/60">
            Cloth Imporium & Jewellars
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-brand-ink/5 rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-brand-ink/5 rounded-full transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-gold rounded-full"></span>
          </button>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[85vh] flex flex-col md:flex-row border-b border-brand-ink/20">
          {/* Left: Clothing */}
          <div className="flex-1 relative group overflow-hidden border-b md:border-b-0 md:border-r border-brand-ink/20">
            <div className="absolute inset-0 bg-brand-ink/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1287&auto=format&fit=crop" 
              alt="Harsh Cloth Imporium" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-end bg-gradient-to-t from-brand-ink/80 via-brand-ink/20 to-transparent text-brand-bg">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <p className="text-xs uppercase tracking-[0.2em] mb-4 text-brand-bg/80">Harsh Cloth Imporium</p>
                <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light mb-6">
                  Elegance in <br /> Every Thread.
                </h2>
                <button className="flex items-center gap-3 text-sm uppercase tracking-widest hover:text-brand-gold transition-colors group/btn">
                  Explore Collection
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Right: Jewellery */}
          <div className="flex-1 relative group overflow-hidden">
            <div className="absolute inset-0 bg-brand-ink/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1470&auto=format&fit=crop" 
              alt="Anand Jewellars" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-end bg-gradient-to-t from-brand-ink/80 via-brand-ink/20 to-transparent text-brand-bg">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <p className="text-xs uppercase tracking-[0.2em] mb-4 text-brand-bg/80">Anand Jewellars</p>
                <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light mb-6">
                  Timeless <br /> Brilliance.
                </h2>
                <button className="flex items-center gap-3 text-sm uppercase tracking-widest hover:text-brand-gold transition-colors group/btn">
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
              A legacy of <span className="italic text-brand-gold">craftsmanship</span> and <span className="italic text-brand-gold">style</span>, brought together under one roof.
            </h3>
            <p className="text-brand-ink/70 max-w-2xl mx-auto leading-relaxed">
              Experience the perfect harmony of premium textiles from Harsh Cloth Imporium and exquisite ornaments from Anand Jewellars. We curate collections that celebrate tradition while embracing modern sophistication.
            </p>
          </motion.div>
        </section>

        {/* Featured Collections */}
        <section id="collections" className="py-12 border-t border-brand-ink/20">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Clothing Collection */}
            <div className="p-6 md:p-12 lg:p-20 border-b md:border-b-0 md:border-r border-brand-ink/20 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-px bg-brand-ink"></span>
                <span className="text-xs uppercase tracking-widest font-medium">Harsh Imporium</span>
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
                <span className="w-12 h-px bg-brand-ink"></span>
                <span className="text-xs uppercase tracking-widest font-medium">Anand Jewellars</span>
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
        <section className="py-8 border-y border-brand-ink/20 overflow-hidden bg-brand-ink text-brand-bg">
          <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                <span className="font-serif text-3xl italic px-8">Harsh Cloth Imporium</span>
                <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                <span className="font-serif text-3xl italic px-8">Anand Jewellars</span>
                <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-bg pt-20 pb-10 px-6 md:px-12 border-t border-brand-ink/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl mb-2">Harsh & Anand</h2>
            <p className="text-xs uppercase tracking-widest text-brand-ink/60 mb-6">Cloth Imporium & Jewellars</p>
            <p className="text-sm text-brand-ink/70 max-w-sm leading-relaxed">
              Your premier destination for luxury clothing and exquisite jewellery. We bring elegance and brilliance to your everyday life.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm text-brand-ink/80">
              <li><a href="#" className="hover:text-brand-gold transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Clothing Collections</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Bridal Jewellery</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Our Story</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-6">Visit Us</h4>
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
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
