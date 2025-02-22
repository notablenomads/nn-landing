import React, { lazy } from "react";
import {
  StepComponentProps,
  WizardCurrentData,
  ProjectType,
  TargetAudience,
  Industry,
  DesignStyle,
  Timeline,
  Budget,
  ContactMethod,
} from "./types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useWizardOptions } from "@/hooks/useWizardOptions";

const WelcomeStep = lazy(() => import("./steps/welcome"));
const ServiceSelectionStep = lazy(() => import("./steps/serviceSelection"));
const ProjectScopeStep = lazy(() => import("./steps/projectScope"));
const FeaturesStep = lazy(() => import("./steps/features"));
const AudienceStep = lazy(() => import("./steps/audience"));
const PreferencesStep = lazy(() => import("./steps/preferences"));
const ContactStep = lazy(() => import("./steps/contact"));
const SuccessStep = lazy(() => import("./steps/success"));

const ErrorAlert: React.FC<{ message: string }> = ({ message }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

const StepSkeleton: React.FC = () => (
  <div className="flex flex-col gap-4 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3" />
    <div className="h-4 bg-gray-200 rounded w-2/3" />
    <div className="h-32 bg-gray-200 rounded" />
  </div>
);

const LazyLoadingWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <React.Suspense fallback={<StepSkeleton />}>{children}</React.Suspense>
);

export const WizardStepWrapper: React.FC<StepComponentProps> = (props) => {
  const { data: options, isLoading, error } = useWizardOptions();

  if (isLoading) return <StepSkeleton />;
  if (error) return <ErrorAlert message="Failed to load options" />;
  if (!options) return <ErrorAlert message="No options available" />;

  const renderStep = (stepIndex: number, props: StepComponentProps) => {
    const currentData = props.currentData || {};

    switch (stepIndex) {
      case 0:
        return <WelcomeStep {...props} />;
      case 1:
        return <ServiceSelectionStep {...props} options={options} />;
      case 2:
        return <ProjectScopeStep {...props} options={options} />;
      case 3:
        return <FeaturesStep {...props} options={options} />;
      case 4:
        return <AudienceStep {...props} options={options} />;
      case 5:
        return <PreferencesStep {...props} options={options} />;
      case 6: {
        const safeCurrentData: WizardCurrentData = {
          services: [],
          projectType: ProjectType.NEW,
          targetAudience: TargetAudience.BOTH,
          industry: Industry.OTHER,
          hasCompetitors: false,
          hasExistingBrand: false,
          designStyle: DesignStyle.UNDECIDED,
          timeline: Timeline.FLEXIBLE,
          budget: Budget.NOT_SURE,
          name: "",
          email: "",
          preferredContactMethod: ContactMethod.EMAIL,
          wantsConsultation: false,
          ...(currentData as Partial<WizardCurrentData>),
        };
        return <ContactStep currentData={safeCurrentData} options={options} onComplete={(data) => props.onNext?.(data)} />;
      }
      case 7:
        return (
          <SuccessStep onNext={props.onNext} currentData={currentData} step={props.step} totalSteps={props.totalSteps} />
        );
      default:
        return <ErrorAlert message="Invalid step" />;
    }
  };

  return <LazyLoadingWrapper>{renderStep(props.step, props)}</LazyLoadingWrapper>;
};

export const wizardSteps = [
  {
    header: "Welcome",
    description: "Let's get started with your project",
    content: WizardStepWrapper,
  },
  {
    header: "Services",
    description: "What kind of project are you working on?",
    content: WizardStepWrapper,
  },
  {
    header: "Project Scope",
    description: "Tell us about your project status",
    content: WizardStepWrapper,
  },
  {
    header: "Features",
    description: "Tell us what functionality you need",
    content: WizardStepWrapper,
  },
  {
    header: "Target Audience",
    description: "Help us understand your market",
    content: WizardStepWrapper,
  },
  {
    header: "Preferences",
    description: "Design, timeline, and budget preferences",
    content: WizardStepWrapper,
  },
  {
    header: "Contact Info",
    description: "Let's get in touch",
    content: WizardStepWrapper,
  },
  {
    header: "Success",
    description: "Thank you for your submission",
    content: WizardStepWrapper,
  },
];

export default WizardStepWrapper;
