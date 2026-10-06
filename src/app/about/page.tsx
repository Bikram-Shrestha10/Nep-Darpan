import type { Metadata } from "next";
import { StaticInformationPlaceholder } from "@/components/content/static-information-placeholder";

export const metadata: Metadata = { title: "हाम्रो बारेमा" };

export default function AboutPage() {
  return (
    <StaticInformationPlaceholder
      title="हाम्रो बारेमा"
      description="नेप दर्पण सञ्चालन गर्ने संस्था, सम्पादकीय टोली र स्वामित्वबारे पुष्टि गरिएका विवरण यस पूर्वावलोकनमा थपिएका छैनन्।"
    />
  );
}
