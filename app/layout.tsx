import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RTPSC Enterprise | Ross Tax Pro Software Co.",
  description: "Unified enterprise operations for Ross Tax Pro Software Co."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
