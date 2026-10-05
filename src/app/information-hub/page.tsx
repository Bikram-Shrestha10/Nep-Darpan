import type { Metadata } from "next";
import Link from "next/link";
import { PreviewNotice } from "@/components/layout/preview-notice";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { mockContentGateway } from "@/lib/content/mock-gateway";

export const metadata: Metadata = {
  title: "जानकारी केन्द्र",
  description: "व्याख्या, मार्गदर्शिका र तथ्य-जाँचका काल्पनिक नमुना",
};
const label = (kind: string) =>
  kind === "fact_check" ? "तथ्य जाँच नमुना" : kind === "guide" ? "मार्गदर्शिका नमुना" : "व्याख्या नमुना";
export default async function InformationHubPage() {
  const data = await mockContentGateway.listHub("ne-NP");
  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <Breadcrumbs items={[{ label: "गृहपृष्ठ", href: "/" }, { label: "जानकारी केन्द्र" }]} />
        <header className="mt-8 border-b-4 border-[var(--ink)] pb-5">
          <p className="eyebrow">सन्दर्भ, व्याख्या र उपयोगी जानकारी</p>
          <h1 className="editorial-heading mt-2 text-4xl font-bold sm:text-5xl">जानकारी केन्द्र</h1>
          <p className="mt-3 max-w-3xl leading-7 text-[var(--ink-soft)]">
            समाचारको पृष्ठभूमि बुझ्न सहयोग गर्ने सामग्रीका लागि समर्पित ठाउँ। तलका सबै सामग्री पृष्ठ संरचना जाँच्न
            बनाइएका काल्पनिक नमुना हुन्।
          </p>
        </header>
        <section
          className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          aria-label="जानकारी केन्द्रका सामग्री"
        >
          {data.entries.map((entry) => (
            <article
              key={entry.id}
              className="flex flex-col border border-[var(--rule)] bg-[var(--paper-raised)] p-5"
            >
              <p className="eyebrow">{label(entry.kind)}</p>
              <h2 className="editorial-heading mt-3 text-2xl font-bold leading-snug">
                <Link href={`/information-hub/${entry.slug}`}>{entry.title}</Link>
              </h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-[var(--ink-soft)]">
                {entry.summary}
              </p>
              <p className="mt-4 text-xs text-[var(--ink-soft)]">
                नमुना समीक्षा:{" "}
                <time dateTime={entry.reviewedAt}>
                  {new Intl.DateTimeFormat("ne-NP", {
                    dateStyle: "medium",
                    timeZone: "Asia/Kathmandu",
                  }).format(new Date(entry.reviewedAt))}
                </time>
              </p>
              <Link className="mt-4 font-bold" href={`/information-hub/${entry.slug}`}>
                सामग्री पढ्नुहोस् →
              </Link>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
