import TechnicianOverview from "@/components/dashboard/technician/overview";
import { requireRole } from "@/lib/dashboard-auth";

const TechnicianDashboardPage = async () => {
  const user = await requireRole("technician");
  return <TechnicianOverview name={user.name} />;
};

export default TechnicianDashboardPage;
