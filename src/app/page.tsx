import { MOCK_DATA_NOTICE, mockContentGateway } from "@/lib/content/mock-gateway";

export default async function Home() {
  const home = await mockContentGateway.getHome("ne-NP");

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600">
        Frontend foundation · Task 1.1
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-950">Nep Darpan</h1>
      <p className="mt-3 max-w-2xl text-lg leading-8 text-stone-700">
        The responsive news and information website is ready for its first frontend build.
      </p>

      <aside className="mt-8 rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-950">
        <strong>Preview data:</strong> {MOCK_DATA_NOTICE}
      </aside>

      <section aria-labelledby="foundation-title" className="mt-10 border-t border-stone-300 pt-6">
        <h2 id="foundation-title" className="text-xl font-semibold text-stone-950">
          Frontend data boundary
        </h2>
        <p className="mt-2 text-stone-700">
          The page reads from a typed local fixture. No database, Redis service, or Cloudinary
          credentials are needed in this phase.
        </p>
        <p className="mt-4 text-sm text-stone-600">
          Active fixture locale: {home.locale}. Available editions:{" "}
          {home.availableLocales.join(", ")}.
        </p>
        {home.lead ? (
          <article className="mt-6 rounded-md border border-stone-300 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-800">
              Fixture story
            </p>
            <h3 className="mt-2 text-xl font-semibold text-stone-950">{home.lead.headline}</h3>
            {home.lead.summary ? <p className="mt-2 text-stone-700">{home.lead.summary}</p> : null}
          </article>
        ) : null}
      </section>
    </main>
  );
}
