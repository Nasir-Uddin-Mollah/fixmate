"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheckIcon,
  Clock3Icon,
  PlusCircleIcon,
  RefreshCwIcon,
  WrenchIcon,
} from "lucide-react";
import ActivityChart from "@/components/dashboard/activity-chart";
import PageHeader from "@/components/dashboard/page-header";
import StatCard from "@/components/dashboard/stat-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getTechnicianBookings, type Booking } from "@/lib/api/bookings";
import { getMyServices, type Service } from "@/lib/api/services";

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

const TechnicianOverview = ({ name }: { name: string }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [myServices, myBookings] = await Promise.all([
        getMyServices(),
        getTechnicianBookings(),
      ]);
      setServices(myServices);
      setBookings(myBookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  const approved = services.filter((s) => s.approvalStatus === "approved").length;
  const pendingRequests = bookings.filter((b) => b.status === "requested").length;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${name.split(" ")[0]}`}
        description="Manage your repair services and incoming requests."
      >
        <Link
          href="/dashboard/technician/add-service"
          className={buttonVariants({ className: "bg-blue-600 hover:bg-blue-700" })}
        >
          <PlusCircleIcon className="size-4" />
          Add Service
        </Link>
      </PageHeader>

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
                <StatCard label="Total Services" value={services.length} icon={WrenchIcon} tone="blue" />
                <StatCard label="Approved Services" value={approved} icon={BadgeCheckIcon} tone="emerald" />
                <StatCard label="Pending Requests" value={pendingRequests} icon={Clock3Icon} tone="amber" />
              </>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground">Request activity</h3>
              <p className="text-sm text-muted-foreground">Incoming requests in the last 7 days</p>
            </div>
            {loading ? (
              <Skeleton className="h-56 w-full rounded-lg" />
            ) : (
              <ActivityChart data={last7Days(bookings)} color="#059669" />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TechnicianOverview;
