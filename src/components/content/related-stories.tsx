import type { ArticleCard } from "@/lib/content/contracts";
import { useId } from "react";
import { StoryCard } from "@/components/content/story-card";
import { ContentState } from "@/components/ui/content-state";

export function RelatedStories({
  articles,
  title = "सम्बन्धित समाचार",
}: {
  articles: ArticleCard[];
  title?: string;
}) {
  const headingId = useId();
  return (
    <section className="related-stories" aria-labelledby={headingId}>
      <h2 id={headingId} className="editorial-heading related-stories__title">
        {title}
      </h2>
      {articles.length ? (
        <div className="related-stories__list">
          {articles.map((article) => (
            <StoryCard article={article} density="compact" key={article.id} />
          ))}
        </div>
      ) : (
        <ContentState
          kind="empty"
          title="सम्बन्धित समाचार उपलब्ध छैन"
          description="यस विषयसँग जोडिएका समाचार प्रकाशित भएपछि यहाँ देखिनेछन्।"
        />
      )}
    </section>
  );
}
