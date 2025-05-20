
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  category: string; 
  dataAiHint: string; // For placeholder image search keywords
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
