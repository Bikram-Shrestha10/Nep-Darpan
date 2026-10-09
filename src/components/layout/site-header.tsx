"use client";

import Link from "next/link";
import Image from "next/image";
import { BellIcon, MenuIcon, SearchIcon } from "@/components/layout/icons";
import { LocalizedText, useSitePreferences } from "@/components/layout/site-preferences";
import { SiteUtilityBar } from "@/components/layout/site-utility-bar";

export const primaryNavigation = [
  { href: "/", ne: "गृहपृष्ठ", en: "Home" },
  { href: "/latest", ne: "ताजा", en: "Latest" },
  { href: "/category/politics", ne: "राजनीति", en: "Politics" },
  { href: "/category/economy", ne: "अर्थतन्त्र", en: "Economy" },
  { href: "/category/society", ne: "समाज", en: "Society" },
  { href: "/category/world", ne: "विश्व", en: "World" },
  { href: "/category/technology", ne: "प्रविधि", en: "Technology" },
  { href: "/category/opinion", ne: "विचार", en: "Opinion" },
  { href: "/information-hub", ne: "जानकारी केन्द्र", en: "Information hub" },
] as const;

export function SiteHeader() {
  const { language } = useSitePreferences();
  return (
    <header className="site-header">
      <SiteUtilityBar />
      <div className="page-shell site-header__main">
        <details className="site-header__menu">
          <summary className="flex size-10 cursor-pointer list-none items-center justify-center border border-[var(--rule)] bg-[var(--paper-raised)] [&::-webkit-details-marker]:hidden">
            <MenuIcon />
            <span className="sr-only">
              <LocalizedText ne="मुख्य मेनु खोल्नुहोस्" en="Open main menu" />
            </span>
          </summary>
          <nav
            aria-label={
              language === "en" ? "Responsive primary navigation" : "सानो पर्दाको मुख्य नेभिगेसन"
            }
            className="absolute top-[calc(100%+0.5rem)] left-0 z-30 w-[min(19rem,calc(100vw-2rem))] border border-[var(--ink)] bg-[var(--paper-raised)] p-2 shadow-lg"
          >
            <ul className="divide-y divide-[var(--rule)]">
              {primaryNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    className="block px-3 py-3 font-semibold hover:bg-[var(--paper-muted)]"
                    href={item.href}
                  >
                    <LocalizedText ne={item.ne} en={item.en} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
        <Link
          className="site-brand no-underline"
          href="/"
          aria-label={language === "en" ? "Nep Darpan home" : "नेप दर्पण गृहपृष्ठ"}
        >
          <span aria-hidden="true" className="site-brand__logo-slot">
            <Image
              alt=""
              className="site-brand__logo"
              height={1254}
              sizes="10rem"
              src="/logo.jpg"
              width={1254}
            />
          </span>
          <span className="site-brand__copy">
            <span className="editorial-heading site-brand__nepali">
              {language === "en" ? "NEP DARPAN" : "नेप दर्पण"}
            </span>
            <span className="site-brand__english">
              NEP DARPAN · <LocalizedText ne="समाचार र सन्दर्भ" en="News and information" />
            </span>
          </span>
        </Link>
        <div className="site-header__actions">
          <Link
            className="flex size-10 items-center justify-center border border-[var(--rule)] bg-[var(--paper-raised)] hover:bg-[var(--paper-muted)]"
            href="/search"
            aria-label={language === "en" ? "Search news" : "समाचार खोज्नुहोस्"}
          >
            <SearchIcon />
          </Link>
          <details className="site-header__notification">
            <summary
              aria-label={language === "en" ? "Open notifications" : "सूचनाहरू खोल्नुहोस्"}
              className="site-header__notification-trigger"
            >
              <BellIcon />
              <span className="sr-only">
                <LocalizedText ne="सूचनाहरू खोल्नुहोस्" en="Open notifications" />
              </span>
            </summary>
            <section
              aria-labelledby="site-notification-heading"
              className="site-header__notification-panel"
            >
              <h2 id="site-notification-heading">
                <LocalizedText ne="सूचनाहरू" en="Notifications" />
              </h2>
              <p>
                <LocalizedText
                  ne="यो पूर्वावलोकनमा सूचना सुविधा उपलब्ध छैन।"
                  en="Notifications are not available in this preview yet."
                />
              </p>
              <p>
                <LocalizedText
                  ne="सूचनाहरू उपलब्ध भएपछि यहाँ देखिनेछन्।"
                  en="Updates will appear here when notifications are enabled."
                />
              </p>
            </section>
          </details>
        </div>
      </div>
      <nav
        aria-label={language === "en" ? "Primary navigation" : "मुख्य नेभिगेसन"}
        className="site-primary-nav hidden md:block"
      >
        <ul className="page-shell flex min-h-11 items-center gap-x-7 overflow-x-auto text-sm font-bold whitespace-nowrap">
          {primaryNavigation.map((item) => (
            <li key={item.href}>
              <Link className="py-3 no-underline hover:underline" href={item.href}>
                <LocalizedText ne={item.ne} en={item.en} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
