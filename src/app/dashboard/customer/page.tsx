import Link from "next/link";
import {
  CheckCircle2Icon,
  ClipboardListIcon,
  HammerIcon,
  SearchIcon,
} from "lucide-react";
import ActivityChart from "@/components/dashboard/activity-chart";
import PageHeader from "@/components/dashboard/page-header";
import StatCard from "@/components/dashboard/stat-card";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/dashboard-auth";

const weeklyRequests = [
  { label: "Mon", value: 2 },
  { label: "Tue", value: 4 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 6 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 8 },
  { label: "Sun", value: 4 },
];

const CustomerDashboardPage = async () => {
  const user = await requireRole("customer");

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Track your repair requests and payments in one place."
      >
        <Link
          href="/services"
          className={buttonVariants({
            className: "bg-blue-600 hover:bg-blue-700",
          })}
        >
          <SearchIcon className="size-4" />
          Find a Service
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total Requests"
          value={12}
          icon={ClipboardListIcon}
          tone="blue"
        />
        <StatCard
          label="Active Jobs"
          value={3}
          icon={HammerIcon}
          tone="amber"
        />
        <StatCard
          label="Completed Jobs"
          value={8}
          icon={CheckCircle2Icon}
          tone="emerald"
        />
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Request activity
            </h3>
            <p className="text-sm text-slate-500">
              Your repair requests this week
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Demo preview
          </span>
        </div>
        <ActivityChart data={weeklyRequests} />
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
