import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  highlight?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, highlight }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative transition-all duration-500 ${highlight ? 'scale-[1.02] z-10' : ''}`}
    >
      <div className={`relative aspect-square overflow-hidden bg-gray-50 border rounded-sm transition-all duration-500 ${highlight ? 'border-gold shadow-[0_0_30px_-5px_rgba(212,175,55,0.3)] ring-1 ring-gold/20' : 'border-gray-100'}`}>
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center space-x-2">
          <button 
            onClick={() => addToCart(product)}
            className="bg-white text-gold p-3 rounded-full hover:bg-gold hover:text-white transition-all shadow-lg"
            title="Add to Cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
          <Link 
            to={`/product/${product.id}`}
            className="bg-white text-gray-800 p-3 rounded-full hover:bg-gold hover:text-white transition-all shadow-lg"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>

        {product.isFeatured && (
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold border border-gold/20">
            Featured
          </span>
        )}
      </div>

      <div className="mt-6 flex flex-col items-center">
        <h3 className="text-base font-display font-bold text-gray-900 group-hover:text-gold transition-colors text-center px-2">
          <Link to={`/product/${product.id}`}>
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm font-black text-gold tracking-widest">
          ৳{(Number(product.price) || 0).toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
