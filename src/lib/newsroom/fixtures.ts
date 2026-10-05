export type WorkflowStatus =
  | "draft"
  | "in_review"
  | "scheduled"
  | "published"
  | "approved_demo"
  | "returned_demo";

export interface NewsroomStoryFixture {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  updatedAt: string;
  status: WorkflowStatus;
  scheduledAt?: string;
  body: string;
}

export const newsroomStories: NewsroomStoryFixture[] = [
  {
    id: "draft-demo",
    title: "काल्पनिक नमुना: नगर सेवा सूचना एउटै ठाउँमा",
    summary: "समाचार लेख सम्पादन गर्ने पृष्ठको लागि काल्पनिक सारांश।",
    category: "राजनीति",
    author: "नमुना संवाददाता",
    updatedAt: "2026-10-05T08:00:00.000Z",
    status: "draft",
    body: "यो सम्पूर्ण रूपमा काल्पनिक डेमो सामग्री हो। यसले कुनै वास्तविक नगर, सेवा वा घटनाको विवरण प्रस्तुत गर्दैन।",
  },
  {
    id: "review-demo",
    title: "काल्पनिक नमुना: सामुदायिक पठन कक्षको प्रस्ताव",
    summary: "सम्पादकीय समीक्षा सूची र टिप्पणी कार्यप्रवाह परीक्षण।",
    category: "समाज",
    author: "नमुना संवाददाता",
    updatedAt: "2026-10-04T12:00:00.000Z",
    status: "in_review",
    body: "प्रकाशनअघि पुष्टि, स्रोत परीक्षण र सम्पादकीय समीक्षा आवश्यक हुन्छ। यहाँको सामग्री भने परीक्षण प्रयोजनको कल्पित पाठ मात्र हो।",
  },
  {
    id: "scheduled-demo",
    title: "काल्पनिक नमुना: डिजिटल सीप कार्यशाला",
    summary: "समय तोकिएको प्रकाशन स्थितिको दृश्य नमुना।",
    category: "प्रविधि",
    author: "नमुना डेस्क",
    updatedAt: "2026-10-03T09:00:00.000Z",
    status: "scheduled",
    body: "समय तोकिएको प्रकाशनको नक्कली पूर्वावलोकन। यो सामग्री कहिल्यै सार्वजनिक गर्न निर्धारित छैन।",
  },
  {
    id: "published-demo",
    title: "काल्पनिक नमुना: साना पसलमा डिजिटल भुक्तानी",
    summary: "प्रकाशित स्थितिको प्रदर्शन गर्न तयार गरिएको डेमो।",
    category: "अर्थतन्त्र",
    author: "नमुना डेस्क",
    updatedAt: "2026-10-02T09:00:00.000Z",
    status: "published",
    body: "यो सार्वजनिक वास्तविक समाचार होइन। प्रकाशित अवस्थाको डिजाइन नमुना मात्र हो।",
  },
];

export const workflowStatusLabels: Record<WorkflowStatus, string> = {
  draft: "मस्यौदा",
  in_review: "समीक्षामा",
  scheduled: "समय तोकिएको",
  published: "प्रकाशित (नमुना)",
  approved_demo: "स्वीकृत (नमुना)",
  returned_demo: "सुधारका लागि फिर्ता (नमुना)",
};

export const newsroomNotice =
  "समाचार कक्षको पूर्वावलोकन: यहाँ कुनै वास्तविक प्रमाणीकरण, अनुमति जाँच, अपलोड वा डाटाबेसमा बचत हुँदैन। फारमका परिवर्तन पृष्ठमा मात्र अस्थायी छन् र रिफ्रेस गर्दा हराउँछन्।";
