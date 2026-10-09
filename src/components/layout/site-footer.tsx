"use client";

import Link from "next/link";
import Image from "next/image";
import { LocalizedText, useSitePreferences } from "@/components/layout/site-preferences";
const footerGroups = [
  {
    title: "समाचार",
    titleEn: "News",
    links: [
      ["ताजा समाचार", "Latest", "/latest"],
      ["राजनीति", "Politics", "/category/politics"],
      ["अर्थतन्त्र", "Economy", "/category/economy"],
      ["विश्व", "World", "/category/world"],
    ],
  },
  {
    title: "जानकारी",
    titleEn: "Information",
    links: [
      ["जानकारी केन्द्र", "Information hub", "/information-hub"],
      ["व्याख्या", "Explainers", "/information-hub?type=explainer"],
      ["तथ्य जाँच", "Fact checks", "/information-hub?type=fact-check"],
      ["सुधार", "Corrections", "/corrections"],
    ],
  },
  {
    title: "नेप दर्पण",
    titleEn: "Nep Darpan",
    links: [
      ["हाम्रो बारेमा", "About", "/about"],
      ["सम्पादकीय मापदण्ड", "Editorial standards", "/editorial-standards"],
      ["सम्पर्क", "Contact", "/contact"],
      ["गोपनीयता", "Privacy", "/privacy"],
      ["सेवाका सर्त", "Terms", "/terms"],
    ],
  },
] as const;
export function SiteFooter() {
  const { language } = useSitePreferences();
  return (
    <footer className="mt-16 border-t-4 border-[var(--ink)] bg-[var(--paper-muted)]">
      <div className="page-shell grid gap-10 py-10 md:grid-cols-[1.4fr_2fr]">
        <div>
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
              <span className="site-brand__english">NEP DARPAN</span>
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--ink-soft)]">
            <LocalizedText
              ne="समाचार, सन्दर्भ र उपयोगी जानकारीका लागि नेपाली भाषाको उत्तरदायी वेब प्रकाशन।"
              en="A Nepali-language publication for news, context, and useful information."
            />
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <section key={group.title} aria-labelledby={`footer-${group.title}`}>
              <h2
                id={`footer-${group.title}`}
                className="eyebrow border-b border-[var(--rule-strong)] pb-2"
              >
                <LocalizedText ne={group.title} en={group.titleEn} />
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {group.links.map(([label, labelEn, href]) => (
                  <li key={href}>
                    <Link className="hover:underline" href={href}>
                      <LocalizedText ne={label} en={labelEn} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
      <div className="border-t border-[var(--rule)]">
        <div className="page-shell flex flex-col gap-2 py-5 text-xs text-[var(--ink-soft)] sm:flex-row sm:justify-between">
          <p>
            <LocalizedText
              ne="नेप दर्पण · नेपाली समाचार र सन्दर्भ"
              en="Nep Darpan · Nepali news and information"
            />
          </p>
          <p>
            <LocalizedText
              ne="फोन, ट्याब्लेट र डेस्कटपका लागि वेब संस्करण"
              en="Web edition for phones, tablets, and desktop"
            />
          </p>
        </div>
      </div>
    </footer>
  );
}
