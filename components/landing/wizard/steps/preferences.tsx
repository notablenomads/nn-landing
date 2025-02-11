import { Button } from "@/components/ui/button";
import { SelectButton } from "@/components/ui/selectButton";
import React from "react";
import { StepWithOptionsProps } from "../types";

const PreferencesStep: React.FC<StepWithOptionsProps> = ({
  onNext,
  options,
}) => {
  const [preferences, setPreferences] = React.useState({
    hasExistingBrand: false,
    designStyle: "",
    timeline: "",
    budget: "",
  });

  const handleInputChange = (
    field: keyof typeof preferences,
    value: unknown
  ) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const isValid =
    typeof preferences.hasExistingBrand === "boolean" &&
    preferences.designStyle &&
    preferences.timeline &&
    preferences.budget;

  return (
    <div className="flex flex-col gap-6 text-white">
      {/* Brand Status */}
      <div>
        <p className="mb-4">Do you have existing brand guidelines?</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              value: true,
              label: "Yes",
              description: "We have brand guidelines",
            },
            { value: false, label: "No", description: "We need branding help" },
          ].map((option) => (
            <SelectButton
              key={String(option.value)}
              selected={preferences.hasExistingBrand === option.value}
              onClick={() =>
                handleInputChange("hasExistingBrand", option.value)
              }
            >
              <span className="font-semibold">{option.label}</span>
              <span className="text-sm opacity-70 text-left">
                {option.description}
              </span>
            </SelectButton>
          ))}
        </div>
      </div>

      {/* Design Style */}
      <div>
        <p className="mb-4">What's your preferred design style?</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {options?.designStyles?.map((style) => (
            <SelectButton
              key={style.value}
              selected={preferences.designStyle === style.value}
              onClick={() => handleInputChange("designStyle", style.value)}
            >
              <span className="font-semibold">{style.label}</span>
              <span className="text-sm opacity-70 text-left">
                {style.description}
              </span>
            </SelectButton>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <p className="mb-4">What's your ideal timeline?</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {options?.timelines?.map((timeline) => (
            <SelectButton
              key={timeline.value}
              selected={preferences.timeline === timeline.value}
              onClick={() => handleInputChange("timeline", timeline.value)}
            >
              <span className="font-semibold">{timeline.label}</span>
              <span className="text-sm opacity-70 text-left">
                {timeline.description}
              </span>
            </SelectButton>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <p className="mb-4">What's your estimated budget?</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {options?.budgets?.map((budget) => (
            <SelectButton
              key={budget.value}
              selected={preferences.budget === budget.value}
              onClick={() => handleInputChange("budget", budget.value)}
            >
              <span className="font-semibold text-md">{budget.label}</span>
              <span className="text-md opacity-70 text-left">
                {budget.description}
              </span>
            </SelectButton>
          ))}
        </div>
      </div>

      <Button
        onClick={() => onNext(preferences)}
        className="mt-4 text-lg mb-3"
        disabled={!isValid}
      >
        Next →
      </Button>
    </div>
  );
};

export default PreferencesStep;
