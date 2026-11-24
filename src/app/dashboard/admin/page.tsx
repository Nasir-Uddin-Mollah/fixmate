import AdminOverview from "@/components/dashboard/admin/overview";
import { requireRole } from "@/lib/dashboard-auth";

const AdminDashboardPage = async () => {
  const user = await requireRole("admin");
  return <AdminOverview name={user.name} />;
};

export default AdminDashboardPage;
