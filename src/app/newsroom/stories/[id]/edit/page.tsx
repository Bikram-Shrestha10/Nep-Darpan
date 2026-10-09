import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsroomNotice } from "@/components/newsroom/newsroom-notice";
import { StoryEditorForm } from "@/components/newsroom/story-editor-form";
import { newsroomStories } from "@/lib/newsroom/fixtures";
import { LocalizedText } from "@/components/layout/site-preferences";

type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = newsroomStories.find((item) => item.id === id);
  return { title: story ? `सम्पादन: ${story.title}` : "समाचार भेटिएन" };
}
export default async function EditNewsroomStoryPage({ params }: Props) {
  const { id } = await params;
  const story = newsroomStories.find((item) => item.id === id);
  if (!story) notFound();
  return (
    <>
      <NewsroomNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <header className="mb-6 border-b-4 border-[var(--ink)] pb-5">
          <p className="eyebrow">
            <LocalizedText ne="सम्पादन · काल्पनिक सामग्री" />
          </p>
          <h1 className="editorial-heading mt-2 text-3xl font-bold sm:text-4xl">
            <LocalizedText ne="समाचार सम्पादन" />
          </h1>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            <LocalizedText ne="यो डेमोमा परिवर्तन हालको ब्राउजर पृष्ठमा मात्र रहन्छ।" />
          </p>
        </header>
        <StoryEditorForm story={story} />
      </main>
    </>
  );
}
