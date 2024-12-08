import React from "react";
import { motion } from "motion/react";
import TeamSection from "./teamSection";
import CustomCursor from "../../utils/cursor";
const SecondSection = () => {
  return (
    <>
      <CustomCursor />
      <div className="w-full h-full text-white py-9 container mx-auto">
        <motion.h2
          className="font-extralight text-7xl text-center"
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
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using 'Content here, content here', making it
          look like readable English. Many desktop publishing packages and web
          page editors now use Lorem Ipsum as their default model text, and a
          search for 'lorem ipsum' will uncover many web sites still in their
          infancy. Various versions have evolved over the years, sometimes by
          accident, sometimes on purpose (injected humour and the like).
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
