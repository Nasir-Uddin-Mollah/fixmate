import "server-only";
import { getDb, ObjectId } from "./payment-db";

export async function fulfillPaymentFromSession(session) {
  const bookingId = session?.metadata?.bookingId;
  if (!bookingId || !ObjectId.isValid(bookingId)) {
    return { ok: false, reason: "invalid-booking-id" };
  }

  const transactionId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  if (!transactionId) {
    return { ok: false, reason: "missing-transaction-id" };
  }

  const db = await getDb();
  const payments = db.collection("payments");
  const bookings = db.collection("bookings");

  const existing = await payments.findOne({ transactionId: String(transactionId) });
  if (existing) {
    await bookings.updateOne(
      { _id: new ObjectId(bookingId) },
      {
        $set: {
          paymentStatus: "paid",
          status: "paid",
          transactionId: String(transactionId),
        },
      }
    );
    return { ok: true, already: true };
  }

  const booking = await bookings.findOne({ _id: new ObjectId(bookingId) });
  if (!booking) {
    return { ok: false, reason: "booking-not-found" };
  }

  const amount =
    typeof session.amount_total === "number"
      ? session.amount_total / 100
      : Number(booking.finalAmount || booking.basePrice || 0);

  const paymentDoc = {
    bookingId: String(bookingId),
    serviceTitle: String(booking.serviceTitle || ""),
    customerName: String(booking.customerName || ""),
    customerEmail: String(
      booking.customerEmail || session.customer_details?.email || session.metadata?.customerEmail || ""
    ),
    technicianName: String(booking.technicianName || ""),
    technicianEmail: String(booking.technicianEmail || ""),
    amount,
    currency: String(session.currency || "usd"),
    transactionId: String(transactionId),
    stripeSessionId: String(session.id || ""),
    paymentStatus: "paid",
    paidAt: new Date(),
  };

  await payments.insertOne(paymentDoc);

  await bookings.updateOne(
    { _id: new ObjectId(bookingId) },
    {
      $set: {
        paymentStatus: "paid",
        status: "paid",
        transactionId: String(transactionId),
      },
    }
  );

  return { ok: true, already: false };
}
