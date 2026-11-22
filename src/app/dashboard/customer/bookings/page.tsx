import PageHeader from "@/components/dashboard/page-header";
import PlaceholderPanel from "@/components/dashboard/placeholder-panel";
import { requireRole } from "@/lib/dashboard-auth";

const CustomerBookingsPage = async () => {
  await requireRole("customer");

  return (
    <div>
      <PageHeader
        title="My Bookings"
        description="Follow every repair job from request to payment."
      />
      <PlaceholderPanel
        title="Booking tracker is coming together"
        description="Once the bookings API is connected, your requests, status pipeline, cancel and pay actions will appear here."
      />
    </div>
  );
};

export default CustomerBookingsPage;
