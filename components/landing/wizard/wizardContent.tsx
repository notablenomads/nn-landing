import React from "react";
import { debounce } from "lodash";
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { WizardCurrentData, WizardStep, ContactMethod, TechnicalExpertise } from "./types";
import StepProgress from "./components/StepProgress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WizardContentProps {
  steps: WizardStep[];
  onComplete: (data: WizardCurrentData) => void;
  onStepChange?: (stepIndex: number) => void;
  currentStep: number;
}

export const WizardContent: React.FC<WizardContentProps> = ({ steps, onComplete, onStepChange, currentStep }) => {
  const [wizardData, setWizardData] = React.useState<Partial<WizardCurrentData>>({});
  const [width, setWidth] = React.useState(600);
  const dividerRef = React.useRef<HTMLDivElement>(null);
  const lastTouchTime = React.useRef<number>(Date.now());
  const [showValidationTip, setShowValidationTip] = React.useState(false);

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
  const handleNext = (stepData?: Partial<WizardCurrentData>) => {
    // For the success step or welcome step, we don't need data
    if (currentStep === 0 || currentStep === steps.length - 1) {
      const nextStep = currentStep + 1;
      onStepChange?.(nextStep);
      return;
    }

    if (stepData) {
      setWizardData((prev) => ({ ...prev, ...stepData }));
      setShowValidationTip(false);
    } else {
      setShowValidationTip(true);
      toast.error("Please complete all required fields before proceeding.");
      return;
    }

    if (currentStep === steps.length - 2) {
      // Contact step
      const finalData = { ...wizardData, ...stepData };
      if (isWizardDataComplete(finalData)) {
        onComplete(finalData as WizardCurrentData);
        const nextStep = currentStep + 1;
        onStepChange?.(nextStep);
      } else {
        console.error("Incomplete wizard data:", finalData);
        toast.error("Please complete all required fields before submitting.");
      }
    } else {
      const nextStep = currentStep + 1;
      onStepChange?.(nextStep);
    }
  };

  // Handle going back to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setShowValidationTip(false);
      const prevStep = currentStep - 1;
      onStepChange?.(prevStep);
    }
  };

  // Helper function to check if all required fields are present
  const isWizardDataComplete = (data: Partial<WizardCurrentData>): data is WizardCurrentData => {
    const requiredFields: (keyof WizardCurrentData)[] = [
      "services",
      "projectType",
      "targetAudience",
      "industry",
      "hasCompetitors",
      "hasExistingBrand",
      "designStyle",
      "timeline",
      "budget",
      "name",
      "email",
      "preferredContactMethod",
      "wantsConsultation",
      "technicalExpertise",
    ];

    // Check if all required fields are present
    const hasRequiredFields = requiredFields.every((field) => field in data);

    // Additional validation for phone number when contact method is phone or whatsapp
    const needsPhone =
      data.preferredContactMethod === ContactMethod.PHONE || data.preferredContactMethod === ContactMethod.WHATSAPP;
    const hasPhone = needsPhone ? !!data.phone && data.phone.trim() !== "" : true;

    // Additional validation for project description when non-technical
    const needsProjectDescription = data.technicalExpertise === TechnicalExpertise.NON_TECHNICAL;
    const hasProjectDescription = needsProjectDescription ? !!data.projectDescription : true;

    // Additional validation for technical features when technical
    const needsTechnicalFeatures = data.technicalExpertise === TechnicalExpertise.TECHNICAL;
    const hasTechnicalFeatures = needsTechnicalFeatures ? !!data.technicalFeatures : true;

    return hasRequiredFields && hasPhone && hasProjectDescription && hasTechnicalFeatures;
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
      onBack: currentStep > 0 ? handleBack : undefined,
      currentData: wizardData,
      step: currentStep,
      totalSteps: steps.length,
      showValidationTip,
    });
  };

  const currentStepData = steps[currentStep];
  const shouldShowHeaderSection = currentStepData.header || currentStepData.description;

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-black">
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="min-h-full w-full flex items-start justify-center py-8 px-4 md:px-0">
          <div
            className={cn(
              "flex flex-col items-center justify-start w-full",
              shouldShowHeaderSection ? "md:w-[75dvw]" : "w-full"
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`top-${currentStep}`}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15, mass: 1 }}
                className="w-full p-4 md:p-6 flex flex-col justify-center items-center"
              >
                {currentStepData.header && (
                  <h2 className="text-3xl md:text-6xl font-extrabold mb-2 md:mb-4 text-white text-center">
                    {currentStepData.header}
                  </h2>
                )}
                {currentStepData.description && (
                  <p className="text-lg md:text-2xl font-light text-white opacity-60 text-center">
                    {currentStepData.description}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            {shouldShowHeaderSection && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`divider-${currentStep}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="relative flex items-center justify-center w-full h-4 my-1 px-4 md:px-0"
                >
                  <div
                    ref={dividerRef}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full cursor-pointer flex items-center"
                    style={{ zIndex: 20 }}
                    onMouseMove={handleMouseMove}
                    onTouchMove={(e) => {
                      const touch = e.touches[0];
                      if (!dividerRef.current) return;
                      const rect = dividerRef.current.getBoundingClientRect();
                      const relativeX = touch.clientX - rect.left;
                      touchX.set(relativeX);
                      effectProgress.set(1);
                      setTimeout(() => effectProgress.set(0), 175);
                    }}
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
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={`bottom-${currentStep}`}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  mass: 1,
                  delay: 0.2,
                }}
                className="w-full flex flex-col justify-center items-center px-4 md:px-0"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <StepProgress currentStep={currentStep} totalSteps={steps.length} />
    </div>
  );
};

export default WizardContent;
