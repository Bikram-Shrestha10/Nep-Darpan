import Link from "next/link";
import type { ArticleCard } from "@/lib/content/contracts";
import { ArticleMedia, MediaSlot } from "@/components/content/article-media";
import { LocalizedText } from "@/components/layout/site-preferences";
import { CategoryTag, AuthorByline, PublishedTime } from "@/components/content/story-metadata";

export function StoryCard({
  article,
  density = "standard",
}: {
  article: ArticleCard;
  density?: "standard" | "compact";
}) {
  return (
    <article className={`story-card story-card--${density} story-card--with-media`}>
      {article.leadMedia ? (
        <ArticleMedia media={article.leadMedia} aspectRatio="8 / 5" />
      ) : (
        <MediaSlot aspectRatio="8 / 5" className="story-card__media-slot" />
      )}
      <div className="story-card__body">
        <div className="story-card__topline">
          <CategoryTag category={article.category} />
        </div>
        <h3 className="story-card__headline">
          <Link href={article.href}>
            <LocalizedText ne={article.headline} />
          </Link>
        </h3>
        {article.summary ? (
          <p className="story-card__summary">
            <LocalizedText ne={article.summary} />
          </p>
        ) : null}
        <div className="story-card__metadata">
          <AuthorByline authors={article.authors} />
          <PublishedTime
            value={article.updatedAt ?? article.publishedAt}
            label={article.updatedAt ? "अपडेट" : "प्रकाशित"}
          />
        </div>
        {article.hasCorrection ? (
          <p className="story-card__correction">
            <LocalizedText ne="यस समाचारमा सम्पादकीय सुधार सूचना छ" />
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function LeadStory({
  article,
  headingLevel = 2,
  variant = "default",
}: {
  article: ArticleCard;
  headingLevel?: 1 | 2;
  variant?: "default" | "home";
}) {
  const Headline = headingLevel === 1 ? "h1" : "h2";
  return (
    <article
      className={`lead-story${variant === "home" ? " lead-story--home" : ""}`}
      aria-labelledby={`lead-${article.id}`}
    >
      <div className="lead-story__visual">
        {article.leadMedia ? (
          <ArticleMedia media={article.leadMedia} showCaptionText={variant !== "home"} />
        ) : (
          <MediaSlot className="lead-story__media-empty" />
        )}
        <span className="lead-story__visual-badge">
          <LocalizedText ne="प्रमुख समाचार" en="Top story" />
        </span>
      </div>
      <div className="lead-story__copy">
        <div className="lead-story__labels">
          <CategoryTag category={article.category} />
        </div>
        <Headline id={`lead-${article.id}`} className="editorial-heading lead-story__headline">
          <Link href={article.href}>
            <LocalizedText ne={article.headline} />
          </Link>
        </Headline>
        {article.summary ? (
          <p className="lead-story__summary">
            <LocalizedText ne={article.summary} />
          </p>
        ) : null}
        <div className={variant === "home" ? "lead-story__footer" : undefined}>
          <div className="lead-story__metadata">
            {variant === "home" ? (
              <span className="lead-story__author-mark" aria-hidden="true">
                न
              </span>
            ) : null}
            <AuthorByline authors={article.authors} />
            <PublishedTime
              value={article.updatedAt ?? article.publishedAt}
              label={article.updatedAt ? "अपडेट" : "प्रकाशित"}
            />
          </div>
          {variant === "home" ? (
            <Link className="lead-story__read-more" href={article.href}>
              <LocalizedText ne="विस्तृत पढ्नुहोस्" en="Read full story" />
              <span aria-hidden="true"> →</span>
            </Link>
          ) : null}
        </div>
        {article.hasCorrection && variant !== "home" ? (
          <p className="story-card__correction">
            <LocalizedText ne="यस समाचारमा सम्पादकीय सुधार सूचना छ" />
          </p>
        ) : null}
      </div>
    </article>
  );
}
