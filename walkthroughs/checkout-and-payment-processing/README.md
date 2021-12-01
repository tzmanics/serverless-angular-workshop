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

One of my favorite things about deploying on Netlify is how easy it is to set up environment variables. We just need to add them to our project's 'Environment' settings. Then your whole team has them no matter where they are. Let's look at how this works by setting up the Stripe credentials we'll need for checkout.

### Grabbing Stripe Keys

On the Stripe dashboard at <https://dashboard.stripe.com/test/apikeys>, on the left-hand side under the 'Developer' menu, there is an 'API keys' menu. In that section, we'll find the 'Publishable key' and 'Secret key' we need for this project.

![Stripe API key menu](/img/blog/screen-shot-2021-06-10-at-11.49.33-pm.jpg "Stripe API key menu")

> 🚨 If you have an activated Stripe account and are just trying this out make sure you have 'Viewing test data' toggled on the left-hand side of the dashboard.

### Adding Stripe Env Vars

Under the project's 'Environment' menu is a section for 'Environment variables'. Click the 'Edit variables' button to add the two Stripe keys from the Stripe account, naming them like so:

- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`

Then click 'Save' and we're all set!

![stripe environment variables in netlify dashboard](/img/blog/screen-shot-2021-06-12-at-11.28.47-pm.png "environment variables in netlify dashboard")

With that, the project credentials are all set.

## EXCERCISE : Create a Serverless Function for Stripe Checkout

It's time to talk to Stripe so the first thing we'll do is bring in the Stripe libraries by installing them with npm.

`npm i stripe @stripe/stripe-js`

Then we can create a serverless in the `netlify/functions` folder called `createCheckout.js`.

In this file, we'll

- require the Stripe library and pass in the Stripe secret key environment variable
- make an async function passing in `event` from the button click
- assign `product` to the information, we get from `event`
- make a `listItems` variable with the information Stripe checkout needs ([check out the Stripe docs for more info](https://stripe.com/docs/api/checkout/sessions/line_items))
- create a stripe checkout session with the project's home page as the URLs and also passing in the `lineItems` we just created ([more info about Stripe's session object here](https://stripe.com/docs/api/checkout/sessions/object))
- finally, return a `200` status code, the session we just created as well as our Stripe publishable key

This is what all those things look like in the form of code a.k.a. this is what the serverless function should look like.

`netlify/functions/createCheckout.js`

```typescript
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const product = JSON.parse(event.body);
  const lineItems = [
    {
      name: product.name,
      currency: "USD",
      description: product.description,
      images: [product.image],
      amount: `${product.price}00`,
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: process.env.URL,
    cancel_url: process.env.URL,
    line_items: lineItems,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      sessionId: session.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    }),
  };
};
```

[🐙 Here is the commit where we create the serverless Netlify Function](https://github.com/tzmanics/angular-stripe-checkout/commit/a47b22ef3fc105888b633a65f5b85c355b0155b5).

## Listen for the 'Buy Now'

No, no, not that voice in your head that says "Buy Now" whenever you see a croissant for sale. We want to listen for when a user clicks the 'Buy Now' button under each product. Now I want a croissant. Anyhoo, let's start by adding the Angular HTTP module which we'll need to post to the serverless function. In the `app.module.ts`, we'll import the HTTP module and add it to imports like so:

`src/app/app.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
+ import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
+   imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Now that we have the HTTP module set up we will want to inject it into the app component inside the constructor of the `app.component.ts` file:

```typescript
constuctor(private http: HttpClient) {}
```

[🐙 Here is the commit where we added the HTTP information for the project](https://github.com/tzmanics/angular-stripe-checkout/commit/396215c22b30cc3b0a6203491a931665b58abe13).

### Creating the Stripe Checkout

The next step is making the function that is triggered by clicking the 'Buy Now' button. This event will have the product information that we need to pass to Stripe. The function we call `triggerCreateCheckout` is very aptly named. This asynchronous function will:

- take the event information passed in and assign it to `eventProduct`
- assign response (which will be declared ahead of time as `private response: any;`) to an awaited function that posts to the Netlify Function `createCheckout`
- `eventProduct` will be passed to the POST operation to the serverless function along with an object that sets the headers Content-Type
- use [`toPromise`](https://www.learnrxjs.io/learn-rxjs/operators/utility/topromise) to make the response a promise
- and finally, pass the repsonse to a function we'll make next to open Stripe

Let's see what this looks like.

`src/app/app.component.ts`

```typescript
...
export class AppComponent {
  products: any = products;
  private response: any;

  constructor(private http: HttpClient) {}

  async triggerCreateCheckout(eventProduct: any) {
    this.response = await this.http
      .post('/.netlify/functions/createCheckout', eventProduct, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .toPromise();
    this.openStripe(this.response);
  }
}
```

[🐙 Here is the commit that adds this function](https://github.com/tzmanics/angular-stripe-checkout/commit/92f6e184fb27e31deb1e914eb9f80941f3f76953).

### Opening the Checkout

Let's tackle the function where we actually open up the Stripe checkout. We need to import the `loadStripe` function from Stripe's `stripe-js` library. Then we'll make an async function called `openStripe` that will

- have the Stripe credentials passed to it
- make a `stripe` variable that is assigned to what is returned from the `loadStripe`function that will have the publishable key passed in
- once loadStripe is ready run, another awaited function that calls `redirectToCheckout` passing the new `sessionId` to open the purchase page

`src/app/app.component.ts`

```typescript
import { loadStripe } from '@stripe/stripe-js';
...
  openStripe = async (stripeParams: any) => {
    const stripe = await loadStripe(stripeParams.publishableKey);
    const { error } = await stripe!.redirectToCheckout({
      sessionId: stripeParams.sessionId,
    });
  };
```

[🐙 Can you guess what this commit is?](https://github.com/tzmanics/angular-stripe-checkout/commit/8ecc87976043743aa2c3bc24e561e94795a92f24) If you guessed the one that adds the `openStripe` function, you're right!

All together this is what the file looks like:

`src/app/app.component.ts`

```typescript
import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { loadStripe } from "@stripe/stripe-js";
import products from "./products.json";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  products: any = products;
  private response: any;

  constructor(private http: HttpClient) {}

  async triggerCreateCheckout(eventProduct: any) {
    this.response = await this.http
      .post("/.netlify/functions/createCheckout", eventProduct, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .toPromise();
    this.openStripe(this.response);
  }

  openStripe = async (stripeParams: any) => {
    const stripe = await loadStripe(stripeParams.publishableKey);
    const { error } = await stripe!.redirectToCheckout({
      sessionId: stripeParams.sessionId,
    });
  };
}
```

We can test it locally by running [`netlify dev`](https://ntl.fyi/3gKIs8y) or by pushing the new code up to the project repo (which would trigger a new deploy) and seeing how it works in [the real world by going to the live site](https://angular-stripe-checkout.netlify.app/). Whichever environment, we should be able to click the 'Buy Now' button and be sent to the Stripe checkout process for the product clicked.

![stripe checkout page for clicked product](/img/blog/screen-shot-2021-06-14-at-1.43.53-am.jpg "stripe checkout")

> 📚 To learn more about developing Netlify Functions with Angular [check out this blog post on just that](https://ntl.fyi/35zHRBf)

## Time to Checkout

Guess what, we can check out mentally now because we have a working checkout process! With this project, we were able to grab information about a product, pass it to a serverless Netlify Function that talks to the Stripe API, then open up the Stripe checkout page to handle the transaction. Instead of setting up a whole checkout process yourself leave it to the experts at Stripe. Now, you'll have time to do more important things like eating croissants. Happy coding 👩🏻‍💻!
