//Third party modules
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const path = require("path");

//Bring in connection and models
const { mongoose } = require("./db/mongoose");
const { User } = require("./models/user");

//bring in passport configuration
require("./config/passport")(passport);

//Bring in our routes
const index = require("./routes/index");
const auth = require("./routes/auth");
const movie = require("./routes/movie");

//Initiate Express Application
const app = express();
const port = process.env.PORT || 3000;

//set engine to handlebars and default layout to main
app.engine("handlebars", exphbs({ defaultLayout: "main" }));

//Third party middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "handlebars");

//initialize cookie parser
app.use(cookieParser());

//setup session
app.use(
  session({
    secret: "somethingFunky",
    resave: false,
    saveUninitialized: true
  })
);

//passport middleware -> required for passport to work
app.use(passport.initialize());
app.use(passport.session());

//gives us access to the user in every route
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//use our routes
app.use("/", index);
app.use("/auth", auth); //any request that begins with /auth, use this route
app.use("/movie", movie);

//Listen for connections
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
