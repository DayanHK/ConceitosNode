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
  const like = 0;
  const repository = {id:uuid(), title, url, techs, like};

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs} = request.body;
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if (repositoryIndex < 0 ){
    return response.status(400).json({error:'Repository not found'});
  }

  var like = (repositories[repositoryIndex].like);
  const repository ={ id, title, url, techs, like }
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if (repositoryIndex < 0 ){
    return response.status(400).json({error:'Repository not found'});
  }
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if (repositoryIndex < 0 ){
    return response.status(400).json({error:'Repository not found'});
  }
  else{
    var title = (repositories[repositoryIndex].title);
    var url = (repositories[repositoryIndex].url);
    var techs = (repositories[repositoryIndex].techs);
    var like = (repositories[repositoryIndex].like);

    like = parseInt(like);

    if (isNaN(like) === true || like === 'undefined') {
      like = 0;
      like = like + 1;
    } 
    else {
      like = like + 1;
    }

  }
  
  const repository = {id, title, url, techs, like};
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

module.exports = app;
