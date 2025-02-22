import React from "react";
import { StepWithOptionsProps, ProjectType, ExistingProjectChallenge } from "../types";
import { SelectButton } from "@/components/ui/selectButton";
import StepNavigation from "../components/StepNavigation";

const ProjectScopeStep: React.FC<StepWithOptionsProps> = ({ onNext, onBack, currentData, options }) => {
  const [projectType, setProjectType] = React.useState<ProjectType | undefined>(currentData?.projectType);
  const [existingProjectChallenges, setExistingProjectChallenges] = React.useState<ExistingProjectChallenge[]>(
    currentData?.existingProjectChallenges || []
  );

  const challengeOptions = [
    {
      value: ExistingProjectChallenge.PERFORMANCE,
      label: "Performance Issues",
      description: "Slow loading times or resource-heavy operations",
    },
    {
      value: ExistingProjectChallenge.SCALABILITY,
      label: "Scalability Concerns",
      description: "Difficulty handling increased load or growth",
    },
    {
      value: ExistingProjectChallenge.BUGS,
      label: "Critical Bugs",
      description: "Recurring issues or system instability",
    },
    {
      value: ExistingProjectChallenge.UX,
      label: "User Experience",
      description: "Poor usability or navigation issues",
    },
    {
      value: ExistingProjectChallenge.SECURITY,
      label: "Security Concerns",
      description: "Vulnerabilities or compliance issues",
    },
    {
      value: ExistingProjectChallenge.MAINTENANCE,
      label: "Maintenance",
      description: "Difficult to maintain or update",
    },
    {
      value: ExistingProjectChallenge.TECHNICAL_DEBT,
      label: "Technical Debt",
      description: "Legacy code or outdated practices",
    },
    {
      value: ExistingProjectChallenge.OUTDATED,
      label: "Outdated Technology",
      description: "Old frameworks or dependencies",
    },
    {
      value: ExistingProjectChallenge.OTHER,
      label: "Other Issues",
      description: "Custom challenges not listed",
    },
  ];

  const isValid = projectType && (projectType !== ProjectType.EXISTING || existingProjectChallenges.length > 0);

  const handleNext = () => {
    if (!isValid) return;

    onNext({
      projectType,
      ...(projectType === ProjectType.EXISTING && {
        existingProjectChallenges,
      }),
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      {/* Project Type Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">What type of project is this?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.projectTypes.map((type) => (
            <SelectButton
              key={type.value}
              selected={projectType === type.value}
              onClick={() => setProjectType(type.value as ProjectType)}
            >
              <span className="font-semibold text-md">{type.label}</span>
              <span className="text-sm opacity-70">{type.description}</span>
            </SelectButton>
          ))}
        </div>
      </div>

      {/* Existing Project Challenges */}
      {projectType === ProjectType.EXISTING && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">What challenges are you facing?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challengeOptions.map((challenge) => (
              <SelectButton
                key={challenge.value}
                selected={existingProjectChallenges.includes(challenge.value)}
                onClick={() =>
                  setExistingProjectChallenges((prev) =>
                    prev.includes(challenge.value) ? prev.filter((c) => c !== challenge.value) : [...prev, challenge.value]
                  )
                }
              >
                <span className="font-semibold text-md">{challenge.label}</span>
                <span className="text-sm opacity-70">{challenge.description}</span>
              </SelectButton>
            ))}
          </div>
        </div>
      )}

      <StepNavigation onBack={onBack} onNext={handleNext} isNextDisabled={!isValid} />
    </div>
  );
};

export default ProjectScopeStep;
