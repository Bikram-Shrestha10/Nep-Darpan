import type { SVGProps } from "react";
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
export function MenuIcon(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <title>मेनु</title>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
export function SearchIcon(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <title>खोज</title>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}
export function HomeIcon(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <title>गृहपृष्ठ</title>
      <path d="m3.5 10 8.5-7 8.5 7v10h-6v-6h-5v6h-6Z" />
    </svg>
  );
}
export function LatestIcon(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <title>ताजा</title>
      <path d="M12 3a9 9 0 1 1-7.2 3.6M3 3v5h5M12 7v5l3 2" />
    </svg>
  );
}
export function HubIcon(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <title>जानकारी</title>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22Z" />
    </svg>
  );
}
