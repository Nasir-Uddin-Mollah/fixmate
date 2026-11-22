import { redirect } from "next/navigation";
import { requireDashboardUser } from "@/lib/dashboard-auth";

const DashboardIndexPage = async () => {
  const user = await requireDashboardUser();
  redirect(`/dashboard/${user.role}`);
};

export default DashboardIndexPage;
