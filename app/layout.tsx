import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mathly — clean step-by-step math.",
  description:
    "Dark-mode math helper. drop a photo or type a problem, get clean step-by-step solutions fast.",
  keywords: ["math solver", "AI math", "step by step math", "equation solver"],
  openGraph: {
    title: "Mathly — clean step-by-step math.",
    description:
      "Dark-mode math helper. drop a photo or type a problem, get clean step-by-step solutions fast.",
    type: "website",
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
      className={`${syne.variable} ${dmSans.variable}`}
      style={{ colorScheme: "dark" }}
    >
      <head>
        <meta name="theme-color" content="#09090b" />
      </head>
      <body
        className="min-h-dvh"
        style={{
          fontFamily: "var(--font-body), system-ui, sans-serif",
        }}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
