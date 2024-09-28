import { gql } from "graphql-request";
import client from "../hygraph";

const getProjects = async (): Promise<Project[] | undefined> => {
  const query = gql`
    query getProjects {
      projects(orderBy: priority_ASC) {
        backgroundColor
        codebase
        description
        live
        priority
        stack
        title
        icon {
          fileName
          url
        }
      }
    }
  `;

  try {
    const { projects } = await client.request<{ projects: Project[] }>(query);

    return projects || [];
  } catch (error) {
    console.log(error);
  }
};

export default getProjects;
