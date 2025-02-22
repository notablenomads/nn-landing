import React from "react";
import { StepComponentProps } from "../types";
import { Button } from "@/components/ui/button";
import { useMotionValue, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import ContactForm from "@/components/landing/contact/contactForm";

interface CardPatternProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  randomString: string;
}

const CardPattern: React.FC<CardPatternProps> = ({ mouseX, mouseY, randomString }) => {
  const maskImage = React.useMemo(() => {
    return `radial-gradient(
      300px at ${mouseX}px ${mouseY}px,
      white,
      transparent
    )`;
  }, [mouseX, mouseY]);

  return (
    <>
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 overflow-hidden" style={{ maskImage, WebkitMaskImage: maskImage }}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 flex flex-wrap text-[8px] opacity-30 overflow-hidden select-none pointer-events-none">
          {randomString}
        </div>
      </div>
    </>
  );
};

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
        onClick={onClick}
        className={cn(
          "group/card rounded-lg w-full relative overflow-hidden bg-black/10 flex items-center justify-center px-12 py-6 cursor-pointer",
          variant === "secondary" && "py-4"
        )}
      >
        <CardPattern mouseX={mouseX} mouseY={mouseY} randomString={randomString} />
        <div className="relative z-10 flex items-center justify-center">
          <span className={cn("text-white", variant === "primary" ? "text-2xl" : "text-xl")}>{text}</span>
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
        Let's bring your project to life! Answer a few quick questions to get a free consultation & roadmap.
      </p>
      <p className="text-sm opacity-70">Takes ~3 minutes</p>
      <div className="flex flex-col gap-4 w-full max-w-xl">
        <EvervaultCard text="Begin Your Project Journey →" onClick={() => onNext({})} variant="primary" />
        <p className="text-center">Or</p>
        <Button onClick={() => setShowContactForm(true)} variant="default" size="lg">
          Quick Contact Form →
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
