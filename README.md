# Serverless Angular Workshop

This is the repo for the [Frontend Masters](https://frontendmasters.com/) Serverless Angular workshop. The `main` branch features the finished project that you can check out at [https://serverless-angular-workshop.netlify.app](https://serverless-angular-workshop.netlify.app).

## Who is this?

I'm [Tara Z. Manicsic](https://twitter.com/tzmanics), I started my career as a Node engineer that spent a _LOT_ of time provisioning servers, learning vim because (that's all you could use in a container), and learning the woes of other people trying and failing at the feet of server infrastructure aka I worked at a Node.js platform as a service. Fast forward 7 years and I'm now a Developer Experience Engineer at Netlify focusing on the Angular dev experience.

I work with serverless architecture a ton and am stoked to bring it into your stack.

## The Workshop Schedule

(。･∀･)ﾉ To begin the workshop clone this repo and checkout the `00_start-here` branch :)

`git clone https://github.com/tzmanics/serverless-angular-workshop --branch 00_start-here`

If you're here for the workshop, this is what we'll be doing:

- [Introduction to the serverless approach](./walkthroughs/why-serverless/)
- [Building and deploying an Angular Universal application](./walkthroughs/build-and-deploy/)
- [Creating our first serverless functions](./walkthroughs/first-function/)
- [Setting up the Headless CMS via Sanity.io](./walkthroughs/setting-up-a-headless-cms/)
- Lunch
- [Displaying the CMS data](./walkthroughs/grabbing-and-displaying-data/)
- [Checkout & payment processing with Stripe's API](./walkthroughs/checkout-and-payment-processing/)
- [Setting up authentication](./walkthroughs/adding-authentication/) & [role checking](./walkthroughs/role-checking/)
- [Code review, resource run down, project wrap up](./walkthroughs/resources/)
- Questions & closings

## The Setup

In order to get the most out of this workshop we need to hit the ground coding, so I've made a prep sheet for you. Feel free to reach out to me via email at tara [@] netlify [dot] com 👍.

## Coding Set Up

You are free to use whatever code editor you prefer. Using [VS Code](https://code.visualstudio.com/download) will allow us to code together if needed, but again, use the editor that's most comfortable.

- [Link for VS Code Install](https://code.visualstudio.com/download)

### Angular Requirements

This project was build with Angular v13. If you don't have the Angular CLI installed already when you do install it will give you the latest version. If not, you can check your version by running the `ng --version` command in your command line to see if you need to update.

- To install the Angular CLI run

```bash
npm install -g @angular/cli
```

- [Link on updating to v13.](https://update.angular.io/)

Once you have the Angular CLI installed and up to date, you may want to run the project generation command `ng new` to make sure everything works ok.

### Version Control

I know _you never_ make mistakes BUT just in case, it's always good to commit and commit often. If you don't already have a git account somewhere, may I recommend signing up for GitHub.

- [Link to make a GitHub account.](https://github.com/join)

### Deployment & Serverless Functions

For this workshop we'll be using [Netlify](https://www.netlify.com/?utm_source=github-repo&utm_medium=angular-workshop_tzm&utm_campaign=devex) to throw our site online & for the serverless functions. If you don't already have an account you can sign up for a free one. It will then hook up to your git account and allow us to make quick work of our [CI/CD](https://www.netlify.com/products/build/?utm_source=github-repo&utm_medium=angular-workshop_tzm&utm_campaign=devex) setup.

- [Link to setup Netlify account.](https://app.netlify.com/signup?utm_source=github-repo&utm_medium=angular-workshop_tzm&utm_campaign=devex)

> Heads up, I work for Netlify. Even before I did I always recommended using them because I LOVE their developer experience. Which, in turn, is why I happily work on their developer experience team. Just wanted to be transparent 👍.

### Other Services

We'll also be using a few other services, so it will speed up the process if you make accounts with them as well. They are all free to start so you won't have to worry about adding a credit card with any.

- [Sanity.io](https://manage.sanity.io/) headless CMS
- [Stripe](https://dashboard.stripe.com/register) account
- [Auth0](https://auth0.com/) for, you guessed it, auth

## Checklist

Here's a little tldr; of what to have before coming to the workshop. Again, this helps us to really get the most out of the workshop.

- [ ] A code editor like VS Code, Sublime, sick vim setup, etc.
- [ ] Angular CLI v13
- [ ] A git account
- [ ] A Auth0, Netlify, Sanity.io, Stripe account
- [ ] A good knock-knock joke (just in case)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.1.
