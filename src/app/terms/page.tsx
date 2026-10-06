import type { Metadata } from "next";
import { StaticInformationPlaceholder } from "@/components/content/static-information-placeholder";

export const metadata: Metadata = { title: "सेवाका सर्त" };

export default function TermsPage() {
  return (
    <StaticInformationPlaceholder
      title="सेवाका सर्त"
      description="लागू हुने सेवाका सर्त कानुनी समीक्षा र स्वीकृतिपछि यहाँ राखिनेछन्। यो पूर्वावलोकन प्रयोग वा सेवाका सर्तहरूको कानुनी सूचना होइन।"
    />
  );
}
