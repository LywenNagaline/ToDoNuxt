const express = require("express");
const { getCollection, toObjectId } = require('./db')

const router = express.Router();

// Tout récupérer de la collection todos
router.get("/todos", async (req, res) => {
  let collection = getCollection("tasks");
  let results = await collection.find({})
    .limit(50)
    .toArray();
  res.send(results).status(200);
});

router.post("/todos", async (req, res) => {
  let collection = getCollection("tasks");
  const task = {
    name: req.body.name,
    isCompleted: false
  }; 
  collection.insertOne(task)
  .then(result => {console.log(`Successfully inserted item with _id: ${result}`)
    task._id = result.insertedId
    res.send(task).status(200);
    console.log("task", task)
  })
  .catch(err => console.error(`Failed to insert item: ${err}`));
  
});

//Update tasks
router.patch("/todos/:id", async (req, res) => {
  let collection = getCollection("tasks");
  let results = await collection.updateOne(  
    { _id: toObjectId(req.params.id) },
    { $set: {name:req.body.name,} }
  )
  res.send(results).status(200);
});

//Noter la tâche comme completée
router.patch("/todos/:id/completed", async (req, res) => {
  let collection = getCollection("tasks");
  let results = await collection.updateOne(  
    { _id: toObjectId(req.params.id) },
    { $set: {isCompleted:req.body.isCompleted} }
  )
  res.send(results).status(200);
});

router.delete("/todos/:id", async (req, res) => {
  let collection = getCollection("tasks");
  const task = { _id: toObjectId(req.params.id) }
  let results = await collection.deleteOne(task)
  res.send(results).status(200);
});

router.get("/todos/:id", async (req, res) => {
  let collection = getCollection("tasks");
  let results = await collection.findOne(  
    { _id: toObjectId(req.params.id) },
  )
  res.send(results).status(200);
});

module.exports = router;