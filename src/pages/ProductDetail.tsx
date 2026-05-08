import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useUsers } from '../context/UserContext';
import { ShoppingBag, Star, Share2, Heart, ChevronLeft, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import ProductCard from '../components/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, isLoading } = useProducts();
  const { addToCart } = useCart();
  const { currentUser } = useUsers();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('24');
  const [activeTab, setActiveTab] = useState('details');

  const product = products.find(p => p.id === id);
  
  const isSaree = React.useMemo(() => {
    if (!product) return false;
    const cat = (product.category || '').toLowerCase();
    const name = (product.name || '').toLowerCase();
    return cat.includes('saree') || cat.includes('sharee') || cat.includes('shari') || 
           name.includes('saree') || name.includes('sharee') || name.includes('shari');
  }, [product]);

  const relatedProducts = React.useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.id !== product.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);
  }, [products, product?.id]);

  if (isLoading && !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin mb-4" />
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold animate-pulse">Accessing Aura Vault...</p>
      </div>
    );
  }

  if (!product && !isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-900 font-display text-2xl mb-2">Treasure Not Found</p>
          <p className="text-gray-400 text-sm mb-8 font-medium italic">The item you seek has vanished into the vaults...</p>
          <button 
            onClick={() => navigate('/shop')} 
            className="bg-gray-900 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gold transition-all"
          >
            Back to Collection
          </button>
        </div>
      </div>
    );
  }

  const defaultSizes = ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];
  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : defaultSizes;

  const handleAddToCart = () => {
    if (!currentUser) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    for (let i = 0; i < quantity; i++) {
       addToCart(product, selectedSize);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-gold mb-10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Treasures</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square bg-gray-50 border border-gray-100 overflow-hidden rounded-xl">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="aspect-square bg-gray-50 rounded-lg border border-gray-100 overflow-hidden cursor-pointer hover:border-gold transition-colors">
                    <img src={product.image} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="pt-0 md:pt-4"
          >
            <h1 className="text-3xl md:text-6xl font-display font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center space-x-4 mb-4">
               <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 md:w-4 h-3 md:h-4 fill-current" />)}
               </div>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">(28 Reviews)</span>
            </div>

            <p className="text-3xl md:text-4xl font-display font-medium text-gold mb-4">৳{(Number(product.price) || 0).toLocaleString()}</p>
            
            <div className="mb-10 inline-flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
               <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></span>
               <span className="text-[10px] uppercase tracking-widest font-black text-gray-500">
                 {product.stock > 0 ? `${product.stock} Units left in Aura Vault` : 'Out of Treasure'}
               </span>
            </div>
            
            <p className="text-gray-600 leading-relaxed mb-10 text-lg">
              {product.description}
            </p>            <div className="space-y-8">
              {/* Size Selector or Saree Info */}
              {isSaree ? (
                <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100/50">
                  <div className="flex items-center gap-3 text-[#E2136E] mb-2 font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E2136E] animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest">Saree Specification</span>
                  </div>
                  <p className="text-gray-900 font-bold text-lg">
                    • এই প্রোডাক্টের সাইজ প্রায় ১২–১৪ হাত লম্বা 
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Select Size (cm)</span>
                    <button className="text-[10px] uppercase tracking-widest font-bold text-gold hover:underline">Size Guide</button>
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-10 border text-xs font-bold transition-all rounded-sm ${
                          selectedSize === size 
                          ? 'border-gold bg-gold text-white' 
                          : 'border-gray-100 hover:border-gold/50 text-gray-500'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center space-x-6">
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-full h-12">
                   <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 hover:text-gold transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                   </button>
                   <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                   <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 hover:text-gold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                   </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-grow bg-gray-900 text-white px-10 py-5 rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-[#E2136E] transition-all shadow-lg flex items-center justify-center space-x-3"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Purchase Heritage</span>
                </button>
              </div>
            </div>

            {/* Product Meta */}
            <div className="mt-12 pt-8 border-t border-gray-100 space-y-6">
               <div className="flex space-x-10">
                 <button 
                  onClick={() => setActiveTab('details')}
                  className={`text-[10px] uppercase tracking-widest font-bold pb-2 border-b-2 transition-all ${activeTab === 'details' ? 'border-gold text-gold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                 >
                   Details
                 </button>
                 <button 
                  onClick={() => setActiveTab('shipping')}
                  className={`text-[10px] uppercase tracking-widest font-bold pb-2 border-b-2 transition-all ${activeTab === 'shipping' ? 'border-[#E2136E] text-[#E2136E]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                 >
                   🚚 delivery info
                 </button>
               </div>
               
                <div className="text-sm text-gray-800 leading-relaxed">
                  {activeTab === 'details' ? (
                    <div className="space-y-4">
                       {isSaree ? (
                         <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[#E2136E] font-display font-bold border-b border-rose-100 pb-2">
                               <span className="text-lg">🧵</span>
                               <span className="text-sm md:text-base">শাড়ি সম্পর্কে সংক্ষেপে (Product Details)</span>
                            </div>
                            <ul className="space-y-3 text-gray-950 font-semibold md:text-base">
                               <li className="flex gap-2"><span>•</span> <span>কাপড়: মসলিন, জর্জেট, সিল্ক, কটন, হ্যান্ডপেইন্টেড ও কারচুপি কাপড়</span></li>
                               <li className="flex gap-2"><span>•</span> <span>ডিজাইন: হ্যান্ড পেইন্ট 🎨, কারচুপি কাজ 🧵, প্রিন্ট ও ব্লক প্রিন্ট</span></li>
                               <li className="flex gap-2"><span>•</span> <span>তৈরি প্রক্রিয়া: কাপড় নির্বাচন → ডিজাইন → হাতের কাজ/প্রিন্ট → ফিনিশিং → প্রস্তুত</span></li>
                               <li className="flex gap-2"><span>•</span> <span>পরার স্টাইল: সিম্পল, ট্র্যাডিশনাল, পার্টি ওয়্যার ও মডার্ন ফিউশন</span></li>
                               <li className="flex gap-2"><span>•</span> <span>দাম নির্ভর করে: কাপড়, কাজের ধরন, ডিজাইন ও মানের উপর</span></li>
                               <li className="mt-4 p-3 bg-rose-50 text-[#E2136E] rounded-xl border border-rose-100 text-center text-sm">
                                  ৩০% অগ্রিম প্রদান আবশ্যক (30% Advance Required)
                               </li>
                            </ul>
                         </div>
                       ) : (
                         <ul className="list-disc pl-5 space-y-3">
                            <li className="font-bold">Handcrafted premium finish with artistic attention to detail</li>
                            <li>Dimensions: Adjustable standard size for perfect fit</li>
                            <li>Artisan handmade with premium local materials</li>
                            <li>Comes in our signature luxury eco-friendly packaging</li>
                         </ul>
                       )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
                        <ul className="space-y-3 text-sm md:text-base text-gray-950 font-semibold">
                            <li className="flex items-center gap-3">
                              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-lg">📦</span>
                              <span>সারা বাংলাদেশে কুরিয়ার সার্ভিসের মাধ্যমে ডেলিভারি</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-lg">⏳</span>
                              <span>হ্যান্ড পেইন্ট ও কারচুপি পণ্য প্রি-অর্ডার ভিত্তিতে তৈরি</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-lg">🧵</span>
                              <span>ডেলিভারি সময়: ১৫–১৮ দিন (হ্যান্ডমেড পণ্য)</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-lg">🛍️</span>
                              <span>হাতে তৈরি চুড়ির ডেলিভারি সময়: ২–৪ দিন</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-lg">💰</span>
                              <span>কুরিয়ার চার্জ প্রযোজ্য</span>
                            </li>
                            <li className="mt-4 p-4 bg-[#E2136E] text-white rounded-2xl text-center shadow-lg transform -rotate-1">
                                ৩০% অগ্রিম প্রদান আবশ্যক (30% Advance Required)
                            </li>
                        </ul>
                    </div>
                  )}
               </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 md:mt-40">
            <h3 className="text-2xl md:text-3xl font-display font-medium text-center mb-10 md:mb-16 underline underline-offset-8 decoration-gold/30">You Might Also Adore</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 hover-cards-animate">
               {relatedProducts.map(p => (
                 <ProductCard key={p.id} product={{...p, isFeatured: false}} />
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
