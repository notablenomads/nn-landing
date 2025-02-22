import React from "react";
import { StepWithOptionsProps, DesignStyle, Timeline, Budget } from "../types";
import { SelectButton } from "@/components/ui/selectButton";
import { Button } from "@/components/ui/button";

const PreferencesStep: React.FC<StepWithOptionsProps> = ({ onNext, currentData, options }) => {
  const [hasExistingBrand, setHasExistingBrand] = React.useState<boolean>(currentData?.hasExistingBrand ?? false);
  const [designStyle, setDesignStyle] = React.useState<DesignStyle | undefined>(currentData?.designStyle);
  const [timeline, setTimeline] = React.useState<Timeline | undefined>(currentData?.timeline);
  const [budget, setBudget] = React.useState<Budget | undefined>(currentData?.budget);

  const isValid = designStyle && timeline && budget !== undefined;

  const handleNext = () => {
    if (!isValid) return;

    onNext({
      hasExistingBrand,
      designStyle,
      timeline,
      budget,
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      {/* Brand Guidelines */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Do you have existing brand guidelines?</h3>
        <div className="flex gap-4">
          <Button variant={hasExistingBrand ? "default" : "outline"} onClick={() => setHasExistingBrand(true)}>
            Yes
          </Button>
          <Button variant={!hasExistingBrand ? "default" : "outline"} onClick={() => setHasExistingBrand(false)}>
            No
          </Button>
        </div>
      </div>

      {/* Design Style */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">What design style are you looking for?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.designStyles.map((style) => (
            <SelectButton
              key={style.value}
              selected={designStyle === style.value}
              onClick={() => setDesignStyle(style.value as DesignStyle)}
            >
              <span className="font-semibold text-md">{style.label}</span>
              <span className="text-sm opacity-70">{style.description}</span>
            </SelectButton>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">What's your project timeline?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.timelines.map((timelineOption) => (
            <SelectButton
              key={timelineOption.value}
              selected={timeline === timelineOption.value}
              onClick={() => setTimeline(timelineOption.value as Timeline)}
            >
              <span className="font-semibold text-md">{timelineOption.label}</span>
              <span className="text-sm opacity-70">{timelineOption.description}</span>
            </SelectButton>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">What's your budget range?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.budgets.map((budgetOption) => (
            <SelectButton
              key={budgetOption.value}
              selected={budget === budgetOption.value}
              onClick={() => setBudget(budgetOption.value as Budget)}
            >
              <span className="font-semibold text-md">{budgetOption.label}</span>
              <span className="text-sm opacity-70">{budgetOption.description}</span>
            </SelectButton>
          ))}
        </div>
      </div>

      <Button onClick={handleNext} disabled={!isValid} className="mt-4">
        Continue →
      </Button>
    </div>
  );
};

export default PreferencesStep;
