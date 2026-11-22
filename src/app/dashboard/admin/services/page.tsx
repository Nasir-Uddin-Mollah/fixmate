import PageHeader from "@/components/dashboard/page-header";
import PlaceholderPanel from "@/components/dashboard/placeholder-panel";
import { requireRole } from "@/lib/dashboard-auth";

const AdminServicesPage = async () => {
  await requireRole("admin");

  return (
    <div>
      <PageHeader
        title="Service Approval"
        description="Approve or reject technician submissions."
      />
      <PlaceholderPanel
        title="No pending reviews in this preview"
        description="Submitted services will appear here with approve and reject actions, pending ones first."
      />
    </div>
  );
};

export default AdminServicesPage;
