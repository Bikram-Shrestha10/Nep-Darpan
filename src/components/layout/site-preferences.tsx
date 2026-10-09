"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { formatLocalizedDate } from "@/lib/i18n/dates";
import { translateToEnglish } from "@/lib/i18n/english";

export type SiteLanguage = "ne-NP" | "en";
export type SiteTheme = "light" | "dark";

type SitePreferences = {
  language: SiteLanguage;
  theme: SiteTheme;
  toggleLanguage: () => void;
  toggleTheme: () => void;
};

const LANGUAGE_KEY = "nep-darpan:language";
const THEME_KEY = "nep-darpan:theme";

function translateDocumentTitle(title: string): string {
  const siteSuffix = " | Nep Darpan";
  const hasSiteSuffix = title.endsWith(siteSuffix);
  let pageTitle = hasSiteSuffix ? title.slice(0, -siteSuffix.length) : title;

  const newsroomSuffix = " · समाचार कक्ष";
  if (pageTitle.endsWith(newsroomSuffix)) {
    pageTitle = `${translateToEnglish(pageTitle.slice(0, -newsroomSuffix.length))} · Newsroom`;
  } else if (pageTitle.startsWith("सम्पादन: ")) {
    pageTitle = `Edit: ${translateToEnglish(pageTitle.slice("सम्पादन: ".length))}`;
  } else if (pageTitle.startsWith("पूर्वावलोकन: ")) {
    pageTitle = `Preview: ${translateToEnglish(pageTitle.slice("पूर्वावलोकन: ".length))}`;
  } else {
    pageTitle = translateToEnglish(pageTitle);
  }
  return hasSiteSuffix ? `${pageTitle}${siteSuffix}` : pageTitle;
}

const SitePreferencesContext = createContext<SitePreferences>({
  language: "ne-NP",
  theme: "light",
  toggleLanguage: () => undefined,
  toggleTheme: () => undefined,
});

export function SitePreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<SiteLanguage>("ne-NP");
  const [theme, setTheme] = useState<SiteTheme>("light");
  const [ready, setReady] = useState(false);
  const sourceTitle = useRef<string | null>(null);
  const renderedTitle = useRef<string | null>(null);

  useEffect(() => {
    try {
      const savedLanguage = window.localStorage.getItem(LANGUAGE_KEY);
      const savedTheme = window.localStorage.getItem(THEME_KEY);
      if (savedLanguage === "en" || savedLanguage === "ne-NP") setLanguage(savedLanguage);
      if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
    } catch {
      // Preferences still work for the current page when storage is unavailable.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = language;
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(LANGUAGE_KEY, language);
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Keep the selected preferences in React state when storage is unavailable.
    }
  }, [language, ready, theme]);

  useEffect(() => {
    if (!ready) return;
    const headElement = document.head;
    if (!headElement) return;
    const localizeTitle = () => {
      const currentTitle = document.title;
      if (currentTitle !== renderedTitle.current) sourceTitle.current = currentTitle;
      const source = sourceTitle.current ?? currentTitle;
      const target = language === "en" ? translateDocumentTitle(source) : source;
      renderedTitle.current = target;
      if (currentTitle !== target) document.title = target;
    };
    const observer = new MutationObserver(localizeTitle);
    // Next.js can replace the <title> node during client-side navigation. Watch
    // <head> so the user's saved language stays reflected in the browser tab.
    observer.observe(headElement, { childList: true, characterData: true, subtree: true });
    localizeTitle();
    return () => observer.disconnect();
  }, [language, ready]);

  const value = useMemo<SitePreferences>(
    () => ({
      language,
      theme,
      toggleLanguage: () => setLanguage((current) => (current === "ne-NP" ? "en" : "ne-NP")),
      toggleTheme: () => setTheme((current) => (current === "light" ? "dark" : "light")),
    }),
    [language, theme],
  );

  return (
    <SitePreferencesContext.Provider value={value}>{children}</SitePreferencesContext.Provider>
  );
}

export function useSitePreferences() {
  return useContext(SitePreferencesContext);
}

export function LocalizedText({ ne, en }: { ne: string; en?: string }) {
  const { language } = useSitePreferences();
  return language === "en" ? (en ?? translateToEnglish(ne)) : ne;
}

export function LocalizedDate({
  value,
  dateStyle = "medium",
  timeStyle,
  timeZone = "Asia/Kathmandu",
}: {
  value: string | Date;
  dateStyle?: Intl.DateTimeFormatOptions["dateStyle"];
  timeStyle?: Intl.DateTimeFormatOptions["timeStyle"];
  timeZone?: string;
}) {
  const { language } = useSitePreferences();
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return formatLocalizedDate(date, language, { dateStyle, timeStyle, timeZone });
}

export function LocalizedNumber({ value }: { value: number }) {
  const { language } = useSitePreferences();
  const westernNumber = new Intl.NumberFormat("en-US").format(value);
  if (language === "en") return westernNumber;
  const nepaliDigits = "०१२३४५६७८९";
  return westernNumber.replace(/\d/gu, (digit) => nepaliDigits[Number(digit)] ?? digit);
}
