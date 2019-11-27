
// server.js

require('dotenv').config();
const helmet = require("helmet");
const express = require('express');
const bodyParser = require('body-parser');
const router = require("./routes/router.js");
const cors = require('cors')
const server = express();


server.use(express.json());
server.use(helmet());
server.use(cors())
server.use("/", router);
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
module.exports = server;