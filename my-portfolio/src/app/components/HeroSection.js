"use client";
import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-12 mt-20">
        <motion.div
          initial={{ opacity: 1, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="col-span-7 place-self-center text-center sm:text-left"
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
                "Web Devloper",
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
            Frontend developer with 2+ years of experience building web
            applications using React.js/Next.js and modern JavaScript
            tools/frameworks.
          </p>
          <div>
            {/* <button className="px-6 py-3 w-full sm:w-fit rounded-full mr-4 bg-gradient-to-br from-blue-500 via-primary-500 to-secondary-500 hover:bg-slate-200 text-black">
              Hire Me
            </button> */}
            <button
              target="_blank"
              onClick={() =>
                window.open(
                  "https://suesys.s3.amazonaws.com/storage/user_pf_doc/1711387368_1711387008987417.pdf"
                )
              }
              className="px-1 py-1 w-full sm:w-fit rounded-full bg-transparent bg-gradient-to-br from-blue-500 via-primary-500 to-secondary-500 hover:bg-slate-800 text-white mt-4"
            >
              <span className="block bg-[#121212] hover:bg-slate-800 rounded-full px-5 py-2">
                Download CV
              </span>
            </button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 1, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="col-span-5 place-self-center mt-4 lg:text-xl"
        >
          <div className="rounded-full bg-[#181818] w-[250px] h-[250px] lg:w-[355px] lg:h-[355px] relative">
            <Image
              src="/images/LokeshHero.jpg"
              alt="hero image"
              className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              width={350}
              height={350}
              style={{ borderRadius: "50%" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
