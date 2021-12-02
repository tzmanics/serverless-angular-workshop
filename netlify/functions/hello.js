exports.handler = async (event, context) => {
  console.log("Hello Angular World!");
  console.log(`\nHere is the event info: ${JSON.stringify(event)}`);
  console.log(`\nHere is the context info: ${JSON.stringify(context)}`);

  return {
    statusCode: 200,
    body: "This function is totes working, Yay!",
  };
};
