
import React from 'react';

const Payment = () => {
  return (
    <section id="payment" className="py-20 border-b-4 border-trex-white">
      <div className="brutalist-container">
        <h2 className="brutalist-subheader mb-12">PAYMENT INFO</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="brutalist-bordered">
            <h3 className="text-2xl font-black mb-6">HOW TO PAY</h3>
            
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 bg-white">
                {/* Use a placeholder QR code with styling */}
                <div className="w-60 h-60 bg-white p-4 flex items-center justify-center">
                  <div className="w-52 h-52 border-8 border-black relative">
                    <div className="absolute top-0 left-0 w-12 h-12 border-r-8 border-b-8 border-black bg-white"></div>
                    <div className="absolute top-0 right-0 w-12 h-12 border-l-8 border-b-8 border-black bg-white"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-r-8 border-t-8 border-black bg-white"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-l-8 border-t-8 border-black bg-white"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs font-mono text-center">
                        PayLah QR Code<br />
                        (Scan with your banking app)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-400 mb-4">
              We accept payments via Singapore's QR payment services:
            </p>
            
            <ul className="space-y-2 mb-8">
              <li className="font-mono">→ PayNow</li>
              <li className="font-mono">→ PayLah!</li>
              <li className="font-mono">→ NETS QR</li>
            </ul>
            
            <p className="text-gray-400">
              After making your payment, please take a screenshot of your payment confirmation 
              and send it to our WhatsApp number or email for verification.
            </p>
          </div>
          
          <div className="brutalist-bordered">
            <h3 className="text-2xl font-black mb-6">CONTACT INFO</h3>
            
            <p className="font-mono text-lg mb-2">WhatsApp: +65 XXXX XXXX</p>
            <p className="font-mono text-lg mb-6">Email: info@trexathletics.club</p>
            
            <p className="text-gray-400 mb-8">
              Please include the following information in your message:
            </p>
            
            <ul className="space-y-2 text-gray-400">
              <li>1. Your full name</li>
              <li>2. Item(s) purchased</li>
              <li>3. Date of community run for collection</li>
              <li>4. Payment screenshot</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
