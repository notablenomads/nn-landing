import React, { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import SimplePopup from "@/components/simplePopup";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { WizardCurrentData } from "./types";

const WizardContent = lazy(() => import("./wizardContent"));
const Toaster = lazy(() =>
  import("sonner").then((mod) => ({ default: mod.Toaster }))
);

import { wizardSteps } from "./steps";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "..";

const KickstartButton = ({
  onClick,
  isMobile,
}: {
  onClick: () => void;
  isMobile: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg bg-[#F5900D]/20 blur-xl transition-all duration-300 group-hover:bg-[#F5900D]/30"
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg"
      >
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-[#F5900D] via-[#FFA940] to-[#F5900D] opacity-50",
            isHovered && "animate-border-flow"
          )}
          style={{ backgroundSize: "200% 100%" }}
        />
      </motion.div>

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
        <span className="relative z-10 drop-shadow-lg">
          {isMobile ? "Kickstart" : "Kickstart Your Vision"}
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full"
        />
      </Button>
    </motion.div>
  );
};

function WizardWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleComplete = (data: Record<string, unknown>) => {
    console.log("Wizard completed with data:", data as WizardCurrentData);
  };

  return (
    <>
      <KickstartButton onClick={() => setIsOpen(true)} isMobile={isMobile} />
      <SimplePopup
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        {isOpen && (
          <Suspense fallback={<motion.div className="p-4">Loading...</motion.div>}>
            <QueryClientProvider client={queryClient}>
              <Toaster />
              <WizardContent
                steps={wizardSteps}
                onComplete={handleComplete}
                onStepChange={(step) => console.log("Current step:", step)}
              />
            </QueryClientProvider>
          </Suspense>
        )}
      </SimplePopup>
    </>
  );
}

export default WizardWrapper;
