import { Suspense } from "react";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import DashboardLoading from "./loading";

const AuthenticatedDashboard = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await requireDashboardUser();
  return <DashboardShell user={user}>{children}</DashboardShell>;
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <AuthenticatedDashboard>{children}</AuthenticatedDashboard>
    </Suspense>
  );
};

export default DashboardLayout;
