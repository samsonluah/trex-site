
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
            <h3 className="text-2xl font-black mb-6">OUR VALUES</h3>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="font-black text-2xl mr-2 text-trex-accent">T.</span>
                <span className="font-bold">TEAMWORK</span>
              </li>
              <li className="flex items-start">
                <span className="font-black text-2xl mr-2 text-trex-accent">R.</span>
                <span className="font-bold">RESILIENCE</span>
              </li>
              <li className="flex items-start">
                <span className="font-black text-2xl mr-2 text-trex-accent">E.</span>
                <span className="font-bold">EXCELLENCE</span>
              </li>
              <li className="flex items-start">
                <span className="font-black text-2xl mr-2 text-trex-accent">X.</span>
                <span className="font-bold">EXPLORATION</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
