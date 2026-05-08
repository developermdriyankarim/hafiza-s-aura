import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Shop: React.FC = () => {
  const { products, isLoading } = useProducts();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceSort, setPriceSort] = useState('Featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync search and category from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    const category = params.get('category');
    
    if (search) {
      setSearchQuery(search);
    } else if (category) {
      setSearchQuery(category); // Use search query state for simplicity or add dedicated category state
    }
  }, [location.search]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = products.filter(p => p && p.status !== 'Draft');

    // Search
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    if (priceSort === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [searchQuery, priceSort, products]);

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin mb-4" />
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold animate-pulse italic">Curating Treasures...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <header className="bg-gray-50 py-12 md:py-24 px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
           <h1 className="text-4xl md:text-8xl font-display font-bold mb-4 md:mb-6 tracking-tight">
             Our <span className="text-luxury not-italic">Treasures</span>
           </h1>
           <nav className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black">
             <Link to="/" className="hover:text-gold transition-colors">Home</Link>
             <span className="mx-2 md:mx-4 text-gray-200">|</span>
             <span className="text-gold">Heritage Collection</span>
           </nav>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-6 md:space-y-0">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name..."
              className="w-full bg-gray-50 border border-gray-100 rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-gold transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
             {/* Filter Toggle */}
             <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest px-6 py-3 border border-gray-100 rounded-full hover:border-gold hover:text-gold transition-all"
             >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
             </button>

             {/* Sort Select (Custom-ish looking) */}
             <div className="relative group">
                <select 
                  className="appearance-none bg-gray-50 border border-gray-100 rounded-full py-3 pl-6 pr-12 text-sm font-bold uppercase tracking-widest focus:outline-none cursor-pointer focus:border-gold transition-colors"
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                >
                   <option>Featured</option>
                   <option>Price: Low to High</option>
                   <option>Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
             </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-16">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              highlight={!!searchQuery && product.name.toLowerCase().includes(searchQuery.toLowerCase())}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-40 text-center">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-6">
                <Search className="w-8 h-8 text-gray-200" />
             </div>
             <h3 className="text-3xl font-display text-gray-900 tracking-tight">NOT FOUND</h3>
             <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto italic">"{searchQuery}" does not appear in our treasures search...</p>
             <button 
                onClick={() => {setSearchQuery('');}}
                className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-gold border-b border-gold/30 hover:border-gold pb-1 transition-all"
              >
               Clear search
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
