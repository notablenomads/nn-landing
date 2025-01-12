"use client";
import {motion} from "framer-motion";
import Image from "next/image";
import React from "react";

const Header = () => {
    const navItems = [
        {title: "About Us", id: "about"},
        {title: "Portfolio", id: "portfolio"},
        {title: "Our Services", id: "services"},
        {title: "Contact Us", id: "contact"}
    ];

    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: {y: 20, opacity: 0},
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "ease",
                duration: 1,
                stiffness: 100,
                damping: 10
            }
        }
    };

    const handleScroll = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-sm" style={{zIndex: 1000}}
        >
            <motion.div
                className="container mx-auto px-4 py-6"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    zIndex: 100,
                }}
            >
                {/* First two nav items */}
                {navItems.slice(0, 2).map((item) => (
                    <motion.button
                        key={item.id}
                        variants={itemVariants}
                        onClick={() => handleScroll(item.id)}
                        className="text-gray-400 text-sm sm:text-lg cursor-pointer hover:text-gray-200 transition-colors bg-transparent z-50"
                    >
                        {item.title}
                    </motion.button>
                ))}

                {/* Logo */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 10,
                        delay: 0.5
                    }}
                >
                    <Image
                        src="/logo/new-nn-logo-dark.svg"
                        alt="logo"
                        width={75}
                        height={75}
                        priority
                    />
                </motion.div>

                {navItems.slice(2, 4).map((item) => (
                    <motion.button
                        key={item.id}
                        variants={itemVariants}
                        onClick={() => handleScroll(item.id)}
                        className="text-gray-400 text-sm cursor-pointer sm:text-lg hover:text-gray-200 transition-colors bg-transparent z-50"
                    >
                        {item.title}
                    </motion.button>
                ))}
            </motion.div>
        </motion.header>
    );
};

export default Header;