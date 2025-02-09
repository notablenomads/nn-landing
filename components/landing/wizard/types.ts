export interface WizardOption {
  value: string;
  label: string;
  description: string;
}

export interface WizardOptions {
  services: WizardOption[];
  projectTypes: WizardOption[];
  existingProjectChallenges: WizardOption[];
  targetAudiences: WizardOption[];
  industries: WizardOption[];
  designStyles: WizardOption[];
  timelines: WizardOption[];
  budgets: WizardOption[];
  contactMethods: WizardOption[];
}

export interface StepComponentProps {
  onNext: (data?: Record<string, unknown>) => void;
  currentData?: Record<string, unknown>;
  step?: number;
  totalSteps?: number;
}

export interface ServiceSelectionData {
  services: string[];
  otherService?: string;
  followUpData?: {
    hasDatasets?: "yes" | "no" | "not-sure";
    platforms?: "ios" | "android" | "both";
  };
}

export interface ExistingProjectDetails {
  challenge: string;
  hasCode: boolean | null;
  codeFiles: FileList | null;
}

export interface ProjectScopeData {
  projectType: string;
  existingDetails?: ExistingProjectDetails;
}

export interface WizardStep {
  header: string;
  description: string;
  content: React.FC<StepComponentProps>;
}

export interface WizardCurrentData {
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
  userType?: "technical" | "non-technical";
  audience?: string;
  industry?: string;
  hasCompetitors?: boolean;
  competitorUrls?: string;
}
export interface BaseStepProps {
  currentData?: Record<string, unknown>;
  options: WizardOptions;
}

export interface ContactStepProps extends Omit<BaseStepProps, "currentData"> {
  currentData: WizardCurrentData; // Make it required and specific for ContactStep
  onComplete?: () => void;
}

export interface SummarySectionProps {
  currentData: WizardCurrentData;
  options: WizardOptions;
}

export interface StepWithOptionsProps extends StepComponentProps {
  options: WizardOptions;
}
