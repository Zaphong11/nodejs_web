var express = require("express");
var config = require("config");
var bodyParser = require("body-parser");
var session = require("express-session");

var app = express();
//Body parser
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: config.get("secret_key"),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.set("views", __dirname + "/a    pps/views");
app.set("view engine", "ejs");

//Static folder
app.use("/static", express.static(__dirname + "/public"))

var controlers = require(__dirname + "/apps/controller");

app.use(controlers);

var host = config.get("sever.host");
var port = config.get("sever.port");

app.listen(port,host, function(){
    console.log("Sever is running on port ", port);
});

