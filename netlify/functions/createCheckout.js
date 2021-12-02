const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const organization = JSON.parse(event.body);
  const lineItems = [
    {
      name: organization.name,
      currency: "USD",
      description: organization.description,
      images: [organization.image],
      amount: `${organization.donationAmount}00`,
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: process.env.URL,
    cancel_url: `${process.env.URL}/donate`,
    line_items: lineItems,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      sessionId: session.id,
      publishableKey: process.env.PUBLISHABLE_KEY,
    }),
  };
};
