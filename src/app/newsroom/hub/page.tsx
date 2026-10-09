import type { Metadata } from "next";
import { NewsroomAdminModule } from "@/components/newsroom/newsroom-admin-module";
import { NewsroomNotice } from "@/components/newsroom/newsroom-notice";

export const metadata: Metadata = { title: "जानकारी केन्द्र · समाचार कक्ष" };

export default function NewsroomHubPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell py-6 sm:py-9">
      <NewsroomNotice />
      <NewsroomAdminModule module="hub" />
    </main>
  );
}
