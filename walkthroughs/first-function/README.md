# First Serverless Function

Let's start with the core building block that we'll be using for all the functionality of our site, the serverless function. Being able to add [serverless functions](https://www.netlify.com/blog/2018/08/06/five-key-benefits-of-going-serverless/#main?utm_source=blog&utm_medium=ng-func-starter-tzm&utm_campaign=devex) to your Angular application opens up a world of opportunities for getting data to your users, accessing information, and making your site dynamic in so many ways.

## Netlify Functions

Today we'll be using [Netlify Functions](https://www.netlify.com/products/functions/?utm_source=blog&utm_medium=ng-func-starter-tzm&utm_campaign=devex) which makes it easier to utilize serverless functions by managing the infrastructure and creating an easier developer experience. They do this by creating a wrapper around AWS Lambda functions so that we can have the power without the pain. It also helps us get to the actual coding of the functions faster. It looks a little something like this:

```js
exports.handler = async (event, context) => {
  console.log("Hello, you!");

  return {
    statusCode: 200,
    body: "it twerks",
  };
};
```

To make it work we need to add this file to a functions folder inside our application. Netlify will automatically search for a functions folder but it's best to create a `netlify/functions` folder in the project's root directory. Technically we could place it any reachable location under any name as long as we declare it in the Netlify configurations file (`netlify.toml`) under the `build` configs like so:

```toml
[build]
  command = "npm run prerender"
  publish = "dist/serverless-angular-workshop/browser"
  functions = "funny/fundamental/fun"
```

### The moving parts

You may notice we have passed a few parameters but didn't use them. Here's what they are:

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

#### Query String Parameters

We also have the ability to grab information from the user via the URL with query string parameters. `event.queryStringParameters` are named items in the function-invoking URL inserted behind a '?' and assigned with a '='.

So, if the URL to call the function (the endpoint) is

`https://mysite.com/.netlify/functions/hello`

and the user adds some query parameters like this:

`https://mysite.com/.netlify/functions/hello?location=here&name=booboo`

your function will now have a value `event.queryStringParameters.location === "here"` and `event.queryStringParameters.name === "booboo"`.

> 📚 You can learn more about [query strings here](https://en.wikipedia.org/wiki/Query_string).

#### [Promises, Promises](https://www.youtube.com/watch?v=H8Q83DPZy6E&ab_channel=exDrBob1)

Netlify functions support the [`callback` syntax](https://community.netlify.com/t/support-guide-how-do-i-write-a-javascript-lambda-function/24106) but it is recommended we use the more versatile [`async` function](https://2ality.com/2016/10/async-function-tips.html) which will return a promise. It is also recommended to return a response with _at least_ the HTTP status code instead of allowing the function to time out.

### Testing Locally

Netlify gives us a handy development tool to test our function locally without having to deploy: [Netlify Dev](https://www.netlify.com/products/dev/?utm_source=blog&utm_medium=ng-func-starter-tzm&utm_campaign=devex). This can be run in the project's root directory using the command `netlify dev`, which will automatically open the project up in a browser window.

To trigger the function, we want to hit the endpoint where the function lives (`.netlify/functions/hello`). This will change based on what you named your function (but not what directory you saved it in as Netlify will always hold it in `.netlify/functions`). So, if it was a different name the endpoint would be `/.netlify/functions/my-netlify-function`.

### Live Logs

Once your function is deployed it will show up in the project's Functions dashboard. There you can see the logs whenever the function is triggered. To trigger the function we can either hit the function's route like we did above (`https://yourcoolsite.netlify.app/.netlify/functions/hello`) or by hitting it inside your code, like with a service in Angular. Whatever you put in the body of the return is what you will get back.

Let's really make this stick in our brains by putting it all down in code!

> The [documentation for Netlify Functions lives here](https://docs.netlify.com/functions/overview/) if you need to dig into it for your exercise.

## Exercise 2: Fundamentally Functional!

Here you go again, with your talented coding self. Like last time, here are the instructions for creating and testing our first serverless function. Now go and build some awesomeness, then we'll regroup and build awesomeness together!

1. Create and set up a simple Netlify Function in our Angular app
2. Test it locally using Netlify Dev
3. Deploy it and test it in production

With this we will have enough information to start us on our path towards a dynamic data dynasty ✧*｡٩(ˊᗜˋ*)و✧/\*｡!

Happy Coding 👩🏻‍💻!

**STEP 1: Create & setup**

- [ ] create a starter function named `hello.js`

  ```js
  //./netlify/functions/hello.js
  exports.handler = async (event, context) => {
    console.log("Hello Angular World o(*ﾟ∇ﾟ)ﾉ");
    console.log(`\nHere is the event info: ${JSON.stringify(event)}`);
    console.log(`\nHere is the context info: ${JSON.stringify(context)}`);

    return {
      statusCode: 200,
      body: "This function is totes working, YAY!",
    };
  };
  ```

- [ ] make sure the project's [Netlify configuration file](https://docs.netlify.com/configure-builds/file-based-configuration/?utm_source=blog&utm_medium=ng-func-starter-tzm&utm_campaign=devex): `netlify.toml` has the functions directory listed (technically Netlify will find it but let's just be safe)

  ```toml
  #./netlify.toml
    [build]
      command = "ng build && ng run {projectName}:serverless:production"
      publish = "dist/{projectName}/browser"
      functions = "netlify/functions"
  ```

- [ ] Commit these changes and send it up to GitHub to trigger a build and send the info to Netlify.

**STEP 2: Keep it local**

- [ ] Run Netlify dev _in the project's base directory_ & head to [http://localhost:8888/.netlify/functions/hello](http://localhost:8888/.netlify/functions/hello)

  `netlify dev`

- [ ] Marvel at your lovely working serverless function and check out the logs in the terminal.

**STEP 3: It's alive!**

- [ ] Find the logs on your project dashboard by going to the 'Functions' tab and clicking the function name.

  `netlify open` will take you straight to the dashboard

- [ ] Visit the live version of your project and append `/.netlify/functions/hello` to trigger the serverless function.

**BONUS POINTS**

- [ ] Pass in some event information into the `body` with a string literal.
- [ ] Grab a query parameter from the URL and pass it to the `body`.

**~FIN~**
