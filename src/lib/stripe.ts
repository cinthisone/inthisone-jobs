import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

export const PLANS = {
  monthly: {
    priceId: process.env.STRIPE_PRICE_ID || "",
    name: "Monthly",
    price: 10,
    interval: "month" as const,
  },
};
