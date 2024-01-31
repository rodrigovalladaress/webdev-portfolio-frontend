import fs from "fs/promises";

import { Project } from "~/types/project";

const PROJECT_DATA_PATH = "server/data/project";
const PROJECT_DESCRIPTION_DATA_PATH = "server/data/project-description";

type ServerProject = Project & { sort?: number };

export default defineEventHandler(async (_event) => {
  let projectFiles;
  try {
    projectFiles = await fs.readdir(PROJECT_DATA_PATH);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error getting files in ${PROJECT_DATA_PATH}`);
    throw err;
  }

  let projects = [];
  for (const fileName of projectFiles) {
    const filePath = `${PROJECT_DATA_PATH}/${fileName}`;

    let projectJson;
    try {
      projectJson = await fs.readFile(filePath);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Error getting project file at ${filePath}`);
      throw err;
    }

    let parsedProjectJson: Omit<ServerProject, "id"> & { description?: string };
    try {
      parsedProjectJson = JSON.parse(`${projectJson}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Error parsing JSON at ${filePath}`);
      throw err;
    }

    const id = fileName.replace(".json", "");
    const descriptionFileName = `${PROJECT_DESCRIPTION_DATA_PATH}/${id}.html`;
    let descriptionFromFile = null;
    try {
      descriptionFromFile = (await fs.readFile(descriptionFileName)).toString();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`Project ${id} doesn't have a description HTML file`);
    }

    const project: ServerProject = {
      id,
      ...parsedProjectJson,
      description: descriptionFromFile ?? parsedProjectJson.description ?? "",
    };
    project.id = id;

    projects.push(project);
  }

  projects = projects.sort((a, b) => (b.sort ?? 0) - (a.sort ?? 0));

  return projects;
});
