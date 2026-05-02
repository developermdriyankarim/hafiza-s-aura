import React from 'react';
import { User, Package, Clock, LogOut, Settings, CreditCard, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useUsers } from '../context/UserContext';
import { useOrders } from '../context/OrderContext';

const Dashboard: React.FC = () => {
  const { currentUser, logoutUser } = useUsers();
  const { orders } = useOrders();
  const navigate = useNavigate();

  const user = {
    name: currentUser?.fullName || "Aura Guest",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'User')}&background=D4AF37&color=fff`,
    memberSince: "May 2024"
  };

  const userOrders = orders.filter(o => o.userId === currentUser?.id || o.customer.email === currentUser?.email);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Sidebar Nav */}
          <div className="lg:col-span-1 space-y-8">
             <div className="flex flex-col items-center p-8 bg-white rounded-2xl border border-gray-100 luxury-shadow">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gold/10 mb-4 p-1 bg-white">
                   <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <h2 className="text-xl font-display font-medium text-gray-900">{user.name}</h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Royal Member</p>
             </div>

             <nav className="bg-white rounded-2xl border border-gray-100 overflow-hidden luxury-shadow">
                {[
                  { icon: User, label: "Profile Details", active: true },
                  { icon: Package, label: "Order History", active: false },
                  { icon: CreditCard, label: "Payment Methods", active: false },
                  { icon: Settings, label: "Account Settings", active: false },
                ].map((item, i) => (
                  <button key={i} className={`w-full flex items-center space-x-4 px-6 py-5 border-b border-gray-50 last:border-0 transition-colors ${item.active ? 'bg-gold/5 text-gold' : 'text-gray-500 hover:bg-gray-50'}`}>
                     <item.icon className={`w-5 h-5 ${item.active ? 'text-gold' : 'text-gray-400'}`} />
                     <span className="text-xs uppercase tracking-widest font-bold">{item.label}</span>
                  </button>
                ))}
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-4 px-6 py-5 text-red-400 hover:bg-red-50 transition-colors"
                >
                   <LogOut className="w-5 h-5" />
                   <span className="text-xs uppercase tracking-widest font-bold">Sign Out</span>
                </button>
             </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
             {/* Stats */}
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: "Total Purchased", value: "$3,300", icon: CreditCard },
                  { label: "Aura Points", value: "1,250", icon: Clock },
                  { label: "VVIP Level", value: "Gold", icon: User },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 luxury-shadow flex items-center space-x-4">
                     <div className="bg-gold/10 p-3 rounded-xl">
                        <stat.icon className="w-6 h-6 text-gold" />
                     </div>
                     <div>
                        <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">{stat.label}</p>
                        <p className="text-xl font-display font-medium text-gray-900">{stat.value}</p>
                     </div>
                  </div>
                ))}
             </div>

             {/* Recent Orders */}
             <section>
                <div className="flex justify-between items-end mb-8 px-4">
                   <div>
                      <h3 className="text-2xl font-display">Recent Heritage Requests</h3>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Your past 2 orders</p>
                   </div>
                   <button className="text-gold text-xs font-bold uppercase tracking-widest border-b border-transparent hover:border-gold transition-all">View All Orders</button>
                </div>

                <div className="space-y-4">
                   {userOrders.length === 0 ? (
                     <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">No orders found yet</p>
                        <Link to="/shop" className="text-gold text-[10px] uppercase tracking-widest font-black mt-4 block">Begin your collection</Link>
                     </div>
                   ) : (
                     userOrders.slice(0, 5).map((order, i) => (
                       <motion.div 
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-white p-6 rounded-2xl border border-gray-100 luxury-shadow group hover:border-gold/30 transition-all flex flex-wrap items-center gap-8"
                       >
                          <div className="bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center">
                             <Package className="w-6 h-6 text-gray-300" />
                          </div>
                          <div className="flex-grow">
                             <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Order ID</p>
                             <h4 className="font-semibold text-gray-900 text-sm">{order.id}</h4>
                          </div>
                          <div>
                             <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Date</p>
                             <h4 className="font-semibold text-gray-900 text-sm">{new Date(order.createdAt).toLocaleDateString()}</h4>
                          </div>
                          <div>
                             <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Value</p>
                             <h4 className="font-semibold text-gold text-sm">৳{order.total.toLocaleString()}</h4>
                          </div>
                          <div>
                             <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-black ${
                               order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 
                               order.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                               'bg-gold/10 text-gold'
                             }`}>
                               {order.status}
                             </span>
                          </div>
                          <button className="p-2 rounded-full border border-gray-100 group-hover:bg-gold group-hover:text-white transition-all">
                             <ChevronRight className="w-5 h-5" />
                          </button>
                       </motion.div>
                     ))
                   )}
                </div>
             </section>

             {/* Personal Aura */}
             <div className="bg-gray-900 p-10 rounded-2xl overflow-hidden relative group">
                <div className="relative z-10 max-w-md">
                   <h3 className="text-2xl font-display text-white mb-4">Your Aura is Growing</h3>
                   <p className="text-white/60 text-sm leading-relaxed mb-8">You are only $1,700 away from unlocking our <span className="text-gold font-bold">Bridal Diamond Concierge</span> services.</p>
                   <Link to="/shop" className="inline-flex items-center space-x-3 text-xs font-bold uppercase tracking-[0.2em] text-gold hover:text-white transition-colors">
                      <span>Continue Exploring Collections</span>
                      <ChevronRight className="w-4 h-4" />
                   </Link>
                </div>
                <div className="absolute top-0 right-0 w-64 h-full bg-gold/10 -skew-x-12 transform translate-x-20 group-hover:translate-x-16 transition-transform duration-700" />
                <StarsBackground />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StarsBackground = () => (
   <div className="absolute inset-0 opacity-20 pointer-events-none">
      {[...Array(20)].map((_, i) => (
         <div 
           key={i} 
           className="bg-white rounded-full absolute" 
           style={{
             width: Math.random() * 2 + 1 + 'px',
             height: Math.random() * 2 + 1 + 'px',
             top: Math.random() * 100 + '%',
             left: Math.random() * 100 + '%',
           }}
         />
      ))}
   </div>
)

export default Dashboard;
