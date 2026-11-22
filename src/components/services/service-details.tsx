"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  ClockIcon,
  MapPinIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  StoreIcon,
  WrenchIcon,
} from "lucide-react";
import { useSession } from "@/app/lib/auth-client";
import { getServiceById, type Service } from "@/lib/api/services";

const ServiceDetails = ({ id }: { id: string }) => {
  const { data: session, isPending } = useSession();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [missing, setMissing] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      setMissing(false);

      try {
        const data = await getServiceById(id);
        if (!data) {
          setMissing(true);
        } else {
          setService(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load this service.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [id, reload]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
        Loading service details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-10 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={() => setReload((value) => value + 1)}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
        >
          <RefreshCwIcon className="size-4" />
          Try again
        </button>
      </div>
    );
  }

  if (missing || !service) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <WrenchIcon className="mx-auto size-10 text-slate-300" />
        <h1 className="mt-4 text-xl font-bold text-slate-900">Service not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          This service may have been removed or is no longer available.
        </p>
        <Link
          href="/services"
          className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Browse all services
        </Link>
      </div>
    );
  }

  // Logged-in users go straight to booking; guests go through sign-in first.
  const bookingPath = `/dashboard/customer/bookings?service=${service._id}`;
  const bookHref = session?.user
    ? bookingPath
    : `/sign-in?callbackUrl=${encodeURIComponent(bookingPath)}`;

  const postedOn = new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
  }).format(new Date(service.createdAt));

  return (
    <div className="space-y-6">
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        <ArrowLeftIcon className="size-4" />
        Back to all services
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Main content */}
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="relative h-64 bg-slate-100 sm:h-80">
            {service.image ? (
              <Image
                src={service.image}
                alt={service.title}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <WrenchIcon className="size-12 text-slate-300" />
              </div>
            )}
            <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm">
              {service.category}
            </span>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {service.title}
              </h1>
              <p className="mt-2 text-sm text-slate-400">Posted on {postedOn}</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">About this service</h2>
              <p className="mt-2 leading-relaxed whitespace-pre-line text-slate-600">
                {service.description}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">Service details</h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Detail icon={<ClockIcon className="size-4" />} label="Estimated duration">
                  {service.estimatedDuration}
                </Detail>
                <Detail
                  icon={
                    service.serviceMode === "Home Visit" ? (
                      <MapPinIcon className="size-4" />
                    ) : (
                      <StoreIcon className="size-4" />
                    )
                  }
                  label="Service mode"
                >
                  {service.serviceMode}
                </Detail>
                <Detail icon={<MapPinIcon className="size-4" />} label="Service area">
                  {service.serviceArea}
                </Detail>
                <Detail icon={<BadgeCheckIcon className="size-4" />} label="Category">
                  {service.category}
                </Detail>
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <h2 className="text-sm font-bold text-slate-900">Provided by</h2>
              <p className="mt-1 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">
                  {service.technicianName}
                </span>{" "}
                — verified FixMate technician
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Available for {service.serviceArea}
              </p>
            </div>
          </div>
        </article>

        {/* Booking card */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-6">
          <p className="text-sm text-slate-500">Starting at</p>
          <p className="mt-1 text-3xl font-extrabold text-blue-600">
            ${service.basePrice}
          </p>
          <p className="mt-1 text-xs text-slate-400">Final price confirmed after inspection</p>

          {isPending ? (
            <p className="mt-6 rounded-lg bg-blue-100 px-5 py-3 text-center text-sm font-semibold text-blue-700">
              Checking your session...
            </p>
          ) : (
            <Link
              href={bookHref}
              className="mt-6 block rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              Book this service
            </Link>
          )}

          <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-xs text-slate-500">
            <p className="flex items-center gap-2">
              <ShieldCheckIcon className="size-4 text-blue-500" />
              Approved by FixMate admin
            </p>
            <p className="flex items-center gap-2">
              <ClockIcon className="size-4 text-blue-500" />
              {service.estimatedDuration} typical completion time
            </p>
            <p className="flex items-center gap-2">
              <MapPinIcon className="size-4 text-blue-500" />
              Service available in {service.serviceArea}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

const Detail = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
    <span className="mt-0.5 text-blue-500">{icon}</span>
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-800">{children}</p>
    </div>
  </div>
);

export default ServiceDetails;
