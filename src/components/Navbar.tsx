
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import CartIcon from './CartIcon';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    // Close the mobile menu if it's open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    
    // Check if we're on the home page
    if (isHomePage) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // For links that should navigate and scroll
  const NavigationLink = ({ to, sectionId, children }: { to: string, sectionId: string, children: React.ReactNode }) => {
    if (isHomePage && to.startsWith('#')) {
      return (
        <button 
          onClick={() => scrollToSection(sectionId)} 
          className="text-left hover:text-trex-accent transition-colors"
        >
          {children}
        </button>
      );
    } else {
      return (
        <Link to={to.startsWith('#') ? `/${to}` : to} className="hover:text-trex-accent transition-colors">
          {children}
        </Link>
      );
    }
  };

  return (
    <nav className="py-4 border-b-4 border-trex-white">
      <div className="brutalist-container flex justify-between items-center">
        <Link to="/" className="font-black tracking-tighter uppercase">
          <img 
            src="/lovable-uploads/b3f41135-db32-45ec-a627-13159b100ac3.png" 
            alt="TREX Logo" 
            className="h-20 md:h-24 object-contain" 
          />
        </Link>
        
        {/* Navigation items and cart for desktop */}
        <div className="hidden md:flex items-center gap-8 font-mono uppercase">
          <NavigationLink to="/about-us" sectionId="">About Us</NavigationLink>
          <NavigationLink to="#merchandise" sectionId="merchandise">MERCHANDISE</NavigationLink>
          <NavigationLink to="/community-runs" sectionId="">Community</NavigationLink>
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
              <NavigationLink to="/about-us" sectionId="">About Us</NavigationLink>
              <NavigationLink to="#merchandise" sectionId="merchandise">MERCHANDISE</NavigationLink>
              <NavigationLink to="/community-runs" sectionId="">Community</NavigationLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
