// Baixar Módulos:
// npm install --save express mongoose body-parser express-handlebars express-session connect-flash
// npm install -g --save nodemon

// IMPORTAÇÕES DO NODE_MODULES:
const express = require("express");
const handlebars = require("express-handlebars");
const session = require("express-session");
const bodyparser = require("body-parser");
const path = require("path");
const flash = require("connect-flash");
const passport = require("passport");
const mongoose = require("mongoose");

// IMPORTAÇÕES INTERNAS:
const app = express();

// rotas
const admin = require("./routes/admin");
const user = require("./routes/user");

// models:
require("./models/User");
const User = mongoose.model("users");

// config do bd:
const db = require("./config/db");

// passport
require("./config/auth")(passport);

// CONFIGURAÇÕES:

// bodyparser:
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// handlebars:
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// mongoose:
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb+srv://<username>:<password>@campskate-4wgyg.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Conectado com o BD MinhaCarteira");
  })
  .catch(error => {
    console.log("Erro ao se conectar com o BD MinhaCarteira => " + error);
  });

// public:
app.use(express.static(path.join(__dirname, "public")));

// session:
app.use(
  session({
    secret: "passwordsession",
    resave: true,
    saveUninitialized: true
  })
);

// passport:
app.use(passport.initialize());
app.use(passport.session());

// flash:
app.use(flash());

// middlewares:
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// ROTAS:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/cadastro", (req, res) => {
  res.render("user/cadastro");
});

// OUTRAS CONFIGURAÇÕES:

app.use("/user", user);
app.use("/admin", admin);

// PORTA DE CONEXÃO:
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log("Server rodando...");
});
