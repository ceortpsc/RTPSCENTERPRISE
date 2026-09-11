import { PRODUCTS, formatMoney } from "@/lib/comeaux/store";
import styles from "../store.module.css";

export const revalidate = 300;

export default function ProductsPage() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div><div className={styles.eyebrow}>Catalog registry</div><h1>Products & services</h1><p>Each line is keyed to a SKU, fulfillment class, inventory quantity, quality specification and customization/regulatory flag.</p></div>
      </div>
      <div className={styles.grid}>
        {PRODUCTS.map(product => (
          <article className={styles.card} id={product.sku} key={product.sku}>
            <span className={styles.sku}>{product.sku}</span>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>Quality:</strong> {product.quality}</p>
            <div className={styles.price}>{formatMoney(product.priceCents)}</div>
            <div className={styles.chips}>
              <span className={styles.chip}>Qty {product.quantityOnHand}</span>
              <span className={styles.chip}>{product.fulfillmentClass}</span>
              {product.customizable && <span className={styles.chip}>customizable</span>}
              {product.regulated && <span className={styles.chip}>compliance review</span>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
