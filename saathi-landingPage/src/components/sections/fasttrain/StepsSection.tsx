"use client";

import { useState } from "react";

// Define the structure for each step in the process
type StepItem = {
  id: string;
  title: string;
  color: string;
};

// Array of steps with their respective titles and gradient colors
const steps: StepItem[] = [
  {
    id: "choose-post",
    title: "Job Training like never before",
    color: "from-pink-500 to-purple-600"
  },
  {
    id: "select-goal",
    title: "Web Series like Edutainment on Mobile",
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: "define-audience",
    title: "Higher engagement. Easier Understanding. Faster completion.",
    color: "from-indigo-500 to-blue-600"
  },
  {
    id: "set-budget",
    title: "Get Assessed & Get Certified",
    color: "from-blue-500 to-cyan-600"
  },
];

export default function StepsSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  return (
    <section className="w-full h-full">
      <div className="container mx-auto px-5 md:px-10 lg:px-16 space-y-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 items-center">
          {/* Left Side - Phone Image */}
          <div className="relative h-full flex items-center justify-center order-2 md:order-1">
            <div className="relative w-64 h-[500px] mx-auto bg-black rounded-[40px] border-8 border-black overflow-hidden shadow-[0_0_50px_rgba(236,72,153,0.3)] phone-glow">
              <div
                className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"
                style={{
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.9)'
                }}
              >
                {/* Phone content placeholder */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black rounded-full" />
              </div>
            </div>
          </div>

          {/* Right Side - Steps Text */}
          <div className="relative min-h-[400px] flex flex-col justify-center order-1 md:order-2">
            <div className="h-full">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`transition-all duration-500 ease-in-out ${
                    selectedIndex === index
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8 absolute pointer-events-none'
                  }`}
                >
                  <div className="p-4">
                    <div className="space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-white">{step.title}</h2>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination dots */}
            <div className="flex md:flex-col gap-2 mt-6 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 md:mr-[-2rem]">
              {steps.map((step, index) => (
                <button
                  key={`dot-${step.id}`}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    selectedIndex === index
                      ? 'bg-pink-500 scale-150'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 