// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://9912-103-206-131-194.ngrok-free.app/graphql",
  }),
  cache: new InMemoryCache(),
});

export default client;
