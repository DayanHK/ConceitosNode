const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

function validateId(request, response, next){
  const { id } = request.params;
  if(!isUuid(id)){
    return response.json({ Error : 'Incorrect ID' });
  }
  next();
}

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", validateId);

const repositories = [];

app.get("/repositories", (request, response) => {

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;
  const { like } = 0;
  const repositorie = {id:uuid(), title, url, techs, like};
  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs} = request.body;
  const {id} = request.params;
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id);
  if (repositorieIndex < 0 ){
      return response.status(400).json({error:'Repositorie not found'});
  }
  const repositorie ={ id, title, url, techs  }
  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id);
  if (repositorieIndex < 0 ){
    return response.status(400).json({error:'Repositorie not found'});
  }
  repositories.splice(repositorieIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { like } = request.params;
  const {id} = request.params;
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id);
  if (repositorieIndex < 0 ){
    return response.status(400).json({error:'Repositorie not found'});
  }
  const repositorie = like ++;
  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

module.exports = app;
