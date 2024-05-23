# webdev-portfolio-frontend - server

This server has a `/projects` endpoint that reads the JSON files at `/data/project` and serves them.

If there's an HTML at `/data/project-description` that matches the same file name as a JSON, the content of that HTML will be served as the "description" of the project instead of the one defined in the JSON.
