import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SlidingPopupProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    title?: string;
}
const videoSrc = './popup-video.mp4'
const SlidingPopup: React.FC<SlidingPopupProps> = ({
                                                       isOpen,
                                                       onClose,
                                                       children,
                                                       title = "Popup Title" // Default title
                                                   }) => {
    const [mounted, setMounted] = React.useState<boolean>(false);
    const [videoLoaded, setVideoLoaded] = React.useState<boolean>(false);

    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    const PopupContent: React.ReactElement = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0  flex flex-col items-center" style={{zIndex:99999999}}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-70"
                        onClick={onClose}
                    />

                    {/* Popup Content */}
                    <motion.div
                        initial={{ y: '-100%' }}
                        animate={{ y: '0' }}
                        exit={{ y: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200, duration: 3000 }}
                        className="relative w-full h-screen z-50 overflow-hidden"
                        style={{
                            backgroundColor: '#151515'
                        }}
                    >
                        {/* Video Background */}
                        {videoSrc && (
                            <div className="absolute inset-0 z-0">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    onLoadedData={() => setVideoLoaded(true)}
                                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
                                        videoLoaded ? 'opacity-50' : 'opacity-0'
                                    }`}
                                    src={videoSrc}
                                />
                                <div className="absolute inset-0 bg-[#151515]/80" /> {/* Overlay to maintain theme */}
                            </div>
                        )}

                        {/* Content Container */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 3 } }}
                            transition={{
                                delay: 0.4,
                                duration: 0.3,
                            }}
                            className="relative z-10 w-2/3 mx-auto h-full p-6 text-white flex flex-col justify-center"
                        >
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ delay: 0.5, duration: 0.3 }}
                                className="text-5xl font-extralight mb-4 text-center"
                            >
                                {title}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ delay: 0.6, duration: 0.3 }}
                                className="text-md text-gray-300 opacity-70 font-light text-justify sm:text-center"
                            >
                                {children}
                            </motion.p>
                        </motion.div>
                    </motion.div>

                    {/* Close Button Section with Cloud Effect */}
                    <motion.div
                        onClick={onClose}
                        className="absolute top-10 left-10 overflow-hidden z-50 cursor-pointer b"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <motion.button
                            onClick={onClose}
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.95}}
                            className="text-white hover:text-gray-200 transition-colors bg-transparent"
                        >
                            <X size={68}/>
                        </motion.button>
                    </motion.div>


                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(PopupContent, document.body);
};

export default SlidingPopup