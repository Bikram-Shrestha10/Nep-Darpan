type StateKind = "empty" | "error" | "loading";
const defaults = {
  empty: { title: "यहाँ अहिले सामग्री छैन", description: "नयाँ सामग्री प्रकाशित भएपछि यो खण्डमा देखिनेछ।" },
  error: { title: "सामग्री देखाउन सकिएन", description: "केही समयपछि फेरि प्रयास गर्नुहोस्।" },
} as const;
export function ContentState({
  kind,
  title,
  description,
}: {
  kind: StateKind;
  title?: string;
  description?: string;
}) {
  if (kind === "loading")
    return (
      <div
        aria-label="सामग्री लोड हुँदैछ"
        aria-live="polite"
        className="state-panel space-y-3"
        role="status"
      >
        <span className="sr-only">सामग्री लोड हुँदैछ</span>
        <div className="skeleton-line w-1/3" />
        <div className="skeleton-line w-full" />
        <div className="skeleton-line w-4/5" />
      </div>
    );
  const copy = defaults[kind];
  return (
    <section className="state-panel" aria-live={kind === "error" ? "assertive" : "polite"}>
      <p className="editorial-heading text-xl font-bold">{title ?? copy.title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
        {description ?? copy.description}
      </p>
    </section>
  );
}
