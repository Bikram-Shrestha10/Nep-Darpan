import type { Metadata } from "next";
import { NewsroomNotice } from "@/components/newsroom/newsroom-notice";
import { StoryEditorForm } from "@/components/newsroom/story-editor-form";

export const metadata: Metadata = { title: "नयाँ समाचार · समाचार कक्ष" };
export default function NewNewsroomStoryPage() {
  return (
    <>
      <NewsroomNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <header className="mb-6 border-b-4 border-[var(--ink)] pb-5">
          <p className="eyebrow">सम्पादन · नयाँ नमुना</p>
          <h1 className="editorial-heading mt-2 text-4xl font-bold">नयाँ समाचार</h1>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            अनिवार्य विवरण भरेपछि स्थानीय प्रोटोटाइप अवस्था हेर्न सक्नुहुन्छ।
          </p>
        </header>
        <StoryEditorForm />
      </main>
    </>
  );
}
