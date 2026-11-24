"use client";

import { useCallback, useEffect, useState } from "react";
import { DollarSignIcon, ReceiptIcon, RefreshCwIcon } from "lucide-react";
import PageHeader from "@/components/dashboard/page-header";
import StatCard from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminPayments, type Payment } from "@/lib/api/payments";

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en-BD", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
    : "—";

const AdminTransactionsTable = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPayments(await getAdminPayments());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div>
      <PageHeader title="Transactions" description="Track Stripe payments and total revenue.">
        <Button variant="outline" onClick={() => void load()} disabled={loading}>
          <RefreshCwIcon className="size-4" />
          Refresh
        </Button>
      </PageHeader>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-card p-8 text-center">
          <p className="text-sm font-medium text-destructive">{error}</p>
          <Button className="mt-4" variant="outline" onClick={() => void load()}>Try again</Button>
        </div>
      ) : loading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 rounded-xl" />
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Total Revenue" value={`$${totalRevenue}`} icon={DollarSignIcon} tone="emerald" />
            <StatCard label="Total Transactions" value={payments.length} icon={ReceiptIcon} tone="blue" />
          </div>

          {payments.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
              <ReceiptIcon className="mx-auto size-10 text-muted-foreground" />
              <h3 className="mt-4 font-semibold text-foreground">No transactions recorded yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">Successful Stripe checkouts will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Booking ID</th>
                    <th className="px-4 py-3 font-medium">Transaction</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p._id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(p.paidAt)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.customerEmail}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.bookingId}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.transactionId}</td>
                      <td className="px-4 py-3 font-medium text-foreground">${p.amount}</td>
                      <td className="px-4 py-3"><Badge>paid</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminTransactionsTable;
