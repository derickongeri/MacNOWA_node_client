// require packages used in the project
const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const ee = require("@google/earthengine");
const privateKey = require("./agristats-378216-b464955961eb.json");
const app = express();

const port = 3000;


const { getGeeRaster, getLandcover } = require("./modules/geeScript");

// const zonalStats = require('./geoserverWPS')

app.use(cors());

var jsonParser = bodyParser.json();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Define endpoint at /mapid

app.get("/api/mapid", [jsonParser, getGeeRaster]);
app.get("/api/landcovermap", [jsonParser, getLandcover]);

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
