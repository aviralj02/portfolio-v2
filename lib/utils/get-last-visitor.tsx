import { gql } from "graphql-request";

import client from "../hygraph";

const getLastVisitor = async (): Promise<LocationData[] | undefined> => {
  const query = gql`
    query getLastVisitor {
      lastVisits {
        id
        city
        country
      }
    }
  `;

  try {
    const { lastVisits } = await client.request<{ lastVisits: LocationData[] }>(
      query
    );

    return lastVisits || [];
  } catch (error) {
    console.error(error);
  }
};

export default getLastVisitor;
