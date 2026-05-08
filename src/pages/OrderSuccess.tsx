import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, ShoppingBag, ArrowRight, Package, Home } from 'lucide-react';

const OrderSuccess: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderId = location.state?.orderId || 'ORDER-UNKNOWN';
    const hasSaree = location.state?.hasSaree || false;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full bg-white rounded-2xl luxury-shadow p-12 text-center"
            >
                <div className="flex justify-center mb-8">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                        className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center"
                    >
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </motion.div>
                </div>

                <h1 className="text-4xl font-display mb-4 italic">Thank You</h1>
                <p className="text-gray-500 mb-2 uppercase tracking-[0.2em] font-bold text-xs italic">Your Selection is Being Prepared</p>
                <p className="text-gold font-mono font-medium mb-10">Order Reference: {orderId}</p>

                <div className="bg-gray-50/50 rounded-xl p-8 mb-10 space-y-6">
                    <p className="text-gray-600 leading-relaxed text-sm font-medium">
                        {hasSaree ? 'Your Exquisite Saree Selection is Confirmed.' : 'Your Aura Order is Successful.'}
                    </p>
                    <div className="text-gray-500 text-xs leading-relaxed space-y-4">
                        <p>
                            Thank you for your exquisite selection. Our artisans have been notified of your order and will begin preparing your heritage treasures with the care they deserve.
                        </p>
                        {hasSaree && (
                            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-left space-y-3 mt-6">
                                <p className="font-bold text-emerald-900 flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Artisan Delivery Timeline
                                </p>
                                <ul className="space-y-2 text-[10px] text-emerald-800 font-medium">
                                    <li>🌸 হ্যান্ড পেইন্ট / কারচুপি কাজ শুরু হয়েছে</li>
                                    <li>⏳ ১৫–১৮ দিনের মধ্যে আপনার ঠিকানায় গ্র্যান্ড অ্যারাইভাল ঘটবে</li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                            <Package className="w-4 h-4" />
                            <span>Hand-packaged</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                            <CheckCircle className="w-4 h-4" />
                            <span>Quality Inspected</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Link 
                        to="/dashboard" 
                        className="flex items-center justify-center space-x-3 bg-gray-900 text-white px-8 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gold transition-all"
                    >
                        <span>View Orders</span>
                    </Link>
                    <Link 
                        to="/shop" 
                        className="flex items-center justify-center space-x-3 bg-white border border-gray-100 text-gray-900 px-8 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:border-gold hover:text-gold transition-all"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Continue Shopping</span>
                    </Link>
                </div>

                <Link to="/" className="inline-flex items-center space-x-2 text-gray-400 hover:text-gold mt-12 text-xs font-bold uppercase tracking-widest transition-colors">
                    <Home className="w-4 h-4" />
                    <span>Back to Home Page</span>
                </Link>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
