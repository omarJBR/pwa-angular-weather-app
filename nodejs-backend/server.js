const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

routes = require("./routes/routes")(app);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`App listening on port ${port}!`));
