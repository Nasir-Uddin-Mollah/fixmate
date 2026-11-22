import PageHeader from "@/components/dashboard/page-header";
import BookingsTable from "@/components/dashboard/customer/bookings-table";
import { requireRole } from "@/lib/dashboard-auth";

const CustomerBookingsPage = async () => {
  await requireRole("customer");

  return (
    <div>
      <PageHeader
        title="My Bookings"
        description="Follow every repair job from request to payment."
      />
      <BookingsTable />
    </div>
  );
};

export default CustomerBookingsPage;
