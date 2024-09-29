import { gql } from "graphql-request";
import client from "../hygraph";

const getSocials = async (): Promise<Social[] | undefined> => {
  const query = gql`
    query getSocials {
      socials(orderBy: priority_ASC) {
        name
        priority
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
