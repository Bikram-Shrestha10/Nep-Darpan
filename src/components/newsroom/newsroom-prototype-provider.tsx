"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { NewsroomStoryFixture, WorkflowStatus } from "@/lib/newsroom/fixtures";

interface NewsroomPrototypeState {
  draft: NewsroomStoryFixture | null;
  workflowStatus: WorkflowStatus;
  setDraft: (draft: NewsroomStoryFixture) => void;
  setWorkflowStatus: (status: WorkflowStatus) => void;
}

const PrototypeContext = createContext<NewsroomPrototypeState | null>(null);

export function NewsroomPrototypeProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<NewsroomStoryFixture | null>(null);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>("draft");
  return (
    <PrototypeContext.Provider value={{ draft, workflowStatus, setDraft, setWorkflowStatus }}>
      {children}
    </PrototypeContext.Provider>
  );
}

export function useNewsroomPrototype() {
  const state = useContext(PrototypeContext);
  if (!state)
    throw new Error("Newsroom prototype state is only available inside the newsroom layout.");
  return state;
}
