import styles from "../store.module.css";

export default function CustomizePage() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div><div className={styles.eyebrow}>Editable design program</div><h1>Customize & print</h1><p>The production workflow is proof-driven: collect specifications, validate artwork rights, render a proof, capture approval, then release to print.</p></div>
      </div>
      <div className={styles.steps}>
        <div className={styles.step}>Choose an eligible garment, badge or print-service base SKU.</div>
        <div className={styles.step}>Enter name, title, credentials, placement, size, color and approved logo/artwork instructions.</div>
        <div className={styles.step}>Upload artwork and attest that you own it or have permission to reproduce it.</div>
        <div className={styles.step}>Generate and approve a digital proof; hash the approved proof and write acceptance to the audit ledger.</div>
        <div className={styles.step}>Create print job, reserve inventory, perform QC and release to shipment.</div>
      </div>
      <div className={styles.panel} style={{marginTop:"1.25rem"}}>
        <h2>Customization intake schema</h2>
        <div className={styles.formGrid}>
          <div className={styles.field}><label>Name / text</label><input disabled value="Example: A. Comeaux" readOnly /></div>
          <div className={styles.field}><label>Credentials</label><input disabled value="LVN" readOnly /></div>
          <div className={styles.field}><label>Production method</label><select disabled defaultValue="embroidery"><option value="embroidery">Embroidery</option><option>DTF</option><option>Sublimation</option><option>Engraving</option></select></div>
          <div className={styles.field}><label>Placement</label><select disabled defaultValue="left-chest"><option value="left-chest">Left chest</option><option>Right chest</option><option>Badge face</option></select></div>
        </div>
        <p className={styles.notice} style={{marginTop:"1rem"}}>The visible form is a storefront preview. Production submissions should be enabled only after authenticated customer accounts, object storage, malware scanning and payment credentials are configured.</p>
      </div>
    </section>
  );
}
