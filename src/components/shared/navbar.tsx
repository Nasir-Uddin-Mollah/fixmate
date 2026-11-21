"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  WrenchIcon,
  MenuIcon,
  XIcon,
  LayoutDashboardIcon,
  UserIcon,
  LogOutIcon,
  ChevronDownIcon,
} from "lucide-react";
import { cn } from "cn";
import { useSession, signOut } from "@/app/lib/auth-client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// ─── Types & Config ───────────────────────────────────────────────────────────

type Role = "customer" | "technician" | "admin";

const ROLE_LABELS: Record<Role, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

const ROLE_COLORS: Record<Role, string> = {
  customer: "bg-blue-100 text-blue-700",
  technician: "bg-emerald-100 text-emerald-700",
  admin: "bg-purple-100 text-purple-700",
};

const DASHBOARD_ROUTES: Record<Role, string> = {
  customer: "/dashboard/customer",
  technician: "/dashboard/technician",
  admin: "/dashboard/admin",
};

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

// ─── Navbar Component ─────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user;
  const role = (user?.role as Role) ?? "customer";
  const dashboardHref = DASHBOARD_ROUTES[role] ?? "/dashboard/customer";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:opacity-80 transition-opacity"
        >
          <span className="flex items-center justify-center rounded-lg bg-blue-600 p-1.5 text-white">
            <WrenchIcon className="size-5" />
          </span>
          <span>
            Fix<span className="text-blue-600">Mate</span>
          </span>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive =
              pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                )}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-blue-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Desktop Right Side ── */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <span className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer">
                  <Avatar size="default">
                    <AvatarImage
                      src={user.image ?? ""}
                      alt={user.name ?? "User"}
                    />
                    <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDownIcon className="size-4 text-gray-500" />
                </span>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                {/* User info */}
                <DropdownMenuLabel className="pb-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                  <span
                    className={cn(
                      "mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      ROLE_COLORS[role],
                    )}
                  >
                    {ROLE_LABELS[role]}
                  </span>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => router.push(dashboardHref)}>
                  <LayoutDashboardIcon className="size-4" />
                  Dashboard
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/profile")}
                >
                  <UserIcon className="size-4" />
                  Update Profile
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                  <LogOutIcon className="size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="inline-flex h-7 items-center rounded-lg px-2.5 text-[0.8rem] font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex h-7 items-center rounded-lg bg-blue-600 px-2.5 text-[0.8rem] font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          className="flex md:hidden items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <XIcon className="size-5" />
          ) : (
            <MenuIcon className="size-5" />
          )}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-1">
          {/* Nav Links */}
          {NAV_LINKS.map(({ label, href }) => {
            const isActive =
              pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                {label}
              </Link>
            );
          })}

          <div className="border-t border-gray-200 pt-3 mt-3">
            {user ? (
              <div className="space-y-1">
                {/* User card */}
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                  <Avatar size="default">
                    <AvatarImage
                      src={user.image ?? ""}
                      alt={user.name ?? "User"}
                    />
                    <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.name}
                    </p>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        ROLE_COLORS[role],
                      )}
                    >
                      {ROLE_LABELS[role]}
                    </span>
                  </div>
                </div>

                <Link
                  href={dashboardHref}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LayoutDashboardIcon className="size-4" />
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <UserIcon className="size-4" />
                  Update Profile
                </Link>

                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleSignOut();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOutIcon className="size-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
