const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositorieId(request, response, next){
  const {id} = request.params
  
  if(!isUuid(id)){return response.status(400).json({error : "repository is not found"})}

  next() 
} 
app.get("/repositories", (request, response) => {
  const {title} = request.body

  const result = title?repositories.filter( repository => repository.title.includes(title)):repositories

  response.json(result)
})

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body
  let likes = 0
  const repository = {id: uuid(), title, url, techs, likes}
  
  repositories.push(repository)
  
  return response.json(repository)

})

app.put("/repositories/:id",validateRepositorieId, (request, response) => {
  const {id} = request.params
  const repositoryIndex = repositories.findIndex( repository => repository.id.includes(id))

  const {title, url, techs} = request.body
  const likes = repositories[repositoryIndex].likes

  const repository = {id,title,url, techs, likes}
  
  repositories[repositoryIndex] = repository

  response.status(200).json(repository)

})

app.delete("/repositories/:id",validateRepositorieId, (request, response) => {
  const {id} = request.params
  console.log(id);

  const repositoryIndex = repositories.findIndex( repository => repository.id === id)
 
  if(repositoryIndex < 0){ return response.status(400).json({ error : 'project not found.'})}

  repositories.splice(repositoryIndex,1)

  response.status(204).send()
})

app.post("/repositories/:id/like",validateRepositorieId, (request, response) => {
  const {id} = request.params
  console.log(id);

  const repositoryIndex = repositories.findIndex( repository => repository.id === id)
 
  if(repositoryIndex < 0){ return response.status(400).json({ error : 'project not found.'})}
  
  repositories[repositoryIndex].likes += 1
  
  const repository = repositories[repositoryIndex]
  
  response.status(200).json(repository)
})

module.exports = app
