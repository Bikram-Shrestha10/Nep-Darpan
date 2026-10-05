import type { ReactNode } from "react";
import Link from "next/link";
import { NewsroomNav } from "@/components/newsroom/newsroom-nav";
import { NewsroomPrototypeProvider } from "@/components/newsroom/newsroom-prototype-provider";

export default function NewsroomLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <NewsroomPrototypeProvider>
      <div className="border-b-4 border-[var(--ink)] bg-[var(--paper-raised)]">
        <div className="page-shell flex min-h-16 items-center justify-between gap-4">
          <Link
            href="/newsroom"
            className="editorial-heading text-xl font-black no-underline sm:text-2xl"
          >
            समाचार कक्ष <span className="font-sans text-xs font-bold">· प्रोटोटाइप</span>
          </Link>
          <Link className="text-sm font-bold underline" href="/newsroom/denied">
            अनुमति अवस्था
          </Link>
        </div>
      </div>
      <NewsroomNav />
      {children}
    </NewsroomPrototypeProvider>
  );
}
