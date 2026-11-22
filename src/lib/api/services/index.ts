import { getJwtToken } from "../token";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export type ServicePayload = {
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
};

export type Service = ServicePayload & {
  _id: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  createdAt: string;
};

/** POST /api/services - create a service (technician only). */
export const createService = async (payload: ServicePayload) => {
  const token = await getJwtToken();

  const response = await fetch(`${SERVER_URL}/api/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "Could not publish the service.");
  }

  return data;
};

/** GET /api/services - the signed-in technician's own services. */
export const getMyServices = async (): Promise<Service[]> => {
  const token = await getJwtToken();

  const response = await fetch(`${SERVER_URL}/api/services`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Could not fetch services.");
  }

  return (await response.json()) as Service[];
};
