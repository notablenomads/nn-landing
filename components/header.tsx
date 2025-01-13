"use client";
import {motion} from "framer-motion";
import Image from "next/image";
import React from "react";
import {Menu, X} from "lucide-react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import {cn} from "@/lib/utils";

interface SheetContentProps
    extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
    className?: string;
    children: React.ReactNode;
}

interface NavItem {
    title: string;
    id: string;
}

// Custom SheetContent component without default close button
const SheetContent = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Content>,
    SheetContentProps
>(({className, children, ...props}, ref) => (
    <SheetPrimitive.Portal>
        <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0"/>
        <SheetPrimitive.Content
            ref={ref}
            className={cn(
                "fixed z-50 gap-4 bg-background p-6 transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%] inset-x-0 top-0 ",
                className
            )}
            {...props}
        >
            {children}
        </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
));
SheetContent.displayName = "SheetContent";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const navItems: NavItem[] = [
        {title: "About Us", id: "about"},
        {title: "Blogs", id: "blog"},
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
    } as const;

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
    } as const;

    const mobileMenuVariants = {
        hidden: {y: -20, opacity: 0},
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    } as const;

    const handleScroll = (id: string): void => {
        const element = document.getElementById(id);
        if (element) {
            // Using setTimeout to ensure the mobile menu closes before scrolling
            setTimeout(() => {
                element.scrollIntoView({behavior: "smooth"});
            }, 100);
            setIsOpen(false);
        }
    };

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-sm z-50"
        >
            <motion.div
                className="container mx-auto px-4 py-6"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Desktop Navigation */}
                <div className="hidden md:flex justify-between items-center">
                    {/* First two nav items */}
                    {navItems.slice(0, 2).map((item) => (
                        <motion.button
                            key={item.id}
                            variants={itemVariants}
                            onClick={() => handleScroll(item.id)}
                            className="text-gray-400 text-lg cursor-pointer hover:text-gray-200 transition-colors bg-transparent"
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

                    {/* Last two nav items */}
                    {navItems.slice(2, 4).map((item) => (
                        <motion.button
                            key={item.id}
                            variants={itemVariants}
                            onClick={() => handleScroll(item.id)}
                            className="text-gray-400 text-lg cursor-pointer hover:text-gray-200 transition-colors bg-transparent"
                        >
                            {item.title}
                        </motion.button>
                    ))}
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex justify-between items-center">
                    <Image
                        src="/logo/new-nn-logo-dark.svg"
                        alt="logo"
                        width={50}
                        height={50}
                        priority
                    />

                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Menu className="h-8 w-8 text-gray-200"/>
                        </SheetTrigger>
                        <SheetContent className="bg-black/90 backdrop-blur-lg pt-12">
                            <SheetClose
                                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none">
                                <X className="h-8 w-8 text-gray-200"/>
                                <span className="sr-only">Close</span>
                            </SheetClose>
                            <motion.nav
                                initial="hidden"
                                animate="visible"
                                variants={mobileMenuVariants}
                                className="flex flex-col space-y-6 pt-16"
                            >
                                {navItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        variants={{
                                            hidden: {x: -20, opacity: 0},
                                            visible: {
                                                x: 0,
                                                opacity: 1,
                                                transition: {
                                                    delay: index * 0.1,
                                                    duration: 0.5
                                                }
                                            }
                                        }}
                                        onClick={() => handleScroll(item.id)}
                                        className="text-gray-400 text-2xl my-1.5 text-left hover:text-gray-200 transition-colors"
                                    >
                                        {item.title}
                                    </motion.div>
                                ))}
                            </motion.nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </motion.div>
        </motion.header>
    );
};

export default Header;