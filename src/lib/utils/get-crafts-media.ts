import { gql } from "graphql-request";

import client from "../hygraph";

const getCraftsMedia = async (): Promise<Record<string, string>> => {
  const query = gql`
    query getCraftsMedia {
      crafts {
        slug
        video {
          url
        }
      }
    }
  `;

  try {
    const { crafts } = await client.request<{ crafts: CraftMedia[] }>(query);

    return Object.fromEntries(crafts.map((c) => [c.slug, c.video.url]));
  } catch (error) {
    console.log(error);
    return {};
  }
};

export default getCraftsMedia;
