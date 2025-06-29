
export interface Product {
  id: string;
  name: string;
  description: string; // Main/overview description
  price: number;
  imageSrc: string;
  imageAlt: string;
  category: string;
  dataAiHint: string; // For placeholder image search keywords
  rating?: number; // Optional: average rating 0-5
  reviewCount?: number; // Optional: number of reviews
  availability?: 'In Stock' | 'Out of Stock' | 'Pre-Order';
  features?: string[];
  howToUse?: string[] | string; // Can be an array for steps or a single string
  ingredients?: string[] | string;
  safetyInfo?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  imageSrc: string;
  imageAlt: string;
  dataAiHint: string;
  date: string; // ISO date string
  author: string;
  content: string; // Full content for the blog post page
  // category: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string; // e.g., "Happy Gardener", "Commercial Farmer"
  avatarSrc?: string; // URL for placeholder avatar
  dataAiHint?: string; // For avatar placeholder
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  phoneNumber?: string;
  shippingAddress?: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt?: string;
  lastLoginAt?: string;
}

/** Promo code and discount types **/

export interface PromoCode {
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  amount: number; // percentage (e.g. 10 for 10%) or fixed amount (e.g. 50 for ₹50)
  expiresAt?: string; // ISO date string
  isActive?: boolean;
}

export interface Discount {
  code: string;
  amount: number; // discount amount applied
  discountType: 'percentage' | 'fixed';
  description?: string;
}

export interface PromoCodeValidationResponse {
  valid: boolean;
  discount?: Discount;
  message?: string;
}

/** Order types **/

export type OrderStatus = 
  | 'pending'           // Order placed, awaiting confirmation
  | 'confirmed'         // Order confirmed by admin
  | 'processing'        // Order being prepared
  | 'shipped'           // Order shipped
  | 'delivered'         // Order delivered
  | 'cancelled'         // Order cancelled
  | 'refunded';         // Order refunded

export type PaymentStatus = 
  | 'pending'           // Payment not yet processed
  | 'paid'              // Payment completed
  | 'failed'            // Payment failed
  | 'refunded';         // Payment refunded

export interface OrderItem {
  productId: string;
  productName: string;
  productPrice: number;
  productImageSrc: string;
  quantity: number;
  subtotal: number;     // productPrice * quantity
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

export interface OrderSummary {
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
}

export interface Order {
  id: string;
  orderNumber: string;        // Human-readable order number (e.g., "ORD-2024-001")
  userId: string;
  userEmail: string;
  userName: string;
  
  // Order items
  items: OrderItem[];
  
  // Pricing
  summary: OrderSummary;
  
  // Shipping
  shippingAddress: ShippingAddress;
  
  // Status tracking
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  
  // Timestamps
  createdAt: string;          // ISO date string
  updatedAt: string;          // ISO date string
  confirmedAt?: string;       // When admin confirmed
  shippedAt?: string;         // When order was shipped
  deliveredAt?: string;       // When order was delivered
  
  // Additional info
  notes?: string;             // Customer notes
  adminNotes?: string;        // Internal admin notes
  trackingNumber?: string;    // Shipping tracking number
  estimatedDelivery?: string; // Estimated delivery date
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: ShippingAddress;
  discountCode?: string;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  adminNotes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}
