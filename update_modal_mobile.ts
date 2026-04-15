import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const modalStart = content.indexOf('{/* Product Details & Reviews Modal */}');
const modalEnd = content.indexOf('{/* Toast Notification */}');

if (modalStart === -1 || modalEnd === -1) {
  console.error("Could not find modal boundaries");
  process.exit(1);
}

const beforeModal = content.substring(0, modalStart);
const afterModal = content.substring(modalEnd);

const newModal = `      {/* Product Details & Reviews Modal */}
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
                  className="p-2 bg-white/90 hover:bg-white rounded-full text-brand-ink transition-colors backdrop-blur-md shadow-md"
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
                  <div className="w-full md:w-5/12 flex flex-col md:flex-row bg-white p-4 md:p-8 gap-4 border-r border-brand-ink/5">
                    {/* Vertical Thumbnails (Desktop) */}
                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                      <div className="hidden md:flex flex-col gap-3 w-16 flex-shrink-0 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
                        {selectedProduct.images.map((img, idx) => (
                          <button 
                            key={idx}
                            onClick={() => setSelectedImageIndex(idx)}
                            className={\`relative w-full aspect-[3/4] transition-all overflow-hidden border \${selectedImageIndex === idx ? 'border-[#2874F0] ring-1 ring-[#2874F0]' : 'border-brand-ink/10 hover:border-brand-ink/30'}\`}
                          >
                            <img src={img} alt={\`\${selectedProduct.name} view \${idx + 1}\`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Main Image */}
                    <div className="flex-grow relative aspect-[4/5] md:aspect-auto md:h-[500px] bg-white group/gallery flex items-center justify-center">
                      <img 
                        src={selectedProduct.images?.[selectedImageIndex] || selectedProduct.image} 
                        alt={selectedProduct.name}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Navigation Arrows */}
                      {selectedProduct.images && selectedProduct.images.length > 1 && (
                        <div className="absolute inset-0 flex items-center justify-between px-2 opacity-100 md:opacity-0 md:group-hover/gallery:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <button 
                            onClick={() => setSelectedImageIndex(prev => prev === 0 ? selectedProduct.images!.length - 1 : prev - 1)}
                            className="w-8 h-8 rounded-full bg-white/90 text-brand-ink flex items-center justify-center hover:bg-white transition-colors shadow-md pointer-events-auto border border-brand-ink/10"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setSelectedImageIndex(prev => prev === selectedProduct.images!.length - 1 ? 0 : prev + 1)}
                            className="w-8 h-8 rounded-full bg-white/90 text-brand-ink flex items-center justify-center hover:bg-white transition-colors shadow-md pointer-events-auto border border-brand-ink/10"
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
                            className={\`relative w-12 h-16 flex-shrink-0 transition-all overflow-hidden border \${selectedImageIndex === idx ? 'border-[#2874F0]' : 'border-brand-ink/10'}\`}
                          >
                            <img src={img} alt={\`\${selectedProduct.name} view \${idx + 1}\`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                        className="hover:text-[#2874F0] transition-colors"
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
                        className="hover:text-[#2874F0] transition-colors"
                      >
                        {selectedProduct.category}
                      </button>
                      <span>/</span>
                      <span className="text-brand-ink/80 truncate max-w-[120px] md:max-w-[200px]">{selectedProduct.name}</span>
                    </nav>
                    
                    <h2 className="text-lg md:text-xl text-brand-ink mb-2 font-medium">{selectedProduct.name}</h2>
                    
                    {/* Rating Summary */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center bg-[#388E3C] text-white px-1.5 py-0.5 rounded-sm text-xs font-bold gap-1">
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
                                  className={\`px-4 py-2 text-sm font-medium border transition-colors \${
                                    selectedVariants[variant.name] === option 
                                      ? 'border-[#2874F0] text-[#2874F0] bg-[#2874F0]/5' 
                                      : 'border-brand-ink/20 text-brand-ink hover:border-brand-ink/50'
                                  }\`}
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
                        className="flex-1 bg-[#FF9F00] text-white px-6 py-4 text-sm font-bold uppercase tracking-wide hover:bg-[#F39800] transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        ADD TO CART
                      </button>
                      <button 
                        onClick={(e) => {
                          addToCart(e, selectedProduct.id, selectedVariants);
                          setSelectedProduct(null);
                          setIsCartOpen(true);
                        }}
                        className="flex-1 bg-[#FB641B] text-white px-6 py-4 text-sm font-bold uppercase tracking-wide hover:bg-[#E85D19] transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        BUY NOW
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-6">
                      <button 
                        onClick={(e) => toggleWishlist(e, selectedProduct.id)}
                        className="flex items-center gap-2 text-sm font-medium text-brand-ink/70 hover:text-[#2874F0] transition-colors"
                      >
                        <Heart className={\`w-5 h-5 \${wishlist.includes(selectedProduct.id) ? 'fill-[#2874F0] text-[#2874F0]' : ''}\`} />
                        {wishlist.includes(selectedProduct.id) ? 'Saved' : 'Save for later'}
                      </button>
                      <ShareMenu 
                        product={selectedProduct} 
                        className="relative"
                        iconClassName="text-brand-ink/70 hover:text-[#2874F0]"
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
                          className="group cursor-pointer flex flex-col bg-white border border-brand-ink/5 hover:shadow-lg transition-shadow rounded-sm overflow-hidden"
                          onClick={() => {
                            setSelectedProduct(product);
                            setSelectedImageIndex(0);
                            setSelectedVariants({});
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
                              className="absolute top-3 right-3 p-1.5 bg-white rounded-full text-brand-ink/40 hover:text-[#2874F0] transition-colors shadow-sm"
                              aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                            >
                              <Heart className={\`w-4 h-4 \${isSaved ? 'fill-[#2874F0] text-[#2874F0]' : ''}\`} />
                            </button>
                          </div>
                          <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-sm text-brand-ink/80 font-medium truncate mb-1">{product.name}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center bg-[#388E3C] text-white px-1.5 py-0.5 rounded-sm text-[10px] font-bold gap-0.5">
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
                <div className="w-full border-t border-brand-ink/10 bg-white p-6 md:p-8">
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
                          <div className="flex items-center gap-1 mb-1 text-[#388E3C]">
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
                      className="bg-white border border-brand-ink/20 text-brand-ink px-6 py-3 text-sm font-medium hover:shadow-md transition-all self-start sm:self-auto shadow-sm"
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
                                <div className="flex items-center bg-[#388E3C] text-white px-1.5 py-0.5 rounded-sm text-xs font-bold gap-1">
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
                                  <Star className={\`w-8 h-8 \${star <= reviewForm.rating ? 'fill-[#388E3C] text-[#388E3C]' : 'text-brand-ink/20'}\`} />
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
                                className="w-full bg-white border border-brand-ink/20 px-4 py-2.5 text-sm text-brand-ink focus:outline-none focus:border-[#2874F0] transition-colors rounded-sm"
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
                              className="w-full bg-white border border-brand-ink/20 px-4 py-2.5 text-sm text-brand-ink focus:outline-none focus:border-[#2874F0] transition-colors resize-none h-28 rounded-sm"
                              required
                            />
                          </div>
                          <button 
                            type="submit"
                            className="bg-[#FB641B] text-white text-sm font-bold uppercase tracking-wide px-8 py-3.5 hover:bg-[#E85D19] transition-colors w-full shadow-sm"
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
              <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white border-t border-brand-ink/10 p-3 flex gap-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <button 
                  onClick={(e) => addToCart(e, selectedProduct.id, selectedVariants)}
                  className="flex-1 bg-white border border-brand-ink/20 text-brand-ink px-4 py-3 text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  ADD TO CART
                </button>
                <button 
                  onClick={(e) => {
                    addToCart(e, selectedProduct.id, selectedVariants);
                    setSelectedProduct(null);
                    setIsCartOpen(true);
                  }}
                  className="flex-1 bg-[#FB641B] text-white px-4 py-3 text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  BUY NOW
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
`;

fs.writeFileSync('src/App.tsx', beforeModal + newModal + afterModal);
