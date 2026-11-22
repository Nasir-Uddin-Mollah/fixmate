"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDaysIcon,
  MapPinIcon,
  PhoneIcon,
  RefreshCwIcon,
  UserRoundIcon,
  WrenchIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { cancelBooking, getMyBookings, type Booking } from "@/lib/api/bookings";

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

const BookingsTable = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setBookings(await getMyBookings());
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not load your bookings.";
      setError(message);
      toast.add({
        title: "Could not load bookings",
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

  const handleCancel = async () => {
    if (!cancelId) return;
    setCancelling(true);

    try {
      const updated = await cancelBooking(cancelId);
      setBookings((current) =>
        current.map((booking) =>
          booking._id === updated._id ? updated : booking,
        ),
      );
      setCancelId(null);
      toast.add({
        title: "Booking cancelled",
        description: "Your request has been cancelled.",
        type: "success",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not cancel this booking.";
      toast.add({ title: "Cancellation failed", description: message, type: "error" });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((row) => (
          <div key={row} className="rounded-xl border border-slate-200 bg-white p-5">
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
      <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
        <p className="text-sm font-medium text-red-600">{error}</p>
        <Button className="mt-4" onClick={() => void load()} variant="outline">
          <RefreshCwIcon className="size-4" />
          Try again
        </Button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <WrenchIcon className="mx-auto size-10 text-slate-300" />
        <h3 className="mt-4 text-base font-semibold text-slate-900">No bookings yet</h3>
        <p className="mt-2 text-sm text-slate-500">
          Find a service you need and send your first repair request.
        </p>
        <Link href="/services" className="mt-5 inline-flex">
          <Button className="bg-blue-600 hover:bg-blue-700">Browse Services</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
        </p>
        <Button variant="outline" size="sm" onClick={() => void load()}>
          <RefreshCwIcon className="size-4" />
          Refresh
        </Button>
      </div>

      {bookings.map((booking) => {
        const currentStep = STEPS.findIndex((step) => step.key === booking.status);

        return (
          <article
            key={booking._id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
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
                  <h3 className="truncate font-semibold text-slate-900">
                    {booking.serviceTitle}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {booking.category} · by {booking.technicianName}
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

            <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <Detail icon={<CalendarDaysIcon className="size-4" />}>
                Preferred: {formatDate(booking.preferredDate)}
              </Detail>
              <Detail icon={<MapPinIcon className="size-4" />}>
                {booking.address}
              </Detail>
              <Detail icon={<PhoneIcon className="size-4" />}>
                {booking.customerPhone}
              </Detail>
              <Detail icon={<UserRoundIcon className="size-4" />}>
                Base: ${booking.basePrice} · Final:{" "}
                {booking.finalAmount ? `$${booking.finalAmount}` : "after inspection"}
              </Detail>
            </div>

            {booking.problemDescription && (
              <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Problem: </span>
                {booking.problemDescription}
              </p>
            )}

            {/* Job pipeline. Steps before the current one are highlighted. */}
            <div className="mt-5 flex flex-wrap gap-2">
              {STEPS.map((step, index) => (
                <span
                  key={step.key}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    index <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
              <Link
                href={`/services/${booking.serviceId}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View service →
              </Link>
              {(booking.status === "requested" || booking.status === "accepted") && (
                <button
                  type="button"
                  onClick={() => setCancelId(booking._id)}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Cancel booking
                </button>
              )}
            </div>
          </article>
        );
      })}

      <AlertDialog
        open={cancelId !== null}
        onOpenChange={(open) => {
          if (!open) setCancelId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              The technician will no longer work on this request. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Keep booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleCancel()}
              disabled={cancelling}
              className="bg-red-600 hover:bg-red-700"
            >
              {cancelling ? "Cancelling..." : "Yes, cancel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

export default BookingsTable;
