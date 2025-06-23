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
//         <link rel="preload" as="image" href="/herobg.webp" />
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
import { Poppins } from 'next/font/google';
import Script from 'next/script';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'], // Reduced font weights - only load what you need
  variable: '--font-poppins',
  preload: true, // Preload the font
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
        {/* Critical resource preloads - prioritize hero background */}
        <link rel="preload" as="image" href="/herobg.webp" fetchPriority="high" />
        
        {/* Preload only essential fonts */}
        <link 
          rel="preload" 
          href="/fonts/helvetica-255/Helvetica.ttf" 
          as="font" 
          type="font/ttf" 
          crossOrigin="anonymous" 
        />
        <link 
          rel="preload" 
          href="/fonts/helvetica-255/Helvetica-Bold.ttf" 
          as="font" 
          type="font/ttf" 
          crossOrigin="anonymous" 
        />
        
        {/* Defer non-critical font preloads */}
        <link 
          rel="prefetch" 
          href="/fonts/helvetica-255/Helvetica-Oblique.ttf" 
          as="font" 
          type="font/ttf" 
          crossOrigin="anonymous" 
        />
        <link 
          rel="prefetch" 
          href="/fonts/helvetica-255/Helvetica-BoldOblique.ttf" 
          as="font" 
          type="font/ttf" 
          crossOrigin="anonymous" 
        />
        <link 
          rel="prefetch" 
          href="/fonts/helvetica-255/helvetica-light-587ebe5a59211.ttf" 
          as="font" 
          type="font/ttf" 
          crossOrigin="anonymous" 
        />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* Critical inline CSS for immediate rendering */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold styles */
            body { margin: 0; background: #000; font-family: system-ui, -apple-system, sans-serif; }
            #hero { min-height: 100vh; background: linear-gradient(135deg, #1f2937 0%, #000 50%, #374151 100%); }
            .hero-text { color: white; text-align: center; font-weight: 700; }
          `
        }} />
        
        {/* Move GTM to end of head for better critical path */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-TTS7HWCR');`}
        </Script>
      </head>
      <body suppressHydrationWarning className={`antialiased ${poppins.variable} font-poppins`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TTS7HWCR"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <GoogleAnalytics />
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}