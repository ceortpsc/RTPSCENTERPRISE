import { BRAND_REGISTRY, PRODUCTS, TAXONOMY } from "@/lib/comeaux/catalog";
import { formatMoney } from "@/lib/comeaux/store";
import styles from "../store.module.css";
import productStyles from "./products.module.css";

export const revalidate = 300;

const priceLabel = (kind: string) => kind === "market-reference" ? "Reference price" : kind === "starting-at" ? "Starting at" : "Store price";

export default function ProductsPage() {
  const activeCount = PRODUCTS.filter(product => product.catalogStatus === "active").length;
  const referenceCount = PRODUCTS.length - activeCount;
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}><div><div className={styles.eyebrow}>Catalog registry</div><h1>Products, pricing & taxonomy</h1><p>{PRODUCTS.length} catalog records: {activeCount} active Comeaux items and {referenceCount} third-party reference listings. Every item is keyed to SKU, taxonomy, image, pricing basis, quality specification, inventory status and compliance controls.</p></div></div>
      <div className={styles.notice}>Third-party brand images and prices are reference records supplied for merchandising research. Those items are held from checkout and Google Merchant sync until reseller authorization, supplier inventory and current product data are verified.</div>
      <div className={productStyles.taxonomyGrid}>
        <article className={productStyles.taxonomyCard}><strong>Brand tier</strong><span>{TAXONOMY.brandTiers.join(" · ")}</span></article>
        <article className={productStyles.taxonomyCard}><strong>Fit</strong><span>{TAXONOMY.fitTypes.join(" · ")}</span></article>
        <article className={productStyles.taxonomyCard}><strong>Fabric</strong><span>{TAXONOMY.fabricTypes.join(" · ")}</span></article>
        <article className={productStyles.taxonomyCard}><strong>Product type</strong><span>{TAXONOMY.productTypes.join(" · ")}</span></article>
      </div>
      <div className={styles.grid}>
        {PRODUCTS.map(product => (
          <article className={productStyles.productCard} id={product.sku} key={product.sku}>
            <div className={productStyles.productImageWrap}><img className={productStyles.productImage} src={product.imageUrl} alt={product.imageAlt} loading="lazy" referrerPolicy="no-referrer"/><span className={productStyles.imageFlag}>{product.imageSource === "supplied-reference" ? "Reference image" : "Store artwork"}</span></div>
            <div className={productStyles.productBody}>
              <div className={productStyles.productMeta}><span>{product.brand}</span><span>{product.brandTier}</span></div>
              <span className={styles.sku}>{product.sku}</span><h3>{product.name}</h3><p>{product.description}</p><p><strong>Quality:</strong> {product.quality}</p>
              <div className={productStyles.priceBlock}><small>{priceLabel(product.priceKind)} · checked {product.priceCheckedAt}</small><div className={styles.price}>{formatMoney(product.priceCents)}</div></div>
              <div className={styles.chips}><span className={styles.chip}>{product.productType}</span><span className={styles.chip}>{product.fitType}</span>{product.fabricTypes.map(fabric => <span className={styles.chip} key={fabric}>{fabric}</span>)}{product.catalogStatus === "active" ? <span className={styles.chip}>Qty {product.quantityOnHand}</span> : <span className={productStyles.holdChip}>authorization hold</span>}{product.customizable && <span className={styles.chip}>customizable</span>}{product.regulated && <span className={productStyles.holdChip}>compliance review</span>}</div>
            </div>
          </article>
        ))}
      </div>
      <div className={styles.sectionHead} style={{marginTop:"3rem"}}><div><div className={styles.eyebrow}>Brand registry</div><h2>Marketplace segmentation</h2><p>Brand records support merchandising and supplier onboarding without activating unauthorized inventory.</p></div></div>
      <div className={productStyles.brandTable}><table><thead><tr><th>Brand</th><th>Tier</th><th>Reference range</th><th>Positioning</th></tr></thead><tbody>{BRAND_REGISTRY.map(row => <tr key={row.brand}><td>{row.brand}</td><td>{row.tier}</td><td>{row.range}</td><td>{row.specialties.join(", ")}</td></tr>)}</tbody></table></div>
    </section>
  );
}
