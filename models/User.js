const mongoose = require("mongoose")

const User = mongoose.model("User", {
    email: { type: String, unique: true },
    token: String,
    hash: String,
    salt: String,
    account: {
      username: { type: String, required: true },
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
    },
  });

  module.exports = User;