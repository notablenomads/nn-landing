import React from "react";
import { StepWithOptionsProps, Industry, TargetAudience } from "../types";
import { SelectButton } from "@/components/ui/selectButton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import StepNavigation from "../components/StepNavigation";

const AudienceStep: React.FC<StepWithOptionsProps> = ({ onNext, onBack, currentData, options, step, totalSteps }) => {
  const [audience, setAudience] = React.useState<TargetAudience | undefined>(currentData?.targetAudience as TargetAudience);
  const [industry, setIndustry] = React.useState<Industry | undefined>(currentData?.industry as Industry);
  const [hasCompetitors, setHasCompetitors] = React.useState<boolean>(currentData?.hasCompetitors ?? false);
  const [competitorUrls, setCompetitorUrls] = React.useState<string>((currentData?.competitorUrls ?? []).join("\n"));

  const isValid = audience && industry !== undefined;

  const handleNext = () => {
    if (!isValid) return;

    onNext({
      targetAudience: audience,
      industry,
      hasCompetitors,
      ...(hasCompetitors && { competitorUrls: competitorUrls.split("\n").filter(Boolean) }),
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      {/* Target Audience Selection */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Who is your target audience?</h3>
          <p className="text-sm text-zinc-400">Select the primary audience for your product or service</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.targetAudiences.map((audienceOption) => (
            <SelectButton
              key={audienceOption.value}
              selected={audience === audienceOption.value}
              onClick={() => setAudience(audienceOption.value as TargetAudience)}
              className={!audience ? "ring-2 ring-orange-500/50 animate-pulse" : ""}
            >
              <span className="font-semibold text-md">{audienceOption.label}</span>
              <span className="text-sm opacity-70">{audienceOption.description}</span>
            </SelectButton>
          ))}
        </div>
        {!audience && <p className="text-sm text-orange-500">Please select your target audience</p>}
      </div>

      {/* Industry Selection */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">What industry are you in?</h3>
          <p className="text-sm text-zinc-400">Choose the industry that best matches your business</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.industries.map((industryOption) => (
            <SelectButton
              key={industryOption.value}
              selected={industry === industryOption.value}
              onClick={() => setIndustry(industryOption.value as Industry)}
              className={!industry ? "ring-2 ring-orange-500/50 animate-pulse" : ""}
            >
              <span className="font-semibold text-md">{industryOption.label}</span>
              <span className="text-sm opacity-70">{industryOption.description}</span>
            </SelectButton>
          ))}
        </div>
        {!industry && <p className="text-sm text-orange-500">Please select your industry</p>}
      </div>

      {/* Competitors Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Do you have any competitors or inspiration?</h3>
          <p className="text-sm text-zinc-400">Help us understand your market position</p>
        </div>
        <div className="flex gap-4">
          <Button
            variant={hasCompetitors ? "secondary" : "ghost"}
            onClick={() => setHasCompetitors(true)}
            className="min-w-[100px]"
          >
            Yes
          </Button>
          <Button
            variant={!hasCompetitors ? "secondary" : "ghost"}
            onClick={() => {
              setHasCompetitors(false);
              setCompetitorUrls("");
            }}
            className="min-w-[100px]"
          >
            No
          </Button>
        </div>

        {hasCompetitors && (
          <div className="space-y-2">
            <Label htmlFor="competitors">List your competitors or inspiration (one per line)</Label>
            <Textarea
              id="competitors"
              value={competitorUrls}
              onChange={(e) => setCompetitorUrls(e.target.value)}
              className="mt-2 min-h-[100px] bg-white/5 focus:bg-white/10"
              placeholder="www.competitor1.com&#10;www.competitor2.com"
            />
          </div>
        )}
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={handleNext}
        isNextDisabled={!isValid}
        currentStep={step}
        totalSteps={totalSteps}
        nextText={isValid ? "Continue →" : "Please complete required selections"}
      />
    </div>
  );
};

export default AudienceStep;
