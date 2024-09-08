"use client";
import React, { useRef } from "react";
import GitHubIcon from "../../../public/github-icon.svg";
import linkedInIcon from "../../../public/linkedin-icon.svg";
import Link from "next/link";
import Image from "next/image";
import emailjs from "@emailjs/browser";

const EmailSection = () => {
  const refForm = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_k63c0d9",
        "template_omxd5c2",
        refForm.current,
        "PxzxZUlUE9ra2On2c"
      )
      .then(
        () => {
          alert("Message successfully sent!");
          window.location.reload(false);
        },
        () => {
          alert("Failed to send the message, please try again");
        }
      );
  };
  return (
    <section
      className="grid md:grid-cols-2 my-12 md:my-12 py-24 gap-4 relative"
      id="contact"
    >
      <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900 to-transparent rounded-full h-60 w-80 z-0 blur-lg absolute top-3/4 -left-4 transform -translate-x-1/2 -translate-1/2"></div>
      <div className="z-10">
        <h5 className="text-xl font-bold text-white my-2">
          Let&apos;s Connect
        </h5>
        <p className="text-[#ADB7BE] mb-4 max-w-md">
          I&apos;m currently looking for new opportunities, my inbox is always
          open. Whether you have a question or just want to say hi, I&apos;ll
          try my best to get back to you!
        </p>
        <div className="socials flex flex-row gap-2">
          <Link
            target="_blank"
            rel="noreferrer"
            href="https://github.com/LokeshSunhare1999"
          >
            <Image src={GitHubIcon} alt="Github Icon" />
          </Link>
          <Link
            target="_blank"
            rel="noreferrer"
            href="https://www.linkedin.com/in/lokesh-sunhare-70b8261b0"
          >
            <Image src={linkedInIcon} alt="LinkedIn Icon" />
          </Link>
        </div>
      </div>
      <div>
        <form
          action=""
          className="flex flex-col"
          ref={refForm}
          onSubmit={sendEmail}
        >
          <div className="mb-6">
            <label
              htmlFor="email"
              className="text-white mb-2 block text-sm font-medium"
            >
              Your Full Name
            </label>
            <input
              type="name"
              id="name"
              name="name"
              required
              className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
              placeholder="Enter your full name"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="text-white mb-2 block text-sm font-medium"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
              placeholder="example@gmail.com"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="subject"
              className="text-white mb-2  block text-sm font-medium"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
              placeholder="Just saying hi"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="message"
              className="text-white mb-2  block text-sm font-medium"
            >
              Message
            </label>
            <textarea
              type="text"
              name="message"
              id="message"
              required
              className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
              placeholder="Let's talk about..."
            />
          </div>
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 px-5 rounded-lg w-full"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};
export default EmailSection;
