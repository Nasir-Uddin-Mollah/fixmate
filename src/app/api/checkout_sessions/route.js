import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";

export async function POST(req) {
  try {
    const origin = (await headers()).get("origin");
    const body = await req.json();
    const { bookingId, serviceTitle, finalAmount, customerEmail } = body;

    if (!bookingId || !finalAmount || !customerEmail) {
      return NextResponse.json({ error: "Missing booking payment data" }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(Number(finalAmount) * 100),
            product_data: { name: serviceTitle || "FixMate Service" },
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: String(bookingId),
        customerEmail: String(customerEmail),
        amount: String(finalAmount),
      },
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-cancelled`,
      customer_email: customerEmail,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}
