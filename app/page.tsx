import { PUBLIC_COMPANY } from "@/lib/company";
import { Badge, Card, Progress, SectionHeading, Stat } from "@/components/ui";

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
        <div className="hero-layout">
          <div>
            <div className="eyebrow">Ross Tax Pro Software Co.</div>
            <h1>One enterprise operating system for tax, payroll, education, documents and support.</h1>
            <p className="hero-copy">A modular RTPSC foundation with role-based access, audit logging, controlled document handling, workflow automation and tenant-aware service boundaries.</p>
            <div className="hero-actions"><a className="btn btn-primary" href="#divisions">Explore divisions</a><a className="btn btn-secondary" href="/api/health">System health</a></div>
          </div>
          <aside className="command-card" aria-label="Enterprise readiness summary">
            <div className="command-card-header"><span>Enterprise readiness</span><Badge tone="success">Operational</Badge></div>
            <Progress label="Platform foundation" value={92} />
            <Progress label="Security controls" value={88} />
            <Progress label="Workflow coverage" value={76} />
          </aside>
        </div>
      </section>

      <section className="shell stats-grid" aria-label="Platform statistics">
        <Stat label="Enterprise divisions" value="06" detail="Unified access point" />
        <Stat label="Audit policy" value="100%" detail="Material actions recorded" />
        <Stat label="Support posture" value="24/7" detail="Workflow-ready routing" />
        <Stat label="Data boundary" value="RBAC" detail="Least-privilege controls" />
      </section>

      <section id="divisions" className="shell section">
        <SectionHeading eyebrow="Platform map" title="Enterprise divisions" description="One governed system, six purpose-built operating environments." action={<Badge>Public safe view</Badge>} />
        <div className="grid">
          {divisions.map(([title, description]) => (
            <Card key={title}><span className="card-index">{String(divisions.findIndex(item => item[0] === title) + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p><span className="card-link">Workspace module →</span></Card>
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
