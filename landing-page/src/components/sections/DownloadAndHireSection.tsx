import Link from "next/link";
import { FaGlobe } from "react-icons/fa";
import Image from "next/image";

export default function DownloadAndHireSection() {
  return (
    <section className="bg-black py-16 w-full">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center px-2 md:px-0">
        {/* Left Side: Post a Reel */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left px-2 md:px-8">
          <h2 className="text-4xl md:text-[40px] font-bold text-white mb-2">
            Post a <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">Reel</span>
          </h2>
          <p className="text-gray-400 text-2xl md:text-[40px] mb-8">Get a Job</p>
          <a 
            href="https://play.google.com/store/apps/details?id=in.saathi&pcampaignid=web_share"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-black font-semibold px-8 py-3 rounded-md shadow transition hover:scale-105 text-lg md:text-xl">
              <Image src="/assets/home/playstore.svg" alt="Play Store" width={24} height={24} /> Download Now
            </button>
          </a>
        </div>
        {/* Divider */}
        <div className="hidden md:block h-40 w-px bg-gray-600 mx-8" />
        {/* Right Side: Post a Job */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left px-2 md:px-8 mt-12 md:mt-0">
          <h2 className="text-4xl md:text-[40px] font-bold text-white mb-2">
            Post a <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">Job</span>
          </h2>
          <p className="text-gray-400 text-2xl md:text-[40px] mb-8">Get a Candidate</p>
          <Link href="/business-sub">
            <button className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-black font-semibold px-8 py-3 rounded-md shadow transition hover:scale-105 text-lg md:text-xl">
              <FaGlobe className="text-xl" /> Hire Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
} 