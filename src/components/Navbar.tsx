import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, LogOut, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUsers } from '../context/UserContext';
import { useProducts } from '../context/ProductContext';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { totalItems } = useCart();
  const { currentUser, logoutUser } = useUsers();
  const { products } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact', path: '/contact' },
  ];

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
      p.status !== 'Draft'
    ).slice(0, 5);
  }, [searchQuery, products]);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center group mr-4">
            <h1 className="text-lg md:text-xl font-display font-bold tracking-[0.2em] text-gray-900 group-hover:text-gold transition-colors">
              AUR<span className="text-gold">A</span>
            </h1>
          </Link>

          {/* Amazon-style Professional Search Bar (Desktop) */}
          <div className="hidden md:flex flex-grow max-w-xl mx-4 lg:mx-8 relative">
            <div className="flex w-full group relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 border-r border-gray-100 pr-3 pointer-events-none">
                <span className="text-[9px] font-black uppercase tracking-widest text-gold opacity-60">Aura</span>
              </div>
              <input 
                type="text"
                placeholder="Search treasures, bangles, collections..."
                className="w-full bg-gray-50 border border-gray-200 pl-16 pr-24 py-2.5 rounded-l-xl text-sm outline-none focus:bg-white focus:border-gold focus:ring-4 focus:ring-gold/5 transition-all placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/shop?search=${searchQuery}`);
                    setIsSearchOpen(false);
                  }
                }}
              />
              <button 
                onClick={() => {
                  if(searchQuery.trim()) {
                    navigate(`/shop?search=${searchQuery}`);
                    setIsSearchOpen(false);
                  }
                }}
                className="bg-gradient-to-r from-gold to-amber-600 text-white px-6 rounded-r-xl hover:shadow-lg hover:shadow-gold/20 transition-all flex items-center justify-center border-y border-r border-gold group-hover:from-amber-500 group-hover:to-gold"
              >
                <Search className="w-4 h-4 mr-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">Search</span>
              </button>

              {/* Professional Dropdown Results */}
              <AnimatePresence>
                {isSearchOpen && searchQuery.trim() && (
                  <>
                    <div 
                      className="fixed inset-0 z-[-1]" 
                      onClick={() => setIsSearchOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-[70] min-w-[400px]"
                    >
                      {searchResults.length > 0 ? (
                        <div className="p-2 space-y-1">
                          {searchResults.map(product => (
                            <Link 
                              key={product.id}
                              to={`/product/${product.id}`}
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gold/5 transition-all group"
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-grow">
                                <h4 className="text-xs font-bold text-gray-900 group-hover:text-gold transition-colors">{product.name}</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">৳{(Number(product.price) || 0).toLocaleString()}</p>
                              </div>
                              <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-gold transform translate-x-0 group-hover:translate-x-1 transition-all" />
                            </Link>
                          ))}
                          <div className="p-2 border-t border-gray-50 mt-1">
                            <button 
                              onClick={() => {
                                navigate(`/shop?search=${searchQuery}`);
                                setIsSearchOpen(false);
                              }}
                              className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-gold hover:bg-gold/5 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              View all matches <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-10 text-center bg-gray-50/50">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                             <Search className="w-5 h-5 text-gray-200" />
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">NOT FOUND</p>
                          <p className="text-xs text-gray-500 mt-2 italic max-w-[200px] mx-auto">"{searchQuery}" does not appear in our heritage collection.</p>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-5">
            <Link 
              to="/shop" 
              className="text-gray-600 hover:text-gold transition-colors relative group"
            >
              <ShoppingBag className="w-5 h-5" />
              <div className="absolute top-full right-0 mt-4 bg-white border border-gray-100 rounded-xl p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-32 text-left">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">All Collections</p>
              </div>
            </Link>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-600 hover:text-gold transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link 
              to={currentUser ? "/profile" : "/login"} 
              className="text-gray-600 hover:text-gold transition-colors relative group"
            >
              <User className="w-5 h-5" />
              {currentUser && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
              )}
              {currentUser && (
                <div className="absolute top-full right-0 mt-4 bg-white border border-gray-100 rounded-xl p-4 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 text-left">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Aura Member</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{currentUser.fullName}</p>
                </div>
              )}
            </Link>
            <Link to="/cart" className="relative group p-2">
              <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-gold transition-colors" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-gold text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-gray-600 hover:text-gold"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu & Search */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-6">
              {/* Mobile Search bar */}
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search treasures..."
                  className="w-full bg-gray-50 border border-gray-200 py-3 pl-10 pr-4 rounded-xl text-sm outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate(`/shop?search=${searchQuery}`);
                      setIsOpen(false);
                    }
                  }}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              <div className="space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block text-sm font-bold text-gray-900 uppercase tracking-widest hover:text-gold"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              
              <div className="pt-6 border-t border-gray-50 flex flex-col gap-4">
                 {currentUser ? (
                   <>
                     <Link to="/profile" className="text-xs uppercase tracking-widest text-gold font-black" onClick={() => setIsOpen(false)}>My Profile</Link>
                     <button 
                      onClick={() => {
                        logoutUser();
                        setIsOpen(false);
                        navigate('/');
                      }}
                      className="text-xs uppercase tracking-widest text-red-500 font-black text-left flex items-center gap-2"
                     >
                       <LogOut className="w-4 h-4" />
                       Logout
                     </button>
                   </>
                 ) : (
                   <>
                     <Link to="/login" className="text-xs uppercase tracking-widest text-gold font-black" onClick={() => setIsOpen(false)}>Login</Link>
                     <Link to="/signup" className="text-xs uppercase tracking-widest text-gray-400 font-black" onClick={() => setIsOpen(false)}>Signup</Link>
                   </>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
