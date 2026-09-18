import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rtpscenterprise.onrender.com"),
  title: {
    default: "Ross Tax Pro Software Co. | Tax Intelligence for a Brighter Tomorrow",
    template: "%s | Ross Tax Pro Software Co.",
  },
  description: "Ross Tax Pro Software Co. unifies professional tax operations, payroll, document systems, technical education, and governed technology in one enterprise ecosystem.",
  applicationName: "Ross Tax Pro Software Co.",
  keywords: [
    "Ross Tax Pro Software Co.",
    "PrimeWeb",
    "tax software",
    "tax practice technology",
    "payroll operations",
    "tax education",
    "document systems",
    "ETRAC",
  ],
  openGraph: {
    type: "website",
    siteName: "Ross Tax Pro Software Co.",
    title: "Tax Intelligence for a Brighter Tomorrow",
    description: "Professional tax operations, payroll, document systems, technical education, and governed technology under one RTPSC brand.",
    url: "https://rtpscenterprise.onrender.com",
    images: [{ url: "/andreaa-ceo.svg", width: 520, height: 500, alt: "Andreaa Chan’nel, CEO & Owner" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ross Tax Pro Software Co.",
    description: "Smarter Software. Stronger Results.",
    images: ["/andreaa-ceo.svg"],
  },
  icons: {
    icon: "/rtpsc-mark.svg",
    shortcut: "/rtpsc-mark.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#061B34",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
