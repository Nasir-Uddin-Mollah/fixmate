"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "cn";
import {
  BadgeCheckIcon,
  ClipboardListIcon,
  CreditCardIcon,
  HouseIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  PlusCircleIcon,
  UserRoundIcon,
  UsersIcon,
  WrenchIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "@/app/lib/auth-client";
import ModeToggle from "@/components/shared/mode-toggle";
import { toast } from "@/components/ui/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { DashboardUser, Role } from "@/lib/dashboard-auth";

type NavItem = { label: string; href: string; icon: LucideIcon };

const NAV_ITEMS: Record<Role, NavItem[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboardIcon },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: ClipboardListIcon },
    { label: "Payment History", href: "/dashboard/customer/payments", icon: CreditCardIcon },
    { label: "Update Profile", href: "/dashboard/profile", icon: UserRoundIcon },
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician", icon: LayoutDashboardIcon },
    { label: "Add Service", href: "/dashboard/technician/add-service", icon: PlusCircleIcon },
    { label: "My Services", href: "/dashboard/technician/my-services", icon: WrenchIcon },
    { label: "Manage Requests", href: "/dashboard/technician/requests", icon: InboxIcon },
    { label: "Update Profile", href: "/dashboard/profile", icon: UserRoundIcon },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboardIcon },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: UsersIcon },
    { label: "Service Approval", href: "/dashboard/admin/services", icon: BadgeCheckIcon },
    { label: "All Bookings", href: "/dashboard/admin/bookings", icon: ClipboardListIcon },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCardIcon },
    { label: "Update Profile", href: "/dashboard/profile", icon: UserRoundIcon },
  ],
};

const ROLE_BADGE: Record<Role, string> = {
  customer: "bg-blue-500/15 text-blue-300 ring-blue-400/30",
  technician: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
  admin: "bg-purple-500/15 text-purple-300 ring-purple-400/30",
};

const ROLE_LABEL: Record<Role, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

const DashboardShell = ({
  user,
  children,
}: {
  user: DashboardUser;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const items = NAV_ITEMS[user.role];
  const basePath = `/dashboard/${user.role}`;
  const current =
    items.find(
      (item) =>
        pathname === item.href ||
        (item.href !== basePath && item.href !== "/dashboard/profile" &&
          pathname.startsWith(`${item.href}/`)),
    ) ?? items[0];

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    toast.add({
      title: "Signed out",
      description: "You have been signed out successfully.",
      type: "success",
    });
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-950 text-slate-300 transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
            <span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <WrenchIcon className="size-4" />
            </span>
            <span>
              Fix<span className="text-blue-400">Mate</span>
            </span>
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <div className="px-5 pt-5 pb-2">
          <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
            Workspace
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {items.map(({ label, href, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== basePath &&
                href !== "/dashboard/profile" &&
                pathname.startsWith(`${href}/`));

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="size-4.5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-white/5 p-2.5">
            <Avatar size="default">
              <AvatarImage src={user.image ?? ""} alt={user.name} />
              <AvatarFallback className="bg-blue-600 text-xs font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user.name}</p>
              <span
                className={cn(
                  "mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset",
                  ROLE_BADGE[user.role],
                )}
              >
                {ROLE_LABEL[user.role]}
              </span>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
          >
            <MenuIcon className="size-5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-muted-foreground">
              FixMate Dashboard
            </p>
            <h1 className="truncate text-base font-bold text-foreground sm:text-lg">
              {current.label}
            </h1>
          </div>

          <ModeToggle />

          <Link
            href="/"
            className="hidden items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
          >
            <HouseIcon className="size-4" />
            Back to Home
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOutIcon className="size-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardShell;
