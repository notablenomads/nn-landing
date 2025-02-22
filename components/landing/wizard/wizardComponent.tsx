import React, { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import SimplePopup from "@/components/simplePopup";

// Lazy load the components that are only needed when the popup is open
const WizardContent = lazy(() => import("./wizardContent"));
const Toaster = lazy(() => import("sonner").then((mod) => ({ default: mod.Toaster })));

// Import these outside the component since they're small and needed for types/setup
import { wizardSteps } from "./steps";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "..";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { WizardCurrentData } from "./types";

function WizardWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleComplete = (data: WizardCurrentData) => {
    console.log("Wizard completed with data:", data);
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    console.log("Current step:", step);
  };

  return (
    <>
      <Button className="text-md font-bold bg-secondary" size="lg" onClick={() => setIsOpen(true)}>
        {isMobile ? "Kickstart" : "Kickstart Your Vision"}
      </Button>
      <SimplePopup isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
