import React from "react";
import { motion } from "framer-motion";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-sm">
      <div className="w-full p-4">
        <div className="flex justify-between text-sm text-zinc-400 mb-2">
          <span>
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            className="bg-secondary h-1 rounded-full"
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default StepProgress;
