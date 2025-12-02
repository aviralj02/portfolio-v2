import { gql } from "graphql-request";
import client from "../hygraph";

const getExperiences = async (): Promise<Experience[] | undefined> => {
  const query = gql`
    query getWorkExperience {
      experiences(orderBy: endDate_DESC) {
        companyName
        currentlyWorking
        endDate
        role
        startDate
        url
        logo {
          fileName
          url
        }
      }
    }
  `;

  try {
    const { experiences } = await client.request<{ experiences: Experience[] }>(
      query
    );

    return experiences || [];
  } catch (error) {
    console.log(error);
  }
};

export default getExperiences;
