"use client";

import Link from "next/link";
import { HomeIcon, HubIcon, LatestIcon, MenuIcon, SearchIcon } from "@/components/layout/icons";
import { LocalizedText, useSitePreferences } from "@/components/layout/site-preferences";
const items = [
  { href: "/", ne: "गृह", en: "Home", icon: HomeIcon },
  { href: "/latest", ne: "ताजा", en: "Latest", icon: LatestIcon },
  { href: "/information-hub", ne: "जानकारी", en: "Info", icon: HubIcon },
  { href: "/search", ne: "खोज", en: "Search", icon: SearchIcon },
  { href: "#site-footer", ne: "थप", en: "More", icon: MenuIcon },
] as const;
export function MobileNavigation() {
  const { language } = useSitePreferences();
  return (
    <nav
      aria-label={language === "en" ? "Quick navigation" : "सानो पर्दाको छिटो नेभिगेसन"}
      className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-[var(--ink)] bg-[var(--paper-raised)] md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map(({ href, ne, en, icon: Icon }) => (
          <li key={href}>
            <Link
              className="flex min-h-[4.1rem] flex-col items-center justify-center gap-1 text-[0.68rem] font-bold no-underline hover:bg-[var(--paper-muted)]"
              href={href}
            >
              <Icon />
              <span>
                <LocalizedText ne={ne} en={en} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
