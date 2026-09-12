import Link from "next/link";
import { CREDENTIALS, PROMOTION_TEMPLATES, TEXAS_CARE_DISCOUNT } from "@/lib/comeaux/discounts";
import styles from "../store.module.css";

export const revalidate = 3600;

export default function DiscountsPage() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <div className={styles.eyebrow}>Texas healthcare professional savings</div>
          <h1>{TEXAS_CARE_DISCOUNT.name}</h1>
          <p>
            Verified Texas nurses, certified nurse aides and medication aides can receive a baseline {TEXAS_CARE_DISCOUNT.defaultDiscountPercent}% eligible-item discount after credential review is linked to their customer account.
          </p>
        </div>
      </div>

      <div className={styles.notice}>
        {TEXAS_CARE_DISCOUNT.disclaimer} Credential verification is used only to determine retail-program eligibility and is not an employment, credentialing, clinical-privilege, or background-check decision.
      </div>

      <div className={styles.grid} style={{marginTop:"1.25rem"}}>
        {Object.entries(CREDENTIALS).map(([code, item]) => (
          <article className={styles.card} key={code}>
            <span className={styles.sku}>{code} verification lane</span>
            <h3>{item.label}</h3>
            <p><strong>Regulator:</strong> {item.regulator}</p>
            <p><strong>Verification:</strong> {item.source}</p>
            <p>{item.notes}</p>
            <a className={styles.secondary} href={item.verificationUrl} target="_blank" rel="noreferrer">Open official verification source</a>
          </article>
        ))}
      </div>

      <div className={styles.panel} style={{marginTop:"1.4rem"}}>
        <div className={styles.eyebrow}>Promos & sale templates</div>
        <h2>Built for appreciation campaigns without uncontrolled coupon stacking</h2>
        <div className={styles.grid}>
          {PROMOTION_TEMPLATES.map(promo => (
            <article className={styles.card} key={promo.code}>
              <span className={styles.sku}>{promo.code}</span>
              <h3>{promo.name}</h3>
              <div className={styles.price}>{promo.discountPercent}%</div>
              <p>{promo.description}</p>
              <div className={styles.chips}>
                <span className={styles.chip}>{promo.audience}</span>
                <span className={styles.chip}>{promo.oneTimePerCustomer ? "one-time" : "campaign"}</span>
                <span className={styles.chip}>{promo.activeByDefault ? "active" : "admin activation required"}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.panel} style={{marginTop:"1.4rem"}}>
        <div className={styles.eyebrow}>Account linking workflow</div>
        <h2>How verification unlocks savings</h2>
        <div className={styles.steps}>
          <div className={styles.step}>Sign in to the Comeaux Clinical customer account.</div>
          <div className={styles.step}>Select RN, LVN, APRN, CNA or Medication Aide and provide the credential number plus the name used on the public credential record. Do not submit an SSN.</div>
          <div className={styles.step}>Staff verifies the credential through the applicable official Texas primary-source/public registry.</div>
          <div className={styles.step}>A verified entitlement is linked to the customer account with source, verifier, verification timestamp and revalidation date.</div>
          <div className={styles.step}>Checkout automatically applies the eligible healthcare-worker savings or the better non-stackable promotional price.</div>
        </div>
      </div>

      <div className={styles.actions}>
        <Link className={styles.primary} href="/comeaux-supply/account">Link credential to account</Link>
        <Link className={styles.secondary} href="/comeaux-supply/products">Shop eligible products</Link>
      </div>
    </section>
  );
}
