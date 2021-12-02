const sanityClient = require("@sanity/client");
const imageUrlBuilder = require("@sanity/image-url");

// passing env vars to Sanity.io
const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: true,
});

exports.handler = async () => {
  // make a query asking for organization in order of title ascending
  const query = '*[_type=="organization"] | order(name asc)';
  const organizationList = await sanity.fetch(query).then((results) => {
    // iterate over each org
    const allOrganizations = results.map((organization) => {
      // assign properties
      const output = {
        name: organization.name,
        website: organization.website,
        donationAmount: organization.donationAmount,
        description: organization.shortDescription,
        twitter: organization.twitter,
      };
      // check if there's an image then assign it
      const image =
        organization.images && organization.images.length > 0
          ? organization.images[0].asset._ref
          : null;

      if (image) {
        // use library to make a url from the image records
        output.image = imageUrlBuilder(sanity).image(image).url();
      }
      return output;
    });
    console.log(allOrganizations);
    return allOrganizations;
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(organizationList),
  };
};
