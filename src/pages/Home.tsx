import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Truck, User } from 'lucide-react';

const Home: React.FC = () => {
  const { products } = useProducts();
  const featuredProducts = products
    ? products
        .filter(p => p && (p.isFeatured || p.featured) && p.status !== 'Draft')
        .slice(0, 5)
    : [];

  return (
    <div className="overflow-x-hidden">
      {/* Premium Animated Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
        {/* Dynamic Animated Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            animate={{ 
              background: [
                "radial-gradient(circle at 0% 0%, #FFF5F8 0%, #FFFFFF 50%, #F5F8FF 100%)",
                "radial-gradient(circle at 100% 100%, #FFF5F8 0%, #FFFFFF 50%, #F8F5FF 100%)",
                "radial-gradient(circle at 100% 0%, #FFF5F8 0%, #FFFFFF 50%, #F5F8FF 100%)",
                "radial-gradient(circle at 0% 100%, #FFF5F8 0%, #FFFFFF 50%, #F8F5FF 100%)",
              ]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-80"
          />
          
          {/* Sparkle Dust / Particles */}
          {[...Array(window.innerWidth < 768 ? 8 : 20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-rose-200 rounded-full blur-[1px]"
              initial={{ 
                x: Math.random() * 2000 - 500, 
                y: Math.random() * 1000, 
                opacity: 0 
              }}
              animate={{ 
                y: [null, -100, -200], 
                opacity: [0, 0.4, 0],
                scale: [1, 1.5, 1]
              }}
              transition={{ 
                duration: 5 + Math.random() * 10, 
                repeat: Infinity, 
                delay: Math.random() * 10 
              }}
            />
          ))}

          {/* Floating Floral Shapes (Blurred) - Hidden on smallest mobile for speed */}
          <motion.div 
            animate={{ 
              rotate: 360,
              y: [0, 30, 0]
            }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 bg-rose-100/30 rounded-full blur-[80px] md:blur-[100px]"
          />
          <motion.div 
            animate={{ 
              rotate: -360,
              y: [0, -40, 0]
            }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-20 w-[30rem] h-[30rem] bg-indigo-50/20 rounded-full blur-[120px]"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-12 pb-16 lg:pt-16 lg:pb-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Side: Content (Comes first on mobile) */}
          <div className="flex-1 text-left lg:pt-8 mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-3 mb-8">
                <span className="w-12 h-[1.5px] bg-[#E2136E]" />
                <span className="text-[11px] md:text-sm font-black uppercase tracking-[0.5em] text-gray-900">
                  Premium <span className="text-[#E2136E]">Handcrafts</span>
                </span>
              </div>
              
              <motion.h1 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-display text-gray-950 leading-[0.9] md:leading-[0.85] mb-10 font-bold tracking-tighter"
              >
                Hafiza's <br />
                <span className="text-[#E2136E] italic font-medium relative inline-block">
                  Aura
                  <motion.span 
                    className="absolute -bottom-4 left-0 w-full h-2 bg-gradient-to-r from-[#E2136E] via-[#FFD700] to-transparent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1.5, duration: 1.2 }}
                  />
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="text-gray-700 text-lg md:text-2xl mb-12 max-w-xl leading-relaxed font-medium"
              >
                "শৈল্পিক ছোঁয়ায় <span className="text-[#E2136E]">অনন্য সৌন্দর্য</span> — যেখানে প্রতিটি পণ্য আপনার আভিজাত্য প্রকাশ করে।"
              </motion.p>
              
              <div className="flex flex-wrap gap-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    to="/shop" 
                    className="group relative inline-flex items-center gap-4 bg-gray-900 text-white px-12 py-6 text-[11px] font-black uppercase tracking-[0.4em] overflow-hidden transition-all shadow-[0_20px_50px_rgba(0,0,0,0.1)] active:shadow-inner"
                  >
                    <span className="relative z-10">Shop Now</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                    <div className="absolute inset-0 bg-[#E2136E] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Showcase (Comes second on mobile) */}
          <div className="flex-1 relative w-full lg:max-w-none mt-16 lg:mt-0">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1.5, delay: 0.5 }}
               className="relative z-10"
            >
              <div className="relative aspect-[4/5] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(226,19,110,0.4)] border-[8px] md:border-[16px] border-white group">
                 <img 
                    src="https://nrfvzhwsdhtxhtzevwne.supabase.co/storage/v1/object/public/product%20photo/WhatsApp%20Image%202026-05-08%20at%204.23.09%20PM%20(1).jpeg" 
                    alt="Hafiza's Aura Luxury" 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#E2136E]/40 to-transparent" />
                 
                 {/* Floating Labels */}
                 <div className="absolute top-6 left-6 md:top-8 md:left-8 bg-white/95 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-xl border border-white/50 animate-bounce-slow">
                    <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-[#E2136E] mb-1">Authentic</p>
                    <p className="text-[10px] md:text-xs font-bold text-gray-900">Handmade Beauty</p>
                 </div>
              </div>

              {/* Decorative Circle Elements */}
              <div className="absolute -top-10 -left-10 w-24 h-24 md:w-32 md:h-32 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
              <div className="absolute -bottom-10 -right-10 w-24 h-24 md:w-32 md:h-32 bg-[#E2136E]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
            </motion.div>

            {/* Glowing Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#E2136E]/15 rounded-full blur-[100px] -z-10" />
          </div>
        </div>
      </section>

      {/* Aura Story Banner (Now its own section with gap) */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-24 bg-gradient-to-br from-[#FFF5F8] via-white to-[#F0F5FF] relative overflow-hidden"
      >
        {/* Artistic Background Accents */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -right-40 w-[40rem] h-[40rem] bg-rose-50 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -left-40 w-[40rem] h-[40rem] bg-[#E2136E]/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E2136E]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E2136E]/40 to-transparent" />
        </div>

         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="max-w-5xl mx-auto text-center"
            >
               <div className="bg-white/95 backdrop-blur-3xl p-10 md:p-20 rounded-[4rem] border border-rose-100/80 shadow-[0_40px_80px_-20px_rgba(226,19,110,0.15)] relative overflow-hidden group">
                 {/* Internal Gradient Glows */}
                 <div className="absolute -top-24 -left-24 w-64 h-64 bg-rose-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                 <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                 
                 <motion.p 
                    className="relative z-10 text-gray-950 text-base md:text-xl leading-[2.1] font-bold tracking-wide"
                    style={{ whiteSpace: 'pre-line' }}
                 >
                    ✨ <span className="text-[#E2136E] text-2xl md:text-4xl font-display italic block mb-8 drop-shadow-sm">Hafiza’s Aura</span>
                    
                    <span className="block mb-8">
                      -তে আপনি পাবেন হাতে তৈরি <span className="text-white bg-[#E2136E] px-6 py-2 rounded-full text-base md:text-lg shadow-lg shadow-rose-200">চুড়ি</span>, হ্যান্ড পেইন্ট ও <span className="text-amber-600 border-b-4 border-amber-200/50">কারচুপি কাজের শাড়ি</span>, দোপাট্টা এবং ওড়নার এক্সক্লুসিভ কালেকশন 💫 প্রতিটি পণ্য তৈরি করা হয় নিখুঁত যত্ন ও ভালোবাসা দিয়ে, যা আপনাকে দেবে ইউনিক ও স্টাইলিশ লুক ✨ 
                    </span>

                    <span className="block mb-6">
                      হ্যান্ড পেইন্ট ও কারচুপি পণ্যগুলো প্রি-অর্ডার ভিত্তিতে তৈরি হয় ⏳ এবং ডেলিভারি সময় ১৫–১৮ দিন 🚚। শাড়ি ও অন্যান্য প্রোডাক্টের জন্য <span className="bg-[#E2136E] text-white px-8 py-3 rounded-2xl shadow-2xl shadow-rose-300 inline-block transform -rotate-1 hover:rotate-0 transition-transform duration-500">৩০% অগ্রিম প্রদান করতে হবে</span> 💰, আর চুড়ি শুধুমাত্র Cash on Delivery-তে অর্ডার করা যাবে 🛒। 
                    </span>
                    
                    <span className="block mt-10 text-[#E2136E] font-display italic text-2xl md:text-3xl animate-pulse tracking-widest">
                      আপনার স্টাইল, আপনার পরিচয় 💖
                    </span>
                 </motion.p>
               </div>
            </motion.div>
         </div>
      </motion.section>

      {/* Featured Collection */}
      <section id="collection" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-gold mb-4">Our Signature</h2>
            <h1 className="text-4xl md:text-6xl font-display font-medium text-gray-900 mb-6 relative inline-block">
              Featured Treasures
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-aura-pink/20 rounded-full"></span>
            </h1>
            <p className="text-gray-500 max-w-xl text-xs md:text-sm leading-relaxed mt-4">
              Explore our most coveted Handcrafted Bangles and Elite Saree collection, each designed with Hafiza's signature aura.
            </p>
          </div>

          <div className="mt-12 text-center mb-12 flex flex-wrap justify-center gap-4">
            <Link to="/shop?category=Saree" className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-aura-pink hover:text-rose-700 bg-blush px-6 py-3 rounded-full border border-rose-100 transition-all shadow-sm">
              <span>Saree Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/shop?category=Bangles" className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gold hover:text-amber-600 bg-gold/5 px-6 py-3 rounded-full border border-gold/10 transition-all shadow-sm">
              <span>Bangle Collection</span>
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
