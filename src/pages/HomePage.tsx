import HeroSection from '../components/landing-page/HeroSection';
import FeaturesSection from '../components/landing-page/FeaturesSection';
import HowItWorksSection from '../components/landing-page/HowItWorksSection';
import CTASection from '../components/landing-page/CTASection';
import SEO from '../components/SEO';

const HomePage = () => {
  return (
    <>
      <SEO 
        title="الرئيسية"
        description="منصة بصمة - تبادل مجتمعي لأهل غزة. انشر إعلانك وتواصل مع المجتمع."
      />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </>
  );
};

export default HomePage;