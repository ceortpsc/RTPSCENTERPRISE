import Image from "next/image";
import Link from "next/link";
import { PUBLIC_COMPANY } from "@/lib/company";
import type { ReactNode } from "react";

export function RTPSCBrandFrame({ children, active }: { children: ReactNode; active?: "platforms" | "institutions" | "brand" }) {
  return (
    <>
      <header className="rtpsc-header">
        <div className="rtpsc-nav">
          <Link className="rtpsc-lockup" href="/" aria-label="Ross Tax Pro Software Co. home">
            <Image src="/rtpsc-logo.svg" alt="" width={52} height={52} priority />
            <span>
              <strong>ROSS TAX PRO</strong>
              <small>SOFTWARE CO.</small>
            </span>
          </Link>
          <nav className="rtpsc-links" aria-label="Primary navigation">
            <Link className={active === "platforms" ? "is-active" : ""} href="/platforms">Platforms</Link>
            <Link href="/#solutions">Solutions</Link>
            <Link className={active === "institutions" ? "is-active" : ""} href="/institutions">Institutions</Link>
            <Link href="/#training">Training</Link>
            <Link className={active === "brand" ? "is-active" : ""} href="/brand">Brand</Link>
            <a href={"mailto:" + PUBLIC_COMPANY.publicEmail} className="nav-cta">Contact</a>
          </nav>
        </div>
      </header>
      {children}
      <footer className="rtpsc-footer">
        <div className="footer-brand">
          <Image src="/rtpsc-logo-light.svg" alt="Ross Tax Pro Software Co." width={180} height={56} />
          <p>Taxes. People. Technology.</p>
        </div>
        <div className="footer-directory">
          <strong>Explore</strong>
          <Link href="/platforms">Platforms</Link>
          <Link href="/institutions">Institutions</Link>
          <Link href="/brand">Brand system</Link>
        </div>
        <div className="footer-directory">
          <strong>Connect</strong>
          <a href={"mailto:" + PUBLIC_COMPANY.publicEmail}>{PUBLIC_COMPANY.publicEmail}</a>
          <a href={"tel:" + PUBLIC_COMPANY.phone.replace(/[^0-9]/g, "")}>{PUBLIC_COMPANY.phone}</a>
          <span>{PUBLIC_COMPANY.city}, {PUBLIC_COMPANY.state}</span>
        </div>
        <div className="footer-final">
          <span>Smarter Software. Stronger Results.</span>
          <small>Operational, regulatory, accreditation, and authority claims remain subject to documented source verification before publication.</small>
        </div>
      </footer>
    </>
  );
}
