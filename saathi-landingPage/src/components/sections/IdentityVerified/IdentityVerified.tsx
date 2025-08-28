import React, { useEffect, useState, useRef } from 'react';
import '../../../../public/styles/IdentityVerified.css';
import '../../../../public/styles/MobileScreenStyles.css';
import { CUSTOM_STYLES, EMPLOYER_BENEFITS, FEATURES, IDENTITY_MOCKUP_IMAGES, WORKER_BENEFITS } from '@/constants';
import Image from 'next/image';

// Adding custom styles to reduce gap between process items
const sections = [
  {
    key: "trueid",
    heading: "Live on TrueID",
    title: (
      <><div className=''>Live on Saathi <span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">TrueID</span></div></>
    ),
    content: (
      <>
        <div className="text-left text-xl sm:text-lg md:text-[28px] font-regular mt-2 mb-8 pl-5 text-gray-400">
          Live on <span className="text-white">True</span><span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">ID</span>
        </div>
        <ul className="space-y-4 sm:space-y-5 px-1">
          {FEATURES.map((f, i) => (
            <li key={i} className="flex flex-row items-center gap-2 md:gap-3 px-2">
              <span className="inline-block w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#FFC226] rounded-full flex items-center justify-center font-bold shrink-0">
                <Image
                  src={['/assets/home/face_detection.svg', '/assets/home/id_card.svg', '/assets/home/legal_2.svg', '/assets/home/experience 1.svg'][i]} // dynamically selected icon
                  alt="icon"
                  width={28}
                  height={28}
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                  loading="lazy"
                />
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-md sm:text-sm md:text-lg text-[#FFC226] text-left block break-words">
                  {f.title}
                </span>
                <div className="text-gray-200 text-md sm:text-sm md:text-base font-regular text-left break-words whitespace-normal">
                  {f.desc}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    ),
    image: '/assets/home/identity1.webp'
  },
  {
    key: "worker",
    heading: "TrueID for the Workforce",
    title: null,
    content: (
      <>
        <div className="text-left text-xl sm:text-lg md:text-[28px] font-regular mt-2 mb-8 pl-5 text-gray-400">
          <span className="text-white">True</span><span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">ID</span> <span className="text-gray-400">for the Workforce</span>
        </div>
        <ul className="space-y-4 sm:space-y-5 px-1">
          {WORKER_BENEFITS.map((item, idx) => (
            <li key={idx} className="flex flex-row items-center gap-2 md:gap-3 px-2">
              <span className="inline-block w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#FFC226] rounded-full flex items-center justify-center font-bold shrink-0">
                <Image
                  src={item.icon}
                  alt="icon"
                  width={28}
                  height={28}
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                  loading="lazy"
                />
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-regular text-md sm:text-sm md:text-[18px] text-white text-left block break-words">
                  {item.title} <span className="text-[#FFC226]">{item.desc}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </>
    ),
    image: '/assets/home/identity1.webp'
  },
  {
    key: "employer",
    heading: "TrueID for Recruiters",
    title: null,
    content: (
      <>
        <div className="text-left text-xl sm:text-lg md:text-[28px] font-regular mt-2 mb-8 pl-5 text-gray-400">
          <span className="text-white">True</span><span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">ID</span> <span className="text-gray-400">for Recruiters</span>
        </div>
        <ul className="space-y-4 sm:space-y-5 px-1">
          {EMPLOYER_BENEFITS.map((item, idx) => (
            <li key={idx} className="flex flex-row items-center gap-2 md:gap-3 px-2">
              <span className="inline-block w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#FFC226] rounded-full flex items-center justify-center font-bold shrink-0">
                <Image
                  src={item.icon}
                  alt="icon"
                  width={28}
                  height={28}
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                  loading="lazy"
                />
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-regular text-md sm:text-sm md:text-[18px] text-white text-left block break-words">
                  {item.title} <span className="text-[#FFC226]">{item.desc}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </>
    ),
    image: '/assets/home/identity1.webp'
  },
];

const IdentityVerified: React.FC<{ showFrame?: boolean }> = ({ showFrame = false }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [prevStep, setPrevStep] = useState(-1);
  const stepsRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const mockupFrameRef = useRef<HTMLDivElement>(null);
  const processWrapperRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const mockupImagesRef = useRef<Array<HTMLImageElement | null>>([]);
  const lastScrollYRef = useRef<number>(0);
  const tickingRef = useRef<boolean>(false);
  const currentIndexRef = useRef<number>(0);

  // Initialize intersection observer for animations
  useEffect(() => {
    // Setup intersection observer for triggering animations
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0.1, 0.33, 0.75]
    };

    // Observer for entrance animations
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('process-wrapper')) {
            entry.target.classList.add('in-view');
          } else if (entry.target.classList.contains('process-item')) {
            entry.target.classList.add('visible');
          }
        }
      });
    }, options);

    // Observe process wrapper for entrance animation
    if (processWrapperRef.current) {
      observerRef.current.observe(processWrapperRef.current);
    }

    // Observe each process item
    if (stepsRef.current) {
      const processItems = stepsRef.current.querySelectorAll('.process-item');
      processItems.forEach(item => {
        if (observerRef.current) {
          observerRef.current.observe(item);
        }
      });
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Initialize mockup image refs
  useEffect(() => {
    // Clear any previous active classes
    mockupImagesRef.current.forEach((img) => {
      if (img && img.classList.contains('active')) {
        img.classList.remove('active');
      }
      if (img && img.classList.contains('prev')) {
        img.classList.remove('prev');
      }
    });

    // Set initial mockup visibility (first item active)
    const firstImage = mockupImagesRef.current[0];
    if (firstImage) {
      firstImage.classList.add('active');
      firstImage.style.transform = 'translateX(0%)';
      firstImage.style.opacity = '1';
    }

    // Position other images off-screen
    for (let i = 1; i < mockupImagesRef.current.length; i++) {
      const img = mockupImagesRef.current[i];
      if (img) {
        img.style.transform = 'translateX(100%)';
        img.style.opacity = '0';
      }
    }

    // Initialize responsive images as well
    setTimeout(() => {
      const responsiveImages = document.querySelectorAll('.responsive-feature-image');
      if (responsiveImages.length > 0) {
        (responsiveImages[0] as HTMLElement).style.transform = 'translateX(0%)';
        (responsiveImages[0] as HTMLElement).style.opacity = '1';

        for (let i = 1; i < responsiveImages.length; i++) {
          (responsiveImages[i] as HTMLElement).style.transform = 'translateX(100%)';
          (responsiveImages[i] as HTMLElement).style.opacity = '0';
        }
      }
    }, 100);

    // Reset current index and active step
    currentIndexRef.current = 0;
    setActiveStep(0);
    setPrevStep(-1);

    // Mark the first circle as active
    const circles = document.querySelectorAll('.progression-circle');
    circles.forEach((circle, i) => {
      if (i === 0) {
        circle.classList.add('active');
      } else {
        circle.classList.remove('active');
      }
    });
  }, []);

  // Update when process steps change
  useEffect(() => {
    // Sync the active step with the image display
    const updateActiveStep = (index: number) => {
      // Save previous step before updating
      setPrevStep(activeStep);
      setActiveStep(index);

      // Update mockup image visibility with parallax effect
      mockupImagesRef.current.forEach((img, imgIndex) => {
        if (img) {
          if (imgIndex === index) {
            img.classList.remove('prev');
            img.classList.add('active');
          } else if (imgIndex === activeStep) {
            img.classList.remove('active');
            img.classList.add('prev');
          } else {
            img.classList.remove('active');
            img.classList.remove('prev');
          }
        }
      });

      // Update progression circles
      const progressionCircles = document.querySelectorAll('.progression-circle');
      progressionCircles.forEach((circle, i) => {
        if (i <= index) {
          circle.classList.add('active');
        } else {
          circle.classList.remove('active');
        }
      });
    };

    // Initial sync
    updateActiveStep(currentIndexRef.current);

    // Setup scroll observation for each process item
    const handleProcessStepVisibility = () => {
      if (!stepsRef.current) return;

      const processItems = stepsRef.current.querySelectorAll('.process-item');
      processItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const itemTop = rect.top;

        // Check if this item is in the middle of the viewport
        if (itemTop < viewportHeight * 0.6 && itemTop > -rect.height * 0.4) {
          if (currentIndexRef.current !== index) {
            currentIndexRef.current = index;
            updateActiveStep(index);
          }
        }
      });
    };

    // Add scroll listener
    window.addEventListener('scroll', handleProcessStepVisibility, { passive: true });

    // Initial check
    handleProcessStepVisibility();

    return () => {
      window.removeEventListener('scroll', handleProcessStepVisibility);
    };
  }, [sections, activeStep]); // Re-run when process steps or activeStep change

  // Handle scroll-based animations - modified for ultra-smooth transitions
  useEffect(() => {
    const updateMockups = () => {
      if (!stepsRef.current) return;

      const processItems = stepsRef.current.querySelectorAll('.process-item');
      const progressBar = progressBarRef.current;

      processItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const itemTop = rect.top;
        const itemHeight = rect.height;

        // Calculate how far through the item we've scrolled (0 to 1) with enhanced easing
        const rawScrollProgress = Math.min(
          Math.max(
            (viewportHeight * 0.5 - itemTop) / (itemHeight + viewportHeight * 0.5),
            0
          ),
          1
        );

        // Apply advanced easing function for ultra-smooth transitions
        // This is a custom easing function that combines aspects of easeOutExpo and easeInOutQuint
        const easeOutExpo = (t: number): number => {
          if (t === 1) return 1;
          return 1 - Math.pow(2, -10 * t);
        };

        const easeInOutQuint = (t: number): number => {
          return t < 0.5
            ? 16 * t * t * t * t * t
            : 1 - Math.pow(-2 * t + 2, 5) / 2;
        };

        // Blend between two easing functions for a custom feel
        const blendedEase = (t: number): number => {
          // Get values from both easing functions
          const expo = easeOutExpo(t);
          const quint = easeInOutQuint(t);

          // Blend based on progress (more exponential at start, more quintic at end)
          const blend = t < 0.5 ? t * 2 : (1 - t) * 2;
          return expo * (1 - blend) + quint * blend;
        };

        const scrollProgress = blendedEase(rawScrollProgress);

        // Update progress bar with super-smooth animation
        if (progressBar && index === currentIndexRef.current) {
          const progress = (currentIndexRef.current + scrollProgress) / processItems.length * 100;
          progressBar.style.height = `${progress}%`;
        }

        // Apply parallax effect on the images based on scroll progress with enhanced smoothness
        if (index === currentIndexRef.current) {
          // Get all image references for the current index
          const currentImage = mockupImagesRef.current[index];
          const responsiveImages = document.querySelectorAll('.responsive-feature-image');
          const currentResponsiveImage = responsiveImages[index] as HTMLElement;

          // Handle current active image with advanced easing
          if (currentImage) {
            // Advanced easing formula for smoother transitions
            const translateY = scrollProgress < 0.5 ?
              (0.5 - scrollProgress) * 100 * Math.pow(1 - scrollProgress * 2, 1.5) : // Advanced slide-in with non-linear easing
              0; // Keep centered
            const scale = scrollProgress < 0.5 ?
              0.95 + (scrollProgress * 2) * 0.05 : // Scale up as it enters
              1; // Full scale when centered

            currentImage.style.transform = `translateY(${translateY}%) scale(${scale})`;
            // Reduce blur as image enters view  
            currentImage.style.filter = `blur(${Math.max(0, 2 - scrollProgress * 4)}px)`;
          }

          if (currentResponsiveImage) {
            const translateY = scrollProgress < 0.5 ?
              (0.5 - scrollProgress) * 100 * Math.pow(1 - scrollProgress * 2, 1.5) : // Advanced slide-in with non-linear easing
              0; // Keep centered
            const scale = scrollProgress < 0.5 ?
              0.95 + (scrollProgress * 2) * 0.05 : // Scale up as it enters
              1; // Full scale when centered

            currentResponsiveImage.style.transform = `translateY(${translateY}%) scale(${scale})`;
            // Reduce blur as image enters view
            currentResponsiveImage.style.filter = `blur(${Math.max(0, 2 - scrollProgress * 4)}px)`;
          }

          // Next image - ultra-smooth slide in from bottom with advanced easing
          if (index < processItems.length - 1) {
            const nextImage = mockupImagesRef.current[index + 1];
            const nextResponsiveImage = responsiveImages[index + 1] as HTMLElement;

            if (nextImage) {
              // Enhanced cubic bezier approximation for beautiful slide-in
              const nextProgress = scrollProgress > 0.5 ? (scrollProgress - 0.5) * 2 : 0;
              const nextTranslateY = 100 * (1 - Math.pow(nextProgress, 3)); // Cubic easing for smoother entrance
              const nextScale = 0.95 + (nextProgress * 0.05); // Subtle scaling effect

              nextImage.style.transform = `translateY(${nextTranslateY}%) scale(${nextScale})`;
              // Fade and blur control
              nextImage.style.opacity = (nextProgress * 1.5).toString(); // Faster fade-in
              nextImage.style.filter = `blur(${Math.max(0, 2 - nextProgress * 4)}px)`;
            }

            if (nextResponsiveImage) {
              const nextProgress = scrollProgress > 0.5 ? (scrollProgress - 0.5) * 2 : 0;
              const nextTranslateY = 100 * (1 - Math.pow(nextProgress, 3)); // Cubic easing for smoother entrance
              const nextScale = 0.95 + (nextProgress * 0.05); // Subtle scaling effect

              nextResponsiveImage.style.transform = `translateY(${nextTranslateY}%) scale(${nextScale})`;
              // Fade and blur control
              nextResponsiveImage.style.opacity = (nextProgress * 1.5).toString(); // Faster fade-in
              nextResponsiveImage.style.filter = `blur(${Math.max(0, 2 - nextProgress * 4)}px)`;
            }
          }

          // Previous image - ultra-smooth slide out to top with advanced easing
          if (index > 0) {
            const prevImage = mockupImagesRef.current[index - 1];
            const prevResponsiveImage = responsiveImages[index - 1] as HTMLElement;

            if (prevImage) {
              // Enhanced cubic bezier approximation for beautiful slide-out
              const prevProgress = scrollProgress < 0.5 ? (0.5 - scrollProgress) * 2 : 0;
              const prevTranslateY = -100 * (1 - Math.pow(prevProgress, 3)); // Cubic easing for smoother exit
              const prevScale = 0.95 + (prevProgress * 0.05); // Subtle scaling effect

              prevImage.style.transform = `translateY(${prevTranslateY}%) scale(${prevScale})`;
              // Fade and blur control
              prevImage.style.opacity = (prevProgress * 0.5).toString(); // More dramatic fade-out
              prevImage.style.filter = `blur(${Math.max(0, 2 - prevProgress * 4)}px)`;
            }

            if (prevResponsiveImage) {
              const prevProgress = scrollProgress < 0.5 ? (0.5 - scrollProgress) * 2 : 0;
              const prevTranslateY = -100 * (1 - Math.pow(prevProgress, 3)); // Cubic easing for smoother exit
              const prevScale = 0.95 + (prevProgress * 0.05); // Subtle scaling effect

              prevResponsiveImage.style.transform = `translateY(${prevTranslateY}%) scale(${prevScale})`;
              // Fade and blur control
              prevResponsiveImage.style.opacity = (prevProgress * 0.5).toString(); // More dramatic fade-out
              prevResponsiveImage.style.filter = `blur(${Math.max(0, 2 - prevProgress * 4)}px)`;
            }
          }
        }
      });
    };

    // High-performance scroll handler with RAF optimization
    let lastScrollY = window.scrollY;
    let animationFrameId: number | null = null;
    let lastTimestamp = 0;

    const handleScroll = () => {
      const now = performance.now();
      const currentScrollY = window.scrollY;

      // Only update if we have a meaningful scroll change or enough time has passed
      // This creates buttery-smooth animations even on rapid scrolling
      if (Math.abs(currentScrollY - lastScrollY) > 0.5 || now - lastTimestamp > 16) {
        // Cancel any pending frames for smoother animation
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }

        // Schedule the update in the next frame with high priority
        animationFrameId = requestAnimationFrame(() => {
          updateMockups();
          lastScrollY = currentScrollY;
          lastTimestamp = now;
          animationFrameId = null;
        });
      }
    };

    // Use passive event listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial update
    updateMockups();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <section id="guide" className="transparent-bg hidden md:block">
      <div className="slider-container w-container">

        <div className="process-wrapper" ref={processWrapperRef} data-animate="true">
          {/*Left Side*/}
          <div className="steps-wrapper" ref={stepsRef} data-animate="true">
            {sections.map((step, index) => (
              <div key={index} className="process-item" style={CUSTOM_STYLES.processItem}>
                <div className="process-center">
                </div>
                <div className="process-verified-right">
                  <div className="process-step-wrapper">
                    <div className="process-detail-wrapper">
                      {sections[index] && sections[index].content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/*Right Side*/}
          <div className="sliding-mockups-wrapper">
            <div className="sliding-mockups-frame" ref={mockupFrameRef}>
              {showFrame ? (
                <>
                  <div className="mockup-screen">
                    {IDENTITY_MOCKUP_IMAGES.map((image, index) => (
                      <Image
                        key={index}
                        src={image.src}
                        alt={`PursePulse Mockup ${index + 1}`}
                        width={300}
                        height={600}
                        className={`sliding-mockup-${index + 1} ${index === activeStep ? 'active' : index === prevStep ? 'prev' : ''}`}
                        sizes={image.sizes}
                        loading="lazy"
                      />
                    ))}
                  </div>
                  <Image
                    src="/images/frame.svg"
                    alt="iPhone Frame"
                    width={320}
                    height={640}
                    className="mockup-frame"
                    loading="lazy"
                  />
                </>
              ) : (
                <div className="responsive-image-container flex items-center justify-center min-h-[calc(100vh-6rem)] py-8">
                  <Image
                    key={0}
                    src={IDENTITY_MOCKUP_IMAGES[0].src}
                    alt={`Feature 1`}
                    width={280}
                    height={500}
                    className="w-[280px] mt-[84px] h-auto object-contain"
                    sizes={IDENTITY_MOCKUP_IMAGES[0].sizes}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default IdentityVerified; 