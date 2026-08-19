import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEO = ({ 
  title, 
  description = 'منصة بصمة - تبادل مجتمعي لأهل غزة', 
  keywords = 'بصمة, تبادل, غزة, مجتمع, منصة',
  image = '/logo.png',
  url = window.location.href,
}: SEOProps) => {
  const siteTitle = `بصمة | ${title}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Favicon Links */}
      <link rel="icon" type="image/png" href="/logo.png" />
      <link rel="apple-touch-icon" href="/logo.png" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Language */}
      <html lang="ar" dir="rtl" />
    </Helmet>
  );
};

export default SEO;