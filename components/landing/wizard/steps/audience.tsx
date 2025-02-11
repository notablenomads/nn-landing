import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectButton } from "@/components/ui/selectButton";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { StepWithOptionsProps } from "../types";

const AudienceStep: React.FC<StepWithOptionsProps> = ({ onNext, options }) => {
  const [audience, setAudience] = React.useState<string>();
  const [industry, setIndustry] = React.useState<string>();
  const [hasCompetitors, setHasCompetitors] = React.useState<boolean>();
  const [competitorUrls, setCompetitorUrls] = React.useState("");

  return (
    <div className="flex flex-col gap-6 text-white">
      <div>
        <p className="mb-4">Who is your target audience?</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {options?.targetAudiences?.map((audienceType) => (
            <SelectButton
              key={audienceType.value}
              selected={audience === audienceType.value}
              onClick={() =>
                setAudience((prev) =>
                  prev === audienceType.value ? undefined : audienceType.value
                )
              }
            >
              <span className="font-semibold text-md">
                {audienceType.label}
              </span>
              <span className="text-md opacity-70 text-left">
                {audienceType.description}
              </span>
            </SelectButton>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-4">What industry is this project for?</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {options?.industries?.map((industryOption) => (
            <SelectButton
              key={industryOption.value}
              selected={industry === industryOption.value}
              onClick={() =>
                setIndustry((prev) =>
                  prev === industryOption.value
                    ? undefined
                    : industryOption.value
                )
              }
            >
              <span className="font-semibold text-md">
                {industryOption.label}
              </span>
              <span className="text-md opacity-70 text-left">
                {industryOption.description}
              </span>
            </SelectButton>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-4">Do you have competitors or inspiration?</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              value: true,
              label: "Yes",
              description: "I can provide examples",
            },
            {
              value: false,
              label: "No",
              description: "This is a unique solution",
            },
          ].map((option) => (
            <SelectButton
              key={String(option.value)}
              selected={hasCompetitors === option.value}
              onClick={() =>
                setHasCompetitors((prev) =>
                  prev === option.value ? undefined : option.value
                )
              }
            >
              <span className="font-semibold text-md">{option.label}</span>
              <span className="text-md opacity-70 text-left">
                {option.description}
              </span>
            </SelectButton>
          ))}
        </div>
      </div>

      {hasCompetitors && (
        <div>
          <Label htmlFor="competitor-urls">
            Enter competitor URLs or names.
          </Label>
          <Textarea
            id="competitor-urls"
            value={competitorUrls}
            onChange={(e) => setCompetitorUrls(e.target.value)}
            placeholder="example.com&#10;anotherexample.com"
            className="mt-1 bg-white/10  min-h-[100px]"
          />
        </div>
      )}

      <Button
        onClick={() =>
          onNext({
            audience,
            industry,
            hasCompetitors,
            ...(hasCompetitors && { competitorUrls }),
          })
        }
        className="mt-4 text-lg mb-3"
        disabled={!audience || !industry || hasCompetitors === undefined}
      >
        Next →
      </Button>
    </div>
  );
};

export default AudienceStep;
