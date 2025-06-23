// import type { Metadata } from "next";
// import "./globals.css";
// import ClientBody from "./ClientBody";
// import GoogleAnalytics from "./components/GoogleAnalytics";
// import { Poppins } from 'next/font/google';
// import Script from 'next/script';

// const poppins = Poppins({
//   subsets: ['latin'],
//   display: 'swap',
//   weight: ['300', '400', '500', '600', '700'],
//   variable: '--font-poppins',  
//   preload: true, // Preload the font
// });

// export const metadata: Metadata = {
//   title: "Saathi",
//   description: "Reel Banao, Naukari Paao",
//   icons: {
//     icon: "/Logo.svg",
//   },
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <head>
//         <link rel="preload" as="image" href="/herobg.webp" fetchPriority="high"/>
//         <link rel="preload" href="/fonts/helvetica-255/Helvetica.ttf" as="font" type="font/helvetica-255" crossOrigin="anonymous" />
//         <link rel="preload" href="/fonts/helvetica-255/Helvetica-Bold.ttf" as="font" type="font/helvetica-255" crossOrigin="anonymous" />
//         <link rel="preload" href="/fonts/helvetica-255/Helvetica-Oblique.ttf" as="font" type="font/helvetica-255" crossOrigin="anonymous" />
//         <link rel="preload" href="/fonts/helvetica-255/Helvetica-BoldOblique.ttf" as="font" type="font/helvetica-255" crossOrigin="anonymous" />
//         <link rel="preload" href="/fonts/helvetica-255/helvetica-light-587ebe5a59211.ttf" as="font" type="font/helvetica-255" crossOrigin="anonymous" />
//         <Script id="google-tag-manager" strategy="afterInteractive">
//           {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
//           new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
//           j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
//           'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
//           })(window,document,'script','dataLayer','GTM-TTS7HWCR');`}
//         </Script>
//       </head>
//       <body suppressHydrationWarning className={`antialiased ${poppins.variable} font-poppins`}>
//         <noscript>
//           <iframe
//             src="https://www.googletagmanager.com/ns.html?id=GTM-TTS7HWCR"
//             height="0"
//             width="0"
//             style={{ display: 'none', visibility: 'hidden' }}
//           />
//         </noscript>
//         <GoogleAnalytics />
//         <ClientBody>{children}</ClientBody>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { Inter } from 'next/font/google'; // Faster loading font
import Script from 'next/script';

// Use Inter instead of Poppins - faster loading, better mobile performance
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'], // Minimal weights
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

export const metadata: Metadata = {
  title: "Saathi",
  description: "Reel Banao, Naukari Paao",
  icons: {
    icon: "/Logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Remove image preload to prioritize text rendering */}
        
        {/* Preload ONLY the most critical font */}
        <link 
          rel="preload" 
          href="/fonts/helvetica-255/Helvetica-Bold.ttf" 
          as="font" 
          type="font/ttf" 
          crossOrigin="anonymous"
          media="(min-width: 768px)" // Only preload on desktop
        />
        
        {/* Critical CSS - inline the most important styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold styles for mobile */
            * { box-sizing: border-box; }
            html, body { margin: 0; padding: 0; }
            body { 
              background: #000; 
              color: #fff;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            #hero { 
              min-height: 100vh; 
              min-height: 100dvh; /* Mobile viewport fix */
              background: linear-gradient(135deg, #1f2937 0%, #000 50%, #581c87 100%); 
              display: flex;
              flex-direction: column;
              position: relative;
            }
            .hero-content {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 2rem 1rem;
              z-index: 40;
              position: relative;
            }
            .hero-title {
              font-size: clamp(2rem, 8vw, 4rem);
              font-weight: 700;
              text-align: center;
              line-height: 1.1;
              margin: 0;
              color: #fff;
            }
            .hero-subtitle {
              font-size: clamp(1.125rem, 4vw, 1.5rem);
              color: #d1d5db;
              text-align: center;
              margin-top: 1rem;
              opacity: 0.9;
            }
            /* Prevent layout shift */
            img { max-width: 100%; height: auto; }
          `
        }} />
        
        {/* Defer non-critical scripts */}
        <Script 
          id="google-tag-manager" 
          strategy="lazyOnload" // Changed from afterInteractive
          src="https://www.googletagmanager.com/gtm.js?id=GTM-TTS7HWCR"
        />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} font-inter`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TTS7HWCR"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        {/* Defer Google Analytics */}
        <Script strategy="lazyOnload">
          <GoogleAnalytics />
        </Script>
        
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}