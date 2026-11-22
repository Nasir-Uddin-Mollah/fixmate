import PageHeader from "@/components/dashboard/page-header";
import PlaceholderPanel from "@/components/dashboard/placeholder-panel";
import { requireRole } from "@/lib/dashboard-auth";

const CustomerPaymentsPage = async () => {
  await requireRole("customer");

  return (
    <div>
      <PageHeader
        title="Payment History"
        description="All receipts for repairs you have paid for."
      />
      <PlaceholderPanel
        title="No payments to show yet"
        description="After you pay for a completed job through Stripe, the transaction details will be listed here."
      />
    </div>
  );
};

export default CustomerPaymentsPage;
