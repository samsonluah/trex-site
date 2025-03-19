
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="py-4 border-b-4 border-trex-white">
      <div className="brutalist-container flex justify-between items-center">
        <div className="font-black text-2xl tracking-tighter uppercase">
          <span className="text-trex-accent">T</span>REX
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="block md:hidden z-50"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-8 font-mono uppercase">
          <a href="#about" className="hover:text-trex-accent transition-colors">About</a>
          <a href="#merchandise" className="hover:text-trex-accent transition-colors">Merchandise</a>
          <a href="#community" className="hover:text-trex-accent transition-colors">Community</a>
          <a href="#payment" className="hover:text-trex-accent transition-colors">Payment</a>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-trex-black z-40 flex flex-col items-center justify-center">
            <div className="flex flex-col gap-8 text-2xl font-mono uppercase text-center">
              <a href="#about" onClick={toggleMenu} className="hover:text-trex-accent transition-colors">About</a>
              <a href="#merchandise" onClick={toggleMenu} className="hover:text-trex-accent transition-colors">Merchandise</a>
              <a href="#community" onClick={toggleMenu} className="hover:text-trex-accent transition-colors">Community</a>
              <a href="#payment" onClick={toggleMenu} className="hover:text-trex-accent transition-colors">Payment</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
