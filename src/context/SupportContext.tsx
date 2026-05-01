import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportMessage } from '../types';
import { supabaseService } from '../services/supabaseService';

interface SupportContextType {
  messages: SupportMessage[];
  addMessage: (message: Omit<SupportMessage, 'id' | 'status' | 'createdAt'>) => void;
  updateMessageStatus: (id: string, status: SupportMessage['status']) => void;
  deleteMessage: (id: string) => void;
  syncWithSupabase: () => Promise<void>;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export const SupportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<SupportMessage[]>(() => {
    const saved = localStorage.getItem('aura_support_messages');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('aura_support_messages', JSON.stringify(messages));
  }, [messages]);

  const syncWithSupabase = async () => {
    try {
      const data = await supabaseService.getSupportMessages();
      if (data && data.length > 0) {
        setMessages(data);
      }
    } catch (e) {
      console.warn('Supabase support sync failed:', e);
    }
  };

  useEffect(() => {
    syncWithSupabase();
  }, []);

  const addMessage = async (msg: Omit<SupportMessage, 'id' | 'status' | 'createdAt'>) => {
    const newMessage: SupportMessage = {
      ...msg,
      id: Date.now().toString(),
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [newMessage, ...prev]);
    try {
      await supabaseService.addSupportMessage(newMessage);
    } catch (e) {
      console.debug('Supabase message save failed:', e);
    }
  };

  const updateMessageStatus = (id: string, status: SupportMessage['status']) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, status } : msg
    ));
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  return (
    <SupportContext.Provider value={{ messages, addMessage, updateMessageStatus, deleteMessage, syncWithSupabase }}>
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (!context) throw new Error('useSupport must be used within a SupportProvider');
  return context;
};
