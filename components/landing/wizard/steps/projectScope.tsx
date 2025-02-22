import React from "react";
import { StepWithOptionsProps, ProjectType, ExistingProjectChallenge } from "../types";
import { SelectButton } from "@/components/ui/selectButton";
import { Button } from "@/components/ui/button";

const ProjectScopeStep: React.FC<StepWithOptionsProps> = ({ onNext, currentData, options }) => {
  const [projectType, setProjectType] = React.useState<ProjectType | undefined>(currentData?.projectType);
  const [existingProjectChallenges, setExistingProjectChallenges] = React.useState<ExistingProjectChallenge[]>(
    currentData?.existingProjectChallenges || []
  );

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
            {options.existingProjectChallenges.map((challenge) => (
              <SelectButton
                key={challenge.value}
                selected={existingProjectChallenges.includes(challenge.value as ExistingProjectChallenge)}
                onClick={() =>
                  setExistingProjectChallenges((prev) => {
                    const value = challenge.value as ExistingProjectChallenge;
                    return prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value];
                  })
                }
              >
                <span className="font-semibold text-md">{challenge.label}</span>
                <span className="text-sm opacity-70">{challenge.description}</span>
              </SelectButton>
            ))}
          </div>
        </div>
      )}

      <Button onClick={handleNext} disabled={!isValid} className="mt-4">
        Continue →
      </Button>
    </div>
  );
};

export default ProjectScopeStep;
