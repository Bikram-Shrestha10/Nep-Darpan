"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSitePreferences } from "@/components/layout/site-preferences";
import { NewsroomText } from "@/components/newsroom/newsroom-text";
import { NewsroomNav } from "@/components/newsroom/newsroom-nav";

const titles: Record<string, { ne: string; en: string }> = {
  "/newsroom": { ne: "ड्यासबोर्ड", en: "Dashboard" },
  "/newsroom/stories": { ne: "समाचार सूची", en: "Stories" },
  "/newsroom/stories/new": { ne: "नयाँ समाचार", en: "New story" },
  "/newsroom/review": { ne: "सम्पादकीय समीक्षा", en: "Editorial review" },
  "/newsroom/corrections": { ne: "सुधार र अद्यावधिक", en: "Corrections & updates" },
  "/newsroom/homepage": { ne: "गृहपृष्ठ संयोजन", en: "Homepage curation" },
  "/newsroom/hub": { ne: "जानकारी केन्द्र", en: "Information hub" },
  "/newsroom/media": { ne: "मिडिया पुस्तकालय", en: "Media library" },
  "/newsroom/categories": { ne: "खण्ड र विषय", en: "Sections & topics" },
  "/newsroom/staff": { ne: "कर्मचारी र भूमिका", en: "Staff & roles" },
  "/newsroom/audit": { ne: "गतिविधि अभिलेख", en: "Activity log" },
  "/newsroom/settings": { ne: "समाचार कक्ष सेटिङ", en: "Newsroom settings" },
  "/newsroom/sign-in": { ne: "नमुना साइन इन", en: "Sign-in preview" },
};

function currentTitle(pathname: string) {
  if (titles[pathname]) return titles[pathname];
  if (pathname.endsWith("/edit")) return { ne: "समाचार सम्पादन", en: "Edit story" };
  if (pathname.includes("/preview/")) return { ne: "पूर्वावलोकन", en: "Preview" };
  if (pathname.startsWith("/newsroom/stories/")) return { ne: "समाचार विवरण", en: "Story details" };
  if (pathname === "/newsroom/denied") return { ne: "अनुमति अवस्था", en: "Access preview" };
  return { ne: "समाचार कक्ष", en: "Newsroom" };
}

export function NewsroomWorkspace({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const wasMenuOpen = useRef(false);
  const { language, theme, toggleLanguage, toggleTheme } = useSitePreferences();
  const title = currentTitle(pathname);

  useEffect(() => {
    if (!menuOpen) {
      if (wasMenuOpen.current) menuTrigger.current?.focus();
      wasMenuOpen.current = false;
      return;
    }
    wasMenuOpen.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = document.getElementById("newsroom-navigation");
    const focusable = () =>
      panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [];
    focusable()[0]?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = Array.from(focusable());
      if (!items.length) return;
      if (event.shiftKey && document.activeElement === items[0]) {
        event.preventDefault();
        items.at(-1)?.focus();
      } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
        event.preventDefault();
        items[0]?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <div className="newsroom-workspace min-h-screen bg-[var(--paper)]">
      <NewsroomNav open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      {menuOpen ? (
        <button
          aria-label={language === "en" ? "Close newsroom navigation" : "समाचार कक्ष मेनु बन्द गर्नुहोस्"}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMenuOpen(false)}
          type="button"
        />
      ) : null}
      <div className="min-h-screen lg:pl-[18rem]">
        <header className="sticky top-0 z-20 border-b border-[var(--rule)] bg-[var(--paper-raised)]/95 backdrop-blur">
          <div className="flex min-h-[4.5rem] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                aria-controls="newsroom-navigation"
                aria-expanded={menuOpen}
                aria-label={
                  language === "en"
                    ? menuOpen
                      ? "Close newsroom navigation"
                      : "Open newsroom navigation"
                    : menuOpen
                      ? "समाचार कक्ष मेनु बन्द गर्नुहोस्"
                      : "समाचार कक्ष नेभिगेसन खोल्नुहोस्"
                }
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-[var(--rule)] bg-[var(--paper)] text-xl font-bold lg:hidden"
                onClick={() => setMenuOpen((open) => !open)}
                ref={menuTrigger}
                type="button"
              >
                {menuOpen ? "×" : "☰"}
              </button>
              <div className="min-w-0">
                <p className="eyebrow hidden text-[var(--ink-soft)] sm:block">
                  <NewsroomText ne="सम्पादकीय कार्यक्षेत्र" en="Editorial workspace" />
                </p>
                <h1 className="truncate text-lg font-extrabold sm:text-xl">
                  <NewsroomText {...title} />
                </h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <span className="hidden rounded-full border border-[var(--rule)] bg-[var(--paper-muted)] px-3 py-1.5 text-xs font-bold sm:inline-flex">
                <NewsroomText ne="डेमो सम्पादक" en="Demo editor" />
              </span>
              <button
                aria-label={language === "en" ? "Switch to Nepali" : "अंग्रेजीमा बदल्नुहोस्"}
                className="min-h-10 rounded-md border border-[var(--rule)] px-3 text-sm font-bold"
                onClick={toggleLanguage}
                type="button"
              >
                {language === "en" ? "English" : "नेपाली"}
              </button>
              <button
                aria-label={
                  language === "en"
                    ? theme === "light"
                      ? "Switch to dark mode"
                      : "Switch to light mode"
                    : theme === "light"
                      ? "गाढा मोडमा बदल्नुहोस्"
                      : "उज्यालो मोडमा बदल्नुहोस्"
                }
                aria-pressed={theme === "dark"}
                className="hidden size-10 items-center justify-center rounded-md border border-[var(--rule)] text-lg sm:inline-flex"
                onClick={toggleTheme}
                type="button"
              >
                {theme === "light" ? "◐" : "☼"}
              </button>
              <Link
                className="newsroom-contrast-link hidden min-h-10 items-center rounded-md bg-[var(--ink)] px-3 text-sm font-bold no-underline md:inline-flex"
                href="/"
              >
                <NewsroomText ne="साइट हेर्नुहोस्" en="View site" />
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--rule)] bg-[var(--paper-muted)] px-4 py-2 text-xs sm:px-6 lg:px-8">
            <p className="font-bold">
              <NewsroomText ne="अस्थायी नमुना कार्यक्षेत्र" en="Temporary demo workspace" />
            </p>
            <Link className="font-bold underline underline-offset-2" href="/newsroom/sign-in">
              <NewsroomText ne="साइन इन पूर्वावलोकन" en="Sign-in preview" />
            </Link>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
