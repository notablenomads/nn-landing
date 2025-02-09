import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectButton } from "@/components/ui/selectButton";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { StepWithOptionsProps } from "../types";

const FeaturesStep: React.FC<StepWithOptionsProps> = ({ onNext }) => {
  const [userType, setUserType] = React.useState<
    "technical" | "non-technical"
  >();
  const [selectedFeatures, setSelectedFeatures] = React.useState<string[]>([]);
  const [projectDescription, setProjectDescription] = React.useState("");

  const features = [
    {
      value: "auth",
      label: "Authentication",
      description: "Login/Signup system",
    },
    {
      value: "payment",
      label: "Payment Gateway",
      description: "Process payments and transactions",
    },
    {
      value: "chat",
      label: "Real-time Chat",
      description: "Instant messaging and communication",
    },
    {
      value: "dashboard",
      label: "Dashboard & Analytics",
      description: "Data visualization and reporting",
    },
    {
      value: "notifications",
      label: "Push Notifications",
      description: "Real-time alerts and updates",
    },
    {
      value: "api",
      label: "Third-party API Integration",
      description: "Connect with external services",
    },
  ];

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  return (
    <div className="flex flex-col gap-6 text-white">
      <div>
        <p className="mb-4">Are you a technical user?</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              value: "technical",
              label: "Technical User",
              description: "I have development experience",
            },
            {
              value: "non-technical",
              label: "Non-Technical",
              description: "I need guidance on technical decisions",
            },
          ].map((type) => (
            <SelectButton
              key={type.value}
              selected={userType === type.value}
              onClick={() =>
                setUserType(type.value as "technical" | "non-technical")
              }
            >
              <span className="font-semibold">{type.label}</span>
              <span className="text-sm opacity-70 text-left">
                {type.description}
              </span>
            </SelectButton>
          ))}
        </div>
      </div>

      {userType === "technical" ? (
        <div>
          <p className="mb-4">Select the features you need:</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {features?.map((feature) => (
              <SelectButton
                key={feature.value}
                selected={selectedFeatures.includes(feature.value)}
                onClick={() => handleFeatureToggle(feature.value)}
              >
                <span className="font-semibold text-md">{feature.label}</span>
                <span className="text-md opacity-70 text-left">
                  {feature.description}
                </span>
              </SelectButton>
            ))}
          </div>
        </div>
      ) : (
        userType === "non-technical" && (
          <div>
            <Label htmlFor="description">
              Describe your project in 1–2 sentences
            </Label>
            <Textarea
              id="description"
              placeholder="Example: I want to build a mobile app that helps users track their daily expenses and share bills with roommates..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="mt-1 bg-white/10  min-h-[100px]"
            />
          </div>
        )
      )}

      <Button
        onClick={() =>
          onNext({
            userType,
            ...(userType === "technical"
              ? { features: selectedFeatures }
              : { projectDescription }),
          })
        }
        className="mt-4 text-lg"
        disabled={
          !userType ||
          (userType === "technical" && selectedFeatures.length === 0) ||
          (userType === "non-technical" && !projectDescription.trim())
        }
      >
        Next →
      </Button>
    </div>
  );
};

export default FeaturesStep;
