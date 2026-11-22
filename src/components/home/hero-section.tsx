import Link from "next/link";
import {
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Star,
  Search,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white pt-12 pb-20 md:pt-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
              <Sparkles className="size-3.5" />
              <span>On-Demand Device & Home Appliance Repairs</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl lg:leading-tight">
              Broken Device? <br />
              <span className="text-blue-600">Get It Fixed</span> by Verified Technicians.
            </h1>

            <p className="max-w-2xl text-base text-gray-600 sm:text-lg">
              FixMate connects you with certified technicians for smartphones, laptops,
              ACs, and home appliances. Track your repair step by step and{" "}
              <span className="font-semibold text-gray-900">
                pay online only after the job is completed
              </span>
              .
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center pt-2">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <Search className="size-4" />
                <span>Browse All Services</span>
                <ArrowRight className="size-4" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>How FixMate Works</span>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-medium text-gray-700 sm:text-sm">
                  Pay After Service
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-blue-600 shrink-0" />
                <span className="text-xs font-medium text-gray-700 sm:text-sm">
                  Verified Pros
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="size-5 text-amber-500 fill-amber-500 shrink-0" />
                <span className="text-xs font-medium text-gray-700 sm:text-sm">
                  4.9/5 Rating
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                    <Wrench className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">FixMate Live Pipeline</p>
                    <p className="text-xs text-muted-foreground">Order #FX-8842</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  In Progress
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                    <Check className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Repair Requested</p>
                    <p className="text-[11px] text-gray-500">iPhone 14 Screen Replacement</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                    <Check className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Accepted by Technician</p>
                    <p className="text-[11px] text-gray-500">Farhan Ahmed (4.9 ★ verified pro)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold ring-4 ring-amber-100">
                    <Wrench className="size-3.5 animate-spin" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-700">Repair In Progress</p>
                    <p className="text-[11px] text-gray-500">Replacing display & water seals</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-50">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-xs font-bold">
                    4
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Pay After Completion</p>
                    <p className="text-[11px] text-gray-500">Only pay when you inspect the fix</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-gray-50 p-4 border border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Starting Price:</span>
                  <span className="font-bold text-gray-900">$45.00</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Payment Status:</span>
                  <span className="font-semibold text-amber-600">Pending Completion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
