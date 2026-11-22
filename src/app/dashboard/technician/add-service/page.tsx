import AddServiceForm from "@/components/dashboard/technician/add-service-form";
import PageHeader from "@/components/dashboard/page-header";
import { requireRole } from "@/lib/dashboard-auth";

const AddServicePage = async () => {
  const user = await requireRole("technician");

  return (
    <div>
      <PageHeader
        title="Add a Repair Service"
        description="Tell customers what you fix, where you work, and how much it starts at."
      />
      <AddServiceForm
        technicianName={user.name}
        technicianEmail={user.email}
      />
    </div>
  );
};

export default AddServicePage;
