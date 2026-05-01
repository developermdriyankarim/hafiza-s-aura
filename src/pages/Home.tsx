import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Truck, User } from 'lucide-react';

const Home: React.FC = () => {
  const { products } = useProducts();
  const featuredProducts = products.filter(p => p.isFeatured && p.status !== 'Draft').slice(0, 4);

  return (
    <div className="overflow-x-hidden">
      {/* Custom Typography Hero Section */}
      <section className="relative min-h-[70vh] bg-[#faf8f5] flex items-center justify-center overflow-hidden border-b border-gray-100">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f3eee7]/30 -skew-x-12 translate-x-20 z-0" />
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gold/5 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center space-x-4 mb-8">
              <span className="h-[1px] w-12 bg-gold/40"></span>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] text-gold">
                Bangali Bangles
              </span>
              <span className="h-[1px] w-12 bg-gold/40"></span>
            </div>
            
            <h1 className="text-5xl md:text-9xl font-display text-gray-900 leading-tight mb-8 font-bold tracking-tighter">
              Hafiza's <br />
              <span className="text-luxury italic font-medium">Aura</span>
            </h1>
            
            <p className="text-gray-500 text-base md:text-xl mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed font-light italic">
              "Handcrafted churi sets that tell stories of heritage, grace, and timeless beauty."
            </p>
            
            {/* Bangla Highlight Banner */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 md:mt-12 p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-r from-amber-50 via-white to-orange-50 border border-gold/20 shadow-xl relative overflow-hidden group text-left sm:text-center"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-gold to-emerald-500"></div>
              <div className="relative z-10">
                <span className="inline-block px-4 py-1 rounded-full bg-gold text-white text-[10px] font-black uppercase tracking-widest mb-4">
                  এক্সক্লুসিভ অফার
                </span>
                <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-gray-900 via-gold to-gray-900 bg-clip-text text-transparent leading-relaxed md:leading-relaxed">
                  “মাত্র ১ টাকাও অগ্রিম ছাড়াই সারা দেশে হোম ডেলিভারি!
                </h3>
                <p className="text-gray-600 text-sm md:text-base font-medium leading-relaxed mb-2">
                  ডেলিভারির সময় পণ্য দেখে-শুনে পছন্দ হলে তবেই মূল্য পরিশোধ করুন।
                </p>
                <p className="text-gold font-bold text-base md:text-lg">
                  আপনার পছন্দের সেরা বাঙালি চুড়ি এখন খুব সহজেই — Hafiza’s Aura থেকে।
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gold/10 rounded-full blur-2xl group-hover:bg-gold/20 transition-all"></div>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-12 mt-12">
              <a 
                href="#collection" 
                className="bg-gray-900 text-white px-16 py-6 text-xs font-black uppercase tracking-[0.4em] hover:bg-gold transition-all duration-700 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] active:scale-95 luxury-shadow w-full sm:w-auto"
              >
                Shop Now
              </a>
              <Link 
                to="/shop" 
                className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 hover:text-gold transition-colors pb-1 border-b border-gray-200 hover:border-gold"
              >
                Explore Gallery
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Collection */}
      <section id="collection" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="text-xs uppercase tracking-[0.4em] font-black text-gold mb-4">Our Signature</h2>
            <h1 className="text-4xl md:text-6xl font-display font-medium text-gray-900 mb-6 relative inline-block">
              Featured Bangles
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gold/30 rounded-full"></span>
            </h1>
            <p className="text-gray-500 max-w-xl text-sm leading-relaxed mt-4">
              Explore our most coveted designs, each hand-picked for its unique aura and exquisite detailing.
            </p>
          </div>

          <div className="mt-16 text-center mb-12">
            <Link to="/shop" className="inline-flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-gray-900 hover:text-gold border-b border-gray-900 hover:border-gold pb-1 transition-all">
              <span>See Full Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-blush/60 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 { name: "প্রিয়া সাঙ্ঘাভি", text: "চুড়ির কারুকাজগুলো সত্যিই অসাধারণ! অনেক সুন্দর প্রোডাক্ট, আমার প্রত্যাশার চেয়েও অনেক ভালো।", rating: 5 },
                 { name: "মেহরিন আর.", text: "প্যাকেজিং টাও ছিল দেখার মতো। অনেক অনেক ধন্যবাদ হাফিজাস আউরাকে এমন সুন্দর প্রোডাক্টের জন্য।", rating: 5 },
                 { name: "সুমাইয়া কে.", text: "আমি যেমনটা চেয়েছিলাম ঠিক তেমনই পেয়েছি। অনেক সুন্দর চুড়ি, একদম নিখুঁত ফিটিং।", rating: 5 }
               ].map((review, i) => (
                 <div key={i} className="flex flex-col items-center text-center p-8 border border-gold/5 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-blush border-2 border-gold/10 text-gold/40">
                       <User className="w-10 h-10" />
                    </div>
                    <div className="flex space-x-1 mb-4">
                       {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gold text-gold" />)}
                    </div>
                    <p className="text-gray-600 italic mb-6 leading-relaxed">"{review.text}"</p>
                    <h5 className="text-sm font-bold uppercase tracking-widest text-gray-900">{review.name}</h5>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="w-8 h-8 text-gold mb-3" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Authenticated</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Truck className="w-8 h-8 text-gold mb-3" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Star className="w-8 h-8 text-gold mb-3" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Premium Quality</span>
            </div>
             <div className="flex flex-col items-center text-center">
              <ShieldCheck className="w-8 h-8 text-gold mb-3" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Secure Payment</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
