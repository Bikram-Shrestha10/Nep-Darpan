"use client";

import Image from "next/image";
import type { PublicMedia } from "@/lib/content/contracts";
import { LocalizedText, useSitePreferences } from "@/components/layout/site-preferences";

export function MediaSlot({
  kind = "image",
  aspectRatio = "16 / 9",
  className,
}: {
  kind?: "image" | "video";
  aspectRatio?: string;
  className?: string;
}) {
  const { language } = useSitePreferences();
  const isVideo = kind === "video";
  return (
    <div
      className={`article-media__placeholder${isVideo ? " article-media__placeholder--video" : ""}${className ? ` ${className}` : ""}`}
      style={{ aspectRatio }}
      role="img"
      aria-label={
        language === "en"
          ? isVideo
            ? "Reels or video will be added here"
            : "An image will be added here"
          : isVideo
            ? "यहाँ रिल्स वा भिडियो थपिनेछ"
            : "यहाँ तस्बिर थपिनेछ"
      }
    >
      <span aria-hidden="true" className="article-media__stamp">
        <LocalizedText ne={isVideo ? "रिल्स / भिडियो" : "तस्बिर"} />
      </span>
      {isVideo ? (
        <span aria-hidden="true" className="article-media__play">
          ▶
        </span>
      ) : null}
      <span aria-hidden="true" className="article-media__title">
        <LocalizedText
          ne={isVideo ? "तपाईंले भिडियो थपेपछि यहाँ देखिनेछ" : "तपाईंले तस्बिर थपेपछि यहाँ देखिनेछ"}
        />
      </span>
    </div>
  );
}

export function ArticleMedia({
  media,
  aspectRatio,
  sizes = "(max-width: 640px) 94vw, (max-width: 1024px) 48vw, 760px",
  showCaptionText = true,
}: {
  media: PublicMedia;
  aspectRatio?: string;
  sizes?: string;
  showCaptionText?: boolean;
}) {
  const { language } = useSitePreferences();
  const isVideo = media.kind === "video";
  const image = isVideo ? media.poster : media;
  const caption = media.caption;
  const captionEn = media.captionEn;
  const credit = media.credit;
  const alt = language === "en" ? (image.altEn ?? image.alt) : image.alt;
  const title =
    isVideo && language === "en"
      ? (media.titleEn ?? media.title)
      : isVideo
        ? media.title
        : undefined;
  const duration =
    isVideo && media.durationSeconds !== undefined
      ? new Intl.NumberFormat(language, { maximumFractionDigits: 0 }).format(media.durationSeconds)
      : undefined;

  return (
    <figure className="article-media">
      <div
        className={`article-media__visual${isVideo ? " article-media__visual--video" : ""}`}
        style={{
          aspectRatio: aspectRatio ?? `${Math.max(1, image.width)} / ${Math.max(1, image.height)}`,
        }}
      >
        {isVideo ? (
          <video
            aria-label={title}
            className="article-media__video"
            controls
            height={image.height}
            muted
            playsInline
            poster={image.src}
            preload="none"
            title={title}
            width={image.width}
          >
            <source src={media.src} type="video/mp4" />
            {media.captionsUrl ? (
              <track
                default
                kind="captions"
                label={language === "en" ? "English captions" : "नेपाली उपशीर्षक"}
                src={media.captionsUrl}
                srcLang={language}
              />
            ) : null}
            <LocalizedText
              ne="तपाईंको ब्राउजरले भिडियो चलाउन सकेन।"
              en="Your browser does not support video playback."
            />
          </video>
        ) : (
          <Image
            alt={alt}
            className="article-media__image"
            fill
            preload={media.id === "stock-library-students-pexels"}
            sizes={sizes}
            src={image.src}
          />
        )}
      </div>
      {(showCaptionText && caption) || credit || duration ? (
        <figcaption className="article-media__caption">
          {showCaptionText && caption ? (
            <span>
              <LocalizedText ne={caption} en={captionEn} />
            </span>
          ) : null}
          <span className="article-media__attribution">
            {credit ? (
              <span>
                <LocalizedText ne={isVideo ? "भिडियो" : "तस्बिर"} en={isVideo ? "Video" : "Photo"} />
                : {credit}
              </span>
            ) : null}
            {duration ? (
              <span>
                {duration} <LocalizedText ne="सेकेन्ड" />
              </span>
            ) : null}
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
}
