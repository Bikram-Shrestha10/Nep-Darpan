import Link from "next/link";
export interface BreadcrumbItem {
  href?: string;
  label: string;
}
export function Breadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  return (
    <nav aria-label="ब्रेडक्रम्ब">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--ink-soft)]">
        {items.map((item, index) => (
          <li className="flex items-center gap-2" key={item.href ?? item.label}>
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link className="hover:text-[var(--ink)]" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
