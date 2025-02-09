import React, { useCallback, useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "../../header";
import TechStackTower from "./tech";
import ChatComponent from "@/components/landing/chat/page";
import { Button } from "@/components/ui/button";
import "./styles.css";

const TopComponent: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [effectsEnabled, setEffectsEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isPending, startTransition] = useTransition();

  // Handle window resize and detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile(); // Initial check
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleChatOpen = useCallback(() => {
    setIsAnimatingOut(true);

    setTimeout(() => {
      setIsChatOpen(true);
      setTimeout(() => {
        // Only enable effects on desktop
        if (!isMobile) {
          setEffectsEnabled(true);
        }
        setIsAnimatingOut(false);
      }, 600);
    }, 500);
  }, [isMobile]);

  const handleChatClose = useCallback(() => {
    setIsAnimatingOut(true);
    startTransition(() => {
      setEffectsEnabled(false);
    });
    const timer1 = setTimeout(() => {
      startTransition(() => {
        setIsChatOpen(false);
      });
      const timer2 = setTimeout(() => {
        setIsAnimatingOut(false);
      }, 400);

      return () => clearTimeout(timer2);
    }, 300);

    return () => clearTimeout(timer1);
  }, []);

  // Animation variants remain the same
  const titleContainerVariants = {
    initial: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        opacity: {
          duration: 0.3,
        },
      },
    },
  };

  const titleVariants = {
    initial: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const descriptionVariants = {
    initial: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: 20,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const chatComponentVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <>
      <Header isChatOpen={isChatOpen} />
      <TechStackTower
        withEffects={!isMobile && effectsEnabled}
        isChatOpen={!isMobile && isChatOpen}
      />

      {/* Main container with flex layout */}
      <div className="w-full min-h-dvh flex items-end sm:items-center pt-[98px]">
        {/* Content wrapper with responsive positioning */}
        <div className="w-full flex md:justify-start justify-center md:items-center items-end md:px-24 px-0 md:pb-0">
          <AnimatePresence mode="wait">
            {!isChatOpen ? (
              <motion.div
                key="titles"
                variants={titleContainerVariants}
                initial="initial"
                animate="initial"
                exit="exit"
                className="text-center w-full md:max-w-lg px-4 mb-6 sm:mb-1"
              >
                <motion.h1
                  className="title"
                  variants={titleVariants}
                  animate={isAnimatingOut ? "exit" : "initial"}
                >
                  Notable Nomads
                </motion.h1>
                <motion.h1
                  className="description mb-1"
                  variants={descriptionVariants}
                  animate={isAnimatingOut ? "exit" : "initial"}
                >
                  Turning Visions Into Reality
                </motion.h1>
                <motion.div
                  className="mt-8 gradient-border-wrap"
                  onClick={handleChatOpen}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button className="relative w-full bg-gray-950 inner-shadow py-3 text-xl h-full ai-btn">
                    Nomad AI Chat Bot
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                variants={chatComponentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`bg-black/80 backdrop-blur-md md:rounded-lg md:p-6 relative w-full 
                                ${
                                  isMobile
                                    ? "h-[calc(100vh-98px)] p-0"
                                    : "md:w-auto"
                                }`}
              >
                <div className={`${isMobile ? "h-full pt-0" : "pt-8"}`}>
                  <ChatComponent
                    onClose={handleChatClose}
                    className={isMobile ? "h-full" : ""}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default TopComponent;
