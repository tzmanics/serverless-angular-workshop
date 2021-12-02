# Setting Up a Headless CMS with Sanity.io

For the first part of getting data we'll be setting up our headless CMS with [Sanity.io](https://www.sanity.io/).

## What the Heck is a Headless CMS?

Good question. A Traditional CMS usually takes in the information you need stored but also dictates where you can use or show that information, think Wordpress. Now CMS have decided to _decouple_ the data (the proverbial body) from where it is used (the head), hence headless. This basically means we can have a traditional UI for inputting data (what most of our content contributors are used to) but have the liberty to choose what we want to display that information. Now even Wordpress has a [headless version](https://developer.wordpress.org/rest-api/)!

![such headless](https://res.cloudinary.com/dzkoxrsdj/image/upload/v1638389786/mika-43E513RKDug-unsplash_1_jnixdm.jpg)

This means that if for some reason a team decides to switch frameworks the data can be plugged into the new one. We recently put this into play by having information ported in from one headless CMS into Angular, Astro, Eleventy, Next, Nuxt and Gridsome! Decoupling and de-heading(?) is so powerful.

## Setting Up Sanity

Now it's time to set up the Sanity.io instance locally. We can do this with the Sanity.io CLI first by installing the CLI tool then initializing a Sanity.io project:

```bash
npm install -g @sanity/cli
sanity init
```

When we run `sanity init` it will make sure we're logged in (and have an account) then it will step through prompts to set up a new project.

We'll create a new project and name it `backend`, say yes to the defaults, but use the `Clean project with no redefined schemas`. Using the clean project will allow us to write custom schemas without too much overhead that may be confusing.

Change into the Sanity.io instance `backend` folder and run `sanity start` to start the UI up locally.

```bash
cd backend
sanity start
```

Then head to [`http://localhost:3333/`](http://localhost:3333/) to see what we have to work with. It's nothing. This is right because we haven't added any schemas yet!

### Deploying the Sanity.io Desk

From the terminal, we can run `sanity deploy` and it will prompt for a name then set the live instance at https://<project name>.sanity.desk. Once made, this information can be found at the top of the project page at [sanity.io](https://sanity.io).

Anytime we want to update the deployed version of the Sanity.io instance, we'll need to run the `sanity deploy` command again.

> 🐙 This is a good place to push the new code up, BUT make sure to add `backend/node_modules` & `backend/dist` to the project's [`.gitignore` file](https://github.com/tzmanics/angular-sanity/blob/main/.gitignore) in the root directory!

## Adding Sanity.io Environment Variables

To connect to the CMS, we'll need to use some project credentials: the project id, dataset, and a token. We can grab this information from the project's dashboard. First, the project id is at the top of the page and we know we are using the 'production' data set. To get the Sanity.io token we'll go to Settings/API/Tokens and click the 'Add New Token' button.

Then, we'll name the token 'functions' and give it rights to write (which includes read, write, and delete data). When we click the 'Add New Token' button, we'll get a token to copy.

Next, we'll head back over to the project's Netlify dashboard to enter these values. Go to Site settings>Build & deploy>Environment and click the `Edit variables` button. We will add the following variables:

- `SANITY_TOKEN` = (the token we just created and copied)
- `SANITY_DATASET` = production
- `SANITY_PROJECT_ID` = <your project id (e.g. kgu5d2ud)>

## Coding Out the Schemas

It's time to make the custom schemas and update the main schema file. Sanity.io takes this information and uses it to model the information and also make the UI for the CMS. This is the perfect opportunity for an exercise!

> 📚 Learn more about Sanity.io schemas [from their guides](https://www.sanity.io/guides/how-to-configure-schemas) and [their documentation](https://www.sanity.io/docs/schema-types) to help you with your exercise.

## Exercise 3: It's Schema Time

By now you now the drill, code alone then come back and code together. In this exercise we will be:

- creating a category and organization schema
- updating the main schema file
- add some content to be managed!

Happy coding 👩🏻‍💻!

**Step1: Creating the Schemas**

- [ ] inside the backend's `schemas` directory create a file for the category schema

  ```js
  // ./backend/schemas/category.js
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
        name: "description",
        title: "Description",
        type: "text",
      },
    ],
  };
  ```

- [ ] create one for organizations as well

  ```js
  // ./backend/schemas/organization.js
  export default {
    name: "organization",
    title: "Organization",
    type: "document",
    fields: [
      {
        name: "name",
        title: "Name",
        type: "string",
      },
      {
        name: "images",
        title: "Images",
        type: "array",
        of: [{ type: "image" }],
      },
      {
        name: "website",
        title: "Webstie",
        type: "url",
      },
      {
        name: "donationAmount",
        title: "Donation Amount",
        type: "number",
      },
      {
        name: "shortDescription",
        title: "Short Description",
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
        name: "twitter",
        title: "Twitter",
        type: "url",
      },
    ],
    preview: {
      select: {
        title: "name",
      },
    },
  };
  ```

**Step 2: Update the Schema List**

- [ ] in the main `schema.js` file import the new schema types

  ```js
  ...
  import schemaTypes from "all:part:@sanity/base/schema-type";

  import category from "./category";
  import organization from "./organization";
  ...
  ```

- [ ] include the new schemas in `types`

  ```js
    types: schemaTypes.concat([category, organization]),
  ```

**Step 3: Add some content**

- [ ] run `sanity start` from the backend directory & head to [`http://localhost:3333/`](http://localhost:3333/)
- [ ] create some content! (pssst I added some resources for this [in this folder](../setting-up-a-headless-cms/))
- [ ] if all is well, run `sanity deploy`

**Bonus Points**

- [ ] add a custom schema for another type of item, maybe books, or puppies!
- [ ] change the preview for UI to include a picture

**FIN**

## Finally, the Function!

We have everything in place to actually make a serverless function to grab the CMS data. Woohoo! Since this is our first big kid function, let's code it together!

### Fetching Sanity.io Data

We need a few libraries from Sanity.io to make sure the data is configured correctly.

`npm install @sanity/client @sanity/image-url @sanity/block-content-to-html`

Now we can add all the logic we need to a new function called `getOrgs.js` that we'll add to `netlify/functions` .

```javascript
const sanityClient = require("@sanity/client");
const imageUrlBuilder = require("@sanity/image-url");

// passing the env vars to Sanity.io
const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: true,
});

exports.handler = async () => {
  // this query asks for all organizations in order of name ascending
  const query = '*[_type=="organization"] | order(name asc)';
  const organizationList = await sanity.fetch(query).then((results) => {
    // then it iterates over each org
    const allOrganizations = results.map((organization) => {
      // & assigns its properties to output
      const output = {
        name: organization.title,
        website: organization.website,
        donationAmount: organization.donationAmount,
        description: organization.shortDescription,
        twitter: organization.twitter,
      };

      // we want to make sure an image exists before we assign it
      const image =
        organization.images && organization.images.length > 0
          ? organization.images[0].asset._ref
          : null;

      if (image) {
        // this is where we use the library to make a URL from the image records
        output.image = imageUrlBuilder(sanity).image(image).url();
      }
      return output;
    });
    // this log lets us see that we're getting the projects
    // we can delete this once we know it works
    console.log(allOrganizations);

    // now it will return all of the organizations and the properties requested
    return allOrganizations;
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(organizationList),
  };
};
```

### Live Logs & Results

Once we have our function live, where do we find the logs? That's right, from the project dashboard 'Functions' tab where we can see all the functions listed that the project uses.

To deploy the updated function we can git add, commit, and push the changes. The new build will be triggered and if we go to [`https://serverless-angular-workshop.netlify.app/.netlify/functions/getOrgs`](https://serverless-angular-workshop.netlify.app/.netlify/functions/getOrgs) we can see the output on the page and in our logs.

## Functional Function Finita!

We have a template site set up, a customized instance of Sanity.io, and a function that's grabbing our CMS data! We are so skilled!
