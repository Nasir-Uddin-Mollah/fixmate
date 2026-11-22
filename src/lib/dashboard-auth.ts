import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";

export type Role = "customer" | "technician" | "admin";

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
};

const ROLES: Role[] = ["customer", "technician", "admin"];

export async function getDashboardUser(): Promise<DashboardUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) return null;

  const role = ROLES.includes(user.role as Role)
    ? (user.role as Role)
    : "customer";

  return {
    id: user.id,
    name: user.name ?? "User",
    email: user.email ?? "",
    image: user.image ?? null,
    role,
  };
}

export async function requireDashboardUser(): Promise<DashboardUser> {
  const user = await getDashboardUser();

  if (!user) {
    redirect("/sign-in?callbackUrl=/dashboard");
  }

  return user;
}

export async function requireRole(role: Role): Promise<DashboardUser> {
  const user = await requireDashboardUser();

  if (user.role !== role) {
    redirect(`/dashboard/${user.role}`);
  }

  return user;
}
