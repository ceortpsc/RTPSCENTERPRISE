import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export function Button({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return <button className={`btn btn-${variant} ${className}`.trim()} {...props} />;
}

export function Badge({ tone = "gold", children }: { tone?: "gold" | "success" | "warning" | "danger" | "neutral"; children: ReactNode }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Card({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <article className={`card ${className}`.trim()} {...props} />;
}

export function Stat({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return <Card className="stat"><span className="stat-label">{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</Card>;
}

export function Progress({ label, value }: { label: string; value: number }) {
  const safeValue = Math.min(100, Math.max(0, value));
  return <div className="progress-block"><div className="progress-meta"><span>{label}</span><strong>{safeValue}%</strong></div><div className="progress-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={safeValue}><span style={{ width: `${safeValue}%` }} /></div></div>;
}

export function Alert({ title, children, tone = "info" }: { title: string; children: ReactNode; tone?: "info" | "success" | "warning" | "danger" }) {
  return <div className={`alert alert-${tone}`} role={tone === "danger" ? "alert" : "status"}><span className="alert-mark" aria-hidden="true" /><div><strong>{title}</strong><p>{children}</p></div></div>;
}

export function Field({ label, hint, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }) {
  const id = props.id || `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return <label className="field" htmlFor={id}><span>{label}</span><input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} {...props} />{error ? <small id={`${id}-error`} className="field-error">{error}</small> : hint ? <small id={`${id}-hint`}>{hint}</small> : null}</label>;
}

export function DataTable({ caption, columns, rows }: { caption: string; columns: string[]; rows: ReactNode[][] }) {
  return <div className="table-wrap"><table><caption>{caption}</caption><thead><tr>{columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

export function EmptyState({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return <div className="empty-state"><span aria-hidden="true">◇</span><h3>{title}</h3><p>{message}</p>{action}</div>;
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{description && <p className="section-copy">{description}</p>}</div>{action}</div>;
}
