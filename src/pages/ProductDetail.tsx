
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getProductBySlug, 
  ProductSize, 
  isProductAvailable,
  getAvailableCollectionDates,
  collectionDates
} from '@/services/ProductData';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Minus, Plus, AlertTriangle, Clock } from 'lucide-react';
import { format, formatDistance } from 'date-fns';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = slug ? getProductBySlug(slug) : undefined;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<ProductSize | ''>('');
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Check if product is available
  const isAvailable = product ? isProductAvailable(product) : false;
  
  // Calculate maximum quantity based on stock
  const maxQuantity = product?.stockQuantity || 999;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleAddToCart = () => {
    // Check if product is available
    if (!isAvailable) {
      toast.error('This product is no longer available');
      return;
    }
    
    // Check if size is required but not selected
    if (product.sizes && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    // Check if requested quantity exceeds stock
    if (product.stockQuantity !== undefined && quantity > product.stockQuantity) {
      toast.error(`Sorry, only ${product.stockQuantity} items available in stock`);
      return;
    }
    
    // All checks passed, add to cart without requiring a collection date
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      size: selectedSize || undefined,
    });
    
    toast.success(`${product.name} added to cart!`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="brutalist-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-trex-white overflow-hidden relative">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
                
                {/* Availability badges */}
                {!isAvailable && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 font-bold">
                    SOLD OUT
                  </div>
                )}
                
                {/* Pre-order badge */}
                {isAvailable && product.preOrderDeadline && (
                  <div className="absolute top-0 left-0 bg-trex-accent text-black px-3 py-1 font-bold">
                    PRE-ORDER
                  </div>
                )}
              </div>
              
              {/* Thumbnail images */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-20 w-20 border-2 flex-shrink-0 ${selectedImage === index ? 'border-trex-accent' : 'border-trex-white'}`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              <h1 className="text-3xl font-black">{product.name}</h1>
              <p className="text-2xl font-mono text-trex-accent">{product.formattedPrice}</p>
              
              {/* Availability Information */}
              {!isAvailable ? (
                <div className="bg-red-950/30 border border-red-500 p-4 flex items-start gap-3">
                  <AlertTriangle className="text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-red-400 font-medium">This product is no longer available</p>
                    {product.preOrderDeadline && (
                      <p className="text-gray-400 text-sm mt-1">
                        Pre-order deadline has passed
                      </p>
                    )}
                  </div>
                </div>
              ) : product.preOrderDeadline ? (
                <div className="bg-amber-950/30 border border-amber-500 p-4 flex items-start gap-3">
                  <Clock className="text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-amber-400 font-medium">Limited Time Pre-Order</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Order before {format(new Date(product.preOrderDeadline), 'MMM d, yyyy h:mm a')}
                    </p>
                    <p className="text-amber-500/80 text-sm mt-1">
                      {formatDistance(new Date(product.preOrderDeadline), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ) : null}
              
              {/* Stock Information */}
              {isAvailable && product.stockQuantity !== undefined && (
                <p className={`text-sm font-medium ${product.stockQuantity <= 10 ? 'text-amber-500' : 'text-gray-400'}`}>
                  {product.stockQuantity <= 10 
                    ? `Only ${product.stockQuantity} left in stock!` 
                    : `${product.stockQuantity} in stock`}
                </p>
              )}
              
              <div className="border-t-2 border-b-2 border-trex-white py-6 my-6">
                <p className="text-gray-300">{product.longDescription || product.description}</p>
              </div>
              
              {/* Size Selector */}
              {isAvailable && product.sizes && (
                <div className="space-y-2">
                  <label className="block text-sm font-bold">SIZE</label>
                  <Select value={selectedSize} onValueChange={(value) => setSelectedSize(value as ProductSize)}>
                    <SelectTrigger className="w-full bg-transparent border-trex-white text-trex-white">
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent className="bg-trex-black border-trex-white text-trex-white">
                      {product.sizes.map(size => (
                        <SelectItem key={size} value={size} className="text-trex-white focus:text-trex-white focus:bg-trex-accent/30">{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Quantity Selector */}
              {isAvailable && (
                <div className="space-y-2">
                  <label className="block text-sm font-bold">QUANTITY</label>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={decreaseQuantity}
                      className="bg-transparent border-trex-white text-trex-white hover:bg-trex-accent hover:text-trex-black"
                      disabled={!isAvailable}
                    >
                      <Minus size={16} />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={increaseQuantity}
                      className="bg-transparent border-trex-white text-trex-white hover:bg-trex-accent hover:text-trex-black"
                      disabled={!isAvailable || quantity >= maxQuantity}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className={`w-full py-6 font-bold text-lg ${
                  isAvailable 
                    ? 'bg-trex-accent text-trex-black hover:bg-trex-white' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isAvailable ? 'ADD TO CART' : 'SOLD OUT'}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
