import type { ReactNode } from "react";
import { NewsroomPrototypeProvider } from "@/components/newsroom/newsroom-prototype-provider";
import { NewsroomWorkspace } from "@/components/newsroom/newsroom-workspace";

export default function NewsroomLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <NewsroomPrototypeProvider>
      <NewsroomWorkspace>{children}</NewsroomWorkspace>
    </NewsroomPrototypeProvider>
  );
}
