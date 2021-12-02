# Building and Deploying with Angular Universal

## What is Angular Universal

When we talk about serverless Angular, Angular Universal is often brought up. [Angular Universal](https://angular.io/guide/universal) is Angular's technology used to render applications on the server instead of in the browser. Usually you also have to spin up a server but Netlify has created a build plugin that redirects all the rendering through a serverless function. The server-side rendering just became serverless! Serverless-side rendering? Let's not make that a new term, confusing inception.

> Angular Universal also has allows you to prerender your application by just running one command. We won't cover it today but I wanted to note it since it is a very beneficial feature for performance. [Here's a post I wrote all about it!](https://www.netlify.com/blog/2021/02/08/pre-rendering-with-angular-universal/)

## Deploying with Netlify

We will then deploy our project to [Netlify](https://ntl.fyi/3fN1SuB). This process will let us see the project live but also setup a git workflow by automatically setting up CI/CD: each time we push code it will trigger a new build and deployment on Netlify. We will also be taking advantage of [Netlify Edge](https://ntl.fyi/3fPWU0f) which is a globally-distributed CDN ([Content Delivery Network](https://jamstack.org/glossary/cdn/)) to make our site more reliable thanks to the redundancy of the redirect knowledge on the CDN nodes.

### Skeleton Site

So that we can hit the ground running, I've created a skeleton project (you're currently in it, woah) so that we don't have to touch any CSS (unless you really want to) or create any pages/components. This is what it looks like:

![pre-made site](https://res.cloudinary.com/dzkoxrsdj/image/upload/v1638333692/Screen_Shot_2021-11-30_at_11.20.47_PM_1_kvjqoi.jpg)

## Exercise 1: Deploy it!

I'll leave you here with these instructions to get your hands dirty, then wash them, and come back here and get the project:

1. Turned into an Angular Universal project
2. utilizing the [Netlify Angular Universal Plugin](https://github.com/netlify/netlify-plugin-angular-universal) and finally
3. deployed to a CDN using the Netlify CLI

Then we'll come back together, review the code and look at the resources we have available to us now.

Happy Coding 👩🏻‍💻!

**STEP 0: Get the Project**

- [ ] git clone the project using the `00_start-here` branch

  `git clone https://github.com/tzmanics/serverless-angular-workshop --branch 00_start-here`

**STEP 1: Make it Angular Universal**

- [ ] in the project's main directory run the `ng add` command to make all the necessary changes and additions

  `ng add @nguniversal/express-engine`

**STEP 2: Use the Plugin**

- [ ] install the plugin library as a dev dependency to the project

  `npm install -D @netlify/plugin-angular-universal`

- [ ] update the project's `netlify.toml` configuration file (that lives in the base directory) to update the build command, publish directory and [pull in the plugin](https://docs.netlify.com/configure-builds/build-plugins/#configure-settings).

  ```toml
  # ./netlify.toml
  [build]
    command = "ng build && ng run {projectName}:serverless:production"
    publish = "dist/{projectName}/browser"

  [[plugins]]
    package = "@netlify/plugin-angular-universal"
  ```

  _hint: these new build settings will replace what is currently listed._

**STEP 3: Deploy!**

- [ ] install the [Netlify CLI](https://docs.netlify.com/cli/get-started/)

  `npm install netlify-cli -g`

- [ ] initialize the project (you may need to create an account/login if you haven't already)

  `netlify init`

- [ ] trigger a deploy (there are many ways to do this) by committing and pushing your code changes.

  ```bash
  git add .
  git commit -m 'starts the amazingness'
  git push --set-upstream origin
  ```

  _hint: remember to change your origin to your own repo: `git remote rm origin` & `git remote add origin {your repo url`}_

**BONUS POINTS**

- [ ] Change something and deploy the project from the CLI to get a deploy preview before pushing the code.
- [ ] Try out deploying from the UI

**~FIN~**
