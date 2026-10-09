import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SitePreferencesProvider } from "@/components/layout/site-preferences";
import { LocalizedText } from "@/components/layout/site-preferences";
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
    <html lang="ne-NP" translate="no" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="antialiased">
        <SitePreferencesProvider>
          <a className="skip-link" href="#main-content">
            <LocalizedText ne="मुख्य सामग्रीमा जानुहोस्" />
          </a>
          <div className="reader-site-chrome">
            <SiteHeader />
          </div>
          {children}
          <div className="reader-site-chrome" id="site-footer">
            <SiteFooter />
          </div>
          <div className="reader-site-chrome">
            <MobileNavigation />
          </div>
        </SitePreferencesProvider>
      </body>
    </html>
  );
}
