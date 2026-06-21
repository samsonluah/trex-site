export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  price: number;
  stripe_price_id?: string;
  images: string[];
  category: "apparel" | "accessories";
  sizes?: string[];
  in_stock: boolean;
  pre_order: boolean;
  visible: boolean;
  stock_quantity?: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: CartItem[];
  total_amount: number;
  status: "pending" | "paid" | "fulfilled" | "cancelled";
  stripe_session_id?: string;
  shipping_name?: string | null;
  shipping_address?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  storage_path: string;
  caption?: string;
  sort_order: number;
  created_at: string;
}
