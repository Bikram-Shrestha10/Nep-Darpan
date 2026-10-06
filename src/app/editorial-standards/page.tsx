import type { Metadata } from "next";
import { StaticInformationPlaceholder } from "@/components/content/static-information-placeholder";

export const metadata: Metadata = { title: "सम्पादकीय मापदण्ड" };

export default function EditorialStandardsPage() {
  return (
    <StaticInformationPlaceholder
      title="सम्पादकीय मापदण्ड"
      description="स्रोत प्रमाणीकरण, तथ्य-जाँच, जोखिम समीक्षा र सम्पादकीय स्वीकृतिसम्बन्धी आधिकारिक मापदण्ड सम्पादकीय टोलीको समीक्षा र स्वीकृतिपछि मात्र प्रकाशित गरिनेछ।"
    />
  );
}
