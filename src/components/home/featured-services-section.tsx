"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  MapPinIcon,
  StoreIcon,
  UserCheckIcon,
  WrenchIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicServices, type Service } from "@/lib/api/services";

const FeaturedServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadServices = async () => {
      try {
        const data = await getPublicServices({ limit: 6, sort: "newest" });
        if (active && data?.services) {
          setServices(data.services);
        }
      } catch {
        if (active) {
          setServices([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadServices();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <Badge variant="secondary" className="mb-2 text-blue-600">
            Top Rated Solutions
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Featured Repair Services
          </h2>
          <p className="mt-2 text-base text-muted-foreground max-w-2xl">
            Verified technicians ready to diagnose and repair your appliances
            and electronics with guaranteed quality.
          </p>
        </div>
        <Link href="/services" className="shrink-0">
          <Button variant="outline" className="group">
            View All Services
            <ArrowRightIcon className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <Skeleton className="h-48 w-full rounded-xl" />
              <div className="mt-4 space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-9 w-28 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40">
            <WrenchIcon className="size-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            No featured services available
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Check back soon for available certified technicians in your area.
          </p>
          <Link href="/services" className="mt-6 inline-flex">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Browse All Services
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service._id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-blue-500/30"
            >
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <WrenchIcon className="size-10 text-muted-foreground/40" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-card/90 backdrop-blur-xs px-2.5 py-0.5 text-xs font-semibold text-blue-600 shadow-sm">
                    {service.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-card/90 backdrop-blur-xs px-2.5 py-0.5 text-xs font-medium text-foreground shadow-sm">
                    {service.serviceMode === "Home Visit" ? (
                      <MapPinIcon className="size-3 text-emerald-600" />
                    ) : (
                      <StoreIcon className="size-3 text-blue-600" />
                    )}
                    {service.serviceMode}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex-1">
                  <h3 className="line-clamp-2 text-lg font-bold text-foreground group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <UserCheckIcon className="size-3.5 text-blue-600" />
                    <span className="truncate">{service.technicianName}</span>
                    <span>·</span>
                    <span className="truncate">{service.serviceArea}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Starting at
                    </span>
                    <span className="text-xl font-extrabold text-blue-600">
                      ${service.basePrice}
                    </span>
                  </div>
                  <Link href={`/services/${service._id}`}>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedServicesSection;
