import "server-only";
import Stripe from "stripe";

let stripeInstance;

export const getStripe = () => {
  if (stripeInstance) return stripeInstance;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is missing");
  }

  stripeInstance = new Stripe(key);
  return stripeInstance;
};
