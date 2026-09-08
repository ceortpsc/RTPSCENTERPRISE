export type CommunicationState = "DRAFT" | "PRACTITIONER_REVIEW" | "QC_REVIEW_REQUIRED" | "APPROVED_FOR_DISPATCH" | "SENT_TO_CLIENT_SECURELY" | "IRS_CHANNEL_ACTION_LOGGED_BY_HUMAN" | "RESPONSE_PENDING" | "FOLLOW_UP_SCHEDULED" | "CLOSED";

export type ApprovedClientMessage = {
  id: string;
  caseId: string;
  bodyHash: string;
  state: "APPROVED_FOR_DISPATCH";
  approvedBy: string;
  approvedAt: string;
};

export function authorizeClientDispatch(message: ApprovedClientMessage) {
  return { dispatchAllowed: true, secureClientChannelOnly: true, irsFacingAutomationAllowed: false, message } as const;
}
