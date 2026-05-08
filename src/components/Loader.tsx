import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const Loader: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reduce artificial delay for better perceived speed
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
        >
          <div className="relative mb-6">
             <div className="w-16 h-16 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gold font-display font-bold text-xl">A</span>
             </div>
          </div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold animate-pulse">
            Adorning your Aura...
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
