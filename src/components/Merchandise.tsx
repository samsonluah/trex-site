
import React from 'react';
import { Link } from 'react-router-dom';

const Merchandise = () => {
  const products = [
    {
      id: 1,
      name: 'TREX CLUB T-SHIRT',
      price: 'S$29.99',
      description: 'Premium black cotton t-shirt with TREX Athletics Club logo printed on the front.',
      image: '/placeholder.svg',
      slug: 'tshirt'
    },
    {
      id: 2,
      name: 'TREX STICKER PACK',
      price: 'S$6',
      description: 'Set of 3 waterproof vinyl stickers featuring the TREX Athletics Club logo and designs.',
      image: '/placeholder.svg',
      slug: 'stickers'
    }
  ];

  return (
    <section id="merchandise" className="py-20 border-b-4 border-trex-white">
      <div className="brutalist-container">
        <h2 className="brutalist-subheader mb-12">MERCHANDISE</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product) => (
            <div key={product.id} className="brutalist-card group">
              <div className="aspect-square bg-trex-white mb-4 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <h3 className="text-2xl font-black mb-2">{product.name}</h3>
              <p className="text-xl font-mono mb-4">{product.price}</p>
              <p className="text-gray-400 mb-6">{product.description}</p>
              <Link 
                to={`/product/${product.slug}`}
                className="inline-block bg-trex-accent text-trex-black font-bold py-2 px-6 uppercase hover:bg-trex-white transition-colors duration-200"
              >
                View Details
              </Link>
            </div>
          ))}
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
