"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LocalizedText, useSitePreferences } from "@/components/layout/site-preferences";

const demoAdvertisements = [
  {
    id: "partner-placement",
    labelNe: "नमुना विज्ञापन ०१ · प्रायोजित",
    labelEn: "SAMPLE AD 01 · SPONSORED",
    headingNe: "नेप दर्पण विज्ञापन साझेदार · प्रायोजित स्थान",
    headingEn: "Nep Darpan Advertising Partner · Sponsored Placement",
    copyNe: "नेपालका प्रभावशाली निर्णयकर्ता र पाठकसम्म पुग्नुहोस्।",
    copyEn: "Reach Nepal's most influential decision-makers and readers.",
    imageSrc: "/stock-preview/mobile-payment-pexels.jpg",
    imageAltNe: "काउन्टरमा स्मार्टफोनबाट भुक्तानी गरिँदै",
    imageAltEn: "A customer using a smartphone at a payment terminal",
    imageCredit: "iMin Technology / Pexels",
    actionNe: "विज्ञापनबारे सोधपुछ गर्नुहोस्",
    actionEn: "Ask about advertising",
  },
  {
    id: "brand-campaign",
    labelNe: "नमुना विज्ञापन ०२ · प्रायोजित",
    labelEn: "SAMPLE AD 02 · SPONSORED",
    headingNe: "नेप दर्पण साझेदार · ब्रान्ड अभियान",
    headingEn: "Nep Darpan Partner · Brand Campaign",
    copyNe: "नेपाली पाठकसमक्ष आफ्नो अभियान प्रस्तुत गर्नुहोस्।",
    copyEn: "Introduce your organization to readers across Nepal.",
    imageSrc: "/stock-preview/library-students-pexels.jpg",
    imageAltNe: "पुस्तकालयमा अध्ययन गरिरहेका विद्यार्थी",
    imageAltEn: "Students reading in a library",
    imageCredit: "Thirdman / Pexels",
    actionNe: "विज्ञापनबारे सोधपुछ गर्नुहोस्",
    actionEn: "Ask about advertising",
  },
];

const rotationIntervalMs = 6500;

export function AdvertisementSlot() {
  const { language } = useSitePreferences();
  const [rotation, setRotation] = useState<{ activeIndex: number; previousIndex: number | null }>({
    activeIndex: 0,
    previousIndex: null,
  });
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!motionPreference) return;

    setIsPaused(motionPreference.matches);
    const updateMotionPreference = (event: MediaQueryListEvent) => {
      setIsPaused(event.matches);
    };
    motionPreference.addEventListener("change", updateMotionPreference);
    return () => motionPreference.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const intervalId = window.setInterval(() => {
      setRotation((current) => ({
        activeIndex: (current.activeIndex + 1) % demoAdvertisements.length,
        previousIndex: current.activeIndex,
      }));
    }, rotationIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  const toggleLabel =
    language === "en"
      ? isPaused
        ? "Resume advertisement rotation"
        : "Pause advertisement rotation"
      : isPaused
        ? "विज्ञापन पुनः चलाउनुहोस्"
        : "विज्ञापन रोक्नुहोस्";

  return (
    <section
      className="home-advertisement"
      aria-labelledby="home-advertisement-heading"
      aria-roledescription={language === "en" ? "advertisement carousel" : "विज्ञापन स्लाइडर"}
    >
      <div className="home-advertisement__toolbar">
        <h2 id="home-advertisement-heading" className="home-advertisement__label">
          <LocalizedText ne="विज्ञापन" en="ADVERTISEMENT" />
        </h2>
        <button
          className="home-advertisement__toggle"
          type="button"
          aria-label={toggleLabel}
          aria-pressed={isPaused}
          onClick={() => setIsPaused((paused) => !paused)}
        >
          <span aria-hidden="true">{isPaused ? "▶" : "Ⅱ"}</span>
        </button>
      </div>
      <div className="home-advertisement__panel">
        <div className="home-advertisement__viewport" aria-live="off">
          {demoAdvertisements.map((advertisement, index) => {
            const slideState =
              index === rotation.activeIndex
                ? "home-advertisement__slide--active"
                : index === rotation.previousIndex
                  ? "home-advertisement__slide--exiting"
                  : "home-advertisement__slide--hidden";

            return (
              <article
                key={advertisement.id}
                className={`home-advertisement__slide ${slideState}`}
                aria-hidden={index !== rotation.activeIndex}
              >
                <div className="home-advertisement__media">
                  <Image
                    alt={language === "en" ? advertisement.imageAltEn : advertisement.imageAltNe}
                    className="home-advertisement__image"
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 34vw, 360px"
                    src={advertisement.imageSrc}
                  />
                </div>
                <div className="home-advertisement__content">
                  <p className="home-advertisement__sample">
                    <LocalizedText ne={advertisement.labelNe} en={advertisement.labelEn} />
                  </p>
                  <h3 className="home-advertisement__heading">
                    <LocalizedText ne={advertisement.headingNe} en={advertisement.headingEn} />
                  </h3>
                  <p className="home-advertisement__copy">
                    <LocalizedText ne={advertisement.copyNe} en={advertisement.copyEn} />
                  </p>
                  <p className="home-advertisement__credit">
                    <LocalizedText ne="तस्बिर:" en="Photo:" /> {advertisement.imageCredit}
                  </p>
                  <Link className="home-advertisement__action" href="/contact">
                    <LocalizedText ne={advertisement.actionNe} en={advertisement.actionEn} />
                    <span aria-hidden="true"> →</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
