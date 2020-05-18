const request = require("request");

const weather_api_key = process.env.WEATHER_API_TOKEN;
const elevation_api_key = process.env.ELEVATION_API_TOKEN;

exports.weather_data_model = (lat, long, callback) => {
  request.get({ url: "https://api.darksky.net/forecast/" + weather_api_key + "/" + lat + "," + long + "" }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = { dataRespone: body };
      return callback(data.dataRespone);
    };
  });
};

exports.elevation_data_model = (lat, long, callback) => {
  request.get({ url: "https://elevation-api.io/api/elevation?points=(" + lat + "," + long + ")&key=" + elevation_api_key + "" }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = { dataRespone: body };
      return callback(data.dataRespone);
    };
  });
};
