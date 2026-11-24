import CustomerOverview from "@/components/dashboard/customer/overview";
import { requireRole } from "@/lib/dashboard-auth";

const CustomerDashboardPage = async () => {
  const user = await requireRole("customer");
  return <CustomerOverview name={user.name} />;
};

export default CustomerDashboardPage;
