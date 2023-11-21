"use client";
import React, { useRef } from "react";
import ProjectCard from "./ProjectCard";
import { animate, motion, useInView } from "framer-motion";

const projectsData = [
  {
    id: 1,
    title: "Prompt search website",
    description: "Read and create intersting prompts",
    image: "/images/projects/1.png",
    tag: ["All", "Web"],
    gitUrl:
      "https://github.com/LokeshSunhare1999/NextJS-Project/tree/main/prmoptSite",
    previewUrl: "https://prompt-site-ruby.vercel.app/",
  },
  {
    id: 2,
    title: "Team Members Allocation",
    description: "Allocate the team members according to need",
    image: "/images/projects/2.png",
    tag: ["All", "Web"],
    gitUrl: "https://replit.com/@lokeshsunhare/TeamMemberAllocation",
    previewUrl: "https://team-member-allocation-black.vercel.app/",
  },
  {
    id: 3,
    title: "Movie Land",
    description: "Search favorite Movies",
    image: "/images/projects/3.png",
    tag: ["All", "Web"],
    gitUrl:
      "https://github.com/LokeshSunhare1999/React_Projects/tree/main/movie-land",
    previewUrl: "https://movie-land-lyart.vercel.app/",
  },
];

const ProjectSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };
  return (
    <section ref={ref}>
      <h2 className="text-center text-4xl font-bold text-white mt-4 mb-8 md:mb-12">
        My Projects
      </h2>
      <div className="text-white flex flex-row justify-center items-center gap-2 py-6">
        <ul ref={ref} className="grid md:grid-cols-3 gap-8 md:gap-12">
          {projectsData.map((project, index) => (
            <motion.li
              key={index}
              variants={cardVariants}
              initial="initial"
              animate={isInView ? "animate" : "initila"}
              transition={{ duration: 0.3, delay: index * 0.4 }}
            >
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                imgUrl={project.image}
                previewUrl={project.previewUrl}
                gitUrl={project.gitUrl}
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ProjectSection;
