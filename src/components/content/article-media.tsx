import type { PublicMedia } from "@/lib/content/contracts";

export function ArticleMedia({ media }: { media: PublicMedia }) {
  const isVideo = media.kind === "video";
  const image = isVideo ? media.poster : media;
  const caption = media.caption;
  const credit = media.credit;
  const duration =
    isVideo && media.durationSeconds !== undefined
      ? new Intl.NumberFormat("ne-NP", { maximumFractionDigits: 0 }).format(media.durationSeconds)
      : undefined;

  return (
    <figure className="article-media">
      <div
        className={`article-media__placeholder${isVideo ? " article-media__placeholder--video" : ""}`}
        style={{ aspectRatio: `${Math.max(1, image.width)} / ${Math.max(1, image.height)}` }}
        {...(image.alt
          ? { role: "img", "aria-label": isVideo ? `${media.title}. ${image.alt}` : image.alt }
          : { "aria-hidden": true })}
      >
        <span aria-hidden="true" className="article-media__stamp">
          {isVideo ? "भिडियो पूर्वावलोकन" : "तस्बिर पूर्वावलोकन"}
        </span>
        {isVideo ? (
          <span aria-hidden="true" className="article-media__play">
            ▶
          </span>
        ) : null}
        {isVideo ? (
          <span aria-hidden="true" className="article-media__title">
            {media.title}
          </span>
        ) : null}
      </div>
      {caption || credit || duration ? (
        <figcaption className="article-media__caption">
          {caption ? <span>{caption}</span> : null}
          <span className="article-media__attribution">
            {credit ? <span>तस्बिर/भिडियो: {credit}</span> : null}
            {duration ? <span>{duration} सेकेन्ड</span> : null}
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
}
