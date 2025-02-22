import React from "react";
import { StepComponentProps } from "../types";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

export const SuccessStep: React.FC<StepComponentProps> = ({ onNext, currentData, step, totalSteps }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="absolute left-0 top-0 w-full p-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            className="bg-green-500 h-2 rounded-full"
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-500 text-right">
          Step {step + 1} of {totalSteps}
        </div>
      </div>

      <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={() => onNext({})}>
        <X className="h-4 w-4" />
      </Button>

      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold mb-2"
      >
        Thank you for your submission!
      </motion.h2>

      {currentData?.email && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-6"
        >
          We'll be in touch at {currentData.email}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-left w-full max-w-md mb-8"
      >
        <h3 className="font-semibold mb-3">Next steps:</h3>
        <ul className="space-y-2 text-gray-600">
          <li>• Our team will review your project requirements</li>
          <li>• We'll prepare a detailed project roadmap</li>
          <li>• You'll receive an email to schedule a consultation</li>
        </ul>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Button onClick={() => onNext({})}>Close</Button>
      </motion.div>
    </motion.div>
  );
};

export default SuccessStep;
