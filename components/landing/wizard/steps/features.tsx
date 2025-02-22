import React from "react";
import { StepWithOptionsProps, TechnicalExpertise, TechnicalFeature } from "../types";
import { SelectButton } from "@/components/ui/selectButton";
import { Textarea } from "@/components/ui/textarea";
import StepNavigation from "../components/StepNavigation";

// Technical features categorized for better UX
const FEATURE_CATEGORIES = {
  "User & Security": [
    { value: TechnicalFeature.AUTHENTICATION, label: "Authentication", description: "Login, signup, password reset" },
    { value: TechnicalFeature.USER_MANAGEMENT, label: "User Management", description: "User roles, profiles, permissions" },
    { value: TechnicalFeature.SOCIAL_LOGIN, label: "Social Login", description: "OAuth with Google, Facebook, etc." },
  ],
  "Core Features": [
    { value: TechnicalFeature.FILE_HANDLING, label: "File Handling", description: "File upload, storage, processing" },
    { value: TechnicalFeature.SEARCH_FILTER, label: "Search & Filter", description: "Search, filtering, sorting" },
    { value: TechnicalFeature.NOTIFICATIONS, label: "Notifications", description: "Email, push, in-app notifications" },
    { value: TechnicalFeature.ADMIN_PANEL, label: "Admin Panel", description: "Administrative dashboard and controls" },
  ],
  "Business Features": [
    { value: TechnicalFeature.PAYMENTS, label: "Payments", description: "Payment processing and subscriptions" },
    { value: TechnicalFeature.ANALYTICS, label: "Analytics", description: "Reporting and data visualization" },
    { value: TechnicalFeature.MESSAGING, label: "Messaging", description: "Chat and communication features" },
    { value: TechnicalFeature.CALENDAR, label: "Calendar", description: "Scheduling and calendar management" },
  ],
  "Growth Features": [
    {
      value: TechnicalFeature.SEO_OPTIMIZATION,
      label: "SEO Optimization",
      description: "Search engine optimization features",
    },
    { value: TechnicalFeature.SOCIAL_SHARING, label: "Social Sharing", description: "Social media integration" },
    { value: TechnicalFeature.REFERRAL_SYSTEM, label: "Referral System", description: "User referral and rewards" },
    {
      value: TechnicalFeature.MARKETING_TOOLS,
      label: "Marketing Tools",
      description: "Email marketing, campaigns, automation",
    },
  ],
  "E-commerce": [
    { value: TechnicalFeature.SHOPPING_CART, label: "Shopping Cart", description: "Cart and checkout process" },
    { value: TechnicalFeature.INVENTORY, label: "Inventory", description: "Stock and inventory management" },
    { value: TechnicalFeature.ORDER_MANAGEMENT, label: "Order Management", description: "Order processing and tracking" },
    { value: TechnicalFeature.PRODUCT_MANAGEMENT, label: "Product Management", description: "Product catalog and variants" },
  ],
  "Integration & Performance": [
    { value: TechnicalFeature.API_INTEGRATION, label: "API Integration", description: "Third-party API connections" },
    { value: TechnicalFeature.MOBILE_SYNC, label: "Mobile Sync", description: "Mobile app synchronization" },
    { value: TechnicalFeature.ANALYTICS_TRACKING, label: "Analytics Tracking", description: "Google Analytics, etc." },
    { value: TechnicalFeature.OFFLINE_MODE, label: "Offline Mode", description: "Offline functionality and sync" },
  ],
};

const FeaturesStep: React.FC<StepWithOptionsProps> = ({ onNext, onBack, currentData }) => {
  const [expertise, setExpertise] = React.useState<TechnicalExpertise | undefined>(currentData?.technicalExpertise);
  const [selectedFeatures, setSelectedFeatures] = React.useState<TechnicalFeature[]>(currentData?.technicalFeatures || []);
  const [projectDescription, setProjectDescription] = React.useState<string>(currentData?.nonTechnicalDescription || "");

  // Calculate max features based on TechnicalFeature enum length
  const maxFeatures = Object.keys(TechnicalFeature).length;

  const isValid =
    expertise &&
    (expertise === TechnicalExpertise.TECHNICAL
      ? selectedFeatures.length > 0 && selectedFeatures.length <= maxFeatures
      : expertise === TechnicalExpertise.NON_TECHNICAL
      ? projectDescription.length >= 10 && projectDescription.length <= 1000
      : false);

  const handleNext = () => {
    if (!isValid) return;

    onNext({
      technicalExpertise: expertise,
      ...(expertise === TechnicalExpertise.TECHNICAL && {
        technicalFeatures: selectedFeatures,
      }),
      ...(expertise === TechnicalExpertise.NON_TECHNICAL && {
        nonTechnicalDescription: projectDescription,
      }),
    });
  };

  const toggleFeature = (feature: TechnicalFeature) => {
    setSelectedFeatures((prev) => {
      if (prev.includes(feature)) {
        return prev.filter((f) => f !== feature);
      }
      if (prev.length >= maxFeatures) {
        return prev;
      }
      return [...prev, feature];
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6">
      {/* Technical Expertise Selection */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">What's your technical background?</h3>
          <p className="text-sm text-zinc-400">This helps us provide the most relevant options for your project</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectButton
            selected={expertise === TechnicalExpertise.TECHNICAL}
            onClick={() => setExpertise(TechnicalExpertise.TECHNICAL)}
          >
            <div className="flex flex-col items-start gap-1">
              <span className="font-semibold text-lg">Technical</span>
              <span className="text-sm opacity-70">I understand technical requirements and specifications</span>
            </div>
          </SelectButton>
          <SelectButton
            selected={expertise === TechnicalExpertise.NON_TECHNICAL}
            onClick={() => setExpertise(TechnicalExpertise.NON_TECHNICAL)}
          >
            <div className="flex flex-col items-start gap-1">
              <span className="font-semibold text-lg">Non-Technical</span>
              <span className="text-sm opacity-70">I prefer to describe my needs in plain language</span>
            </div>
          </SelectButton>
        </div>
      </div>

      {/* Technical Features Selection */}
      {expertise === TechnicalExpertise.TECHNICAL && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Select Required Features</h3>
            <p className="text-sm text-zinc-400">Choose up to {maxFeatures} features that your project needs</p>
            {selectedFeatures.length >= maxFeatures && (
              <p className="text-sm text-orange-500">Maximum feature limit ({maxFeatures}) reached</p>
            )}
          </div>

          {Object.entries(FEATURE_CATEGORIES).map(([category, features]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-lg font-medium text-white/80">{category}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <SelectButton
                    key={feature.value}
                    selected={selectedFeatures.includes(feature.value)}
                    onClick={() => toggleFeature(feature.value)}
                    disabled={selectedFeatures.length >= maxFeatures && !selectedFeatures.includes(feature.value)}
                  >
                    <div className="flex flex-col items-start gap-1 w-full">
                      <span className="font-semibold text-lg">{feature.label}</span>
                      <span className="text-sm opacity-70 text-left">{feature.description}</span>
                    </div>
                  </SelectButton>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Non-Technical Description */}
      {expertise === TechnicalExpertise.NON_TECHNICAL && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Describe Your Project</h3>
            <p className="text-sm text-zinc-400">Tell us what you want to build in your own words (10-1000 characters)</p>
          </div>
          <Textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="min-h-[200px] bg-white/5 focus:bg-white/10"
            placeholder="Please describe what you want to build. Include any specific features or functionality you need..."
          />
          <div className="flex justify-end">
            <span className="text-sm text-zinc-400">{projectDescription.length}/1000 characters</span>
          </div>
        </div>
      )}

      <StepNavigation
        onBack={onBack}
        onNext={handleNext}
        isNextDisabled={!isValid}
        nextText={isValid ? "Continue →" : "Please complete required selections"}
      />
    </div>
  );
};

export default FeaturesStep;
