/* eslint-disable */
import React, { lazy, Suspense } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { StepComponentProps, WizardCurrentData } from './types';
import { useWizardOptions } from '@/hooks/useWizardOptions';

const WelcomeStep = lazy(() => import('./steps/welcome'));
const ServiceSelectionStep = lazy(() => import('./steps/serviceSelection'));
const ProjectScopeStep = lazy(() => import('./steps/projectScope'));
const FeaturesStep = lazy(() => import('./steps/features'));
const AudienceStep = lazy(() => import('./steps/audience'));
const PreferencesStep = lazy(() => import('./steps/preferences'));
const ContactStep = lazy(() => import('./steps/contact'));
const SuccessStep = lazy(() => import('./steps/success'));


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

const LazyLoadingWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<StepSkeleton />}>
    {children}
  </Suspense>
);

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
  // if (error) return <ErrorAlert message="Failed to load options" />;
  // if (!options) return <ErrorAlert message="No options available" />;

  const stepProps = { ...props, options };

  const renderStep = () => {
    switch(props.step) {
      // case 0:
      //   return <WelcomeStep {...props} />;
      // case 1:
      //   return <ServiceSelectionStep {...stepProps} />;
      // case 2:
      //   return <ProjectScopeStep {...stepProps} />;
      // case 3:
      //   return <FeaturesStep {...stepProps} />;
      // case 4:
      //   return <AudienceStep {...stepProps} />;
      // case 5:
      //   return <PreferencesStep {...stepProps} />;
      // case 0:
      //   return (
      //     <ContactStep
      //       currentData={safeCurrentData}
      //       options={options}
      //       onComplete={() => props.onNext?.()}
      //     />
      //   );
      case 0:
        return <SuccessStep />;
      default:
        return <ErrorAlert message="Invalid step" />;
    }
  };

  return (
    <LazyLoadingWrapper>
      {renderStep()}
    </LazyLoadingWrapper>
  );
};

export const wizardSteps = [
  {
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
  },
  {
    header: "Success",
    description: "Thank you for your submission",
    content: WizardStepWrapper
  }
];

export default wizardSteps;
/* eslint-enable */