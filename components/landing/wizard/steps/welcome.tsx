import React from "react";
import { StepComponentProps } from "../types";
import { Button } from "@/components/ui/button";
import { useMotionValue, MotionValue, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ContactForm from "@/components/landing/contact/contactForm";

interface CardPatternProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  randomString: string;
}

const characters = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length)) + " ";
  }
  return result;
};

const CardPattern: React.FC<CardPatternProps> = ({ mouseX, mouseY, randomString }) => {
  const maskImage = React.useMemo(() => {
    return `radial-gradient(
      400px at ${mouseX}px ${mouseY}px,
      rgba(245, 144, 13, 0.4),
      transparent
    )`;
  }, [mouseX, mouseY]);

  return (
    <>
      <div className="absolute inset-0 bg-black/20 group-hover/card:bg-[#F5900D]/10 transition-colors duration-500" />
      <div className="absolute inset-0 overflow-hidden" style={{ maskImage, WebkitMaskImage: maskImage }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5900D]/20 to-[#FFA940]/20 group-hover/card:from-[#F5900D]/30 group-hover/card:to-[#FFA940]/30 transition-colors duration-500" />
        <div className="absolute inset-0 flex flex-wrap text-[12px] font-mono text-[#F5900D]/40 overflow-hidden select-none pointer-events-none leading-none tracking-wider">
          {randomString}
        </div>
      </div>

      {/* Enhanced glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
        {/* Corner shadows */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-[#F5900D]/20 blur-2xl rounded-full" />
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#F5900D]/20 blur-2xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-[#F5900D]/20 blur-2xl rounded-full" />
        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-[#F5900D]/20 blur-2xl rounded-full" />

        {/* Center glow */}
        <div className="absolute inset-0 bg-[#F5900D]/20 blur-xl rounded-full" />

        {/* Animated border */}
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#F5900D] via-[#FFA940] to-[#F5900D] opacity-30 animate-border-flow"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>
      </div>

      {/* Inner shadow for depth */}
      <div className="absolute inset-0 rounded-lg shadow-inner opacity-50 pointer-events-none" />
    </>
  );
};

const EvervaultCard = ({
  text,
  className,
  onClick,
  variant = "primary",
}: {
  text?: string;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [randomString, setRandomString] = React.useState("");
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    const str = generateRandomString(1000);
    setRandomString(str);

    if (isHovered) {
      const interval = setInterval(() => {
        setRandomString(generateRandomString(1000));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        "p-0.5 bg-transparent flex items-center justify-center relative group",
        variant === "secondary" && "opacity-90 hover:opacity-100",
        className
      )}
    >
      <div
        onMouseMove={onMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        className={cn(
          "group/card rounded-lg w-full relative overflow-hidden bg-black/20 flex items-center justify-center px-12 py-8 cursor-pointer transition-all duration-500",
          "hover:bg-[#F5900D]/10 border border-[#F5900D]/20 hover:border-[#F5900D]/40",
          "shadow-[0_0_30px_-5px_rgba(245,144,13,0.3)] hover:shadow-[0_0_40px_-5px_rgba(245,144,13,0.5)]",
          variant === "secondary" && "py-4"
        )}
      >
        <CardPattern mouseX={mouseX} mouseY={mouseY} randomString={randomString} />
        <motion.div
          className="relative z-10 flex items-center justify-center w-full"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <span
            className={cn(
              "text-white w-full text-center transition-all duration-500",
              variant === "primary" ? "text-3xl font-bold" : "text-xl",
              "group-hover/card:text-orange-50 group-hover/card:font-bold tracking-wider",
              "drop-shadow-[0_2px_10px_rgba(245,144,13,0.5)]"
            )}
          >
            {text}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

const WelcomeStep: React.FC<StepComponentProps> = ({ onNext }) => {
  const [showContactForm, setShowContactForm] = React.useState(false);

  const handleNext = () => {
    onNext({});
  };

  if (showContactForm) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4 md:px-0">
        <div className="w-full bg-black/20 rounded-lg p-6 md:p-8 backdrop-blur-sm border border-white/10 shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Quick Contact Form</h2>
          <ContactForm onBack={() => setShowContactForm(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 text-white px-4 md:px-0 w-full max-w-2xl mx-auto">
      <p className="text-xl text-center">
        Let's bring your project to life! Answer a few quick questions to get a free consultation & roadmap.
      </p>
      <p className="text-sm opacity-70">Takes ~3 minutes</p>
      <div className="flex flex-col gap-4 w-full">
        <EvervaultCard text="Begin Your Project Journey →" onClick={handleNext} variant="primary" />
        <p className="text-center">Or</p>
        <Button
          onClick={() => setShowContactForm(true)}
          variant="default"
          size="lg"
          className="bg-gradient-to-br from-[#F5900D] to-[#F5900D]/80 hover:from-[#FFA940] hover:to-[#F5900D] text-black font-medium shadow-[0_0_15px_rgba(245,144,13,0.3)] hover:shadow-[0_0_20px_rgba(245,144,13,0.5)] transition-all duration-300"
        >
          Quick Contact Form →
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
