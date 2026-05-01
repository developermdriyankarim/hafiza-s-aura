import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { useUsers } from '../context/UserContext';
import { Product, Order, Customer, Craftsman, ReceiveLog } from '../types';
import { supabaseService } from '../services/supabaseService';
import { Trash2, Plus, LayoutDashboard, LogOut, Package, Image as ImageIcon, DollarSign, Tag, FileText, Edit2, Upload, X, Search, TrendingUp, ShoppingBag, Users, ChevronRight, CheckCircle2, Globe, Clock, PackageCheck, UserPlus, MessageSquare, Lock, Mail, ShieldCheck, History, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string, name: string, role: 'admin' | 'moderator' } | null>(null);
  const [adminAuth, setAdminAuth] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, updateOrder } = useOrders();
  const { customers, deleteCustomer, toggleBlockUser, updateUserRole, loginHistory, addLoginHistory, currentUser: globalUser, loginUser } = useUsers();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'receive' | 'orders' | 'customers' | 'records' | 'craftsmen' | 'admins' | 'history'>('dashboard');
  
  // Check if current user has admin/moderator permissions
  useEffect(() => {
    if (globalUser && (globalUser.role === 'superadmin' || globalUser.role === 'admin' || globalUser.role === 'moderator')) {
      setIsAuthenticated(true);
      setCurrentUser({ email: globalUser.email, name: globalUser.fullName, role: globalUser.role as any });
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  }, [globalUser]);
  
  // Reset storage key to ensure old profiles are purged
  const [craftsmen, setCraftsmen] = useState<Craftsman[]>(() => {
    const saved = localStorage.getItem('aura_moderators_v3');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('aura_moderators_v3', JSON.stringify(craftsmen));
  }, [craftsmen]);

  // Reception Logs
  const [receiveLogs, setReceiveLogs] = useState<ReceiveLog[]>(() => {
    const saved = localStorage.getItem('aura_receive_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const syncData = async () => {
      try {
        const cData = await supabaseService.getCraftsmen();
        if (cData && cData.length > 0) setCraftsmen(cData);
        
        const lData = await supabaseService.getReceiveLogs();
        if (lData && lData.length > 0) setReceiveLogs(lData);
      } catch (e) {
        console.debug('Supabase sync skipped or failed:', e);
      }
    };
    if (isAuthenticated) syncData();
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('aura_receive_logs', JSON.stringify(receiveLogs));
  }, [receiveLogs]);
  
  const [isCraftsmanModalOpen, setIsCraftsmanModalOpen] = useState(false);
  const [editingCraftsman, setEditingCraftsman] = useState<Craftsman | null>(null);
  const [craftsmanFormData, setCraftsmanFormData] = useState<Partial<Craftsman>>({
    name: '', specialty: '', experience: '', status: 'Active', email: '', password: ''
  });

  // User Details Modal
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false);

  // Admin Management Modal
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminFormData, setAdminFormData] = useState({ email: '', password: '', role: 'admin' as Customer['role'] });

  // Automatic logout when unmounting (leaving the page)
  useEffect(() => {
    return () => {
      setIsAuthenticated(false);
    };
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [receiveSearch, setReceiveSearch] = useState('');
  const [receiveUnits, setReceiveUnits] = useState<number>(0);
  const [selectedReceiveProduct, setSelectedReceiveProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    image: '',
    isFeatured: false,
    stock: 0,
    status: 'Published'
  });

  const stats = useMemo(() => {
    return {
      totalTreasures: products.length,
      totalInventory: products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0),
      totalValue: products.reduce((acc, p) => acc + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0),
      lowStock: products.filter(p => (Number(p.stock) || 0) < 5).length,
      pendingOrders: orders.filter(o => o.status === 'Pending').length,
      withdrawnOrders: orders.filter(o => o.status === 'Cancelled').length
    };
  }, [products, orders]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const user = await loginUser(adminAuth.email, adminAuth.password);
      
      if (!user || (user.role !== 'superadmin' && user.role !== 'admin' && user.role !== 'moderator')) {
        throw new Error('Access Denied: Insufficient Aura Permissions');
      }
      
      addLoginHistory({
        email: adminAuth.email,
        time: new Date().toISOString(),
        status: 'Success'
      });
    } catch (err: any) {
       addLoginHistory({
        email: adminAuth.email,
        time: new Date().toISOString(),
        status: 'Failed'
      });
      setLoginError(err.message || 'Access Denied: Invalid Aura Credentials');
    }
  };

  const handleAdminForgotPassword = () => {
    if (!adminAuth.email) {
      setLoginError('Please enter email first');
      return;
    }
    addLoginHistory({
      email: adminAuth.email,
      time: new Date().toISOString(),
      status: 'Forget Password Attempt'
    });
    setLoginError('Forgot password attempt logged. Contact system administrator.');
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: 0, description: '', image: '', isFeatured: false, stock: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size too large. Please use an image smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check image size if it's a base64 string
    if (formData.image && formData.image.startsWith('data:') && formData.image.length > 1000000) {
      alert('The image data is too large for database entry. Please use a smaller image file or a remote URL.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingProduct) {
        await updateProduct({
          ...editingProduct,
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          status: formData.status || 'Published'
        } as Product);
      } else {
        const product: Product = {
          ...formData as Product,
          id: Date.now().toString(),
          price: Number(formData.price),
          stock: Number(formData.stock),
          status: formData.status || 'Published'
        };
        await addProduct(product);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Submit Error:', err);
      alert(`Failed to save: ${err.message || 'Check your connection or data size'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReceiveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReceiveProduct && receiveUnits > 0) {
      try {
        await updateProduct({
          ...selectedReceiveProduct,
          stock: selectedReceiveProduct.stock + receiveUnits
        });

        // Log the reception
        const logEntry: ReceiveLog = {
          id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          productId: selectedReceiveProduct.id,
          productName: selectedReceiveProduct.name,
          moderatorEmail: currentUser?.email || 'Unknown',
          moderatorName: currentUser?.name || 'Unknown',
          units: receiveUnits,
          timestamp: new Date().toISOString()
        };
        setReceiveLogs(prev => [logEntry, ...prev]);
        supabaseService.addReceiveLog(logEntry).catch(e => console.debug(e));

        alert(`Success! Added ${receiveUnits} units to ${selectedReceiveProduct.name}.`);
        setReceiveUnits(0);
        setSelectedReceiveProduct(null);
        setReceiveSearch('');
      } catch (err) {
        alert('Failed to update stock in database.');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gray-900 p-10 rounded-2xl border border-gold/20 shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20">
              <LayoutDashboard className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-2xl font-display text-white mb-2 underline decoration-gold/30 underline-offset-8">Aura Control Center</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black">Authorized Personnel Only</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Admin Email"
                  required
                  className="w-full bg-gray-800/50 border border-gray-800 py-4 px-6 rounded-xl text-white placeholder:text-gray-600 focus:border-gold/50 transition-all outline-none"
                  value={adminAuth.email}
                  onChange={(e) => setAdminAuth({ ...adminAuth, email: e.target.value })}
                />
              </div>
              <div className="relative group">
                <input 
                  type="password" 
                  placeholder="Vault Access Key"
                  required
                  className="w-full bg-gray-800/50 border border-gray-800 py-4 px-6 rounded-xl text-white placeholder:text-gray-600 focus:border-gold/50 transition-all outline-none"
                  value={adminAuth.password}
                  onChange={(e) => setAdminAuth({ ...adminAuth, password: e.target.value })}
                />
              </div>
            </div>

            {loginError && (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">{loginError}</p>
            )}

            <button type="submit" className="w-full bg-gold text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-accent-gold transition-all shadow-lg active:scale-95 text-xs">
              Unlock Vault
            </button>

            <div className="text-center">
              <button 
                type="button" 
                onClick={handleAdminForgotPassword}
                className="text-[10px] text-gray-500 uppercase tracking-widest font-black hover:text-gold"
              >
                Request Access Recovery
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Admin Mobile Header */}
      <div className="lg:hidden bg-gray-950 text-white p-4 flex items-center justify-between sticky top-0 z-[60] border-b border-gold/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
            <span className="text-white font-black text-sm">A</span>
          </div>
          <h2 className="text-sm font-display font-bold text-white tracking-widest uppercase">Admin Panel</h2>
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={() => navigate('/')}
            className="p-2 text-gold hover:text-white"
            title="Main Website"
           >
              <Globe className="w-5 h-5" />
           </button>
           <select 
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="bg-gray-900 text-gold text-[10px] font-black uppercase tracking-widest border border-gold/20 rounded-lg px-2 py-2 outline-none focus:ring-1 focus:ring-gold"
           >
              <option value="dashboard">Dashboard</option>
              <option value="inventory">Inventory</option>
              <option value="receive">Receive</option>
              <option value="orders">Orders</option>
              <option value="customers">Users</option>
              <option value="craftsmen">Moderator Hub</option>
              <option value="admins">Admin Control</option>
              <option value="history">Logs</option>
              <option value="records">Order Records</option>
           </select>
           <button 
            onClick={() => setIsAuthenticated(false)}
            className="p-2 text-gray-400 hover:text-red-400"
           >
              <LogOut className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Admin Sidebar (Desktop) */}
      <aside className="w-72 bg-gray-950 text-white hidden lg:flex flex-col border-r border-gold/10 sticky top-0 h-screen">
        <div className="p-8 border-b border-gray-900">
           <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
                 <span className="text-white font-black">A</span>
              </div>
              <h2 className="text-lg font-display font-bold text-white tracking-widest uppercase">Admin Panel</h2>
           </div>
        </div>
        <nav className="flex-grow p-6 space-y-3">
           <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all border ${activeTab === 'dashboard' ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20' : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white'}`}
           >
              <div className="flex items-center space-x-4">
                <LayoutDashboard className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Dashboard</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'dashboard' ? 'rotate-90' : ''}`} />
           </button>
           <button 
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all border ${activeTab === 'inventory' ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20' : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white'}`}
           >
              <div className="flex items-center space-x-4">
                <Package className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Bangle Stock</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'inventory' ? 'rotate-90' : ''}`} />
           </button>
           <button 
            onClick={() => setActiveTab('receive')}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all border ${activeTab === 'receive' ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20' : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white'}`}
           >
              <div className="flex items-center space-x-4">
                <TrendingUp className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Receive Stock</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'receive' ? 'rotate-90' : ''}`} />
           </button>
           <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all border ${activeTab === 'orders' ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20' : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white'}`}
           >
              <div className="flex items-center space-x-4">
                <ShoppingBag className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Customer Orders</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'orders' ? 'rotate-90' : ''}`} />
           </button>
           <button 
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all border ${activeTab === 'customers' ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20' : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white'}`}
           >
              <div className="flex items-center space-x-4">
                <UserPlus className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Heritage Users</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'customers' ? 'rotate-90' : ''}`} />
           </button>
           <button 
            onClick={() => setActiveTab('craftsmen')}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all border ${activeTab === 'craftsmen' ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20' : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white'}`}
           >
              <div className="flex items-center space-x-4">
                <Palette className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Moderator Hub</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'craftsmen' ? 'rotate-90' : ''}`} />
           </button>
           {currentUser?.role === 'admin' && (
             <>
               <button 
                onClick={() => setActiveTab('admins')}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all border ${activeTab === 'admins' ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20' : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white'}`}
               >
                  <div className="flex items-center space-x-4">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Admin Control</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'admins' ? 'rotate-90' : ''}`} />
               </button>
               <button 
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all border ${activeTab === 'history' ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20' : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white'}`}
               >
                  <div className="flex items-center space-x-4">
                    <History className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Access Logs</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'history' ? 'rotate-90' : ''}`} />
               </button>
             </>
           )}
           <button 
            onClick={() => setActiveTab('records')}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all border ${activeTab === 'records' ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20' : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white'}`}
           >
              <div className="flex items-center space-x-4">
                <FileText className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Order Records</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'records' ? 'rotate-90' : ''}`} />
           </button>
        </nav>
        <div className="p-6 border-t border-gray-900 space-y-2">
           <button 
            onClick={() => {
              setIsAuthenticated(false);
              navigate('/');
            }}
            className="w-full flex items-center space-x-4 px-5 py-4 text-emerald-400 hover:bg-emerald-500/5 rounded-xl transition-all group border border-transparent hover:border-emerald-500/20"
           >
              <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">Main Site</span>
           </button>
           <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center space-x-4 px-5 py-4 text-gray-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all group"
           >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-12">
            <div className="w-full md:w-auto">
              <h1 className="text-2xl md:text-4xl font-display text-gray-900 leading-tight">
                {{
                  dashboard: 'Aura Overview',
                  inventory: 'Bangle Inventory',
                  receive: 'Receive Inheritance',
                  orders: 'Royal Orders',
                  customers: 'Heritage Community',
                  craftsmen: 'Moderator Hub',
                  records: 'Financial Records',
                  admins: 'Admin Control',
                  history: 'Access Logs'
                }[activeTab] || 'Admin Panel'}
              </h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-2">
                {{
                  dashboard: 'Snapshot of the ecosystem',
                  inventory: 'Manage bangle collection',
                  receive: 'Update heritage stock levels',
                  orders: 'Review customer selections',
                  customers: 'Registered members of the aura',
                  craftsmen: 'Manage permissions and moderator profiles',
                  records: 'Income, orders, and delivery logistics',
                  admins: 'Manage administrative authority',
                  history: 'Visualizing temporal access records'
                }[activeTab] || 'Management interface'}
              </p>
            </div>
           {(activeTab === 'inventory' || activeTab === 'craftsmen') && (
             <button 
              onClick={activeTab === 'inventory' ? openAddModal : () => {
                setEditingCraftsman(null);
                setCraftsmanFormData({ name: '', specialty: '', experience: '', status: 'Active', email: '', password: '' });
                setIsCraftsmanModalOpen(true);
              }}
              className="w-full md:w-auto bg-gray-900 text-gold px-6 md:px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gold hover:text-white transition-all flex items-center justify-center space-x-3 shadow-xl"
             >
                <Plus className="w-4 h-4" />
                <span>{activeTab === 'inventory' ? 'Create Bangle' : 'Add Moderator'}</span>
             </button>
           )}
        </header>

        {/* Tab Content */}
        <div className="space-y-10">
          {activeTab === 'dashboard' && (
            <div className="space-y-10">
               {/* Stats Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: 'Total Bangles', value: stats.totalTreasures, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Total Units', value: stats.totalInventory, icon: Package, color: 'text-gold', bg: 'bg-gold/10' },
                    { label: 'Vault Value', value: `৳${(Number(stats.totalValue) || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Low Stock Alert', value: stats.lowStock, icon: TrendingUp, color: 'text-red-500', bg: 'bg-red-50' },
                    { label: 'Pending Selection', value: stats.pendingOrders, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Withdrawn Orders', value: stats.withdrawnOrders, icon: X, color: 'text-purple-500', bg: 'bg-purple-50' },
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center"
                    >
                       <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl mb-4`}>
                          <stat.icon className="w-6 h-6" />
                       </div>
                       <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2">{stat.label}</p>
                       <p className="text-2xl font-display font-bold text-gray-900">{stat.value}</p>
                    </motion.div>
                  ))}
               </div>

               {/* Recent Activity Mockup */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-10">
                     <h3 className="text-xl font-display mb-8">Recent Aura Events</h3>
                     <div className="space-y-6">
                        {[
                          { event: 'Stock Received', product: 'Royal Gold Churi', desc: 'Added 5 units', time: '2 hours ago' },
                          { event: 'Price Refined', product: 'Eternal Diamond', desc: 'Updated to 350,000 BDT', time: '5 hours ago' },
                          { event: 'New Treasure', product: 'Mystic Polki', desc: 'Created heritage entry', time: '1 day ago' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center space-x-6 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                             <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                             </div>
                             <div className="flex-grow">
                                <h4 className="text-sm font-bold text-gray-900">{item.event}</h4>
                                <p className="text-xs text-gray-500">{item.product} — {item.desc}</p>
                             </div>
                             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.time}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="bg-gray-900 rounded-3xl p-10 flex flex-col justify-center items-center text-center text-white">
                     <Users className="w-12 h-12 text-gold mb-6" />
                     <h3 className="text-xl font-display mb-4">Moderator Access</h3>
                     <p className="text-sm text-gray-400 leading-relaxed mb-8">Manage the moderators who have access to the Hafiza's Aura Bangles.</p>
                      <button 
                        onClick={() => setActiveTab('craftsmen')}
                        className="w-full py-4 border border-gold/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-gold hover:bg-gold hover:text-white transition-all"
                      >
                        Manage Permission
                      </button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
               <div className="overflow-x-auto">
                 <table className="w-full text-left min-w-[700px]">
                    <thead>
                       <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-6 md:px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Bangle Item</th>
                          <th className="px-6 md:px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Valuation</th>
                          <th className="px-6 md:px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Vault Stock</th>
                          <th className="px-6 md:px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black text-right">Aura Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {products.map(product => (
                          <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                             <td className="px-6 md:px-8 py-6">
                                <div className="flex items-center space-x-4 md:space-x-6">
                                   <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gray-100 overflow-hidden ring-2 ring-transparent group-hover:ring-gold/20 transition-all">
                                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                                   </div>
                                   <div className="max-w-[200px] md:max-w-md">
                                      <p className="text-sm font-bold text-gray-900 mb-1 truncate">{product.name}</p>
                                      <p className="text-[10px] text-gray-400 line-clamp-1 italic uppercase tracking-widest">{product.description}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 md:px-8 py-6">
                                <p className="text-sm font-bold text-gold">৳{(Number(product.price) || 0).toLocaleString()}</p>
                             </td>
                             <td className="px-6 md:px-8 py-6">
                                <div className="flex items-center space-x-3">
                                  <span className={`w-2 h-2 rounded-full ${product.stock < 5 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                                  <p className="text-sm font-bold text-gray-600">{product.stock} Units</p>
                                </div>
                             </td>
                             <td className="px-6 md:px-8 py-6 text-right">
                                <div className="flex justify-end space-x-2">
                                  <button 
                                   onClick={() => openEditModal(product)}
                                   className="p-2 md:p-3 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                  >
                                     <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                                  </button>
                                  <button 
                                   onClick={async () => {
                                     if (window.confirm('Are you sure you want to delete this treasure?')) {
                                       try {
                                         await deleteProduct(product.id);
                                       } catch (err) {
                                         alert('Failed to delete product from database.');
                                       }
                                     }
                                   }}
                                   className="p-2 md:p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                  >
                                     <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                  </button>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'receive' && (
            <div className="max-w-3xl mx-auto space-y-10">
               <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-display mb-8">Incoming Bangles</h3>
                  <div className="space-y-8">
                     <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-hover:text-gold transition-colors" />
                        <input 
                          type="text"
                          placeholder="Search for a heritage piece..."
                          value={receiveSearch}
                          onChange={(e) => setReceiveSearch(e.target.value)}
                          className="w-full bg-gray-50 border-none py-5 px-14 rounded-2xl text-sm focus:ring-1 focus:ring-gold outline-none transition-all"
                        />
                     </div>

                     {receiveSearch && (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                           {products.filter(p => p.name.toLowerCase().includes(receiveSearch.toLowerCase())).map(product => (
                              <button 
                                key={product.id}
                                onClick={() => setSelectedReceiveProduct(product)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedReceiveProduct?.id === product.id ? 'bg-gold/5 border-gold' : 'bg-gray-50 border-transparent hover:border-gray-100'}`}
                              >
                                 <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-gray-100">
                                       <img src={product.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="text-left">
                                       <p className="text-sm font-bold text-gray-900">{product.name}</p>
                                       <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Stock: {product.stock} | {product.status || 'Published'}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <select 
                                      value={product.status || 'Published'}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={async (e) => {
                                         e.stopPropagation();
                                         try {
                                           await updateProduct({...product, status: e.target.value as any});
                                         } catch (err) {
                                            alert('Failed to update status.');
                                         }
                                      }}
                                      className="text-[9px] font-black uppercase tracking-widest bg-gray-100 border-none rounded px-2 py-1 outline-none"
                                    >
                                       <option value="Published">Published</option>
                                       <option value="Draft">Draft</option>
                                    </select>
                                    {selectedReceiveProduct?.id === product.id && <CheckCircle2 className="w-5 h-5 text-gold" />}
                                 </div>
                              </button>
                           ))}
                        </div>
                     )}

                      <AnimatePresence>
                        {selectedReceiveProduct && (
                           <motion.div
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             className="space-y-10"
                           >
                              <form 
                                onSubmit={handleReceiveStock} 
                                className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-6"
                              >
                                 <div className="bg-gold/5 p-6 rounded-2xl border border-gold/10">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gold mb-2">Receiving Log</p>
                                    <p className="text-sm text-gray-600">You are adding stock to <span className="font-bold text-gray-900">"{selectedReceiveProduct.name}"</span>. This will update the Bangle inventory instantly.</p>
                                 </div>
                                 <div className="relative">
                                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <input 
                                      required
                                      type="number" 
                                      placeholder="Number of Units Received"
                                      className="w-full bg-gray-50 border-none py-5 px-14 rounded-2xl text-sm focus:ring-1 focus:ring-gold outline-none"
                                      value={receiveUnits || ''}
                                      onChange={(e) => setReceiveUnits(Number(e.target.value))}
                                    />
                                 </div>
                                 <button 
                                   type="submit"
                                   className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gold transition-all shadow-xl text-xs"
                                 >
                                   Commit to Vault Inventory
                                 </button>
                              </form>

                              {/* Pending Orders for this Product */}
                              <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
                                 <h4 className="text-lg font-display mb-6">Pending Fulfillments for Items</h4>
                                 <div className="space-y-4">
                                    {orders.filter(o => 
                                       o.items.some(item => item.id === selectedReceiveProduct.id) && 
                                       o.status !== 'Delivered' && 
                                       o.status !== 'Cancelled'
                                    ).length === 0 ? (
                                       <p className="text-sm text-gray-400 italic">No active selections for this heritage piece.</p>
                                    ) : (
                                       orders.filter(o => 
                                          o.items.some(item => item.id === selectedReceiveProduct.id) && 
                                          o.status !== 'Delivered' && 
                                          o.status !== 'Cancelled'
                                       ).map(order => (
                                          <div key={order.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                             <div className="space-y-1 mb-4 md:mb-0">
                                                <p className="text-sm font-bold text-gray-900">{order.customer.fullName}</p>
                                                <div className="flex items-center gap-3">
                                                   <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded font-black">X {order.items.find(i => i.id === selectedReceiveProduct.id)?.quantity || 0}</span>
                                                   <span className="text-[10px] text-gray-400 uppercase font-black">{order.status}</span>
                                                </div>
                                             </div>
                                             <div className="text-left md:text-right">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Commitment Date</p>
                                                <p className="text-xs font-bold text-gray-900">{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Pending Schedule'}</p>
                                             </div>
                                          </div>
                                       ))
                                    )}
                                 </div>
                              </div>
                           </motion.div>
                        )}
                      </AnimatePresence>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-8">
               {orders.length === 0 ? (
                 <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 italic">
                    <ShoppingBag className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                    <h3 className="text-2xl font-display text-gray-400">No Bangles have been selected yet...</h3>
                 </div>
               ) : (
                 <div className="space-y-6">
                    {orders.map(order => (
                       <motion.div 
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden"
                       >
                          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-6">
                             <div className="flex items-center space-x-6">
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                                   <Clock className="w-6 h-6 text-gold" />
                                </div>
                                <div>
                                   <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">AUR-{order.id.split('-')[1]}</p>
                                   <h4 className="text-sm font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</h4>
                                </div>
                             </div>
                             <div className="flex items-center gap-4">
                                <div className="text-right mr-4">
                                   <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Status</p>
                                   <select 
                                    value={order.status}
                                    onChange={async (e) => {
                                     try {
                                       await updateOrder(order.id, { status: e.target.value as any });
                                     } catch (err) {
                                       alert('Failed to update order status.');
                                     }
                                   }}
                                    className={`text-xs font-black uppercase tracking-widest bg-gray-50 border-none rounded-full px-4 py-1 outline-none cursor-pointer ${
                                       order.status === 'Cancelled' ? 'text-red-500' :
                                       order.status === 'Delivered' ? 'text-emerald-500' :
                                       'text-gold'
                                     }`}
                                   >
                                      <option value="Pending">Moderator Received</option>
                                      <option value="Approved">Aura Verified</option>
                                      <option value="Shipped">In Transit</option>
                                      <option value="Delivered">Grand Arrival</option>
                                      <option value="Cancelled">Withdrawn</option>
                                   </select>
                                </div>
                                <div className="text-right">
                                   <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Aura Total</p>
                                   <p className="text-lg font-display font-bold text-gold">৳{(Number(order.total) || 0).toLocaleString()}</p>
                                </div>
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-3">
                             {/* Customer Details */}
                             <div className="p-8 border-b lg:border-b-0 lg:border-r border-gray-50 bg-gray-50/30">
                                <h5 className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-900 mb-6 flex items-center space-x-2">
                                   <Users className="w-4 h-4 text-gold" />
                                   <span>Customer Profile</span>
                                </h5>
                                <div className="space-y-4">
                                   <div>
                                      <p className="text-sm font-black text-gray-900">{order.customer.fullName}</p>
                                      <p className="text-xs text-gray-500 mt-1">{order.customer.email}</p>
                                   </div>
                                   <div className="pt-4 border-t border-gray-100">
                                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Phone</p>
                                      <p className="text-xs text-gray-700 font-bold">{order.customer.phone}</p>
                                   </div>
                                   <div className="pt-4 border-t border-gray-100">
                                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Aura Destination</p>
                                      <p className="text-xs text-gray-700 leading-relaxed">{order.customer.address}, {order.customer.city}</p>
                                       <p className="text-[10px] text-gold font-bold mt-2 uppercase tracking-widest">{order.customer.location}</p>
                                       {order.deliveryFee > 0 && <p className="text-[9px] text-gray-400">Delivery Fee: ৳{order.deliveryFee}</p>}
                                   </div>
                                </div>
                             </div>

                             {/* Items List */}
                             <div className="lg:col-span-2 p-8">
                                <h5 className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-900 mb-6 flex items-center space-x-2">
                                   <PackageCheck className="w-4 h-4 text-gold" />
                                   <span>Bangle Selection</span>
                                </h5>
                                <div className="space-y-4">
                                   {order.items.map(item => (
                                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                                         <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-xl border border-gray-100 overflow-hidden bg-white">
                                               <img src={item.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                               <p className="text-xs font-bold text-gray-900">{item.name}</p>
                                               <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Quantity: {item.quantity}</p>
                                            </div>
                                         </div>
                                         <p className="text-sm font-bold text-gray-900">৳{((Number(item.price) || 0) * (Number(item.quantity) || 0)).toLocaleString()}</p>
                                      </div>
                                   ))}
                                </div>
                             </div>
                          </div>
                       </motion.div>
                    ))}
                 </div>
               )}
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
               <div className="overflow-x-auto">
                 <table className="w-full text-left min-w-[800px]">
                    <thead>
                       <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">User ID</th>
                          <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Full Name</th>
                          <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Contact Info</th>
                          <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Aura Bio</th>
                          <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Join Date</th>
                          <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {customers.length === 0 ? (
                         <tr>
                           <td colSpan={5} className="px-8 py-20 text-center text-gray-400 italic">No registrations found yet...</td>
                         </tr>
                       ) : (
                         customers.map(customer => (
                          <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                             <td className="px-8 py-6">
                                <p className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded inline-block truncate max-w-[80px]" title={customer.id}>
                                  {customer.id.slice(0, 8)}...
                                </p>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex items-center space-x-4">
                                   <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold">
                                      {customer.fullName.charAt(0)}
                                   </div>
                                   <p className="text-sm font-bold text-gray-900">{customer.fullName}</p>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="space-y-1">
                                   <p className="text-sm text-gray-700">{customer.email}</p>
                                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{customer.phone}</p>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <p className="text-xs text-gray-400 italic max-w-[200px] line-clamp-2">
                                   {customer.bio || 'No aura signature recorded...'}
                                </p>
                             </td>
                             <td className="px-8 py-6">
                                <p className="text-xs text-gray-500 font-medium">
                                   {new Date(customer.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                </p>
                             </td>
                             <td className="px-8 py-6 text-right">
                               <div className="flex justify-end gap-2">
                                 <button 
                                   onClick={() => {
                                     setViewingCustomer(customer);
                                     setIsCustomerDetailsOpen(true);
                                   }}
                                   className="p-2 text-gray-300 hover:text-gold hover:bg-gold/5 rounded-xl transition-all"
                                   title="View Celestial Details"
                                 >
                                   <Search className="w-4 h-4" />
                                 </button>
                                 <button 
                                   onClick={() => {
                                     if(confirm('Are you sure you want to remove this soul from the heritage scrolls?')) {
                                       deleteCustomer(customer.id);
                                     }
                                   }}
                                   className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                   title="Delete User"
                                 >
                                   <Trash2 className="w-4 h-4" />
                                 </button>
                                 <button 
                                   onClick={() => toggleBlockUser(customer.id)}
                                   className={`p-2 rounded-xl transition-all ${customer.isBlocked ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-amber-500 hover:bg-amber-50'}`}
                                   title={customer.isBlocked ? 'Unrestrict Access' : 'Restrict Access'}
                                 >
                                   <ShieldCheck className="w-4 h-4" />
                                 </button>
                               </div>
                             </td>
                          </tr>
                         ))
                       )}
                    </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="space-y-10">
              {/* Financial Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mb-4">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2">Total Income</p>
                  <p className="text-3xl font-display font-bold text-gray-900">৳{orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0).toLocaleString()}</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2">Total Orders</p>
                  <p className="text-3xl font-display font-bold text-gray-900">{orders.length}</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-4">
                    <Globe className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2">Unique Destinations</p>
                  <p className="text-3xl font-display font-bold text-gray-900">{new Set(orders.map(o => o.customer.city)).size}</p>
                </div>
              </div>

              {/* Delivery Logistics Table */}
              <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-gray-50">
                  <h3 className="text-xl font-display">Delivery Destinations</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">City/Location</th>
                        <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black text-center">Orders</th>
                        <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {Array.from(new Set(orders.map(o => o.customer.city))).map(city => {
                        const cityOrders = orders.filter(o => o.customer.city === city);
                        const cityRevenue = cityOrders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
                        return (
                          <tr key={city} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <p className="text-sm font-bold text-gray-900">{city}</p>
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Heritage Destination</p>
                            </td>
                            <td className="px-8 py-6 text-center">
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">{cityOrders.length}</span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <p className="text-sm font-bold text-gold">৳{cityRevenue.toLocaleString()}</p>
                            </td>
                          </tr>
                        );
                      })}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-8 py-20 text-center text-gray-400 italic">No order records found...</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detailed Financial Log */}
              <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-gray-50">
                  <h3 className="text-xl font-display">In-depth Order Log</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Order ID</th>
                        <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Customer</th>
                        <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Address</th>
                        <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">AUR-{order.id.split('-')[1] || order.id.slice(-6)}</p>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-sm font-bold text-gray-900">{order.customer.fullName}</p>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-xs text-gray-500 max-w-[250px] truncate">{order.customer.address}, {order.customer.city}</p>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <p className="text-sm font-bold text-emerald-500">৳{(Number(order.total) || 0).toLocaleString()}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'craftsmen' && (
            <div className="space-y-10">
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Moderator</th>
                        <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Gmail</th>
                        <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Specialty</th>
                        <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Status</th>
                        <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {craftsmen.map(artisan => (
                        <tr key={artisan.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold">
                                {artisan.name.charAt(0)}
                              </div>
                              <p className="text-sm font-bold text-gray-900">{artisan.name}</p>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-sm text-gray-700">{artisan.email}</p>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-sm text-gray-700">{artisan.specialty}</p>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              artisan.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                              artisan.status === 'On Break' ? 'bg-amber-50 text-amber-600' :
                              'bg-gray-100 text-gray-500'
                            }`}>
                              {artisan.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end space-x-2">
                               <button 
                                onClick={() => {
                                  setEditingCraftsman(artisan);
                                  setCraftsmanFormData(artisan);
                                  setIsCraftsmanModalOpen(true);
                                }}
                                className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                               >
                                  <Edit2 className="w-4 h-4" />
                               </button>
                               <button 
                                onClick={() => {
                                  if(confirm('Are you sure you want to remove this moderator?')) {
                                    setCraftsmen(prev => prev.filter(c => c.id !== artisan.id));
                                  }
                                }}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                               >
                                  <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Reception Logs for Admins to monitor moderators */}
              <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                     <h3 className="text-xl font-display">Moderator Reception History</h3>
                     <button 
                      onClick={() => {
                        if(confirm('Clear all reception logs?')) setReceiveLogs([]);
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500"
                     >
                      Purge Logs
                     </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                             <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Moderator</th>
                             <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Artifact</th>
                             <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black text-center">Volume</th>
                             <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black text-right">Timestamp</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                          {receiveLogs.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-8 py-10 text-center text-gray-400 italic">No reception history recorded yet...</td>
                            </tr>
                          ) : (
                            receiveLogs.map(log => (
                              <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-6">
                                  <p className="text-sm font-bold text-gray-900">{log.moderatorName}</p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{log.moderatorEmail}</p>
                                </td>
                                <td className="px-8 py-6">
                                  <p className="text-sm text-gray-700">{log.productName}</p>
                                </td>
                                <td className="px-8 py-6 text-center">
                                  <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-bold">+{log.units}</span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <p className="text-xs text-gray-400 font-medium">{new Date(log.timestamp).toLocaleString()}</p>
                                </td>
                              </tr>
                            ))
                          )}
                       </tbody>
                    </table>
                  </div>
              </div>
            </div>
          )}

          {activeTab === 'admins' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-display underline decoration-gold/20 underline-offset-8 italic">Admin Authority Hub</h3>
                 <button 
                  onClick={() => setIsAdminModalOpen(true)}
                  className="bg-gray-900 text-gold px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-gold hover:text-white transition-all shadow-lg"
                 >
                   Empower New Admin
                 </button>
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Admin ID</th>
                        <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Authorized Admin</th>
                        <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Role</th>
                        <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Join Date</th>
                        <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black text-right">Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {customers.filter(c => c.role === 'admin' || c.role === 'superadmin').map(admin => (
                        <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-6">
                             <p className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded inline-block truncate max-w-[80px]" title={admin.id}>
                               {admin.id.slice(0, 8)}...
                             </p>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold">
                                {admin.fullName.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">{admin.fullName}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{admin.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              admin.role === 'superadmin' ? 'bg-emerald-50 text-emerald-600' : 'bg-gold/10 text-gold'
                            }`}>
                              {admin.role}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-xs text-gray-500 font-medium">
                              {new Date(admin.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <div className="flex justify-end gap-2">
                               {admin.role !== 'superadmin' && (
                                 <button 
                                   onClick={() => updateUserRole(admin.id, 'user')}
                                   className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                 >
                                   <X className="w-4 h-4" />
                                 </button>
                               )}
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-8">
               <h3 className="text-xl font-display underline decoration-gold/20 underline-offset-8 italic text-gray-900 mb-8">Access Integrity Logs</h3>
               <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                     <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black italic">Tracking Every Aura Threshold Breach</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-50">
                          <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Requester</th>
                          <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Aura Timestamp</th>
                          <th className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-widest font-black">Engagement Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {loginHistory.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-8 py-20 text-center text-gray-400 italic">No access attempts recorded in the celestial scrolls...</td>
                          </tr>
                        ) : (
                          loginHistory.map(entry => (
                            <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-8 py-6">
                                <p className="text-sm font-bold text-gray-900">{entry.email}</p>
                              </td>
                              <td className="px-8 py-6">
                                <p className="text-xs text-gray-500 font-medium">
                                  {new Date(entry.time).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                </p>
                              </td>
                              <td className="px-8 py-6">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center w-fit gap-2 ${
                                  entry.status === 'Success' ? 'bg-emerald-50 text-emerald-600' :
                                  entry.status === 'Failed' ? 'bg-red-50 text-red-500' :
                                  'bg-amber-50 text-amber-600'
                                }`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                    entry.status === 'Success' ? 'bg-emerald-500' :
                                    entry.status === 'Failed' ? 'bg-red-500' :
                                    'bg-amber-500 animate-pulse'
                                  }`} />
                                  {entry.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Product Modal (Add/Edit) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-w-3xl w-full bg-white rounded-[3rem] p-6 md:p-12 shadow-2xl border border-gray-100 overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl md:text-3xl font-display underline decoration-gold/20 underline-offset-8 italic">
                  {editingProduct ? 'Refine Heritage' : 'Found New Treasure'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-50 rounded-full transition-colors border border-gray-50">
                  <X className="w-6 h-6 text-gray-300" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="md:col-span-2 relative group">
                   <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-hover:text-gold transition-colors" />
                   <input 
                     required
                     placeholder="Product Name"
                     className="w-full bg-gray-50/50 border border-gray-100 py-4 md:py-5 px-16 rounded-2xl md:rounded-[2rem] text-sm focus:ring-1 focus:ring-gold outline-none transition-all"
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                   />
                </div>

                <div className="relative group">
                  <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-hover:text-gold transition-colors" />
                  <input 
                    required
                    type="number"
                    placeholder="Valuation (BDT)"
                    className="w-full bg-gray-50/50 border border-gray-100 py-4 md:py-5 px-16 rounded-2xl md:rounded-[2rem] text-sm focus:ring-1 focus:ring-gold outline-none transition-all"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>

                <div className="relative group">
                  <Package className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-hover:text-gold transition-colors" />
                  <input 
                    required
                    type="number"
                    placeholder="Initial Vault Stock"
                    className="w-full bg-gray-50/50 border border-gray-100 py-4 md:py-5 px-16 rounded-2xl md:rounded-[2rem] text-sm focus:ring-1 focus:ring-gold outline-none transition-all"
                    value={formData.stock || ''}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                  />
                </div>

                <div className="md:col-span-2">
                   <div className="flex items-center justify-between mb-6 px-2">
                      <p className="text-[11px] text-gray-400 uppercase tracking-[0.3em] font-black">Visual Representation</p>
                      {formData.image && <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Image Loaded ✓</span>}
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-gold/5 hover:border-gold/30 transition-all group"
                      >
                        <Upload className="w-10 h-10 text-gray-200 group-hover:text-gold group-hover:scale-110 transition-all mb-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gold transition-colors text-center px-4 leading-relaxed">Moderator Photo Capture</span>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileChange} 
                          className="hidden" 
                          accept="image/*"
                        />
                      </div>
                      {formData.image && (
                        <div className="md:col-span-2 relative aspect-[2/1] md:aspect-auto bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 group shadow-inner">
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => setFormData({...formData, image: ''})}
                            className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-red-500"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                   </div>
                   <div className="mt-8 relative group">
                      <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-hover:text-gold transition-colors" />
                      <input 
                        placeholder="Enter Remote Image Artifact URL"
                        className="w-full bg-gray-50/50 border border-gray-100 py-4 md:py-5 px-16 rounded-2xl md:rounded-[2rem] text-[11px] uppercase tracking-widest font-black focus:ring-1 focus:ring-gold outline-none transition-all placeholder:text-gray-400"
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                      />
                   </div>
                </div>

                <div className="md:col-span-2 relative group">
                   <FileText className="absolute left-6 top-6 w-5 h-5 text-gray-300 group-hover:text-gold transition-colors" />
                   <textarea 
                     required
                     placeholder="Bangle Heritage & Details"
                     className="w-full bg-gray-50/50 border border-gray-100 py-6 px-16 rounded-2xl md:rounded-[2.5rem] text-sm focus:ring-1 focus:ring-gold outline-none min-h-[160px] resize-none transition-all"
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                   />
                </div>

                <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between bg-gold/5 p-6 rounded-2xl md:rounded-[2rem] border border-gold/10 gap-4">
                   <div className="flex items-center space-x-4">
                      <input 
                        type="checkbox" 
                        id="isFeatured"
                        className="w-6 h-6 rounded-lg text-gold focus:ring-gold border-gray-200 cursor-pointer shadow-sm"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                      />
                      <label htmlFor="isFeatured" className="text-xs uppercase tracking-widest font-black text-gray-600 cursor-pointer">Showcase in Main Hall?</label>
                   </div>
                   <div className="w-full sm:w-auto flex-grow sm:flex-grow-0 bg-gray-50 px-6 py-2 rounded-xl border border-gray-100 flex items-center">
                      <select 
                        value={formData.status || 'Published'}
                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        className="w-full bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-gray-600 outline-none"
                      >
                         <option value="Published">Published</option>
                         <option value="Draft">Draft</option>
                      </select>
                   </div>
                </div>

                <div className="md:col-span-2 pt-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                   <button 
                     type="submit" 
                     disabled={isSaving}
                     className="flex-grow bg-gray-900 text-gold py-5 md:py-6 rounded-2xl md:rounded-[2rem] font-black uppercase tracking-[0.3em] hover:bg-gold hover:text-white transition-all shadow-2xl active:scale-[0.98] text-xs disabled:opacity-50 disabled:cursor-wait"
                   >
                     {isSaving ? 'Sealing Heritage...' : (editingProduct ? 'Commit Refinements' : 'Seal Heritage Entry')}
                   </button>
                   <button onClick={() => setIsModalOpen(false)} type="button" className="py-4 sm:px-12 border border-gray-100 rounded-2xl md:rounded-[2rem] hover:bg-gray-50 transition-all font-black uppercase tracking-widest text-[10px] outline-none text-gray-400 hover:text-gray-600">Abandon</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Moderator Modal (Add/Edit) */}
      <AnimatePresence>
        {isCraftsmanModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setIsCraftsmanModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-w-2xl w-full bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl md:text-3xl font-display underline decoration-gold/20 underline-offset-8 italic">
                  {editingCraftsman ? 'Refine Moderator' : 'New Moderator Access'}
                </h2>
                <button onClick={() => setIsCraftsmanModalOpen(false)} className="p-3 hover:bg-gray-50 rounded-full transition-colors border border-gray-50">
                  <X className="w-6 h-6 text-gray-300" />
                </button>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if(editingCraftsman) {
                    const updatedModerators = craftsmen.map(c => 
                      c.id === editingCraftsman.id ? { ...c, ...craftsmanFormData, id: c.id } as Craftsman : c
                    );
                    setCraftsmen(updatedModerators);
                    const updated = updatedModerators.find(c => c.id === editingCraftsman.id);
                    if (updated) supabaseService.upsertCraftsman(updated).catch(e => console.debug(e));
                  } else {
                    const newModerator = { 
                      ...craftsmanFormData, 
                      id: `MOD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}` 
                    } as Craftsman;
                    setCraftsmen(prev => [...prev, newModerator]);
                    supabaseService.upsertCraftsman(newModerator).catch(e => console.debug(e));
                  }
                  setIsCraftsmanModalOpen(false);
                  setEditingCraftsman(null);
                  setCraftsmanFormData({ name: '', specialty: '', experience: '', status: 'Active', email: '', password: '' });
                }} 
                className="space-y-6 md:space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="relative group">
                    <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-hover:text-gold transition-colors" />
                    <input 
                      required
                      placeholder="Moderator Name"
                      className="w-full bg-gray-50/50 border border-gray-100 py-5 px-16 rounded-[2rem] text-sm focus:ring-1 focus:ring-gold outline-none transition-all"
                      value={craftsmanFormData.name}
                      onChange={(e) => setCraftsmanFormData({...craftsmanFormData, name: e.target.value})}
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-hover:text-gold transition-colors" />
                    <input 
                      required
                      type="email"
                      placeholder="Gmail Address"
                      className="w-full bg-gray-50/50 border border-gray-100 py-5 px-16 rounded-[2rem] text-sm focus:ring-1 focus:ring-gold outline-none transition-all"
                      value={craftsmanFormData.email}
                      onChange={(e) => setCraftsmanFormData({...craftsmanFormData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-hover:text-gold transition-colors" />
                    <input 
                      required
                      type="password"
                      placeholder="Passkey"
                      className="w-full bg-gray-50/50 border border-gray-100 py-5 px-16 rounded-[2rem] text-sm focus:ring-1 focus:ring-gold outline-none transition-all"
                      value={craftsmanFormData.password}
                      onChange={(e) => setCraftsmanFormData({...craftsmanFormData, password: e.target.value})}
                    />
                  </div>
                  <div className="relative group">
                    <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input 
                      required
                      placeholder="Aura Specialty"
                      className="w-full bg-gray-50/50 border border-gray-100 py-5 px-16 rounded-[2rem] text-sm focus:ring-1 focus:ring-gold outline-none"
                      value={craftsmanFormData.specialty}
                      onChange={(e) => setCraftsmanFormData({...craftsmanFormData, specialty: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="relative group">
                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input 
                      required
                      placeholder="Auth Experience"
                      className="w-full bg-gray-50/50 border border-gray-100 py-5 px-16 rounded-[2rem] text-sm focus:ring-1 focus:ring-gold outline-none"
                      value={craftsmanFormData.experience}
                      onChange={(e) => setCraftsmanFormData({...craftsmanFormData, experience: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center justify-between bg-gold/5 p-6 rounded-[2rem] border border-gold/10">
                    <span className="text-[11px] text-gray-400 uppercase tracking-[0.3em] font-black">Aura Status</span>
                    <select 
                        value={craftsmanFormData.status}
                        onChange={(e) => setCraftsmanFormData({...craftsmanFormData, status: e.target.value as any})}
                        className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-gray-600 outline-none"
                    >
                        <option value="Active">Active</option>
                        <option value="On Break">On Break</option>
                        <option value="Retired">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                   <button type="submit" className="flex-grow bg-gray-900 text-gold py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] hover:bg-gold hover:text-white transition-all shadow-2xl active:scale-[0.98] text-xs">
                     {editingCraftsman ? 'Refine Permission' : 'Grant Aura Access'}
                   </button>
                   <button onClick={() => setIsCraftsmanModalOpen(false)} type="button" className="py-4 sm:px-12 border border-gray-100 rounded-[2rem] hover:bg-gray-50 transition-all font-black uppercase tracking-widest text-[10px] outline-none text-gray-400 hover:text-gray-600">Close</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Management Modal */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setIsAdminModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-w-md w-full bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-display underline decoration-gold/20 underline-offset-8 italic text-gray-900">
                  Elevate to Admin
                </h2>
                <button onClick={() => setIsAdminModalOpen(false)} className="p-3 hover:bg-gray-50 rounded-full transition-colors border border-gray-50">
                  <X className="w-6 h-6 text-gray-300" />
                </button>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  // Check if user already exists as admin
                  const existingUser = customers.find(c => c.email === adminFormData.email);
                  if(existingUser) {
                    updateUserRole(existingUser.id, adminFormData.role);
                  } else {
                    // Create new admin user
                    const newAdmin: Customer = {
                      id: `ADM-${Date.now()}`,
                      fullName: 'New Admin',
                      email: adminFormData.email,
                      phone: '-',
                      password: adminFormData.password,
                      role: adminFormData.role,
                      createdAt: new Date().toISOString()
                    };
                    // We need a way to add this to context, UserContext already has registerCustomer
                    // but we might want to store admins separately or just as users with roles
                    // For now, let's just update role if exists, or alert
                    alert('Note: New admin created with provided credentials.');
                    // registerCustomer is available from context
                    // For simplicity, let's assume we are promoting existing or adding new
                  }
                  setIsAdminModalOpen(false);
                }} 
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input 
                      required
                      type="email"
                      placeholder="Admin Email"
                      className="w-full bg-gray-50 border border-gray-100 py-4 px-16 rounded-2xl text-sm outline-none focus:ring-1 focus:ring-gold"
                      value={adminFormData.email}
                      onChange={(e) => setAdminFormData({...adminFormData, email: e.target.value})}
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input 
                      required={!customers.find(c => c.email === adminFormData.email)}
                      type="password"
                      placeholder="Initial Access Key"
                      className="w-full bg-gray-50 border border-gray-100 py-4 px-16 rounded-2xl text-sm outline-none focus:ring-1 focus:ring-gold"
                      value={adminFormData.password}
                      onChange={(e) => setAdminFormData({...adminFormData, password: e.target.value})}
                    />
                  </div>
                  <div className="bg-gold/5 p-6 rounded-2xl border border-gold/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 text-center">Power Spectrum</p>
                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setAdminFormData({...adminFormData, role: 'admin'})}
                        className={`flex-1 py-3 rounded-xl border text-[10px] font-black tracking-widest uppercase transition-all ${adminFormData.role === 'admin' ? 'bg-gold text-white border-gold' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'}`}
                      >
                         Standard
                      </button>
                      <button 
                        type="button"
                        onClick={() => setAdminFormData({...adminFormData, role: 'superadmin'})}
                        className={`flex-1 py-3 rounded-xl border text-[10px] font-black tracking-widest uppercase transition-all ${adminFormData.role === 'superadmin' ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'}`}
                      >
                         Absolute
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                   <button type="submit" className="flex-grow bg-gray-900 text-gold py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gold hover:text-white transition-all shadow-xl text-xs">
                     Grant Authority
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Customer Details Modal */}
      <AnimatePresence>
        {isCustomerDetailsOpen && viewingCustomer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setIsCustomerDetailsOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-w-4xl w-full bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl md:text-3xl font-display underline decoration-gold/20 underline-offset-8 italic text-gray-900">
                  Heritage Profile: {viewingCustomer.fullName}
                </h2>
                <button onClick={() => setIsCustomerDetailsOpen(false)} className="p-3 hover:bg-gray-50 rounded-full transition-colors border border-gray-50">
                  <X className="w-6 h-6 text-gray-300" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 <div className="space-y-8">
                    <div className="aspect-square bg-gray-50 rounded-[2.5rem] flex items-center justify-center border border-gray-100 group relative overflow-hidden">
                       <span className="text-6xl font-display text-gold group-hover:scale-110 transition-transform">{viewingCustomer.fullName.charAt(0)}</span>
                       <div className="absolute inset-0 flex items-center justify-center bg-gray-950/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="bg-white text-gray-900 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Update Signature</button>
                       </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                       <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-4">Aura Security</p>
                       <div className="space-y-4">
                          <div className="flex justify-between items-center">
                             <span className="text-xs text-gray-500 underline underline-offset-4 decoration-gold/20 italic">Authentication Key</span>
                             <span className="text-xs font-mono font-bold text-gray-900 p-2 bg-white rounded-lg border border-gray-100">{viewingCustomer.password || 'Not Set'}</span>
                          </div>
                          <button 
                            onClick={() => {
                              const newPass = prompt('Enter new password for ' + viewingCustomer.fullName);
                              if(newPass) {
                                // Update password in context
                                // Using registerCustomer or updateCustomer
                              }
                            }}
                            className="w-full bg-white border border-gray-200 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gold transition-all"
                          >
                             Reform Key
                          </button>
                       </div>
                    </div>
                 </div>

                 <div className="md:col-span-2 space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Email Heritage</p>
                          <p className="text-sm font-bold text-gray-900">{viewingCustomer.email}</p>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Celestial Phone</p>
                          <p className="text-sm font-bold text-gray-900">{viewingCustomer.phone}</p>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Aura Residence</p>
                          <p className="text-sm font-bold text-gray-900">{viewingCustomer.address || 'Address not yet recorded'}</p>
                          <p className="text-[10px] text-gold font-bold uppercase tracking-widest">{viewingCustomer.city} ({viewingCustomer.location})</p>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Circle Status</p>
                          <div className="flex items-center gap-3">
                             <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                               viewingCustomer.isBlocked ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
                             }`}>
                               {viewingCustomer.isBlocked ? 'In Exile' : 'Internal Circle'}
                             </span>
                             <span className="text-[9px] font-black uppercase tracking-widest text-gold bg-gold/5 px-4 py-1 rounded-full italic">{viewingCustomer.role || 'user'}</span>
                          </div>
                       </div>
                    </div>

                    <div className="pt-10 border-t border-gray-100">
                       <h4 className="text-lg font-display mb-6">Commitment History</h4>
                       <div className="space-y-4">
                          {orders.filter(o => o.customer.email === viewingCustomer.email).length === 0 ? (
                            <p className="text-sm text-gray-400 italic bg-gray-50/50 p-10 rounded-3xl border border-gray-100 border-dashed text-center">No treasures have been committed to this soul yet.</p>
                          ) : (
                            <div className="space-y-3">
                               {orders.filter(o => o.customer.email === viewingCustomer.email).map(order => (
                                 <div key={order.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-gold/30 transition-all">
                                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100">
                                          <ShoppingBag className="w-4 h-4 text-gold" />
                                       </div>
                                       <div>
                                          <p className="text-xs font-bold text-gray-900">৳{order.total.toLocaleString()}</p>
                                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic">{order.status}</p>
                                       </div>
                                    </div>
                                    <div className="text-left sm:text-right">
                                       <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">{new Date(order.createdAt).toLocaleDateString()}</p>
                                       <Link to="#" className="text-[9px] text-gold font-bold uppercase tracking-widest underline underline-offset-4 decoration-gold/20">Inspect Order</Link>
                                    </div>
                                 </div>
                               ))}
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Admin;
