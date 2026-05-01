import { supabase } from '../lib/supabase';
import { Product, Order, Customer, SupportMessage, Craftsman, ReceiveLog, AdminLoginHistory } from '../types';

export const supabaseService = {
  // Products
  async getProducts() {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (error) throw error;
    return (data || []).map(p => ({
      ...p,
      isFeatured: p.is_featured
    })) as Product[];
  },
  async upsertProduct(product: Product) {
    try {
      const dbProduct: any = {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        stock: product.stock,
        status: product.status || 'Published',
      };
      
      // Only add is_featured if it exists or we want to try both naming conventions
      if (product.isFeatured !== undefined) {
        dbProduct.is_featured = product.isFeatured;
      }

      const { data, error } = await supabase.from('products').upsert(dbProduct).select();
      
      if (error) {
        console.error('Supabase Upsert Error Detail:', error);
        throw error;
      }
      return data?.[0] as Product;
    } catch (err) {
      console.error('Failed to upsert product:', err);
      throw err;
    }
  },
  async deleteProduct(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },

  // Orders
  async getOrders() {
    const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return data as Order[];
  },
  async upsertOrder(order: Order) {
    const { data, error } = await supabase.from('orders').upsert(order).select().single();
    if (error) throw error;
    return data as Order;
  },

  // Customers / Users
  async getCustomers() {
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(profile => ({
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      phone: profile.phone,
      role: profile.role || 'user',
      avatar: profile.avatar,
      bio: profile.bio,
      address: profile.address,
      city: profile.city,
      location: profile.location,
      createdAt: profile.created_at,
      isBlocked: profile.is_blocked,
      password: profile.password
    })) as Customer[];
  },
  async upsertCustomer(customer: Customer) {
    const dbCustomer = {
      id: customer.id,
      full_name: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      password: customer.password,
      role: customer.role,
      address: customer.address,
      city: customer.city,
      location: customer.location,
      avatar: customer.avatar,
      bio: customer.bio,
      created_at: customer.createdAt,
      is_blocked: customer.isBlocked
    };
    const { data, error } = await supabase.from('customers').upsert(dbCustomer).select().single();
    if (error) throw error;
    return data as Customer;
  },

  // Support Messages
  async getSupportMessages() {
    const { data, error } = await supabase.from('support_messages').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return data as SupportMessage[];
  },
  async addSupportMessage(message: SupportMessage) {
    const { data, error } = await supabase.from('support_messages').insert(message).select().single();
    if (error) throw error;
    return data as SupportMessage;
  },

  // Craftsmen / Moderators
  async getCraftsmen() {
    const { data, error } = await supabase.from('craftsmen').select('*').order('id', { ascending: false });
    if (error) throw error;
    return data as Craftsman[];
  },
  async upsertCraftsman(craftsman: Craftsman) {
    const { data, error } = await supabase.from('craftsmen').upsert(craftsman).select().single();
    if (error) throw error;
    return data as Craftsman;
  },

  // Receive Logs
  async getReceiveLogs() {
    const { data, error } = await supabase.from('receive_logs').select('*').order('timestamp', { ascending: false });
    if (error) throw error;
    return data as ReceiveLog[];
  },
  async addReceiveLog(log: ReceiveLog) {
    const { data, error } = await supabase.from('receive_logs').insert(log).select().single();
    if (error) throw error;
    return data as ReceiveLog;
  },

  // Admin Login History
  async getLoginHistory() {
    const { data, error } = await supabase.from('admin_login_history').select('*').order('time', { ascending: false });
    if (error) throw error;
    return data as AdminLoginHistory[];
  },
  async addLoginHistory(history: AdminLoginHistory) {
    const { data, error } = await supabase.from('admin_login_history').insert(history).select().single();
    if (error) throw error;
    return data as AdminLoginHistory;
  }
};
