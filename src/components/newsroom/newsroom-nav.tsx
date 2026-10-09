"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LocalizedText, useSitePreferences } from "@/components/layout/site-preferences";
import { NewsroomText } from "@/components/newsroom/newsroom-text";

const groups = [
  {
    ne: "कार्यक्षेत्र",
    en: "Workspace",
    links: [{ ne: "ड्यासबोर्ड", en: "Dashboard", href: "/newsroom", mark: "D" }],
  },
  {
    ne: "सम्पादकीय",
    en: "Editorial",
    links: [
      { ne: "समाचार सूची", en: "Stories", href: "/newsroom/stories", mark: "S" },
      { ne: "नयाँ समाचार", en: "New story", href: "/newsroom/stories/new", mark: "+" },
      { ne: "समीक्षा सूची", en: "Review queue", href: "/newsroom/review", mark: "R" },
      { ne: "सुधार र अद्यावधिक", en: "Corrections", href: "/newsroom/corrections", mark: "C" },
      { ne: "गृहपृष्ठ संयोजन", en: "Homepage curation", href: "/newsroom/homepage", mark: "H" },
    ],
  },
  {
    ne: "सामग्री पुस्तकालय",
    en: "Content library",
    links: [
      { ne: "जानकारी केन्द्र", en: "Information hub", href: "/newsroom/hub", mark: "I" },
      { ne: "मिडिया पुस्तकालय", en: "Media library", href: "/newsroom/media", mark: "M" },
      { ne: "खण्ड र विषय", en: "Sections & topics", href: "/newsroom/categories", mark: "T" },
    ],
  },
  {
    ne: "प्रशासन",
    en: "Administration",
    links: [
      { ne: "कर्मचारी र भूमिका", en: "Staff & roles", href: "/newsroom/staff", mark: "U" },
      { ne: "गतिविधि अभिलेख", en: "Activity log", href: "/newsroom/audit", mark: "A" },
      { ne: "सेटिङ", en: "Settings", href: "/newsroom/settings", mark: "⚙" },
    ],
  },
];

function activeFor(pathname: string, href: string) {
  if (href === "/newsroom") return pathname === href;
  if (href === "/newsroom/stories") {
    return (
      pathname === href || (pathname.startsWith(`${href}/`) && pathname !== "/newsroom/stories/new")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NewsroomNav({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const pathname = usePathname();
  const { language } = useSitePreferences();
  return (
    <aside
      aria-label={language === "en" ? "Newsroom workspace" : "समाचार कक्ष कार्यक्षेत्र"}
      className={`fixed inset-y-0 left-0 z-40 flex w-[18rem] flex-col border-r border-[var(--rule)] bg-[var(--paper-raised)] shadow-xl transition-transform duration-200 lg:translate-x-0 lg:visible lg:shadow-none ${open ? "visible translate-x-0" : "invisible -translate-x-full"}`}
      id="newsroom-navigation"
    >
      <div className="flex min-h-[5.5rem] items-center justify-between border-b border-[var(--rule)] px-5">
        <Link
          className="flex items-center gap-3 text-inherit no-underline"
          href="/newsroom"
          onClick={onNavigate}
        >
          <span
            aria-hidden="true"
            className="relative flex size-11 shrink-0 items-center justify-center border border-[var(--rule)] bg-[var(--paper)] p-1"
          >
            <Image
              alt=""
              className="object-contain"
              height={48}
              priority
              src="/logo.jpg"
              width={48}
            />
          </span>
          <span>
            <span className="block font-serif text-lg font-black leading-tight">नेप दर्पण</span>
            <span className="eyebrow mt-1 block text-[var(--ink-soft)]">
              <NewsroomText ne="समाचार कक्ष" en="Newsroom" />
            </span>
          </span>
        </Link>
        <button
          aria-label={language === "en" ? "Close navigation" : "नेभिगेसन बन्द गर्नुहोस्"}
          className="inline-flex size-9 items-center justify-center rounded border border-[var(--rule)] text-lg lg:hidden"
          onClick={onNavigate}
          type="button"
        >
          ×
        </button>
      </div>
      <nav
        aria-label={language === "en" ? "Newsroom navigation" : "समाचार कक्ष नेभिगेसन"}
        className="min-h-0 flex-1 overflow-y-auto px-3 py-5"
      >
        {groups.map((group) => (
          <section className="mb-6" key={group.en}>
            <h2 className="eyebrow px-3 pb-2 text-[var(--ink-soft)]">
              <NewsroomText ne={group.ne} en={group.en} />
            </h2>
            <ul className="grid gap-1">
              {group.links.map((link) => {
                const active = activeFor(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-bold no-underline transition-colors ${active ? "newsroom-contrast-link bg-[var(--ink)]" : "text-[var(--ink-soft)] hover:bg-[var(--paper-muted)] hover:text-[var(--ink)]"}`}
                      href={link.href}
                      onClick={onNavigate}
                    >
                      <span
                        aria-hidden="true"
                        className={`flex size-7 shrink-0 items-center justify-center rounded border text-xs ${active ? "border-white/30 bg-white/10" : "border-[var(--rule)] bg-[var(--paper)]"}`}
                      >
                        {link.mark}
                      </span>
                      <LocalizedText ne={link.ne} en={link.en} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>
      <div className="border-t border-[var(--rule)] bg-[var(--paper-muted)] p-4">
        <p className="text-xs font-extrabold">
          <NewsroomText ne="फ्रन्टएन्ड नमुना" en="Frontend prototype" />
        </p>
        <p className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">
          <NewsroomText
            ne="यो कार्यक्षेत्रमा वास्तविक लगइन वा प्रकाशन हुँदैन।"
            en="No real sign-in or publishing is connected."
          />
        </p>
      </div>
    </aside>
  );
}
