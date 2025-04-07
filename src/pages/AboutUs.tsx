
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from '@/components/ui/carousel';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="brutalist-container">
          <h1 className="brutalist-header mb-12">TREX Athletics Club</h1>
          
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
              
              <div>
                <Carousel className="w-full">
                  <CarouselContent>
                    <CarouselItem>
                      <img 
                        src="/lovable-uploads/c4089b8f-7805-49f7-85a9-556831c13a4c.png" 
                        alt="TREX Team at night track event"
                        className="w-full h-auto border-4 border-trex-white hover:border-trex-accent transition-colors duration-200"
                      />
                    </CarouselItem>
                    <CarouselItem>
                      <img 
                        src="/lovable-uploads/f387e286-8178-447c-8706-7e14f503a7c1.png" 
                        alt="TREX Team at daytime running event"
                        className="w-full h-auto border-4 border-trex-white hover:border-trex-accent transition-colors duration-200"
                      />
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
