import Link from "next/link";
import { CREDENTIALS, TEXAS_CARE_DISCOUNT } from "@/lib/comeaux/discounts";
import styles from "../store.module.css";

export default function AccountPage() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <div className={styles.eyebrow}>Identity, access & professional savings</div>
          <h1>Customer / employee accounts</h1>
          <p>Google Sign-In can establish account identity. Store roles, discounts and credential entitlements remain server-authoritative and are never inferred from an email address or job title alone.</p>
        </div>
      </div>

      <div className={styles.grid}>
        <article className={styles.card}><h3>Customer</h3><p>Profile, saved addresses, orders, invoices, receipts, customization proofs, support cases, policy acceptances and verified healthcare-worker savings.</p></article>
        <article className={styles.card}><h3>Fulfillment employee</h3><p>Pick/pack, print queue, lot/expiration checks, shipment events and QC with least-privilege permissions.</p></article>
        <article className={styles.card}><h3>Manager / administrator</h3><p>Catalog, pricing, inventory, credential-review queue, discount campaigns, fraud review, legally required refunds, employee access, integrations and audit events.</p></article>
      </div>

      <div className={styles.panel} style={{marginTop:"1.25rem"}}>
        <div className={styles.eyebrow}>Texas credential linking</div>
        <h2>{TEXAS_CARE_DISCOUNT.shortName}</h2>
        <p>Eligible customer accounts may receive a baseline {TEXAS_CARE_DISCOUNT.defaultDiscountPercent}% eligible-item discount after the credential is verified against the appropriate Texas source.</p>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label htmlFor="credential-type">Credential type</label>
            <select id="credential-type" defaultValue="LVN">
              {Object.entries(CREDENTIALS).map(([code, item]) => <option key={code} value={code}>{item.label}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="credential-number">Credential / permit number</label>
            <input id="credential-number" placeholder="Enter credential number" autoComplete="off" />
          </div>
          <div className={styles.field}>
            <label htmlFor="credential-name">Name on credential</label>
            <input id="credential-name" placeholder="Full legal name shown in registry" autoComplete="name" />
          </div>
          <div className={styles.field}>
            <label>Verification status</label>
            <input readOnly value="Not submitted — official registry review required" />
          </div>
        </div>
        <p className={styles.notice} style={{marginTop:"1rem"}}>Do not enter a Social Security number, date of birth, patient information or employer medical records. Only credential information needed for public-registry verification should be used.</p>
        <div className={styles.actions}>
          <Link className={styles.primary} href="/comeaux-supply/discounts">Review verification program</Link>
        </div>
      </div>

      <div className={styles.notice} style={{marginTop:"1rem"}}>
        Authentication is not authorization. Google identity establishes an account identity; the application database controls roles, permissions, account status and professional-discount eligibility.
      </div>
    </section>
  );
}
