"use client";

import { useState } from "react";
import type { NewsroomStoryFixture } from "@/lib/newsroom/fixtures";
import { useNewsroomPrototype } from "@/components/newsroom/newsroom-prototype-provider";

export function ReviewQueue({ stories }: { stories: NewsroomStoryFixture[] }) {
  const [decisions, setDecisions] = useState<Record<string, "approved" | "returned">>({});
  const { draft, setDraft, setWorkflowStatus } = useNewsroomPrototype();
  const queue =
    draft && !stories.some((story) => story.id === draft.id) ? [...stories, draft] : stories;
  return (
    <ul className="mt-5 grid gap-4">
      {queue.map((story) => {
        const decision =
          decisions[story.id] ??
          (story.status === "approved_demo"
            ? "approved"
            : story.status === "returned_demo"
              ? "returned"
              : undefined);
        function decide(value: "approved" | "returned") {
          setDecisions((current) => ({ ...current, [story.id]: value }));
          if (draft?.id === story.id) {
            const status = value === "approved" ? "approved_demo" : "returned_demo";
            setDraft({ ...draft, status });
            setWorkflowStatus(status);
          }
        }
        return (
          <li className="border border-[var(--rule)] bg-[var(--paper-raised)] p-5" key={story.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="eyebrow">
                  {story.category} · {story.author}
                </p>
                <h2 className="editorial-heading mt-2 text-xl font-bold">{story.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{story.summary}</p>
              </div>
              <span className="story-label">
                {decision === "approved"
                  ? "स्वीकृत (नमुना)"
                  : decision === "returned"
                    ? "सुधारका लागि फिर्ता (नमुना)"
                    : "समीक्षामा"}
              </span>
            </div>
            {decision ? (
              <p className="mt-4 text-sm" role="status">
                {decision === "approved"
                  ? "स्वीकृति अवस्था यो पृष्ठमा मात्र देखाइएको छ; समाचार प्रकाशित भएको छैन।"
                  : "फिर्ता अवस्था यो पृष्ठमा मात्र देखाइएको छ; संवाददाता वा डाटाबेसलाई केही पठाइएको छैन।"}
              </p>
            ) : (
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="button-primary" onClick={() => decide("approved")} type="button">
                  स्वीकृति नमुना
                </button>
                <button
                  className="button-secondary"
                  onClick={() => decide("returned")}
                  type="button"
                >
                  सुधारका लागि फिर्ता
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
