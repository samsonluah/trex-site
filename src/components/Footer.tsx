
import React from 'react';
import { Instagram, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12">
      <div className="brutalist-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">TREX ATHLETICS CLUB</h3>
            <p className="text-gray-400">
              Just a bunch of bros being dudes at the Oval Office
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">CONNECT</h3>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/trex_sg/" target="_blank" rel="noopener noreferrer" className="hover:text-trex-accent">
                <Instagram size={24} />
              </a>
              <a href="mailto:trex.sg.run@gmail.com" className="hover:text-trex-accent">
                <Mail size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">SUPPORT</h3>
            <p className="text-gray-400">
              For any queries, contact us at:<br />
              <a href="mailto:trex.sg.run@gmail.com" className="text-trex-white hover:text-trex-accent">
                trex.sg.run@gmail.com
              </a>
            </p>
          </div>
        </div>
        
        <div className="pt-8 border-t border-trex-white text-gray-400 flex justify-center">
          <p>© {currentYear} TREX Athletics Club</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
