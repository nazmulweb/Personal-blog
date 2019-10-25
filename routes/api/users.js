const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../../modules/User");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "img/");
  },

  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    console.log(ext);
    cb(null, `${Date.now()}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// @route   Post api/user
// @desc    Create user
// @access  Public
router.post(
  "/",
  upload.single("photo"),
  [
    check("name", "Name is requird")
      .not()
      .isEmpty()
      .trim(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Plsease enter a password with 6 or more characters"
    ).isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { name, email, bio, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          errors: [{ msg: "Email already exists" }]
        });
      }

      user = new User({
        name,
        email,
        photo: req.file.path,
        bio,
        password
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      // console.log(user);
      await user.save();

      const payload = {
        id: user.id
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
