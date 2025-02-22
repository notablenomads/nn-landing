import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface StepNavigationProps {
  onBack?: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  nextText?: string;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  onBack,
  onNext,
  isNextDisabled = false,
  nextText = "Continue →",
}) => {
  return (
    <div className="flex items-center justify-between w-full mt-8">
      {onBack ? (
        <Button onClick={onBack} variant="ghost" className="text-white hover:text-white hover:bg-white/10" size="lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      ) : (
        <span />
      )}
      <Button onClick={onNext} disabled={isNextDisabled} className="ml-auto" size="lg">
        {nextText}
      </Button>
    </div>
  );
};

export default StepNavigation;
