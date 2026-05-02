import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, AdminLoginHistory } from '../types';
import { supabaseService } from '../services/supabaseService';
import { supabase } from '../lib/supabase';

interface UserContextType {
  customers: Customer[];
  currentUser: Customer | null;
  loginHistory: AdminLoginHistory[];
  registerCustomer: (customer: Customer) => Promise<void>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (userId: string) => Promise<void>;
  toggleBlockUser: (userId: string) => Promise<void>;
  updateUserRole: (userId: string, role: Customer['role']) => Promise<void>;
  loginUser: (email: string, password?: string) => Promise<Customer | null>;
  logoutUser: () => Promise<void>;
  addLoginHistory: (history: Omit<AdminLoginHistory, 'id'>) => Promise<void>;
  syncWithSupabase: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('aura_customers');
      const rawUsers = saved ? JSON.parse(saved) : [];
      
      // Deduplicate by email (prefer the one with more data or later in list)
      const userMap = new Map<string, Customer>();
      rawUsers.forEach((u: Customer) => {
        userMap.set(u.email, u);
      });
      const initialUsers = Array.from(userMap.values());
      
      // Ensure the predefined admin exists
      const adminEmail = 'info.mdriyankarim@gmail.com';
      const adminExists = initialUsers.find((u: Customer) => u.email === adminEmail);
      if (!adminExists) {
        initialUsers.push({
          id: 'ADMIN-1',
          fullName: 'Aura Master Admin',
          email: adminEmail,
          phone: '01402842584',
          password: '01402842584',
          role: 'superadmin',
          createdAt: new Date().toISOString()
        });
      }
      return initialUsers;
    } catch (e) {
      console.error('Failed to parse customers', e);
      return [];
    }
  });

  const [loginHistory, setLoginHistory] = useState<AdminLoginHistory[]>(() => {
    try {
      const saved = localStorage.getItem('aura_login_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<Customer | null>(() => {
    try {
      const saved = localStorage.getItem('aura_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse current user', e);
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_customers', JSON.stringify(customers));
    } catch (e) {
      console.warn('Failed to save customers to localStorage:', e);
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem('aura_current_user', JSON.stringify(currentUser));
    } catch (e) {
      console.warn('Failed to save current user to localStorage (likely quota exceeded):', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('aura_login_history', JSON.stringify(loginHistory));
    } catch (e) {
       console.warn('Failed to save login history to localStorage:', e);
    }
  }, [loginHistory]);

  const syncWithSupabase = async () => {
    try {
      const data = await supabaseService.getCustomers();
      if (data && data.length > 0) {
        setCustomers(data);
      }
    } catch (e) {
      console.warn('Supabase customers sync failed:', e);
    }

    try {
      const history = await supabaseService.getLoginHistory();
      if (history && history.length > 0) {
        setLoginHistory(history);
      }
    } catch (e) {
      console.warn('Supabase login history sync failed:', e);
    }
  };

  const customersRef = React.useRef(customers);
  useEffect(() => {
    customersRef.current = customers;
  }, [customers]);

  useEffect(() => {
    syncWithSupabase();

    // Listen for auth state changes from Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const existingUser = customersRef.current.find(c => c.email === session.user.email);
        if (existingUser) {
          setCurrentUser(existingUser);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const registerCustomer = async (customer: Customer) => {
    // 1. Register with Supabase Auth to show in the "Authentication" dashboard
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: customer.email,
      password: customer.password || '',
      options: {
        data: {
          fullName: customer.fullName,
          phone: customer.phone
        }
      }
    });

    if (authError) throw authError;

    // Use the real Supabase Auth ID if available
    const supabaseId = authData.user?.id || customer.id;
    const newCustomer = { 
      ...customer, 
      id: supabaseId, 
      role: customer.role || 'user' 
    };

    setCustomers(prev => [...prev.filter(c => c.email !== newCustomer.email), newCustomer]);
    setCurrentUser(newCustomer);
    
    try {
      await supabaseService.upsertCustomer(newCustomer);
    } catch (e) {
      console.debug('Supabase profile save failed:', e);
    }
  };

  const updateCustomer = async (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    if (currentUser?.id === updatedCustomer.id) {
      setCurrentUser(updatedCustomer);
    }
    try {
      await supabaseService.upsertCustomer(updatedCustomer);
    } catch (e) {
      console.debug('Supabase user update failed:', e);
    }
  };

  const deleteCustomer = async (userId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
    // Delete logic not added to service yet for customers, assuming upsert/isDeleted if needed or implement delete
  };

  const updateUserRole = async (userId: string, role: Customer['role']) => {
    const updated = customers.map(c => c.id === userId ? { ...c, role } : c);
    setCustomers(updated);
    const userToUpdate = updated.find(c => c.id === userId);
    if (userToUpdate) {
      try {
        await supabaseService.upsertCustomer(userToUpdate);
      } catch (e) {
        console.debug('Supabase role update failed:', e);
      }
    }
  };

  const toggleBlockUser = async (userId: string) => {
    const updated = customers.map(c => 
      c.id === userId ? { ...c, isBlocked: !c.isBlocked } : c
    );
    setCustomers(updated);
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, isBlocked: !prev.isBlocked } : null);
    }
    const userToUpdate = updated.find(c => c.id === userId);
    if (userToUpdate) {
      try {
        await supabaseService.upsertCustomer(userToUpdate);
      } catch (e) {
        console.debug('Supabase block toggle failed:', e);
      }
    }
  };

  const loginUser = async (email: string, password?: string) => {
    // 1. Attempt Supabase Auth login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: password || '',
    });

    if (authError) {
      // Fallback for pre-existing local users
      const localUser = customers.find(c => c.email === email && (!password || c.password === password));
      if (localUser) {
        if (localUser.isBlocked) throw new Error('Account blocked');
        setCurrentUser(localUser);
        return localUser;
      }
      throw authError;
    }

    // 2. Fetch the latest profile from DB to get the most recent 'role'
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (profile) {
      if (profile.is_blocked) {
        await supabase.auth.signOut();
        throw new Error('Your account has been restricted.');
      }
      
      const userObj: Customer = {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        phone: profile.phone,
        role: profile.role || 'user',
        avatar: profile.avatar_url,
        bio: profile.bio,
        createdAt: profile.created_at
      };
      
      setCurrentUser(userObj);
      // Update local state list
      setCustomers(prev => prev.map(c => c.email === email ? userObj : c));
      return userObj;
    } else if (authData.user) {
      // Create profile if success but no profile record
      const newUser: Customer = {
        id: authData.user.id,
        email: authData.user.email || email,
        fullName: authData.user.user_metadata?.fullName || 'Aura Guest',
        phone: authData.user.user_metadata?.phone || '',
        role: (email === 'info.mdriyankarim@gmail.com') ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      };
      setCustomers(prev => [...prev.filter(c => c.email !== newUser.email), newUser]);
      setCurrentUser(newUser);
      await supabaseService.upsertCustomer(newUser).catch(console.error);
      return newUser;
    }
  };

  const addLoginHistory = async (history: Omit<AdminLoginHistory, 'id'>) => {
    const newEntry = { ...history, id: Date.now().toString() };
    setLoginHistory(prev => [newEntry, ...prev]);
    try {
      await supabaseService.addLoginHistory(newEntry);
    } catch (e) {
      console.debug('Supabase login history update failed:', e);
    }
  };

  const logoutUser = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ 
      customers, 
      currentUser, 
      loginHistory,
      registerCustomer, 
      updateCustomer, 
      deleteCustomer,
      toggleBlockUser, 
      updateUserRole,
      loginUser, 
      logoutUser,
      addLoginHistory,
      syncWithSupabase
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUsers must be used within a UserProvider');
  return context;
};
