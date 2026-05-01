import React from 'react';
import { Truck, RotateCcw, ShieldCheck, MapPin } from 'lucide-react';

const ShippingReturns: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-4 max-w-4xl mx-auto">
      <h1 className="text-5xl font-display text-gray-900 mb-12 italic underline decoration-gold/20 underline-offset-8 text-center">Shipping & Returns</h1>
      
      <div className="space-y-16">
        <section className="space-y-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center border border-gold/20">
              <Truck className="w-6 h-6 text-gold" />
            </div>
            <h2 className="text-2xl font-display">Dispatch & Delivery</h2>
          </div>
          <div className="prose prose-gray max-w-none text-gray-500 leading-relaxed space-y-6">
            <p>
              Each piece from Hafiza's Aura is a handcrafted masterpiece. Please allow 3-5 business days for our artisans to prepare your order for safe transit.
            </p>
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">Domestic Shipping (Bangladesh)</h3>
              <ul className="space-y-4 list-none p-0">
                <li className="flex justify-between items-center text-sm">
                  <span>Inside Dhaka</span>
                  <span className="font-bold text-gray-900">৳60 (24-48 Hours)</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span>Outside Dhaka</span>
                  <span className="font-bold text-gray-900">৳120 (3-5 Days)</span>
                </li>
              </ul>
            </div>
            <p>
              We use premium logistics partners to ensure your aura reaches you in pristine condition. Real-time tracking will be provided via SMS and Email upon dispatch.
            </p>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center border border-gold/20">
              <RotateCcw className="w-6 h-6 text-gold" />
            </div>
            <h2 className="text-2xl font-display">Heritage Exchange Policy</h2>
          </div>
          <div className="prose prose-gray max-w-none text-gray-500 leading-relaxed space-y-6">
            <p>
              Your satisfaction is our artisan's pride. If you are not entirely mesmerized by your selection, we offer a 7-day exchange policy.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-emerald-500 mb-2">Eligible</h4>
                  <p className="text-xs text-gray-400">Unused condition, original packaging intact, artisan tag attached.</p>
               </div>
               <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-red-500 mb-2">Non-Eligible</h4>
                  <p className="text-xs text-gray-400">Custom bespoke orders, items on clearance, or any product showing signs of wear.</p>
               </div>
            </div>
            <p className="text-sm italic">
              * Note: Return shipping costs are the responsibility of the customer unless the artifact was received damaged.
            </p>
          </div>
        </section>

        <section className="bg-gray-900 text-white p-12 rounded-[3rem] space-y-8">
           <div className="flex items-center space-x-4">
              <ShieldCheck className="w-8 h-8 text-gold" />
              <h2 className="text-2xl font-display">The Aura Authenticity</h2>
           </div>
           <p className="text-gray-400 text-sm leading-relaxed">
              Every shipment is insured and requires a signature upon arrival. Our team inspects each piece twice under polarized lighting before it leaves the vault to ensure a flawless experience.
           </p>
           <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gold">
              <div className="flex items-center gap-2">
                 <Truck className="w-4 h-4" />
                 <span>Free Dhaka delivery over ৳5000</span>
              </div>
              <div className="flex items-center gap-2">
                 <MapPin className="w-4 h-4" />
                 <span>Worldwide Artisan Shipping available</span>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default ShippingReturns;
