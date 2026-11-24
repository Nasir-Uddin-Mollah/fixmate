import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { MongoClient, ObjectId } from "mongodb";

let client;
let dbPromise;
const getDb = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing");
  if (!client) client = new MongoClient(uri);
  if (!dbPromise) dbPromise = client.connect().then((c) => c.db("fixmate"));
  return dbPromise;
};

async function fulfillOrder(session) {
  const { bookingId, customerEmail } = session.metadata || {};
  if (!bookingId || !ObjectId.isValid(bookingId)) return;

  const db = await getDb();
  const payments = db.collection("payments");
  const bookings = db.collection("bookings");
  const transactionId = session.payment_intent;

  // Idempotency: check if transactionId already exists before inserting
  const existing = await payments.findOne({ transactionId });
  if (existing) return;

  await payments.insertOne({
    bookingId,
    customerEmail: customerEmail || session.customer_details?.email || "",
    transactionId,
    amount: (session.amount_total || 0) / 100,
    currency: session.currency || "usd",
    paymentStatus: "paid",
    paidAt: new Date(),
  });

  await bookings.updateOne(
    { _id: new ObjectId(bookingId) },
    { $set: { paymentStatus: "paid", status: "paid", transactionId } }
  );
}

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

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      if (session.payment_status === "paid") {
        await fulfillOrder(session);
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

  return NextResponse.json({ received: true });
}
