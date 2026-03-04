"use strict";

const stripeLib = require("stripe");

module.exports = {
  async create(ctx) {
    try {
      const { products } = ctx.request.body || {};

      if (!Array.isArray(products) || products.length === 0) {
        return ctx.badRequest("Products are required.");
      }

      const secretKey = process.env.STRIPE_SECRET_KEY;
      if (!secretKey) {
        return ctx.badRequest("Missing STRIPE_SECRET_KEY in environment.");
      }

      const stripe = stripeLib(secretKey);
      const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

      const lineItems = products.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title || "Product",
          },
          unit_amount: Math.round(Number(item.price || 0) * 100),
        },
        quantity: Number(item.quantity || 1),
      }));

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lineItems,
        success_url: `${clientUrl}/checkout?status=success`,
        cancel_url: `${clientUrl}/checkout?status=cancel`,
      });

      ctx.send({ stripeSession: session });
    } catch (err) {
      strapi.log.error("Stripe checkout session error", err);
      ctx.internalServerError("Unable to create checkout session.");
    }
  },
};
