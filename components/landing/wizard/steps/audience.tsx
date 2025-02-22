import React from "react";
import { StepWithOptionsProps, Industry, TargetAudience } from "../types";
import { SelectButton } from "@/components/ui/selectButton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const AudienceStep: React.FC<StepWithOptionsProps> = ({ onNext, currentData, options }) => {
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
        <h3 className="text-xl font-semibold">Who is your target audience?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.targetAudiences.map((audienceOption) => (
            <SelectButton
              key={audienceOption.value}
              selected={audience === audienceOption.value}
              onClick={() => setAudience(audienceOption.value as TargetAudience)}
            >
              <span className="font-semibold text-md">{audienceOption.label}</span>
              <span className="text-sm opacity-70">{audienceOption.description}</span>
            </SelectButton>
          ))}
        </div>
      </div>

      {/* Industry Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">What industry are you in?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.industries.map((industryOption) => (
            <SelectButton
              key={industryOption.value}
              selected={industry === industryOption.value}
              onClick={() => setIndustry(industryOption.value as Industry)}
            >
              <span className="font-semibold text-md">{industryOption.label}</span>
              <span className="text-sm opacity-70">{industryOption.description}</span>
            </SelectButton>
          ))}
        </div>
      </div>

      {/* Competitors Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Do you have any competitors or inspiration?</h3>
        <div className="flex gap-4">
          <Button variant={hasCompetitors ? "default" : "outline"} onClick={() => setHasCompetitors(true)}>
            Yes
          </Button>
          <Button
            variant={!hasCompetitors ? "default" : "outline"}
            onClick={() => {
              setHasCompetitors(false);
              setCompetitorUrls("");
            }}
          >
            No
          </Button>
        </div>

        {hasCompetitors && (
          <div>
            <Label htmlFor="competitors">List your competitors or inspiration (one per line)</Label>
            <Textarea
              id="competitors"
              value={competitorUrls}
              onChange={(e) => setCompetitorUrls(e.target.value)}
              className="mt-2 min-h-[100px]"
              placeholder="www.competitor1.com&#10;www.competitor2.com"
            />
          </div>
        )}
      </div>

      <Button onClick={handleNext} disabled={!isValid} className="mt-4">
        Continue →
      </Button>
    </div>
  );
};

export default AudienceStep;
