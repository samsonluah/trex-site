
import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20 border-b-4 border-trex-white">
      <div className="brutalist-container">
        <h2 className="brutalist-subheader mb-12 text-left">ABOUT TREX</h2>
        
        <div className="bg-trex-white text-trex-black p-6 mb-8 max-w-2xl mx-auto">
          <blockquote className="text-xl font-bold italic">
            "Just a bunch of bros being dudes at the Oval Office"
          </blockquote>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <p className="text-xl">
            TREX is a sub-elite team of runners, looking to push the sport of running further in Singapore by competing and engaging the community, most importantly, while having fun and enjoying the process and forging new friendships.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
