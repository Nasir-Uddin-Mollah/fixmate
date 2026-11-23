"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCwIcon, SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { getAdminBookings, type Booking } from "@/lib/api/bookings";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In progress" },
  { key: "completed", label: "Completed" },
  { key: "paid", label: "Paid" },
  { key: "cancelled", label: "Cancelled" },
] as const;

type Filter = (typeof FILTERS)[number]["key"];

const statusVariant = (status: string) => {
  if (status === "rejected" || status === "cancelled") return "destructive" as const;
  if (status === "completed" || status === "paid") return "default" as const;
  if (status === "accepted" || status === "in-progress") return "secondary" as const;
  return "outline" as const;
};

const formatDate = (value: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-BD", { dateStyle: "medium" }).format(date);
};

const BookingsTable = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setBookings(await getAdminBookings());
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not load bookings.";
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

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <Skeleton className="h-5 w-44" />
        <div className="mt-5 space-y-3">
          {[0, 1, 2].map((row) => (
            <Skeleton key={row} className="h-14 w-full" />
          ))}
        </div>
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

  const normalizedQuery = query.trim().toLowerCase();
  const visible = bookings.filter((booking) => {
    const matchesFilter = filter === "all" || booking.status === filter;
    const matchesQuery =
      !normalizedQuery ||
      booking.serviceTitle.toLowerCase().includes(normalizedQuery) ||
      booking.customerName.toLowerCase().includes(normalizedQuery) ||
      booking.customerEmail.toLowerCase().includes(normalizedQuery) ||
      booking.technicianName.toLowerCase().includes(normalizedQuery);

    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {visible.length} of {bookings.length}{" "}
          {bookings.length === 1 ? "booking" : "bookings"}
        </p>

        <div className="flex w-full gap-2 sm:w-auto">
          <div className="relative w-full sm:w-72">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search service, customer, technician..."
              className="pl-9"
              aria-label="Search bookings"
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => void load()} aria-label="Refresh">
            <RefreshCwIcon className="size-4" />
          </Button>
        </div>
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

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {visible.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="text-base font-semibold text-foreground">
              {bookings.length === 0 ? "No bookings yet" : "No matching bookings"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {bookings.length === 0
                ? "Customer booking requests will appear here."
                : "Try a different filter or search term."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Preferred date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>
                    <p className="font-medium text-foreground">{booking.serviceTitle}</p>
                    <p className="text-xs text-muted-foreground">{booking.category}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-foreground">{booking.customerName}</p>
                    <p className="text-xs text-muted-foreground">{booking.customerEmail}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-foreground">{booking.technicianName}</p>
                    <p className="text-xs text-muted-foreground">{booking.technicianEmail}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(booking.preferredDate)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(booking.status)}>{booking.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={booking.paymentStatus === "paid" ? "default" : "outline"}>
                      {booking.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium text-foreground">
                    {booking.finalAmount ? `$${booking.finalAmount}` : `$${booking.basePrice}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default BookingsTable;
