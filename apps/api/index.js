//import des variables d'environnement
require("dotenv").config()

//import express
const express = require('express');

//Création de l'app
const app = express();

//récupération des routes
const router = require("./router");

const bodyParser = require('body-parser')

//Sécurité
const cors = require("cors");

const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
})