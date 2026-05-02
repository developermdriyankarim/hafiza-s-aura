import { supabase } from '../lib/supabase';
import { Product, Order, Customer, SupportMessage, Craftsman, ReceiveLog, AdminLoginHistory } from '../types';

export const supabaseService = {
  // Products
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return (data || []).map(p => ({
      id: p.id,
      name: p.name || 'Untitled Product',
      price: Number(p.price) || 0,
      description: p.description || '',
      // Fallback to a high-quality placeholder if image is NULL in Supabase
      image: p.image || 'https://images.unsplash.com/photo-1611085583191-a3b1787255fe?q=80&w=1000',
      category: p.category || 'Jewelry',
      stock: Number(p.stock) || 0,
      isFeatured: Boolean(p.is_featured),
      status: p.status || 'Published',
      artisanStory: p.artisan_story || '',
      createdAt: p.created_at
    })) as Product[];
  },
  async upsertProduct(product: Product) {
    try {
      // Prepare clean data for DB matching your schema
      const dbProduct: any = {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        description: product.description,
        image: product.image,
        stock: Number(product.stock),
        status: product.status || 'Published',
        category: product.category || 'Bangles',
        is_featured: !!(product.isFeatured),
        artisan_story: product.artisanStory || '',
        created_at: product.createdAt || new Date().toISOString()
      };

      const { data, error } = await supabase.from('products').upsert(dbProduct).select();
      
      if (error) {
        console.error('Supabase Product Upsert Error:', error);
        throw error;
      }
      return data?.[0] as Product;
    } catch (err) {
      console.error('Failed in upsertProduct:', err);
      throw err;
    }
  },
  async deleteProduct(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },

  // Orders
  async getOrders() {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(o => ({
      id: o.id,
      userId: o.user_id,
      items: o.items,
      total: o.total,
      status: o.status,
      customer: o.customer_details,
      deliveryFee: o.delivery_fee,
      createdAt: o.created_at
    })) as Order[];
  },
  async upsertOrder(order: Order) {
    try {
      // 1. Prepare data for DB (matching underscore_case schema)
      const dbOrder: any = {
        id: order.id,
        user_id: order.userId,
        items: Array.isArray(order.items) ? order.items : [],
        total: Number(order.total) || 0,
        status: order.status || 'Pending',
        customer_details: order.customer,
        delivery_fee: Number(order.deliveryFee) || 0,
        created_at: order.createdAt || new Date().toISOString()
      };

      // 2. Upsert the main order
      const { data, error } = await supabase
        .from('orders')
        .upsert(dbOrder)
        .select();
      
      if (error) {
        console.error('Supabase Order Upsert Error:', error);
        throw error;
      }

      // 3. Track in Order History
      try {
        await supabase.from('order_history').insert({
          order_id: order.id,
          status: order.status || 'Pending',
          notes: 'Order placed via website checkout'
        });
      } catch (historyErr) {
        console.warn('Order history entry failed:', historyErr);
      }

      return (data && data[0]) ? data[0] : order;
    } catch (err) {
      console.error('CRITICAL: upsertOrder failed:', err);
      throw err;
    }
  },

  // Profiles (linked to auth.users)
  async getCustomers() {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(p => ({
      id: p.id,
      email: p.email,
      fullName: p.full_name,
      role: p.role || 'user',
      avatar: p.avatar_url,
      createdAt: p.created_at
    })) as Customer[];
  },
  async upsertCustomer(customer: Customer) {
    const dbCustomer = {
      id: customer.id,
      full_name: customer.fullName,
      email: customer.email,
      role: customer.role,
      avatar_url: customer.avatar,
      created_at: customer.createdAt || new Date().toISOString()
    };
    const { data, error } = await supabase.from('profiles').upsert(dbCustomer).select().single();
    if (error) throw error;
    return data as Customer;
  },
  async updateProfile(id: string, updates: any) {
    const dbUpdates: any = {};
    if (updates.fullName) dbUpdates.full_name = updates.fullName;
    if (updates.avatar) dbUpdates.avatar_url = updates.avatar;
    if (updates.role) dbUpdates.role = updates.role;
    
    const { data, error } = await supabase.from('profiles').update(dbUpdates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  // Support Messages
  async getSupportMessages() {
    const { data, error } = await supabase.from('support_messages').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(m => ({
      ...m,
      createdAt: m.created_at
    })) as SupportMessage[];
  },
  async addSupportMessage(message: SupportMessage) {
    const dbMessage = {
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      status: message.status || 'New',
      created_at: message.createdAt || new Date().toISOString()
    };
    const { data, error } = await supabase.from('support_messages').insert(dbMessage).select().single();
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
    const { data, error } = await supabase.from('admin_login_history').select('*').order('logged_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(h => ({
      id: h.id,
      email: h.admin_email,
      time: h.logged_at,
      status: 'Success' // Simplified for now
    })) as AdminLoginHistory[];
  },
  async addLoginHistory(history: AdminLoginHistory) {
    const dbHistory = {
      admin_email: history.email,
      logged_at: history.time || new Date().toISOString(),
      user_agent: window.navigator.userAgent,
      // ip_address would require a server-side route or external API, so we skip or set placeholder
    };
    const { data, error } = await supabase.from('admin_login_history').insert(dbHistory).select().single();
    if (error) throw error;
    return data as AdminLoginHistory;
  }
};
