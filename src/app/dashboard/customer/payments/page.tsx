import CustomerPaymentsTable from "@/components/dashboard/customer/payments-table";
import { requireRole } from "@/lib/dashboard-auth";

const CustomerPaymentsPage = async () => {
  await requireRole("customer");
  return <CustomerPaymentsTable />;
};

export default CustomerPaymentsPage;
