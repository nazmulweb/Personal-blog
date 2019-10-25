const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../modules/User");

// @route   GET api/auth
// @desc    Get auth user
// @access  private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (e) {
    console.log(e);
    res.status(500).send("Server error");
  }
});

// @route   GET api/auth
// @desc    signin
// @access  Public
router.post(
  "/",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          errors: "Invalid email or password"
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          errors: "Invalid email or password"
        });
      }

      const payload = {
        user: { id: user.id }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.json({
            msg: "Success",
            token,
            data: {
              user
            }
          });
        }
      );
    } catch (e) {
      console.log(e);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
