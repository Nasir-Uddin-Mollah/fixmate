import { getJwtToken } from "@/lib/api/token";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export type Payment = {
  _id: string;
  bookingId: string;
  serviceTitle?: string;
  customerName?: string;
  customerEmail: string;
  technicianName?: string;
  technicianEmail?: string;
  amount: number;
  currency?: string;
  transactionId: string;
  stripeSessionId?: string;
  paymentStatus: "paid";
  paidAt?: string;
};

export const getMyPayments = async (): Promise<Payment[]> => {
  const token = await getJwtToken();
  const res = await fetch(`${SERVER_URL}/api/payments/my`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data?.message || "Could not load payments");
  return data as Payment[];
};

export const getAdminPayments = async (): Promise<Payment[]> => {
  const token = await getJwtToken();
  const res = await fetch(`${SERVER_URL}/api/payments/admin/all`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data?.message || "Could not load transactions");
  return data as Payment[];
};
