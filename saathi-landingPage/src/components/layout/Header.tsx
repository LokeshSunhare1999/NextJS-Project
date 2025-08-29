"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface HeaderProps {
  // Remove scrolled and minimized props
}

interface NavLink {
  href: string;
  text: string;
}

// Add global flag type for disabling JobReels fullpage mode
declare global {
  interface Window {
    __disableJobReelsFullScreen?: boolean;
    __disableIdentityVerifiedFullScreen?: boolean;
  }
}

const Header: React.FC<HeaderProps> = (): JSX.Element => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const handleHome = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    const anchor = window.location.hash.slice(1);
    console.log(anchor);
    if (anchor) {
      const anchorEl = document.getElementById(anchor);
      if (anchorEl) {
        anchorEl.scrollIntoView();
      }
    }
  };

  const navLinks: NavLink[] = [
    // { href: "#", text: "About Us" },
  ];

  const menuOptions: NavLink[] = [
    { href: "#testimonials", text: "Testimonials" },
    { href: "#jobreels", text: "JobReels" },
    { href: "#jobtrain", text: "JobTrain" },
    { href: "#trueid", text: "TrueID" },
    { href: "#ecosystem", text: "Ecosystem" },
    { href: "#impact", text: "Impact" },
    { href: "#media", text: "Media" },
    { href: "/business", text: "Business" },
    { href: "https://hire.saathi.in", text: "Sign In / Sign Up" },
  ];

  const handleBusinessClick = () => {
    router.push('/business');
  };

  return (
    <motion.div
      className="flex px-4 md:px-20 items-center justify-between top-0 z-50 w-full transition-colors duration-300"
      initial={false}
      animate={{
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem',
        backgroundColor: 'transparent',
        backdropFilter: 'none',
        boxShadow: 'none',
      }}
    >
      <div>
        <a
          href="/"
          onClick={e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            setIsMenuOpen(false);
          }}
        >
          <Image
            src="/assets/home/Logo.svg"
            alt="saathi-logo"
            width={130}
            height={24}
            priority // use priority only if this is above the fold
          />
        </a>
      </div>

      {/* Desktop Navigation - Hidden when burger menu is used on all screens */}
      <div className="hidden md:flex justify-end items-center gap-3">
        {!isMenuOpen && navLinks.map((link, index) => (
          <Link
            key={index}
            className="font-poppins no-underline text-base font-semibold leading-6 text-white"
            href={link.href}
          >
            {link.text}
          </Link>
        ))}

        {/* Register Button - Desktop */}
        {!isMenuOpen && (
          <button
            onClick={handleBusinessClick}
            className="flex items-center justify-center bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] text-black font-poppins text-xl font-semibold px-7 py-2 hover:from-[#FF9A01] hover:via-[#FFD955] hover:to-[#FFC01D] transition-colors rounded-[8px]"
          >
            <span>Register</span>
          </button>
        )}

        {/* Desktop Burger Menu */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="focus:outline-none text-white"
          aria-label="Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Burger Menu */}
      <div className="md:hidden flex items-center gap-3">
        <button
          onClick={handleBusinessClick}
          className="flex items-center justify-center bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] text-black font-poppins text-base font-semibold px-4 py-1.5 hover:from-[#FF9A01] hover:via-[#FFD955] hover:to-[#FFC01D] transition-colors rounded-[8px]"
        >
          <span>Register</span>
        </button>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 focus:outline-none text-white"
          aria-label="Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 right-0 w-wrap h-screen bg-white/30 backdrop-blur-md z-50 flex flex-col items-start justify-start"
          >
            {/* Menu content with vertical layout */}
            <div className="flex flex-col items-start px-3 md:px-16 pt-5 md:pt-10 pb-10">

              {/* 1. Logo at the top */}
              <div className="pb-10 flex flex-row items-center justify-center  gap-5">
                <a
                  href="/"
                  onClick={e => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setIsMenuOpen(false);
                  }}
                >
                  <Image
                    src="/assets/home/Logo.svg"
                    alt="saathi-logo"
                    width={100}
                    height={24}
                  />
                </a>

                {/* Close button */}
                <div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-3 focus:outline-none text-white"
                    aria-label="Close Menu"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>


              {/* 2. Menu Options in 2 rows for desktop, stacked for mobile */}
              <div className="w-full h-full">
                {/* Mobile view - all options stacked */}
                <div className="md:hidden flex flex-col items-start gap-7">
                  {/* Register Button for Mobile View - Moved above menu options */}
                  <button
                    onClick={() => {
                      handleBusinessClick();
                      setIsMenuOpen(false);
                    }}
                    className="ml-3 mb-3 flex items-center justify-center bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] text-black font-poppins text-xl font-semibold px-7 py-2 hover:from-[#FF9A01] hover:via-[#FFD955] hover:to-[#FFC01D] transition-colors rounded-[8px]"
                  >
                    <span>Register</span>
                  </button>

                  {menuOptions.filter(option => option.href !== "/business").map((option, index) => (
                    <Link
                      key={index}
                      className="px-3 text-white font-poppins text-xl font-medium hover:text-gray-500 transition-colors "
                      href={option.href}
                      onClick={e => {
                        if (option.href.startsWith("#")) {
                          e.preventDefault();
                          setIsMenuOpen(false);
                          // Set disable fullpage flag if navigating to a section below JobReels
                          if (["#jobtrain", "#trueid", "#ecosystem", "#impact", "#media"].includes(option.href)) {
                            window.__disableJobReelsFullScreen = true;
                            setTimeout(() => {
                              window.__disableJobReelsFullScreen = false;
                              //window.__disableIdentityVerifiedFullScreen = false;
                            }, 1000);
                          }
                          // Set disable fullpage flag for IdentityVerified if navigating to a section below it
                          if (["#ecosystem", "#impact", "#media"].includes(option.href)) {
                            window.__disableIdentityVerifiedFullScreen = true;
                            setTimeout(() => {
                              //window.__disableJobReelsFullScreen = false;
                              window.__disableIdentityVerifiedFullScreen = false;
                            }, 1000);
                          }
                          const id = option.href.replace("#", "");
                          const el = document.getElementById(id);
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth" });
                          }
                        } else if (option.href === "/business") {
                          setIsMenuOpen(false);
                          router.push(option.href);
                        }
                      }}
                    >
                      {option.text}
                    </Link>
                  ))}
                </div>

                {/* Desktop view - 2 horizontal sections */}
                <div className="hidden md:flex flex-col items-start gap-5">
                  {/* First row of options */}
                  <div className="flex flex-col flex-wrap gap-5">
                    {menuOptions.slice(0, 5).map((option, index) => (
                      <Link
                        key={index}
                        className="px-3  text-white font-poppins text-xl font-medium hover:text-gray-500 transition-colors"
                        href={option.href}
                        onClick={e => {
                          if (option.href.startsWith("#")) {
                            e.preventDefault();
                            setIsMenuOpen(false);
                            // Set disable fullpage flag if navigating to a section below JobReels
                            if (["#jobtrain", "#trueid", "#ecosystem", "#impact", "#media"].includes(option.href)) {
                              window.__disableJobReelsFullScreen = true;
                              setTimeout(() => {
                                window.__disableJobReelsFullScreen = false;
                                //window.__disableIdentityVerifiedFullScreen = false;
                              }, 1000);
                            }
                            // Set disable fullpage flag for IdentityVerified if navigating to a section below it
                            if (["#ecosystem", "#impact", "#media"].includes(option.href)) {
                              window.__disableIdentityVerifiedFullScreen = true;
                              setTimeout(() => {
                                //window.__disableJobReelsFullScreen = false;
                                window.__disableIdentityVerifiedFullScreen = false;
                              }, 1000);
                            }
                            const id = option.href.replace("#", "");
                            const el = document.getElementById(id);
                            if (el) {
                              el.scrollIntoView({ behavior: "smooth" });
                            }
                          } else if (option.href === "/business") {
                            setIsMenuOpen(false);
                            router.push(option.href);
                          }
                        }}
                      >
                        {option.text}
                      </Link>
                    ))}
                  </div>

                  {/* Second row of options */}
                  <div className="flex flex-col flex-wrap gap-5">
                    {menuOptions.slice(5).map((option, index) => (
                      <Link
                        key={index}
                        className="px-3 text-white font-poppins text-xl font-medium hover:text-gray-500 transition-colors"
                        href={option.href}
                        onClick={e => {
                          if (option.href.startsWith("#")) {
                            e.preventDefault();
                            setIsMenuOpen(false);
                            // Set disable fullpage flag if navigating to a section below JobReels
                            if (["#jobtrain", "#trueid", "#ecosystem", "#impact", "#media"].includes(option.href)) {
                              window.__disableJobReelsFullScreen = true;
                              setTimeout(() => {
                                window.__disableJobReelsFullScreen = false;
                                //window.__disableIdentityVerifiedFullScreen = false;
                              }, 1000);
                            }
                            // Set disable fullpage flag for IdentityVerified if navigating to a section below it
                            if (["#ecosystem", "#impact", "#media"].includes(option.href)) {
                              window.__disableIdentityVerifiedFullScreen = true;
                              setTimeout(() => {
                                //window.__disableJobReelsFullScreen = false;
                                window.__disableIdentityVerifiedFullScreen = false;
                              }, 1000);
                            }
                            const id = option.href.replace("#", "");
                            const el = document.getElementById(id);
                            if (el) {
                              el.scrollIntoView({ behavior: "smooth" });
                            }
                          } else if (option.href === "/business") {
                            setIsMenuOpen(false);
                            router.push(option.href);
                          }
                        }}
                      >
                        {option.text}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Header; 