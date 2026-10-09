import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { PageNavigation } from "@/components/ui/page-navigation";

describe("page navigation", () => {
  it("keeps reader navigation labels and page URLs accessible", async () => {
    const { container } = render(
      <PageNavigation
        pageInfo={{ page: 2, pageSize: 10, totalItems: 30, totalPages: 3 }}
        label="अर्थतन्त्र समाचार पृष्ठहरू"
        previousHref="/category/economy?page=1"
        nextHref="/category/economy?page=3"
      />,
    );

    expect(screen.getByRole("navigation", { name: "अर्थतन्त्र समाचार पृष्ठहरू" })).toBeVisible();
    expect(screen.getByText("पृष्ठ २ / ३")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "← अघिल्लो" })).toHaveAttribute(
      "href",
      "/category/economy?page=1",
    );
    expect(screen.getByRole("link", { name: "अर्को →" })).toHaveAttribute(
      "href",
      "/category/economy?page=3",
    );
    expect((await axe(container)).violations).toEqual([]);
  });

  it("stays out of the layout when the collection fits on one page", () => {
    const { container } = render(
      <PageNavigation
        pageInfo={{ page: 1, pageSize: 10, totalItems: 3, totalPages: 1 }}
        label="जानकारी केन्द्रका पृष्ठहरू"
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
