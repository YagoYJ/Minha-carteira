const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Transaction = new Schema({
  action_transaction: {
    type: String,
    required: true
  },
  value_transaction: {
    type: String,
    required: true
  },
  origin_transaction: {
    type: String,
    required: true
  },
  destiny_transaction: {
    type: String,
    required: true
  },
  date_transaction: {
    type: String,
    required: true
  },
  type_transaction: {
    type: String,
    required: true
  },
  user_transaction: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  createAt: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model("transactions", Transaction);
