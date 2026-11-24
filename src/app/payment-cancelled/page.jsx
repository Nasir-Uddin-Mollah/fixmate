import Link from "next/link";
import { XCircleIcon } from "lucide-react";

export default function PaymentCancelledPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
          <XCircleIcon className="size-8" />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-foreground">Payment cancelled</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No money was charged. Your booking is still waiting for payment, and you can try again whenever you’re ready.
        </p>

        <div className="mt-6">
          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
