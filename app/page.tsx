import { PUBLIC_COMPANY } from "@/lib/company";

const divisions = [
  ["Tax Practitioner Virtual Office", "Tax preparation workflows, client cases, notices, transcripts and secure practitioner operations."],
  ["Ross Prime Payroll", "Employer onboarding, workforce records, payroll operations and compliance workflows."],
  ["Ross Tax Pro University", "Tax education, coursework, assessments, practice labs and learner progress."],
  ["Ross E-Drive University", "Driver-education enrollment, course delivery, progress and certificate workflows."],
  ["Ross PDF Universal Editor", "Controlled PDF editing, forms, OCR, signatures, conversion and export."],
  ["Enterprise Support", "Customer service, IT help desk, operations routing, approvals and audit-ready support."],
] as const;

export default function HomePage() {
  return (
    <main>
      <header className="nav-shell">
        <a className="nav-logo" href="#top" aria-label="RTPSC Enterprise home">
          <span className="nav-logo-mark" aria-hidden="true" />
          RTPSC Enterprise
        </a>
        <span className="nav-meta">Secure enterprise workspace</span>
      </header>

      <section id="top" className="hero shell">
        <div className="eyebrow">Ross Tax Pro Software Co.</div>
        <h1>One enterprise operating system for tax, payroll, education, documents and support.</h1>
        <p className="hero-copy">A modular RTPSC foundation with role-based access, audit logging, controlled document handling, workflow automation and tenant-aware service boundaries.</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#divisions">Explore divisions</a>
          <a className="btn btn-secondary" href="/api/health">System health</a>
        </div>
      </section>

      <section id="divisions" className="shell section">
        <div className="section-heading">
          <div><span className="eyebrow">Platform map</span><h2>Enterprise divisions</h2></div>
          <span className="badge">PUBLIC SAFE VIEW</span>
        </div>
        <div className="grid">
          {divisions.map(([title, description]) => (
            <article className="card" key={title}><h3>{title}</h3><p>{description}</p><span className="card-link">Workspace module →</span></article>
          ))}
        </div>
      </section>

      <section className="shell section security-panel">
        <div><span className="eyebrow">Security by design</span><h2>Restricted credentials stay off public surfaces.</h2></div>
        <p>Public application code contains only approved company identity and contact data. Tax credentials, taxpayer information, payroll secrets and authentication material belong in restricted storage with least-privilege access.</p>
      </section>

      <footer className="footer shell">
        <strong>{PUBLIC_COMPANY.legalName}</strong>
        <span>{PUBLIC_COMPANY.city}, {PUBLIC_COMPANY.state} · {PUBLIC_COMPANY.phone}</span>
      </footer>
    </main>
  );
}
