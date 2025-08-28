import React, { useEffect, useRef, ReactNode } from 'react';
import '../../../../public/styles/JobReelContainer.css';
import '../../../../public/styles/MobileScreenStyles.css';
import JobReelHeader from './JobReelHeader';
import Image from 'next/image';

interface ProcessStep {
  number: string | ReactNode;

  requirements: {
    title: string | ReactNode;
    items: string[] | ReactNode[];
  };
}

const processSteps: ProcessStep[] = [
  {
    number: '',
    requirements: {
      title: "Key Features",
      items: [
        "Short Video Reels of Job seekers Profile",
        "Short Video Posts of Employers JD",
        "Employers AI Avatars",
        "Instant AI Interviews",
        "Hyperlocal & Relevant Hiring",
        "Certified & Verified Job seekers",
        "80% Reduction in Time & Cost-to-Hire"
      ]
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
    src: "images/JobPost.webp",
    srcset: "",
    sizes: "(max-width: 767px) 100vw, (max-width: 991px) 95vw, 940px"
  }
];

const JobReelContainer: React.FC<{ showFrame?: boolean }> = ({ showFrame = false }) => {
  const stepsRef = useRef<HTMLDivElement>(null);
  const processWrapperRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initialize intersection observer for animations
  useEffect(() => {
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

  return (
    <section id="guide" className="transparent-bg shadow-[10px_0px_5px_12px_#070707]">
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
                    <div className="process-reel-wrapper">
                      <div className="large-number">{step.number}</div>
                      <div className="process-reel-detail-wrapper">
                        <div className="bullet-points-container">
                          {step.requirements.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center mb-4">
                              <div className="flex-shrink-0 w-8 h-8 mr-3">
                                <Image
                                  src="/images/reelIcon.svg"
                                  alt="bullet"
                                  width={32}
                                  height={32}
                                  className="object-contain"
                                />
                              </div>
                              <span className="text-white font-normal text-[16px] leading-[100%] tracking-[0]">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Pricing section */}
                        <div className="mt-8">
                          <h4 className="text-[#949BA6] text-lg font-medium mb-2 uppercase tracking-wider">
                            ANNUAL SUBSCRIPTION OF ₹5,000 ONLY
                          </h4>
                          <p className="text-[#949BA6] text-base font-light">
                            Unlimited Job Posts
                          </p>
                        </div>
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
                  className="responsive-feature-image mt-12 active"
                  sizes={image.sizes}
                  srcSet={image.srcset}
                  loading='lazy'
                  style={{
                    transform: 'translateY(0%)',
                    opacity: '1',
                    filter: 'blur(0px)',
                    position: 'relative'
                  }}
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