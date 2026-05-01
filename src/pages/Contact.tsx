import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useSupport } from '../context/SupportContext';

const Contact: React.FC = () => {
  const { addMessage } = useSupport();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addMessage({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      type: formData.subject.toLowerCase().includes('return') ? 'return' : 
            formData.subject.toLowerCase().includes('shipping') ? 'shipping' : 'contact'
    });

    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    setErrors({});
  };

  return (
    <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div className="space-y-12">
          <div>
            <h1 className="text-5xl font-display text-gray-900 mb-6 italic underline decoration-gold/20 underline-offset-8">Get in Touch</h1>
            <p className="text-gray-500 max-w-md leading-relaxed">
              Our artisans are here to assist you with any inquiries regarding our heritage collections or your bespoke orders.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-gray-100">
                <Mail className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">Aura Correspondece</p>
                <p className="text-gray-900 font-bold">hafizaaktermim82@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-gray-100">
                <Phone className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">Artisan Line / WhatsApp</p>
                <p className="text-gray-900 font-bold">+880 1996-854989</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-gray-100">
                <MapPin className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">Heritage Studio</p>
                <p className="text-gray-900 font-bold">Tongi, Gazipur<br />Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 md:p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50"
        >
          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-display mb-4">Message Received</h2>
              <p className="text-gray-500 mb-8">Our artisans will review your inquiry and respond within 24 hours.</p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-gold font-black uppercase text-[10px] tracking-widest hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-900 ml-4">Name</label>
                  <input 
                    type="text"
                    className={`w-full bg-gray-50 border-none py-5 px-8 rounded-full text-sm focus:ring-1 focus:ring-gold outline-none transition-all ${errors.name ? 'ring-1 ring-red-500' : ''}`}
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  {errors.name && <p className="text-[9px] text-red-500 font-bold ml-4 uppercase">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-900 ml-4">Email</label>
                  <input 
                    type="email"
                    className={`w-full bg-gray-50 border-none py-5 px-8 rounded-full text-sm focus:ring-1 focus:ring-gold outline-none transition-all ${errors.email ? 'ring-1 ring-red-500' : ''}`}
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  {errors.email && <p className="text-[9px] text-red-500 font-bold ml-4 uppercase">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-900 ml-4">Subject</label>
                <select 
                  className="w-full bg-gray-50 border-none py-5 px-8 rounded-full text-sm focus:ring-1 focus:ring-gold outline-none transition-all"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                >
                  <option>General Inquiry</option>
                  <option>Order Status</option>
                  <option>Product Information</option>
                  <option>Shipping & Delivery</option>
                  <option>Returns & Exchanges</option>
                  <option>Bespoke Request</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-900 ml-4">Message</label>
                <textarea 
                  rows={6}
                  className={`w-full bg-gray-50 border-none py-6 px-8 rounded-[2rem] text-sm focus:ring-1 focus:ring-gold outline-none transition-all resize-none ${errors.message ? 'ring-1 ring-red-500' : ''}`}
                  placeholder="How can we assist you?"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
                {errors.message && <p className="text-[9px] text-red-500 font-bold ml-4 uppercase">{errors.message}</p>}
              </div>

              <button 
                type="submit"
                className="w-full bg-gray-900 text-white py-6 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-gold transition-all shadow-xl flex items-center justify-center space-x-3"
              >
                <Send className="w-4 h-4 text-gold" />
                <span>Dispatch Message</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
