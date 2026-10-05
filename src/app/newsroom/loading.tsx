import { NewsroomNotice } from "@/components/newsroom/newsroom-notice";
import { ContentState } from "@/components/ui/content-state";

export default function NewsroomLoading() {
  return (
    <>
      <NewsroomNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8">
        <h1 className="editorial-heading mb-5 text-3xl font-bold">समाचार कक्ष</h1>
        <ContentState kind="loading" />
      </main>
    </>
  );
}
