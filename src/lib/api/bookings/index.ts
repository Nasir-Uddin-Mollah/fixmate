import { getJwtToken } from "../token";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

/** Everything saved in one `bookings` document (except _id, added by MongoDB). */
export type BookingPayload = {
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: string;
  finalAmount: number;
  paymentStatus: string;
};

export type Booking = BookingPayload & { _id: string };

export const createBooking = async (
  payload: Record<string, FormDataEntryValue | number>,
): Promise<Booking> => {
  const token = await getJwtToken();

  const response = await fetch(`${SERVER_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...payload,
      basePrice: Number(payload.basePrice),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "Could not send your booking request.");
  }

  return data as Booking;
};

export const getTechnicianBookings = async (): Promise<Booking[]> => {
  const token = await getJwtToken();

  const response = await fetch(`${SERVER_URL}/api/bookings/technician`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load your requests.");
  }

  return (await response.json()) as Booking[];
};

export const updateBookingStatus = async (
  id: string,
  status: string,
  finalAmount?: number,
): Promise<Booking> => {
  const token = await getJwtToken();

  const response = await fetch(
    `${SERVER_URL}/api/bookings/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
        ...(finalAmount !== undefined ? { finalAmount } : {}),
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "Could not update this request.");
  }

  return data as Booking;
};

export const getMyBookings = async (): Promise<Booking[]> => {
  const token = await getJwtToken();

  const response = await fetch(`${SERVER_URL}/api/bookings/my`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load your bookings.");
  }

  return (await response.json()) as Booking[];
};

export const cancelBooking = async (id: string): Promise<Booking> => {
  const token = await getJwtToken();

  const response = await fetch(
    `${SERVER_URL}/api/bookings/${encodeURIComponent(id)}/cancel`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "Could not cancel this booking.");
  }

  return data as Booking;
};
