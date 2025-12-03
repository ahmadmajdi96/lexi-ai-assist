export type ClientType = "individual" | "business";

export interface IndividualInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  idType: string;
  idNumber: string;
}

export interface BusinessInfo {
  businessName: string;
  businessType: string;
  ein: string;
  stateOfIncorporation: string;
  businessAddress: string;
  businessCity: string;
  businessState: string;
  businessZipCode: string;
  authorizedRepName: string;
  authorizedRepTitle: string;
  authorizedRepEmail: string;
  authorizedRepPhone: string;
}

export interface UploadedFile {
  name: string;
  path: string;
  size: number;
  type: string;
}

export interface LegalMatterInfo {
  matterDescription: string;
  urgencyLevel: string;
  opposingParty: string;
  relevantDates: string;
  additionalNotes: string;
  hasExistingDocuments: boolean;
  preferredCommunication: string;
  uploadedFiles: UploadedFile[];
}

export interface IntakeFormData {
  clientType: ClientType;
  individual: IndividualInfo;
  business: BusinessInfo;
  legalMatter: LegalMatterInfo;
}

export const initialIndividualInfo: IndividualInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  idType: "",
  idNumber: "",
};

export const initialBusinessInfo: BusinessInfo = {
  businessName: "",
  businessType: "",
  ein: "",
  stateOfIncorporation: "",
  businessAddress: "",
  businessCity: "",
  businessState: "",
  businessZipCode: "",
  authorizedRepName: "",
  authorizedRepTitle: "",
  authorizedRepEmail: "",
  authorizedRepPhone: "",
};

export const initialLegalMatterInfo: LegalMatterInfo = {
  matterDescription: "",
  urgencyLevel: "standard",
  opposingParty: "",
  relevantDates: "",
  additionalNotes: "",
  hasExistingDocuments: false,
  preferredCommunication: "email",
  uploadedFiles: [],
};

export const initialIntakeFormData: IntakeFormData = {
  clientType: "individual",
  individual: initialIndividualInfo,
  business: initialBusinessInfo,
  legalMatter: initialLegalMatterInfo,
};

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

export const BUSINESS_TYPES = [
  "Sole Proprietorship",
  "Partnership",
  "Limited Liability Company (LLC)",
  "Corporation (C-Corp)",
  "S Corporation (S-Corp)",
  "Nonprofit Organization",
  "Professional Corporation",
  "Limited Partnership (LP)",
  "Limited Liability Partnership (LLP)"
];

export const ID_TYPES = [
  "Driver's License",
  "State ID",
  "Passport",
  "Military ID",
  "Permanent Resident Card"
];

export const URGENCY_LEVELS = [
  { value: "standard", label: "Standard", description: "Regular processing timeline" },
  { value: "priority", label: "Priority", description: "Expedited review (additional fees may apply)" },
  { value: "urgent", label: "Urgent", description: "Same-day attention required" }
];

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp"
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES = 5;
