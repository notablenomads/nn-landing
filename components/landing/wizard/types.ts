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
  onNext: (data?: Partial<WizardCurrentData>) => void;
  currentData?: Partial<WizardCurrentData>;
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
  challenges: string[];
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
  services: ServiceType[];
  projectType: ProjectType;
  existingProjectChallenges?: ExistingProjectChallenge[];
  projectDescription?: string;
  targetAudience: TargetAudience;
  industry: Industry;
  hasCompetitors: boolean;
  competitorUrls?: string[];
  hasExistingBrand: boolean;
  designStyle: DesignStyle;
  timeline: Timeline;
  budget: Budget;
  name: string;
  email: string;
  company?: string;
  preferredContactMethod: ContactMethod;
  wantsConsultation: boolean;
  additionalNotes?: string;
  mobileAppPlatform?: MobileAppPlatform;
  aimlDatasetStatus?: AIMLDatasetStatus;
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

export enum ServiceType {
  WEB_APP = "WEB_APP",
  MOBILE_APP = "MOBILE_APP",
  AI_ML = "AI_ML",
  DEVOPS = "DEVOPS",
  ARCHITECTURE = "ARCHITECTURE",
  OTHER = "OTHER",
}

export enum ProjectType {
  NEW = "NEW",
  EXISTING = "EXISTING",
}

export enum ExistingProjectChallenge {
  PERFORMANCE = "PERFORMANCE",
  SCALABILITY = "SCALABILITY",
  BUGS = "BUGS",
  UX = "UX",
  SECURITY = "SECURITY",
  MAINTENANCE = "MAINTENANCE",
  TECHNICAL_DEBT = "TECHNICAL_DEBT",
  OUTDATED = "OUTDATED",
  OTHER = "OTHER",
}

export enum TargetAudience {
  CONSUMERS = "CONSUMERS",
  BUSINESSES = "BUSINESSES",
  BOTH = "BOTH",
}

export enum Industry {
  ECOMMERCE = "ECOMMERCE",
  HEALTHCARE = "HEALTHCARE",
  EDUCATION = "EDUCATION",
  SAAS = "SAAS",
  FINANCE = "FINANCE",
  ENTERTAINMENT = "ENTERTAINMENT",
  OTHER = "OTHER",
}

export enum DesignStyle {
  MODERN = "MODERN",
  BOLD = "BOLD",
  PROFESSIONAL = "PROFESSIONAL",
  UNDECIDED = "UNDECIDED",
}

export enum Timeline {
  LESS_THAN_3_MONTHS = "LESS_THAN_3_MONTHS",
  THREE_TO_SIX_MONTHS = "THREE_TO_SIX_MONTHS",
  MORE_THAN_6_MONTHS = "MORE_THAN_6_MONTHS",
  FLEXIBLE = "FLEXIBLE",
}

export enum Budget {
  LESS_THAN_10K = "LESS_THAN_10K",
  TEN_TO_FIFTY_K = "TEN_TO_FIFTY_K",
  FIFTY_TO_HUNDRED_K = "FIFTY_TO_HUNDRED_K",
  MORE_THAN_100K = "MORE_THAN_100K",
  NOT_SURE = "NOT_SURE",
}

export enum ContactMethod {
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  WHATSAPP = "WHATSAPP",
}

export enum MobileAppPlatform {
  IOS = "IOS",
  ANDROID = "ANDROID",
  BOTH = "BOTH",
}

export enum AIMLDatasetStatus {
  YES = "YES",
  NO = "NO",
  NOT_SURE = "NOT_SURE",
}
