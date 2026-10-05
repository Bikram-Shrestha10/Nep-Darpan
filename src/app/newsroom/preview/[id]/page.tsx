import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsroomPreview } from "@/components/newsroom/newsroom-preview";
import { NewsroomNotice } from "@/components/newsroom/newsroom-notice";
import { newsroomStories } from "@/lib/newsroom/fixtures";

type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = newsroomStories.find((item) => item.id === id);
  return { title: story ? `पूर्वावलोकन: ${story.title}` : "समाचार पूर्वावलोकन नमुना" };
}
export default async function NewsroomPreviewPage({ params }: Props) {
  const { id } = await params;
  const story = newsroomStories.find((item) => item.id === id);
  if (!story && id !== "new-draft") notFound();
  return (
    <>
      <NewsroomNotice />
      <NewsroomPreview id={id} fixture={story} />
    </>
  );
}
