import AdminTransactionsTable from "@/components/dashboard/admin/transactions-table";
import { requireRole } from "@/lib/dashboard-auth";

const AdminTransactionsPage = async () => {
  await requireRole("admin");
  return <AdminTransactionsTable />;
};

export default AdminTransactionsPage;
