import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectButton } from "@/components/ui/selectButton";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  ContactStepProps,
  SummarySectionProps,
  WizardCurrentData,
  ContactMethod,
  ProjectType,
  ServiceType,
  TechnicalExpertise,
} from "../types";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import React from "react";
import { useMutation } from "@tanstack/react-query";

const ContactStep: React.FC<ContactStepProps> = ({ currentData, options, onComplete }) => {
  const typedCurrentData = currentData as WizardCurrentData;

  const [contactInfo, setContactInfo] = React.useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    contactMethod: "",
    wantsConsultation: false,
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const [notes, setNotes] = React.useState("");

  const submitMutation = useMutation({
    mutationFn: async (data: unknown) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}leads`, data);
      if (response.data.statusCode >= 400) {
        throw new Error(response.data.message || "An error occurred");
      }
      return response.data.data;
    },
    onSuccess: () => {
      onComplete?.({
        ...typedCurrentData,
        name: contactInfo.name,
        email: contactInfo.email,
        company: contactInfo.company || undefined,
        preferredContactMethod: contactInfo.contactMethod as ContactMethod,
        wantsConsultation: contactInfo.wantsConsultation,
        additionalNotes: notes || undefined,
      });
    },
    onError: (error: AxiosError<{ statusCode: number; message: string }>) => {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while submitting your request");
      }
    },
  });

  const handleInputChange = (field: keyof typeof contactInfo, value: string | boolean) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validatePhone = (phone: string) => {
    return phone.match(/^\+?[0-9\s-()]+$/);
  };

  const isValid =
    contactInfo.name.trim() !== "" &&
    validateEmail(contactInfo.email) &&
    contactInfo.contactMethod !== "" &&
    (contactInfo.contactMethod === ContactMethod.PHONE || contactInfo.contactMethod === ContactMethod.WHATSAPP
      ? validatePhone(contactInfo.phone)
      : true);

  // Inside ContactStep component
  const handleSubmit = () => {
    const submissionData = {
      // Required fields
      services: typedCurrentData.services,
      projectType: typedCurrentData.projectType,
      targetAudience: typedCurrentData.targetAudience,
      industry: typedCurrentData.industry,
      hasCompetitors: typedCurrentData.hasCompetitors,
      hasExistingBrand: typedCurrentData.hasExistingBrand,
      designStyle: typedCurrentData.designStyle,
      timeline: typedCurrentData.timeline,
      budget: typedCurrentData.budget,
      name: contactInfo.name,
      email: contactInfo.email,
      preferredContactMethod: contactInfo.contactMethod as ContactMethod,
      wantsConsultation: contactInfo.wantsConsultation,
      technicalExpertise: typedCurrentData.technicalExpertise,

      // Optional fields
      ...(typedCurrentData.existingProjectChallenges && {
        existingProjectChallenges: typedCurrentData.existingProjectChallenges,
      }),
      ...(typedCurrentData.competitorUrls && {
        competitorUrls: typedCurrentData.competitorUrls,
      }),
      ...(typedCurrentData.company && {
        company: typedCurrentData.company,
      }),
      ...(typedCurrentData.additionalNotes && {
        additionalNotes: typedCurrentData.additionalNotes,
      }),
      ...(typedCurrentData.mobileAppPlatform && {
        mobileAppPlatform: typedCurrentData.mobileAppPlatform,
      }),
      ...(typedCurrentData.aimlDatasetStatus && {
        aimlDatasetStatus: typedCurrentData.aimlDatasetStatus,
      }),
      ...(typedCurrentData.technicalExpertise === TechnicalExpertise.TECHNICAL &&
        typedCurrentData.technicalFeatures && {
          technicalFeatures: typedCurrentData.technicalFeatures,
        }),
      ...(typedCurrentData.technicalExpertise === TechnicalExpertise.NON_TECHNICAL &&
        typedCurrentData.projectDescription && {
          projectDescription: typedCurrentData.projectDescription,
        }),
      ...((contactInfo.contactMethod === ContactMethod.PHONE || contactInfo.contactMethod === ContactMethod.WHATSAPP) && {
        phone: contactInfo.phone,
      }),
    };

    submitMutation.mutate(submissionData);
  };

  // Types for the BE schema

  const SummarySection: React.FC<SummarySectionProps> = ({ currentData, options }) => (
    <div className="space-y-4">
      {/* Services */}
      {currentData?.services && currentData.services.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Selected Services:</h4>
          <ul className="list-disc list-inside opacity-70 space-y-1">
            {currentData.services.map((service) => (
              <li key={service}>{options.services.find((s) => s.value === service)?.label || service}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Project Type */}
      {currentData?.projectType && (
        <div>
          <h4 className="font-medium mb-2">Project Type:</h4>
          <p className="opacity-70">{options.projectTypes.find((t) => t.value === currentData.projectType)?.label}</p>
        </div>
      )}

      {/* Target Audience */}
      {currentData?.targetAudience && (
        <div>
          <h4 className="font-medium mb-2">Target Audience:</h4>
          <p className="opacity-70">{options.targetAudiences.find((a) => a.value === currentData.targetAudience)?.label}</p>
        </div>
      )}

      {/* Industry */}
      {currentData?.industry && (
        <div>
          <h4 className="font-medium mb-2">Industry:</h4>
          <p className="opacity-70">{options.industries.find((i) => i.value === currentData.industry)?.label}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 text-white">
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={contactInfo.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="mt-1 bg-white/10 text-xl"
              placeholder="Your full name"
              disabled={submitMutation.isPending}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={contactInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="mt-1 bg-white/10 text-xl"
              placeholder="your@email.com"
              disabled={submitMutation.isPending}
            />
          </div>
        </div>

        {/* Phone (Optional) */}
        <div>
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input
            id="phone"
            value={contactInfo.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="mt-1 bg-white/10 text-lg"
            placeholder="+1 (555) 555-5555"
            disabled={submitMutation.isPending}
          />
        </div>

        {/* Company (Optional) */}
        <div>
          <Label htmlFor="company">Company (Optional)</Label>
          <Input
            id="company"
            value={contactInfo.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            className="mt-1 bg-white/10 text-lg"
            placeholder="Your company name"
            disabled={submitMutation.isPending}
          />
        </div>

        {/* Contact Method */}
        <div>
          <p className="mb-4">How would you like us to reach you?</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {options?.contactMethods?.map((method) => (
              <SelectButton
                key={method.value}
                selected={contactInfo.contactMethod === method.value}
                onClick={() => handleInputChange("contactMethod", method.value)}
                disabled={submitMutation.isPending}
              >
                <span className="font-semibold text-md">{method.label}</span>
                <span className="text-md opacity-70 text-left">{method.description}</span>
              </SelectButton>
            ))}
          </div>
        </div>

        {/* Free Consultation Checkbox */}
        <div
          className="flex items-center gap-2 p-4 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800/70 transition-colors"
          onClick={() => !submitMutation.isPending && handleInputChange("wantsConsultation", !contactInfo.wantsConsultation)}
        >
          <div
            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
              contactInfo.wantsConsultation ? "bg-secondary border-secondary" : "border-zinc-600"
            }`}
          >
            {contactInfo.wantsConsultation && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-4 h-4 text-secondary-foreground"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-white">I would like a free consultation</p>
            <p className="text-sm text-zinc-400">Get expert advice on your project from our team</p>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 bg-white/10  min-h-[100px]"
            placeholder="Any additional information you'd like to share..."
            disabled={submitMutation.isPending}
          />
        </div>

        {/* Project Summary Collapsible */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Project Summary</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
                />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border p-4">
              <SummarySection currentData={typedCurrentData} options={options} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Button onClick={handleSubmit} className="mt-4" disabled={!isValid || submitMutation.isPending}>
        {submitMutation.isPending ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </div>
        ) : (
          "Submit & Get Your Free Consultation →"
        )}
      </Button>
    </div>
  );
};

export default ContactStep;
