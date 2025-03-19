
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Merchandise from '@/components/Merchandise';
import Community from '@/components/Community';
import Footer from '@/components/Footer';

const Index = () => {
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
