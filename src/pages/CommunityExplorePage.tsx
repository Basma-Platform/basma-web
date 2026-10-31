import { useEffect } from 'react';
import SEO from '../components/SEO';
import {
  ExploreHero,
  ExploreMessage,
  ExplorePillars,
  ExplorePrinciples,
  ExploreHowToStart,
  ExploreCTA,
} from '../components/explore';

/**
 * Community Explore Page
 * ============================================================
 * Entry page that tells the story of Basma's three pillars:
 *   1. التبادل        (Exchange)
 *   2. صندوق بصمة     (Basma Fund)
 *   3. المجتمع        (Community posts)
 *
 * Section background rhythm:
 *   Hero / Message / Pillars  → --bg-body
 *   Principles                → --bg-white
 *   How to start              → --bg-body
 *   CTA                       → --bg-white
 * ============================================================
 */
const CommunityExplorePage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // NOTE: the old wrapper set data-theme={isDark ? 'dark' : 'light'}.
  // ThemeContext already sets the theme on <html>, so that attribute
  // was redundant (and could only ever disagree with it). Removed.
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-body)',
        minHeight: '100vh',
        transition: 'background-color 0.3s ease',
      }}
    >
      <SEO
        title="اكتشف المجتمع"
        description="تعرّف على ركائز مجتمع بصمة الثلاث: التبادل، وصندوق بصمة، والمجتمع. ثلاثة أعمدة تسند مجتمعاً متكافلاً ومترابطاً."
        keywords="بصمة, مجتمع, تكافل, تبادل خدمات, صندوق بصمة, منشورات المجتمع, غزة"
      />

      <ExploreHero />
      <ExploreMessage />
      <ExplorePillars />
      <ExplorePrinciples />
      <ExploreHowToStart />
      <ExploreCTA />
    </div>
  );
};

export default CommunityExplorePage;
