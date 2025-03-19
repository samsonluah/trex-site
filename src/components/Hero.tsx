
import React from 'react';

const Hero = () => {
  return (
    <section className="min-h-[90vh] flex flex-col justify-center items-center border-b-4 border-trex-white relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/running-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay to ensure text remains visible against the video */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>
      
      {/* Content positioned above the video */}
      <div className="brutalist-container text-center relative z-10">
        <h1 className="brutalist-header">TREX <span className="text-trex-accent">ATHLETICS</span> CLUB</h1>
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-12">
          <a href="#merchandise" className="brutalist-button">
            SHOP MERCH
          </a>
          <a href="#community" className="border-4 border-trex-white py-3 px-8 text-xl uppercase font-bold hover:border-trex-accent hover:text-trex-accent transition-colors duration-200">
            JOIN RUNS
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
