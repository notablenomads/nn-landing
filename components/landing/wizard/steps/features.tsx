import React from "react";
import { StepWithOptionsProps, ServiceType } from "../types";
import { SelectButton } from "@/components/ui/selectButton";
import { Textarea } from "@/components/ui/textarea";
import StepNavigation from "../components/StepNavigation";

const FeaturesStep: React.FC<StepWithOptionsProps> = ({ onNext, onBack, currentData }) => {
  const [isTechnical, setIsTechnical] = React.useState<boolean>(false);
  const [selectedFeatures, setSelectedFeatures] = React.useState<ServiceType[]>(
    currentData?.projectDescription?.includes("Technical requirements:")
      ? currentData.projectDescription
          .replace("Technical requirements: ", "")
          .split(", ")
          .map((f) => f as ServiceType)
      : []
  );
  const [projectDescription, setProjectDescription] = React.useState<string>(
    currentData?.projectDescription && !currentData.projectDescription.includes("Technical requirements:")
      ? currentData.projectDescription
      : ""
  );

  const technicalFeatures = [
    {
      value: ServiceType.WEB_APP,
      label: "Web Application",
      description: "Full-stack web application development",
    },
    {
      value: ServiceType.MOBILE_APP,
      label: "Mobile Application",
      description: "Native or cross-platform mobile apps",
    },
    {
      value: ServiceType.AI_ML,
      label: "AI/ML Solutions",
      description: "Machine learning and AI integration",
    },
    {
      value: ServiceType.DEVOPS,
      label: "DevOps & Infrastructure",
      description: "Cloud infrastructure and automation",
    },
    {
      value: ServiceType.ARCHITECTURE,
      label: "System Architecture",
      description: "Technical architecture and system design",
    },
    {
      value: ServiceType.OTHER,
      label: "Other Features",
      description: "Custom requirements and integrations",
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {technicalFeatures.map((feature) => (
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

      <StepNavigation onBack={onBack} onNext={handleNext} isNextDisabled={!isValid} />
    </div>
  );
};

export default FeaturesStep;
