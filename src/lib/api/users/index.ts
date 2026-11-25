import { getJwtToken } from "../token";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "customer" | "technician" | "admin";
  createdAt?: string;
};

export type UpdateProfilePayload = {
  name: string;
  phone: string;
  area: string;
  bio: string;
  image: string | null;
};

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const token = await getJwtToken();

  const response = await fetch(`${SERVER_URL}/api/users/admin/all`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load users.");
  }

  return (await response.json()) as AdminUser[];
};

export const updateMyProfile = async (
  payload: UpdateProfilePayload,
): Promise<Record<string, unknown>> => {
  const token = await getJwtToken();

  const response = await fetch(`${SERVER_URL}/api/users/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      (data as { message?: string })?.message ?? "Could not update profile.",
    );
  }

  return data as Record<string, unknown>;
};

export const updateUserRole = async (
  id: string,
  role: AdminUser["role"],
): Promise<AdminUser> => {
  const token = await getJwtToken();

  const response = await fetch(
    `${SERVER_URL}/api/users/${encodeURIComponent(id)}/role`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "Could not update this user.");
  }

  return data as AdminUser;
};
