import PageHeader from "@/components/dashboard/page-header";
import PlaceholderPanel from "@/components/dashboard/placeholder-panel";
import { requireRole } from "@/lib/dashboard-auth";

const AdminUsersPage = async () => {
  await requireRole("admin");

  return (
    <div>
      <PageHeader
        title="Manage Users"
        description="Review accounts and change user roles."
      />
      <PlaceholderPanel
        title="User management table is next"
        description="All FixMate accounts, their roles and join dates will be listed here once the admin API is connected."
      />
    </div>
  );
};

export default AdminUsersPage;
