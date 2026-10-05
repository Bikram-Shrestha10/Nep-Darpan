import type { Metadata } from "next";
import Link from "next/link";
import { NewsroomNotice } from "@/components/newsroom/newsroom-notice";

export const metadata: Metadata = { title: "अनुमति अवस्था नमुना" };
export default function NewsroomDeniedPage() {
  return (
    <>
      <NewsroomNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <section className="state-panel mx-auto max-w-2xl" aria-labelledby="denied-title">
          <p className="eyebrow text-[var(--urgent-dark)]">अनुमति अवस्था नमुना</p>
          <h1 id="denied-title" className="editorial-heading mt-2 text-3xl font-bold">
            यो पृष्ठ हेर्ने अनुमति छैन
          </h1>
          <p className="mt-3 leading-7">
            यो केवल अनुमति नपाएको अवस्थाको डिजाइन नमुना हो। अहिले कुनै लगइन, भूमिका वा अनुमति जाँच लागू छैन; यो
            पृष्ठले वास्तविक सुरक्षा प्रदान गर्दैन।
          </p>
          <Link className="button-secondary mt-5" href="/newsroom">
            ड्यासबोर्डमा फर्कनुहोस्
          </Link>
        </section>
      </main>
    </>
  );
}
