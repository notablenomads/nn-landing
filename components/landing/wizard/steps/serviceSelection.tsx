import React from "react";
import { StepWithOptionsProps } from "../types";
import { SelectButton } from "@/components/ui/selectButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ServiceSelectionStep: React.FC<StepWithOptionsProps> = ({
  onNext,
  options,
}) => {
  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);
  const [followUpData, setFollowUpData] = React.useState<
    Record<string, string>
  >({});
  const [otherService, setOtherService] = React.useState("");

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        const newServices = prev.filter((id) => id !== serviceId);
        return newServices;
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const showAIFollowUp = selectedServices.includes("AI_ML");
  const showMobileFollowUp = selectedServices.includes("MOBILE_APP");

  return (
    <div className="flex flex-col gap-6 text-white">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {options?.services?.map((service) => (
          <SelectButton
            key={service.value}
            selected={selectedServices.includes(service.value)}
            onClick={() => handleServiceToggle(service.value)}
          >
            <span className="font-semibold text-md">{service.label}</span>
            <span className="text-md opacity-70 text-left">
              {service.description}
            </span>
          </SelectButton>
        ))}
      </div>

      {selectedServices.includes("OTHER") && (
        <div className="mt-4">
          <Label htmlFor="other">Please specify</Label>
          <Input
            id="other"
            value={otherService}
            onChange={(e) => setOtherService(e.target.value)}
            className="mt-1"
          />
        </div>
      )}

      {showAIFollowUp && (
        <div className="mt-4 p-4 bg-background/10 rounded-lg">
          <p className="mb-2">Do you have datasets/models?</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {["Yes", "No", "Not Sure"].map((option) => (
              <SelectButton
                key={option}
                selected={followUpData.hasDatasets === option.toLowerCase()}
                onClick={() =>
                  setFollowUpData({
                    ...followUpData,
                    hasDatasets: option.toLowerCase(),
                  })
                }
                className="items-center justify-center"
              >
                {option}
              </SelectButton>
            ))}
          </div>
        </div>
      )}

      {showMobileFollowUp && (
        <div className="mt-4 p-4 bg-background/10 rounded-lg">
          <p className="mb-2">Which platforms?</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {["iOS", "Android", "Both"].map((platform) => (
              <SelectButton
                key={platform}
                selected={followUpData.platforms === platform.toLowerCase()}
                onClick={() =>
                  setFollowUpData({
                    ...followUpData,
                    platforms: platform.toLowerCase(),
                  })
                }
                className="items-center justify-center"
              >
                {platform}
              </SelectButton>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={() =>
          onNext({
            services: selectedServices,
            otherService,
            followUpData,
          })
        }
        className="mt-4 text-lg mb-3"
        disabled={selectedServices.length === 0}
      >
        Next →
      </Button>
    </div>
  );
};

export default ServiceSelectionStep;
