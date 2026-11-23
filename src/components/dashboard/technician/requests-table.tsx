"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  MapPinIcon,
  PhoneIcon,
  PlayCircleIcon,
  RefreshCwIcon,
  UserRoundIcon,
  WrenchIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import {
  getTechnicianBookings,
  updateBookingStatus,
  type Booking,
} from "@/lib/api/bookings";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "requested", label: "New" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In progress" },
  { key: "completed", label: "Completed" },
] as const;

type Filter = (typeof FILTERS)[number]["key"];

const STEPS = [
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In progress" },
  { key: "completed", label: "Completed" },
  { key: "paid", label: "Paid" },
];

const statusVariant = (status: string) => {
  if (status === "rejected" || status === "cancelled") return "destructive" as const;
  if (status === "completed" || status === "paid") return "default" as const;
  if (status === "accepted" || status === "in-progress") return "secondary" as const;
  return "outline" as const;
};

const formatDate = (value: string) =>
  value
    ? new Intl.DateTimeFormat("en-BD", { dateStyle: "medium" }).format(new Date(value))
    : "—";

const RequestsTable = () => {
  const [requests, setRequests] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setRequests(await getTechnicianBookings());
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not load your requests.";
      setError(message);
      toast.add({
        title: "Could not load requests",
        description: message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  const handleStatus = async (
    booking: Booking,
    status: string,
    finalAmount?: number,
  ) => {
    setBusyId(booking._id);

    try {
      const updated = await updateBookingStatus(booking._id, status, finalAmount);
      setRequests((current) =>
        current.map((item) => (item._id === updated._id ? updated : item)),
      );
      toast.add({
        title:
          status === "accepted"
            ? "Job accepted"
            : status === "in-progress"
              ? "Work started"
              : "Job completed",
        description: `${booking.serviceTitle} is now ${status}.`,
        type: "success",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not update this request.";
      toast.add({ title: "Update failed", description: message, type: "error" });
    } finally {
      setBusyId(null);
    }
  };

  const handleComplete = (booking: Booking) => {
    const raw = amounts[booking._id] ?? String(booking.basePrice);
    const amount = Number(raw);

    if (!Number.isFinite(amount) || amount < 0) {
      toast.add({
        title: "Invalid amount",
        description: "Enter a valid final amount.",
        type: "error",
      });
      return;
    }

    void handleStatus(booking, "completed", amount);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((row) => (
          <div key={row} className="rounded-xl border border-border bg-card p-5">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-card p-8 text-center">
        <p className="text-sm font-medium text-destructive">{error}</p>
        <Button className="mt-4" onClick={() => void load()} variant="outline">
          <RefreshCwIcon className="size-4" />
          Try again
        </Button>
      </div>
    );
  }

  const visible = requests.filter((booking) => {
    if (filter === "all") return true;
    if (filter === "completed") {
      return booking.status === "completed" || booking.status === "paid";
    }
    return booking.status === filter;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {requests.length} {requests.length === 1 ? "request" : "requests"}
        </p>
        <Button variant="outline" size="sm" onClick={() => void load()}>
          <RefreshCwIcon className="size-4" />
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ key, label }) => (
          <Button
            key={key}
            size="sm"
            variant={filter === key ? "default" : "outline"}
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <WrenchIcon className="mx-auto size-10 text-muted-foreground/50" />
          <h3 className="mt-4 text-base font-semibold text-foreground">
            {requests.length === 0 ? "No requests yet" : "Nothing in this filter"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {requests.length === 0
              ? "New customer bookings for your services will appear here."
              : "Try a different filter to see your other jobs."}
          </p>
        </div>
      )}

      {visible.map((booking) => {
        const currentStep = STEPS.findIndex((step) => step.key === booking.status);
        const busy = busyId === booking._id;

        return (
          <article
            key={booking._id}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                {booking.serviceImage && (
                  <Image
                    src={booking.serviceImage}
                    alt={booking.serviceTitle}
                    width={64}
                    height={64}
                    unoptimized
                    className="size-16 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-foreground">
                    {booking.serviceTitle}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {booking.category} · #{booking._id.slice(-6)}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <Badge variant={statusVariant(booking.status)}>{booking.status}</Badge>
                <Badge
                  variant={
                    booking.paymentStatus === "paid" ? "default" : "outline"
                  }
                >
                  {booking.paymentStatus}
                </Badge>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <Detail icon={<UserRoundIcon className="size-4" />}>
                {booking.customerName} · {booking.customerEmail}
              </Detail>
              <Detail icon={<PhoneIcon className="size-4" />}>
                {booking.customerPhone}
              </Detail>
              <Detail icon={<MapPinIcon className="size-4" />}>
                {booking.address}
              </Detail>
              <Detail icon={<CalendarDaysIcon className="size-4" />}>
                Preferred: {formatDate(booking.preferredDate)}
              </Detail>
            </div>

            {booking.problemDescription && (
              <p className="mt-3 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Problem: </span>
                {booking.problemDescription}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              {STEPS.map((step, index) => (
                <span
                  key={step.key}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    index <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <span className="mr-auto text-sm text-muted-foreground">
                Base: ${booking.basePrice} · Final:{" "}
                {booking.finalAmount ? `$${booking.finalAmount}` : "not set"}
              </span>

              {booking.status === "requested" && (
                <Button
                  size="sm"
                  disabled={busy}
                  onClick={() => void handleStatus(booking, "accepted")}
                >
                  <CheckCircle2Icon className="size-4" />
                  {busy ? "Saving..." : "Accept Job"}
                </Button>
              )}

              {booking.status === "accepted" && (
                <Button
                  size="sm"
                  disabled={busy}
                  onClick={() => void handleStatus(booking, "in-progress")}
                >
                  <PlayCircleIcon className="size-4" />
                  {busy ? "Saving..." : "Start Work"}
                </Button>
              )}

              {booking.status === "in-progress" && (
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    aria-label="Final amount"
                    className="h-8 w-28"
                    value={amounts[booking._id] ?? String(booking.basePrice)}
                    onChange={(event) =>
                      setAmounts((current) => ({
                        ...current,
                        [booking._id]: event.target.value,
                      }))
                    }
                  />
                  <Button size="sm" disabled={busy} onClick={() => handleComplete(booking)}>
                    <CheckCircle2Icon className="size-4" />
                    {busy ? "Saving..." : "Complete Job"}
                  </Button>
                </div>
              )}

              {(booking.status === "completed" || booking.status === "paid") && (
                <span className="text-sm font-medium text-muted-foreground">
                  Waiting for payment →
                </span>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
};

const Detail = ({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <p className="flex items-center gap-2">
    <span className="text-blue-500">{icon}</span>
    {children}
  </p>
);

export default RequestsTable;
