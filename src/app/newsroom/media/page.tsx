import type { Metadata } from "next";
import { NewsroomNotice } from "@/components/newsroom/newsroom-notice";
import { MediaPicker } from "@/components/newsroom/media-picker";

export const metadata: Metadata = { title: "मिडिया नमुना · समाचार कक्ष" };
export default function NewsroomMediaPage() {
  return (
    <>
      <NewsroomNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <header className="mb-6 border-b-4 border-[var(--ink)] pb-5">
          <p className="eyebrow">Cloudinary जोडिएको छैन</p>
          <h1 className="editorial-heading mt-2 text-4xl font-bold">मिडिया चयन नमुना</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--ink-soft)]">
            स्थानीय फाइल चयनको ब्राउजर अवस्था मात्र देखाइन्छ। कुनै फाइल नेटवर्कमा पठाइँदैन र पृष्ठ रिफ्रेस गर्दा चयन
            हराउँछ।
          </p>
        </header>
        <section
          className="max-w-3xl border border-[var(--rule)] bg-[var(--paper-raised)] p-5 sm:p-7"
          aria-labelledby="picker-title"
        >
          <h2 id="picker-title" className="editorial-heading mb-4 text-2xl font-bold">
            मिडिया फाइल छान्नुहोस्
          </h2>
          <MediaPicker />
        </section>
        <section className="mt-8 max-w-3xl border-t border-[var(--rule)] pt-5">
          <h2 className="editorial-heading text-xl font-bold">वास्तविक अपलोडअघि तय गर्नुपर्ने कुरा</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-6">
            <li>Cloudinary वातावरण र प्रमाणपत्र</li>
            <li>फाइल प्रकार, आकार र भिडियो नीति</li>
            <li>अधिकार, श्रेय, वैकल्पिक पाठ र क्याप्सनका आवश्यकताहरू</li>
            <li>निजी/प्रतिबन्धित मिडियाको वितरण</li>
          </ul>
        </section>
      </main>
    </>
  );
}
