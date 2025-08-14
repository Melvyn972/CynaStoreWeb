import Stripe from "stripe";

export const createCheckout = async ({
  priceId,
  mode,
  successUrl,
  cancelUrl,
  couponId,
  clientReferenceId,
  user,
}) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const extraParams = {};

  if (user?.customerId) {
    extraParams.customer = user.customerId;
  } else {
    if (mode === "payment") {
      extraParams.customer_creation = "always";
      extraParams.payment_intent_data = { setup_future_usage: "on_session" };
    }
    if (user?.email) {
      extraParams.customer_email = user.email;
    }
    extraParams.tax_id_collection = { enabled: true };
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode,
    allow_promotion_codes: true,
    client_reference_id: clientReferenceId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    discounts: couponId
      ? [
          {
            coupon: couponId,
          },
        ]
      : [],
    success_url: successUrl,
    cancel_url: cancelUrl,
    ...extraParams,
  });

  return stripeSession.url;
};

export const createCustomerPortal = async ({ customerId, returnUrl }) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return portalSession.url;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const findCheckoutSession = async (sessionId) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    return session;
  } catch (e) {
    console.error(e);
    return null;
  }
};
