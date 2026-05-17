import React, { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import SimplePopup from "@/components/simplePopup";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Lazy load the components that are only needed when the popup is open
const WizardContent = lazy(() => import("./wizardContent"));
const Toaster = lazy(() => import("sonner").then((mod) => ({ default: mod.Toaster })));

// Import these outside the component since they're small and needed for types/setup
import { wizardSteps } from "./steps";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "..";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { WizardCurrentData } from "./types";

const KickstartButton = ({ onClick, isMobile }: { onClick: () => void; isMobile: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Glow effect */}
      <div className="pointer-events-none absolute inset-0 rounded-lg bg-[#F5900D]/20 blur-xl transition-all duration-300 group-hover:bg-[#F5900D]/30" />

      {/* Animated border */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-[#F5900D] via-[#FFA940] to-[#F5900D] opacity-50",
            isHovered && "animate-border-flow"
          )}
          style={{
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      <Button
        type="button"
        className={cn(
          "cta-button relative z-10 text-md font-bold uppercase tracking-wider",
          "border-2 border-[#F5900D]/50 bg-gradient-to-br from-[#F5900D] to-[#F5900D]/80",
          "text-black shadow-[0_0_20px_rgba(245,144,13,0.3)] backdrop-blur-sm",
          "transition-all duration-300 ease-out",
          "hover:from-[#FFA940] hover:to-[#F5900D] hover:shadow-[0_0_30px_rgba(245,144,13,0.5)]"
        )}
        size="lg"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="relative z-10 drop-shadow-lg">{isMobile ? "Kickstart" : "Kickstart Your Vision"}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-500" />
      </Button>
    </motion.div>
  );
};

function WizardWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleComplete = (data: WizardCurrentData) => {
    console.log("Wizard completed with data:", data);
  };

  const handleStepChange = (step: number) => {
    if (step >= wizardSteps.length) {
      // If we try to go beyond the last step, close the wizard
      setIsOpen(false);
      setCurrentStep(0); // Reset to first step for next time
      return;
    }
    setCurrentStep(step);
    console.log("Current step:", step);
  };

  return (
    <>
      <KickstartButton onClick={() => setIsOpen(true)} isMobile={isMobile} />
      <SimplePopup
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setCurrentStep(0); // Reset to first step when closing
        }}
      >
        {isOpen && (
          <Suspense>
            <QueryClientProvider client={queryClient}>
              <Toaster />
              <WizardContent
                steps={wizardSteps}
                onComplete={handleComplete}
                onStepChange={handleStepChange}
                currentStep={currentStep}
              />
            </QueryClientProvider>
          </Suspense>
        )}
      </SimplePopup>
    </>
  );
}

export default WizardWrapper;
