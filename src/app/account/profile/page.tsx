import { ProfileForm } from "@/components/features/profile-form";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await requireUser();
  return <ProfileForm name={session.user.name} phone={session.user.phone ?? ""} />;
}
