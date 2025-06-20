"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const sections = [
  {
    key: "section1",
    title: "Section 1",
    content: "Content for section 1",
    image: "/assets/home/worker-image.png"
  },
  {
    key: "section2",
    title: "Section 2",
    content: "Content for section 2",
    image: "/assets/home/worker-image.png"
  },
  {
    key: "section3",
    title: "Section 3",
    content: "Content for section 3",
    image: "/assets/home/worker-image.png"
  }
];

const JobTrain = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollDirection = useRef<'up' | 'down' | null>(null);
  const scrollAccumulator = useRef(0);
  const SCROLL_THRESHOLD = 30;
  const transitionTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTime = useRef(0);
  const SCROLL_COOLDOWN = 200;
  const isFromBelow = useRef(false);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isTransitioning) {
          setTimeout(() => {
            setIsFullScreen(true);
            if (isFromBelow.current) {
              setSelectedIndex(sections.length - 1);
            } else {
              setSelectedIndex(0);
            }
          }, 50);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observerRef.current.observe(sectionRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
      }
    };
  }, []);

  const scrollToSection = (direction: 'up' | 'down') => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    const section = sectionRef.current;
    if (!section) return;

    isFromBelow.current = direction === 'up';

    const targetSection = direction === 'down' 
      ? sectionRef.current?.nextElementSibling 
      : sectionRef.current?.previousElementSibling;

    if (!targetSection) return;

    section.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
    section.style.transform = direction === 'down' ? 'translateY(-100%)' : 'translateY(100%)';
    section.style.opacity = '0';

    setIsFullScreen(false);

    requestAnimationFrame(() => {
      setTimeout(() => {
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        transitionTimeout.current = setTimeout(() => {
          section.style.transition = '';
          section.style.transform = '';
          section.style.opacity = '';
          setIsTransitioning(false);
        }, 500);
      }, 50);
    });
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isFullScreen || isTransitioning) return;

      e.preventDefault();
      
      const now = Date.now();
      if (now - lastScrollTime.current < SCROLL_COOLDOWN) return;
      lastScrollTime.current = now;
      
      scrollAccumulator.current += e.deltaY;
      
      if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
        const direction = scrollAccumulator.current > 0 ? 'down' : 'up';
        scrollDirection.current = direction;
        scrollAccumulator.current = 0;

        if (direction === 'down' && selectedIndex === sections.length - 1) {
          setIsTransitioning(true);
          scrollToSection('down');
          return;
        }

        if (direction === 'up' && selectedIndex === 0) {
          setIsTransitioning(true);
          scrollToSection('up');
          return;
        }

        setTimeout(() => {
          setSelectedIndex((current) => {
            const next = direction === 'down' ? current + 1 : current - 1;
            return next;
          });
        }, 50);
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (section) {
        section.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isFullScreen, selectedIndex, isTransitioning]);

  return (
    <div 
      ref={sectionRef}
      className={`${
        isFullScreen ? 'fixed inset-0 z-50 bg-[#09090B]' : 'relative bg-[#09090B]'
      } transition-all duration-500 ease-in-out`}
      style={{ 
        pointerEvents: isTransitioning ? 'none' : 'auto',
        opacity: isFullScreen ? 1 : 0,
        transform: isFullScreen ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease-in-out'
      }}
    >
      <section 
        className={`${
          isFullScreen ? 'h-screen' : 'min-h-screen'
        } bg-[#09090B] relative overflow-hidden transition-all duration-500 ease-in-out`}
        style={{
          opacity: isFullScreen ? 1 : 0,
          transform: isFullScreen ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s ease-in-out'
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-center px-5 md:px-16">
          <div 
            className="mb-8 transition-all duration-500 ease-in-out" 
            style={{
              opacity: isFullScreen ? 1 : 0,
              transform: isFullScreen ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.5s ease-in-out',
              transitionDelay: '0.1s'
            }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="text-center text-3xl md:text-7xl font-bold tracking-tight leading-tight"
            >
              <span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">Job</span> <span className="text-white">Train</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center text-gray-400 mt-4 text-md md:text-lg font-medium"
            >
              Your path to success starts here
            </motion.p>
          </div>

          <div className="slider-container mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 items-center">
            {/* Left Side - Content */}
            <div className="relative min-h-[400px] flex flex-col justify-center">
              <div className="h-full">
                {sections.map((section, index) => (
                  <div
                    key={section.key}
                    className={`absolute w-full transition-all duration-500 ease-in-out ${
                      selectedIndex === index
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-4 pointer-events-none'
                    }`}
                    style={{ 
                      willChange: 'transform, opacity',
                      transition: 'all 0.5s ease-in-out',
                      transitionDelay: '0.2s'
                    }}
                  >
                    <div className="p-4">
                      <h3 className="text-2xl md:text-3xl font-bold pb-5 text-white">
                        {section.title}
                      </h3>
                      <p className="text-gray-400">{section.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Vertical pagination dots */}
              {isFullScreen && (
                <div 
                  className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4"
                  style={{
                    opacity: isFullScreen ? 1 : 0,
                    transition: 'all 0.5s ease-in-out',
                    transitionDelay: '0.3s'
                  }}
                >
                  {sections.map((section, index) => (
                    <div
                      key={`progress-${section.key}`}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        selectedIndex === index
                          ? 'bg-yellow-400 scale-125'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Image Display */}
            <div className="relative h-full flex items-center justify-center">
              <div className="relative w-full max-w-[300px] aspect-[9/16] mx-auto overflow-hidden rounded-lg">
                {sections.map((section, index) => (
                  <div
                    key={`image-${section.key}`}
                    className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                      selectedIndex === index
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                    style={{ 
                      willChange: 'transform, opacity, scale',
                      transition: 'all 0.5s ease-in-out',
                      transitionDelay: '0.2s'
                    }}
                  >
                    <img
                      src={section.image}
                      alt={section.key}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobTrain; 