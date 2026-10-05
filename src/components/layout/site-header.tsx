import Link from "next/link";
import { MenuIcon, SearchIcon } from "@/components/layout/icons";

export const primaryNavigation = [
  { href: "/", label: "गृहपृष्ठ" },
  { href: "/latest", label: "ताजा" },
  { href: "/category/politics", label: "राजनीति" },
  { href: "/category/economy", label: "अर्थतन्त्र" },
  { href: "/category/society", label: "समाज" },
  { href: "/category/world", label: "विश्व" },
  { href: "/category/technology", label: "प्रविधि" },
  { href: "/opinion", label: "विचार" },
  { href: "/information-hub", label: "जानकारी केन्द्र" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--rule-strong)] bg-[var(--paper)]">
      <div className="page-shell flex min-h-9 items-center justify-between border-b border-[var(--rule)] py-1 text-[0.72rem] text-[var(--ink-soft)]">
        <p>नेपालको समाचार र जानकारी</p>
        <p className="hidden sm:block">नेपाली संस्करण</p>
      </div>
      <div className="page-shell grid min-h-24 grid-cols-[2.75rem_1fr_2.75rem] items-center gap-3 py-3 md:min-h-32 md:grid-cols-[1fr_auto_1fr]">
        <details className="relative md:hidden">
          <summary className="flex size-11 cursor-pointer list-none items-center justify-center border border-[var(--rule)] [&::-webkit-details-marker]:hidden">
            <MenuIcon />
            <span className="sr-only">मुख्य मेनु खोल्नुहोस्</span>
          </summary>
          <nav
            aria-label="सानो पर्दाको मुख्य नेभिगेसन"
            className="absolute top-[calc(100%+0.5rem)] left-0 z-30 w-[min(19rem,calc(100vw-2rem))] border-2 border-[var(--ink)] bg-[var(--paper-raised)] p-2"
          >
            <ul className="divide-y divide-[var(--rule)]">
              {primaryNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    className="block px-3 py-3 font-semibold hover:bg-[var(--paper-muted)]"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
        <p className="hidden text-xs font-bold tracking-[0.12em] md:block">स्थापना २०८३</p>
        <Link
          className="justify-self-center text-center no-underline"
          href="/"
          aria-label="नेप दर्पण गृहपृष्ठ"
        >
          <span className="editorial-heading block text-[clamp(2rem,5vw,4rem)] font-black leading-none tracking-[-0.045em]">
            नेप दर्पण
          </span>
          <span className="mt-1 block text-[0.58rem] font-bold tracking-[0.24em] text-[var(--ink-soft)] uppercase">
            Nep Darpan
          </span>
        </Link>
        <div className="justify-self-end">
          <Link
            className="flex size-11 items-center justify-center border border-[var(--rule)] hover:bg-[var(--paper-muted)]"
            href="/search"
            aria-label="समाचार खोज्नुहोस्"
          >
            <SearchIcon />
          </Link>
        </div>
      </div>
      <nav aria-label="मुख्य नेभिगेसन" className="rule-double hidden md:block">
        <ul className="page-shell flex min-h-12 items-center justify-center gap-x-6 overflow-x-auto text-sm font-bold whitespace-nowrap">
          {primaryNavigation.map((item) => (
            <li key={item.href}>
              <Link className="py-3 no-underline hover:underline" href={item.href}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
