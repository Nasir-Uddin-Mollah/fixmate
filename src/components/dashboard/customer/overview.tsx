"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2Icon,
  ClipboardListIcon,
  HammerIcon,
  RefreshCwIcon,
  SearchIcon,
} from "lucide-react";
import ActivityChart from "@/components/dashboard/activity-chart";
import PageHeader from "@/components/dashboard/page-header";
import StatCard from "@/components/dashboard/stat-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyBookings, type Booking } from "@/lib/api/bookings";

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

const CustomerOverview = ({ name }: { name: string }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setBookings(await getMyBookings());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  const active = bookings.filter((b) =>
    ["requested", "accepted", "in-progress"].includes(b.status),
  ).length;
  const completed = bookings.filter((b) =>
    ["completed", "paid"].includes(b.status),
  ).length;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${name.split(" ")[0]}`}
        description="Track your repair requests and payments in one place."
      >
        <Link
          href="/services"
          className={buttonVariants({
            className: "bg-blue-600 hover:bg-blue-700",
          })}
        >
          <SearchIcon className="size-4" />
          Find a Service
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
                <StatCard
                  label="Total Requests"
                  value={bookings.length}
                  icon={ClipboardListIcon}
                  tone="blue"
                />
                <StatCard
                  label="Active Jobs"
                  value={active}
                  icon={HammerIcon}
                  tone="amber"
                />
                <StatCard
                  label="Completed Jobs"
                  value={completed}
                  icon={CheckCircle2Icon}
                  tone="emerald"
                />
              </>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground">Request activity</h3>
              <p className="text-sm text-muted-foreground">Your bookings in the last 7 days</p>
            </div>
            {loading ? (
              <Skeleton className="h-56 w-full rounded-lg" />
            ) : (
              <ActivityChart data={last7Days(bookings)} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerOverview;
