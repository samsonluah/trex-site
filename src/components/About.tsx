
import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20 border-b-4 border-trex-white">
      <div className="brutalist-container">
        <h2 className="brutalist-subheader mb-12">ABOUT TREX</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-xl mb-6">
              TREX is a sub-elite team of runners, looking to push the sport of running further in Singapore by competing and engaging the community, most importantly, while having fun and enjoying the process and forging new friendships.
            </p>
            
            <p className="text-xl text-gray-400">
              Our mission is to foster a supportive environment for runners to improve, 
              connect, and contribute to the local sports culture.
            </p>
          </div>
          
          <div className="bg-trex-white text-trex-black p-8">
            <blockquote className="text-2xl font-bold italic">
              "Just a bunch of bros being dudes at the Oval Office"
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
