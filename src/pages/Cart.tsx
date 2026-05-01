import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUsers } from '../context/UserContext';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { currentUser } = useUsers();
  const navigate = useNavigate();

  const handleCheckoutClick = (e: React.MouseEvent) => {
    if (!currentUser) {
      e.preventDefault();
      alert('Artisans require your identification. Please log in to proceed to checkout.');
      navigate('/login');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
        <div className="text-center group">
          <div className="relative mb-8 flex justify-center">
             <ShoppingBag className="w-24 h-24 text-gray-100 group-hover:text-gold/20 transition-colors duration-500" />
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg"
             >
               <ShoppingBag className="w-8 h-8 text-gold" />
             </motion.div>
          </div>
          <h2 className="text-3xl font-display mb-4">Your Treasury is Empty</h2>
          <p className="text-gray-500 mb-10 max-w-xs mx-auto">Discover our curated heritage collections and find the perfect churi that calls out to your aura.</p>
          <Link to="/shop" className="bg-gold text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-accent-gold transition-all luxury-shadow">
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 md:mb-12">
           <h1 className="text-3xl md:text-4xl font-display mb-2">Shopping Bag</h1>
           <p className="text-[10px] md:text-xs uppercase tracking-widest text-gray-400 font-bold">You have {totalItems} items in your bag</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Cart Table */}
          <div className="lg:col-span-8 space-y-4">
             <AnimatePresence>
               {cart.map((item) => (
                 <motion.div 
                   key={item.id}
                   layout
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className="bg-white p-6 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-center gap-6 group hover:luxury-shadow transition-all"
                 >
                   <Link to={`/product/${item.id}`} className="w-32 aspect-square bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                   </Link>
                   
                   <div className="flex-grow text-center sm:text-left">
                      <span className="text-[9px] uppercase tracking-widest text-gold font-bold mb-1 block italic">{item.category}</span>
                      <h3 className="text-lg font-display font-semibold hover:text-gold transition-colors">
                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">Price per unit: ৳{(Number(item.price) || 0).toLocaleString()}</p>
                   </div>

                   <div className="flex items-center border border-gray-100 rounded-full bg-gray-50/50">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-3 text-gray-400 hover:text-gold"><Minus className="w-4 h-4" /></button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-3 text-gray-400 hover:text-gold"><Plus className="w-4 h-4" /></button>
                   </div>

                   <div className="text-lg font-bold text-gray-900 min-w-[80px] text-right">
                      ৳{((Number(item.price) || 0) * (Number(item.quantity) || 0)).toLocaleString()}
                   </div>

                   <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                   >
                      <Trash2 className="w-5 h-5" />
                   </button>
                 </motion.div>
               ))}
             </AnimatePresence>
          </div>

          {/* Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4 bg-white rounded-xl border border-gold/10 p-8 luxury-shadow sticky top-32"
          >
             <h2 className="text-xl font-display mb-8 underline underline-offset-8 decoration-gold/20">Order Summary</h2>
             
             <div className="space-y-6 mb-10">
                <div className="flex justify-between text-sm text-gray-500 uppercase tracking-widest">
                   <span>Subtotal</span>
                   <span>৳{(Number(totalPrice) || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 uppercase tracking-widest">
                   <span>Shipping</span>
                   <span className="text-green-600 font-bold">Complimentary</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 uppercase tracking-widest">
                   <span>Tax (Est.)</span>
                   <span>৳0.00</span>
                </div>
                <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                   <span className="text-xs uppercase tracking-[0.2em] font-bold text-gray-900">Final Aura Total</span>
                   <span className="text-3xl font-display font-medium text-gold">৳{(Number(totalPrice) || 0).toLocaleString()}</span>
                </div>
             </div>

              <Link to="/checkout" onClick={handleCheckoutClick} className="w-full bg-gray-900 text-white px-10 py-5 rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-gold transition-all flex items-center justify-center space-x-3 mb-6 group">
                <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Begin Checkout</span>
             </Link>

             <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest leading-relaxed">
               Secure payment via multiple luxury gateways including AMEX and Apple Pay.
             </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
