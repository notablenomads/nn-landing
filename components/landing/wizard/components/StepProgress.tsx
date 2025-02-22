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
      <div className="w-full p-4 bg-black/50 backdrop-blur-sm">
        <div className="flex justify-between text-sm text-zinc-400 mb-2">
          <motion.span
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            Step {currentStep + 1} of {totalSteps}
          </motion.span>
          <motion.span
            key={progress}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {Math.round(progress)}% Complete
          </motion.span>
        </div>
        <div className="w-full bg-zinc-800/50 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#F5900D] to-[#FFA940] rounded-full"
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
