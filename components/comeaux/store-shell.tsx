import Link from "next/link";
import { STORE } from "@/lib/comeaux/store";
import styles from "@/app/comeaux-supply/store.module.css";

const nav = [
  ["Shop", "/comeaux-supply/products"],
  ["Customize", "/comeaux-supply/customize"],
  ["Account", "/comeaux-supply/account"],
  ["Policies", "/comeaux-supply/legal/terms"]
] as const;

export function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.store}>
      <div className={styles.utility}>
        <span>Online fulfillment • Custom print • Secure checkout</span>
        <span>{STORE.founder} • {STORE.founderDescriptor}</span>
      </div>
      <header className={styles.header}>
        <Link href="/comeaux-supply" className={styles.brand}>
          <span className={styles.mark}>CC</span>
          <span><strong>{STORE.shortName}</strong><small>{STORE.tagline}</small></span>
        </Link>
        <nav aria-label="Store navigation">
          {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
      </header>
      <main>{children}</main>
      <footer className={styles.footer}>
        <div>
          <strong>{STORE.name}</strong>
          <p>Retail medical supplies, uniforms, personalization and print-for-profit services.</p>
        </div>
        <div className={styles.footerLinks}>
          <Link href="/comeaux-supply/legal/privacy">Privacy</Link>
          <Link href="/comeaux-supply/legal/terms">Terms</Link>
          <Link href="/comeaux-supply/legal/final-sale">Final Sale / No Exchange</Link>
          <Link href="/comeaux-supply/legal/shipping">Shipping</Link>
          <Link href="/comeaux-supply/legal/medical-disclaimer">Medical Disclaimer</Link>
        </div>
        <p className={styles.finePrint}>
          © {new Date().getFullYear()} {STORE.copyrightOwner}. All rights reserved. Product and medical-supply information is retail information only, not medical advice. Customized and hygiene-sensitive items may be final sale except where law requires otherwise.
        </p>
      </footer>
    </div>
  );
}
