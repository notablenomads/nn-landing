import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface StepNavigationProps {
  onBack?: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  nextText?: string;
  currentStep?: number;
  totalSteps?: number;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  onBack,
  onNext,
  isNextDisabled = false,
  nextText = "Continue →",
  currentStep = 0,
  totalSteps = 0,
}) => {
  return (
    <div className="space-y-4 w-full mt-8">
      {/* Progress Bar */}
      {totalSteps > 0 && (
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm text-zinc-400">
            <span>
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div
              className="bg-secondary h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between w-full">
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
    </div>
  );
};

export default StepNavigation;
