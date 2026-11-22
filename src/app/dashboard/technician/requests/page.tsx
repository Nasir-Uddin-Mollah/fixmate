import PageHeader from "@/components/dashboard/page-header";
import PlaceholderPanel from "@/components/dashboard/placeholder-panel";
import { requireRole } from "@/lib/dashboard-auth";

const TechnicianRequestsPage = async () => {
  await requireRole("technician");

  return (
    <div>
      <PageHeader
        title="Manage Requests"
        description="Accept jobs, start work, and set the final amount."
      />
      <PlaceholderPanel
        title="No requests to manage yet"
        description="Customer repair requests for your services will show up here with status actions and filters."
      />
    </div>
  );
};

export default TechnicianRequestsPage;
