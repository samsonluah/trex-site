
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="brutalist-container">
          <h1 className="brutalist-header mb-12">About TREX</h1>
          
          <div className="mb-12">
            <h2 className="text-3xl font-black mb-6">We Run the Mission.</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <p className="text-xl mb-6">
                  TREX is a sub-elite running team on a mission to elevate the sport in Singapore. We train with intention, race with purpose, and move with the belief that running is more than a solo pursuit — it's a shared journey.
                </p>
                
                <p className="text-xl mb-6">
                  From the track to the streets, we show up to compete, connect, and create something bigger than ourselves. Whether we're chasing PBs or hosting community runs, TREX is about pushing limits, enjoying the process, and building a crew that lasts beyond the miles.
                </p>
                
                <p className="text-xl mb-6">
                  Our apparel reflects that same mission — performance pieces and everyday wear built for athletes who carry that fire wherever they go. Designed by runners, for runners, every drop tells a story of grit, movement, and team spirit.
                </p>
              </div>
              
              <div className="space-y-8">
                <img 
                  src="/lovable-uploads/c4089b8f-7805-49f7-85a9-556831c13a4c.png" 
                  alt="TREX Team at night track event"
                  className="w-full border-4 border-trex-white hover:border-trex-accent transition-colors duration-200"
                />
                
                <img 
                  src="/lovable-uploads/f387e286-8178-447c-8706-7e14f503a7c1.png" 
                  alt="TREX Team at daytime running event"
                  className="w-full border-4 border-trex-white hover:border-trex-accent transition-colors duration-200"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <div className="brutalist-card flex flex-col items-center text-center p-8">
              <div className="text-5xl font-bold mb-3">Training</div>
              <p className="text-lg">Regular track sessions and group runs to elevate our performance together</p>
            </div>
            
            <div className="brutalist-card flex flex-col items-center text-center p-8">
              <div className="text-5xl font-bold mb-3">Racing</div>
              <p className="text-lg">Representing TREX at local and international competitions</p>
            </div>
            
            <div className="brutalist-card flex flex-col items-center text-center p-8">
              <div className="text-5xl font-bold mb-3">Community</div>
              <p className="text-lg">Building connections through running and shared experiences</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
