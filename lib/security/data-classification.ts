export const DATA_CLASSIFICATIONS = [
  "PUBLIC",
  "INTERNAL",
  "CONFIDENTIAL",
  "RESTRICTED_HR",
  "RESTRICTED_PAYROLL",
  "RESTRICTED_TAX_CREDENTIAL",
  "RESTRICTED_IDENTITY_INFORMATION",
  "RESTRICTED_CLIENT_TAXPAYER_INFORMATION"
] as const;

export type DataClassification = typeof DATA_CLASSIFICATIONS[number];

export function isPublicClassification(value: DataClassification): boolean {
  return value === "PUBLIC";
}

export function requiresRestrictedHandling(value: DataClassification): boolean {
  return value.startsWith("RESTRICTED_");
}
