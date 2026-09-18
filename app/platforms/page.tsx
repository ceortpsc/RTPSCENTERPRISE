import Link from "next/link";
import { RTPSCBrandFrame } from "@/components/rtpsc-brand-frame";
import { PUBLIC_COMPANY } from "@/lib/company";

const groups = [
  {
    index: "01",
    eyebrow: "TAX PRACTICE",
    title: "PrimeWeb",
    statement: "The operating surface for the modern tax practice.",
    capabilities: ["Client intake", "Return operations", "E-file workspace", "Refund visibility", "Agreements & invoicing", "Practice management"],
  },
  {
    index: "02",
    eyebrow: "PRACTITIONER OPERATIONS",
    title: "Tax Practitioner Virtual Office",
    statement: "Casework, notices, transcripts, documents, and controlled practitioner workflows in one environment.",
    capabilities: ["Case management", "Notice response", "Transcript support", "Document control", "Review gates", "Audit history"],
  },
  {
    index: "03",
    eyebrow: "REFUND INTELLIGENCE",
    title: "ETRAC",
    statement: "A dedicated refund and transcript intelligence layer for normalized status, authorized review, and evidence-aware routing.",
    capabilities: ["Refund status lanes", "Consent status", "Transcript review", "Master-file normalization", "Inquiry workflows", "Audit logging"],
  },
  {
    index: "04",
    eyebrow: "PAYROLL",
    title: "Ross Prime Payroll",
    statement: "Payroll operations driven by timekeeping, employee records, verified withholding inputs, and prior-ledger continuity.",
    capabilities: ["Timekeeping", "Payroll ledgers", "Employee records", "Pay-cycle controls", "Statement production", "Employer service"],
  },
  {
    index: "05",
    eyebrow: "AUDIT DEFENSE",
    title: "Rapid Response Audit Defense",
    statement: "A structured response environment for notices, deadlines, evidence, appeals support, and case coordination.",
    capabilities: ["Notice intake", "Evidence assembly", "Deadline tracking", "Response workflows", "Appeals support", "Case binders"],
  },
  {
    index: "06",
    eyebrow: "DOCUMENT SYSTEMS",
    title: "Ross PDF Universal Editor",
    statement: "Controlled document handling for edit, OCR-oriented workflows, signing, forms, conversion, export, and retention.",
    capabilities: ["Document editing", "OCR workflows", "Forms", "Signatures", "Export", "Retention controls"],
  },
] as const;

export default function PlatformsPage() {
  return (
    <RTPSCBrandFrame active="platforms">
      <main>
        <section className="subpage-hero platforms-hero">
          <span className="section-label section-label-gold">RTPSC PLATFORM PORTFOLIO</span>
          <h1>Purpose-built systems.<br /><em>One operating language.</em></h1>
          <p>Every platform gets a distinct role, while design, governance, support, and release controls stay aligned across the enterprise.</p>
          <div className="hero-cta-row">
            <a className="cta cta-gold" href={"mailto:" + PUBLIC_COMPANY.publicEmail + "?subject=RTPSC%20Platform%20Demo"}>Request a platform demo</a>
            <Link className="cta cta-outline-light" href="/">Back to corporate site</Link>
          </div>
        </section>

        <section className="platform-directory shell-wide">
          {groups.map((group) => (
            <article className="platform-directory-row" key={group.title}>
              <div className="directory-number">{group.index}</div>
              <div className="directory-copy">
                <span>{group.eyebrow}</span>
                <h2>{group.title}</h2>
                <p>{group.statement}</p>
              </div>
              <div className="directory-capabilities">
                {group.capabilities.map((capability) => <span key={capability}>{capability}</span>)}
              </div>
            </article>
          ))}
        </section>

        <section className="platform-principle">
          <div className="shell-wide platform-principle-inner">
            <span className="section-label section-label-gold">RELEASE PRINCIPLE</span>
            <h2>Presentation can move fast.<br />Authority cannot be assumed.</h2>
            <p>Production credentials, regulatory status, protected data, and external-authority claims remain outside the marketing layer and require verified source evidence before use.</p>
            <Link className="cta cta-cream" href="/brand">Review the brand system</Link>
          </div>
        </section>
      </main>
    </RTPSCBrandFrame>
  );
}
