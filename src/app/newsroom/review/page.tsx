import type { Metadata } from "next";
import { NewsroomNotice } from "@/components/newsroom/newsroom-notice";
import { ReviewQueue } from "@/components/newsroom/review-queue";
import { newsroomStories } from "@/lib/newsroom/fixtures";

export const metadata: Metadata = { title: "समीक्षा सूची · समाचार कक्ष" };
export default function NewsroomReviewPage() {
  const pending = newsroomStories.filter((story) => story.status === "in_review");
  return (
    <>
      <NewsroomNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <header className="border-b-4 border-[var(--ink)] pb-5">
          <p className="eyebrow">सम्पादकीय जाँच · नमुना</p>
          <h1 className="editorial-heading mt-2 text-4xl font-bold">समीक्षा सूची</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--ink-soft)]">
            स्वीकृति र सुधारका बटनले यही पृष्ठमा मात्र अवस्था परिवर्तन गर्छन्। यसले समाचार प्रकाशित वा कसैलाई सूचना
            पठाउँदैन।
          </p>
        </header>
        {pending.length ? (
          <ReviewQueue stories={pending} />
        ) : (
          <section className="state-panel mt-5">
            <h2 className="editorial-heading text-xl font-bold">समीक्षाका लागि सामग्री छैन</h2>
          </section>
        )}
      </main>
    </>
  );
}
