import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import MatrixBackground from "@/components/matrixEffect";

const SuccessStep = () => {
  return (
    <div className="relative w-full h-[100dvh] overflow-hidden">
      {/* Background Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 2,
          duration: 1.5,
          ease: "easeInOut",
        }}
        className="absolute inset-0 z-0"
      >
        <MatrixBackground isHovered={true} className="w-full h-full" />
      </motion.div>

      {/* Content Animation */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 3,
            duration: 1,
            ease: "easeOut",
          }}
          className="flex flex-col items-center justify-center bg-black/50 p-8 backdrop-blur-[2px] w-full h-[100dvh]"
        >
          <div className="max-w-md">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 3.2,
                duration: 0.5,
                type: "spring",
                stiffness: 200,
              }}
            >
              <CheckCircle2 className="h-32 w-32 text-green-500 mx-auto" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 3.4,
                duration: 0.5,
              }}
              className="text-4xl font-bold text-white mt-4 text-center"
            >
              Thank You!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 3.6,
                duration: 0.5,
              }}
              className="text-gray-200 mt-2 text-center text-lg"
            >
              We've received your information and will be in touch shortly. Our
              team will review your requirements and get back to you within 1-2
              business days.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessStep;
