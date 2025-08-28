import Link from "next/link";

export default function DownloadAppSection() {
  return (
    <section className="bg-[#09090B] py-16 md:py-32">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="max-w-full mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Post a <span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">Job</span> & Get <span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">Candidates</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl mb-8">
            Register your business and post jobs to get Candidates.
          </p>
          <Link href="/get-started">
            <div className="inline-flex items-center justify-center bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] font-semibold shadow-lg transition px-8 py-3 rounded-full text-black">
              Get Started Now
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
