import PageHeader from "@/components/dashboard/page-header";
import UsersTable from "@/components/dashboard/admin/users-table";
import { requireRole } from "@/lib/dashboard-auth";

const AdminUsersPage = async () => {
  await requireRole("admin");

  return (
    <div>
      <PageHeader
        title="Manage Users"
        description="Review accounts and change user roles."
      />
      <UsersTable />
    </div>
  );
};

export default AdminUsersPage;
