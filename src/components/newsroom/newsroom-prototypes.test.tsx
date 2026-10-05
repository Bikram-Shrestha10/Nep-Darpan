import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { CorrectionForm } from "@/components/newsroom/correction-form";
import { MediaPicker } from "@/components/newsroom/media-picker";
import { ReviewQueue } from "@/components/newsroom/review-queue";
import { NewsroomPreview } from "@/components/newsroom/newsroom-preview";
import { NewsroomPrototypeProvider } from "@/components/newsroom/newsroom-prototype-provider";
import { SignInForm } from "@/components/newsroom/sign-in-form";
import { StoryEditorForm } from "@/components/newsroom/story-editor-form";
import { newsroomStories } from "@/lib/newsroom/fixtures";

describe("newsroom sign-in prototype", () => {
  it("validates required credentials but never authenticates", async () => {
    const { container } = render(<SignInForm />);
    const form = screen.getByRole("button", { name: "साइन इन प्रयास गर्नुहोस्" }).closest("form");
    expect(form instanceof HTMLFormElement && form.checkValidity()).toBe(false);
    fireEvent.change(screen.getByLabelText("इमेल"), { target: { value: "editor@example.test" } });
    fireEvent.change(screen.getByLabelText("पासवर्ड"), { target: { value: "long-demo-password" } });
    expect(form instanceof HTMLFormElement && form.checkValidity()).toBe(true);
    if (!(form instanceof HTMLFormElement)) throw new Error("Sign-in form was not rendered");
    fireEvent.submit(form);
    expect(screen.getByRole("status")).toHaveTextContent("कसैलाई साइन इन गरिएको छैन");
    expect((await axe(container)).violations).toEqual([]);
  });
});

describe("story editor prototype", () => {
  it("requires core fields and visibly marks local edits as unsaved", () => {
    render(
      <NewsroomPrototypeProvider>
        <StoryEditorForm />
      </NewsroomPrototypeProvider>,
    );
    const form = screen.getByRole("button", { name: "मस्यौदाका रूपमा बचत" }).closest("form");
    expect(form instanceof HTMLFormElement && form.checkValidity()).toBe(false);
    fireEvent.change(screen.getByLabelText(/शीर्षक/), { target: { value: "काल्पनिक परीक्षण शीर्षक" } });
    fireEvent.change(screen.getByLabelText(/सारांश/), {
      target: { value: "परीक्षणका लागि काल्पनिक सारांश" },
    });
    fireEvent.change(screen.getByLabelText(/लेख सामग्री/), { target: { value: "काल्पनिक सामग्री" } });
    expect(screen.getByRole("status")).toHaveTextContent("रिफ्रेस गर्दा मेटिनेछन्");
    expect(form instanceof HTMLFormElement && form.checkValidity()).toBe(true);
  });

  it("validates the schedule control and shows a non-persistent save state", () => {
    render(
      <NewsroomPrototypeProvider>
        <StoryEditorForm />
      </NewsroomPrototypeProvider>,
    );
    fireEvent.change(screen.getByLabelText(/शीर्षक/), { target: { value: "काल्पनिक परीक्षण शीर्षक" } });
    fireEvent.change(screen.getByLabelText(/सारांश/), {
      target: { value: "परीक्षणका लागि काल्पनिक सारांश" },
    });
    fireEvent.change(screen.getByLabelText(/लेख सामग्री/), { target: { value: "काल्पनिक सामग्री" } });
    fireEvent.click(screen.getByRole("button", { name: "समय तोक्नुहोस्" }));
    expect(screen.getByRole("alert")).toHaveTextContent("मिति र समय छान्नुहोस्");
    fireEvent.change(screen.getByLabelText("प्रकाशन मिति/समय (ऐच्छिक)"), {
      target: { value: "2026-12-31T18:00" },
    });
    fireEvent.click(screen.getByRole("button", { name: "समय तोक्नुहोस्" }));
    expect(screen.getByRole("status")).toHaveTextContent("डाटाबेसमा बचत वा प्रकाशन भएको छैन");
  });
});

describe("review, corrections, and media prototypes", () => {
  it("updates a review decision only in the current page state", () => {
    render(
      <NewsroomPrototypeProvider>
        <ReviewQueue stories={newsroomStories.filter((story) => story.status === "in_review")} />
      </NewsroomPrototypeProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "स्वीकृति नमुना" }));
    expect(screen.getByRole("status")).toHaveTextContent("समाचार प्रकाशित भएको छैन");
    expect(screen.getByText("स्वीकृत (नमुना)")).toBeInTheDocument();
  });

  it("carries one draft through review approval into preview for the current session", () => {
    render(
      <NewsroomPrototypeProvider>
        <StoryEditorForm />
        <ReviewQueue stories={[]} />
        <NewsroomPreview id="new-draft" />
      </NewsroomPrototypeProvider>,
    );
    fireEvent.change(screen.getByLabelText(/शीर्षक/), { target: { value: "सत्रको काल्पनिक समाचार" } });
    fireEvent.change(screen.getByLabelText(/सारांश/), { target: { value: "सत्रको नमुना सारांश" } });
    fireEvent.change(screen.getByLabelText(/लेख सामग्री/), {
      target: { value: "सत्रको नमुना सामग्री" },
    });
    fireEvent.click(screen.getByRole("button", { name: "समीक्षामा पठाउनुहोस्" }));
    expect(screen.getAllByRole("heading", { name: "सत्रको काल्पनिक समाचार" })).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "स्वीकृति नमुना" }));
    expect(screen.getAllByText("स्वीकृत (नमुना)")).toHaveLength(2);
    expect(
      screen
        .getAllByRole("status")
        .map((status) => status.textContent)
        .join(" "),
    ).toContain("समाचार प्रकाशित भएको छैन");
    expect(
      screen.getByText(
        "यो पूर्वावलोकन हालको ब्राउजर सत्रको अस्थायी मस्यौदाबाट बनाइएको हो। रिफ्रेस गर्दा मस्यौदा मेटिन्छ। यसले सामग्री सार्वजनिक गर्दैन।",
      ),
    ).toBeInTheDocument();
  });

  it("requires both a correction note and reason before showing a demo record", () => {
    render(<CorrectionForm />);
    const button = screen.getByRole("button", { name: "सुधार नमुना अभिलेख गर्नुहोस्" });
    const form = button.closest("form");
    expect(form instanceof HTMLFormElement && form.checkValidity()).toBe(false);
    fireEvent.change(screen.getByLabelText(/सुधार सूचना/), { target: { value: "नमुना सुधार" } });
    fireEvent.change(screen.getByLabelText(/सुधारको कारण/), { target: { value: "नमुना कारण" } });
    fireEvent.click(button);
    expect(screen.getByRole("status")).toHaveTextContent("कुनै सार्वजनिक समाचार परिवर्तन भएको छैन");
  });

  it("keeps selected media local and reports that no upload occurred", () => {
    render(<MediaPicker />);
    const file = new File(["fixture"], "fictional-photo.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText("तस्बिर वा भिडियो छान्नुहोस्"), {
      target: { files: [file] },
    });
    expect(screen.getByRole("status")).toHaveTextContent("फाइल अपलोड गरिएको छैन");
    fireEvent.click(screen.getByRole("button", { name: "अपलोड नमुना" }));
    expect(screen.getAllByRole("status")[1]).toHaveTextContent("कुनै फाइल अपलोड वा बाहिर पठाइएको छैन");
  });
});
