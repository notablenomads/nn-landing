import React from "react";
import { StepComponentProps } from "../types";
import { useMotionValue, useMotionTemplate, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MotionValue } from "motion/react";
import ContactForm from "../../contact/contactForm";
import { Button } from "@/components/ui/button";

interface CardPatternProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  randomString: string;
}

const CardPattern = ({ mouseX, mouseY, randomString }: CardPatternProps) => {
  const maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-lg [mask-image:linear-gradient(white,transparent)] opacity-25 group-hover/card:opacity-50 bg-gradient-to-r from-secondary to-orange-700" />
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-secondary to-orange-700 opacity-20 group-hover/card:opacity-100 backdrop-blur-xl transition duration-500"
        style={style}
      />
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 mix-blend-overlay group-hover/card:opacity-100"
        style={style}
      >
        <p className="absolute inset-x-0 text-xs h-full break-words whitespace-pre-wrap text-white font-mono font-bold transition duration-500">
          {randomString}
        </p>
      </motion.div>
    </div>
  );
};

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
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

  React.useEffect(() => {
    const str = generateRandomString(1500);
    setRandomString(str);
  }, []);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
    const str = generateRandomString(1500);
    setRandomString(str);
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    onClick?.();
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
        onClick={handleClick}
        className={cn(
          "group/card rounded-lg w-full relative overflow-hidden bg-black/10 flex items-center justify-center px-12 py-6 cursor-pointer",
          variant === "secondary" && "py-4"
        )}
      >
        <CardPattern
          mouseX={mouseX}
          mouseY={mouseY}
          randomString={randomString}
        />
        <div className="relative z-10 flex items-center justify-center">
          <span
            className={cn(
              "text-white",
              variant === "primary" ? "text-2xl" : "text-xl"
            )}
          >
            {text}
          </span>
        </div>
      </div>
    </div>
  );
};

const WelcomeStep: React.FC<StepComponentProps> = ({ onNext }) => {
  const [showContactForm, setShowContactForm] = React.useState(false);

  if (showContactForm) {
    return (
      <div className="flex flex-col items-center gap-6 text-white">
        <ContactForm />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 text-white">
      <p className="text-xl text-center">
        Let's bring your project to life! Answer a few quick questions to get a
        free consultation & roadmap.
      </p>
      <p className="text-sm opacity-70">Takes ~3 minutes</p>
      <div className="flex flex-col gap-4 w-full max-w-xl">
        <EvervaultCard
          text="Begin Your Project Journey →"
          onClick={() => onNext({ started: true })}
          variant="primary"
        />
        <p className="text-center">Or</p>
        <Button
          onClick={() => setShowContactForm(true)}
          variant="default"
          size="lg"
        >
          Quick Contact Form →
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
