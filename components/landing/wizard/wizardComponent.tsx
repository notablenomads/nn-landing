import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import SimplePopup from "@/components/simplePopup";
import { WizardContent } from "./wizardContent";
import wizardSteps from "./steps";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "..";
import { Toaster } from "sonner";

function WizardWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  const handleComplete = (data: Record<string, unknown>) => {
    console.log("Wizard completed with data:", data);
  };

  return (
    <>
      <Button
        className="relative z-10 mt-2"
        size="lg"
        onClick={() => setIsOpen(true)}
      >
        Get Started
      </Button>
      <SimplePopup isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <WizardContent
            steps={wizardSteps}
            onComplete={handleComplete}
            onStepChange={(step: number) => console.log("Current step:", step)}
          />
        </QueryClientProvider>
      </SimplePopup>
    </>
  );
}

export default WizardWrapper;
