import Link from "next/link";
const footerGroups = [
  {
    title: "समाचार",
    links: [
      ["ताजा समाचार", "/latest"],
      ["राजनीति", "/category/politics"],
      ["अर्थतन्त्र", "/category/economy"],
      ["विश्व", "/category/world"],
    ],
  },
  {
    title: "जानकारी",
    links: [
      ["जानकारी केन्द्र", "/information-hub"],
      ["व्याख्या", "/information-hub?type=explainer"],
      ["तथ्य जाँच", "/information-hub?type=fact-check"],
      ["सुधार", "/corrections"],
    ],
  },
  {
    title: "नेप दर्पण",
    links: [
      ["हाम्रो बारेमा", "/about"],
      ["सम्पादकीय मापदण्ड", "/editorial-standards"],
      ["सम्पर्क", "/contact"],
      ["गोपनीयता", "/privacy"],
    ],
  },
] as const;
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t-4 border-[var(--ink)] bg-[var(--paper-muted)]">
      <div className="page-shell grid gap-10 py-10 md:grid-cols-[1.4fr_2fr]">
        <div>
          <Link className="editorial-heading text-3xl font-black no-underline" href="/">
            नेप दर्पण
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--ink-soft)]">
            समाचार, सन्दर्भ र उपयोगी जानकारीका लागि नेपाली भाषाको उत्तरदायी वेब प्रकाशन।
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <section key={group.title} aria-labelledby={`footer-${group.title}`}>
              <h2
                id={`footer-${group.title}`}
                className="eyebrow border-b border-[var(--rule-strong)] pb-2"
              >
                {group.title}
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {group.links.map(([label, href]) => (
                  <li key={href}>
                    <Link className="hover:underline" href={href}>
                      {label}
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
          <p>नेप दर्पण · नेपाली समाचार र सन्दर्भ</p>
          <p>फोन, ट्याब्लेट र डेस्कटपका लागि वेब संस्करण</p>
        </div>
      </div>
    </footer>
  );
}
