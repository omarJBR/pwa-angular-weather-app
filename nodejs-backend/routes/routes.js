controller = require("../controllers/controller");

module.exports = app => {
    app.get("/",controller.homepage);
    app.get("/weather-data/:lat/:long", controller.weather_data);
    app.get("/elevation-data/:lat/:long", controller.elevation_data);
};
