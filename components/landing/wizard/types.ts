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
