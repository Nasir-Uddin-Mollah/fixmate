import PageHeader from "@/components/dashboard/page-header";
import PlaceholderPanel from "@/components/dashboard/placeholder-panel";
import { requireRole } from "@/lib/dashboard-auth";

const AdminTransactionsPage = async () => {
  await requireRole("admin");

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Track Stripe payments and total revenue."
      />
      <PlaceholderPanel
        title="No transactions recorded yet"
        description="Successful Stripe checkouts will be listed here with the total revenue shown above the table."
      />
    </div>
  );
};

export default AdminTransactionsPage;
