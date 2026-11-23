import Link from "next/link";
import {
  Wrench,
  Smartphone,
  Laptop,
  Wind,
  Tv,
  Waves,
  Zap,
  ArrowRight,
} from "lucide-react";

const CATEGORIES = [
  {
    title: "Smartphone",
    slug: "Smartphone",
    icon: Smartphone,
    description: "Screen replacement, battery issues & board diagnostics",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300 hover:border-blue-300",
  },
  {
    title: "Laptop & PC",
    slug: "Laptop & PC",
    icon: Laptop,
    description: "Hardware repairs, OS installation, thermal paste & upgrades",
    color: "bg-indigo-50 text-indigo-600 hover:border-indigo-300",
  },
  {
    title: "AC",
    slug: "AC",
    icon: Wind,
    description: "Master servicing, gas refilling, cooling & jet wash",
    color: "bg-cyan-50 text-cyan-600 hover:border-cyan-300",
  },
  {
    title: "Refrigerator",
    slug: "Refrigerator",
    icon: Wrench,
    description: "Cooling breakdown, compressor fix, gas leak & electricals",
    color: "bg-teal-50 text-teal-600 hover:border-teal-300",
  },
  {
    title: "TV",
    slug: "TV",
    icon: Tv,
    description: "LED/OLED display fix, backlight, sound & motherboard repair",
    color: "bg-purple-50 text-purple-600 hover:border-purple-300",
  },
  {
    title: "Washing Machine",
    slug: "Washing Machine",
    icon: Waves,
    description: "Drum spin issues, water leakage, motor replacement & board fix",
    color: "bg-sky-50 text-sky-600 hover:border-sky-300",
  },
  {
    title: "Electrical",
    slug: "Electrical",
    icon: Zap,
    description: "Short circuits, wiring troubleshooting, switches & breaker repairs",
    color: "bg-amber-50 text-amber-600 hover:border-amber-300",
  },
];

const RepairCategoriesSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Repair Categories
        </h2>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          What Needs Fixing Today?
        </p>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Choose from our range of certified repair services covering personal gadgets
          and home appliances.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.title}
              href={`/services?category=${encodeURIComponent(cat.slug)}`}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div>
                <div
                  className={`inline-flex size-12 items-center justify-center rounded-xl ${cat.color} mb-4 transition-transform group-hover:scale-105`}
                >
                  <Icon className="size-6" />
                </div>
                <h3 className="text-base font-bold text-foreground group-hover:text-blue-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-blue-600">
                <span>View Services</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RepairCategoriesSection;
