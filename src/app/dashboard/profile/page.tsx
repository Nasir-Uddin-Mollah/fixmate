import PageHeader from "@/components/dashboard/page-header";
import PlaceholderPanel from "@/components/dashboard/placeholder-panel";
import { requireDashboardUser } from "@/lib/dashboard-auth";

const ProfilePage = async () => {
  const user = await requireDashboardUser();

  return (
    <div>
      <PageHeader
        title="Update Profile"
        description="Keep your contact details and technician bio up to date."
      />
      <PlaceholderPanel
        title={`Signed in as ${user.email}`}
        description="The profile form with photo upload, phone, area and bio will be available here next."
      />
    </div>
  );
};

export default ProfilePage;
