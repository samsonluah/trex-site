export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type CollectionDate = {
  id: string;
  date: string;
  formattedDate: string;
};

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
  stockQuantity?: number; // Available quantity in stock
  availableCollectionDates?: string[]; // IDs of available collection dates
  preOrderDeadline?: string; // Deadline for pre-orders (ISO string)
};

// Collection dates (would normally come from backend)
export const collectionDates: CollectionDate[] = [
  {
    id: 'april2024',
    date: '2024-04-27',
    formattedDate: 'April 27, 2024'
  },
  {
    id: 'may2024',
    date: '2024-05-25',
    formattedDate: 'May 25, 2024'
  }
];

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
    stripePriceId: 'price_1R6SfLRsScX4UO9PZVpizuTQ',
    availableCollectionDates: ['may2024'], // Only available for May collection
    preOrderDeadline: '2024-04-06T23:59:00+08:00' // Available until April 6, 2024, 23:59 SGT
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
    stripePriceId: 'price_1R6TOfRsScX4UO9PPtjyVh7D',
    stockQuantity: 30, // Limited to 30 stickers
    availableCollectionDates: ['april2024', 'may2024'] // Available for both April and May collection
  }
];

// Helper function to check if a product is available for order
export const isProductAvailable = (product: Product): boolean => {
  // Check stock quantity if it exists
  if (product.stockQuantity !== undefined && product.stockQuantity <= 0) {
    return false;
  }
  
  // Check pre-order deadline if it exists
  if (product.preOrderDeadline) {
    const now = new Date();
    const deadline = new Date(product.preOrderDeadline);
    if (now > deadline) {
      return false;
    }
  }
  
  return product.inStock;
};

// Get available collection dates for a product
export const getAvailableCollectionDates = (product: Product): CollectionDate[] => {
  if (!product.availableCollectionDates) {
    return collectionDates; // Return all collection dates if not specified
  }
  
  return collectionDates.filter(date => 
    product.availableCollectionDates?.includes(date.id)
  );
};

// New function: Get common collection dates for multiple products
export const getCommonCollectionDates = (products: Product[]): CollectionDate[] => {
  if (products.length === 0) {
    return collectionDates;
  }
  
  // Get the first product's available dates
  let commonDateIds = products[0].availableCollectionDates || 
    collectionDates.map(date => date.id);
  
  // Intersect with each other product's available dates
  for (let i = 1; i < products.length; i++) {
    const productDateIds = products[i].availableCollectionDates || 
      collectionDates.map(date => date.id);
    
    // Only keep dates that are in both arrays
    commonDateIds = commonDateIds.filter(dateId => 
      productDateIds.includes(dateId)
    );
  }
  
  // Convert back to CollectionDate objects
  return collectionDates.filter(date => 
    commonDateIds.includes(date.id)
  );
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};
