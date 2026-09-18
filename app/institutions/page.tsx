import Link from "next/link";
import Image from "next/image";
import { RTPSCBrandFrame } from "@/components/rtpsc-brand-frame";
import { PUBLIC_COMPANY } from "@/lib/company";

export default function InstitutionsPage() {
  return (
    <RTPSCBrandFrame active="institutions">
      <main>
        <section className="subpage-hero institutions-hero">
          <span className="section-label section-label-gold">RTPSC INSTITUTIONS</span>
          <h1>Learning environments<br /><em>with their own identity.</em></h1>
          <p>Two distinct educational brands, each with a dedicated message, pathway structure, and source-controlled publishing standard.</p>
          <div className="hero-cta-row">
            <a className="cta cta-gold" href={"mailto:" + PUBLIC_COMPANY.publicEmail + "?subject=RTPSC%20Institution%20Information"}>Request information</a>
            <Link className="cta cta-outline-light" href="/">Return home</Link>
          </div>
        </section>

        <section className="institution-detail-grid shell-wide">
          <article className="institution-detail institute-detail">
            <div className="institution-detail-mark">
              <Image src="/rtpsc-mark.svg" alt="" width={80} height={80} />
              <span>TECHNICAL INSTITUTE</span>
            </div>
            <h2>Ross Tax Pro<br />Technical Institute</h2>
            <p className="institution-detail-lede">Career-focused technical learning built around the operating disciplines that power a professional tax and technology enterprise.</p>
            <div className="program-list">
              <span>Tax practice operations</span>
              <span>Payroll operations</span>
              <span>Software &amp; systems</span>
              <span>Compliance &amp; security</span>
              <span>Document operations</span>
              <span>Professional practice</span>
            </div>
            <strong className="institution-slogan">LEARN TODAY. BUILD TOMORROW.</strong>
          </article>

          <article className="institution-detail early-detail">
            <div className="institution-detail-mark">
              <div className="school-seal large">EU</div>
              <span>EARLY COLLEGE HIGH SCHOOL</span>
            </div>
            <h2>Dr. Edward Dee Urquhart<br />Early College High School</h2>
            <p className="institution-detail-lede">A dedicated early-college and career-readiness identity prepared for academic information, student resources, family engagement, and structured institutional communications.</p>
            <div className="program-list">
              <span>Academics</span>
              <span>Early-college pathways</span>
              <span>Career readiness</span>
              <span>Student services</span>
              <span>Family resources</span>
              <span>Governance &amp; notices</span>
            </div>
            <strong className="institution-slogan">PATHWAYS WITH PURPOSE.</strong>
          </article>
        </section>

        <section className="institution-publishing shell-wide">
          <div>
            <span className="section-label">SOURCE-CONTROLLED PUBLISHING</span>
            <h2>Clear identity.<br />Careful claims.</h2>
          </div>
          <p>Accreditation, licensure, charter status, credential-granting authority, admissions availability, dual-credit agreements, and regulatory approvals are published only after the applicable source documentation has been verified and registered.</p>
        </section>
      </main>
    </RTPSCBrandFrame>
  );
}
