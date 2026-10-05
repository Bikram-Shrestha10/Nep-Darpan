import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nep Darpan",
    template: "%s | Nep Darpan",
  },
  description: "Nepali-first news and information for readers in Nepal and the diaspora.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ne-NP">
      <body className="min-h-screen bg-stone-50 text-stone-950 antialiased">{children}</body>
    </html>
  );
}
