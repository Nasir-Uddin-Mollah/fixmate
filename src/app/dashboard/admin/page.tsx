import { BadgeCheckIcon, ClipboardListIcon, UsersIcon, WrenchIcon } from "lucide-react";
import ActivityChart from "@/components/dashboard/activity-chart";
import PageHeader from "@/components/dashboard/page-header";
import StatCard from "@/components/dashboard/stat-card";
import { requireRole } from "@/lib/dashboard-auth";

const platformActivity = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 18 },
  { label: "Wed", value: 15 },
  { label: "Thu", value: 24 },
  { label: "Fri", value: 21 },
  { label: "Sat", value: 30 },
  { label: "Sun", value: 26 },
];

const AdminDashboardPage = async () => {
  const user = await requireRole("admin");

  return (
    <div>
      <PageHeader
        title="Admin Overview"
        description={`Hello ${user.name.split(" ")[0]}, here is what is happening on FixMate.`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Users" value={128} icon={UsersIcon} tone="blue" />
        <StatCard label="Total Technicians" value={24} icon={WrenchIcon} tone="emerald" />
        <StatCard label="Pending Services" value={7} icon={BadgeCheckIcon} tone="amber" />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">Platform activity</h3>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ClipboardListIcon className="size-4" />
              Jobs created this week
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
            Demo preview
          </span>
        </div>
        <ActivityChart data={platformActivity} color="#7c3aed" />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
