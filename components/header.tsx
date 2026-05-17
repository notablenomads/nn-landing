"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { Menu, X } from "lucide-react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import WizardWrapper from "./landing/wizard/wizardComponent";

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
  className?: string;
  children: React.ReactNode;
}

interface NavItem {
  title: string;
  id: string;
}

interface HeaderProps {
  isChatOpen?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ className, children, ...props }, ref) => (
  <SheetPrimitive.Portal>
    <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0" />
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

const Header: React.FC<HeaderProps> = ({ isChatOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const navItems: NavItem[] = [
    { title: "About Us", id: "about" },
    { title: "Blogs", id: "blog" },
    { title: "Our Services", id: "services" },
    { title: "Contact Us", id: "contact" },
  ];

  const navItemVariants = {
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.2,
        ease: "easeOut" as const,
      },
    }),
    hidden: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn" as const,
      },
    },
  };

  const titleVariants = {
    initial: {
      opacity: 0,
      x: -20,
      width: 0,
      marginLeft: 0,
    },
    animate: {
      opacity: 1,
      x: 0,
      width: "auto",
      marginLeft: "1rem",
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      width: 0,
      marginLeft: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn" as const,
      },
    },
  };

  const handleScroll = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth" });
      }, 100);
      setIsOpen(false);
    }
  };

  return (
    <motion.header
      className={cn(
        "absolute top-0 left-0 right-0 bg-black/50 backdrop-blur-sm z-50",
        isChatOpen && "bg-black/80"
      )}
      initial={false}
    >
      <motion.div className="container mx-auto px-4 py-6">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex justify-between items-center">
          {/* Request a Quote Button */}
          <WizardWrapper />

          {/* Right side container for logo and nav items */}
          <motion.div className="flex items-center gap-8">
            {/* Navigation Items */}
            <AnimatePresence mode="wait">
              {!isChatOpen &&
                navItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    custom={i}
                    onClick={() => handleScroll(item.id)}
                    className="text-gray-400 text-lg cursor-pointer hover:text-gray-200
                                             transition-colors bg-transparent whitespace-nowrap"
                  >
                    {item.title}
                  </motion.button>
                ))}
            </AnimatePresence>

            {/* Logo and Title */}
            <motion.div className="flex items-center" layout>
              <div className="w-[75px] h-[75px] relative">
                <Image
                  src="/logo/new-nn-logo-dark.svg"
                  alt="logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <AnimatePresence mode="wait">
                {isChatOpen && (
                  <motion.h1
                    variants={titleVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="text-gray-200 text-2xl font-semibold overflow-hidden whitespace-nowrap"
                  >
                    Notable Nomads
                  </motion.h1>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-between items-center">
          {/* Mobile Quote Button */}
          <Button
            className="px-4 py-2 font-medium bg-secondary"
            onClick={() => handleScroll("quote")}
          >
            Quote
          </Button>

          {/* Logo and Title */}
          <motion.div className="flex items-center" layout>
            <div className="w-[50px] h-[50px] relative">
              <Image
                src="/logo/new-nn-logo-dark.svg"
                alt="logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <AnimatePresence mode="wait">
              {isChatOpen && (
                <motion.h1
                  variants={titleVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-gray-200 text-xl font-semibold overflow-hidden whitespace-nowrap"
                >
                  Notable Nomads
                </motion.h1>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Menu className="h-8 w-8 text-gray-200" />
            </SheetTrigger>
            <SheetContent className="bg-black/90 backdrop-blur-lg pt-12">
              <SheetClose
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background
                                                 transition-opacity hover:opacity-100 focus:outline-none
                                                 disabled:pointer-events-none"
              >
                <X className="h-8 w-8 text-gray-200" />
                <span className="sr-only">Close</span>
              </SheetClose>
              <motion.nav
                className="flex flex-col space-y-6 pt-16"
                initial="hidden"
                animate="visible"
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    custom={index}
                    variants={navItemVariants}
                    onClick={() => handleScroll(item.id)}
                    className="text-gray-400 text-2xl my-1.5 text-left hover:text-gray-200
                                                 transition-colors"
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
