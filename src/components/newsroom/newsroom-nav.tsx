import Link from "next/link";

const links = [
  ["ड्यासबोर्ड", "/newsroom"],
  ["समाचार", "/newsroom/stories"],
  ["समीक्षा", "/newsroom/review"],
  ["मिडिया", "/newsroom/media"],
];

export function NewsroomNav() {
  return (
    <nav
      aria-label="समाचार कक्ष नेभिगेसन"
      className="border-b border-[var(--rule-strong)] bg-[var(--paper-muted)]"
    >
      <ul className="page-shell flex flex-wrap gap-x-6 gap-y-1 py-3 text-sm font-bold">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link className="inline-block min-h-8 py-1 hover:underline" href={href}>
              {label}
            </Link>
          </li>
        ))}
        <li className="ml-auto">
          <Link className="inline-block min-h-8 py-1" href="/newsroom/sign-in">
            साइन इन नमुना
          </Link>
        </li>
      </ul>
    </nav>
  );
}
