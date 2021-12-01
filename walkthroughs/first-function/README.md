# First Serverless Function

Let's start with the core building block that we'll be using for all the functionality of our site, the serverless function. Being able to add [serverless functions](https://www.netlify.com/blog/2018/08/06/five-key-benefits-of-going-serverless/#main?utm_source=blog&utm_medium=ng-func-starter-tzm&utm_campaign=devex) to your Angular application opens up a world of opportunities for getting data to your users. [Netlify Functions](https://www.netlify.com/products/functions/?utm_source=blog&utm_medium=ng-func-starter-tzm&utm_campaign=devex) makes it easier to utilize serverless functions by managing the infrastructure. They do this by creating a wrapper around AWS Lambda functions so that we can have the power without the pain.

> 🧠 We also have [Background Functions in Beta](https://docs.netlify.com/functions/background-functions/?utm_source=blog&utm_medium=ng-func-starter-tzm&utm_campaign=devex) if you need extended execution times.

To start us off, I wanted to show you the very fist steps:

- setting up a Netlify Function in an Angular app
- creating a bare-bones function
- testing it locally
- serving it up on Netlify &
- testing it in production

This will be enough information to let us hit the ground running towards a dynamic data dynasty ✧*｡٩(ˊᗜˋ*)و✧/\*｡!

> ⏭ Just want to fast-forward to using this function? [Here is a template repo](https://github.com/tzmanics/angular-netlify-functions_starter), or go even faster by using this button to deploy the project to Netlify:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tzmanics/angular-netlify-functions_starter)

## Setting Up A Netlify Function

The first thing we'll need to do is let Netlify know where to find our functions. We can do this in the [Netlify configuration file](https://docs.netlify.com/configure-builds/file-based-configuration/?utm_source=blog&utm_medium=ng-func-starter-tzm&utm_campaign=devex): `netlify.toml`. This file will live in the base directory of the project and will look like this:

`netlify.toml` OPTION: #1

```toml
[build]
  publish = "dist/angular-netlify-functions-starter"
  command = "ng build --prod"
+  functions = "./functions"
[[redirects]]
  from = "/*"
  to = "/index.html"[build]
  status = 200
```

> 📓 If you want to know more about the `netlify.toml` file and everything we have listed in the one above, [check out my post all about it](https://www.netlify.com/blog/2019/09/23/first-steps-using-netlify-angular/?utm_source=blog&utm_medium=ng-func-starter-tzm&utm_campaign=devex)!

If we wanted our functions folder to persist to the project files after a build we can save it in the `src/assets/` directory. We also have the option to name it whatever we like as long as we reference that name in the `netlify.toml` file. So, if we named it 'my-netlify-functions' and saved it in the `src/assets` directory the `netlify.toml` file would now look like this.

`netlify.toml` OPTION: #2

```toml
[build]
  publish = "dist/angular-netlify-functions-starter"
  command = "ng build --prod"
+  functions = "./src/assets/my-netlify-functions"
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Creating A Bare-Bones Function 🦴

Next, we'll create a `hello.js` file (feel free to name it what you like) which will hold the function code inside the functions folder we just created.

```bash
cd functions
touch hello.js
```

### Function Parameters

This is a function deployed as a serverless Lambda function that we will pass `event` and `context` to and it will return a promise.

- `event`: an object similar to what you would receive from the [AWS API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html)

  ```json
    {
      "path": "Path parameter",
      "httpMethod": "Incoming request’s method name",
      "headers": {Incoming request headers},
      "queryStringParameters": {query string parameters},
      "body": "A JSON string of the request payload.",
      "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
    }
  ```

- `context`: includes information about the context in which the serverless function was called

For our function, we'll include `event` and `context` in a console log so we can get more information about what we can use for future functions. Yay, future functions! We'll also grab the `event.queryStringParameters`, specifically one named 'location'.

```javascript
exports.handler = async (event, context) => {
  const location = event.queryStringParameters.location || "home";

  console.log("Hello Angular World o(*ﾟ∇ﾟ)ﾉ");
  console.log(`\nHere is the event info: ${JSON.stringify(event)}`);
  console.log(`\nHere is the context info: ${JSON.stringify(context)}`);
  ...
```

The `event.queryStringParameters` are named items in the URL that calls the function listed behind a '?' and assigned with a '='.

So, if the URL to call the function (the endpoint) is

`https://mysite.com/.netlify/functions/hello`

and the user adds some query parameters like this:

`https://mysite.com/.netlify/functions/hello?location=here&name=booboo`

We now have two query string parameters at our disposal: location & name.

> 📚 You can learn more about the make up of Netlify functions [in our docs](https://docs.netlify.com/functions/build-with-javascript/?utm_source=blog&utm_medium=ng-func-starter-tzm&utm_campaign=devex) and more about [query strings here](https://en.wikipedia.org/wiki/Query_string).

### [Promises, Promises](https://www.youtube.com/watch?v=H8Q83DPZy6E&ab_channel=exDrBob1)

Netlify functions support the [`callback` syntax](https://community.netlify.com/t/support-guide-how-do-i-write-a-javascript-lambda-function/24106) but it is recommended we use the more versatile [`async` function](https://2ality.com/2016/10/async-function-tips.html) which will return a promise. It is also recommended to return a response with _at least_ the HTTP status code instead of allowing the function to time out. The function we're going to make will have the status code and will also set the `body` to include a string containing the `event` query string parameter, `location`.

```javascript
...
return {
  statusCode: 200,
  body: `Ng phone ${location}!`,
}
```

### It's the Final Function

Put it all together and what do we get? This:

`functions/hello.js`

```javascript
exports.handler = async (event, context) => {
  const location = event.queryStringParameters.location || "home";

  console.log("Hello Angular World o(*ﾟ∇ﾟ)ﾉ");
  console.log(`\nHere is the event info: ${JSON.stringify(event)}`);
  console.log(`\nHere is the context info: ${JSON.stringify(context)}`);

  return {
    statusCode: 200,
    body: `Ng phone ${location}!`,
  };
};
```

## Testing Locally

Netlify gives us a handy development tool to test our function locally without having to deploy: [Netlify Dev](https://www.netlify.com/products/dev/?utm_source=blog&utm_medium=ng-func-starter-tzm&utm_campaign=devex) (Beta). We need to make sure we have the [Netlify CLI](https://docs.netlify.com/cli/get-started/?utm_source=blog&utm_medium=ng-func-starter-tzm&utm_campaign=devex) installed globally.

`npm i netlify-cli -g`

Then, in the project's root directory we can run `dev`, which will automatically open the project up in a browser window.

`netlify dev`

To trigger the function, we want to hit the endpoint where the function lives (`.netlify/functions/hello)`. This will change based on what you named your function (but not what directory you saved it in as Netlify will always hold it in `.netlify/functions`). So, if it was a different name the endpoint would be `/.netlify/functions/my-netlify-function`.

We will also pass the query parameter `location` and set it like so:

[`http://localhost:8888/.netlify/functions/hello?location=Lorain`](http://localhost:8888/.netlify/functions/hello?location=Lorain)

![localhost check](/img/blog/localhost-check.jpg "localhost check")

The functions logs will be displayed in the terminal so we can now see the objects we get for `event` and `context`.

![localhost logs](/img/blog/localhost-logs.jpg "localhost logs")

## Testing in Production

The easiest way to get this project deployed is to run [`netlify init`](https://cli.netlify.com/commands/init/?utm_source=blog&utm_medium=ng-func-starter-tzm&utm_campaign=devex) from the root directory. This command will walk through the process of connecting the project to Netlify, deploying it, and setting up continuous deployment if we have a git repo hooked up to the project.

`netlify init`

Once that's set up we can run [`netlify open`](https://cli.netlify.com/commands/open/?utm_source=blog&utm_medium=ng-func-starter-tzm&utm_campaign=devex) to see this project's dashboard. Here we can find the link to our live site as well as the link to our 'Functions' dashboard.

![project's Netlify dashboard](/img/blog/functions-dashboard.jpg "project's Netlify dashboard")

Moving to the Functions dashboard, we can see our new 'hello' function listed and click it to look at the information and logs for this function.

![hello function dashboard](/img/blog/hello-function-dashboard.jpg "hello function dashboard")

The 'hello' function's dashboard will list the endpoint for our function and also list all of its logs.

![hello function logs  ](/img/blog/hello-function-logs.jpg "hello function logs  ")

We copy the endpoint then add the `location` parameter like so:

[`https://angular-netlify-functions-starter.netlify.app/.netlify/functions/hello?location=Ohio`](https://angular-netlify-functions-starter.netlify.app/.netlify/functions/hello?location=Ohio)

![hello function production output](/img/blog/function-output.jpg "hello function production output")

## That's a Wrap 🎬

We now have a functioning serverless function grabbing user input and displaying it on the page. I hope this gives you some great bones to work with to bring in more dynamic data into your Angular sites! Here is the [template repo](https://github.com/tzmanics/angular-netlify-functions_starter) for you to grab and play with. If you want you can even click this button to deploy the whole thing to Netlify right away!

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tzmanics/angular-netlify-functions_starter)
