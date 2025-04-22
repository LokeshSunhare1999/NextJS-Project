import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import ConvexClerkProvider from "../providers/ConvexClerkProvider";
import "./globals.css";
import AudioProvider from "@/providers/AudioProvider";


const manrope = Manrope({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Podcastr",
  description: "Generated your Podcasts",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en">
        <AudioProvider>
          <body
            className={`${manrope.className} antialiased`}
          >
            {children}
          </body>
        </AudioProvider>
      </html>
    </ConvexClerkProvider>
  );
}
