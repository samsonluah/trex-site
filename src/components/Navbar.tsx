
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
        <Link to="/" className="font-black tracking-tighter uppercase">
          <img 
            src="/lovable-uploads/88688eda-b86c-498c-9ba4-bb6b2cca4f0f.png" 
            alt="TREX Logo" 
            className="h-10"
          />
        </Link>
        
        {/* Navigation items and cart for desktop */}
        <div className="hidden md:flex items-center gap-8 font-mono uppercase">
          <Link to="/#about" className="hover:text-trex-accent transition-colors">About</Link>
          <Link to="/#merchandise" className="hover:text-trex-accent transition-colors">Merchandise</Link>
          <Link to="/#community" className="hover:text-trex-accent transition-colors">Community</Link>
          <CartIcon />
        </div>
        
        {/* Mobile menu button and cart */}
        <div className="flex md:hidden items-center gap-4">
          <CartIcon />
          <button 
            className="z-50"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
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
