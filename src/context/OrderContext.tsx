import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order } from '../types';
import { supabaseService } from '../services/supabaseService';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updateOrder: (orderId: string, updates: Partial<Order>) => Promise<void>;
  syncWithSupabase: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('aura_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (e) {
      console.error('Failed to parse orders', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders to localStorage:', e);
    }
  }, [orders]);

  const syncWithSupabase = async () => {
    try {
      const data = await supabaseService.getOrders();
      if (data && data.length > 0) {
        setOrders(data);
      }
    } catch (e) {
      console.warn('Supabase orders sync failed:', e);
    }
  };

  useEffect(() => {
    syncWithSupabase();
  }, []);

  const addOrder = async (order: Order) => {
    // 1. Update local state immediately
    setOrders(prev => [order, ...prev]);
    
    // 2. Sync to Supabase
    try {
      await supabaseService.upsertOrder(order);
      console.log('Order synced to Supabase successfully');
    } catch (e) {
      console.error('Supabase order save failed, but retained locally:', e);
      // We re-throw so Checkout can be informed, but it's already in local state
      throw e;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const updated = orders.map(order => order.id === orderId ? { ...order, status } : order);
    setOrders(updated);
    const orderToUpdate = updated.find(o => o.id === orderId);
    if (orderToUpdate) {
      try {
        await supabaseService.upsertOrder(orderToUpdate);
      } catch (e) {
        console.debug('Supabase order status update failed:', e);
      }
    }
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    const updated = orders.map(order => order.id === orderId ? { ...order, ...updates } : order);
    setOrders(updated);
    const orderToUpdate = updated.find(o => o.id === orderId);
    if (orderToUpdate) {
      try {
        await supabaseService.upsertOrder(orderToUpdate);
      } catch (e) {
        console.debug('Supabase order update failed:', e);
      }
    }
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, updateOrder, syncWithSupabase }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
};
