import type { Metadata } from "next";
import Link from "next/link";
import { NewsroomNotice } from "@/components/newsroom/newsroom-notice";
import { SignInForm } from "@/components/newsroom/sign-in-form";

export const metadata: Metadata = { title: "समाचार कक्ष साइन इन नमुना" };
export default function NewsroomSignInPage() {
  return (
    <>
      <NewsroomNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <div className="mx-auto max-w-2xl border-y-4 border-[var(--ink)] bg-[var(--paper-raised)] p-5 sm:p-8">
          <p className="eyebrow text-[var(--urgent-dark)]">कुनै वास्तविक लगइन हुँदैन</p>
          <h1 className="editorial-heading mt-2 text-3xl font-bold sm:text-4xl">
            समाचार कक्ष साइन इन
          </h1>
          <p className="my-5 text-sm leading-7 text-[var(--ink-soft)]">
            यो फारमले केवल ब्राउजरको आवश्यक-क्षेत्र जाँच देखाउँछ। यसले प्रमाणपत्र प्रमाणित गर्दैन वा सत्र बनाउँदैन।
          </p>
          <SignInForm />
          <p className="mt-6 text-sm">
            अनुमति नपाएको अवस्थाको दृश्य हेर्न{" "}
            <Link className="font-bold underline" href="/newsroom/denied">
              अनुमति नमुना
            </Link>{" "}
            खोल्नुहोस्।
          </p>
        </div>
      </main>
    </>
  );
}
