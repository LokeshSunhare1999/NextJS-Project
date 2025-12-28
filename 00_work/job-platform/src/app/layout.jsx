import ReactQueryProvider from "@/providers/QueryProvider";
import "../styles/globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Poppins } from "next/font/google";
import AntdConfigProvider from "@/providers/ConfigProvider";
import { EmployerProvider } from "@/providers/EmployerProvider";
import SnackbarWrapper from "@/components/Snackbar";
import ModalProvider from "@/providers/ModalProvider";
import { LoadingProvider } from "@/providers/LoadingProvider";
import { Partytown } from "@qwik.dev/partytown/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Saathi Employers",
  description: "Hire Skilled & Verified Blue-Collar Workforce",
  generator: "Next.js",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content={metadata.description} />
        <meta name="generator" content={metadata.generator} />
        <link rel="manifest" href={metadata.manifest} />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <Partytown debug={true} forward={["dataLayer.push"]} />
        <script
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-TTS7HWCR');
    `,
          }}
        />
      </head>
      <body className={poppins.className}>
        <LoadingProvider>
          <ReactQueryProvider>
            <EmployerProvider>
              <AntdConfigProvider
                themes={{ fontFamily: poppins.style.fontFamily }}
              >
                <SnackbarWrapper
                  anchorOrigin={{ horizontal: "center", vertical: "top" }}
                >
                  <AntdRegistry>
                    <ModalProvider>{children}</ModalProvider>
                  </AntdRegistry>
                </SnackbarWrapper>
              </AntdConfigProvider>
            </EmployerProvider>
          </ReactQueryProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
