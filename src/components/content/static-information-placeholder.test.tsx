import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { StaticInformationPlaceholder } from "@/components/content/static-information-placeholder";

describe("static information placeholders", () => {
  it("makes pending policy copy explicit and does not invent legal text", async () => {
    const { container } = render(
      <StaticInformationPlaceholder title="गोपनीयता" description="स्वीकृत गोपनीयता सूचना थपिनेछ।" />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "गोपनीयता" })).toBeInTheDocument();
    expect(screen.getByText(/आधिकारिक नीति वा वास्तविक सम्पर्क विवरण प्रस्तुत गर्दैन/)).toBeVisible();
    expect((await axe(container)).violations).toEqual([]);
  });
});
