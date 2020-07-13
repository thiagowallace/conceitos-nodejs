const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newRepository);

  return response.status(201).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryToUpdate = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryToUpdate < 0) {
    return response.status(400).json({ message: "Repository not found" });
  }

  const repository = {
    id: repositories[repositoryToUpdate].id,
    title: title ? title : repositories[repositoryToUpdate].title,
    url: url ? url : repositories[repositoryToUpdate].url,
    techs: techs ? techs : repositories[repositoryToUpdate].techs,
    likes: repositories[repositoryToUpdate].likes,
  };

  repositories[repositoryToUpdate] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryToDelete = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryToDelete < 0) {
    return response.status(400).json({
      message: "not found",
    });
  }

  repositories.splice(repositoryToDelete, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryToAddLike = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryToAddLike < 0) {
    return response.status(400).json({
      message: "not found",
    });
  }

  repositories[repositoryToAddLike].likes++;

  return response.status(200).json(repositories[repositoryToAddLike]);
});

module.exports = app;
