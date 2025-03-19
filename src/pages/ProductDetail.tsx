
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductBySlug, ProductSize } from '@/services/ProductData';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Minus, Plus } from 'lucide-react';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = slug ? getProductBySlug(slug) : undefined;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<ProductSize | ''>('');
  const [selectedImage, setSelectedImage] = useState(0);
  
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
    setQuantity(quantity + 1);
  };
  
  const handleAddToCart = () => {
    // Check if size is required but not selected
    if (product.sizes && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
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
              <div className="aspect-square bg-trex-white overflow-hidden">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              
              {/* Thumbnail images */}
              {product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-20 w-20 border-2 ${selectedImage === index ? 'border-trex-accent' : 'border-trex-white'}`}
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
              
              <div className="border-t-2 border-b-2 border-trex-white py-6 my-6">
                <p className="text-gray-300">{product.longDescription || product.description}</p>
              </div>
              
              {/* Size Selector */}
              {product.sizes && (
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
              <div className="space-y-2">
                <label className="block text-sm font-bold">QUANTITY</label>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={decreaseQuantity}
                    className="bg-transparent border-trex-white text-trex-white hover:bg-trex-accent hover:text-trex-black"
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={increaseQuantity}
                    className="bg-transparent border-trex-white text-trex-white hover:bg-trex-accent hover:text-trex-black"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
              
              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                className="w-full py-6 bg-trex-accent text-trex-black hover:bg-trex-white font-bold text-lg"
              >
                ADD TO CART
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
