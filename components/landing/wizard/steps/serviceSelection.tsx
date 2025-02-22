import React from "react";
import { StepWithOptionsProps, ServiceType, MobileAppPlatform, AIMLDatasetStatus } from "../types";
import { SelectButton } from "@/components/ui/selectButton";
import StepNavigation from "../components/StepNavigation";

const ServiceSelectionStep: React.FC<StepWithOptionsProps> = ({ onNext, currentData, options, step, totalSteps }) => {
  const [selectedServices, setSelectedServices] = React.useState<ServiceType[]>(currentData?.services || []);
  const [mobileAppPlatform, setMobileAppPlatform] = React.useState<MobileAppPlatform | undefined>(
    currentData?.mobileAppPlatform
  );
  const [aimlDatasetStatus, setAimlDatasetStatus] = React.useState<AIMLDatasetStatus | undefined>(
    currentData?.aimlDatasetStatus
  );

  const isValid =
    selectedServices.length > 0 &&
    (!selectedServices.includes(ServiceType.MOBILE_APP) || mobileAppPlatform) &&
    (!selectedServices.includes(ServiceType.AI_ML) || aimlDatasetStatus);

  const handleNext = () => {
    if (!isValid) return;

    onNext({
      services: selectedServices,
      ...(selectedServices.includes(ServiceType.MOBILE_APP) && {
        mobileAppPlatform,
      }),
      ...(selectedServices.includes(ServiceType.AI_ML) && {
        aimlDatasetStatus,
      }),
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      {/* Service Selection */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">What services do you need?</h3>
          <p className="text-sm text-zinc-400">Select all the services that match your project requirements</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.services.map((service) => (
            <SelectButton
              key={service.value}
              selected={selectedServices.includes(service.value as ServiceType)}
              onClick={() => {
                const serviceType = service.value as ServiceType;
                setSelectedServices((prev) =>
                  prev.includes(serviceType) ? prev.filter((s) => s !== serviceType) : [...prev, serviceType]
                );
              }}
              className={selectedServices.length === 0 ? "ring-2 ring-orange-500/50 animate-pulse" : ""}
            >
              <span className="font-semibold text-md">{service.label}</span>
              <span className="text-sm opacity-70">{service.description}</span>
            </SelectButton>
          ))}
        </div>
        {selectedServices.length === 0 && <p className="text-sm text-orange-500">Please select at least one service</p>}
      </div>

      {/* Mobile App Platform Selection */}
      {selectedServices.includes(ServiceType.MOBILE_APP) && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Which platform(s) are you targeting?</h3>
            <p className="text-sm text-zinc-400">Choose your target mobile platform</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { value: MobileAppPlatform.IOS, label: "iOS", description: "Apple devices" },
              { value: MobileAppPlatform.ANDROID, label: "Android", description: "Android devices" },
              { value: MobileAppPlatform.BOTH, label: "Both", description: "Cross-platform" },
            ].map((platform) => (
              <SelectButton
                key={platform.value}
                selected={mobileAppPlatform === platform.value}
                onClick={() => setMobileAppPlatform(platform.value)}
                className={!mobileAppPlatform ? "ring-2 ring-orange-500/50 animate-pulse" : ""}
              >
                <span className="font-semibold text-md">{platform.label}</span>
                <span className="text-sm opacity-70">{platform.description}</span>
              </SelectButton>
            ))}
          </div>
          {!mobileAppPlatform && <p className="text-sm text-orange-500">Please select your target platform</p>}
        </div>
      )}

      {/* AI/ML Dataset Status */}
      {selectedServices.includes(ServiceType.AI_ML) && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Do you have existing datasets or models?</h3>
            <p className="text-sm text-zinc-400">Tell us about your AI/ML data readiness</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { value: AIMLDatasetStatus.YES, label: "Yes", description: "We have data/models ready" },
              { value: AIMLDatasetStatus.NO, label: "No", description: "We need to collect data" },
              { value: AIMLDatasetStatus.NOT_SURE, label: "Not Sure", description: "Need consultation" },
            ].map((status) => (
              <SelectButton
                key={status.value}
                selected={aimlDatasetStatus === status.value}
                onClick={() => setAimlDatasetStatus(status.value)}
                className={!aimlDatasetStatus ? "ring-2 ring-orange-500/50 animate-pulse" : ""}
              >
                <span className="font-semibold text-md">{status.label}</span>
                <span className="text-sm opacity-70">{status.description}</span>
              </SelectButton>
            ))}
          </div>
          {!aimlDatasetStatus && <p className="text-sm text-orange-500">Please indicate your dataset status</p>}
        </div>
      )}

      <StepNavigation
        onNext={handleNext}
        isNextDisabled={!isValid}
        currentStep={step}
        totalSteps={totalSteps}
        nextText={isValid ? "Continue →" : "Please complete required selections"}
      />
    </div>
  );
};

export default ServiceSelectionStep;
