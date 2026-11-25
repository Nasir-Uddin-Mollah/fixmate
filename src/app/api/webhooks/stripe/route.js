import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { fulfillPaymentFromSession } from "@/lib/fulfill-payment";

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.payment_status === "paid") {
          await fulfillPaymentFromSession(session);
        }
        break;
      }
      case "payment_intent.payment_failed": {
        console.log("Payment failed:", event.data.object?.id);
        break;
      }
      default:
        // Safely ignore events you don't handle
    }
  } catch (err) {
    console.error("Webhook fulfillment failed:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
