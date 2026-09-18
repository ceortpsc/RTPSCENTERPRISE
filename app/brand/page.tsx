import Image from "next/image";
import { RTPSCBrandFrame } from "@/components/rtpsc-brand-frame";
import { PUBLIC_COMPANY } from "@/lib/company";

const messages = [
  ["Corporate", "Smarter Software. Stronger Results."],
  ["Commitment", "Your Success. Our Commitment."],
  ["Executive", "Same vision. Bigger impact."],
  ["Campaign", "Real talk. Real tools. Real results."],
] as const;

export default function BrandPage() {
  return (
    <RTPSCBrandFrame active="brand">
      <main>
        <section className="subpage-hero brandkit-hero">
          <span className="section-label section-label-gold">RTPSC BRAND &amp; CAMPAIGN KIT</span>
          <h1>A brand system built<br /><em>to travel everywhere.</em></h1>
          <p>Corporate identity, executive presentation, campaign direction, CTA language, logo variants, and marketing rules assembled into one public-safe presentation system.</p>
        </section>

        <section className="logo-suite shell-wide">
          <div className="brand-section-heading">
            <span className="section-label">LOGO SUITE</span>
            <h2>One mark. Multiple controlled applications.</h2>
          </div>
          <div className="logo-display-grid">
            <article className="logo-display logo-display-cream"><Image src="/rtpsc-logo.svg" alt="Ross Tax Pro Software Co. primary logo" width={250} height={90} /><span>PRIMARY</span></article>
            <article className="logo-display logo-display-navy"><Image src="/rtpsc-logo-light.svg" alt="Ross Tax Pro Software Co. light logo" width={250} height={90} /><span>REVERSED</span></article>
            <article className="logo-display logo-display-white"><Image src="/rtpsc-logo-mono.svg" alt="Ross Tax Pro Software Co. monochrome logo" width={250} height={90} /><span>MONOCHROME</span></article>
            <article className="logo-display logo-display-gold"><Image src="/rtpsc-mark.svg" alt="Ross Tax Pro Software Co. shield mark" width={92} height={92} /><span>SHIELD MARK</span></article>
          </div>
        </section>

        <section className="brand-color-section">
          <div className="shell-wide color-layout">
            <div className="brand-section-heading">
              <span className="section-label section-label-gold">SIGNATURE PALETTE</span>
              <h2>Navy authority.<br />Gold momentum.<br />Cream clarity.</h2>
            </div>
            <div className="swatch-grid" aria-label="RTPSC signature color palette">
              <div className="swatch swatch-navy"><strong>RTPSC NAVY</strong><span>#061B34</span></div>
              <div className="swatch swatch-gold"><strong>SIGNATURE GOLD</strong><span>#D6A44B</span></div>
              <div className="swatch swatch-cream"><strong>EDITORIAL CREAM</strong><span>#F6EFE3</span></div>
              <div className="swatch swatch-ink"><strong>INK</strong><span>#071421</span></div>
            </div>
          </div>
        </section>

        <section className="message-system shell-wide">
          <div className="brand-section-heading">
            <span className="section-label">MESSAGE SYSTEM</span>
            <h2>Short enough to remember.<br />Strong enough to own the room.</h2>
          </div>
          <div className="message-grid">
            {messages.map(([label, message]) => (
              <article key={label}><span>{label}</span><strong>{message}</strong></article>
            ))}
          </div>
        </section>

        <section className="cta-library shell-wide">
          <div className="brand-section-heading">
            <span className="section-label">CTA LIBRARY</span>
            <h2>Calls to action with an operating purpose.</h2>
          </div>
          <div className="cta-specimen-grid">
            <article><span>PRODUCT</span><a className="cta cta-dark" href="/platforms">Explore platforms</a><small>Use for discovery and portfolio navigation.</small></article>
            <article><span>DEMO</span><a className="cta cta-gold" href={"mailto:" + PUBLIC_COMPANY.publicEmail + "?subject=Demo%20Request"}>Request a demo</a><small>Use when a product conversation is the next step.</small></article>
            <article><span>EDUCATION</span><a className="cta cta-light" href="/institutions">Explore institutions</a><small>Use for institutional and learning pathways.</small></article>
            <article><span>CONTACT</span><a className="cta cta-outline-dark" href={"mailto:" + PUBLIC_COMPANY.publicEmail}>Start a conversation</a><small>Use for high-intent or cross-division inquiries.</small></article>
          </div>
        </section>

        <section className="campaign-rules">
          <div className="shell-wide campaign-rules-inner">
            <div>
              <span className="section-label section-label-gold">CAMPAIGN STANDARD</span>
              <h2>No filler.<br />No fake urgency.<br />No generic tiles.</h2>
            </div>
            <div className="rules-list">
              <p><b>01</b><span><strong>Lead with one message.</strong> Every ad gets one visual hierarchy and one dominant CTA.</span></p>
              <p><b>02</b><span><strong>Use real brand assets.</strong> RTPSC marks, executive imagery, signature palette, and approved copy replace stock-looking filler.</span></p>
              <p><b>03</b><span><strong>Verify promotional claims.</strong> Pricing, discounts, eligibility, results, regulatory status, and deadlines require source approval before publishing.</span></p>
              <p><b>04</b><span><strong>Design for conversion and trust.</strong> Strong typography, clear service language, accessible contrast, and direct routing are the baseline.</span></p>
            </div>
          </div>
        </section>
      </main>
    </RTPSCBrandFrame>
  );
}
