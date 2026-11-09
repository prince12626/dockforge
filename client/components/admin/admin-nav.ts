import {
  Activity,
  LayoutDashboard,
  ScrollText,
  Server,
  ShieldAlert,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const ADMIN_BASE_PATH = "/admin";

export const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "VPS Instances", href: "/admin/vps", icon: Server },
  { label: "Abuse & Security", href: "/admin/security", icon: ShieldAlert },
  { label: "System Monitoring", href: "/admin/monitoring", icon: Activity },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
] as const;

export function isNavItemActive(pathname: string, item: AdminNavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export interface AdminCrumb {
  label: string;
  href?: string;
}

export interface AdminPageMeta {
  title: string;
  crumbs: AdminCrumb[];
}

function humanize(segment: string): string {
  const text = decodeURIComponent(segment).replace(/[-_]+/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Derives page title + breadcrumbs from the current pathname and the nav
 * config, so adding a page only requires editing ADMIN_NAV_ITEMS.
 */
export function getAdminPageMeta(pathname: string): AdminPageMeta {
  const root: AdminCrumb = { label: "Admin", href: ADMIN_BASE_PATH };

  const section = ADMIN_NAV_ITEMS.find(
    (item) => !item.exact && isNavItemActive(pathname, item),
  );

  if (!section) {
    return {
      title: "Overview",
      crumbs: [{ label: "Admin" }, { label: "Overview" }],
    };
  }

  const rest = pathname.slice(section.href.length).split("/").filter(Boolean);

  if (rest.length === 0) {
    return { title: section.label, crumbs: [root, { label: section.label }] };
  }

  const crumbs: AdminCrumb[] = [
    root,
    { label: section.label, href: section.href },
  ];
  let href: string = section.href;
  rest.forEach((segment, index) => {
    href += `/${segment}`;
    const isLast = index === rest.length - 1;
    crumbs.push({ label: humanize(segment), href: isLast ? undefined : href });
  });

  return { title: crumbs[crumbs.length - 1].label, crumbs };
}
