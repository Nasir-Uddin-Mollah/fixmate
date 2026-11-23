import { Suspense } from "react";
import ServiceDetails from "@/components/services/service-details";

export const instant = false;

type PageProps = {
  params: Promise<{ id: string }>;
};

const DetailsContent = async ({ params }: PageProps) => {
  const { id } = await params;
  return <ServiceDetails id={id} />;
};

const ServiceDetailsPage = ({ params }: PageProps) => {
  return (
    <div className="min-h-screen bg-muted/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <p className="rounded-2xl bg-card p-10 text-center text-muted-foreground">
              Loading service details...
            </p>
          }
        >
          <DetailsContent params={params} />
        </Suspense>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
