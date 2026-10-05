import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ContentState } from "@/components/ui/content-state";

describe("shared UI", () => {
  it("marks the current breadcrumb", () => {
    render(<Breadcrumbs items={[{ href: "/", label: "गृहपृष्ठ" }, { label: "अर्थतन्त्र" }]} />);
    expect(screen.getByText("अर्थतन्त्र")).toHaveAttribute("aria-current", "page");
  });
  it.each(["empty", "error", "loading"] as const)(
    "renders an accessible %s state",
    async (kind) => {
      const { container } = render(<ContentState kind={kind} />);
      expect((await axe(container)).violations).toEqual([]);
    },
  );
});
