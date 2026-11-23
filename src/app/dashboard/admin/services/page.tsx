import AdminServicesTable from "@/components/dashboard/admin/services-table";
import PageHeader from "@/components/dashboard/page-header";
import { requireRole } from "@/lib/dashboard-auth";

const AdminServicesPage = async () => {
  await requireRole("admin");

  return (
    <div>
      <PageHeader
        title="Service Approval"
        description="Approve or reject technician submissions."
      />
      <AdminServicesTable />
    </div>
  );
};

export default AdminServicesPage;
