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
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { currentUser } = useUsers();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  const product = products.find(p => p.id === id);

  if (!product) return <div>Product Not Found</div>;

  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    if (!currentUser) {
      alert('Your presence is requested! Please log in to select your heritage treasures.');
      navigate('/login');
      return;
    }
    for (let i = 0; i < quantity; i++) {
       addToCart(product);
    }
    // Optional: show a success toast here
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
            </p>

            <div className="space-y-8">
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
                  className="flex-grow bg-gold text-white px-10 py-5 rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-accent-gold transition-all shadow-lg luxury-shadow flex items-center justify-center space-x-3"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Purchase Heritage</span>
                </button>
                <button className="p-5 border border-gray-100 bg-white rounded-sm text-gray-400 hover:text-red-500 hover:border-red-100 transition-all">
                   <Heart className="w-6 h-6" />
                </button>
                <button className="p-5 border border-gray-100 bg-white rounded-sm text-gray-400 hover:text-gold hover:border-gold/30 transition-all">
                   <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Product Meta */}
            <div className="mt-12 pt-8 border-t border-gray-100 space-y-4">
               <div className="flex space-x-10">
                 <button 
                  onClick={() => setActiveTab('details')}
                  className={`text-[10px] uppercase tracking-widest font-bold pb-2 border-b-2 transition-all ${activeTab === 'details' ? 'border-gold text-gold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                 >
                   Details
                 </button>
                 <button 
                  onClick={() => setActiveTab('shipping')}
                  className={`text-[10px] uppercase tracking-widest font-bold pb-2 border-b-2 transition-all ${activeTab === 'shipping' ? 'border-gold text-gold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                 >
                   Shipping & Returns
                 </button>
               </div>
               
               <div className="text-sm text-gray-500 leading-relaxed min-h-[100px]">
                  {activeTab === 'details' ? (
                    <ul className="list-disc pl-5 space-y-2">
                       <li>Handcrafted premium finish</li>
                       <li>Dimensions: Adjustable standard size</li>
                       <li>Weight: Approx. 45g each</li>
                       <li>Comes in a premium velvet-lined wooden box</li>
                    </ul>
                  ) : (
                    <p>Complimentary express shipping on all orders. Free returns within 14 days of delivery. Terms and conditions apply.</p>
                  )}
               </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-40">
            <h3 className="text-2xl font-display font-medium text-center mb-16 underline underline-offset-8 decoration-gold/30">You Might Also Adore</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
               {relatedProducts.map(p => (
                 <ProductCard key={p.id} product={p} />
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
