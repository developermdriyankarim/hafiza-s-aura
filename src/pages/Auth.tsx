import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Heart, Phone } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useUsers } from '../context/UserContext';
import { useSupport } from '../context/SupportContext';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { registerCustomer, loginUser } = useUsers();
  const { addMessage } = useSupport();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/shop';
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validate = () => {
    if (!formData.email.includes('@')) return 'Please enter a valid email address.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters.';
    if (!isLogin) {
      if (!formData.name) return 'Please enter your full name.';
      if (!formData.phone) return 'Please enter your phone number.';
    }
    return '';
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      setError('Please enter your email address first.');
      return;
    }
    addMessage({
      name: formData.name || 'Aura Seeker',
      email: formData.email,
      subject: 'Forgot Password Request',
      message: `The user with email ${formData.email} has requested a password reset.`,
      type: 'forget-password'
    });
    setSuccess('Password reset request sent to artisans. They will get back to you soon.');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      setSuccess('');
      return;
    }
    setError('');
    
    if (!isLogin) {
      const performRegister = async () => {
        try {
          await registerCustomer({
            id: `USR-${Date.now()}`,
            fullName: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            createdAt: new Date().toISOString()
          });
          navigate(redirectTo);
        } catch (err: any) {
          setError(err.message === 'User with this email already exists' 
            ? 'An account with this email already exists. Please try logging in.' 
            : err.message);
        }
      };
      performRegister();
    } else {
      const performLogin = async () => {
        try {
          await loginUser(formData.email, formData.password);
          navigate(redirectTo);
        } catch (err: any) {
          setError(err.message || 'Invalid credentials or account does not exist.');
        }
      };
      performLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#F9E9EC]/30 flex items-center justify-center py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl luxury-shadow overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-gold/10"
      >
        <div className="flex-grow p-10 flex flex-col justify-center">
            <div className="mb-10 text-center">
               <h1 className="text-3xl font-display mb-2">{isLogin ? "Welcome Back" : "Join the Aura"}</h1>
               <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                 {isLogin ? "Enter your royal credentials" : "Create your personal heritage account"}
               </p>
            </div>

            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest p-4 rounded-lg mb-6 border border-red-100"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest p-4 rounded-lg mb-6 border border-emerald-100"
              >
                {success}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
               <AnimatePresence mode="wait">
                 {!isLogin && (
                   <motion.div 
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="space-y-6"
                   >
                     <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                       <input 
                         type="text" 
                         placeholder="Full Name" 
                         className="w-full bg-gray-50 border-none py-4 px-12 rounded-lg text-sm focus:ring-1 focus:ring-gold transition-all"
                         value={formData.name}
                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                       />
                     </div>
                     <div className="relative">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                       <input 
                         type="tel" 
                         placeholder="Phone Number" 
                         className="w-full bg-gray-50 border-none py-4 px-12 rounded-lg text-sm focus:ring-1 focus:ring-gold transition-all"
                         value={formData.phone}
                         onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                       />
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full bg-gray-50 border-none py-4 px-12 rounded-lg text-sm focus:ring-1 focus:ring-gold transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
               </div>

               <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full bg-gray-50 border-none py-4 px-12 rounded-lg text-sm focus:ring-1 focus:ring-gold transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
               </div>

               {isLogin && (
                 <div className="text-right">
                    <button 
                      type="button" 
                      onClick={handleForgotPassword}
                      className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-gold"
                    >
                      Forgot Password?
                    </button>
                 </div>
               )}

               <button 
                  type="submit" 
                  className="w-full bg-gray-900 text-white py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold transition-all shadow-lg flex items-center justify-center space-x-2"
               >
                  <span>{isLogin ? "Authenticate" : "Create Account"}</span>
                  <ArrowRight className="w-4 h-4" />
               </button>
            </form>

            <div className="mt-10 text-center">
               <p className="text-sm text-gray-500">
                  {isLogin ? "New to Hafiza's Aura?" : "Already have an account?"}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-gold font-bold uppercase tracking-widest text-xs border-b border-gold pb-0.5"
                  >
                    {isLogin ? "Sign Up" : "Log In"}
                  </button>
               </p>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-6 grayscale opacity-30">
               <ShieldCheck className="w-5 h-5" />
               <Heart className="w-5 h-5" />
               <ShieldCheck className="w-5 h-5" />
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
