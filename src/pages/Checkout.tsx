import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useUsers } from '../context/UserContext';
import { Order } from '../types';
import { ShoppingBag, ArrowRight, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
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
    location: 'Inside Dhaka' as 'Inside Dhaka' | 'Outside Dhaka'
  });

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
    
    setIsSubmitting(true);
    try {
      // Use crypto.randomUUID() or fallback to a UUID-like string
      // Supabase expects a valid UUID format for the UUID column
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
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      try {
        await addOrder(newOrder);
      } catch (syncErr) {
        console.warn('Sync failed, using local order:', syncErr);
      }
      
      // Clear cart AFTER order is successfully added
      clearCart();
      
      // Redirect to order success page
      navigate('/order-success', { state: { orderId } });
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
    <div className="min-h-screen bg-gray-50 py-12 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display text-center mb-10 md:mb-16">Finalize Your Selection</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
          {/* Shipping Form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-10 rounded-xl luxury-shadow border border-gray-100">
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
                        className="w-full bg-gray-50 border-none pt-8 pb-3 px-4 rounded-lg focus:ring-1 focus:ring-gold transition-all font-medium"
                      />
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                         <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 absolute top-3 left-4 text-xs font-semibold">Email Address</label>
                         <input 
                           required
                           type="email" 
                           name="email"
                           value={formData.email}
                           onChange={handleInputChange}
                           placeholder="aura@example.com"
                           className="w-full bg-gray-50 border-none pt-8 pb-3 px-4 rounded-lg focus:ring-1 focus:ring-gold transition-all"
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
                          className="w-full bg-gray-50 border-none pt-8 pb-3 px-4 rounded-lg focus:ring-1 focus:ring-gold transition-all"
                        />
                      </div>
                   </div>
                   
                   {/* Delivery Location Selection */}
                   <div className="relative">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 absolute top-3 left-4">Delivery Location</label>
                      <select 
                        required
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border-none pt-8 pb-3 px-4 rounded-lg focus:ring-1 focus:ring-gold transition-all"
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
                        className="w-full bg-gray-50 border-none pt-8 pb-3 px-4 rounded-lg focus:ring-1 focus:ring-gold transition-all"
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
                           className="w-full bg-gray-50 border-none pt-8 pb-3 px-4 rounded-lg focus:ring-1 focus:ring-gold transition-all"
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
                          className="w-full bg-gray-50 border-none pt-8 pb-3 px-4 rounded-lg focus:ring-1 focus:ring-gold transition-all"
                        />
                      </div>
                   </div>
                </div>

                <div className="pt-10">
                   <h3 className="text-xl font-display mb-6">Payment Method</h3>
                   <div className="space-y-3">
                      <label className="flex items-center p-4 border border-gold bg-gold/5 rounded-xl cursor-not-allowed">
                         <input type="radio" checked readOnly className="text-gold focus:ring-gold" />
                         <span className="ml-4 text-sm font-semibold uppercase tracking-widest">Cash on Delivery (Standard)</span>
                         <ShieldCheck className="ml-auto w-5 h-5 text-gold" />
                      </label>
                      <div className="p-4 border border-gray-100 rounded-xl opacity-50 flex items-center">
                         <input type="radio" disabled />
                         <span className="ml-4 text-sm font-semibold uppercase tracking-widest">Credit Card / Gateway (Coming Soon)</span>
                      </div>
                   </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 text-white px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gold transition-all mt-10 shadow-xl disabled:opacity-50 disabled:cursor-wait"
                >
                  {isSubmitting ? 'Securing Your Aura...' : 'Confirm Aura Order'}
                </button>
             </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
             <div className="bg-white p-8 rounded-xl border border-gray-100 luxury-shadow">
                <h2 className="text-lg font-display mb-6">Your Heritage Summary</h2>
                <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {cart.map(item => (
                     <div key={`${item.id}-${item.size}`} className="flex items-center space-x-4 pb-4 border-b border-gray-50">
                        <div className="w-16 h-16 rounded bg-gray-50 overflow-hidden flex-shrink-0">
                           <img src={item.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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

             <div className="bg-gold/10 p-6 rounded-xl border border-gold/20 flex items-start space-x-4">
                <Mail className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                <div>
                   <p className="text-xs font-bold uppercase tracking-widest text-gold mb-1">Our Promise</p>
                   <p className="text-[10px] leading-relaxed text-gray-600">Once your order is confirmed, our artisans will package your treasures with the utmost care, ensuring the aura of your jewelry is preserved till its doorstep delivery.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
