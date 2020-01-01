// IMPORTAÇÕES DO NODE_MODULES:
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// IMPORTAÇÕES DOS MODELS:
require("../models/User");
const User = mongoose.model("users");

// OUTRAS IMPORTAÇÕES:
const bcrypt = require("bcryptjs");
const passport = require("passport");

// ROTAS GET

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "Você foi deslogado");
  res.redirect("/");
});

router.get("/editar-usuario/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .then(user => {
      res.render("user/editarUsuario");
    })
    .catch(error => {
      req.flash("error_msg", "Erro ao encontrar o usuário => " + error);
      res.redirect("/admin");
    });
});

// ROTAS POST

router.post("/new", (req, res) => {
  var errors = [];

  if (
    !req.body.name_user ||
    typeof req.body.name_user == undefined ||
    req.body.name_user == null
  ) {
    errors.push({
      text: "Nome inválido"
    });
  }

  if (
    !req.body.email_user ||
    typeof req.body.email_user == undefined ||
    req.body.email_user == null
  ) {
    errors.push({
      text: "E-mail inválido"
    });
  }

  if (
    !req.body.password_user ||
    typeof req.body.password_user == undefined ||
    req.body.password_user == null
  ) {
    errors.push({
      text: "Senha inválida"
    });
  }

  if (req.body.name_user.length < 3) {
    errors.push({
      text: "Nome muito curto"
    });
  }

  if (req.body.password_user !== req.body.confirmPassword_user) {
    errors.push({
      text: "Senhas incompatíveis"
    });
  }

  if (errors.length > 0) {
    res.render("user/cadastro", { errors: errors });
  } else {
    User.findOne({ email_user: req.body.email_user })
      .then(user => {
        if (user) {
          req.flash("error_msg", "Usuário já existente");
          res.redirect("/cadastro");
        } else {
          const newUser = {
            name_user: req.body.name_user,
            email_user: req.body.email_user,
            password_user: req.body.password_user
          };

          bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(newUser.password_user, salt, (error, hash) => {
              if (error) {
                req.flash("error_msg", "Houve um ao criptografar a senha");
                res.redirect("/");
              } else {
                newUser.password_user = hash;

                new User(newUser)
                  .save()
                  .then(() => {
                    req.flash("success_msg", "Usuário cadastrado com sucesso!");
                    res.redirect("/");
                  })
                  .catch(error => {
                    req.flash(
                      "error_msg",
                      "Erro ao cadastrar o usuário => " + error
                    );
                    res.redirect("/");
                  });
              }
            });
          });
        }
      })
      .catch(error => {
        req.flash("error_msg", "Erro ao encontrar usuário => " + error);
        res.redirect("/");
      });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/admin/geral",
    failureRedirect: "/",
    failureFlash: true
  })(req, res, next);
});

router.post("/editUser", (req, res) => {
  var errors = [];

  if (
    !req.body.name_user ||
    typeof req.body.name_user == undefined ||
    req.body.name_user == null
  ) {
    errors.push({
      text: "Nome inválido"
    });
  }

  if (
    !req.body.email_user ||
    typeof req.body.email_user == undefined ||
    req.body.email_user == null
  ) {
    errors.push({
      text: "E-mail inválido"
    });
  }

  if (
    !req.body.password_user ||
    typeof req.body.password_user == undefined ||
    req.body.password_user == null
  ) {
    errors.push({
      text: "Senha inválida"
    });
  }

  if (req.body.name_user.length < 3) {
    errors.push({
      text: "Nome muito curto"
    });
  }

  if (req.body.password_user !== req.body.confirmPassword_user) {
    errors.push({
      text: "Senhas incompatíveis"
    });
  }

  if (errors.length > 0) {
    res.render("user/editarUsuario", { errors: errors });
  } else {
    User.findOne({ _id: req.body.id })
      .then(user => {
        user.name_user = req.body.name_user;
        user.email_user = req.body.email_user;
        user.password_user = req.body.password_user;
        user._id = req.body.id;

        bcrypt.genSalt(10, (error, salt) => {
          bcrypt.hash(user.password_user, salt, (error, hash) => {
            if (error) {
              req.flash("error_msg", "Houve um ao criptografar a senha");
              res.redirect("/");
            } else {
              user.password_user = hash;

              user
                .save()
                .then(user => {
                  req.flash("success_msg", "Usuário editado com sucesso.");
                  res.redirect("/admin/geral");
                })
                .catch(error => {
                  req.flash(
                    "error_msg",
                    "Erro ao editar o usuário => " + error
                  );
                  res.redirect("/user/editar-usuario/{{user._id}}");
                });
            }
          });
        });
      })
      .catch(error => {
        req.flash("error_msg", "Erro ao encontrar o usuário => " + error);
        res.redirect("/admin/geral");
      });
  }
});

module.exports = router;
