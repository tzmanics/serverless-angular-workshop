# Why Serverless?

To start us off on a solid foundation let's get clear understanding of not only what serverless and serverless architecture is but why we would choose it.

## What is serverless and serverless architecture?

### Serverless == Worry Less

The term serverless is quite the misnomer since you are still, definitely, using servers. Instead, the term refers to delegating the maintenance and setup to an infrastructure provider. This was often the tedious and headache-inducing part of finally get your app out into the world. Having to predict how many servers to spin up, pouring over documentation to figure out _how_ to spin them up, calculating the costs, load-balancing, dealing with downed infrastructure at any time of the day, and so much more is now handled by other people (phew!). Now, you can pick your project repo from a list, type your build build command and publish directory, click a button and it's online. Back in my day, we had to walk uphill both ways.

This is why I think of serverless more as 'worry less'.

![serverless worry less](https://res.cloudinary.com/dzkoxrsdj/image/upload/v1638283749/worryless.001_zwaja7.jpg)

### Serverless Functions

The most important thing to keep in mind about serverless functions are that they are just that, functions. Those handy little snippets of code we use all over our apps. The difference is we can put them on a server somewhere and just rely on them being there without much effort on our part. Serverless functions should be written for a single purpose, but don't _all_ our functions only perform one task :side-eye:. We'll be making quite a few serverless function today using Netlify functions which wrap AWS Lambda functions so we can ship the code without the headache of the "how" it's shipped.

Although we'll learn a lot by actually doing the work today, there's a [Frontend Masters class to really deep delve into serverless functions](https://frontendmasters.com/workshops/serverless-functions/).

![jasons serverless function](https://res.cloudinary.com/dzkoxrsdj/image/upload/v1638302564/Screen_Shot_2021-11-30_at_2.57.58_PM_y2ijqq.png)

### Serverless Architecture

Serverless architecture applies the 'worry less' approach to many other parts of our applications. This is where we see a lot of 'as a Service' products like, Functions as a Service (FaaS), Backend as a Service (BaaS), Platform as a Service (PaaS),and more. These products maintain the infrastructure around the functions, databases, and other moving parts of your app. [Martin Fowler covers it in detail in this post](https://martinfowler.com/articles/serverless.html) where he also offers a simplified overview image of the traditional app setup compared to one that utilizes serverless architecture.

#### Original app structure

![original app structure](https://res.cloudinary.com/dzkoxrsdj/image/upload/v1638301576/ps_jgybzn.jpg)

#### Serverless architecture

![with serverless architecture](https://res.cloudinary.com/dzkoxrsdj/image/upload/v1638301576/sps_qa2lbz.jpg)

In the serverless architecture picture above it may look like a lot more moving parts but it's actually parts that already live in your app that are tightly coupled and therefore harder to change without changing many things.

In the project that we'll be building today we'll be implementing a lot of these technologies,

- Netlify Functions to manage all the setup and maintenance for serverless functions
- Netlify Edge that will deploy our app to a CDN (Content Delivery Network)
- Auth0 to enable a universal login page with third-party integrations (like GitHub, Gmail, and more) and store user data
- Sanity.io will take care of the content and
- Stripe that handles all the terrifying transaction infrastructure and processes

So many things that we will not have to worry about.

## The benefits of serverless

Speaking of not having to worry brings us to some of the benefits of serverless.

### Time

Supposedly you still can't buy time, I find that quite annoying. BUT you can delegate tasks that usually take up your time. It may be clear that when you hand tasks off you're freeing up time from you and your teams but you're also decoupling your application which will save time when scaling and changing. With a serverless architecture you're also saving a ton of time on having to set any of the infrastructure up, let alone the maintenance.

![delegate, decouple, disperse](https://res.cloudinary.com/dzkoxrsdj/image/upload/v1638312499/Screen_Shot_2021-11-30_at_3.35.01_PM_awkozw.png)

### Money

I can't be the only one who has received a bill from a server that I didn't even realize I spun up. With containers we pay for servers that we don't know if we'll use or not while serverless allows you to pay only when you use it. There are also different aspects of cost to weigh like the engineering (or engineers, in general) needed to set up and maintain infrastructure. Xavier Lefèvre calls this the 'Total Cost of Ownership' in his post: ['Is serverless cheaper for your use case? Find out with this calculator.'](https://medium.com/serverless-transformation/is-serverless-cheaper-for-your-use-case-find-out-with-this-calculator-2f8a52fc6a68) Spoiler alert, serverless always comes out ahead.

![@theodo's total cost of ownership](https://miro.medium.com/max/2000/1*cD4HBbBoZYR_3sDJ3841tg.png)

### Stress

Time and money are probably the most stressful things we deal with, that and parallel parking. So, having to deal with PagerDuty alerts in the middle of the night because a server was hacked on top of everything we mentioned is bound to raise [cortisol levels](https://www.hormone.org/your-health-and-hormones/glands-and-hormones-a-to-z/hormones/cortisol).

On the flip side of that serverless let's you stress less.

![serverless == stress less](https://res.cloudinary.com/dzkoxrsdj/image/upload/v1638311512/Untitled.001_vahcgo.jpg)

There is less stress because someone else is in charge of the maintenance and infrastructure like we said but there are other ways that aren't as obvious. As we will see when coding out this project the entrance barrier for using some of these serverless technologies is lower thanks to the DX experience and the removal of the complicated coding processes. For instance, to use a Netlify serverless functions we need to just create a JavaScript file in a file in our project instead of setting up the server that it will live in. With the Auth0 login process we will pull in a few lines of code that add a button which will give us an authenticated login process and user info. We don't even need to store the user info anywhere.

By lowering the technical hurdles of these common app needs we can empower more engineers to do more in less time. Not only that but that actual access to the code and information can live online making it more accessible in actually getting to it AND using it. This allows more people to contribute to your app no matter the level of technical experience and regardless of where they are located.

But don't take my word for it, take your own word for it after we spin all this up in our application today.

![take your own word for it](https://res.cloudinary.com/dzkoxrsdj/image/upload/v1638312377/Screen_Shot_2021-11-30_at_5.45.45_PM_cb2ytv.jpg)
