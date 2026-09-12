import Link from "next/link";
import { STORE } from "@/lib/comeaux/store";
import { PRODUCTS } from "@/lib/comeaux/catalog";
import styles from "./store.module.css";

export const revalidate = 900;

export default function StoreHome() {
  const activeProducts = PRODUCTS.filter(product => product.catalogStatus === "active");
  const referenceProducts = PRODUCTS.length - activeProducts.length;
  const jsonLd = {"@context":"https://schema.org","@type":"OnlineStore",name:STORE.name,description:"Medical-supply retail, scrubs, custom badges and garment-printing services.",url:`${process.env.NEXT_PUBLIC_COMEAUX_STORE_ORIGIN || "http://localhost:3000"}/comeaux-supply`};
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}} />
    <section className={styles.hero}><div><div className={styles.eyebrow}>Nurse-founded retail + personalization</div><h1>Clinical essentials, uniforms & custom print—built for care teams.</h1><p>A fully online storefront for scrubs, underlayers, badges, selected non-prescription medical supplies and print-for-profit services, with SKU-level inventory, digital proofs, order footprints and secure fulfillment.</p><div className={styles.actions}><Link className={styles.primary} href="/comeaux-supply/products">Shop products</Link><Link className={styles.secondary} href="/comeaux-supply/customize">Start a custom order</Link></div></div><aside className={styles.panel}><div className={styles.eyebrow}>Commerce control center</div><h2>Built for online distribution</h2><div className={styles.statusGrid}><div className={styles.status}><strong>{PRODUCTS.length}</strong><span>catalog records</span></div><div className={styles.status}><strong>{activeProducts.length}</strong><span>active house items</span></div><div className={styles.status}><strong>{referenceProducts}</strong><span>brand reference holds</span></div><div className={styles.status}><strong>Audit</strong><span>order + policy footprints</span></div></div></aside></section>
    <section className={styles.section}><div className={styles.sectionHead}><div><div className={styles.eyebrow}>Core departments</div><h2>Everything the storefront needs to sell and fulfill.</h2></div></div><div className={styles.grid}>{[["Uniform Shop","Scrubs, layering pieces and workwear variants with color, size, quantity and supplier-quality records."],["Clinical Supplies","Selected lawful retail supplies with lot, expiration, manufacturer labeling and compliance flags."],["Badge Studio","Name, credentials, title, logo, fastener and proof-approval workflow."],["Print-for-Profit","Customer artwork intake, rights attestation, preflight, proof, production queue and QC."],["Order Operations","Cart, checkout, invoices, receipts, fulfillment, shipment events, taxes and support notes."],["Security & Fraud","reCAPTCHA assessments, velocity signals, transaction risk, audit logs and employee RBAC."]].map(([title,copy]) => <article className={styles.card} key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className={styles.section}><div className={styles.notice}>Storefront medical-product information is retail information only. Catalog governance must prevent prescription-only products or unsupported clinical claims from being published without verified licensing and regulatory review.</div></section>
  </>;
}
