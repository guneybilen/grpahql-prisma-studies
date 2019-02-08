import ApolloBoost from "apollo-boost";

const getClient = jwt => {
  return new ApolloBoost({
    uri: "http://localhost:4000",
    onError: ({ networkError, graphQLErrors }) => {
      console.log("graphQLErrors", graphQLErrors);
      console.log("networkError", networkError);
    },
    request(operation) {
      if (jwt) {
        operation.setContext({
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        });
      }
    }
  });
};

export { getClient as default };
