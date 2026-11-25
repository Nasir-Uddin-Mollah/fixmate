import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { getDb, ObjectId } from "@/lib/payment-db";

export async function POST(req) {
  try {
    const origin = (await headers()).get("origin");
    const body = await req.json().catch(() => ({}));
    const bookingId = String(body?.bookingId || "");

    if (!bookingId || !ObjectId.isValid(bookingId)) {
      return NextResponse.json({ error: "Valid bookingId is required" }, { status: 400 });
    }

    const db = await getDb();
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(bookingId) });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.paymentStatus === "paid") {
      return NextResponse.json({ error: "Booking is already paid" }, { status: 400 });
    }

    if (booking.status !== "completed") {
      return NextResponse.json({ error: "Only completed bookings can be paid" }, { status: 400 });
    }

    const amount = Number(booking.finalAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Booking final amount is invalid" }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(amount * 100),
            product_data: { name: String(booking.serviceTitle || "FixMate Service") },
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: String(booking._id),
        customerEmail: String(booking.customerEmail || ""),
        amount: String(amount),
      },
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
      customer_email: booking.customerEmail || undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}
