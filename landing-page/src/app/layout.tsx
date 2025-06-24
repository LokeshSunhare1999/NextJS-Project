import type { Metadata } from "next";
import "../../public/styles/globals.css";
import ClientBody from "./ClientBody";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { Poppins } from 'next/font/google';
import Script from 'next/script';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600'],
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
        <link rel="preload" href="/fonts/helvetica-255/helvetica.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/helvetica-255/helvetica-Bold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/helvetica-255/helvetica-Oblique.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/helvetica-255/helvetica-BoldOblique.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />

        {/* <link rel="preload" href="/styles/globals.css" as="style" />
        <link rel="preload" href="/styles/IdentityVerified.css" as="style"  />
        <link rel="preload" href="/styles/JobReelContainer.css" as="style" />
        <link rel="preload" href="/styles/MobileScreenStyles.css" as="style" /> */}

        {/* <noscript>
          <link rel="stylesheet" href="/styles/globals.css" />
          <link rel="stylesheet" href="/styles/IdentityVerified.css" />
          <link rel="stylesheet" href="/styles/JobReelContainer.css" />
          <link rel="stylesheet" href="/styles/MobileScreenStyles.css" />
        </noscript> */}
        <Script
          id="css-loader"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              // Function to load CSS asynchronously
              function loadCSS(href, before, media) {
                var doc = window.document;
                var ss = doc.createElement("link");
                var ref;
                if (before) {
                  ref = before;
                } else {
                  var refs = (doc.body || doc.getElementsByTagName("head")[0]).childNodes;
                  ref = refs[refs.length - 1];
                }
                var sheets = doc.styleSheets;
                ss.rel = "stylesheet";
                ss.href = href;
                ss.media = "only x";
                function ready(cb) {
                  if (doc.body) {
                    return cb();
                  }
                  setTimeout(function() {
                    ready(cb);
                  });
                }
                ready(function() {
                  ref.parentNode.insertBefore(ss, (before ? ref : ref.nextSibling));
                });
                var onloadcssdefined = function(cb) {
                  var resolvedHref = ss.href;
                  var i = sheets.length;
                  while (i--) {
                    if (sheets[i].href === resolvedHref) {
                      return cb();
                    }
                  }
                  setTimeout(function() {
                    onloadcssdefined(cb);
                  });
                };
                function loadCB() {
                  if (ss.addEventListener) {
                    ss.removeEventListener("load", loadCB);
                  }
                  ss.media = media || "all";
                }
                if (ss.addEventListener) {
                  ss.addEventListener("load", loadCB);
                }
                ss.onloadcssdefined = onloadcssdefined;
                onloadcssdefined(loadCB);
                return ss;
              }

              // Load non-critical CSS after page load
              window.addEventListener('load', function() {
                // Only load if not already loaded via preload
                if (!document.querySelector('link[href="/styles/IdentityVerified.css"][rel="stylesheet"]')) {
                  loadCSS('/styles/IdentityVerified.css');
                }
                if (!document.querySelector('link[href="/styles/JobReelContainer.css"][rel="stylesheet"]')) {
                  loadCSS('/styles/JobReelContainer.css');
                }
                if (!document.querySelector('link[href="/styles/MobileScreenStyles.css"][rel="stylesheet"]')) {
                  loadCSS('/styles/MobileScreenStyles.css');
                }
              });
            `
          }}
        />
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
