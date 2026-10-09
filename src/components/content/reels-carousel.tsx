"use client";

import Link from "next/link";
import { useRef } from "react";
import { LocalizedText, useSitePreferences } from "@/components/layout/site-preferences";
import type { ReelCard } from "@/lib/content/contracts";

function formatDuration(durationSeconds: number, language: string) {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const westernDuration = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  if (language === "en") return westernDuration;

  const nepaliDigits = "०१२३४५६७८९";
  return westernDuration.replace(/\d/gu, (digit) => nepaliDigits[Number(digit)] ?? digit);
}

export function ReelsCarousel({ reels }: { reels: ReelCard[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const { language } = useSitePreferences();

  function scrollReels(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({
      left: direction * Math.max(track.clientWidth * 0.75, 220),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <section className="home-reels mt-12" aria-labelledby="reels-heading">
      <div className="home-reels__heading">
        <div className="home-reels__identity">
          <span className="home-reels__mark" aria-hidden="true">
            ▶
          </span>
          <div>
            <p className="home-reels__eyebrow">
              <LocalizedText ne="छोटो भिडियो समाचार" en="Short-form video" />
            </p>
            <h2 id="reels-heading" className="editorial-heading text-xl font-bold">
              <LocalizedText ne="नेप दर्पण रिल्स" en="Nep Darpan Reels" />
            </h2>
            <p className="home-reels__description">
              <LocalizedText
                ne="समाचार र व्याख्यालाई छोटो भिडियोमा हेर्नुहोस्"
                en="Catch up on news and explainers in a few minutes"
              />
            </p>
          </div>
        </div>
        <div className="home-reels__controls">
          <button
            className="home-reels__control"
            type="button"
            aria-label={language === "en" ? "Scroll reels left" : "रिल्स बायाँ सार्नुहोस्"}
            onClick={() => scrollReels(-1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            className="home-reels__control"
            type="button"
            aria-label={language === "en" ? "Scroll reels right" : "रिल्स दायाँ सार्नुहोस्"}
            onClick={() => scrollReels(1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <ul
        className="home-reels__track"
        ref={trackRef}
        aria-label={language === "en" ? "Fictional reel previews" : "काल्पनिक रिल्स पूर्वावलोकन"}
      >
        {reels.map((reel) => (
          <li className="home-reels__item" key={reel.id}>
            <article className="home-reel">
              <div className="home-reel__poster">
                {reel.media ? (
                  <video
                    aria-label={
                      language === "en"
                        ? (reel.media.titleEn ?? reel.media.title)
                        : reel.media.title
                    }
                    className="home-reel__video"
                    controls
                    height={reel.media.poster.height}
                    muted
                    playsInline
                    poster={reel.media.poster.src}
                    preload="none"
                    title={
                      language === "en"
                        ? (reel.media.titleEn ?? reel.media.title)
                        : reel.media.title
                    }
                    width={reel.media.poster.width}
                  >
                    <source src={reel.media.src} type="video/mp4" />
                    {reel.media.captionsUrl ? (
                      <track
                        default
                        kind="captions"
                        label={language === "en" ? "English captions" : "नेपाली उपशीर्षक"}
                        src={reel.media.captionsUrl}
                        srcLang={language}
                      />
                    ) : null}
                    <LocalizedText
                      ne="तपाईंको ब्राउजरले भिडियो चलाउन सकेन।"
                      en="Your browser does not support video playback."
                    />
                  </video>
                ) : (
                  <div
                    className="home-reel__placeholder"
                    role="img"
                    aria-label={language === "en" ? "Reel preview image" : "रिल्स पूर्वावलोकन तस्बिर"}
                  >
                    <span aria-hidden="true">▶</span>
                    <span>
                      <LocalizedText
                        ne="भिडियो सामग्री थपेपछि यहाँ देखिनेछ"
                        en="Video media will appear here when added"
                      />
                    </span>
                  </div>
                )}
                <div className="home-reel__topline">
                  <span className="home-reel__category">
                    <LocalizedText ne={reel.category.name} />
                  </span>
                  {reel.media?.durationSeconds ? (
                    <span className="home-reel__duration">
                      {formatDuration(reel.media.durationSeconds, language)}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="home-reel__copy">
                <p className="home-reel__sample-label">
                  <LocalizedText
                    ne="काल्पनिक नमुना · स्टक भिडियो"
                    en="Fictional sample · stock video"
                  />
                </p>
                <h3 className="home-reel__headline">
                  <Link href={reel.href}>
                    <LocalizedText ne={reel.headline} en={reel.headlineEn} />
                  </Link>
                </h3>
                {reel.media?.credit ? (
                  <p className="home-reel__credit">
                    <LocalizedText ne="भिडियो" en="Video" />: {reel.media.credit}
                  </p>
                ) : null}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
