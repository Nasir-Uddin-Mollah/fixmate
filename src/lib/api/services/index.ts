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

export type ServiceQuery = {
  q?: string;
  category?: string;
  serviceMode?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "title";
  page?: number;
  limit?: number;
};

export type ServiceListResponse = {
  services: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/** POST /api/services - create a service (technician only, JWT required). */
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

export const getMyServices = async (): Promise<Service[]> => {
  const token = await getJwtToken();

  const response = await fetch(`${SERVER_URL}/api/services/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Could not fetch services.");
  }

  return (await response.json()) as Service[];
};

export const getPublicServices = async (
  params: ServiceQuery = {},
): Promise<ServiceListResponse> => {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set("q", params.q);
  if (params.category) searchParams.set("category", params.category);
  if (params.serviceMode) searchParams.set("serviceMode", params.serviceMode);
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  const response = await fetch(
    `${SERVER_URL}/api/services${query ? `?${query}` : ""}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Could not load services. Please try again.");
  }

  return (await response.json()) as ServiceListResponse;
};
