import Image from "next/image";

export const DOMAIN_LINK = "https://video.saathi.in/";

export const TRAIN_CARDS = [
  {
    id: 1,
    title: "Contact Centre",
    imageUrl: "/images/train/Contactcentre.webp",
    href: "#",
  },
  {
    id: 2,
    title: "Delivery Executive",
    imageUrl: "/images/train/bde.webp",
    href: "#",
  },
  {
    id: 3,
    title: "FMCG Field Sales Executive",
    imageUrl: "/images/train/FMCG.webp",
    href: "#",
  },
  {
    id: 4,
    title: "Data Entry & IT",
    imageUrl: "/images/train/Dataentry.webp",
    href: "#",
  },
  {
    id: 5,
    title: "Front Desk Executive",
    imageUrl: "/images/train/frontdesk.webp",
    href: "#",
  },
];

export const SOCIAL_LINKS = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/thesaathiapp",
    icon: "/assets/home/linkdin.svg",
    text: "Follow us on LinkedIn",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/thesaathiapp/",
    icon: "/assets/home/facebook.svg",
    text: "Follow us on Facebook",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/thesaathiapp/",
    icon: "/assets/home/instagram.svg",
    text: "Follow us on Instagram",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@thesaathiapp",
    icon: "/assets/home/youtube.svg",
    text: "Subscribe our YouTube channel",
  },
];

export const FEATURES = [
  {
    title: (
      <>
        <span className="text-white">Live Photo</span>{" "}
        <span className="text-[#FFC226]">Verified</span>
      </>
    ),
    highlight: "Verified",
    desc: (
      <>
        <span className="text-gray-400 italic text-md md:text-[18px]">
          Short Video Reels of Job seekers Profile
        </span>
      </>
    ),
  },
  {
    title: (
      <>
        <span className="text-white">Adhaar</span>{" "}
        <span className="text-[#FFC226]">Verified</span>
      </>
    ),
    highlight: "Verified",
    desc: (
      <>
        <span className="text-gray-400 italic text-md md:text-[18px]">
          Preventing Identity Fraud
        </span>
      </>
    ),
  },
  {
    title: (
      <>
        <span className="text-white">Legal Status</span>{" "}
        <span className="text-[#FFC226]">Verified</span>
      </>
    ),
    highlight: "Verified",
    desc: (
      <>
        <span className="text-gray-400 italic text-md md:text-[18px]">
          Automated Court Case Checks
        </span>
      </>
    ),
  },
  {
    title: (
      <>
        <span className="text-white">Experience</span>{" "}
        <span className="text-[#FFC226]">Verified</span>
      </>
    ),
    highlight: "Verified",
    desc: (
      <span className="text-gray-400 italic text-md md:text-[18px]">
        Past Employment Check with Rating
      </span>
    ),
  },
];

export const WORKER_BENEFITS = [
  {
    icon: "/assets/home/Share.svg",
    title: "Sharable",
    desc: "Digital Biodata",
  },
  {
    icon: "/assets/home/Work-outline.svg",
    title: "Potential for",
    desc: "Better Jobs",
  },
  {
    icon: "/assets/home/Thumb-up.svg",
    title: "Increased",
    desc: "Self Esteem",
  },
  {
    icon: "/assets/home/Check-circle-outline.svg",
    title: "Continued",
    desc: "Growth",
  },
];

export const EMPLOYER_BENEFITS = [
  {
    icon: "/assets/home/Verified-user.svg",
    title: "Instant Access to",
    desc: "Authentic Profiles",
  },
  { icon: "/assets/home/Timer.svg", title: "Reduced", desc: "Time-to-Hire" },
  {
    icon: "/assets/home/Stars.svg",
    title: "Past employment History & ",
    desc: "Ratings",
  },
  {
    icon: "/assets/home/Mindfulness.svg",
    title: "Lower Attrition",
    desc: "Higher Productivity",
  },
];

export const IMPACT_CARDS = [
  {
    icon: "/assets/home/Artboard 1.svg",
    title: "Empowering Lives",
    desc: "Providing Identity through Live Digital CVs",
  },

  {
    icon: "/assets/home/Artboard 2.svg",
    title: "Digital Skilling",
    desc: "Converging traditional learning models with new-age techniques",
  },
  {
    icon: "/assets/home/Artboard 4.svg",
    title: "Holistic Development",
    desc: "Imparting Life Skills & Promoting Wellbeing",
  },
  {
    icon: "/assets/home/Artboard 3.svg",
    title: "Women Empowerment",
    desc: "Increasing women participation in the workforce",
  },
];

export const JOB_REELS_FEATURES = [
  {
    id: "reels",
    title: "Watch.Listen.Apply",
    phoneImage: "images/JobPost.webp",
    bulletPoints: [
      "Short Video Reels of Job seekers Profile",
      "Short Video Posts of Employers JD", 
      "Employers AI Avatars",
      "Instant AI Interviews",
      "Hyperlocal & Relevant Hiring",
      "Certified & Verified Job seekers",
      "80% Reduction in Time & Cost-to-Hire"
    ]
  }
];

export const MOCKUP_IMAGES = [
  {
    src: "images/JobReel.webp",
    srcset: "",
    sizes: "(max-width: 767px) 100vw, (max-width: 991px) 95vw, 940px",
  },
  {
    src: "images/JobPost.webp",
    srcset: "",
    sizes: "(max-width: 767px) 100vw, (max-width: 991px) 95vw, 940px",
  },
  {
    src: "images/AIinterview.webp",
    srcset: "",
    sizes: "(max-width: 767px) 100vw, (max-width: 991px) 95vw, 940px",
  },
];

export const IDENTITY_MOCKUP_IMAGES = [
  {
    src: "/assets/home/identity1.webp",
    srcset: "",
    sizes: "(max-width: 767px) 100vw, (max-width: 991px) 95vw, 940px",
  },
  {
    src: "/assets/home/identity1.webp",
    srcset: "",
    sizes: "(max-width: 767px) 100vw, (max-width: 991px) 95vw, 940px",
  },
  {
    src: "/assets/home/identity1.webp",
    srcset: "",
    sizes: "(max-width: 767px) 100vw, (max-width: 991px) 95vw, 940px",
  },
];

export const PROCESS_STEPS = [
  {
    number: "",
    title: "Reels not Resumes",
    description: "Disruptive hiring with short video reels",
    requirements: {
      title: "",
      items: [],
    },
  },
  {
    number: "",
    title: "Watch.Listen.Apply",
    description: (
      <>
        Complex Job Descriptions become Simple Short Video Job Posts <br />{" "}
        AI/ML algorithms for an Instant Match
      </>
    ),
    requirements: {
      title: "",
      items: [],
    },
  },
  {
    number: "",
    title: (
      <>
        24/7{" "}
        <span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">
          AI Recruiter
        </span>
      </>
    ),
    description: <>Instant interview with Employer's AI Avatar</>,
    requirements: {
      title: "",
      items: [],
    },
  },
];

export const CUSTOM_STYLES = {
  processItem: {
    marginBottom: "0px", // Reduced further from 15px to 5px
  },
  progressionCircle: {
    backgroundColor: "rgb(75, 85, 99)", // gray-600
    transition: "all 0.3s ease",
  },
  activeCircle: {
    backgroundColor: "#FFC01D", // Using a single color instead of gradient
  },
};

export const VIDEO_DATA = [
  {
    id: "video1",
    title: "Delivery Rider",
    thumbnailUrl: "/images/DeliveryExecutive2.webp",
    videoUrl:
      `${DOMAIN_LINK}MISC_VIDEOS/trailers/Delivery.mp4`,
    youtubeUrl: "",
  },
  {
    id: "video2",
    title: "Warehouse Worker",
    thumbnailUrl: "/images/Warehouse.webp",
    videoUrl:
      `${DOMAIN_LINK}MISC_VIDEOS/trailers/Warehouse.mp4`,
    youtubeUrl: "",
  },
  {
    id: "video3",
    title: "Security Guard",
    thumbnailUrl: "/images/Security.webp",
    videoUrl:
      `${DOMAIN_LINK}MISC_VIDEOS/trailers/Security.mp4`,
    youtubeUrl: "",
  },
  {
    id: "video4",
    title: "Office Receptionist",
    thumbnailUrl: "/images/Frontoffice.webp",
    videoUrl:
      `${DOMAIN_LINK}MISC_VIDEOS/trailers/Receptionist.mp4`,
    youtubeUrl: "",
  },
  {
    id: "video5",
    title: "Beautician",
    thumbnailUrl: "/images/abt.webp",
    videoUrl:
      `${DOMAIN_LINK}MISC_VIDEOS/trailers/Beautician.mp4`,
    youtubeUrl: "",
  },
];

export const IMPACT_VIDEOS_DATA = [
  {
    id: "impact1",
    title: "",
    thumbnailUrl: "/images/Media/business-today.webp",
    videoUrl: "",
    youtubeUrl: "https://www.youtube.com/watch?v=AZvtXKkVrCA",
  },
  {
    id: "impact2",
    title: "",
    thumbnailUrl: "/images/Media/startup-story.webp",
    videoUrl: "",
    youtubeUrl: "https://www.youtube.com/watch?v=X1TgklSIOGo",
  },
  {
    id: "impact3",
    title: "",
    thumbnailUrl: "/images/Media/et-interview.webp",
    videoUrl: "",
    youtubeUrl: "https://www.youtube.com/watch?v=EkGFcdI92Sg",
  },
  {
    id: "impact4",
    title: "",

    thumbnailUrl: "/images/Media/vikas.webp",
    videoUrl: "",
    youtubeUrl: "https://www.youtube.com/watch?v=F5DRWyz2KBk",
  },
  {
    id: "impact5",
    title: "",
    thumbnailUrl: "/images/Media/mission.webp",
    videoUrl: "",
    youtubeUrl: "https://www.youtube.com/watch?v=4ZRnzLbWLUw",
  },
  {
    id: "impact6",
    title: "",
    thumbnailUrl: "/images/Media/et-interview-2.webp",
    videoUrl: "",
    youtubeUrl: "https://www.youtube.com/watch?v=-HbIuW44Td4&t=40s",
  },
];

export const VIDEO_DATA_BUSINESS = {
  jobreels: [
    {
      id: 1,
      src: `${DOMAIN_LINK}MISC_VIDEOS/jobreels/jobreel-1.mp4`,
      thumbnail: "/videos/thumbnails/jobreels/jobreel-1.webp",
      title: "",
    },
    {
      id: 2,
      src: `${DOMAIN_LINK}MISC_VIDEOS/jobreels/jobreel-2.mp4`,
      thumbnail: "/videos/thumbnails/jobreels/jobreel-2.webp",
      title: "",
    },
    {
      id: 3,
      src: `${DOMAIN_LINK}MISC_VIDEOS/jobreels/jobreel-3.mp4`,
      thumbnail: "/videos/thumbnails/jobreels/jobreel-3.webp",
      title: "",
    },
    {
      id: 4,
      src: `${DOMAIN_LINK}MISC_VIDEOS/jobreels/jobreel-4.mp4`,
      thumbnail: "/videos/thumbnails/jobreels/jobreel-4.webp",
      title: "",
    },
    {
      id: 5,
      src: `${DOMAIN_LINK}MISC_VIDEOS/jobreels/jobreel-5.mp4`,
      thumbnail: "/videos/thumbnails/jobreels/jobreel-5.webp",
      title: "",
    },
  ],
  jobposts: [
    {
      id: 1,
      src: `${DOMAIN_LINK}MISC_VIDEOS/jobposts/jobpost-1.mp4`,
      thumbnail: "/videos/thumbnails/jobposts/jobpost-1.webp",
      title: "",
    },
    {
      id: 2,
      src: `${DOMAIN_LINK}MISC_VIDEOS/jobposts/jobpost-2.mp4`,
      thumbnail: "/videos/thumbnails/jobposts/jobpost-2.webp",
      title: "",
    },
    {
      id: 3,
      src: `${DOMAIN_LINK}MISC_VIDEOS/jobposts/jobpost-3.mp4`,
      thumbnail: "/videos/thumbnails/jobposts/jobpost-3.webp",
      title: "",
    },
    {
      id: 4,
      src: `${DOMAIN_LINK}MISC_VIDEOS/jobposts/jobpost-4.mp4`,
      thumbnail: "/videos/thumbnails/jobposts/jobpost-4.webp",
      title: "",
    },
    {
      id: 5,
      src: `${DOMAIN_LINK}MISC_VIDEOS/jobposts/jobpost-5.mp4`,
      thumbnail: "/videos/thumbnails/jobposts/jobpost-5.webp",
      title: "",
    },
  ],
  ai: [
    {
      id: 1,
      src: `${DOMAIN_LINK}MISC_VIDEOS/ai/ai-1.mp4`,
      thumbnail: "/videos/thumbnails/ai/ai-1.webp",
      title: "",
    },
    {
      id: 2,
      src: `${DOMAIN_LINK}MISC_VIDEOS/ai/ai-2.mp4`,
      thumbnail: "/videos/thumbnails/ai/ai-2.webp",
      title: "",
    },
    {
      id: 3,
      src: `${DOMAIN_LINK}MISC_VIDEOS/ai/ai-3.mp4`,
      thumbnail: "/videos/thumbnails/ai/ai-3.webp",
      title: "",
    },
    {
      id: 4,
      src: `${DOMAIN_LINK}MISC_VIDEOS/ai/ai-4.mp4`,
      thumbnail: "/videos/thumbnails/ai/ai-4.webp",
      title: "",
    },
    {
      id: 5,
      src: `${DOMAIN_LINK}MISC_VIDEOS/ai/ai-5.mp4`,
      thumbnail: "/videos/thumbnails/ai/ai-5.webp",
      title: "",
    },
  ],
};

export const STATISTICS = [
  { value: "2Mn+", label: "Job Seekers" },
  { value: "200K+", label: "Job Reels" },
  { value: "5K+", label: "Companies" },
  { value: "20K+", label: "Active Jobs" },
  { value: "100k+", label: "AI Interviews" }
];

export const TESTIMONIALS_DATA = [
  {
    id: "testimonial1",
    company: "Rapido",
    role: "HR Team",
    testimonial: "We have cut hiring time by more than half. JobReels is a game-changer.",
  },
  {
    id: "testimonial2",
    company: "Blinkit",
    role: "City Manager",
    testimonial: "The AI interviews saved hours, and we instantly got qualified workers. Better & Faster than anyone or any place.",
  },
  {
    id: "testimonial3",
    company: "Zepto",
    role: "Hiring Partner",
    testimonial: "It’s refreshing to see who they are and how they communicate, even before shortlisting – we have hired great salespeople with JobReels in record time.",
  },
  {
    id: "testimonial4",
    company: "Swiggy Instamart",
    role: "Talent Partner",
    testimonial: "We hired 30+ staff in just 5 days. Relevant, hyperlocal, and skilled Saathi Certified talent.",
  }
];

export const COMPANY_DATA = [
  {
    id: "company1",
    companyURL: "/images/testimonials/sis.svg",
  },
  {
    id: "company2",
    companyURL: "/images/testimonials/blinkit.svg",
  },
  {
    id: "company3",
    companyURL: "/images/testimonials/paytm.svg",
  },
  {
    id: "company4",
    companyURL: "/images/testimonials/zomato.svg",
  },
  {
    id: "company5",
    companyURL: "/images/testimonials/rapido.svg",
  },
  {
    id: "company6",
    companyURL: "/images/testimonials/zepto.svg",
  },
  {
    id: "company6",
    companyURL: "/images/testimonials/swiggy.svg",
  }
];