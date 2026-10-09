import { PreviewNotice } from "@/components/layout/preview-notice";
import { ContentState } from "@/components/ui/content-state";
import { LocalizedText } from "@/components/layout/site-preferences";

export default function SearchLoading() {
  return (
    <>
      <PreviewNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8">
        <h1 className="editorial-heading mb-5 text-4xl font-bold">
          <LocalizedText ne="खोज नतिजा" />
        </h1>
        <ContentState kind="loading" />
      </main>
    </>
  );
}
