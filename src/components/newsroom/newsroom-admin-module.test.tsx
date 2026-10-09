import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NewsroomAdminModule } from "@/components/newsroom/newsroom-admin-module";
import { NewsroomStoryLibrary } from "@/components/newsroom/newsroom-story-library";
import { NewsroomPrototypeProvider } from "@/components/newsroom/newsroom-prototype-provider";

describe("newsroom admin modules", () => {
  it("previews homepage placement changes without publishing them", () => {
    render(<NewsroomAdminModule module="homepage" />);

    fireEvent.change(screen.getByLabelText("मुख्य समाचार"), {
      target: { value: "published-world-demo" },
    });
    expect(
      screen.getByRole("heading", { name: "काल्पनिक नमुना: क्षेत्रीय पुस्तक मेला संवाद" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "नमुना छनोट हेर्नुहोस्" }));
    expect(screen.getByRole("status")).toHaveTextContent("केही प्रकाशित वा सुरक्षित भएको छैन");
  });

  it("adds a hub item to the current screen only", () => {
    render(<NewsroomAdminModule module="hub" />);

    fireEvent.change(screen.getByLabelText("नयाँ नमुना शीर्षक"), {
      target: { value: "काल्पनिक थपिएको मार्गदर्शिका" },
    });
    fireEvent.click(screen.getByRole("button", { name: "नमुना प्रविष्टि थप्नुहोस्" }));

    expect(screen.getByRole("heading", { name: "काल्पनिक थपिएको मार्गदर्शिका" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("कुनै सामग्री सार्वजनिक वा सुरक्षित भएको छैन");
  });

  it("adds a demo section locally and rejects a duplicate", () => {
    render(<NewsroomAdminModule module="categories" />);

    fireEvent.change(screen.getByLabelText("नेपाली नाम"), { target: { value: "स्वास्थ्य" } });
    fireEvent.click(screen.getByRole("button", { name: "नमुना खण्ड थप्नुहोस्" }));
    expect(screen.getByText("स्वास्थ्य")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("साइटको संरचना सुरक्षित भएको छैन");

    fireEvent.change(screen.getByLabelText("नेपाली नाम"), { target: { value: "स्वास्थ्य" } });
    fireEvent.click(screen.getByRole("button", { name: "नमुना खण्ड थप्नुहोस्" }));
    expect(screen.getByRole("status")).toHaveTextContent("यो खण्ड पहिल्यै छ");
  });

  it("filters the local story library and clears the filters", () => {
    render(
      <NewsroomPrototypeProvider>
        <NewsroomStoryLibrary />
      </NewsroomPrototypeProvider>,
    );

    fireEvent.change(screen.getByLabelText("अवस्था"), { target: { value: "published" } });
    expect(
      screen.getByText(
        (_, element) => element?.tagName === "P" && element.textContent === "3 नमुना सामग्री",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("काल्पनिक नमुना: नगर सेवा सूचना एउटै ठाउँमा")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "फिल्टर हटाउनुहोस्" }));
    expect(
      screen.getByText(
        (_, element) => element?.tagName === "P" && element.textContent === "6 नमुना सामग्री",
      ),
    ).toBeInTheDocument();
  });

  it("keeps site defaults visibly in preview state", () => {
    render(<NewsroomAdminModule module="settings" />);
    fireEvent.click(screen.getByRole("button", { name: "नमुना सेटिङ लागू गर्नुहोस्" }));
    expect(screen.getByRole("status")).toHaveTextContent("स्थायी सेटिङ सुरक्षित भएको छैन");
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    expect(screen.getByText("Redis")).toBeInTheDocument();
    expect(screen.getByText("Cloudinary")).toBeInTheDocument();
  });

  it("keeps the staff role matrix inside its responsive panel", () => {
    render(<NewsroomAdminModule module="staff" />);

    const table = screen.getByRole("table");
    expect(screen.getByRole("region", { name: "प्रस्तावित कर्मचारी अनुमति म्याट्रिक्स" })).toHaveAttribute(
      "aria-describedby",
      "role-matrix-scroll-help",
    );
    expect(table.closest(".overflow-x-auto")).toBeInTheDocument();
    expect(table.closest(".rounded-xl")).toHaveClass("min-w-0");
    expect(table.closest(".grid")).toHaveClass("grid-cols-1");
  });
});
