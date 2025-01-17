import React from "react";
import { motion } from "motion/react";
import TeamSection from "./teamSection";

const SecondSection = () => {
  return (
    <>
      <div className="w-full min-h-dvh text-white py-9 container mx-auto flex-col flex justify-center" id="about">
        <motion.h2
          className="text-5xl text-center font-bold tracking-tight text-white mb-4"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 2 }}
        >
          What is our Mission?
        </motion.h2>
        <motion.p
          className="text-center mt-4 text-md text-gray-200 mb-4 px-2"
          transition={{ ease: "easeInOut", delay: 0.5, duration: 2 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          At Notable Nomads, our vision is to bring together a team of experts to deliver practical, innovative solutions
          that address real-world challenges. We combine our skills and experience to create dependable results that help our
          clients succeed. With a focus on transparency and reliability, we work closely with clients to ensure our solutions
          meet their needs and drive lasting impact. Our goal is simple: to provide value and make a difference in the way
          work is done.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeIn", duration: 1 }}
        >
          <TeamSection />
        </motion.div>
      </div>
    </>
  );
};

export default SecondSection;
