"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2Icon, RefreshCwIcon, XCircleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  getAdminServices,
  updateServiceApproval,
  type Service,
} from "@/lib/api/services";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
] as const;

type Filter = (typeof FILTERS)[number]["key"];

const PRIORITY: Record<string, number> = { pending: 0, approved: 1, rejected: 2 };

const sortPendingFirst = (items: Service[]) =>
  [...items].sort((a, b) => {
    const byStatus =
      (PRIORITY[a.approvalStatus] ?? 3) - (PRIORITY[b.approvalStatus] ?? 3);
    return (
      byStatus ||
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

const approvalVariant = (status: Service["approvalStatus"]) => {
  if (status === "approved") return "default" as const;
  if (status === "rejected") return "destructive" as const;
  return "secondary" as const;
};

const formatDate = (value: string) =>
  value
    ? new Intl.DateTimeFormat("en-BD", { dateStyle: "medium" }).format(
        new Date(value),
      )
    : "—";

const AdminServicesTable = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setServices(sortPendingFirst(await getAdminServices()));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not load submitted services.";
      setError(message);
      toast.add({
        title: "Could not load submissions",
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

  const handleApproval = async (service: Service, status: "approved" | "rejected") => {
    setBusyId(service._id);

    try {
      const updated = await updateServiceApproval(service._id, status);
      setServices((current) =>
        sortPendingFirst(
          current.map((item) => (item._id === updated._id ? updated : item)),
        ),
      );
      toast.add({
        title: status === "approved" ? "Service approved" : "Service rejected",
        description: `${service.title} is now ${status}.`,
        type: "success",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not update this service.";
      toast.add({ title: "Update failed", description: message, type: "error" });
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <Skeleton className="h-5 w-44" />
        <div className="mt-5 space-y-3">
          {[0, 1, 2].map((row) => (
            <Skeleton key={row} className="h-16 w-full" />
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

  const visible = services.filter((service) =>
    filter === "all" ? true : service.approvalStatus === filter,
  );
  const pendingCount = services.filter((s) => s.approvalStatus === "pending").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {services.length} total
          {pendingCount > 0 && (
            <span className="ml-2 font-medium text-amber-600 dark:text-amber-400">
              · {pendingCount} pending
            </span>
          )}
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

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {visible.length === 0 ? (
          <div className="p-10 text-center">
            <CheckCircle2Icon className="mx-auto size-10 text-muted-foreground/50" />
            <h3 className="mt-4 text-base font-semibold text-foreground">
              {services.length === 0
                ? "No submissions yet"
                : "Nothing in this filter"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {services.length === 0
                ? "Services published by technicians will appear here for review."
                : "Try another filter to see the rest of the submissions."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((service) => {
                const busy = busyId === service._id;

                return (
                  <TableRow key={service._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {service.image && (
                          <Image
                            src={service.image}
                            alt={service.title}
                            width={56}
                            height={56}
                            unoptimized
                            className="size-14 rounded-lg object-cover"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {service.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {service.category} · {service.serviceMode}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-foreground">
                        {service.technicianName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {service.technicianEmail}
                      </p>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      ${service.basePrice}
                    </TableCell>
                    <TableCell>
                      <Badge variant={approvalVariant(service.approvalStatus)}>
                        {service.approvalStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(service.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {service.approvalStatus !== "approved" && (
                          <Button
                            size="sm"
                            disabled={busy}
                            onClick={() =>
                              void handleApproval(service, "approved")
                            }
                          >
                            <CheckCircle2Icon className="size-4" />
                            {busy ? "Saving..." : "Approve"}
                          </Button>
                        )}
                        {service.approvalStatus !== "rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            onClick={() =>
                              void handleApproval(service, "rejected")
                            }
                            className="text-destructive hover:text-destructive"
                          >
                            <XCircleIcon className="size-4" />
                            Reject
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AdminServicesTable;
