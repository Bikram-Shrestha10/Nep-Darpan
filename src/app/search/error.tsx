"use client";

export default function SearchError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell py-12">
      <section className="state-panel" role="alert">
        <p className="editorial-heading text-xl font-bold">खोज देखाउन सकिएन</p>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
          केही समयपछि फेरि प्रयास गर्नुहोस्।
        </p>
        <button className="button-primary mt-4" onClick={reset} type="button">
          फेरि प्रयास गर्नुहोस्
        </button>
      </section>
    </main>
  );
}
