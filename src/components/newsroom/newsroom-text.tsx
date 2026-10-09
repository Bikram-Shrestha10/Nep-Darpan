import { LocalizedText } from "@/components/layout/site-preferences";

export function NewsroomText({ ne, en }: { ne: string; en: string }) {
  return <LocalizedText ne={ne} en={en} />;
}

const storyKinds: Record<string, { ne: string; en: string }> = {
  news: { ne: "समाचार", en: "News" },
  analysis: { ne: "विश्लेषण", en: "Analysis" },
  opinion: { ne: "विचार", en: "Opinion" },
  explainer: { ne: "व्याख्या", en: "Explainer" },
  fact_check: { ne: "तथ्य जाँच", en: "Fact check" },
  guide: { ne: "मार्गदर्शिका", en: "Guide" },
};

const storyCategories: Record<string, { ne: string; en: string }> = {
  राजनीति: { ne: "राजनीति", en: "Politics" },
  अर्थतन्त्र: { ne: "अर्थतन्त्र", en: "Economy" },
  समाज: { ne: "समाज", en: "Society" },
  विश्व: { ne: "विश्व", en: "World" },
  प्रविधि: { ne: "प्रविधि", en: "Technology" },
  विचार: { ne: "विचार", en: "Opinion" },
};

export function NewsroomStoryKind({ value }: { value: string }) {
  const copy = storyKinds[value] ?? { ne: value, en: value };
  return <NewsroomText {...copy} />;
}

export function NewsroomCategory({ value }: { value: string }) {
  const copy = storyCategories[value] ?? { ne: value, en: value };
  return <NewsroomText {...copy} />;
}
