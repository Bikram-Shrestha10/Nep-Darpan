"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, MoonIcon, SunIcon } from "@/components/layout/icons";
import { LocalizedDate, useSitePreferences } from "@/components/layout/site-preferences";

export function SiteUtilityBar() {
  const { language, theme, toggleLanguage, toggleTheme } = useSitePreferences();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateDate = () => setNow(new Date());
    updateDate();
    const interval = window.setInterval(updateDate, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="site-utility-bar">
      <div className="page-shell site-utility-bar__inner">
        <div className="site-utility-bar__details">
          <p className="site-utility-bar__date">
            <CalendarIcon />
            <time dateTime={now?.toISOString()}>
              {now ? <LocalizedDate value={now} dateStyle="full" /> : " "}
            </time>
          </p>
          <span className="site-utility-bar__separator" aria-hidden="true">
            ·
          </span>
          <p className="site-utility-bar__location">
            <SunIcon />
            {language === "en" ? "Kathmandu" : "काठमाडौँ"}
          </p>
        </div>
        <div className="site-utility-bar__actions">
          <button
            className="site-utility-bar__language"
            type="button"
            onClick={toggleLanguage}
            aria-label={language === "ne-NP" ? "अंग्रेजीमा बदल्नुहोस्" : "Switch to Nepali"}
            aria-pressed={language === "en"}
            title={language === "ne-NP" ? "अंग्रेजीमा बदल्नुहोस्" : "Switch to Nepali"}
          >
            {language === "ne-NP" ? "नेपाली" : "English"}
          </button>
          <button
            className="site-utility-bar__theme"
            type="button"
            onClick={toggleTheme}
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
            title={
              language === "en"
                ? theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
                : theme === "light"
                  ? "गाढा मोडमा बदल्नुहोस्"
                  : "उज्यालो मोडमा बदल्नुहोस्"
            }
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}
