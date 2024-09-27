import { gql } from "graphql-request";
import client from "../hygraph";

const getSkills = async (): Promise<Skill[] | undefined> => {
  const query = gql`
    query getSkills {
      skills(orderBy: priority_ASC) {
        competencies
        priority
        skillType
      }
    }
  `;

  try {
    const { skills } = await client.request<{ skills: Skill[] }>(query);

    return skills;
  } catch (error) {
    console.log(error);
  }
  return undefined;
};

export default getSkills;
