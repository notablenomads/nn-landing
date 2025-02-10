import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface SimplePopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SimplePopup: React.FC<SimplePopupProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const [mounted, setMounted] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex flex-col items-center"
          style={{ zIndex: 50 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full h-screen z-10 bg-black bg-opacity-95 backdrop-blur-xl overflow-hidden"
          >
            {children}

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={onClose}
              className="absolute top-10 z-10 left-10 text-white hover:text-gray-200 transition-colors bg-transparent"
            >
              <X size={isMobile ? 32 : 68} />
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SimplePopup;
