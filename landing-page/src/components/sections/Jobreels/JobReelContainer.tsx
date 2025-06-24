import React, { useEffect, useState, useRef, ReactNode } from 'react';
import "../../../../public/styles/JobReelContainer.css";
import "../../../../public/styles/MobileScreenStyles.css";
import JobReelHeader from './JobReelHeader';

interface ProcessStep {
  number: string | ReactNode;
  title: string | ReactNode;
  description: string | ReactNode;
  requirements: {
    title: string | ReactNode;
    items: string[] | ReactNode[];
  };
}

const processSteps: ProcessStep[] = [
  {
    number: '',
    title: 'Reels not Resumes',
    description: 'Disruptive hiring with short video reels',
    requirements: {
      title: "",
      items: []
    }
  },
  {
    number: '',
    title: 'Watch.Listen.Apply',
    description: <>Complex Job Descriptions become Simple Short Video Job Posts <br /> AI/ML algorithms for an Instant Match</>,
    requirements: {
      title: "",
      items: []
    }
  },
  {
    number: '',
    title: <>24/7 <span className='bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent'>AI Recruiter</span></>,
    description: <>Instant interview with Employer's AI Avatar</>,
    requirements: {
      title: "",
      items: []
    }
  }
];

interface ResponsiveImage {
  src: string;
  srcset: string;
  sizes: string;
}

const mockupImages: ResponsiveImage[] = [
  {
    src: "images/JobReel.webp",
    srcset: "",
    sizes: "(max-width: 767px) 100vw, (max-width: 991px) 95vw, 940px"
  },
  {
    src: "images/JobPost.webp",
    srcset: "",
    sizes: "(max-width: 767px) 100vw, (max-width: 991px) 95vw, 940px"
  },
  {
    src: "images/AIinterview.webp",
    srcset: "",
    sizes: "(max-width: 767px) 100vw, (max-width: 991px) 95vw, 940px"
  },

];

const JobReelContainer: React.FC<{ showFrame?: boolean }> = ({ showFrame = false }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [prevStep, setPrevStep] = useState(-1);
  const stepsRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const processWrapperRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const mockupImagesRef = useRef<Array<HTMLImageElement | null>>([]);
  const currentIndexRef = useRef<number>(0);

  // useEffect(() => {
  //   // Lazy load CSS files
  //   import('../../../../public/styles/JobReelContainer.css');
  //   import('../../../../public/styles/MobileScreenStyles.css');
  // }, []);

  // Initialize intersection observer for animations
  useEffect(() => {
    // Setup intersection observer for triggering animations
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0.25, 0.5, 0.75]
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
  }, [processSteps, activeStep]); // Re-run when process steps or activeStep change

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
            // Simplified translation for current image
            const translateY = scrollProgress < 0.5 ?
              (0.5 - scrollProgress) * 50 : // Reduced movement range
              0;

            currentImage.style.transform = `translateY(${translateY}%)`;
            currentImage.style.opacity = '1';
            currentImage.style.filter = 'blur(0px)';
          }

          if (currentResponsiveImage) {
            const translateY = scrollProgress < 0.5 ?
              (0.5 - scrollProgress) * 50 : // Reduced movement range
              0;

            currentResponsiveImage.style.transform = `translateY(${translateY}%)`;
            currentResponsiveImage.style.opacity = '1';
            currentResponsiveImage.style.filter = 'blur(0px)';
          }

          // Next image - slide in from bottom
          if (index < processItems.length - 1) {
            const nextImage = mockupImagesRef.current[index + 1];
            const nextResponsiveImage = responsiveImages[index + 1] as HTMLElement;

            if (nextImage) {
              const nextProgress = scrollProgress > 0.5 ? (scrollProgress - 0.5) * 2 : 0;
              const nextTranslateY = 100 * (1 - nextProgress); // Linear transition

              nextImage.style.transform = `translateY(${nextTranslateY}%)`;
              nextImage.style.opacity = nextProgress.toString();
              nextImage.style.filter = 'blur(0px)';
            }

            if (nextResponsiveImage) {
              const nextProgress = scrollProgress > 0.5 ? (scrollProgress - 0.5) * 2 : 0;
              const nextTranslateY = 100 * (1 - nextProgress); // Linear transition

              nextResponsiveImage.style.transform = `translateY(${nextTranslateY}%)`;
              nextResponsiveImage.style.opacity = nextProgress.toString();
              nextResponsiveImage.style.filter = 'blur(0px)';
            }
          }

          // Previous image - keep visible and slide up
          if (index > 0) {
            const prevImage = mockupImagesRef.current[index - 1];
            const prevResponsiveImage = responsiveImages[index - 1] as HTMLElement;

            if (prevImage) {
              const prevProgress = scrollProgress < 0.5 ? (0.5 - scrollProgress) * 2 : 0;
              const prevTranslateY = -50 * prevProgress; // Reduced movement range

              prevImage.style.transform = `translateY(${prevTranslateY}%)`;
              prevImage.style.opacity = (1 - prevProgress * 0.5).toString(); // Slower fade out
              prevImage.style.filter = 'blur(0px)';
            }

            if (prevResponsiveImage) {
              const prevProgress = scrollProgress < 0.5 ? (0.5 - scrollProgress) * 2 : 0;
              const prevTranslateY = -50 * prevProgress; // Reduced movement range

              prevResponsiveImage.style.transform = `translateY(${prevTranslateY}%)`;
              prevResponsiveImage.style.opacity = (1 - prevProgress * 0.5).toString(); // Slower fade out
              prevResponsiveImage.style.filter = 'blur(0px)';
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
    <section id="guide" className="transparent-bg">
      <div className="slider-container w-full px-10">
        <div className="process-wrapper" ref={processWrapperRef}>
          <div className="left-section">
            <div className="header-wrapper">
              <JobReelHeader />
            </div>
            <div className="steps-wrapper" ref={stepsRef}>
              {processSteps.map((step, index) => (
                <div key={index} className="process-item">
                  <div className="process-right">
                    <div className="process-step-wrapper">
                      <div className="large-number">{step.number}</div>
                      <h3 className="text-xl sm:text-3xl md:text-4xl font-regular text-white font-['Helvetica'] pb-2 md:pb-3">{step.title}</h3>
                      <p className="text-md sm:text-base text-gray-400 mb-2 sm:mb-6 max-w-[280px] sm:max-w-none mx-auto md:mx-0 font-['Helvetica'] md:text-[18px] font-light italic leading-tight">{step.description}</p>
                      <div className="process-detail-wrapper">
                        <h4>{step.requirements.title}</h4>
                        <ul role="list">
                          {step.requirements.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="sliding-mockups-wrapper">
            <div className="responsive-image-container">
              {mockupImages.map((image, index) => (
                <img
                  key={index}
                  src={image.src}
                  alt={`Feature ${index + 1}`}
                  className={`responsive-feature-image ${index === activeStep ? 'active' : ''}`}
                  sizes={image.sizes}
                  srcSet={image.srcset}
                  loading='lazy'
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobReelContainer; 