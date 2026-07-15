import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useUsers } from '../context/UserContext';
import { Order } from '../types';
import { ShoppingBag, ArrowRight, ShieldCheck, Mail, Phone, MapPin, CheckCircle2, QrCode, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { currentUser } = useUsers();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    location: 'Inside Dhaka' as 'Inside Dhaka' | 'Outside Dhaka',
    transactionId: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'bKash'>('Cash on Delivery');

  // Check if any item is a Saree (Inclusive check)
  const isSareeItem = (item: any) => {
    const cat = (item.category || '').toLowerCase();
    const name = (item.name || '').toLowerCase();
    return cat.includes('saree') || cat.includes('sharee') || cat.includes('shari') || 
           name.includes('saree') || name.includes('sharee') || name.includes('shari');
  };

  // Check if any item is a Bangles/Churi
  const isBanglesItem = (item: any) => {
    const cat = (item.category || '').toLowerCase();
    const name = (item.name || '').toLowerCase();
    return cat.includes('bangle') || cat.includes('churi') || name.includes('bangle') || name.includes('churi');
  };

  const sareeItems = cart.filter(isSareeItem);
  const hasSaree = sareeItems.length > 0;
  
  // Calculate advance for Sarees (30% of saree subtotal)
  const sareeSubtotal = sareeItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const requiredAdvance = Math.ceil(sareeSubtotal * 0.3);

  const deliveryFee = formData.location === 'Inside Dhaka' ? 110 : 130;
  const finalTotal = (Number(totalPrice) || 0) + deliveryFee;

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (cart.length === 0) {
      navigate('/shop');
    }
  }, [currentUser, cart.length, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (paymentMethod === 'bKash' && !formData.transactionId) {
      alert('Please provide the bKash Transaction ID for your payment.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const orderId = window.crypto?.randomUUID ? window.crypto.randomUUID() : 
                     'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                       const r = Math.random() * 16 | 0;
                       const v = c === 'x' ? r : (r & 0x3 | 0x8);
                       return v.toString(16);
                     });

      const newOrder: Order = {
        id: orderId,
        userId: currentUser?.id,
        phone: formData.phone,
        customer: {
          fullName: formData.name,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          phone: formData.phone,
          location: formData.location,
        },
        items: [...cart],
        total: finalTotal,
        deliveryFee: deliveryFee,
        advanceAmount: paymentMethod === 'bKash' ? finalTotal : 0,
        paymentMethod: paymentMethod,
        transactionId: formData.transactionId,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      await addOrder(newOrder);
      clearCart();
      navigate('/order-success', { state: { orderId, hasSaree } });
    } catch (err) {
      console.error('Order Submission Error:', err);
      alert('Failed to place order. Please check your data and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 || !currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display text-center mb-10 md:mb-16 tracking-tight">Finalize Your Selection</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
          {/* Shipping Form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-10 rounded-2xl luxury-shadow border border-gray-100">
             <h2 className="text-lg md:text-xl font-display mb-8 border-b border-gray-50 pb-4">Shipping Details</h2>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                   <div className="relative">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 absolute top-3 left-4">Full Name</label>
                      <input 
                        required
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Hafiza Rahman"
                        className="w-full bg-gray-50 border-none pt-8 pb-3 px-4 rounded-xl focus:ring-1 focus:ring-gold transition-all font-medium"
                      />
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                         <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 absolute top-3 left-4">Email Address</label>
                         <input 
                           required
                           type="email" 
                           name="email"
                           value={formData.email}
                           onChange={handleInputChange}
                           placeholder="aura@example.com"
                           className="w-full bg-gray-50 border-none pt-8 pb-3 px-4 rounded-xl focus:ring-1 focus:ring-gold transition-all"
                         />
                      </div>
                      <div className="relative">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 absolute top-3 left-4">Phone Number</label>
                        <input 
                          required
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+880 17XXX-XXXXXX"
                          className="w-full bg-gray-50 border-none pt-8 pb-3 px-4 rounded-xl focus:ring-1 focus:ring-gold transition-all"
                        />
                      </div>
                   </div>
                   
                   <div className="relative">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 absolute top-3 left-4">Delivery Location</label>
                      <select 
                        required
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border-none pt-8 pb-3 px-4 rounded-xl focus:ring-1 focus:ring-gold transition-all appearance-none"
                      >
                         <option value="Inside Dhaka">Inside Dhaka (৳110)</option>
                         <option value="Outside Dhaka">Outside Dhaka (৳130)</option>
                      </select>
                   </div>

                   <div className="relative">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 absolute top-3 left-4">Shipping Address</label>
                      <input 
                        required
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Road 1, House 2, Block A"
                        className="w-full bg-gray-50 border-none pt-8 pb-3 px-4 rounded-xl focus:ring-1 focus:ring-gold transition-all"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                         <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 absolute top-3 left-4">City</label>
                         <input 
                           required
                           type="text" 
                           name="city"
                           value={formData.city}
                           onChange={handleInputChange}
                           className="w-full bg-gray-50 border-none pt-8 pb-3 px-4 rounded-xl focus:ring-1 focus:ring-gold transition-all"
                         />
                      </div>
                      <div className="relative">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 absolute top-3 left-4">Postal Code</label>
                        <input 
                          required
                          type="text" 
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border-none pt-8 pb-3 px-4 rounded-xl focus:ring-1 focus:ring-gold transition-all"
                        />
                      </div>
                   </div>
                </div>

                <div className="pt-10">
                   <h3 className="text-xl font-display mb-6 italic">Payment Method Selection</h3>
                   
                   <div className="grid grid-cols-1 gap-4">
                      <label className={`flex items-center p-6 border-2 rounded-3xl cursor-pointer transition-all ${paymentMethod === 'Cash on Delivery' ? 'border-gold bg-gold/5 shadow-md scale-[1.01]' : 'border-gray-100 hover:bg-gray-50'}`}
                              onClick={() => setPaymentMethod('Cash on Delivery')}>
                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Cash on Delivery' ? 'border-gold bg-gold' : 'border-gray-300'}`}>
                            {paymentMethod === 'Cash on Delivery' && <div className="w-2 h-2 bg-white rounded-full" />}
                         </div>
                         <div className="ml-6">
                            <span className="block text-sm font-black uppercase tracking-widest text-gray-900">Cash on Delivery</span>
                            <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Pay upon grand arrival</span>
                         </div>
                         <ShieldCheck className={`ml-auto w-6 h-6 ${paymentMethod === 'Cash on Delivery' ? 'text-gold' : 'text-gray-200'}`} />
                      </label>
                      
                      <label className={`flex items-center p-6 border-2 rounded-3xl cursor-pointer transition-all ${paymentMethod === 'bKash' ? 'border-rose-500 bg-rose-50 shadow-md scale-[1.01]' : 'border-gray-100 hover:bg-gray-50'}`}
                              onClick={() => setPaymentMethod('bKash')}>
                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'bKash' ? 'border-rose-500 bg-rose-500' : 'border-gray-300'}`}>
                            {paymentMethod === 'bKash' && <div className="w-2 h-2 bg-white rounded-full" />}
                         </div>
                         <div className="ml-6">
                            <span className="block text-sm font-black uppercase tracking-widest text-gray-900">bKash Payment</span>
                            <span className="block text-[10px] text-rose-400 font-bold uppercase tracking-widest mt-0.5">Secure mobile verification</span>
                         </div>
                         <CheckCircle2 className={`ml-auto w-6 h-6 ${paymentMethod === 'bKash' ? 'text-rose-500' : 'text-gray-200'}`} />
                      </label>
                      
                      {paymentMethod === 'bKash' && (
                         <div className="bg-white border border-rose-100 rounded-[2.5rem] mt-4 overflow-hidden shadow-2xl shadow-rose-100/50 animate-in fade-in zoom-in duration-700">
                            {/* Dominant QR Section */}
                            <div className="bg-gradient-to-b from-[#FFF5F8] to-white p-6 md:p-10 text-center relative overflow-hidden">
                               <div className="absolute top-0 right-0 p-8 opacity-5">
                                  <QrCode className="w-24 h-24 text-[#E2136E]" />
                               </div>
                               
                               <div className="mb-8 relative inline-block">
                                  <div className="absolute inset-0 bg-[#E2136E]/5 blur-3xl rounded-full scale-150 animate-pulse" />
                                  <div className="relative bg-white p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(226,19,110,0.15)] border border-white">
                                     <div className="bg-gray-50 p-6 md:p-12 rounded-[1.5rem] border border-gray-100 flex items-center justify-center w-full max-w-[280px] md:max-w-[380px]">
                                        <img 
                                           src="https://nrfvzhwsdhtxhtzevwne.supabase.co/storage/v1/object/public/product%20photo/WhatsApp%20Image%202026-05-08%20at%204.48.19%20PM.jpeg" 
                                           alt="bKash QR" 
                                           className="w-full h-auto object-contain mx-auto transition-transform hover:scale-105 duration-500"
                                           referrerPolicy="no-referrer"
                                        />
                                     </div>
                                  </div>
                               </div>

                               <div className="space-y-4">
                                  <p className="text-[11px] font-medium text-gray-500 max-w-[280px] mx-auto leading-relaxed">
                                     সেন্ট মানি করতে বিকাশ অ্যাপ দিয়ে QR কোডটি স্ক্যান করুন
                                  </p>
                                  
                                  <div className="pt-2">
                                     <span className="bg-[#E2136E]/10 text-[#E2136E] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-[#E2136E]/20 inline-flex items-center gap-2 shadow-sm italic">
                                        Full Payment via bKash
                                     </span>
                                  </div>
                               </div>
                            </div>

                            <div className="p-6 md:p-8 space-y-6 bg-white/50 backdrop-blur-md text-gray-900 font-bold italic uppercase tracking-widest">
                               <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-[#FFF1F6] p-4 rounded-2xl border border-[#E2136E]/10 flex flex-col justify-center">
                                     <p className="text-[8px] font-black uppercase tracking-widest text-[#E2136E]/60 mb-1">Total Value</p>
                                     <p className="text-lg font-display text-[#E2136E]/40 line-through decoration-[#E2136E]/10">৳{finalTotal.toLocaleString()}</p>
                                  </div>
                                  <div className="bg-[#E2136E] p-4 rounded-2xl text-white shadow-xl shadow-[#E2136E]/20">
                                     <p className="text-[8px] font-black uppercase tracking-widest text-white/70 mb-1">Payable Amount</p>
                                     <p className="text-xl font-display">৳{finalTotal.toLocaleString()}</p>
                                  </div>
                               </div>

                               <div className="relative group overflow-hidden rounded-2xl md:rounded-3xl border border-gray-100 transition-all focus-within:border-[#E2136E]/20">
                                  <label className="text-[8px] uppercase tracking-[0.3em] font-black text-gray-300 absolute top-3 left-0 right-0 z-10 text-center pointer-events-none">Transaction ID</label>
                                  <input 
                                     required
                                     type="text" 
                                     name="transactionId"
                                     value={formData.transactionId}
                                     onChange={handleInputChange}
                                     placeholder="PASTE ID HERE"
                                     className="w-full bg-gray-50/50 pt-9 pb-3 px-6 focus:bg-white focus:ring-0 transition-all font-mono text-base md:text-xl tracking-[0.4em] text-gray-950 text-center uppercase"
                                  />
                                </div>
                               <div className="flex items-center justify-center gap-3 px-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#E2136E]/50">
                                     Auto verification active
                                  </p>
                               </div>
                            </div>
                         </div>
                      )}
                   </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-white px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest transition-all mt-10 shadow-xl disabled:opacity-50 disabled:cursor-wait ${paymentMethod === 'bKash' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-gray-900 hover:bg-gold'}`}
                >
                  {isSubmitting ? 'Processing Order...' : 'Place Aura Order'}
                </button>
             </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
             <div className="bg-white p-8 rounded-2xl border border-gray-100 luxury-shadow">
                <h2 className="text-lg font-display mb-6">Your Heritage Summary</h2>
                <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {cart.map(item => (
                     <div key={`${item.id}-${item.size}`} className="flex items-center space-x-4 pb-4 border-b border-gray-50">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
                               <img src={item.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            {isSareeItem(item) && (
                                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Saree</span>
                            )}
                        </div>
                        <div className="flex-grow">
                           <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
                           <div className="flex items-center gap-3 mt-1">
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                              {item.size && (
                                <span className="text-[10px] bg-gray-50 text-gold px-2 py-0.5 rounded font-black uppercase tracking-widest">Size: {item.size}</span>
                              )}
                           </div>
                        </div>
                        <span className="text-sm font-bold">৳{( (Number(item.price) || 0) * (Number(item.quantity) || 0) ).toLocaleString()}</span>
                     </div>
                   ))}
                </div>
                
                <div className="space-y-3">
                   <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span>৳{(Number(totalPrice) || 0).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-sm text-gray-500">
                      <span>Shipping ({formData.location})</span>
                      <span className="text-gold font-bold">৳{deliveryFee.toLocaleString()}</span>
                   </div>

                   <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                      <span className="text-[10px] uppercase tracking-widest font-black text-gray-900">Total Value</span>
                      <span className="text-2xl font-display text-gold">৳{(Number(finalTotal) || 0).toLocaleString()}</span>
                   </div>
                </div>
             </div>

             <div className="bg-gold/10 p-6 rounded-2xl border border-gold/20 flex items-start space-x-4">
                <ShieldCheck className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                <div>
                   <p className="text-xs font-bold uppercase tracking-widest text-gold mb-1">Authenticated Purchase</p>
                   <p className="text-[10px] leading-relaxed text-gray-600">Your treasures are handled with extreme precision. We guarantee the authenticity and craftsmanship of every Saree and piece of jewelry in your selection.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
