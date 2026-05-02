import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Phone, ShieldCheck, CreditCard, ShoppingBag, Edit2, Save, X, LogOut, Camera, Clock, CheckCircle, Package } from 'lucide-react';
import { useUsers } from '../context/UserContext';
import { useOrders } from '../context/OrderContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { currentUser, updateCustomer, logoutUser } = useUsers();
  const { orders, updateOrderStatus, syncWithSupabase } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    if (syncWithSupabase) {
      syncWithSupabase();
    }
  }, []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    bio: '',
    avatar: ''
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      setFormData({
        fullName: currentUser.fullName,
        phone: currentUser.phone,
        email: currentUser.email,
        bio: currentUser.bio || '',
        avatar: currentUser.avatar || ''
      });
    }
  }, [currentUser, navigate]);

  const userOrders = orders.filter(order => order.userId === currentUser?.id);

  const getActiveOrder = () => {
    return userOrders.find(o => o.status !== 'Delivered' && o.status !== 'Cancelled') || userOrders[0];
  };

  const activeOrder = getActiveOrder();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('Are you sure you wish to withdraw this selection from your heritage collection?')) {
      updateOrderStatus(orderId, 'Cancelled');
      alert('Order has been cancelled.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      try {
        await updateCustomer({
          ...currentUser,
          fullName: formData.fullName,
          phone: formData.phone,
          bio: formData.bio,
          avatar: formData.avatar
        });
        setIsEditing(false);
        alert('Aura profile updated successfully!');
      } catch (err: any) {
        console.error('Update profile error:', err);
        alert('Something went wrong. If the image is too large, try a smaller one.');
      }
    }
  };

  const TrackingTimeline = ({ status, orderDate }: { status: string, orderDate: string }) => {
    const steps = [
      { id: 'Pending', label: 'Artisan Received', desc: 'Selection is being reviewed by our master artisans.' },
      { id: 'Approved', label: 'Aura Verified', desc: 'Authenticity and quality check completed.' },
      { id: 'In Transit', alternateId: 'Shipped', label: 'In Transit', desc: 'Your treasure has left the royal vaults.' },
      { id: 'Delivered', label: 'Grand Arrival', desc: 'The aura has reached its destination.' }
    ];

    const currentIdx = steps.findIndex(s => s.id === status || (s.alternateId && s.alternateId === status));
    
    return (
      <div className="space-y-8 mt-6">
        {steps.map((step, idx) => (
          <div key={idx} className="space-y-4">
            <div className="flex gap-4 relative">
              {idx !== steps.length - 1 && (
                <div className={`absolute left-4 top-8 w-0.5 h-12 ${idx <= currentIdx ? 'bg-gold' : 'bg-gray-100'}`} />
              )}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                idx <= currentIdx ? 'bg-gold text-white shadow-lg' : 'bg-gray-100 text-gray-300'
              }`}>
                {idx < currentIdx ? <CheckCircle className="w-5 h-5" /> : idx === currentIdx ? <Package className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
              </div>
              <div>
                <p className={`text-xs font-black uppercase tracking-widest ${idx <= currentIdx ? 'text-gray-900' : 'text-gray-300'}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>

            {/* Detailed tracking for In Transit status */}
            {(status === 'Shipped' || status === 'In Transit') && (step.id === 'Shipped' || step.id === 'In Transit') && (
              <div className="ml-12 pl-4 border-l border-gold/20 space-y-4 py-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-600 font-medium">• Package received by courier</span>
                  <span className="text-gray-400">1 day ago</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-600 font-medium">• Processed at hub</span>
                  <span className="text-gray-400">12 hours ago</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-600 font-medium">• In transit to city</span>
                  <span className="text-gray-400">6 hours ago</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-600 font-medium">• Out for delivery</span>
                  <span className="text-gray-400">Just now</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400 font-display italic">Resyncing with Aura...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
           <div>
              <h1 className="text-4xl font-display text-gray-900 italic underline decoration-gold/20 underline-offset-8">
                {currentUser?.fullName ? `${currentUser.fullName}'s Profile` : 'Your Royal Profile'}
              </h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black mt-3">Manage your personal aura</p>
           </div>
           <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest text-[10px] font-black"
           >
              <LogOut className="w-4 h-4" />
              <span>Exit Aura</span>
           </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Sidebar Info */}
          <div className="md:col-span-1 space-y-6">
             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                <div className="relative inline-block mb-6 group">
                   <div className="w-32 h-32 bg-gold/10 rounded-full flex items-center justify-center text-gold text-4xl font-display border border-gold/20 overflow-hidden">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        currentUser.fullName.charAt(0)
                      )}
                   </div>
                   {isEditing && (
                     <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-gray-900 text-gold rounded-full shadow-lg hover:scale-110 transition-transform"
                     >
                       <Camera className="w-4 h-4" />
                     </button>
                   )}
                   <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                   />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{currentUser.fullName}</h2>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-black mt-1">Heritage Member</p>
             </div>

             <div className="bg-gray-900 p-8 rounded-3xl text-white">
                <div className="flex items-center space-x-3 mb-6">
                   <ShieldCheck className="w-5 h-5 text-gold" />
                   <span className="text-[10px] uppercase tracking-widest font-black">Aura Security</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">Your data is secured with vault-grade encryption. Only artisans can verify your identity.</p>
                <div className="space-y-3">
                   <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Identity Status</span>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                   </div>
                </div>
             </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
             <AnimatePresence mode="wait">
                {showOrders ? (
                  <motion.div 
                    key="orders"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-10">
                       <h3 className="text-xl font-display">Aura Order History</h3>
                       <button 
                        onClick={() => setShowOrders(false)}
                        className="text-[10px] font-black uppercase tracking-widest text-gold hover:underline"
                       >
                         Back to Profile
                       </button>
                    </div>

                    <div className="space-y-6">
                       {userOrders.length === 0 ? (
                         <div className="text-center py-10 italic text-gray-400">
                           No treasures selected yet.
                         </div>
                       ) : (
                         userOrders.map(order => (
                           <div key={order.id} className="group border border-gray-100 rounded-3xl overflow-hidden hover:border-gold/30 transition-all bg-gray-50/30">
                             <div 
                              onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                              className="p-6 cursor-pointer flex flex-col sm:flex-row justify-between items-center gap-4"
                             >
                               <div className="flex items-center gap-4">
                                 <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-gold/5 transition-colors">
                                   <Clock className="w-5 h-5 text-gold" />
                                 </div>
                                 <div className="text-left">
                                   <p className="text-xs font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                   <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">{order.items.length} items • ৳{(Number(order.total) || 0).toLocaleString()}</p>
                                    {order.customer.location && <p className="text-[9px] text-gold font-bold uppercase tracking-widest mt-1">{order.customer.location}</p>}
                                 </div>
                               </div>
                               <div className="flex items-center gap-4">
                                 <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                   order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-600' :
                                   order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' :
                                   order.status === 'Approved' ? 'bg-amber-100 text-amber-600' :
                                   order.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                   'bg-gray-100 text-gray-500'
                                 }`}>
                                   {order.status}
                                 </div>
                               </div>
                             </div>

                             <AnimatePresence>
                               {selectedOrder === order.id && (
                                 <motion.div 
                                   initial={{ height: 0, opacity: 0 }}
                                   animate={{ height: 'auto', opacity: 1 }}
                                   exit={{ height: 0, opacity: 0 }}
                                   className="border-t border-gray-100 bg-white"
                                 >
                                   <div className="p-8 space-y-6">
                                     <div className="space-y-4">
                                       <h4 className="text-[10px] uppercase tracking-widest font-black text-gray-400">Reserved Items</h4>
                                       <div className="space-y-3">
                                         {order.items.map((item, idx) => (
                                           <div key={idx} className="flex justify-between items-center text-sm">
                                             <div className="flex items-center gap-3">
                                               <span className="text-gray-400 font-mono text-[10px]">{item.quantity}x</span>
                                               <span className="font-medium text-gray-900">{item.name}</span>
                                             </div>
                                             <span className="text-gray-500 font-mono text-xs">৳{((Number(item.price) || 0) * (Number(item.quantity) || 0)).toLocaleString()}</span>
                                           </div>
                                         ))}
                                       </div>
                                       <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                         <span className="text-xs font-bold text-gray-900 uppercase tracking-widest block">Total Valuation</span>
                                            {order.deliveryFee > 0 && <span className="text-[9px] text-gray-400">Includes ৳{order.deliveryFee} shipping to {order.customer.location}</span>}
                                         <span className="text-gold font-bold">৳{(Number(order.total) || 0).toLocaleString()}</span>
                                       </div>
                                     </div>

                                     {order.deliveryDate && (
                                       <div className="p-6 bg-gold/5 rounded-2xl border border-gold/10">
                                         <p className="text-[10px] text-gold uppercase tracking-widest font-black mb-1">Aura Commitment Date</p>
                                         <p className="text-sm font-bold text-gray-900">{new Date(order.deliveryDate).toLocaleDateString(undefined, { dateStyle: 'full' })}</p>
                                       </div>
                                     )}

                                     {order.status === 'Pending' && (
                                       <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCancelOrder(order.id);
                                        }}
                                        className="w-full py-4 border border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                       >
                                         <X className="w-4 h-4" />
                                         Withdraw Selection (Cancel)
                                       </button>
                                     )}
                                   </div>
                                 </motion.div>
                               )}
                             </AnimatePresence>
                           </div>
                         ))
                       )}
                    </div>
                  </motion.div>
                ) : showTracking ? (
                  <motion.div 
                    key="tracking"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-10">
                       <h3 className="text-xl font-display">Aura Transit Tracker</h3>
                       <button 
                        onClick={() => setShowTracking(false)}
                        className="text-[10px] font-black uppercase tracking-widest text-gold hover:underline"
                       >
                         Back to Profile
                       </button>
                    </div>

                    {!activeOrder ? (
                      <div className="text-center py-10 italic text-gray-400">
                        No active transit monitored.
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                          <div className="flex justify-between items-start mb-8">
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Tracking ID</p>
                              <p className="text-base font-bold text-gray-900">AUR-{activeOrder.id.split('-')[1]}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Aura Commitment</p>
                              <p className="text-sm font-bold text-gold">
                                {activeOrder.deliveryDate ? new Date(activeOrder.deliveryDate).toLocaleDateString() : '2-4 Working Days'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-8">
                            <TrackingTimeline status={activeOrder.status} orderDate={activeOrder.createdAt} />
                          </div>
                        </div>

                        <div className="p-6 bg-white rounded-2xl border border-gray-100 flex items-center gap-4">
                          <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">Carrier: Aura Artisans Registry</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black italic">Hand-delivered with care</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-10">
                       <h3 className="text-xl font-display">Personal Details</h3>
                       <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="p-3 bg-gray-50 rounded-2xl hover:bg-gold/10 hover:text-gold transition-all text-gray-400"
                       >
                          {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                       </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Full Name</label>
                             <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-hover:text-gold transition-colors" />
                                <input 
                                  disabled={!isEditing}
                                  type="text" 
                                  className="w-full bg-gray-50/50 border border-gray-100 py-4 px-12 rounded-2xl text-sm focus:ring-1 focus:ring-gold outline-none transition-all disabled:opacity-50"
                                  value={formData.fullName}
                                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                />
                             </div>
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Phone Number</label>
                             <div className="relative group">
                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-hover:text-gold transition-colors" />
                                <input 
                                  disabled={!isEditing}
                                  type="tel" 
                                  className="w-full bg-gray-50/50 border border-gray-100 py-4 px-12 rounded-2xl text-sm focus:ring-1 focus:ring-gold outline-none transition-all disabled:opacity-50"
                                  value={formData.phone}
                                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                             </div>
                          </div>
                          <div className="md:col-span-2 space-y-3">
                             <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Bio & Heritage Story</label>
                             <textarea 
                              disabled={!isEditing}
                              className="w-full bg-gray-50/50 border border-gray-100 py-4 px-6 rounded-2xl text-sm focus:ring-1 focus:ring-gold outline-none transition-all disabled:opacity-50 min-h-[100px] resize-none"
                              placeholder="Tell us about your connection to artisan jewelry..."
                              value={formData.bio}
                              onChange={(e) => setFormData({...formData, bio: e.target.value})}
                             />
                          </div>
                       </div>

                       {isEditing && (
                         <motion.button 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          type="submit"
                          className="w-full bg-gray-900 text-gold py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gold hover:text-white transition-all shadow-xl flex items-center justify-center space-x-3"
                         >
                            <Save className="w-4 h-4" />
                            <span>Commit Changes</span>
                         </motion.button>
                       )}
                    </form>
                  </motion.div>
                )}
             </AnimatePresence>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  onClick={() => {
                    setShowOrders(true);
                    setShowTracking(false);
                  }}
                  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-6 hover:shadow-md transition-shadow cursor-pointer group"
                >
                   <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                      <ShoppingBag className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-gray-900">Order History</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">View past selections</p>
                   </div>
                </div>
                <div 
                  onClick={() => {
                    setShowTracking(true);
                    setShowOrders(false);
                  }}
                  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-6 hover:shadow-md transition-shadow cursor-pointer group"
                >
                   <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <CreditCard className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-gray-900">Delivery Status</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Track aura transit</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
