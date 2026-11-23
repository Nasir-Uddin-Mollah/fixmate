import Link from "next/link";
import { BadgeCheckIcon, Clock3Icon, PlusCircleIcon, WrenchIcon } from "lucide-react";
import ActivityChart from "@/components/dashboard/activity-chart";
import PageHeader from "@/components/dashboard/page-header";
import StatCard from "@/components/dashboard/stat-card";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/dashboard-auth";

const serviceActivity = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 3 },
  { label: "Wed", value: 2 },
  { label: "Thu", value: 5 },
  { label: "Fri", value: 4 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 3 },
];

const TechnicianDashboardPage = async () => {
  const user = await requireRole("technician");

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Manage your repair services and incoming requests."
      >
        <Link
          href="/dashboard/technician/add-service"
          className={buttonVariants({ className: "bg-blue-600 hover:bg-blue-700" })}
        >
          <PlusCircleIcon className="size-4" />
          Add Service
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Services" value={6} icon={WrenchIcon} tone="blue" />
        <StatCard label="Approved Services" value={4} icon={BadgeCheckIcon} tone="emerald" />
        <StatCard label="Pending Requests" value={2} icon={Clock3Icon} tone="amber" />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">Service activity</h3>
            <p className="text-sm text-muted-foreground">Views and requests this week</p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
            Demo preview
          </span>
        </div>
        <ActivityChart data={serviceActivity} color="#059669" />
      </div>
    </div>
  );
};

export default TechnicianDashboardPage;
