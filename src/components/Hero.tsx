
import React from 'react';

const Hero = () => {
  return (
    <section className="min-h-[90vh] flex flex-col justify-center items-center border-b-4 border-trex-white">
      <div className="brutalist-container text-center">
        <h1 className="brutalist-header">TREX <span className="text-trex-accent">ATHLETICS</span> CLUB</h1>
        <p className="text-xl md:text-2xl mb-8 font-mono">COMMUNITY. STRENGTH. SPEED.</p>
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
