import React from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';

const Toast: React.FC = () => {
  const { toast, setToast } = useCart();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-10 left-1/2 z-[100] bg-white border border-gold/20 px-6 py-4 rounded-xl luxury-shadow flex items-center space-x-4 min-w-[280px]"
        >
          <div className="bg-green-50 p-2 rounded-full">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm font-medium text-gray-900 flex-grow">{toast}</p>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
