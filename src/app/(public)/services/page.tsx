import { Suspense } from "react";
import { WrenchIcon } from "lucide-react";
import ServicesExplorer from "@/components/services/services-explorer";

type PageProps = {
  searchParams: Promise<{ category?: string }>;
};

const ServicesContent = async ({ searchParams }: PageProps) => {
  const { category } = await searchParams;
  return <ServicesExplorer initialCategory={category} />;
};

const ServicesPage = ({ searchParams }: PageProps) => {
  return (
    <div className="bg-slate-50/60">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 uppercase">
            <WrenchIcon className="size-3.5" />
            Browse Services
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Find the right repair for you
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Verified technicians, upfront pricing, and doorstep service across Dhaka.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <Suspense
          fallback={<p className="py-16 text-center text-slate-500">Loading services...</p>}
        >
          <ServicesContent searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  );
};

export default ServicesPage;
