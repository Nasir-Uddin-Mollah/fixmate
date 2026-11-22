import { ShieldCheck, Award, CheckCircle2, Sparkles } from "lucide-react";

const TRUST_POINTS = [
  {
    title: "Pay Only After Service",
    description:
      "No advance payment required. The Pay Now button appears only after your technician completes the repair successfully.",
    icon: ShieldCheck,
  },
  {
    title: "Verified Technicians",
    description:
      "Every technician profile and service listing is reviewed and approved by platform administrators before going live.",
    icon: Award,
  },
  {
    title: "Real-Time Job Tracking",
    description:
      "Watch your repair progress step by step: Requested → Accepted → In Progress → Completed with complete transparency.",
    icon: CheckCircle2,
  },
  {
    title: "Upfront & Fair Pricing",
    description:
      "Each service clearly states starting prices and estimated turnaround times so there are never any unexpected surprises.",
    icon: Sparkles,
  },
];

const STATS = [
  { label: "Repairs Completed", value: "15,000+" },
  { label: "Verified Technicians", value: "250+" },
  { label: "Customer Satisfaction", value: "99.2%" },
  { label: "Avg. Response Time", value: "< 2 hrs" },
];

const WhyFixMateSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Why FixMate
        </h2>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Built for Trust & Quality
        </p>
        <p className="mt-3 text-sm text-gray-600 sm:text-base">
          No more uncertainty about where your device is or paying before the work is done.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {TRUST_POINTS.map((tp) => {
          const Icon = tp.icon;
          return (
            <div
              key={tp.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                <Icon className="size-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{tp.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{tp.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-16 grid grid-cols-2 gap-4 rounded-2xl bg-blue-600 p-8 text-white sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-black tracking-tight sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-medium text-blue-100 sm:text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyFixMateSection;
