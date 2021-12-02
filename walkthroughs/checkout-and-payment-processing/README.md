# Creating a Checkout and Payment Process with Stripe

If you ever had to set up a checkout or payment process in the past, chances are it wasn't as easy as [the Stripe Checkout process](https://stripe.com/docs/payments/checkout). When it comes to eCommerce or donation sites it's pretty important to have people, you know, give you money. Stripe has a quick checkout process that we can plug into our existing application using a serverless function. Instead of having to code out the whole transaction process, we can send [Stripe](https://stripe.com/) information about the product the user wants to purchase and let them handle the rest.

First off, here is what the end product for today will look like: a simple product page with 'Buy Now' buttons and the Stripe checkout page the users are sent to for making their purchase.

![final shot](https://res.cloudinary.com/dzkoxrsdj/image/upload/v1638391249/Screen_Shot_2021-12-01_at_2.40.04_PM_fzmjay.jpg)

Here's what we have ahead of us:

- setup Stripe credentials in the project environment variables
- create a Netlify Function that interacts with the Stripe API
- listen for the 'Buy Now' button click to trigger the Netlify Function and
- make a function that loads Stripe to redirect the user to the checkout page with the information needed

Okie dokie, let's jump in.

## Setup Stripe Credentials

On the Stripe dashboard at <https://dashboard.stripe.com/test/apikeys>, on the left-hand side under the 'Developer' menu, there is an 'API keys' menu. In that section, we'll find the 'Publishable key' and 'Secret key' we need for this project.

> 🚨 If you have an activated Stripe account and are just trying this out make sure you have 'Viewing test data' toggled on the left-hand side of the dashboard.

### Adding Stripe Env Vars

Under the project's 'Environment' menu is a section for 'Environment variables'. Click the 'Edit variables' button to add the two Stripe keys from the Stripe account, naming them like so:

- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`

Then click 'Save' and we're all set!

With that, the project credentials are all set and it's time for us to exercise, our brains, that is.

## Exercise 5: Do all the things for a Stripe Checkout

You have all the tools in your arsenal so it's time to put the to use!

1. create a serverless function to talk to the Stripe Checkout API
2. make a function that in the `organization-item` class that calls the serverless function
3. make another function there that triggers the `loadStripe` function
4. create a 'Donate' button
   4.5 profit

Happy coding 👩🏻‍💻!

**Step 1: Stripe Serverless function**

- [ ] create a serverless function called `createCheckout.js` in `netlify/functions`

- [ ] install `@stripe/stripe-js` and require it passing in the env var we created with the secret key
      `const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);`

- [ ] pass the `event` object to the serverless function assign a `JSON.parse` version of `event.body` to `organization`

- [ ] create a `lineItems` array with this object:

  ```js
    {
      name: organization.name,
      currency: "USD",
      description: organization.description,
      images: [organization.image],
      amount: `${organization.donationAmount}00`,
      quantity: 1,
    }
  ```

- [ ] assign `session` to stripe's checkout sessions create function

  ```js
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: process.env.URL,
    cancel_url: `${process.env.URL}/donate`,
    line_items: lineItems,
  });
  ```

- [ ] return a 200 status code as well as a body containing a `JSON.stringify` version of this object

  ```json
    {
      sessionId: session.id,
      publishableKey: process.env.STRIPE_PUB_KEY,
    }
  ```

- [ ] take a breather! that was a long one! phew!

**Step 2: Call that function**

- [ ] in the `organization-item` component class file (`/src/app/components/organization-item/organization-item.component.ts`) import `lastValueFrom` from `rxjs`

- [ ] create an `async` function called `triggerCreateCheckout` passing in `eventOrganization: any`

- [ ] in that function create `const createCheckoutResponse` that `await`s an `http` post call to the serverless function we created passing in `eventOrganization` and an object containing `headers` setting the Content Type

  ```js
  const createCheckoutResponse = await this.http.post(
    "/.netlify/functions/createCheckout",
    eventOrganization,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  ```

- [ ] assign `lastResponse` to an `await` call to `lastValueFrom()` passing in `createCheckoutResponse`

  ```js
  const lastResponse = await lastValueFrom(createCheckoutResponse);
  ```

- [ ] call `this.openStripe` passing in `lastResponse`

**Step 3: That `openStripe` function we just used, we need to make it now haha**

- [ ] import `loadStripe` from `@stripe/stripe-js`

- [ ] create an async function called `openStripe` that passes a param `stripeParams: any`

  ```js
  openStripe = async (stripeParams: any) => {}`
  ```

- [ ] assign `stripe` to the `await` version of `loadStripe` passing in the Stripe publishable key

  ```js
  const stripe = await loadStripe(stripeParams.publishableKey);
  ```

- [ ] await the Stripe `redirectToCheckout` passing in the session id

  ```js
  const { error } = await stripe!.redirectToCheckout({
      sessionId: stripeParams.sessionId,
    });
  ```

**Step 4: Make a button**

- [ ] yea, make a button...

  haha but for real in the template file (`/src/app/components/organization-item/organization-item.component.html`) add a button that on `(click)` will call the `triggerCreateCheckout()` function passing in the organization

**FIN** (Nice work!)

We can test it locally by running [`netlify dev`](https://ntl.fyi/3gKIs8y) or by pushing the new code up to the project repo (which would trigger a new deploy) and seeing how it works in [the real world by going to the live site](https://serverless-angular-workshop.netlify.app/).

## Time to Checkout

Okay not really, BUT look how much we've done: we were able to grab information about a product, pass it to a serverless Netlify Function that talks to the Stripe API, then open up the Stripe checkout page to handle the transaction. Instead of setting up a whole checkout process yourself leave it to the experts at Stripe. Now, you'll have time to do more important things like eating croissants. Happy coding 👩🏻‍💻!
