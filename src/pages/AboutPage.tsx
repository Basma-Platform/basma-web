import AboutHero from '../components/about-us/AboutHero';
import MissionVisionValues from '../components/about-us/MissionVisionValues';
import PlatformStory from '../components/about-us/PlatformStory';
import Statistics from '../components/about-us/Statistics';
import AboutCTA from '../components/about-us/AboutCTA';
import SEO from '../components/SEO';

const AboutPage = () => {
  return (
    <>
      <SEO 
        title="من نحن"
        description="تعرف على منصة بصمة، رسالتها، رؤيتها، وقيمها. منصة تبادل مجتمعية لأهل غزة."
      />
      <AboutHero />
      <MissionVisionValues />
      <PlatformStory />
      <Statistics />
      <AboutCTA />
    </>
  );
};

export default AboutPage;