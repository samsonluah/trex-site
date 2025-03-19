
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
};

// This would normally come from a database or API
export const products: Product[] = [
  {
    id: 1,
    name: 'TREX CLUB T-SHIRT',
    price: 29.99,
    formattedPrice: 'S$29.99',
    description: 'Premium black cotton t-shirt with TREX Athletics Club logo printed on the front.',
    longDescription: 'Our signature TREX Athletics Club t-shirt is made from 100% premium cotton for maximum comfort during your workouts or casual wear. The minimalist design features our iconic logo printed on the front with high-quality screen printing that won\'t fade after washing. This t-shirt is perfect for community runs, gym sessions, or showing your TREX pride around town.',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    slug: 'tshirt',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true
  },
  {
    id: 2,
    name: 'TREX STICKER PACK',
    price: 6,
    formattedPrice: 'S$6',
    description: 'Set of 3 waterproof vinyl stickers featuring the TREX Athletics Club logo and designs.',
    longDescription: 'Add some TREX style to your water bottle, laptop, or gear with our set of 3 high-quality vinyl stickers. Each sticker features a different TREX Athletics Club design, including our iconic logo. These stickers are waterproof, UV-resistant, and made to last through your toughest adventures. Perfect for personalizing your gear or sharing with friends.',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    slug: 'stickers',
    inStock: true
  }
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};
