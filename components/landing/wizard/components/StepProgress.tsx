import React from "react";
import { motion } from "framer-motion";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <motion.div
      className="fixed top-0 left-0 w-full z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="w-full px-4 py-3 md:p-4 bg-black/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:justify-between text-xs md:text-sm text-zinc-400 mb-2">
          <motion.div
            className="flex items-center gap-2 mb-1 md:mb-0"
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#F5900D]/20 text-[#F5900D]">
              {currentStep + 1}
            </div>
            <span>of {totalSteps} Steps</span>
          </motion.div>
          <motion.span
            key={progress}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-right"
          >
            {Math.round(progress)}% Complete
          </motion.span>
        </div>
        <div className="w-full bg-zinc-800/50 rounded-full h-1 md:h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#F5900D] to-[#FFA940] rounded-full relative"
            initial={{ width: 0 }}
            animate={{
              width: `${progress}%`,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                mass: 0.5,
              },
            }}
          >
            <motion.div
              className="absolute top-0 right-0 h-full w-4 bg-white/20"
              animate={{
                opacity: [0, 1, 0],
                transition: {
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StepProgress;
