
import React from 'react';
import { CalendarDays, MapPin } from 'lucide-react';

const Community = () => {
  const nextRunDate = "June 24, 2023";
  const nextRunLocation = "East Coast Park, Area C, Singapore";
  const telegramLink = "https://t.me/+aV4MUnPs1zxhYTE1";

  return (
    <section id="community" className="py-20 border-b-4 border-trex-white">
      <div className="brutalist-container">
        <h2 className="brutalist-subheader mb-12">COMMUNITY RUNS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="brutalist-bordered">
            <h3 className="text-2xl font-black mb-6">NEXT RUN</h3>
            
            <div className="flex items-center mb-4 text-xl">
              <CalendarDays className="mr-4 text-trex-accent" size={24} />
              <span>{nextRunDate}</span>
            </div>
            
            <div className="flex items-center mb-6 text-xl">
              <MapPin className="mr-4 text-trex-accent" size={24} />
              <span>{nextRunLocation}</span>
            </div>
            
            <p className="text-gray-400 mb-8">
              Join us for our monthly community run! All paces welcome. Merchandise ordered online can be collected at this event.
            </p>
            
            <a 
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-trex-accent text-trex-black font-bold py-2 px-6 uppercase hover:bg-trex-white transition-colors duration-200"
            >
              RSVP
            </a>
          </div>
          
          <div className="bg-trex-accent text-trex-black p-8">
            <h3 className="text-2xl font-black mb-6">WHY JOIN OUR RUNS?</h3>
            
            <ul className="space-y-4 text-lg">
              <li className="flex items-start">
                <span className="font-black text-2xl mr-2">01.</span>
                <span>Connect with like-minded athletes</span>
              </li>
              <li className="flex items-start">
                <span className="font-black text-2xl mr-2">02.</span>
                <span>Improve your running in a supportive group</span>
              </li>
              <li className="flex items-start">
                <span className="font-black text-2xl mr-2">03.</span>
                <span>Collect your TREX merchandise</span>
              </li>
              <li className="flex items-start">
                <span className="font-black text-2xl mr-2">04.</span>
                <span>Free post-run refreshments</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
