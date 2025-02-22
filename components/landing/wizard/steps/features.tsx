import React from "react";
import { StepWithOptionsProps } from "../types";
import { SelectButton } from "@/components/ui/selectButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const FeaturesStep: React.FC<StepWithOptionsProps> = ({ onNext, currentData }) => {
  const [isTechnical, setIsTechnical] = React.useState<boolean>(false);
  const [selectedFeatures, setSelectedFeatures] = React.useState<string[]>(
    currentData?.projectDescription?.includes("Technical requirements:")
      ? currentData.projectDescription.replace("Technical requirements: ", "").split(", ")
      : []
  );
  const [projectDescription, setProjectDescription] = React.useState<string>(
    currentData?.projectDescription && !currentData.projectDescription.includes("Technical requirements:")
      ? currentData.projectDescription
      : ""
  );

  const commonFeatures = [
    {
      value: "authentication",
      label: "User Authentication",
      description: "Login, registration, and user management",
    },
    {
      value: "payments",
      label: "Payment Processing",
      description: "Secure payment integration and billing",
    },
    {
      value: "analytics",
      label: "Analytics & Reporting",
      description: "Data tracking and insights",
    },
    {
      value: "api",
      label: "API Integration",
      description: "Third-party service integration",
    },
    {
      value: "realtime",
      label: "Real-time Features",
      description: "Live updates and notifications",
    },
    {
      value: "search",
      label: "Search & Filtering",
      description: "Advanced search capabilities",
    },
  ];

  const isValid = isTechnical ? selectedFeatures.length > 0 : projectDescription.trim().length > 0;

  const handleNext = () => {
    if (!isValid) return;

    onNext({
      projectDescription: isTechnical ? `Technical requirements: ${selectedFeatures.join(", ")}` : projectDescription,
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      {/* User Type Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">How would you like to describe your requirements?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectButton selected={!isTechnical} onClick={() => setIsTechnical(false)}>
            <span className="font-semibold text-md">Non-Technical</span>
            <span className="text-sm opacity-70">Describe your project in plain language</span>
          </SelectButton>
          <SelectButton selected={isTechnical} onClick={() => setIsTechnical(true)}>
            <span className="font-semibold text-md">Technical</span>
            <span className="text-sm opacity-70">Select specific technical features</span>
          </SelectButton>
        </div>
      </div>

      {/* Technical Features Selection */}
      {isTechnical && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Select Required Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commonFeatures.map((feature) => (
              <SelectButton
                key={feature.value}
                selected={selectedFeatures.includes(feature.value)}
                onClick={() =>
                  setSelectedFeatures((prev) =>
                    prev.includes(feature.value) ? prev.filter((f) => f !== feature.value) : [...prev, feature.value]
                  )
                }
              >
                <span className="font-semibold text-md">{feature.label}</span>
                <span className="text-sm opacity-70">{feature.description}</span>
              </SelectButton>
            ))}
          </div>
        </div>
      )}

      {/* Non-Technical Description */}
      {!isTechnical && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Describe Your Project</h3>
          <Textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="min-h-[200px]"
            placeholder="Please describe what you want to build. Include any specific features or functionality you need..."
          />
        </div>
      )}

      <Button onClick={handleNext} disabled={!isValid} className="mt-4">
        Continue →
      </Button>
    </div>
  );
};

export default FeaturesStep;
