const model = require("../models/model");

exports.homepage = (req, res) => {
  res.sendFile('homepage.html', { root: '../nodejs-backend/templates' });
};

exports.weather_data = (req, res) => {
  var lat = req.params.lat;
  var long = req.params.long;
  model.weather_data_model(lat, long, function (finalldata) {
    res.send(finalldata);
  });
};

exports.elevation_data = (req, res) => {
  var lat = req.params.lat;
  var long = req.params.long;
  model.elevation_data_model(lat, long, function (finalldata) {
    res.send(finalldata);
  });
};

