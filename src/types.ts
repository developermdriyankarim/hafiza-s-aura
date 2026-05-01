export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  isFeatured?: boolean;
  stock: number;
  status?: 'Published' | 'Draft';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId?: string;
  customer: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    phone: string;
    location: 'Inside Dhaka' | 'Outside Dhaka';
  };
  items: CartItem[];
  total: number;
  deliveryFee: number;
  status: 'Pending' | 'Approved' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  deliveryDate?: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role?: 'user' | 'admin' | 'superadmin';
  address?: string;
  city?: string;
  location?: 'Inside Dhaka' | 'Outside Dhaka';
  avatar?: string;
  bio?: string;
  createdAt: string;
  isBlocked?: boolean;
}

export interface AdminLoginHistory {
  id: string;
  email: string;
  time: string;
  status: 'Success' | 'Failed' | 'Forget Password Attempt';
}

export interface SupportMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'contact' | 'shipping' | 'return' | 'forget-password';
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export interface Craftsman {
  id: string;
  name: string;
  email?: string;
  password?: string;
  specialty: string;
  experience: string;
  avatar?: string;
  status: 'Active' | 'On Break' | 'Retired';
}

export interface ReceiveLog {
  id: string;
  productId: string;
  productName: string;
  moderatorEmail: string;
  moderatorName: string;
  units: number;
  timestamp: string;
}
