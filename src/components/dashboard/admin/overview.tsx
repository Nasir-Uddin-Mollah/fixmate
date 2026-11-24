"use client";

import { useCallback, useEffect, useState } from "react";
import { BadgeCheckIcon, ClipboardListIcon, RefreshCwIcon, UsersIcon, WrenchIcon } from "lucide-react";
import ActivityChart from "@/components/dashboard/activity-chart";
import PageHeader from "@/components/dashboard/page-header";
import StatCard from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminBookings, type Booking } from "@/lib/api/bookings";
import { getAdminServices, type Service } from "@/lib/api/services";
import { getAdminUsers, type AdminUser } from "@/lib/api/users";

type DayPoint = { label: string; value: number };

const last7Days = (bookings: Booking[]): DayPoint[] => {
  const days: DayPoint[] = [];

  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);

    const label = day.toLocaleDateString("en-US", { weekday: "short" });
    const value = bookings.filter((booking) => {
      const raw = booking.createdAt ?? booking.preferredDate;
      if (!raw) return false;
      const created = new Date(raw);
      return (
        created.getFullYear() === day.getFullYear() &&
        created.getMonth() === day.getMonth() &&
        created.getDate() === day.getDate()
      );
    }).length;

    days.push({ label, value });
  }

  return days;
};

const AdminOverview = ({ name }: { name: string }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [allUsers, allServices, allBookings] = await Promise.all([
        getAdminUsers(),
        getAdminServices(),
        getAdminBookings(),
      ]);
      setUsers(allUsers);
      setServices(allServices);
      setBookings(allBookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  const technicians = users.filter((u) => u.role === "technician").length;
  const pendingServices = services.filter((s) => s.approvalStatus === "pending").length;

  return (
    <div>
      <PageHeader
        title="Admin Overview"
        description={`Hello ${name.split(" ")[0]}, here is what is happening on FixMate.`}
      />

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-card p-8 text-center">
          <p className="text-sm font-medium text-destructive">{error}</p>
          <Button className="mt-4" onClick={() => void load()} variant="outline">
            <RefreshCwIcon className="size-4" />
            Try again
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              [0, 1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)
            ) : (
              <>
                <StatCard label="Total Users" value={users.length} icon={UsersIcon} tone="blue" />
                <StatCard label="Total Technicians" value={technicians} icon={WrenchIcon} tone="emerald" />
                <StatCard label="Pending Services" value={pendingServices} icon={BadgeCheckIcon} tone="amber" />
              </>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground">Platform activity</h3>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <ClipboardListIcon className="size-4" />
                Bookings in the last 7 days
              </p>
            </div>
            {loading ? (
              <Skeleton className="h-56 w-full rounded-lg" />
            ) : (
              <ActivityChart data={last7Days(bookings)} color="#7c3aed" />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOverview;
