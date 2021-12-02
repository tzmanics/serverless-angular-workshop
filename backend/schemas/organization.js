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
      title: "Website",
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
