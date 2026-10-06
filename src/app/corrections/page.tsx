import type { Metadata } from "next";
import { StaticInformationPlaceholder } from "@/components/content/static-information-placeholder";

export const metadata: Metadata = { title: "सुधार" };

export default function CorrectionsPage() {
  return (
    <StaticInformationPlaceholder
      title="सुधार"
      description="आधिकारिक सुधार नीति र पाठकले सुधार सूचित गर्ने सम्पर्क विधि सम्पादकीय टोलीको स्वीकृतिपछि थपिनेछ। यस पूर्वावलोकनमा देखिने लेख र सुधार सबै काल्पनिक नमुना हुन्।"
      relatedLink={{ href: "/ne-NP/news/demo-story", label: "काल्पनिक सुधार नमुना हेर्नुहोस्" }}
    />
  );
}
