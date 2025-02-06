import React from "react";
import { debounce } from "lodash";
import {
  motion,
  useSpring,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";

interface StepComponentProps {
  onNext: (data?: Record<string, unknown>) => void;
  currentData?: Record<string, unknown>;
  step?: number;
  totalSteps?: number;
}

interface WizardStep {
  header: string;
  description: string;
  content: (props: StepComponentProps) => JSX.Element;
}

interface WizardContentProps {
  steps: WizardStep[];
  onComplete: (data: Record<string, unknown>) => void;
  onStepChange?: (stepIndex: number) => void;
}

export const WizardContent: React.FC<WizardContentProps> = ({
  steps,
  onComplete,
  onStepChange,
}) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [wizardData, setWizardData] = React.useState<Record<string, unknown>>(
    {}
  );
  const [width, setWidth] = React.useState(600);
  const dividerRef = React.useRef<HTMLDivElement>(null);
  const lastTouchTime = React.useRef<number>(Date.now());

  // Motion values for touch effect
  const touchX = useMotionValue(0);
  const springX = useSpring(touchX, {
    stiffness: 150,
    damping: 15,
    mass: 0.5,
  });
  const lastCursorSpeed = React.useRef<number>(0);
  const effectProgress = useMotionValue(0);
  const springProgress = useSpring(effectProgress, {
    stiffness: 35,
    damping: 8,
    mass: 1,
  });

  // Handle next step and data collection
  const handleNext = (stepData?: Record<string, unknown>) => {
    if (stepData) {
      setWizardData((prev) => ({ ...prev, ...stepData }));
    }

    if (currentStep === steps.length - 1) {
      const finalData = stepData ? { ...wizardData, ...stepData } : wizardData;
      onComplete(finalData);
    } else {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    }
  };

  // Update width on mount and window resize
  React.useEffect(() => {
    const updateWidth = () => {
      if (dividerRef.current) {
        setWidth(dividerRef.current.clientWidth);
      }
    };

    // Initial update
    updateWidth();

    // Handle resize events
    const debouncedUpdateWidth = debounce(updateWidth, 100);
    window.addEventListener("resize", debouncedUpdateWidth);

    return () => {
      window.removeEventListener("resize", debouncedUpdateWidth);
      debouncedUpdateWidth.cancel();
    };
  }, []);

  const pathD = useTransform([springX, springProgress], (latest: number[]) => {
    const [x, progress] = latest;
    if (progress === 0) return `M 0 0 L ${width} 0`;

    const points: string[] = [`M 0 0`];
    const cursorSpeed = lastCursorSpeed.current;
    const amplitude = Math.min(Math.max(cursorSpeed * 0.5, 20), 80) * progress;
    const frequency = 0.1;
    const wavelength = 100;

    for (let i = 0; i <= width; i += 2) {
      const distanceFromTouch = Math.abs(i - x);
      const decay = Math.exp(-distanceFromTouch / wavelength);
      const y = Math.sin((i - x) * frequency) * amplitude * decay;
      points.push(`L ${i} ${y}`);
    }

    return points.join(" ");
  });

  // Handle mouse movement for divider animation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dividerRef.current) return;

    const currentTime = Date.now();
    const timeSinceLastTouch = currentTime - lastTouchTime.current;

    if (timeSinceLastTouch > 100) {
      const rect = dividerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;

      const cursorSpeed = Math.abs(e.movementX);
      lastCursorSpeed.current = cursorSpeed;

      touchX.jump(relativeX);
      effectProgress.set(1);

      setTimeout(() => {
        effectProgress.set(0);
      }, 175);

      lastTouchTime.current = currentTime;
    }
  };

  // Render current step content
  const renderStepContent = () => {
    const currentStepData = steps[currentStep];
    return currentStepData.content({
      onNext: handleNext,
      currentData: wizardData,
      step: currentStep,
      totalSteps: steps.length,
    });
  };

  return (
    <div className="w-full h-[100dvh] bg-black overflow-y-auto">
      <div className="min-h-[100dvh] w-full flex items-center justify-center">
        <div className="w-[75dvw] flex flex-col items-center justify-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={`top-${currentStep}`}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="w-full p-6 flex flex-col justify-center items-center"
            >
              <h2 className="text-6xl font-extrabold mb-4 text-white text-center">
                {steps[currentStep].header}
              </h2>
              <p className="text-2xl font-light text-white opacity-60 text-center">
                {steps[currentStep].description}
              </p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`divider-${currentStep}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="relative flex items-center justify-center w-full h-4 my-1"
            >
              <div
                ref={dividerRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-full cursor-pointer flex items-center"
                style={{ zIndex: 20 }}
                onMouseMove={handleMouseMove}
              >
                <svg
                  width="100%"
                  height="100%"
                  style={{ overflow: "visible", height: "2px" }}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <motion.path
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                    className="opacity-40"
                    initial={false}
                    d={pathD}
                    style={{ transform: "translateY(50%)" }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </svg>
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`bottom-${currentStep}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="w-full p-6 flex flex-col justify-center items-center"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WizardContent;
