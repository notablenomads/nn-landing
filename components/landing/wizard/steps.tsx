// wizardSteps.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Check, ChevronDown, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { 
  StepComponentProps, 
  ExistingProjectDetails,
  WizardOptions
} from './types';
import { useWizardOptions } from '@/hooks/useWizardOptions';
import { SelectButton } from '@/components/ui/selectButton';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';



interface WizardCurrentData {
  services?: string[];
  otherService?: string;
  followUpData?: {
    hasDatasets?: string;
    platforms?: string;
  };
  projectType?: string;
  existingDetails?: {
    challenge: string;
    hasCode: boolean | null;
    codeFiles: FileList | null;
  };
  features?: string[];
  projectDescription?: string;
  userType?: 'technical' | 'non-technical';
  audience?: string;
  industry?: string;
  hasCompetitors?: boolean;
  competitorUrls?: string;
}
interface BaseStepProps {
  currentData?: Record<string, unknown>;
  options: WizardOptions;
}

interface ContactStepProps extends Omit<BaseStepProps, 'currentData'> {
  currentData: WizardCurrentData;  // Make it required and specific for ContactStep
  onComplete?: () => void;
}

interface SummarySectionProps {
  currentData: WizardCurrentData;
  options: WizardOptions;
}



const StepSkeleton: React.FC = () => (
  <div className="flex flex-col gap-4 w-full">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-10 w-1/2" />
  </div>
);

const ErrorAlert: React.FC<{ message: string }> = ({ message }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);


interface StepWithOptionsProps extends StepComponentProps {
 options: WizardOptions;
}

const WizardStepWrapper = (props: StepComponentProps): JSX.Element => {
  const { data: options, isLoading, error } = useWizardOptions();
 const safeCurrentData: WizardCurrentData = props.currentData as WizardCurrentData || {
    services: [],
    existingDetails: {
      challenge: '',
      hasCode: null,
      codeFiles: null
    }
  };
  if (isLoading) return <StepSkeleton />;
  if (error) return <ErrorAlert message="Failed to load options" />;
  if (!options) return <ErrorAlert message="No options available" />;

  const stepProps = { ...props, options };

  switch(props.step) {
    case 0:
      return <WelcomeStep {...props} />;
    case 1:
      return <ServiceSelectionStep {...stepProps} />;
    case 2:
      return <ProjectScopeStep {...stepProps} />;
    case 3:
      return <FeaturesStep {...stepProps} />;
    case 4:
      return <AudienceStep {...stepProps} />;
    case 5:
      return <PreferencesStep {...stepProps} />;
    case 6:
return <ContactStep 
        currentData={safeCurrentData}
        options={options}
        onComplete={() => props.onNext?.()} 
      />;    default:
      return <ErrorAlert message="Invalid step" />;
  }
};


// Step 1: Welcome Screen
const WelcomeStep: React.FC<StepComponentProps> = ({ onNext }) => (
  <div className="flex flex-col items-center gap-6 text-white">
    <p className="text-xl text-center">
      Let's bring your project to life! Answer a few quick questions to get a free consultation & roadmap.
    </p>
    <p className="text-sm opacity-70">Takes ~3 minutes</p>
    <Button 
      onClick={() => onNext({ started: true })}
      className="px-8 py-6 text-lg bg-primary hover:bg-primary/90"
    >
      Begin Your Project Journey →
    </Button>
  </div>
);

export const ServiceSelectionStep: React.FC<StepWithOptionsProps> = ({ onNext, options }) => {
  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);
  const [followUpData, setFollowUpData] = React.useState<Record<string, string>>({});
  const [showFollowUp, setShowFollowUp] = React.useState<string | null>(null);
  const [otherService, setOtherService] = React.useState("");

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        const newServices = prev.filter(id => id !== serviceId);
        if (serviceId === 'AI_ML' || serviceId === 'MOBILE_APP') {
          setShowFollowUp(null);
        }
        return newServices;
      } else {
        if (serviceId === 'AI_ML') setShowFollowUp('ai');
        if (serviceId === 'MOBILE_APP') setShowFollowUp('mobile');
        return [...prev, serviceId];
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 text-white">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {options.services.map((service) => (
          <SelectButton
            key={service.value}
            selected={selectedServices.includes(service.value)}
            onClick={() => handleServiceToggle(service.value)}
          >
            <span className="font-semibold">{service.label}</span>
            <span className="text-sm opacity-70 text-left">{service.description}</span>
          </SelectButton>
        ))}
      </div>

      {selectedServices.includes('OTHER') && (
        <div className="mt-4">
          <Label htmlFor="other">Please specify</Label>
          <Input
            id="other"

            value={otherService}
            onChange={(e) => setOtherService(e.target.value)}
            className="mt-1 bg-white/50 text-black border-white/50"
          />
        </div>
      )}

      {showFollowUp === 'ai' && (
        <div className="mt-4 p-4 bg-background/10 rounded-lg">
          <p className="mb-2">Do you have datasets/models?</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {['Yes', 'No', 'Not Sure'].map((option) => (
              <SelectButton
                key={option}
                selected={followUpData.hasDatasets === option.toLowerCase()}
                onClick={() => setFollowUpData({ 
                  ...followUpData, 
                  hasDatasets: option.toLowerCase() 
                })}
                className="items-center justify-center"
              >
                {option}
              </SelectButton>
            ))}
          </div>
        </div>
      )}

      {showFollowUp === 'mobile' && (
        <div className="mt-4 p-4 bg-background/10 rounded-lg">
          <p className="mb-2">Which platforms?</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {['iOS', 'Android', 'Both'].map((platform) => (
              <SelectButton
                key={platform}
                selected={followUpData.platforms === platform.toLowerCase()}
                onClick={() => setFollowUpData({ 
                  ...followUpData, 
                  platforms: platform.toLowerCase() 
                })}
                className="items-center justify-center"
              >
                {platform}
              </SelectButton>
            ))}
          </div>
        </div>
      )}

      <Button 
        onClick={() => onNext({ 
          services: selectedServices,
          otherService,
          followUpData 
        })}
        className="mt-4"
        disabled={selectedServices.length === 0}
      >
        Next →
      </Button>
    </div>
  );
};

export const ProjectScopeStep: React.FC<StepWithOptionsProps> = ({ onNext, options }) => {
  const [projectType, setProjectType] = React.useState<string>();
  const [existingDetails, setExistingDetails] = React.useState<ExistingProjectDetails>({
    challenge: '',
    hasCode: null,
    codeFiles: null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setExistingDetails({ ...existingDetails, codeFiles: e.target.files });
    }
  };

  return (
    <div className="flex flex-col gap-6 text-white">
      <div>
        <p className="mb-4">Is this a new project or an existing one?</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {options.projectTypes.map((type) => (
            <SelectButton
              key={type.value}
              selected={projectType === type.value}
              onClick={() => setProjectType(prev => prev === type.value ? undefined : type.value)}
            >
              <span className="font-semibold">{type.label}</span>
              <span className="text-sm opacity-70 text-left">{type.description}</span>
            </SelectButton>
          ))}
        </div>
      </div>

      {projectType === 'EXISTING' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="challenge" className="block mb-4">What's the biggest challenge?</Label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {options.existingProjectChallenges.map((challenge) => (
                <SelectButton
                  key={challenge.value}
                  selected={existingDetails.challenge === challenge.value}
                  onClick={() => setExistingDetails({
                    ...existingDetails,
                    challenge: existingDetails.challenge === challenge.value ? '' : challenge.value
                  })}
                >
                  <span className="font-semibold">{challenge.label}</span>
                  <span className="text-sm opacity-70 text-left">{challenge.description}</span>
                </SelectButton>
              ))}
            </div>
          </div>
          
          <div>
            <p className="mb-4">Do you have existing code/designs?</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ].map((option) => (
                <SelectButton
                  key={option.label}
                  selected={existingDetails.hasCode === option.value}
                  onClick={() => setExistingDetails({
                    ...existingDetails,
                    hasCode: existingDetails.hasCode === option.value ? null : option.value
                  })}
                  className="items-center justify-center"
                >
                  {option.label}
                </SelectButton>
              ))}
            </div>
          </div>

          {existingDetails.hasCode && (
            <div>
              <Label htmlFor="code-files">Upload your code/designs (optional)</Label>
              <Input
                id="code-files"
                type="file"
                multiple
                onChange={handleFileChange}
                className="mt-1 bg-black/90 text-white"
              />
            </div>
          )}
        </div>
      )}

      <Button 
        onClick={() => onNext({ 
          projectType,
          ...(projectType === 'EXISTING' && { existingDetails })
        })}
        className="mt-4"
        disabled={!projectType || (projectType === 'EXISTING' && !existingDetails.challenge)}
      >
        Next →
      </Button>
    </div>
  );
};

export const FeaturesStep: React.FC<StepWithOptionsProps> = ({ onNext }) => {
  const [userType, setUserType] = React.useState<'technical' | 'non-technical'>();
  const [selectedFeatures, setSelectedFeatures] = React.useState<string[]>([]);
  const [projectDescription, setProjectDescription] = React.useState('');

  const features = [
    { value: 'auth', label: 'Authentication', description: 'Login/Signup system' },
    { value: 'payment', label: 'Payment Gateway', description: 'Process payments and transactions' },
    { value: 'chat', label: 'Real-time Chat', description: 'Instant messaging and communication' },
    { value: 'dashboard', label: 'Dashboard & Analytics', description: 'Data visualization and reporting' },
    { value: 'notifications', label: 'Push Notifications', description: 'Real-time alerts and updates' },
    { value: 'api', label: 'Third-party API Integration', description: 'Connect with external services' }
  ];

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  return (
    <div className="flex flex-col gap-6 text-white">
      <div>
        <p className="mb-4">Are you a technical user?</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { value: 'technical', label: 'Technical User', description: 'I have development experience' },
            { value: 'non-technical', label: 'Non-Technical', description: 'I need guidance on technical decisions' }
          ].map((type) => (
            <SelectButton
              key={type.value}
              selected={userType === type.value}
              onClick={() => setUserType(type.value as 'technical' | 'non-technical')}
            >
              <span className="font-semibold">{type.label}</span>
              <span className="text-sm opacity-70 text-left">{type.description}</span>
            </SelectButton>
          ))}
        </div>
      </div>

      {userType === 'technical' ? (
        <div>
          <p className="mb-4">Select the features you need:</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <SelectButton
                key={feature.value}
                selected={selectedFeatures.includes(feature.value)}
                onClick={() => handleFeatureToggle(feature.value)}
              >
                <span className="font-semibold">{feature.label}</span>
                <span className="text-sm opacity-70 text-left">{feature.description}</span>
              </SelectButton>
            ))}
          </div>
        </div>
      ) : userType === 'non-technical' && (
        <div>
          <Label htmlFor="description">Describe your project in 1–2 sentences</Label>
          <Textarea
            id="description"
            placeholder="Example: I want to build a mobile app that helps users track their daily expenses and share bills with roommates..."
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="mt-1 bg-background text-black min-h-[100px]"
          />
        </div>
      )}

      <Button 
        onClick={() => onNext({ 
          userType,
          ...(userType === 'technical' 
            ? { features: selectedFeatures } 
            : { projectDescription }
          )
        })}
        className="mt-4"
        disabled={
          !userType || 
          (userType === 'technical' && selectedFeatures.length === 0) ||
          (userType === 'non-technical' && !projectDescription.trim())
        }
      >
        Next →
      </Button>
    </div>
  );
};

export const AudienceStep: React.FC<StepWithOptionsProps> = ({ onNext, options }) => {
  const [audience, setAudience] = React.useState<string>();
  const [industry, setIndustry] = React.useState<string>();
  const [hasCompetitors, setHasCompetitors] = React.useState<boolean>();
  const [competitorUrls, setCompetitorUrls] = React.useState('');

  return (
    <div className="flex flex-col gap-6 text-white">
      <div>
        <p className="mb-4">Who is your target audience?</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {options.targetAudiences.map((audienceType) => (
            <SelectButton
              key={audienceType.value}
              selected={audience === audienceType.value}
              onClick={() => setAudience(prev => prev === audienceType.value ? undefined : audienceType.value)}
            >
              <span className="font-semibold">{audienceType.label}</span>
              <span className="text-sm opacity-70 text-left">{audienceType.description}</span>
            </SelectButton>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-4">What industry is this project for?</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {options.industries.map((industryOption) => (
            <SelectButton
              key={industryOption.value}
              selected={industry === industryOption.value}
              onClick={() => setIndustry(prev => prev === industryOption.value ? undefined : industryOption.value)}
            >
              <span className="font-semibold">{industryOption.label}</span>
              <span className="text-sm opacity-70 text-left">{industryOption.description}</span>
            </SelectButton>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-4">Do you have competitors or inspiration?</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { value: true, label: 'Yes', description: 'I can provide examples' },
            { value: false, label: 'No', description: 'This is a unique solution' }
          ].map((option) => (
            <SelectButton
              key={String(option.value)}
              selected={hasCompetitors === option.value}
              onClick={() => setHasCompetitors(prev => prev === option.value ? undefined : option.value)}
            >
              <span className="font-semibold">{option.label}</span>
              <span className="text-sm opacity-70 text-left">{option.description}</span>
            </SelectButton>
          ))}
        </div>
      </div>

      {hasCompetitors && (
        <div>
          <Label htmlFor="competitor-urls">Enter competitor URLs or names (one per line)</Label>
          <Textarea
            id="competitor-urls"
            value={competitorUrls}
            onChange={(e) => setCompetitorUrls(e.target.value)}
            placeholder="example.com&#10;anotherexample.com"
            className="mt-1 bg-background text-black min-h-[100px]"
          />
        </div>
      )}

      <Button 
        onClick={() => onNext({ 
          audience,
          industry,
          hasCompetitors,
          ...(hasCompetitors && { competitorUrls })
        })}
        className="mt-4"
        disabled={!audience || !industry || hasCompetitors === undefined}
      >
        Next →
      </Button>
    </div>
  );
};



export const ContactStep: React.FC<ContactStepProps> = ({ currentData, options, onComplete }) => {
    const typedCurrentData = currentData as WizardCurrentData;

 const [contactInfo, setContactInfo] = React.useState({
    name: '',
    email: '',
    company: '',
    contactMethod: '',
    wantsConsultation: false
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const [notes, setNotes] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const submitMutation = useMutation({
    mutationFn: async (data: unknown) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}leads`, data);
      return response.data;
    },
    onSuccess: () => {
      setIsSubmitted(true);
      onComplete?.();
    },
   onError: (error: AxiosError<{ message: string }>) => {
      if (error.response?.data?.message) {
        toast(error.response.data.message);
      } else {
        toast('An error occurred');
      }
    }
  });

  const handleInputChange = (field: keyof typeof contactInfo, value: string | boolean) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const isValid = 
    contactInfo.name.trim() !== '' && 
    validateEmail(contactInfo.email) &&
    contactInfo.contactMethod !== '';

// Inside ContactStep component
const handleSubmit = () => {
  // Transform all collected data to match BE schema
  const submissionData = {
    // Services from step 1
    services: currentData.services,

    // Project type from step 2
    projectType: currentData.projectType,
    ...(currentData.projectType === 'EXISTING' && {
      existingProjectChallenge: currentData.existingDetails?.challenge
    }),

    // Project description from step 3 (Technical vs Non-technical path)
    projectDescription: currentData.userType === 'technical' 
      ? `Technical requirements: ${currentData?.features?.join(', ')}` 
      : currentData.projectDescription,

    // Audience & Industry from step 4
    targetAudience: currentData.audience,
    industry: currentData.industry,
    hasCompetitors: currentData.hasCompetitors,
    ...(currentData.hasCompetitors && {
      competitorUrls: currentData?.competitorUrls?.split('\n').filter(Boolean)
    }),

    // These might come from previous steps or need to be added to the flow
    hasExistingBrand: true, // This needs to be collected
    designStyle: 'MODERN', // This needs to be collected
    timeline: 'LESS_THAN_3_MONTHS', // This needs to be collected
    budget: 'LESS_THAN_10K', // This needs to be collected

    // Contact info from final step
    name: contactInfo.name,
    email: contactInfo.email,
    company: contactInfo.company || undefined,
    preferredContactMethod: contactInfo.contactMethod,
    wantsConsultation: contactInfo.wantsConsultation,
    additionalNotes: notes || undefined
  };

  submitMutation.mutate(submissionData);
};

// Types for the BE schema



const SummarySection: React.FC<SummarySectionProps> = ({ currentData, options }) => (
  <div className="space-y-4">
    {/* Services */}
    {currentData.services && currentData.services.length > 0 && (
      <div>
        <h4 className="font-medium mb-2">Selected Services:</h4>
        <ul className="list-disc list-inside opacity-70 space-y-1">
          {currentData.services.map((service) => (
            <li key={service}>
              {options.services.find(s => s.value === service)?.label || service}
            </li>
          ))}
        </ul>
      </div>
    )}
    
    {/* Project Type */}
    {currentData?.projectType && (
      <div>
        <h4 className="font-medium mb-2">Project Type:</h4>
        <p className="opacity-70">
          {options.projectTypes.find(t => t.value === currentData.projectType)?.label}
        </p>
      </div>
    )}
    
    {/* Features */}
    {currentData.features && currentData.features.length > 0 && (
      <div>
        <h4 className="font-medium mb-2">Selected Features:</h4>
        <ul className="list-disc list-inside opacity-70 space-y-1">
          {currentData.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </div>
    )}
    
    {/* Target Audience */}
    {currentData?.audience && (
      <div>
        <h4 className="font-medium mb-2">Target Audience:</h4>
        <p className="opacity-70">
          {options.targetAudiences.find(a => a.value === currentData.audience)?.label}
        </p>
      </div>
    )}
    
    {/* Industry */}
    {currentData?.industry && (
      <div>
        <h4 className="font-medium mb-2">Industry:</h4>
        <p className="opacity-70">
          {options.industries.find(i => i.value === currentData.industry)?.label}
        </p>
      </div>
    )}
  </div>
);



  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 text-white h-full">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-500">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-center">Thank You!</h3>
        <p className="text-center opacity-70 max-w-md">
          We've received your project details and will get back to you shortly via {contactInfo.contactMethod.toLowerCase()}.
          {contactInfo.wantsConsultation && ' Our team will contact you to schedule your free consultation.'}
        </p>
      </div>
    );
  }

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
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="mt-1 bg-background text-black placeholder:text-white/20"
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
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="mt-1 bg-background text-black placeholder:text-white/20"
              placeholder="your@email.com"
              disabled={submitMutation.isPending}
            />
          </div>
        </div>

        {/* Company (Optional) */}
        <div>
          <Label htmlFor="company">Company (Optional)</Label>
          <Input
            id="company"
            value={contactInfo.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className="mt-1 bg-background text-black placeholder:text-white/20"
            placeholder="Your company name"
            disabled={submitMutation.isPending}
          />
        </div>

        {/* Contact Method */}
        <div>
          <p className="mb-4">How would you like us to reach you?</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {options.contactMethods.map((method) => (
              <SelectButton
                key={method.value}
                selected={contactInfo.contactMethod === method.value}
                onClick={() => handleInputChange('contactMethod', method.value)}
                disabled={submitMutation.isPending}
              >
                <span className="font-semibold">{method.label}</span>
                <span className="text-sm opacity-70 text-left">{method.description}</span>
              </SelectButton>
            ))}
          </div>
        </div>

        {/* Free Consultation */}
        <div className="flex gap-4">
          <SelectButton
            selected={contactInfo.wantsConsultation}
            onClick={() => handleInputChange('wantsConsultation', !contactInfo.wantsConsultation)}
            className="w-full md:w-auto"
            disabled={submitMutation.isPending}
          >
            <span className="font-semibold">I would like a free consultation</span>
            <span className="text-sm opacity-70 text-left">Get expert advice on your project</span>
          </SelectButton>
        </div>

        {/* Additional Notes */}
        <div>
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 bg-background text-black placeholder:text-white/20"
            placeholder="Any additional information you'd like to share..."
            disabled={submitMutation.isPending}
          />
        </div>

        {/* Project Summary Collapsible */}
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full space-y-2"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Project Summary</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`} />
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

      <Button 
        onClick={handleSubmit}
        className="mt-4"
        disabled={!isValid || submitMutation.isPending}
      >
        {submitMutation.isPending ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </div>
        ) : (
          'Submit & Get Your Free Consultation →'
        )}
      </Button>
    </div>
  );
};

export const PreferencesStep: React.FC<StepWithOptionsProps> = ({ onNext, options }) => {
  const [preferences, setPreferences] = React.useState({
    hasExistingBrand: false,
    designStyle: '',
    timeline: '',
    budget: ''
  });

  const handleInputChange = (field: keyof typeof preferences, value: unknown) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const isValid = 
    typeof preferences.hasExistingBrand === 'boolean' &&
    preferences.designStyle &&
    preferences.timeline &&
    preferences.budget;

  return (
    <div className="flex flex-col gap-6 text-white">
      {/* Brand Status */}
      <div>
        <p className="mb-4">Do you have existing brand guidelines?</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { value: true, label: 'Yes', description: 'We have brand guidelines' },
            { value: false, label: 'No', description: 'We need branding help' }
          ].map((option) => (
            <SelectButton
              key={String(option.value)}
              selected={preferences.hasExistingBrand === option.value}
              onClick={() => handleInputChange('hasExistingBrand', option.value)}
            >
              <span className="font-semibold">{option.label}</span>
              <span className="text-sm opacity-70 text-left">{option.description}</span>
            </SelectButton>
          ))}
        </div>
      </div>

      {/* Design Style */}
      <div>
        <p className="mb-4">What's your preferred design style?</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {options.designStyles.map((style) => (
            <SelectButton
              key={style.value}
              selected={preferences.designStyle === style.value}
              onClick={() => handleInputChange('designStyle', style.value)}
            >
              <span className="font-semibold">{style.label}</span>
              <span className="text-sm opacity-70 text-left">{style.description}</span>
            </SelectButton>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <p className="mb-4">What's your ideal timeline?</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {options.timelines.map((timeline) => (
            <SelectButton
              key={timeline.value}
              selected={preferences.timeline === timeline.value}
              onClick={() => handleInputChange('timeline', timeline.value)}
            >
              <span className="font-semibold">{timeline.label}</span>
              <span className="text-sm opacity-70 text-left">{timeline.description}</span>
            </SelectButton>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <p className="mb-4">What's your estimated budget?</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {options.budgets.map((budget) => (
            <SelectButton
              key={budget.value}
              selected={preferences.budget === budget.value}
              onClick={() => handleInputChange('budget', budget.value)}
            >
              <span className="font-semibold">{budget.label}</span>
              <span className="text-sm opacity-70 text-left">{budget.description}</span>
            </SelectButton>
          ))}
        </div>
      </div>

      <Button 
        onClick={() => onNext(preferences)}
        className="mt-4"
        disabled={!isValid}
      >
        Next →
      </Button>
    </div>
  );
};

export const wizardSteps = [
  {
    header: "Welcome",
    description: "Let's get started with your project",
    content: WizardStepWrapper
  },
  {
    header: "Services",
    description: "What kind of project are you working on?",
    content: WizardStepWrapper
  },
  {
    header: "Project Scope",
    description: "Tell us about your project status",
    content: WizardStepWrapper
  },
  {
    header: "Features",
    description: "Tell us what functionality you need",
    content: WizardStepWrapper
  },
  {
    header: "Target Audience",
    description: "Help us understand your market",
    content: WizardStepWrapper
  },
  {
    header: "Preferences",
    description: "Design, timeline, and budget preferences",
    content: WizardStepWrapper
  },
  {
    header: "Contact Info",
    description: "Let's get in touch",
    content: WizardStepWrapper
  }
];

export default wizardSteps;