
export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type Product = {
  id: number;
  name: string;
  price: number;
  formattedPrice: string;
  description: string;
  longDescription?: string;
  images: string[];
  slug: string;
  sizes?: ProductSize[];
  inStock: boolean;
  stripePriceId?: string; // Stripe price ID
};

// This would normally come from a database or API
export const products: Product[] = [
  {
    id: 1,
    name: 'ORIGIN T-SHIRT',
    price: 29.99,
    formattedPrice: 'S$29.99',
    description: 'Lightweight cotton T-shirt in acid-washed black, with our ORIGIN logo printed on the back. NOTE: The pictured sample is missing the logo on the front, which is shown on Image 5.',
    longDescription: 'Our signature ORIGIN T-shirt is made from lightweight cotton for maximum comfort for casual wear. The acid-washed black fabric gives it a vintage look, while the ORIGIN logo printed on the back provides a clean, minimalist design, a call back to our origins 1 year ago. Perfect for gym sessions, or just looking sick all around. NOTE: The pictured sample is missing the logo on the front, which is shown on Image 5.',
    images: ['/DSC09579.jpg','/DSC09583.jpg', '/IMG_3397.jpg', '/IMG_3400.JPG', '/FRONT_LOGO.png'],
    slug: 'tshirt',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stripePriceId: 'price_1R6SfLRsScX4UO9PZVpizuTQ' // Replace with your actual Stripe price ID
  },
  {
    id: 2,
    name: 'TREX STICKER PACK',
    price: 6,
    formattedPrice: 'S$6',
    description: 'Set of 3 waterproof vinyl stickers featuring the TREX Athletics Club logos and designs.',
    longDescription: 'Add some TREX logos to your water bottle, laptop, or other gear with our set of 3 high-quality vinyl stickers. These stickers are waterproof, and made to last through your toughest adventures. Perfect for personalizing your gear or sharing with friends.',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    slug: 'stickers',
    inStock: true,
    stripePriceId: 'price_1R6TOfRsScX4UO9PPtjyVh7D' // Replace with your actual Stripe price ID
  }
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};
