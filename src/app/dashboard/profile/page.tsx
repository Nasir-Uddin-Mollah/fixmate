import PageHeader from "@/components/dashboard/page-header";
import ProfileForm from "@/components/dashboard/profile-form";
import { requireDashboardUser } from "@/lib/dashboard-auth";

const ProfilePage = async () => {
  const user = await requireDashboardUser();

  return (
    <div>
      <PageHeader
        title="Update Profile"
        description="Keep your contact details and technician bio up to date."
      />
      <ProfileForm user={user} />
    </div>
  );
};

export default ProfilePage;
