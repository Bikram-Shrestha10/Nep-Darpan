"use client";

import { NewsroomNotice } from "@/components/newsroom/newsroom-notice";

export default function NewsroomError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <NewsroomNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8">
        <section className="state-panel" role="alert">
          <h1 className="editorial-heading text-2xl font-bold">समाचार कक्ष देखाउन सकिएन</h1>
          <p className="mt-2 text-sm leading-6">यो प्रोटोटाइपको सामग्री लोड गर्दा समस्या आयो।</p>
          <button className="button-primary mt-4" onClick={reset} type="button">
            फेरि प्रयास गर्नुहोस्
          </button>
        </section>
      </main>
    </>
  );
}
