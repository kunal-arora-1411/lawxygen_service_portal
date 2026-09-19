import type { Metadata } from "next";

import {
  Inter,
  Inter_Tight,
} from "next/font/google";

import { SmoothScroll } from "@/components/providers/SmoothScroll";

import "./globals.css";
import "./lawxygen-v3.css";
import "./navbar-final.css";
import "./service-mega-light.css";
import "./service-showcase-tune.css";
import "./login-modal.css";
import "./client-home.css";
import "./home-client-final.css";
import "./home-ux-compact.css";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--v3-body",
  display: "swap",
});

const displayFont =
  Inter_Tight({
    subsets: ["latin"],
    variable: "--v3-display",
    display: "swap",
  });

export const metadata: Metadata = {
  title:
    "LAWXYGEN | Legal, Tax & Business Services",

  description:
    "Business registration, tax, compliance, intellectual property, documentation and professional consultation services.",

  icons: {
    icon: "/lawxygen-favicon.png",
    shortcut: "/lawxygen-favicon.png",
    apple: "/lawxygen-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable}`}
    >
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}