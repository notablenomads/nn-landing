import React from "react";
import { StepComponentProps } from "../types";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export const SuccessStep: React.FC<StepComponentProps> = ({ onNext, currentData }) => {
  // Get the close function from the parent component
  const handleClose = () => {
    // Instead of trying to go to next step, we'll just pass empty data
    // which signals to the parent to close the wizard
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto"
    >
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="mb-8">
        <CheckCircle className="h-20 w-20 text-green-500" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold mb-4 text-white"
      >
        Thank you for your submission!
      </motion.h2>

      {currentData?.email && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-zinc-300 mb-8"
        >
          We'll be in touch at {currentData.email}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-left w-full bg-white/5 rounded-lg p-6 mb-8"
      >
        <h3 className="text-2xl font-semibold mb-4 text-white">Next steps:</h3>
        <ul className="space-y-4">
          <li className="flex items-center text-zinc-300">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-4 text-green-500">
              1
            </div>
            <span>Our team will review your project requirements</span>
          </li>
          <li className="flex items-center text-zinc-300">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-4 text-green-500">
              2
            </div>
            <span>We'll prepare a detailed project roadmap</span>
          </li>
          <li className="flex items-center text-zinc-300">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-4 text-green-500">
              3
            </div>
            <span>You'll receive an email to schedule a consultation</span>
          </li>
        </ul>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Button onClick={handleClose} size="lg" className="min-w-[200px]">
          Close
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default SuccessStep;
