import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { CheckCircle2Icon, ReceiptTextIcon } from "lucide-react";
import { getStripe } from "@/lib/stripe";
import { fulfillPaymentFromSession } from "@/lib/fulfill-payment";

async function PaymentSuccessContent({ searchParams }) {
  await connection();
  const { session_id } = await searchParams;
  if (!session_id) redirect("/");

  let session;
  try {
    session = await getStripe().checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent", "customer_details"],
    });
  } catch {
    redirect("/");
  }

  if (session.status !== "complete") redirect("/");

  if (session.payment_status === "paid") {
    try {
      await fulfillPaymentFromSession(session);
    } catch (err) {
      console.error("Payment verification/persist failed:", err);
    }
  }

  const amount = ((session.amount_total || 0) / 100).toFixed(2);
  const email = session.customer_details?.email || session.metadata?.customerEmail || "";
  const transactionId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || "";
  const shortRef = transactionId ? `${transactionId.slice(0, 20)}...` : "—";

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
          <CheckCircle2Icon className="size-8" />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-foreground">Payment successful</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your repair payment has been confirmed. The booking is now marked as paid.
        </p>

        <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4 text-left">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <ReceiptTextIcon className="size-4 text-blue-600" />
            Payment receipt
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Amount paid</dt>
              <dd className="font-semibold text-foreground">${amount} USD</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium text-emerald-600 dark:text-emerald-400">Paid</dd>
            </div>
            {email ? (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="truncate text-foreground">{email}</dd>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Reference</dt>
              <dd className="font-mono text-xs text-muted-foreground">{shortRef}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            View Bookings
          </Link>
          <Link
            href="/dashboard/customer/payments"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            Payment History
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage({ searchParams }) {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-16 text-center text-sm text-muted-foreground">
          Verifying payment...
        </div>
      }
    >
      <PaymentSuccessContent searchParams={searchParams} />
    </Suspense>
  );
}
