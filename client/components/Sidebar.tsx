"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
      LayoutDashboard,
      Server,
      Settings,
      PlusSquare,
      CreditCard,
      CircleHelp,
      LogOut,
      ChevronRight,
} from "lucide-react";
import Button from "./ui/Button";

const sections = [
      {
            title: "Infrastructure",
            items: [
                  {
                        icon: LayoutDashboard,
                        name: "Overview",
                        href: "/dashboard",
                  },
                  {
                        icon: PlusSquare,
                        name: "Create VPS",
                        href: "/dashboard/vps/create",
                  },
            ],
      },
      {
            title: "Workspace",
            items: [
                  {
                        icon: CreditCard,
                        name: "Billing",
                        href: "/dashboard/billing",
                  },
                  {
                        icon: Settings,
                        name: "Settings",
                        href: "/dashboard/settings",
                  },
                  {
                        icon: CircleHelp,
                        name: "Support",
                        href: "/dashboard/support",
                  },
            ],
      },
];

export default function Sidebar() {
      const pathname = usePathname();

      return (
            <aside className="flex fixed h-screen w-80 flex-col border-r border-border bg-background">
                  {/* Logo */}

                  <div className="border-b border-border px-6 py-6">
                        <h1 className="text-3xl font-semibold tracking-tight text-white">
                              DockForge
                        </h1>

                        <p className="mt-1 text-sm text-white/50">
                              Infrastructure Platform
                        </p>
                  </div>

                  {/* Navigation */}

                  <div className="flex-1 overflow-y-auto px-4 py-6">
                        {sections.map((section) => (
                              <div key={section.title} className="mb-8">
                                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                          {section.title}
                                    </p>

                                    <div className="space-y-1">
                                          {section.items.map((item) => {
                                                const Icon = item.icon;

                                                const active =
                                                      pathname === item.href ||
                                                      (item.href !==
                                                            "/dashboard" &&
                                                            pathname.startsWith(
                                                                  item.href,
                                                            ));

                                                return (
                                                      <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            className={`group flex items-center gap-3 border px-3 py-2.5 transition-all duration-200 ${
                                                                  active
                                                                        ? "border-accent bg-white/5 text-white"
                                                                        : "border-transparent text-white/65 hover:border-border hover:bg-white/5 hover:text-white"
                                                            }`}
                                                      >
                                                            <Icon
                                                                  size={18}
                                                                  className={
                                                                        active
                                                                              ? "text-accent"
                                                                              : "text-white/45 transition group-hover:text-white"
                                                                  }
                                                            />

                                                            <span className="flex-1 text-[15px] font-medium">
                                                                  {item.name}
                                                            </span>

                                                            {active && (
                                                                  <ChevronRight
                                                                        size={
                                                                              16
                                                                        }
                                                                        className="text-accent"
                                                                  />
                                                            )}
                                                      </Link>
                                                );
                                          })}
                                    </div>
                              </div>
                        ))}
                  </div>

                  {/* Bottom */}

                  <div className="border-t border-border p-4">
                        <div className="border border-border bg-white/2 p-4">
                              <p className="font-medium text-white">Prince</p>

                              <p className="mt-1 text-sm text-white/50">
                                    Free Plan
                              </p>

                              <div className="mt-4">
                                    <div className="mb-2 flex items-center justify-between text-xs text-white/50">
                                          <span>VPS Usage</span>
                                          <span>1 / 2</span>
                                    </div>

                                    <div className="h-1.5 bg-white/10">
                                          <div className="h-full w-1/2 bg-accent" />
                                    </div>
                              </div>

                              <Button
                                    variant="secondary"
                                    size="sm"
                                    className="mt-4 w-full justify-center"
                              >
                                    Upgrade Plan
                              </Button>
                        </div>

                        <Button
                              variant="danger"
                              size="md"
                              className="mt-4 flex w-full items-center justify-center gap-2"
                        >
                              <LogOut size={17} />
                              Logout
                        </Button>
                  </div>
            </aside>
      );
}
