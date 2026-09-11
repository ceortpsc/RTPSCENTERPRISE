import styles from "../store.module.css";

export default function AccountPage() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div><div className={styles.eyebrow}>Identity & access</div><h1>Customer / employee accounts</h1><p>Google Sign-In can be enabled with a configured OAuth client. Store roles remain server-authoritative and are never inferred solely from an email address.</p></div>
      </div>
      <div className={styles.grid}>
        <article className={styles.card}><h3>Customer</h3><p>Profile, saved addresses, orders, invoices, receipts, customization proofs, support cases and policy acceptances.</p></article>
        <article className={styles.card}><h3>Fulfillment employee</h3><p>Pick/pack, print queue, lot/expiration checks, shipment events and QC with least-privilege permissions.</p></article>
        <article className={styles.card}><h3>Manager / administrator</h3><p>Catalog, pricing, inventory, fraud review, refunds required by law, employee access, integrations and immutable audit events.</p></article>
      </div>
      <div className={styles.notice} style={{marginTop:"1rem"}}>
        Authentication is not authorization. Google identity establishes an account identity; the application database controls roles, permissions, account status and employee access.
      </div>
    </section>
  );
}
