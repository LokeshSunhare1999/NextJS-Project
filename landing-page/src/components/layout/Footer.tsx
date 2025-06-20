// Add this as the first line in src/components/layout/Footer.tsx
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import ContactModal from './ContactModal';
import TermsModal from './TermsModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import { SOCIAL_LINKS } from '@/constants';

export default function Footer() {
  const [isContactOpen, setContactOpen] = useState(false);
  const [isTermsOpen, setTermsOpen] = useState(false);
  const [isPrivacyOpen, setPrivacyOpen] = useState(false);

  return (
    <footer className="relative bg-[#070707] pt-16 pb-6 border-t border-[#19181f] before:content-[''] before:absolute before:inset-0 before:bg-[url('/footer_bg.webp')] before:bg-contain before:bg-no-repeat before:bg-center before:opacity-20 before:z-0">
      <div className="container flex flex-col items-center relative z-0">
        {/* Heading */}
        

        {/* Social Cards */}
        <div className="w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {SOCIAL_LINKS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-between bg-[#151922] bg-opacity-30 rounded-2xl p-3 sm:p-6 min-h-[70px] sm:min-h-[140px] border border-[#19181f] shadow-sm hover:shadow-lg transition group"
            >
              <div className="mb-2 sm:mb-4">
                <Image src={item.icon} alt={item.name} width={25} height={25} className="sm:w-[50px] sm:h-[50px]" loading="lazy"/>
              </div>
              <div>
                <span className="text-base sm:text-xl md:text-2xl font-semibold bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent group-hover:underline leading-tight">
                  {item.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Gradient Border */}
        <div className="w-full h-fit bg-[#19181f] rounded-full " />

        {/* Bottom Bar */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <a
              href="/"
              onClick={e => {
                e.preventDefault();
                window.__disableJobReelsFullScreen = true;
                window.__disableIdentityVerifiedFullScreen = true;
                window.scrollTo({ top: 0, behavior: "smooth" });
                setTimeout(() => {
                  window.__disableJobReelsFullScreen = false;
                  window.__disableIdentityVerifiedFullScreen = false;
                }, 1000);
              }}
            >
              <Image src="/assets/home/Logo.svg" alt="Saathi Logo" width={100} height={28} priority />
            </a>
          </div>

          {/* Center Links */}
          <div className="flex gap-6 text-gray-400 text-base font-medium">
            <button onClick={() => setContactOpen(true)} className="hover:text-[#363CD2] transition bg-transparent border-none cursor-pointer p-0 m-0">Contact Us</button>
            <button onClick={() => setPrivacyOpen(true)} className="hover:text-[#363CD2] transition bg-transparent border-none cursor-pointer p-0 m-0">Privacy Policy</button>
            <button onClick={() => setTermsOpen(true)} className="hover:text-[#363CD2] transition bg-transparent border-none cursor-pointer p-0 m-0">Terms</button>
          </div>

          {/* Copyright */}
          <div className="text-gray-400 text-base font-medium">
            2024©SaathiWorld App
          </div>
        </div>
      </div>
      {isContactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
      {isTermsOpen && <TermsModal onClose={() => setTermsOpen(false)} />}
      {isPrivacyOpen && <PrivacyPolicyModal onClose={() => setPrivacyOpen(false)} />}
    </footer>
  );
}
