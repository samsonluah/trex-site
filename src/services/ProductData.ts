import { RunEvent } from './RunDateData';

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
  collectionType: 'all' | 'latest'; // Type of collection date availability
};

// Define empty collection dates array - will be populated dynamically
export let collectionDates: CollectionDate[] = [];

// This would normally come from a database or API
export const products: Product[] = [
  {
    id: 1,
    name: 'ORIGIN T-SHIRT',
    price: 29.99,
    formattedPrice: 'S$29.99',
    description: 'Lightweight cotton T-shirt in acid-washed black, with our ORIGIN logo printed on the back.',
    longDescription: 'Our signature ORIGIN T-shirt is made from lightweight cotton for maximum comfort for casual wear. The acid-washed black fabric gives it a vintage look, while the ORIGIN logo printed on the back provides a clean, minimalist design, a call back to our origins 1 year ago. Perfect for gym sessions, or just looking sick all around.\n\nNOTE: Will only be available for collection at the May community run as this is a pre-order.',
    images: ['/origin1.jpg', '/origin2.jpg', '/origin3.jpg', '/origin4.jpg', '/originsizechart.png'],
    slug: 'tshirt',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stripePriceId: 'price_1R6SfLRsScX4UO9PZVpizuTQ',
    preOrderDeadline: '2025-04-11T12:00:00+08:00', // Updated to April 11, 2025, 12 noon Singapore time
    collectionType: 'all'
  },
  {
    id: 2,
    name: 'STICKER PACK V1',
    price: 6,
    formattedPrice: 'S$6',
    description: 'Set of 3 waterproof vinyl stickers featuring the TREX Athletics Club logos and designs.',
    longDescription: 'Add some TREX logos to your water bottle, laptop, or other gear with our set of 3 high-quality vinyl stickers. These stickers are waterproof, and made to last through your toughest adventures. Perfect for personalizing your gear or sharing with friends.',
    images: ['/sticker1.jpg', '/sticker2.jpg', '/sticker3.jpg', '/sticker4.jpg', '/sticker5.jpg'],
    slug: 'stickers',
    inStock: true,
    stripePriceId: 'price_1R6TOfRsScX4UO9PPtjyVh7D',
    // Removing the stockQuantity property for sticker pack
    collectionType: 'all' // Available for all upcoming runs
  }
];

// Initialize collection dates based on upcoming runs
export const initializeCollectionDates = (upcomingRuns: RunEvent[]) => {
  // First, create the collection dates array from upcoming runs
  collectionDates = upcomingRuns.map(run => ({
    id: run.id,
    date: run.date,
    formattedDate: run.formattedDate || formatDate(run.date)
  }));
  
  // Then, update each product's available collection dates
  updateProductCollectionDates(upcomingRuns);
};

// Format date helper function (backup if formattedDate is not available)
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

// Update product collection dates based on their collection type
const updateProductCollectionDates = (upcomingRuns: RunEvent[]) => {
  if (!upcomingRuns.length) return;
  
  products.forEach(product => {
    if (product.collectionType === 'all') {
      // All collection dates are available
      product.availableCollectionDates = collectionDates.map(date => date.id);
    } else if (product.collectionType === 'latest') {
      // Only the last run (furthest date) is available
      const latestRun = [...upcomingRuns].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
      
      if (latestRun) {
        product.availableCollectionDates = [latestRun.id];
      } else {
        product.availableCollectionDates = [];
      }
    }
  });
};

// Helper function to check if a product is available for order
export const isProductAvailable = (product: Product): boolean => {
  // For sticker pack (id: 2), just check inStock status without checking stockQuantity
  if (product.id === 2) {
    return product.inStock;
  }
  
  // For other products, check stock quantity if it exists
  if (product.stockQuantity !== undefined && product.stockQuantity <= 0) {
    return false;
  }
  
  // Check pre-order deadline if it exists
  if (product.preOrderDeadline) {
    const now = new Date();
    const deadline = new Date(product.preOrderDeadline);
    
    // Debug the date comparison
    console.log('Current date:', now);
    console.log('Deadline:', deadline);
    console.log('Is now before deadline?', now < deadline);
    
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

// Get common collection dates for multiple products
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
