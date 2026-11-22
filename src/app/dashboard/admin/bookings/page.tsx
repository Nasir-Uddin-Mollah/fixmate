import PageHeader from "@/components/dashboard/page-header";
import PlaceholderPanel from "@/components/dashboard/placeholder-panel";
import { requireRole } from "@/lib/dashboard-auth";

const AdminBookingsPage = async () => {
  await requireRole("admin");

  return (
    <div>
      <PageHeader
        title="All Bookings"
        description="Monitor every repair job across the platform."
      />
      <PlaceholderPanel
        title="Booking monitor is coming"
        description="A read-only, filterable table of every customer request and its current status will appear here."
      />
    </div>
  );
};

export default AdminBookingsPage;
