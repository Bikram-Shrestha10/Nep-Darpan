import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ContentState } from "@/components/ui/content-state";
import { MOCK_DATA_NOTICE, mockContentGateway } from "@/lib/content/mock-gateway";

export default async function Home() {
  const home = await mockContentGateway.getHome("ne-NP");

  return (
    <main id="main-content" tabIndex={-1}>
      <div className="border-b border-[var(--rule)] bg-[var(--ink)] text-white">
        <div className="page-shell flex min-h-11 items-center gap-3 py-2 text-sm">
          <strong className="bg-[var(--urgent)] px-2 py-1 text-xs whitespace-nowrap">
            पूर्वावलोकन
          </strong>
          <p>{MOCK_DATA_NOTICE}</p>
        </div>
      </div>
      <div className="page-shell py-8 sm:py-12">
        <Breadcrumbs items={[{ label: "गृहपृष्ठ" }]} />
        <section className="mt-8 grid gap-8 border-y-2 border-[var(--ink)] py-8 lg:grid-cols-[minmax(0,2fr)_minmax(17rem,1fr)] lg:gap-10">
          <div>
            <p className="eyebrow text-[var(--urgent-dark)]">डिजाइन प्रणाली · कार्य १.२</p>
            <h1 className="editorial-heading mt-3 max-w-4xl text-[clamp(2.35rem,6vw,5.2rem)] font-black leading-[1.08] tracking-[-0.035em]">
              नेपाली समाचारका लागि स्पष्ट, आधुनिक र विश्वसनीय अनुभव
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">
              यो साझा साइट संरचनाले फोन, ट्याब्लेट र डेस्कटपमा पढ्न, खोज्न र मुख्य खण्डमा पुग्न सजिलो बनाउँछ।
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="button-primary" href="/latest">
                ताजा समाचार हेर्नुहोस्
              </Link>
              <Link className="button-secondary" href="/information-hub">
                जानकारी केन्द्र
              </Link>
            </div>
          </div>
          <aside
            className="border-t border-[var(--rule)] pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
            aria-labelledby="system-title"
          >
            <h2 id="system-title" className="eyebrow">
              साझा प्रणाली
            </h2>
            <ul className="mt-4 divide-y divide-[var(--rule)] text-sm leading-6">
              <li className="py-3">देवनागरीका लागि पढ्न मिल्ने अक्षर र लय</li>
              <li className="py-3">किबोर्ड र स्पष्ट फोकस संकेत</li>
              <li className="py-3">फोनदेखि ठूलो स्क्रिनसम्म उत्तरदायी ग्रिड</li>
              <li className="py-3">लोडिङ, खाली र त्रुटि अवस्थाका साझा ढाँचा</li>
            </ul>
          </aside>
        </section>
        <section className="mt-10 grid gap-8 md:grid-cols-2" aria-labelledby="fixture-title">
          <article className="border-t-4 border-[var(--ink)] bg-[var(--paper-raised)] p-6">
            <p className="eyebrow text-[var(--urgent-dark)]">काल्पनिक समाचार नमुना</p>
            <h2
              id="fixture-title"
              className="editorial-heading mt-3 text-3xl font-bold leading-tight"
            >
              {home.lead?.headline}
            </h2>
            <p className="mt-3 leading-7 text-[var(--ink-soft)]">{home.lead?.summary}</p>
            <p className="mt-5 border-t border-[var(--rule)] pt-4 text-xs text-[var(--ink-soft)]">
              सक्रिय भाषा: नेपाली · वास्तविक समाचार होइन
            </p>
          </article>
          <div className="space-y-4">
            <ContentState kind="loading" />
            <ContentState
              kind="empty"
              title="अर्को खण्डका लागि तयार"
              description="कार्य १.३ मा समाचार र मिडिया कम्पोनेन्ट यहाँ जोडिनेछन्।"
            />
          </div>
        </section>
        <section
          className="mt-12 border-t border-[var(--rule-strong)] pt-7"
          aria-labelledby="controls-title"
        >
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h2 id="controls-title" className="editorial-heading text-2xl font-bold">
                समाचार खोजको साझा फारम
              </h2>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                खोज परिणामको कार्यक्षमता कार्य १.५ मा जोडिनेछ।
              </p>
            </div>
            <search>
              <form action="/search" className="flex w-full max-w-xl flex-col gap-2 sm:flex-row">
                <label className="sr-only" htmlFor="site-search">
                  समाचार खोज्नुहोस्
                </label>
                <input
                  className="field sm:min-w-80"
                  id="site-search"
                  name="q"
                  placeholder="शीर्षक वा विषय खोज्नुहोस्"
                  type="search"
                />
                <button className="button-primary whitespace-nowrap" type="submit">
                  खोज्नुहोस्
                </button>
              </form>
            </search>
          </div>
        </section>
      </div>
    </main>
  );
}
