import fs from "fs/promises";

import { Project } from "~/types/project";

const PROJECT_DATA_PATH = "server/data/project";

export default defineEventHandler(async (_event) => {
  let files;
  try {
    files = await fs.readdir(PROJECT_DATA_PATH);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error getting files in data/project");
    throw err;
  }

  const projects = [];
  for (const fileName of files) {
    const filePath = `${PROJECT_DATA_PATH}/${fileName}`;

    let projectJson;
    try {
      projectJson = await fs.readFile(filePath);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Error getting project file at ${filePath}`);
      throw err;
    }

    let project: Project;
    try {
      project = JSON.parse(`${projectJson}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Error parsing JSON at ${filePath}`);
      throw err;
    }

    project.id = fileName.replace(".json", "");

    projects.push(project);
  }

  return projects;
});
