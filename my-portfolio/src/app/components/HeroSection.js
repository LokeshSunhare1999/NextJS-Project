"use client";
import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { RESUME_URL } from "@/constant";
import { CreativeHero } from "./CreativeHero";

const HeroSection = () => {
  return (
    <section>
      <div className="flex flex-col md:flex-row mt-20">
        <motion.div
          initial={{ opacity: 1, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 place-self-center text-center md:text-left mr-8"
        >
          <h1 className="text-white mb-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">
              Hello, I&apos;m
            </span>
            <br />
            <TypeAnimation
              sequence={[
                "Lokesh",
                1000,
                "Frontend Devloper",
                1000,
                "Next.js Devloper",
                1000,
                "React.js Devloper",
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </h1>
          <p className="text-[#ADB7BE] text-base sm:text-lg mb-6 lg:text-xl">
            Frontend developer with 3+ years of experience building web
            applications using React.js/Next.js and modern JavaScript
            tools/frameworks.
          </p>
          <div>
            <button
              target="_blank"
              onClick={() =>
                window.open(RESUME_URL, "_blank", "noopener,noreferrer")
              }
              className="px-1 py-1 w-full sm:w-fit rounded-full bg-transparent bg-gradient-to-br from-blue-500 via-primary-500 to-secondary-500 hover:bg-slate-800 text-white mt-4"
            >
              <span className="block bg-[#121212] hover:bg-slate-800 rounded-full px-5 py-2">
                Download CV
              </span>
            </button>
          </div>
        </motion.div>
        <div className="w-full md:w-1/2 relative mt-10 md:mt-0">
          <CreativeHero />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
