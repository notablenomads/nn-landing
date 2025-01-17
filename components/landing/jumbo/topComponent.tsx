import React, {useCallback, useState, useTransition} from "react";
import {AnimatePresence, motion} from "framer-motion";
import Header from "../../header";
import TechStackTower from "./tech";
import ChatComponent from "@/components/landing/chat/page";

const TopComponent: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const [effectsEnabled, setEffectsEnabled] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_isPending, startTransition] = useTransition();

    const handleChatOpen = useCallback(() => {
        setIsAnimatingOut(true);

        // Step 1: Start title exit animation
        setTimeout(() => {
            // Step 2: Start 3D model movement
            setIsChatOpen(true);

            // Step 3: After model is in position, enable neon effects
            setTimeout(() => {
                setEffectsEnabled(true);
                setIsAnimatingOut(false);
            }, 600); // Adjust timing based on model animation duration
        }, 500);
    }, []);


    const handleChatClose = useCallback(() => {
        // Start closing sequence
        setIsAnimatingOut(true);

        // First disable effects
        startTransition(() => {
            setEffectsEnabled(false);
        });

        // Give time for model to start moving before UI changes
        const timer1 = setTimeout(() => {
            startTransition(() => {
                setIsChatOpen(false);
            });

            // Reset states after everything is done
            const timer2 = setTimeout(() => {
                setIsAnimatingOut(false);
            }, 400);

            return () => clearTimeout(timer2);
        }, 300);

        return () => clearTimeout(timer1);
    }, []);

    const titleContainerVariants = {
        initial: {
            x: 0,
            opacity: 1
        },
        exit: {
            x: "-100%",
            opacity: 0,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
                opacity: {
                    duration: 0.3
                }
            }
        }
    };

    const titleVariants = {
        initial: {
            y: 0,
            opacity: 1
        },
        exit: {
            y: -20,
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    const descriptionVariants = {
        initial: {
            y: 0,
            opacity: 1
        },
        exit: {
            y: 20,
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    const chatComponentVariants = {
        initial: {
            opacity: 0,
            scale: 0.95,
            y: 20
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 20,
            transition: {
                duration: 0.3
            }
        }
    };


    return (
        <>
            <Header isChatOpen={isChatOpen}/>
            <TechStackTower withEffects={effectsEnabled} isChatOpen={isChatOpen}
            />

            <div className="title-container">
                <AnimatePresence mode="wait">
                    {!isChatOpen ? (
                        <motion.div
                            key="titles"
                            variants={titleContainerVariants}
                            initial="initial"
                            animate="initial"
                            exit="exit"
                        >
                            <motion.h1
                                className="title"
                                variants={titleVariants}
                                animate={isAnimatingOut ? "exit" : "initial"}
                            >
                                Notable Nomads
                            </motion.h1>
                            <motion.h1
                                className="description"
                                variants={descriptionVariants}
                                animate={isAnimatingOut ? "exit" : "initial"}
                            >
                                Wander, Discover, Create
                            </motion.h1>
                            <motion.button
                                className="mt-8 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full
                          text-gray-200 hover:bg-white/20 transition-colors
                          border border-gray-400/30"
                                onClick={handleChatOpen}
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                            >
                                Start Chat
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            variants={chatComponentVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="bg-black/80 backdrop-blur-md rounded-lg p-6 relative"
                            style={{
                                minWidth: "500px",
                                minHeight: "400px",
                                maxWidth: "90vw",
                                maxHeight: "70vh"
                            }}
                        >
                            <button
                                onClick={handleChatClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>

                            <div className="pt-8">
                                <ChatComponent/>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default TopComponent;