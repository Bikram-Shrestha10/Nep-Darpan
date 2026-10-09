import type { Metadata } from "next";
import { NewsroomAdminModule } from "@/components/newsroom/newsroom-admin-module";
import { NewsroomNotice } from "@/components/newsroom/newsroom-notice";

export const metadata: Metadata = { title: "गतिविधि अभिलेख · समाचार कक्ष" };

export default function NewsroomAuditPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell py-6 sm:py-9">
      <NewsroomNotice />
      <NewsroomAdminModule module="audit" />
    </main>
  );
}
