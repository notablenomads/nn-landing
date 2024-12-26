import React from "react";
import { motion } from "motion/react";
import TeamSection from "./teamSection";

const SecondSection = () => {
  return (
    <>
      <div
        className="w-full min-h-dvh text-white py-9 container mx-auto flex-col flex justify-center"
        id="about"
      >
        <motion.h2
          className="text-4xl text-center font-bold tracking-tight text-white mb-4"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 2 }}
        >
          What is our Mission?
        </motion.h2>
        <motion.p
          className="text-center mt-4 text-sm text-gray-200 mb-4"
          transition={{ ease: "easeInOut", delay: 0.5, duration: 2 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          We build powerful open-source tools that make development accessible to all creators, turning your ideas into reality.
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
