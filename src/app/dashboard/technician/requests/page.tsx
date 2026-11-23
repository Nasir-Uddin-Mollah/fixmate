import PageHeader from "@/components/dashboard/page-header";
import RequestsTable from "@/components/dashboard/technician/requests-table";
import { requireRole } from "@/lib/dashboard-auth";

const TechnicianRequestsPage = async () => {
  await requireRole("technician");

  return (
    <div>
      <PageHeader
        title="Manage Requests"
        description="Accept jobs, start work, and set the final amount."
      />
      <RequestsTable />
    </div>
  );
};

export default TechnicianRequestsPage;
