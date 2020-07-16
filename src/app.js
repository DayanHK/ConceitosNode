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
  const likes = 0;
  const repository = {id:uuid(), title, url, techs, likes};

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs} = request.body;
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if (repositoryIndex < 0 ){
    return response.status(400).json({error:'should not be able to update a repository that does not exist'});
  }

  var likes = (repositories[repositoryIndex].likes);
  const repository ={ id, title, url, techs, likes }
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if (repositoryIndex < 0 ){
    return response.status(400).json({error:'should not be able to delete a repository that does not exist'});
  }
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if (repositoryIndex < 0 ){
    return response.status(400).json({error:'should not be able to update repository likes manually'});
  }
  else{
    var title = (repositories[repositoryIndex].title);
    var url = (repositories[repositoryIndex].url);
    var techs = (repositories[repositoryIndex].techs);
    var likes = (repositories[repositoryIndex].likes);

    like = parseInt(likes);

    if (isNaN(likes) === true || like === 'undefined') {
      likes = 0;
      likes = likes + 1;
    } 
    else {
      likes = likes + 1;
    }

  }
  
  const repository = {id, title, url, techs, likes};
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

module.exports = app;
