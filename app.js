//Third party modules
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const path = require("path");

//Bring in connection and models
const { mongoose } = require("./db/mongoose");

//Initiate Express Application
const app = express();
const port = process.env.PORT || 3000;

//set engine to handlebars and default layout to main
app.engine("handlebars", exphbs({defaultLayout: "main"}));

//Third party middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'handlebars');

//Listen for connections
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});




