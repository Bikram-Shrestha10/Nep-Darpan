import Link from "next/link";
import { PreviewNotice } from "@/components/layout/preview-notice";
import { LocalizedText } from "@/components/layout/site-preferences";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export function StaticInformationPlaceholder({
  title,
  description,
  relatedLink,
}: {
  title: string;
  description: string;
  relatedLink?: { href: string; label: string };
}) {
  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <Breadcrumbs items={[{ label: "गृहपृष्ठ", href: "/" }, { label: title }]} />
        <section className="state-panel mx-auto mt-8 max-w-3xl">
          <p className="eyebrow text-[var(--ink)]">
            <LocalizedText ne="स्वीकृत सामग्री प्रतीक्षामा" />
          </p>
          <h1 className="editorial-heading mt-2 text-3xl font-bold sm:text-4xl">
            <LocalizedText ne={title} />
          </h1>
          <p className="mt-4 leading-7 text-[var(--ink-soft)]">
            <LocalizedText ne={description} />
          </p>
          <p className="mt-4 text-sm leading-6">
            <LocalizedText ne="यो डिजाइन पूर्वावलोकनले आधिकारिक नीति वा वास्तविक सम्पर्क विवरण प्रस्तुत गर्दैन। सम्बन्धित टोलीबाट स्वीकृत सामग्री प्राप्त भएपछि मात्र प्रकाशित गरिनेछ।" />
          </p>
          {relatedLink ? (
            <Link className="button-secondary mt-5" href={relatedLink.href}>
              <LocalizedText ne={relatedLink.label} />
            </Link>
          ) : null}
        </section>
      </main>
    </>
  );
}
