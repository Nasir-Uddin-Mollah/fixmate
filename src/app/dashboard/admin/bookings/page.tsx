import BookingsTable from "@/components/dashboard/admin/bookings-table";
import PageHeader from "@/components/dashboard/page-header";
import { requireRole } from "@/lib/dashboard-auth";

const AdminBookingsPage = async () => {
  await requireRole("admin");

  return (
    <div>
      <PageHeader
        title="All Bookings"
        description="Monitor every repair job across the platform."
      />
      <BookingsTable />
    </div>
  );
};

export default AdminBookingsPage;
