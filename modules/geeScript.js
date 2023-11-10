const ee = require("@google/earthengine");
const privateKey = require("../agristats-378216-b464955961eb.json");
const { geoJsonObj } = require("./data");

console.log("Authenticating Earth Engine API using private key...");
ee.data.authenticateViaPrivateKey(
  privateKey,
  () => {
    console.log("Authentication successful.");
    ee.initialize(
      null,
      null,
      () => {
        console.log("Earth Engine client library initialized.");
      },
      (err) => {
        console.log(err);
        console.log(
          `Please make sure you have created a service account and have been approved.
Visit https://developers.google.com/earth-engine/service_account#how-do-i-create-a-service-account to learn more.`
        );
      }
    );
  },
  (err) => {
    console.log(err);
  }
);

const getGeeRaster = async (req, res) => {
  //const slope = ee.Image("users/idoublegy/Mangrove_SeneGambia_2015-2020").select("mang15");
  //const slope = srtm.select('discrete_classification')
  const dataset = ee.Image("users/idoublegy/Mangrove_SeneGambia_2015-2020_old");
  const mangrove_2015 = dataset.select("mang15");
  const mangrove_2020 = dataset.select("mang20");
  const changeMap = mangrove_2015.subtract(mangrove_2020).rename("change");

  const mangrove_2015_map = mangrove_2015.mask(mangrove_2015.neq(0));
  const mangrove_2020_map = mangrove_2015.mask(mangrove_2020.neq(0));
  const changeMap_2015_2020 = changeMap.mask(changeMap.neq(0));

  const mangVis = { min: 1, max: 1, palette: ["04ff17"] };
  const changeVis = { min: -1, max: 1, palette: ["red", "green"] };

  const mang2015layer = mangrove_2015_map.getMap(mangVis);
  const mang2020layer = mangrove_2020_map.getMap(mangVis);
  const changeMaplayer = changeMap_2015_2020.getMap(changeVis);

  const results = {
    tileList: [mang2015layer.mapid, mang2020layer.mapid, changeMaplayer.mapid],
  };

  res.send(results);
};

const getLandcover = async (req, res) => {
  const geometry = {
    type: "Polygon",
    coordinates: [
      [
        [-30.145291556356028, 39.730625901520824],
        [-30.145291556356028, -9.82077800097936],
        [34.527188092225856, -9.82077800097936],
        [34.527188092225856, 39.730625901520824],
        [-30.145291556356028, 39.730625901520824],
      ],
    ],
  };

  // Convert the geometry to an Earth Engine Geometry object
  //const clipgeometry = ee.Geometry.Polygon(geometry.coordinates, null, false);

  const landcoverdata = ee.ImageCollection("ESA/WorldCover/v100").first();

  const landCover = landcoverdata.clip(geometry);

  //console.log(landCover);

  var sld_intervals =
    "<RasterSymbolizer>" +
    '<ColorMap type="ramp">' +
    '<ColorMapEntry color="#006400" quantity="10" label="Class 10" />' +
    '<ColorMapEntry color="#ffbb22" quantity="20" label="Class 20" />' +
    '<ColorMapEntry color="#ffff4c" quantity="30" label="Class 30" />' +
    '<ColorMapEntry color="#f096ff" quantity="40" label="Class 40" />' +
    '<ColorMapEntry color="#fa0000" quantity="50" label="Class 50" />' +
    '<ColorMapEntry color="#b4b4b4" quantity="60" label="Class 60" />' +
    '<ColorMapEntry color="#f0f0f0" quantity="70" label="Class 70" />' +
    '<ColorMapEntry color="#0064c8" quantity="80" label="Class 80" />' +
    '<ColorMapEntry color="#0096a0" quantity="90" label="Class 90" />' +
    '<ColorMapEntry color="#00cf75" quantity="95" label="Class 95" />' +
    '<ColorMapEntry color="#fae6a0" quantity="100" label="Class 100" />' +
    "</ColorMap>" +
    "</RasterSymbolizer>";

  const visualization = {
    bands: ["Map"],
  };

  const landcovermap = landCover.getMap(visualization);

  const results = { tileList: [landcovermap.mapid] };

  res.send(results);
};

module.exports = {
  getGeeRaster,
  getLandcover,
};

// ColorMapEntry color="#fae6a0
