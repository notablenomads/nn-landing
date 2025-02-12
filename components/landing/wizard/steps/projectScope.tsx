import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectButton } from "@/components/ui/selectButton";
import { ExistingProjectDetails, StepWithOptionsProps } from "../types";
import React from "react";

const ProjectScopeStep: React.FC<StepWithOptionsProps> = ({
  onNext,
  options,
}) => {
  const [projectType, setProjectType] = React.useState<string>();
  const [existingDetails, setExistingDetails] = React.useState<
    ExistingProjectDetails
  >({
    challenges: [], // Changed from challenge (string) to challenges (string[])
    hasCode: null,
    codeFiles: null,
  });

  const toggleChallenge = (challengeValue: string) => {
    setExistingDetails((prev) => ({
      ...prev,
      challenges: prev.challenges.includes(challengeValue)
        ? prev.challenges.filter((c) => c !== challengeValue)
        : [...prev.challenges, challengeValue],
    }));
  };

  return (
    <div className="flex flex-col gap-6 text-white">
      <div>
        <p className="mb-4">Is this a new project or an existing one?</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {options?.projectTypes?.map((type) => (
            <SelectButton
              key={type.value}
              selected={projectType === type.value}
              onClick={() =>
                setProjectType((prev) =>
                  prev === type.value ? undefined : type.value
                )
              }
            >
              <span className="font-semibold text-md">{type.label}</span>
              <span className="text-md opacity-70 text-left">
                {type.description}
              </span>
            </SelectButton>
          ))}
        </div>
      </div>

      {projectType === "EXISTING" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="challenge" className="block mb-4">
              What are your biggest challenges? (Select all that apply)
            </Label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {options?.existingProjectChallenges?.map((challenge) => (
                <SelectButton
                  key={challenge.value}
                  selected={existingDetails.challenges.includes(
                    challenge.value
                  )}
                  onClick={() => toggleChallenge(challenge.value)}
                >
                  <span className="font-semibold text-md">
                    {challenge.label}
                  </span>
                  <span className="text-md opacity-70 text-left">
                    {challenge.description}
                  </span>
                </SelectButton>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4">Do you have existing code/designs?</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ].map((option) => (
                <SelectButton
                  key={option.label}
                  selected={existingDetails.hasCode === option.value}
                  onClick={() =>
                    setExistingDetails({
                      ...existingDetails,
                      hasCode:
                        existingDetails.hasCode === option.value
                          ? null
                          : option.value,
                    })
                  }
                  className="items-center justify-center"
                >
                  {option.label}
                </SelectButton>
              ))}
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={() =>
          onNext({
            projectType,
            ...(projectType === "EXISTING" && { existingDetails }),
          })
        }
        className="mt-4 text-lg mb-3"
        disabled={
          !projectType ||
          (projectType === "EXISTING" &&
            existingDetails.challenges.length === 0)
        }
      >
        Next →
      </Button>
    </div>
  );
};

export default ProjectScopeStep;
