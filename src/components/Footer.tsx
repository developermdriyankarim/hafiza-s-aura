import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-gold tracking-widest uppercase">
              Hafiza's Aura
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Crafting timeless elegance through curated bangles that reflect the beauty and aura of every woman.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gold hover:bg-gold/5 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61573369469633" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gold hover:bg-gold/5 transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://wa.me/8801996854989" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gold hover:bg-gold/5 transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>


          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-900">Support</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/contact" className="text-sm text-gray-500 hover:text-gold transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="text-sm text-gray-500 hover:text-gold transition-colors">Shipping & Returns</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-gold transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-sm text-gray-500 hover:text-gold transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-900">Newsletter</h4>
            <p className="text-sm text-gray-500">Subscribe for exclusive updates and royal collection launches.</p>
            <div className="flex bg-gray-50 p-1 rounded-full border border-gray-100">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-transparent border-none focus:outline-none flex-grow pl-4 text-sm"
              />
              <button className="bg-gold text-white px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-accent-gold transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-gray-50 gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              © 2024 HAFIZA'S AURA JEWELS. ALL RIGHTS RESERVED.
            </p>
            <p className="text-[10px] text-gold font-black uppercase tracking-[0.2em] mt-2">
              Developed by Md. Riyan Karim
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 text-[10px] text-gray-400 uppercase tracking-widest font-medium">
            <Link to="/admin" className="hover:text-gold transition-colors block">Admin Access</Link>
            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> Dhaka, Bangladesh</span>
            <span className="flex items-center"><Mail className="w-3 h-3 mr-1" /> hafizaaktermim82@gmail.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
