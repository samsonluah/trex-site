
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Merchandise from '@/components/Merchandise';
import Community from '@/components/Community';
import Footer from '@/components/Footer';

const Index = () => {
  const location = useLocation();
  
  // Handle hash links when page loads
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1); // remove the # character
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <About />
      <Merchandise />
      <Community />
      <Footer />
    </div>
  );
};

export default Index;
