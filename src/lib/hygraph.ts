import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(
  process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT as string
);

export default client;
