import { gql } from "graphql-request";
import client from "../hygraph";

const updateLastVisitor = async (
  id: string,
  city: string,
  country: string
): Promise<LocationData | undefined> => {
  const query = gql`
    mutation updateLastVisit($id: ID!, $city: String!, $country: String!) {
      updateLastVisit(
        where: { id: $id }
        data: { city: $city, country: $country }
      ) {
        id
        city
        country
      }
      publishLastVisit(where: { id: $id }, to: PUBLISHED) {
        id
        city
        country
      }
    }
  `;

  try {
    const { updateLastVisit } = await client.request<{
      updateLastVisit: LocationData;
    }>(query, {
      id,
      city,
      country,
    });

    return updateLastVisit;
  } catch (error) {
    console.log(error);
  }
};

export default updateLastVisitor;
