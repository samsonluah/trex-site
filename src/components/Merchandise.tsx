
import React from 'react';
import { Link } from 'react-router-dom';
import { products, isProductAvailable, getAvailableCollectionDates } from '../services/ProductData';
import { format } from 'date-fns';

const Merchandise = () => {
  return (
    <section id="merchandise" className="py-20 border-b-4 border-trex-white">
      <div className="brutalist-container">
        <h2 className="brutalist-subheader mb-12">MERCHANDISE</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product) => {
            const isAvailable = isProductAvailable(product);
            const hasPreOrderDeadline = !!product.preOrderDeadline;
            
            return (
              <div key={product.id} className="brutalist-card group">
                <div className="aspect-square bg-trex-white mb-4 overflow-hidden relative">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="h-full w-full object-cover object-center"
                  />
                  
                  {/* Availability badge */}
                  {!isAvailable && (
                    <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 font-bold">
                      SOLD OUT
                    </div>
                  )}
                  
                  {/* Limited stock badge */}
                  {isAvailable && product.stockQuantity && product.stockQuantity <= 10 && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-black px-3 py-1 font-bold">
                      ONLY {product.stockQuantity} LEFT
                    </div>
                  )}
                  
                  {/* Pre-order badge */}
                  {isAvailable && hasPreOrderDeadline && (
                    <div className="absolute top-0 left-0 bg-trex-accent text-black px-3 py-1 font-bold">
                      PRE-ORDER
                    </div>
                  )}
                </div>
                
                <h3 className="text-2xl font-black mb-2">{product.name}</h3>
                <p className="text-xl font-mono mb-4">{product.formattedPrice}</p>
                <p className="text-gray-400 mb-2">{product.description}</p>
                
                {/* Availability info */}
                <div className="mb-6">
                  {isAvailable ? (
                    <>
                      {hasPreOrderDeadline && (
                        <p className="text-amber-500 font-medium mb-1">
                          Pre-order closes: {format(new Date(product.preOrderDeadline!), 'MMM d, yyyy h:mm a')}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-red-500 font-medium">
                      Currently unavailable
                    </p>
                  )}
                </div>
                
                <Link 
                  to={`/product/${product.slug}`}
                  className={`inline-block font-bold py-2 px-6 uppercase transition-colors duration-200 ${
                    isAvailable 
                      ? 'bg-trex-accent text-trex-black hover:bg-trex-white' 
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={e => !isAvailable && e.preventDefault()}
                >
                  {isAvailable ? 'View Details' : 'Sold Out'}
                </Link>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 p-6 border-2 border-trex-white">
          <h3 className="text-xl uppercase font-bold mb-4">Collection Information</h3>
          <p className="text-gray-400 mb-2">
            All merchandise must be collected in person during our monthly community runs.
          </p>
          <p className="text-gray-400">
            No delivery options are available at this time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Merchandise;
