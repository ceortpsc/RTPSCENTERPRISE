import { notFound } from "next/navigation";
import { POLICIES, type PolicySlug } from "@/lib/comeaux/store";
import styles from "../../store.module.css";

export function generateStaticParams() {
  return Object.keys(POLICIES).map(slug => ({ slug }));
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = POLICIES[slug as PolicySlug];
  if (!policy) notFound();

  return (
    <article className={`${styles.section} ${styles.prose}`}>
      <div className={styles.eyebrow}>Store policy • Updated {policy.updated}</div>
      <h1>{policy.title}</h1>
      {policy.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      <div className={styles.notice}>
        This policy template is operational copy, not a substitute for jurisdiction-specific legal advice. Before launch, counsel should review the seller entity, states/countries served, product mix, fulfillment model, accessibility, marketing channels and privacy/data practices.
      </div>
    </article>
  );
}
