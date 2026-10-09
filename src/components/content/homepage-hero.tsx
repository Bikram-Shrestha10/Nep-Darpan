import Link from "next/link";
import type { ArticleCard, HomePageData } from "@/lib/content/contracts";
import { ArticleMedia, MediaSlot } from "@/components/content/article-media";
import { LeadStory } from "@/components/content/story-card";
import { CategoryTag, PublishedTime } from "@/components/content/story-metadata";
import { LocalizedText } from "@/components/layout/site-preferences";

type HomepageHeroSource = Pick<HomePageData, "lead" | "latest">;

export function selectHomepageHeroStories({ lead, latest }: HomepageHeroSource) {
  const usedStoryIds = new Set<string>();
  if (lead) usedStoryIds.add(lead.id);

  const importantStories: ArticleCard[] = [];
  for (const story of latest) {
    if (usedStoryIds.has(story.id)) continue;
    usedStoryIds.add(story.id);
    importantStories.push(story);
    if (importantStories.length === 3) break;
  }

  return {
    importantStories,
    usedStoryIds,
  };
}

function SupportingStory({ story }: { story: ArticleCard }) {
  return (
    <li className="home-hero-side__item">
      <article className="home-side-story">
        <Link className="home-side-story__media" href={story.href}>
          {story.leadMedia ? (
            <ArticleMedia
              aspectRatio="4 / 3"
              media={story.leadMedia}
              showCaptionText={false}
              sizes="(max-width: 640px) 30vw, (max-width: 1023px) 20vw, 120px"
            />
          ) : (
            <MediaSlot aspectRatio="4 / 3" />
          )}
        </Link>
        <div className="home-side-story__copy">
          <div className="home-side-story__meta">
            <CategoryTag category={story.category} />
            <PublishedTime
              value={story.updatedAt ?? story.publishedAt}
              label={story.updatedAt ? "अपडेट" : "प्रकाशित"}
            />
          </div>
          <h3 className="home-side-story__headline">
            <Link href={story.href}>
              <LocalizedText ne={story.headline} />
            </Link>
          </h3>
        </div>
      </article>
    </li>
  );
}

function ImportantStories({ stories }: { stories: ArticleCard[] }) {
  if (stories.length === 0) return null;

  return (
    <aside
      className="home-hero-side home-hero-side--important"
      aria-labelledby="home-hero-important-title"
    >
      <div className="home-hero-side__heading-row">
        <h2 id="home-hero-important-title" className="home-hero-side__heading">
          <LocalizedText ne="महत्त्वपूर्ण शीर्षकहरू" en="Important headlines" />
        </h2>
        <span className="home-hero-side__marker" aria-hidden="true" />
      </div>
      <ol className="home-hero-side__list">
        {stories.map((story) => (
          <SupportingStory key={story.id} story={story} />
        ))}
      </ol>
    </aside>
  );
}

export function HomepageHero({ lead, latest }: HomepageHeroSource) {
  const { importantStories } = selectHomepageHeroStories({ lead, latest });

  return (
    <div className={`home-hero-layout${lead ? "" : " home-hero-layout--without-lead"}`}>
      {lead ? (
        <section className="home-hero-layout__lead" aria-labelledby={`lead-${lead.id}`}>
          <LeadStory article={lead} headingLevel={1} variant="home" />
        </section>
      ) : null}
      <ImportantStories stories={importantStories} />
    </div>
  );
}
