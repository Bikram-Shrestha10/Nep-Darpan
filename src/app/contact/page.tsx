import type { Metadata } from "next";
import { StaticInformationPlaceholder } from "@/components/content/static-information-placeholder";

export const metadata: Metadata = { title: "सम्पर्क" };

export default function ContactPage() {
  return (
    <StaticInformationPlaceholder
      title="सम्पर्क"
      description="सम्पादकीय वा सामान्य सोधपुछका लागि आधिकारिक इमेल र फोन विवरण जिम्मेवार टोलीले उपलब्ध गराएपछि यहाँ राखिनेछ। कुनै ठेगाना अनुमान गरेर देखाइएको छैन।"
    />
  );
}
