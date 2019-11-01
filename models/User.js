const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  name_user: {
    type: String,
    required: true
  },
  email_user: {
    type: String,
    required: true
  },
  password_user: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model("users", User);
