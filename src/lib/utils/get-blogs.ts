import { gql } from "graphql-request";
import client from "../hygraph";

const getBlogs = async (): Promise<Blog[] | undefined> => {
  const query = gql`
    query getBlogs {
      blogs(orderBy: publishDate_DESC) {
        description
        link
        publishDate
        readTime
        title
      }
    }
  `;

  try {
    const { blogs } = await client.request<{ blogs: Blog[] }>(query);

    return blogs || [];
  } catch (error) {
    console.log(error);
  }
};

export default getBlogs;
