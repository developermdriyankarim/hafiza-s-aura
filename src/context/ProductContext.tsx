import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { products as initialProducts } from '../data/products';
import { supabaseService } from '../services/supabaseService';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  syncWithSupabase: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const syncWithSupabase = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Syncing products with Supabase...');
      const dbData = await supabaseService.getProducts();
      
      if (dbData && Array.isArray(dbData)) {
        console.log(`✅ Success: Loaded ${dbData.length} products from Supabase`);
        setProducts(dbData);
        // Save to cache for offline support, but we always prefer the fresh DB data
        localStorage.setItem('aura_products', JSON.stringify(dbData));
      } else {
        console.warn('⚠️ No products found in Supabase table.');
        // Fallback to local storage only if DB returns nothing
        const saved = localStorage.getItem('aura_products');
        if (saved) setProducts(JSON.parse(saved));
      }
    } catch (e) {
      console.error('❌ Supabase products sync failed:', e);
      const saved = localStorage.getItem('aura_products');
      if (saved) setProducts(JSON.parse(saved));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    syncWithSupabase();

    // REAL-TIME SUBSCRIPTION
    const channel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          console.log('🔔 Realtime update received for products');
          syncWithSupabase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Use a separate effect to refresh when the window gains focus (optional but helpful)
  useEffect(() => {
    const handleFocus = () => syncWithSupabase();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      try {
        localStorage.setItem('aura_products', JSON.stringify(products));
      } catch (e) {
        // Fail silently
      }
    }
  }, [products]);

  const addProduct = async (product: Product) => {
    // 1. Immediate local update
    setProducts((prev) => {
      const newProducts = [product, ...prev];
      try {
        localStorage.setItem('aura_products', JSON.stringify(newProducts));
      } catch (e) {
        console.error('LocalStorage save error:', e);
      }
      return newProducts;
    });

    // 2. Database sync in background
    try {
      await supabaseService.upsertProduct(product);
      console.log('Product synced to Supabase successfully');
    } catch (e: any) {
      console.error('Supabase save failed, but retained locally:', e);
      // We don't throw here so the UI doesn't crash, 
      // but we inform the user via the Admin page's catch block
      throw new Error(e.message || 'Database sync failed');
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    // 1. Immediate local update
    setProducts((prev) => {
      const newProducts = prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
      localStorage.setItem('aura_products', JSON.stringify(newProducts));
      return newProducts;
    });

    // 2. Database update
    try {
      await supabaseService.upsertProduct(updatedProduct);
    } catch (e) {
      console.error('Database Update Error:', e);
      throw e;
    }
  };

  const deleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      await supabaseService.deleteProduct(productId);
    } catch (e) {
      console.error('Database Delete Error:', e);
      syncWithSupabase();
      throw e;
    }
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  return (
    <ProductContext.Provider value={{ products, isLoading, addProduct, updateProduct, deleteProduct, getProductById, syncWithSupabase }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};
