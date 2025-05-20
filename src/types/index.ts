
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
