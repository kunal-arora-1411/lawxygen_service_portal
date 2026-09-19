import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lawxygen",
  description: "Track your legal, tax and compliance services.",
  // Everything here is behind a login, so there is nothing to index and a crawler
  // reaching it at all would mean something is wrong.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
