import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
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
      <body className="antialiased">
        <a className="skip-link" href="#main-content">
          मुख्य सामग्रीमा जानुहोस्
        </a>
        <SiteHeader />
        {children}
        <div id="site-footer">
          <SiteFooter />
        </div>
        <MobileNavigation />
      </body>
    </html>
  );
}
