// IMPORTAÇÕES DO NODE_MODULES:
const express = require("express");
const mongoose = require("mongoose");

// IMPORTAÇÕES DOS MODELS:
require("../models/Transaction");
const Transaction = mongoose.model("transactions");
require("../models/User");
const User = mongoose.model("users");

// OUTRAS IMPORTAÇÕES:
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// ROTAS GET:
// Tabelas:

router.get("/geral", (req, res) => {
  Transaction.find({ user_transaction: res.locals.user })
    .sort({ createAt: "desc" })
    .then(transactions => {
      res.render("admin/geral", { transactions: transactions });
    })
    .catch(error => {
      req.flash("error_msg", "Erro ao carregar as transações => " + error);
      res.redirect("/admin");
    });
});

router.get("/recebidos", (req, res) => {
  Transaction.find({
    type_transaction: "table-success",
    user_transaction: res.locals.user
  })
    .then(transactions => {
      res.render("admin/recebidos", { transactions: transactions });
    })
    .catch(error => {
      req.flash("error_msg", "Erro ao carregar as transações => " + error);
      res.redirect("/admin/geral");
    });
});

router.get("/comprados", (req, res) => {
  Transaction.find({
    type_transaction: "table-warning",
    user_transaction: res.locals.user
  })
    .then(transactions => {
      res.render("admin/comprados", { transactions: transactions });
    })
    .catch(error => {
      req.flash("error_msg", "Erro ao carregar as transações => " + error);
      res.redirect("/admin/geral");
    });
});

router.get("/devendo", (req, res) => {
  Transaction.find({
    type_transaction: "table-danger",
    user_transaction: res.locals.user
  })
    .then(transactions => {
      res.render("admin/devendo", { transactions: transactions });
    })
    .catch(error => {
      req.flash("error_msg", "Erro ao carregar as transações => " + error);
      res.redirect("/admin/geral");
    });
});

router.get("/interesses", (req, res) => {
  Transaction.find({
    type_transaction: "table-primary",
    user_transaction: res.locals.user
  })
    .then(transactions => {
      res.render("admin/interesses", { transactions: transactions });
    })
    .catch(error => {
      req.flash("error_msg", "Erro ao carregar as transações => " + error);
      res.redirect("/admin/geral");
    });
});

router.get("/ver-mais/:id_transaction", (req, res) => {
  Transaction.findOne({ _id: req.params.id_transaction })
    .then(transaction => {
      res.render("admin/verMais", { transaction: transaction });
    })
    .catch(error => {
      req.flash("error_msg", "Erro ao localizar a transação => " + error);
      res.redirect("/admin/geral");
    });
});

router.get("/edit/:id_transaction", (req, res) => {
  Transaction.findById({ _id: req.params.id_transaction })
    .then(transaction => {
      res.render("admin/editar", { transaction: transaction });
    })
    .catch(error => {
      req.flash("error_msg", "Erro ao encontrar a transação => " + error);
      res.redirect("/admin/geral");
    });
});

// Cadastros:

router.get("/cadastro/nova-transacao", (req, res) => {
  res.render("admin/cadastroCompleto");
});

router.get("/cadastro/nova-transacao/:type_transaction", (req, res) => {
  res.render("admin/cadastroGeral", {
    type_transaction: req.params.type_transaction
  });
});

// ROTAS POST:

router.post("/transaction/new", (req, res) => {
  var error = [];

  if (
    !req.body.action_transaction ||
    typeof req.body.action_transaction == undefined ||
    req.body.action_transaction == null
  ) {
    error.push({
      text: "Nome inválido"
    });
  }

  if (
    !req.body.value_transaction ||
    typeof req.body.value_transaction == undefined ||
    req.body.value_transaction == null
  ) {
    error.push({
      text: "Valor inválido"
    });
  }

  if (
    !req.body.origin_transaction ||
    typeof req.body.origin_transaction == undefined ||
    req.body.origin_transaction == null
  ) {
    error.push({
      text: "Origem inválida"
    });
  }

  if (
    !req.body.destiny_transaction ||
    typeof req.body.destiny_transaction == undefined ||
    req.body.destiny_transaction == null
  ) {
    error.push({
      text: "Destino inválido"
    });
  }

  if (
    !req.body.date_transaction ||
    typeof req.body.date_transaction == undefined ||
    req.body.date_transaction == null
  ) {
    error.push({
      text: "Data inválida"
    });
  }

  if (
    !req.body.type_transaction ||
    typeof req.body.type_transaction == undefined ||
    req.body.type_transaction == null
  ) {
    error.push({
      text: "Tipo inválido"
    });
  }

  if (error.length > 0) {
    res.render("admin/cadastroCompleto", { error: error });
  } else {
    var formatDate = req.body.date_transaction.split("-");

    const newTransaction = {
      action_transaction: req.body.action_transaction,
      value_transaction: req.body.value_transaction,
      origin_transaction: req.body.origin_transaction,
      destiny_transaction: req.body.destiny_transaction,
      date_transaction:
        formatDate[2] + "/" + formatDate[1] + "/" + formatDate[0],
      type_transaction: req.body.type_transaction,
      user_transaction: res.locals.user._id
    };

    new Transaction(newTransaction)
      .save()
      .then(() => {
        req.flash("success_msg", "Transação adicionada com sucesso!");
        res.redirect("/admin/geral");
      })
      .catch(error => {
        req.flash("error_msg", "Erro ao adicionar a transação => " + error);
        res.redirect("/admin/geral");
      });
  }
});

router.post("/transaction/edit", (req, res) => {
  var formatDate = req.body.date_transaction.split("-");
  Transaction.findOne({ _id: req.body.id_transaction }).then(transaction => {
    transaction.action_transaction = req.body.action_transaction;
    transaction.value_transaction = req.body.value_transaction;
    transaction.origin_transaction = req.body.origin_transaction;
    transaction.destiny_transaction = req.body.destiny_transaction;
    transaction.date_transaction =
      formatDate[2] + "/" + formatDate[1] + "/" + formatDate[0];
    transaction.type_transaction = req.body.type_transaction;
    transaction.user_transaction = res.locals.user._id;

    transaction
      .save()
      .then(transaction => {
        req.flash("success_msg", "Transação editada com sucesso.");
        res.redirect("/admin/geral");
      })
      .catch(error => {
        req.flash("error_msg", "Erro ao editar transação => " + error);
        res.redirect("/admin/geral/ver-mais/{{req.body.id_transaction}}");
      });
  });
});

module.exports = router;
