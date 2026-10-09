import type { Metadata } from "next";
import Link from "next/link";
import { PreviewNotice } from "@/components/layout/preview-notice";
import { LocalizedDate, LocalizedText } from "@/components/layout/site-preferences";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ContentState } from "@/components/ui/content-state";
import { PageNavigation } from "@/components/ui/page-navigation";
import type { HubEntry } from "@/lib/content/contracts";
import { contentGateway } from "@/lib/content/gateway";

export const metadata: Metadata = {
  title: "जानकारी केन्द्र",
  description: "व्याख्या, मार्गदर्शिका र तथ्य-जाँचका काल्पनिक नमुना",
};
const label = (kind: string) =>
  kind === "fact_check" ? "तथ्य जाँच नमुना" : kind === "guide" ? "मार्गदर्शिका नमुना" : "व्याख्या नमुना";
type HubKind = HubEntry["kind"];
const typeFilters: { label: string; query: string; kind?: HubKind }[] = [
  { label: "सबै", query: "" },
  { label: "व्याख्या", query: "explainer", kind: "explainer" },
  { label: "मार्गदर्शिका", query: "guide", kind: "guide" },
  { label: "तथ्य जाँच", query: "fact-check", kind: "fact_check" },
];
type Props = { searchParams: Promise<{ page?: string | string[]; type?: string | string[] }> };
function requestedPage(value: string | string[] | undefined): number {
  if (typeof value !== "string" || !/^[1-9]\d*$/u.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : 1;
}
export default async function InformationHubPage({ searchParams }: Props) {
  const query = await searchParams;
  const selectedType =
    typeof query.type === "string"
      ? typeFilters.find((filter) => filter.query === query.type && filter.kind)
      : undefined;
  const data = await contentGateway.listHub("ne-NP", requestedPage(query.page), selectedType?.kind);
  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <Breadcrumbs items={[{ label: "गृहपृष्ठ", href: "/" }, { label: "जानकारी केन्द्र" }]} />
        <header className="mt-8 border-b-4 border-[var(--ink)] pb-5">
          <p className="eyebrow">
            <LocalizedText ne="सन्दर्भ, व्याख्या र उपयोगी जानकारी" />
          </p>
          <h1 className="editorial-heading mt-2 text-4xl font-bold sm:text-5xl">
            <LocalizedText ne="जानकारी केन्द्र" />
          </h1>
          <p className="mt-3 max-w-3xl leading-7 text-[var(--ink-soft)]">
            <LocalizedText ne="समाचारको पृष्ठभूमि बुझ्न सहयोग गर्ने सामग्रीका लागि समर्पित ठाउँ। तलका सबै सामग्री पृष्ठ संरचना जाँच्न बनाइएका काल्पनिक नमुना हुन्।" />
          </p>
        </header>
        <nav className="mt-5 flex flex-wrap gap-2" aria-labelledby="information-types-label">
          <span className="sr-only" id="information-types-label">
            <LocalizedText ne="जानकारी सामग्रीको प्रकार" />
          </span>
          {typeFilters.map((filter) => {
            const href = filter.query
              ? `/information-hub?type=${filter.query}`
              : "/information-hub";
            const current = (selectedType?.query ?? "") === filter.query;
            return (
              <Link
                aria-current={current ? "page" : undefined}
                className="story-category"
                href={href}
                key={filter.query || "all"}
              >
                <LocalizedText ne={filter.label} />
              </Link>
            );
          })}
        </nav>
        {data.entries.length ? (
          <section
            className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            aria-labelledby="information-content-label"
          >
            <h2 className="sr-only" id="information-content-label">
              <LocalizedText ne="जानकारी केन्द्रका सामग्री" />
            </h2>
            {data.entries.map((entry) => (
              <article
                key={entry.id}
                className="flex flex-col border border-[var(--rule)] bg-[var(--paper-raised)] p-5"
              >
                <p className="eyebrow">
                  <LocalizedText ne={label(entry.kind)} />
                </p>
                <h2 className="editorial-heading mt-3 text-2xl font-bold leading-snug">
                  <Link href={`/information-hub/${entry.slug}`}>
                    <LocalizedText ne={entry.title} />
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-7 text-[var(--ink-soft)]">
                  <LocalizedText ne={entry.summary} />
                </p>
                <p className="mt-4 text-xs text-[var(--ink-soft)]">
                  <LocalizedText ne="नमुना समीक्षा:" />{" "}
                  <time dateTime={entry.reviewedAt}>
                    <LocalizedDate value={entry.reviewedAt} />
                  </time>
                </p>
                <Link className="mt-4 font-bold" href={`/information-hub/${entry.slug}`}>
                  <LocalizedText ne="सामग्री पढ्नुहोस् →" />
                </Link>
              </article>
            ))}
          </section>
        ) : (
          <div className="mt-7">
            <ContentState
              kind="empty"
              title="यस प्रकारको नमुना सामग्री उपलब्ध छैन"
              description="अर्को प्रकार छान्नुहोस् वा सबै जानकारी सामग्री हेर्नुहोस्।"
            />
          </div>
        )}
        <PageNavigation
          pageInfo={data.pageInfo}
          label="जानकारी केन्द्रका पृष्ठहरू"
          labelEn="Information hub pages"
          previousHref={
            data.pageInfo.page > 1
              ? `/information-hub?${selectedType ? `type=${selectedType.query}&` : ""}page=${data.pageInfo.page - 1}`
              : undefined
          }
          nextHref={
            data.pageInfo.page < data.pageInfo.totalPages
              ? `/information-hub?${selectedType ? `type=${selectedType.query}&` : ""}page=${data.pageInfo.page + 1}`
              : undefined
          }
        />
      </main>
    </>
  );
}
