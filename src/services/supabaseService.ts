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
        price: Number(product.price),
        description: product.description,
        image: product.image,
        stock: Number(product.stock),
        status: product.status || 'Published',
        category: product.category || 'Bangles',
        featured: !!(product.isFeatured || product.featured),
        is_featured: !!(product.isFeatured || product.featured),
        "createdAt": product.createdAt || new Date().toISOString()
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
    const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return data as Order[];
  },
  async upsertOrder(order: Order, retryCount = 0) {
    try {
      // 1. Prepare clean data for DB
      const dbOrder: any = {
        id: order.id,
        "userId": order.userId,
        items: Array.isArray(order.items) ? order.items : [],
        total: Number(order.total) || 0,
        status: order.status,
        customer: order.customer,
        "deliveryFee": Number(order.deliveryFee) || 0,
        "deliveryDate": order.deliveryDate,
        "createdAt": order.createdAt || new Date().toISOString()
      };

      // Handle optional fields
      if (retryCount === 0) {
        dbOrder.phone = order.phone || order.customer?.phone || '';
      }
      
      // 2. Upsert the main order
      const { data, error } = await supabase
        .from('orders')
        .upsert(dbOrder)
        .select();
      
      if (error) {
        console.error('Supabase Order Upsert Error:', error);
        
        // Retry logic for missing 'phone' column
        if (retryCount === 0 && (error.message?.includes('column "phone"') || error.code === '42703')) {
           console.log('Retrying without phone column...');
           return this.upsertOrder(order, 1);
        }
        throw error;
      }

      // 3. Sync individual items for analytics
      if (order.items && order.items.length > 0) {
        try {
          const orderItems = order.items.map(item => ({
            order_id: order.id,
            product_id: item.id,
            product_name: item.name,
            quantity: Number(item.quantity) || 1,
            price: Number(item.price) || 0
          }));

          // Clean up old items first to avoid duplicates on update
          await supabase.from('order_items').delete().eq('order_id', order.id);
          await supabase.from('order_items').insert(orderItems);
        } catch (itemsErr) {
          console.warn('Order items sync ignored:', itemsErr);
        }
      }

      return (data && data[0]) ? data[0] : order;
    } catch (err) {
      console.error('CRITICAL: upsertOrder failed:', err);
      throw err;
    }
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
