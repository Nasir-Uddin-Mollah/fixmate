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
import { toast } from "@/components/ui/toast";
import { createBooking } from "@/lib/api/bookings";
import { getServiceById, type Service } from "@/lib/api/services";

const ServiceDetails = ({ id }: { id: string }) => {
  const { data: session, isPending } = useSession();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [missing, setMissing] = useState(false);
  const [reload, setReload] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

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
      <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
        Loading service details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-card p-10 text-center">
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
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <WrenchIcon className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-bold text-foreground">Service not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
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

  // Guests sign in first, then come back to this same page to book.
  const signInHref = `/sign-in?callbackUrl=${encodeURIComponent(`/services/${id}`)}`;

  const postedOn = new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
  }).format(new Date(service.createdAt));

  // Clicking "Book this service" sends POST /api/bookings with all saved fields.
  const handleBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBookingError("");
    setBookingSuccess(false);
    setSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData.entries());

      await createBooking({
        ...data,
        status: "requested",
        finalAmount: 0,
        paymentStatus: "unpaid",
      });
      setBookingSuccess(true);
      toast.add({
        title: "Booking request sent!",
        description: "The technician will review your request shortly.",
        type: "success",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not send your booking request.";
      setBookingError(message);
      toast.add({
        title: "Booking failed",
        description: message,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

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
        <article className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative h-64 bg-muted sm:h-80">
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
                <WrenchIcon className="size-12 text-muted-foreground" />
              </div>
            )}
            <span className="absolute top-4 left-4 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm">
              {service.category}
            </span>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
                {service.title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">Posted on {postedOn}</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground">About this service</h2>
              <p className="mt-2 leading-relaxed whitespace-pre-line text-muted-foreground">
                {service.description}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground">Service details</h2>
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

            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-400/20 dark:bg-blue-500/10">
              <h2 className="text-sm font-bold text-foreground">Provided by</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {service.technicianName}
                </span>{" "}
                — verified FixMate technician
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Available for {service.serviceArea}
              </p>
            </div>
          </div>
        </article>

        {/* Booking card */}
        <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-6">
          <p className="text-sm text-muted-foreground">Starting at</p>
          <p className="mt-1 text-3xl font-extrabold text-blue-600">
            ${service.basePrice}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Final price confirmed after inspection</p>

          {isPending ? (
            <p className="mt-6 rounded-lg bg-blue-100 px-5 py-3 text-center text-sm font-semibold text-blue-700">
              Checking your session...
            </p>
          ) : !session?.user ? (
            <Link
              href={signInHref}
              className="mt-6 block rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              Sign in to book
            </Link>
          ) : (
            <form onSubmit={handleBooking} className="mt-6 space-y-3">
              {/* Hidden inputs put the service + customer data into FormData too. */}
              <input type="hidden" name="serviceId" value={service._id} readOnly />
              <input type="hidden" name="serviceTitle" value={service.title} readOnly />
              <input type="hidden" name="serviceImage" value={service.image} readOnly />
              <input type="hidden" name="category" value={service.category} readOnly />
              <input type="hidden" name="basePrice" value={service.basePrice} readOnly />
              <input type="hidden" name="technicianName" value={service.technicianName} readOnly />
              <input type="hidden" name="technicianEmail" value={service.technicianEmail} readOnly />
              <input type="hidden" name="customerName" value={session.user.name} readOnly />
              <input type="hidden" name="customerEmail" value={session.user.email} readOnly />

              <div>
                <label htmlFor="customerPhone" className="text-xs font-semibold text-foreground">
                  Phone number
                </label>
                <input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  required
                  placeholder="01XXX-XXXXXX"
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="address" className="text-xs font-semibold text-foreground">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  placeholder="House, road, area"
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="preferredDate" className="text-xs font-semibold text-foreground">
                  Preferred date
                </label>
                <input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  required
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="problemDescription"
                  className="text-xs font-semibold text-foreground"
                >
                  Problem description
                </label>
                <textarea
                  id="problemDescription"
                  name="problemDescription"
                  required
                  rows={3}
                  placeholder="Tell the technician what is wrong..."
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? "Sending request..." : "Book this service"}
              </button>

              {bookingError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                  {bookingError}
                </p>
              )}

              {bookingSuccess && (
                <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                  <p className="font-semibold">Booking request sent!</p>
                  <Link
                    href="/dashboard/customer/bookings"
                    className="mt-1 inline-block font-semibold text-blue-600 hover:underline"
                  >
                    View my bookings →
                  </Link>
                </div>
              )}
            </form>
          )}

          <div className="mt-5 space-y-3 border-t border-border pt-5 text-xs text-muted-foreground">
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
  <div className="flex items-start gap-3 rounded-xl border border-border p-4">
    <span className="mt-0.5 text-blue-500">{icon}</span>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-foreground">{children}</p>
    </div>
  </div>
);

export default ServiceDetails;
