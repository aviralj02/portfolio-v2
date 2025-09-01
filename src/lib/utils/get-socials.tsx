import { gql } from "graphql-request";
import client from "../hygraph";

const getSocials = async (): Promise<Social[] | undefined> => {
  const query = gql`
    query getSocials {
      socials {
        name
        url
      }
    }
  `;

  try {
    const { socials } = await client.request<{ socials: Social[] }>(query);

    return socials || [];
  } catch (error) {
    console.log(error);
  }
};

export default getSocials;
