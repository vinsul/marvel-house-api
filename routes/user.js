const express = require("express");
const router = express.Router();
const formidableMiddleware = require("express-formidable");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

router.use(formidableMiddleware());

const User = require("../models/User");

// CREER UN COMPTE
router.post("/user/sign_up", async (req, res) => {
  try {
    const userAlreadyExist = await User.findOne({
      email: req.fields.email,
    });

    if (userAlreadyExist) {
      return res.status(400).json({ message: "User already used" });
    } else {
      const salt = uid2(16);
      const token = uid2(16);
      const hash = SHA256(req.fields.password + salt).toString(encBase64);

      const user = new User({
        email: req.fields.email,
        token: token,
        salt: salt,
        hash: hash,
        account: {
          username: req.fields.username,
          firstname: req.fields.firstname,
          lastname: req.fields.lastname,
        },
      });

      await user.save();

      return res.json({
        _id: user._id,
        token: user.token,
        account: {
          username: user.account.username,
          firstname: user.account.firstname,
          lastname: user.account.lastname,
        },
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// SE CONNECTER
router.post("/user/log_in", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });

    const hash = SHA256(req.fields.password + user.salt).toString(encBase64);

    if (hash === user.hash) {
      return res.json({
        _id: user._id,
        token: user.token,
        account: {
          username: user.account.username,
          firstname: user.account.firstname,
          lastname: user.account.lastname,
        },
      });
    } else {
      return res.status(400).json({ message: "Wrong password" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
