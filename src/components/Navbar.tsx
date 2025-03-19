
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import CartIcon from './CartIcon';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="py-4 border-b-4 border-trex-white">
      <div className="brutalist-container flex justify-between items-center">
        <Link to="/" className="font-black text-2xl tracking-tighter uppercase">
          <span className="text-trex-accent">T</span>REX
        </Link>
        
        {/* Mobile menu button */}
        <div className="flex items-center gap-4 md:gap-8">
          <CartIcon />
          
          <button 
            className="block md:hidden z-50"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-8 font-mono uppercase items-center">
          <Link to="/#about" className="hover:text-trex-accent transition-colors">About</Link>
          <Link to="/#merchandise" className="hover:text-trex-accent transition-colors">Merchandise</Link>
          <Link to="/#community" className="hover:text-trex-accent transition-colors">Community</Link>
          <CartIcon />
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-trex-black z-40 flex flex-col items-center justify-center">
            <div className="flex flex-col gap-8 text-2xl font-mono uppercase text-center">
              <Link to="/#about" onClick={toggleMenu} className="hover:text-trex-accent transition-colors">About</Link>
              <Link to="/#merchandise" onClick={toggleMenu} className="hover:text-trex-accent transition-colors">Merchandise</Link>
              <Link to="/#community" onClick={toggleMenu} className="hover:text-trex-accent transition-colors">Community</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
