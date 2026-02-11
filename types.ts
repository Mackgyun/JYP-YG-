export type OrderStatus = 'pending_payment' | 'paid' | 'shipping' | 'delivered';

export interface Reward {
  id: string;
  price: number;
  title: string;
  description: string;
  remaining: number;
  items: string[];
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  contactName: string;
  contactPhone: string;
  quantity: number;
  depositorName: string;
  address: string;
  status: OrderStatus;
  createdAt: number;
  productName: string;
  rewardTitle: string; // Track which reward was chosen
  totalAmount: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  creator: string;
  goalAmount: number;
  currentAmount: number;
  supporterCount: number;
  startDate: string;
  endDate: string;
  description: string;
  images: string[];
  rewards: Reward[];
  refundPolicy: string;
}