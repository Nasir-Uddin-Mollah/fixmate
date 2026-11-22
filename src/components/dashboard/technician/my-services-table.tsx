"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RefreshCwIcon } from "lucide-react";
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
import { getMyServices, type Service } from "@/lib/api/services";

const approvalVariant = (status: Service["approvalStatus"]) => {
  if (status === "approved") return "default" as const;
  if (status === "rejected") return "destructive" as const;
  return "secondary" as const;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
  }).format(new Date(value));

const MyServicesTable = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getMyServices();
      setServices(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not load your services.";
      setError(message);
      toast.add({
        title: "Could not load services",
        description: message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <Skeleton className="h-5 w-40" />
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
      <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-red-600">{error}</p>
        <Button className="mt-4" onClick={() => void load()} variant="outline">
          <RefreshCwIcon className="size-4" />
          Try again
        </Button>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">
          No services yet
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Publish your first service to start receiving repair requests.
        </p>
        <Link
          href="/dashboard/technician/add-service"
          className="mt-5 inline-flex"
        >
          <Button className="bg-blue-600 hover:bg-blue-700">Add Service</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={56}
                      height={56}
                      unoptimized
                      className="size-14 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">
                        {service.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {service.category} · {service.serviceMode}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-800">
                  ${service.basePrice}
                </TableCell>
                <TableCell>
                  <Badge variant={approvalVariant(service.approvalStatus)}>
                    {service.approvalStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      service.isAvailable ? "default" : "outline"
                    }
                  >
                    {service.isAvailable ? "Available" : "Paused"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-500">
                  {formatDate(service.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MyServicesTable;
