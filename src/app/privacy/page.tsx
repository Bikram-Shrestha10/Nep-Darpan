import type { Metadata } from "next";
import { StaticInformationPlaceholder } from "@/components/content/static-information-placeholder";

export const metadata: Metadata = { title: "गोपनीयता" };

export default function PrivacyPage() {
  return (
    <StaticInformationPlaceholder
      title="गोपनीयता"
      description="उत्पादनमा लागू हुने गोपनीयता, डेटा उपयोग र अवधारणसम्बन्धी सूचना कानुनी तथा उत्पादन समीक्षा गरी स्वीकृत भएपछि थपिनेछ। यस पूर्वावलोकनमा व्यक्तिगत विवरण नपठाउनुहोस्।"
    />
  );
}
