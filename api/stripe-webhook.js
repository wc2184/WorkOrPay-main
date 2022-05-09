const getRawBody = require("raw-body");
const { updateUserByCustomerId } = require("./_db.js");
const stripe = require("./_stripe.js");
const fetch = require("node-fetch");

export default async (req, res) => {
  const headers = req.headers;

  try {
    const rawBody = await getRawBody(req);

    const stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log(`stripeEvent: ${stripeEvent.type}`);
    console.log(new Date());

    // Get the object from stripeEvent
    const object = stripeEvent.data.object;

    switch (stripeEvent.type) {
      case "checkout.session.completed":
        console.log(object);
        console.log(object.payment_status);
        if (object.mode === "payment") {
          console.log("it's a single payment");
        }
        if (object.mode === "subscription") {
          console.log("it's a subscription");
        }

        if (object.mode === "payment") {
          console.log('breaking cuz it"s a payment');
          console.log(object.amount_total);
          console.log(object.customer, "customer");

          const session = await stripe.checkout.sessions.retrieve(object.id, {
            expand: ["line_items"],
          });
          var datetime = new Date();
          console.log(datetime.toISOString().slice(0, 10));
          console.log(session.line_items.data[0].price);
          await updateUserByCustomerId(object.customer, {
            //hasContract: hasContract,
            // payment intent id (stripe.com > payments > descriptions)
            //stripeContractPaymentIntentId: object.id,
            // Store the Price ID for this subscription (env variable for your product)
            //stripeContractPriceId: session.line_items.data[0].price.id,
            // Store the date of this purchase (so you can know when the contract started)
            //stripeContractPurchaseDate: datetime.toISOString().slice(0, 10),
            // paid? mutafa warning: don't change shit though, this is cosmetic
            //stripeContractPaidOrNot: object.payment_status,
          });
          console.log(object, "realobjectforcontract");
          await fetch(
            "https://v1.nocodeapi.com/envariable/google_sheets/ovhdVhojdGjnmUuz?tabId=Sheet1",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify([
                [
                  datetime.toISOString().slice(0, 10),
                  object.customer_details.email,
                  object.customer_details.name,
                  object.payment_status,
                  object.amount_total / 100,
                  object.id,
                ],
              ]),
            }
          )
            .then((r) => r.json())
            .then((data) => console.log(data))
            .catch((err) => console.log(error));
          break;
        }
        // need contract created day,

        // Fetch subscription

        const subscription = await stripe.subscriptions.retrieve(
          object.subscription
        );
        console.log(subscription, "subscription");
        // Update the current user
        await updateUserByCustomerId(object.customer, {
          stripeSubscriptionId: subscription.id,
          // Store the Price ID for this subscription
          stripePriceId: subscription.items.data[0].price.id,
          // Store the subscription status ("active" or "trialing")
          stripeSubscriptionStatus: subscription.status,
        });

        break;

      case "invoice.paid":
        // If a payment succeeded we update stored subscription status to "active"
        // in case it was previously "trialing" or "past_due".
        // We skip if amount due is 0 as that's the case at start of trial period.
        if (object.amount_due > 0) {
          await updateUserByCustomerId(object.customer, {
            stripeSubscriptionStatus: "active",
          });
          console.log("updating spreadsheet");
          console.log("testing fetch");
          fetch("https://jsonplaceholder.typicode.com/todos/1")
            .then((response) => response.json())
            .then((json) => console.log(json));
          let datetemp = new Date();
          await fetch(
            "https://v1.nocodeapi.com/envariable/google_sheets/yFnCCkWxQlJwjAIn?tabId=Sheet1",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify([
                [datetemp.toLocaleString(), object.customer_email],
              ]),
            }
          )
            .then((r) => r.json())
            .then((data) => console.log(data))
            .catch((err) => console.log(error));
        }

        break;

      case "invoice.payment_failed":
        // If a payment failed we update stored subscription status to "past_due"
        await updateUserByCustomerId(object.customer, {
          stripeSubscriptionStatus: "past_due",
        });

        break;

      case "customer.subscription.updated":
        await updateUserByCustomerId(object.customer, {
          stripePriceId: object.items.data[0].price.id,
          stripeSubscriptionStatus: object.status,
        });

        // 💡 You could also read "cancel_at_period_end" if you'd like to email user and learn why they cancelled
        // or convince them to renew before their subscription is deleted at end of payment period.
        break;

      case "customer.subscription.deleted":
        // If a subscription was deleted update stored subscription status to "canceled".
        // Keep in mind this won't be called right away if "Cancel at end of billing period" is selected
        // in Billing Portal settings (https://dashboard.stripe.com/settings/billing/portal). Instead you'll
        // get a "customer.subscription.updated" event with a cancel_at_period_end value.
        await updateUserByCustomerId(object.customer, {
          stripeSubscriptionStatus: "canceled",
        });

        break;

      case "customer.subscription.trial_will_end":
        // This event happens 3 days before a trial ends
        // 💡 You could email user letting them know their trial will end or you can have Stripe do that
        // automatically 7 days in advance: https://dashboard.stripe.com/settings/billing/automatic

        break;

      // no default
    }

    // Send success response
    res.send({ status: "success" });
  } catch (error) {
    console.log("stripe webhook error", error);

    // Send error response
    res.send({
      status: "error",
      code: error.code,
      message: error.message,

      testinglol: "lolol",
    });
  }
};
