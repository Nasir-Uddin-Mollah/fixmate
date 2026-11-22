import Link from "next/link";
import { PlusCircleIcon } from "lucide-react";
import PageHeader from "@/components/dashboard/page-header";
import PlaceholderPanel from "@/components/dashboard/placeholder-panel";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/dashboard-auth";

const MyServicesPage = async () => {
  await requireRole("technician");

  return (
    <div>
      <PageHeader
        title="My Services"
        description="Edit, pause, or remove the services you offer."
      >
        <Link
          href="/dashboard/technician/add-service"
          className={buttonVariants({ className: "bg-blue-600 hover:bg-blue-700" })}
        >
          <PlusCircleIcon className="size-4" />
          Add Service
        </Link>
      </PageHeader>
      <PlaceholderPanel
        title="Your service list will appear here"
        description="After you publish a service, you can manage availability, edit details, and track approval status from this page."
      />
    </div>
  );
};

export default MyServicesPage;
