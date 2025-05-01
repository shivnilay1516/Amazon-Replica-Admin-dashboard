import { gql } from "@apollo/client";
import client from "./apolloClient";

const GET_SELLERS = gql`
  query GetSellers {
    sellers {
      id
      name
      email
    }
  }
`;

const { data } = await client.query({ query: GET_SELLERS });
