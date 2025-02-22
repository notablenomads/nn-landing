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

      {/* New glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-[#F5900D]/20 blur-xl rounded-full" />
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#F5900D] via-[#FFA940] to-[#F5900D] opacity-30 animate-border-flow"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>
      </div>
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
        "p-0.5 bg-transparent flex items-center justify-center relative",
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
          "group/card rounded-lg w-full relative overflow-hidden bg-black/20 flex items-center justify-center px-12 py-8 cursor-pointer transition-all duration-500 hover:bg-[#F5900D]/10 border border-[#F5900D]/20 hover:border-[#F5900D]/40",
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
              "group-hover/card:text-orange-50 group-hover/card:font-bold tracking-wider drop-shadow-lg"
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
      <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
        <div className="w-full bg-black/20 rounded-lg p-8 backdrop-blur-sm border border-white/10">
          <h2 className="text-2xl font-bold mb-6 text-center">Quick Contact Form</h2>
          <ContactForm onBack={() => setShowContactForm(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 text-white">
      <p className="text-xl text-center">
        Let's bring your project to life! Answer a few quick questions to get a free consultation & roadmap.
      </p>
      <p className="text-sm opacity-70">Takes ~3 minutes</p>
      <div className="flex flex-col gap-4 w-full max-w-xl">
        <EvervaultCard text="Begin Your Project Journey →" onClick={handleNext} variant="primary" />
        <p className="text-center">Or</p>
        <Button onClick={() => setShowContactForm(true)} variant="default" size="lg">
          Quick Contact Form →
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
