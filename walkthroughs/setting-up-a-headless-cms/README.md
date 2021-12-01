# Setting Up a Headless CMS with Sanity.io

For the first part of getting data we'll be setting up our headless CMS with [Sanity.io](https://www.sanity.io/).

## What the Heck is a Headless CMS

![such headless](https://res.cloudinary.com/dzkoxrsdj/image/upload/v1638389786/mika-43E513RKDug-unsplash_1_jnixdm.jpg)

## Setting Up Sanity

Now it's time to set up the Sanity.io instance locally. We can do this with the Sanity.io CLI first by installing the CLI tool then initializing a Sanity.io project:

```bash
npm install -g @sanity/cli
sanity init
```

When we run `sanity init` it will make sure we're logged in (and have an account) then it will step through prompts to set up a new project.

![sanity init ouput](/img/blog/sanity-init.jpg "`sanity init` ouput")

We'll create a new project and name it `backend`, say yes to the defaults, but use the `Clean project with no redefined schemas`. Using the clean product will allow us to write custom schemas without too much overhead that may be confusing.

Change into the Sanity.io instance `backend` folder and run `sanity start` to start the UI up locally.

```bash
cd backend
sanity start
```

Then head to [`http://localhost:3333/`](http://localhost:3333/) to see what we have to work with. It's nothing. This is right because we haven't added any schemas yet!

![results at localhost:3333](/img/blog/empty-schema.jpg "localhost:3333 output")

### Deploying the Sanity.io Desk

Although we can host our Sanity.io instance on Netlify, I want to show the built-in way. From the terminal, we can run `sanity deploy` and it will prompt for a name then set the live instance at https://<project name>.sanity.desk. Once made, this information can be found at the top of the project page at [sanity.io](https://sanity.io).

![sanity.io dashboard](/img/blog/sanity-deploy.jpg "Sanity.io dashboard")

Anytime we want to update the deployed version of the Sanity.io instance, we'll need to run the `sanity deploy` command again.

> 🐙 This is a good place to push the new code up, BUT make sure to add `backend/node_modules` & `backend/dist` to the project's [`.gitignore` file](https://github.com/tzmanics/angular-sanity/blob/main/.gitignore) in the root directory!

## Coding Out the Schemas

It's time to make the custom schemas and update the main schema file. Sanity.io takes this information and uses it to model the information and also make the UI for the CMS.

> 📚 Learn more about Sanity.io schemas [from their guides](https://www.sanity.io/guides/how-to-configure-schemas) and [their documentation](https://www.sanity.io/docs/schema-types).

For now, we will look at the code we need to add and why we're adding each different schema.

### Block Content

We want to be able to have a section for each product where we can write more about the product. The block content will allow for the person entering information to edit text, add bulleted lists, headers, and some format.

[`backend/schemas/blockContent.js`](https://github.com/tzmanics/angular-sanity/blob/main/backend/schemas/blockContent.js)

```javascript
export default {
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    {
      title: "Block",
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockQuote" },
      ],
      lists: [{ title: "Bullet", value: "bullet" }],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url",
              },
            ],
          },
        ],
      },
    },
    {
      type: "image",
      options: { hotspot: true },
    },
  ],
};
```

### Category

Each product will have a category and also a parent category. This means that we can have a parent category like 'Furniture' but be able to drill in further with a category under 'Furniture' like 'Chair'.

[`backend/schemas/category.js`](https://github.com/tzmanics/angular-sanity/blob/main/backend/schemas/category.js)

```javascript
export default {
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "parents",
      title: "Parents",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "category" }],
        },
      ],
    },
  ],
};
```

### Product Variants

The product variant will allow us to add more detailed information to each product.

[`backend/schemas/productVariant.js`](https://github.com/tzmanics/angular-sanity/blob/main/backend/schemas/productVariant.js)

```javascript
export default {
  name: "productVariant",
  title: "Product Variant",
  type: "object",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "price",
      title: "Price",
      type: "number",
    },
    {
      name: "sku",
      title: "SKU",
      type: "string",
    },
    {
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image" }],
    },
  ],
};
```

### Product

This is the main schema for the products we're adding and it will reference other schemas we've made like category and product variant. Knowing that we can have this type of schema inception adds for a lot of possibilities for customizing how we enter data.

[`backend/schemas/product.js`](https://github.com/tzmanics/angular-sanity/blob/main/backend/schemas/product.js)

```javascript
export default {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "defaultProductVariant",
      title: "Default variant",
      type: "productVariant",
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "blurb",
      title: "Blurb",
      type: "string",
    },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        {
          type: "reference",
          to: { type: "category" },
        },
      ],
    },
    {
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
  preview: {
    select: {
      title: "title",
    },
  },
};
```

One other thing to note about this schema is the `preview` section at the bottom. This is what we will see in the Sanity.io UI when it showcases the list of products. Right now, we have the title but we can add an image, price, or any other information from \`product\` that would be handy to see.

### Schema

This is where it all comes together. We'll want to import all the new schemas we created and add them to the schema types.

[`/backend/schemas/schema.js`](https://github.com/tzmanics/angular-sanity/blob/main/backend/schemas/schema.js)

```diff-javascript
  // First, we must import the schema creator
  import createSchema from 'part:@sanity/base/schema-creator'

  // Then import schema types from any plugins that might expose them
  import schemaTypes from 'all:part:@sanity/base/schema-type'

+ import blockContent from "./blockContent";
+ import category from "./category";
+ import product from "./product";
+ import productVariant from "./productVariant";

  // Then we give our schema to the builder and provide the result to Sanity
  export default createSchema({
    // We name our schema
    name: 'default',
    // Then proceed to concatenate our document type
    // to the ones provided by any plugins that are installed
+   types: schemaTypes.concat([blockContent, category, product, productVariant]),
  })
```

We have all the schemas we need now! If we run `sanity start` now we can see the UI that has been created and even enter some products of our own.

### Importing Existing Data (optional)

We can add products now through the UI but we can also import data. I have data that I have entered, the only catch is the images are a part of the dataset in Sanity, so, unfortunately, they don't import well. Please, feel free to add images to replace these. Image troubles aside, here is the command we can use to bring in exported Sanity.io data that matches the schemas.

In the terminal, we can run the command `sanity dataset import`, pass in the URL to where the exported data lives and the name of the dataset we want to add it to. Because of the image importing situation, we'll need to add `--allow-assets-in-different-dataset` to the end of the command so it ignores that we're adding images from another dataset.

`sanity dataset import https://4cj83dm6.api.sanity.io/v1/data/export/production production --allow-assets-in-different-dataset`

We can run `sanity start` again to see the data added.

## Adding Sanity.io Environment Variables

To connect to the CMS, we'll need to use some project credentials: the project id, dataset, and a token. We can grab this information from the project's dashboard. First, the project id is at the top of the page and we know we are using the 'production' data set. To get the Sanity.io token we'll go to Settings/API/Tokens and click the 'Add New Token' button.

![Sanity.io project dashboard](/img/blog/sanity-project-dashboard.jpg "Sanity.io project dashboard")

Then, we'll name the token 'functions' and give it rights to write (which includes read, write, and delete data). When we click the 'Add New Token' button, we'll get a token to copy.

![creating a new token](/img/blog/create-token.jpg "Creating a new token")

![the new token](/img/blog/new-token.jpg "Sanity.io token")

Next, we'll head back over to the project's Netlify dashboard to enter these values. Go to Site settings/Build & deploy/Environment and click the `Edit variables` button. We will add the following variables:

- `SANITY_TOKEN` = (the token we just created and copied)
- `SANITY_DATASET` = production
- `SANITY_PROJECT_ID` = <your project id (e.g. kgu5d2ud)>

![Netlify environment variables entry](/img/blog/env-vars.jpg "Environment variables")

## Finally, the Function!

We have everything in place to actually make a serverless function to grab the CMS data. Woohoo! Let's get coding.

### Function Setup & Test

Let's start with a test function and see how we can test it locally. We will create a folder in the project's root directory, then make a new file in there named `getProducts.js`.

`mkdir functions && touch getProducts.js`

[`functions/getProducts.js`](https://github.com/tzmanics/angular-sanity/blob/main/functions/getProducts.js)

```javascript
exports.handler = async () => {
  return {
    statusCode: 200.
    body: 'ok',
  };
};
```

### Testing Locally

Through the Netlify CLI we can start up a local development environment by using the `netlify dev` command. Before we run that, let's set local build settings for `command` and `publish` for the dev environment in the `netlify.toml` configuration file.

[`netlify.toml`](https://github.com/tzmanics/angular-sanity/blob/main/netlify.toml)

```toml
[build]
  command = "npm run prerender"
  functions = "./functions"
  publish = "dist/angular-sanity/browser"
[dev]
  command = "npm run start"
  functions = "./functions"
  publish = "src"
```

Now when we run `netlify dev`, we can head to [`http://localhost:8888/.netlify/functions/getProduct`](http://localhost:8888/.netlify/functions/getProduct) to see the output from the test function: 'ok'. Riveting, I know.

![test function output](/img/blog/test-output.jpg "Test function ouput")

> 📓 Here's [a blog post on getting started with Netlify Functions](https://hubs.ly/H0H2h--0) if you want to learn more about what's going on here.

### Fetching Sanity.io Data

We need a few libraries from Sanity.io to make sure the data is configured correctly.

`npm install @sanity/client @sanity/image-url @sanity/block-content-to-html`

Now we can add all the logic we need to the Netlify Function.

[`functions/getProducts.js`](https://github.com/tzmanics/angular-sanity/blob/main/functions/getProducts.js)

```javascript
const sanityClient = require("@sanity/client");
const imageUrlBuilder = require("@sanity/image-url");
const blocksToHtml = require("@sanity/block-content-to-html");

// passing the env vars to Sanity.io
const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: true,
});

exports.handler = async () => {
  // this query asks for all products in order of title ascending
  const query = '*[_type=="product"] | order(title asc)';
  const products = await sanity.fetch(query).then((results) => {
    // then it iterates over each product
    const allProducts = results.map((product) => {
      // & assigns its properties to output
      const output = {
        id: product.slug.current,
        name: product.title,
        url: `${process.env.URL}/.netlify/functions/getProducts`,
        price: product.defaultProductVariant.price,
        description: product.blurb,
        // this is where we use the Sanity.io library to make the text HTML
        body: blocksToHtml({ blocks: product.body }),
      };

      // we want to make sure an image exists before we assign it
      const image =
        product.defaultProductVariant.images &&
        product.defaultProductVariant.images.length > 0
          ? product.defaultProductVariant.images[0].asset._ref
          : null;

      if (image) {
        // this is where we use the library to make a URL from the image records
        output.image = imageUrlBuilder(sanity).image(image).url();
      }
      return output;
    });
    // this log lets us see that we're getting the projects
    // we can delete this once we know it works
    console.log(allProducts);

    // now it will return all of the products and the properties requested
    return allProducts;
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(products),
  };
};
```

### Live Logs & Results

Once we have our function live, where do we find the logs? Netlify has a dedicated section for the functions to make them easy to keep track of and manage. From the project dashboard, there is a 'Functions' tab where we can see all the functions listed that the project uses.

![screenshot of functions dashboard](/img/blog/function-dashboard.jpg "Functions Dashboard")

To deploy the updated function we can git add, commit, and push the changes. The new build will be triggered and if we go to [`https://angular-sanity.netlify.app/.netlify/functions/getProducts`](https://angular-sanity.netlify.app/.netlify/functions/getProducts) we can see the output on the page and in our logs.

![screenshot of function logs](/img/blog/function-logs.jpg "Function Logs")

## Functional Function Finita!

We have a template site set up, a customized instance of Sanity.io, and a function that's grabbing our CMS data! We are so skilled! In part two of this tutorial, we'll use add an Angular service and component to integrate this data into the site. Then we'll set up a Build Hook so that we re-deploy the site with the newest data as soon as it's entered. I hope to see you there and until then, happy coding 👩🏻‍💻
