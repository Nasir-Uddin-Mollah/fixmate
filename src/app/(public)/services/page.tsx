import { Suspense } from "react";
import { WrenchIcon } from "lucide-react";
import ServicesExplorer from "@/components/services/services-explorer";

const ServicesPage = () => {
  return (
    <div className="bg-muted/60">
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 uppercase dark:bg-blue-500/15 dark:text-blue-300">
            <WrenchIcon className="size-3.5" />
            Browse Services
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-foreground sm:text-4xl">
            Find the right repair for you
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Verified technicians, upfront pricing, and doorstep service across Dhaka.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <Suspense
          fallback={<p className="py-16 text-center text-muted-foreground">Loading services...</p>}
        >
          <ServicesExplorer />
        </Suspense>
      </section>
    </div>
  );
};

export default ServicesPage;
