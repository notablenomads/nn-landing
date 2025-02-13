import React, { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import SimplePopup from "@/components/simplePopup";

// Lazy load the components that are only needed when the popup is open
const WizardContent = lazy(() => import("./wizardContent"));
const Toaster = lazy(() =>
  import("sonner").then((mod) => ({ default: mod.Toaster }))
);

// Import these outside the component since they're small and needed for types/setup
import wizardSteps from "./steps";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "..";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function WizardWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const handleComplete = (data: Record<string, unknown>) => {
    console.log("Wizard completed with data:", data);
  };

  return (
    <>
      <Button
        className="text-md font-bold bg-secondary"
        size="lg"
        onClick={() => setIsOpen(true)}
      >
        {isMobile ? "Quote" : "Request a Quote"}
      </Button>
      <SimplePopup isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {isOpen && (
          <Suspense>
            <QueryClientProvider client={queryClient}>
              <Toaster />
              <WizardContent
                steps={wizardSteps}
                onComplete={handleComplete}
                onStepChange={(step: number) =>
                  console.log("Current step:", step)
                }
              />
            </QueryClientProvider>
          </Suspense>
        )}
      </SimplePopup>
    </>
  );
}

export default WizardWrapper;
