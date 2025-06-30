import React from 'react';
import HeroSection from '../components/home/HeroSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import CtaSection from '../components/home/CtaSection';

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <HowItWorksSection />
      <CtaSection />
    </div>
  );
};

export default HomePage;