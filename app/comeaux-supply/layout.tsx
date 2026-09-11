import type { Metadata } from "next";
import { StoreShell } from "@/components/comeaux/store-shell";

export const metadata: Metadata = {
  title: {
    default: "Comeaux Clinical Supply & Print Co.",
    template: "%s | Comeaux Clinical Supply & Print Co."
  },
  description: "Medical-supply retail, scrubs, underscrubs, custom name badges and print-for-profit services.",
  keywords: ["scrubs", "medical supplies", "custom name badges", "custom scrubs", "nursing uniforms", "print services"],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Comeaux Clinical Supply & Print Co.",
    description: "Clinical essentials. Personalized with care.",
    type: "website"
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  }
};

export default function ComeauxStoreLayout({ children }: { children: React.ReactNode }) {
  return <StoreShell>{children}</StoreShell>;
}
