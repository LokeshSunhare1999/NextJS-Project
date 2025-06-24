import type { Metadata } from "next";
import "../../public/styles/globals.css";
import ClientBody from "./ClientBody";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { Poppins } from 'next/font/google';
import Script from 'next/script';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
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
// import "../components/sections/IdentityVerified/IdentityVerified.css"
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/herobg.webp" fetchPriority="high" />
        <link rel="preload" href="/fonts/helvetica-255/helvetica.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/helvetica-255/helvetica-Bold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/helvetica-255/helvetica-Oblique.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/helvetica-255/helvetica-BoldOblique.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        
        <link media="print" href="/styles/globals.css" as="style" onLoad="this.onload=null;this.rel='stylesheet';" />
        <link media="print" href="/styles/IdentityVerified.css" as="style" onLoad="this.onload=null;this.rel='stylesheet';" />
        <link media="print" href="/styles/JobReelContainer.css" as="style" onLoad="this.onload=null;this.rel='stylesheet';" />
        <link media="print" href="/styles/MobileScreenStyles.css" as="style" onLoad="this.onload=null;this.rel='stylesheet';" />

        <noscript>
          <link rel="stylesheet" href="/styles/globals.css" />
          <link rel="stylesheet" href="/styles/IdentityVerified.css" />
          <link rel="stylesheet" href="/styles/JobReelContainer.css" />
          <link rel="stylesheet" href="/styles/MobileScreenStyles.css" />
        </noscript>

        <Script id="google-tag-manager" strategy="lazyOnload">
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
