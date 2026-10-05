import Link from "next/link";
import { HomeIcon, HubIcon, LatestIcon, MenuIcon, SearchIcon } from "@/components/layout/icons";
const items = [
  { href: "/", label: "गृह", icon: HomeIcon },
  { href: "/latest", label: "ताजा", icon: LatestIcon },
  { href: "/information-hub", label: "जानकारी", icon: HubIcon },
  { href: "/search", label: "खोज", icon: SearchIcon },
  { href: "#site-footer", label: "थप", icon: MenuIcon },
] as const;
export function MobileNavigation() {
  return (
    <nav
      aria-label="सानो पर्दाको छिटो नेभिगेसन"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--rule-strong)] bg-[var(--paper-raised)] md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              className="flex min-h-[4.25rem] flex-col items-center justify-center gap-1 text-[0.7rem] font-bold no-underline"
              href={href}
            >
              <Icon />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
