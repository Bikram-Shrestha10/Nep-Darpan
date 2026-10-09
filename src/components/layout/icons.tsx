"use client";

import type { SVGProps } from "react";
import { useSitePreferences } from "@/components/layout/site-preferences";
type IconProps = SVGProps<SVGSVGElement>;
const shared = {
  "aria-hidden": true,
  fill: "none",
  height: 20,
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.8,
  viewBox: "0 0 24 24",
  width: 20,
};
function useIconTitle(ne: string, en: string) {
  const { language } = useSitePreferences();
  return language === "en" ? en : ne;
}

export function MenuIcon(props: IconProps) {
  const title = useIconTitle("मेनु", "Menu");
  return (
    <svg {...shared} {...props}>
      <title>{title}</title>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
export function SearchIcon(props: IconProps) {
  const title = useIconTitle("खोज", "Search");
  return (
    <svg {...shared} {...props}>
      <title>{title}</title>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}
export function BellIcon(props: IconProps) {
  const title = useIconTitle("सूचना", "Notifications");
  return (
    <svg {...shared} {...props}>
      <title>{title}</title>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />
    </svg>
  );
}
export function HomeIcon(props: IconProps) {
  const title = useIconTitle("गृहपृष्ठ", "Home");
  return (
    <svg {...shared} {...props}>
      <title>{title}</title>
      <path d="m3.5 10 8.5-7 8.5 7v10h-6v-6h-5v6h-6Z" />
    </svg>
  );
}
export function LatestIcon(props: IconProps) {
  const title = useIconTitle("ताजा", "Latest");
  return (
    <svg {...shared} {...props}>
      <title>{title}</title>
      <path d="M12 3a9 9 0 1 1-7.2 3.6M3 3v5h5M12 7v5l3 2" />
    </svg>
  );
}
export function HubIcon(props: IconProps) {
  const title = useIconTitle("जानकारी", "Information");
  return (
    <svg {...shared} {...props}>
      <title>{title}</title>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22Z" />
    </svg>
  );
}
export function CalendarIcon(props: IconProps) {
  const title = useIconTitle("पात्रो", "Calendar");
  return (
    <svg {...shared} {...props} height={15} width={15} strokeWidth={1.7}>
      <title>{title}</title>
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
      <path d="M7.5 3v4M16.5 3v4M3.5 9h17" />
    </svg>
  );
}
export function SunIcon(props: IconProps) {
  const title = useIconTitle("सूर्य", "Sun");
  return (
    <svg {...shared} {...props} height={15} width={15} strokeWidth={1.7}>
      <title>{title}</title>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
    </svg>
  );
}
export function MoonIcon(props: IconProps) {
  const title = useIconTitle("चन्द्रमा", "Moon");
  return (
    <svg {...shared} {...props} height={19} width={19} strokeWidth={1.8}>
      <title>{title}</title>
      <path d="M20.3 15.4A8.8 8.8 0 0 1 8.6 3.7a9 9 0 1 0 11.7 11.7Z" />
    </svg>
  );
}
