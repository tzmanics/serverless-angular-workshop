const SanityClient = require("@sanity/client");
const imageUrlBuilder = require("@sanity/image-url");

const sanity = SanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: true,
});

exports.handler = async () => {
  const query = '*[_type=="organization"] | order(name asc)';
  const organizationList = await sanity.fetch(query).then((results) => {
    const allOrganizations = results.map((organization) => {
      const output = {
        name: organization.title,
        website: organization.website,
        donationAmount: organization.donationAmount,
        description: organization.shortDescription,
        twitter: organization.twitter,
      };

      const image =
        organization.images && organization.images.length > 0
          ? organization.images[0].asset.ref
          : null;

      if (image) {
        output.image = imageUrlBuilder(sanity).image(image).url();
      }
      return output;
    });
    console.log(allOrganizations);
  });
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(organizationList),
  };
};
