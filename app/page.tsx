import Image from "next/image";
import Link from "next/link";
import { RTPSCBrandFrame } from "@/components/rtpsc-brand-frame";
import { PUBLIC_COMPANY } from "@/lib/company";

const platforms = [
  { number: "01", name: "PrimeWeb", kicker: "Tax platform", copy: "A professional tax-practice workspace for intake, return operations, e-file work, client service, refund visibility, agreements, invoicing, and practice management.", tone: "gold" },
  { number: "02", name: "Tax Practitioner Virtual Office", kicker: "Practice operations", copy: "Structured workflows for client cases, notices, transcript support, document control, review, and accountable practitioner operations.", tone: "navy" },
  { number: "03", name: "ETRAC", kicker: "Refund intelligence", copy: "Refund and transcript intelligence with status normalization, consent-aware review, master-file operations, and auditable case routing.", tone: "cream" },
  { number: "04", name: "Ross Prime Payroll", kicker: "Workforce operations", copy: "Timekeeping, payroll-ledger continuity, employee records, pay-cycle workflows, and employer service controls built around verified source data.", tone: "navy" },
  { number: "05", name: "Rapid Response Audit Defense", kicker: "Notice response", copy: "Notice intake, evidence organization, response workflows, appeals support, deadline tracking, and case-binder coordination.", tone: "cream" },
  { number: "06", name: "Ross PDF Universal Editor", kicker: "Document systems", copy: "Controlled document editing, OCR-oriented workflows, signatures, exports, forms, and records handling for the modern practice.", tone: "gold" },
] as const;

const capabilityPillars = [
  ["Human-reviewed controls", "Consequential actions remain behind explicit review, authorization, and release gates."],
  ["Evidence-first operations", "Source records, status evidence, and audit history stay separate from presentation-layer claims."],
  ["One brand system", "Software, education, payroll, documents, support, and public marketing share one recognizable visual language."],
] as const;

export default function HomePage() {
  return (
    <RTPSCBrandFrame>
      <main>
        <section className="brand-hero" id="top">
          <div className="hero-copy-column">
            <div className="hero-kicker">TAXES • PEOPLE • TECHNOLOGY</div>
            <h1>Tax intelligence for <em>a brighter tomorrow.</em></h1>
            <p className="hero-lede">
              Ross Tax Pro Software Co. brings professional tax operations, payroll, document systems,
              technical education, and governed technology into one polished enterprise ecosystem.
            </p>
            <div className="hero-cta-row">
              <Link className="cta cta-dark" href="/platforms">Explore platforms</Link>
              <a className="cta cta-light" href={"mailto:" + PUBLIC_COMPANY.publicEmail + "?subject=RTPSC%20Demo%20Request"}>Request a demo</a>
            </div>
            <div className="hero-proofline">
              <span>Secure access</span>
              <span>Human-reviewed controls</span>
              <span>Evidence-first operations</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Andreaa Chan’nel, CEO and Owner">
            <div className="hero-portrait-frame">
              <Image
                src="/andreaa-ceo.svg"
                alt="Andreaa Chan’nel, CEO and Owner of Ross Tax Pro Software Co."
                fill
                sizes="(max-width: 900px) 92vw, 40vw"
                className="hero-portrait"
                priority
              />
              <div className="portrait-shade" />
              <div className="portrait-id">
                <span>CEO &amp; OWNER</span>
                <strong>Andreaa Chan’nel</strong>
                <small>Business • Tax • Technology • Education</small>
              </div>
            </div>
            <div className="hero-float hero-float-top">
              <Image src="/rtpsc-mark.svg" alt="" width={38} height={38} />
              <span><strong>ROSS TAX PRO</strong><small>SOFTWARE CO.</small></span>
            </div>
            <div className="hero-float hero-float-bottom">
              <small>REAL TALK.</small>
              <strong>REAL TOOLS. REAL RESULTS.</strong>
            </div>
          </div>
        </section>

        <section className="brand-marquee" aria-label="Ross Tax Pro Software Co. brand promise">
          <span>FOLLOW</span><i>•</i><span>LEARN</span><i>•</i><span>ENGAGE</span><i>•</i><span>GROW</span><i>•</i><span>WIN</span>
        </section>

        <section className="editorial-intro shell-wide">
          <div>
            <span className="section-label">BUILT TO OPERATE. DESIGNED TO LEAD.</span>
            <h2>One enterprise brand.<br /><em>Distinct operating systems.</em></h2>
          </div>
          <div className="editorial-copy">
            <p>
              The public experience is designed like the company itself: structured, precise, high-touch,
              and unmistakably RTPSC. Each division gets its own purpose without losing the corporate
              identity that connects the whole ecosystem.
            </p>
            <a className="text-link" href="#solutions">See how the system fits together <span>↗</span></a>
          </div>
        </section>

        <section id="solutions" className="platform-showcase shell-wide">
          <div className="section-title-row">
            <div>
              <span className="section-label">PLATFORM PORTFOLIO</span>
              <h2>Professional infrastructure,<br />without the generic software feel.</h2>
            </div>
            <Link className="micro-cta" href="/platforms">View full platform directory</Link>
          </div>
          <div className="platform-mosaic">
            {platforms.map((platform) => (
              <article className={"platform-panel platform-" + platform.tone} key={platform.name}>
                <div className="platform-topline">
                  <span>{platform.number}</span>
                  <small>{platform.kicker}</small>
                </div>
                <h3>{platform.name}</h3>
                <p>{platform.copy}</p>
                <span className="panel-action">Explore capability <b>↗</b></span>
              </article>
            ))}
          </div>
        </section>

        <section className="ceo-feature shell-wide" id="ceo">
          <div className="ceo-portrait">
            <Image
              src="/andreaa-ceo.svg"
              alt="Andreaa Chan’nel"
              fill
              sizes="(max-width: 900px) 100vw, 44vw"
              className="ceo-image"
            />
            <div className="ceo-monogram">A·C</div>
          </div>
          <div className="ceo-story">
            <span className="section-label section-label-gold">EXECUTIVE BRAND PERSONA</span>
            <h2>Andreaa Chan’nel</h2>
            <p className="ceo-role">CEO &amp; Owner · Ross Tax Pro Software Co.</p>
            <p className="ceo-lede">
              A public-facing executive voice connecting business, tax, technology, education, software,
              and professional development through one consistent brand experience.
            </p>
            <blockquote>“Same vision. Bigger impact.”</blockquote>
            <div className="ceo-tags">
              <span>Business</span><span>Tax</span><span>Technology</span><span>Education</span>
            </div>
            <a className="cta cta-gold" href="#campaigns">View campaign direction</a>
          </div>
        </section>

        <section className="institution-band" id="training">
          <div className="institution-inner shell-wide">
            <div className="institution-heading">
              <span className="section-label section-label-gold">INSTITUTIONS &amp; TRAINING</span>
              <h2>Career-ready learning,<br />presented with institutional clarity.</h2>
              <p>
                The education portfolio is no longer grouped under a generic “Universities” label.
                Each institution receives its own identity, message, and controlled publishing surface.
              </p>
              <Link className="cta cta-cream" href="/institutions">Explore institutions</Link>
            </div>
            <div className="institution-stack">
              <article className="institution-card institute-card">
                <div className="seal-lockup"><Image src="/rtpsc-mark.svg" alt="" width={56} height={56} /></div>
                <span>TECHNICAL INSTITUTE</span>
                <h3>Ross Tax Pro Technical Institute</h3>
                <p>Career-focused pathways in tax operations, payroll, software workflows, compliance, documents, and professional practice.</p>
                <strong>LEARN TODAY. BUILD TOMORROW.</strong>
              </article>
              <article className="institution-card early-card">
                <div className="school-seal">EU</div>
                <span>EARLY COLLEGE HIGH SCHOOL</span>
                <h3>Dr. Edward Dee Urquhart Early College High School</h3>
                <p>Structured academic, early-college, career-readiness, student-service, and family-facing information in a dedicated institutional environment.</p>
                <strong>PATHWAYS WITH PURPOSE.</strong>
              </article>
            </div>
          </div>
        </section>

        <section id="campaigns" className="campaign-studio shell-wide">
          <div className="section-title-row">
            <div>
              <span className="section-label">CAMPAIGN STUDIO</span>
              <h2>Marketing that looks built,<br />not dropped into a template.</h2>
            </div>
            <Link className="micro-cta" href="/brand">Open brand &amp; campaign kit</Link>
          </div>

          <div className="campaign-grid">
            <article className="campaign-card tax-campaign">
              <div className="campaign-badge">TAX SEASON 2026</div>
              <h3>Ready before<br />the rush.</h3>
              <p>Individual returns · business returns · self-employed · investments &amp; rentals · amended returns · payroll services</p>
              <a href={"mailto:" + PUBLIC_COMPANY.publicEmail + "?subject=Tax%20Consultation"}>Book a consultation <span>→</span></a>
              <Image src="/rtpsc-mark.svg" alt="" width={58} height={58} />
            </article>

            <article className="campaign-card platform-campaign">
              <span>PRIMEWEB</span>
              <h3>Built by a tax pro.<br />For tax pros.</h3>
              <div className="platform-ui-mock" aria-hidden="true">
                <div className="mock-sidebar"><i /><i /><i /><i /></div>
                <div className="mock-main"><b /><b /><span /><span /><span /></div>
              </div>
              <a href={"mailto:" + PUBLIC_COMPANY.publicEmail + "?subject=PrimeWeb%20Demo"}>Request a demo <span>→</span></a>
            </article>

            <article className="campaign-card growth-campaign">
              <span>BUSINESS SYSTEMS</span>
              <h3>Build the business<br />behind the business.</h3>
              <p>Structure · compliance · payroll · operations · systems · professional growth</p>
              <a href="/platforms">Explore the ecosystem <span>→</span></a>
              <div className="growth-lines" aria-hidden="true"><i /><i /><i /></div>
            </article>
          </div>
          <p className="campaign-note">Campaign concepts shown for brand presentation. Offers, pricing, eligibility, and regulated claims should be verified before public launch.</p>
        </section>

        <section className="operating-principles shell-wide">
          <div className="principles-copy">
            <span className="section-label">WHY RTPSC</span>
            <h2>Premium presentation.<br />Controlled operations.</h2>
            <p>High-end branding does not replace controls; it makes the system easier to understand. The visual layer and the source-of-truth layer stay deliberately separate.</p>
          </div>
          <div className="principles-list">
            {capabilityPillars.map(([title, copy], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <div><h3>{title}</h3><p>{copy}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="final-cta">
          <div className="final-cta-mark"><Image src="/rtpsc-mark.svg" alt="" width={74} height={74} /></div>
          <span className="section-label section-label-gold">YOUR SUCCESS. OUR COMMITMENT.</span>
          <h2>Build smarter.<br />Operate stronger.</h2>
          <p>Explore the RTPSC ecosystem or start a direct conversation about the platform, training, support, or enterprise services you need.</p>
          <div className="hero-cta-row final-buttons">
            <Link className="cta cta-gold" href="/platforms">Explore RTPSC</Link>
            <a className="cta cta-outline-light" href={"mailto:" + PUBLIC_COMPANY.publicEmail}>Start a conversation</a>
          </div>
        </section>
      </main>
    </RTPSCBrandFrame>
  );
}
