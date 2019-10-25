const express = require("express");
const router = express.Router();
const multer = require("multer");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Category = require("../../modules/Category");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "img/post");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
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

const postPhotoUPload = upload.fields([
  { name: "imagecover", maxCount: 1 },
  { name: "images", maxCount: 3 }
]);

// @route   Post api/user
// @desc    Create post
// @access  Private
router.post(
  "/",
  auth,
  postPhotoUPload,
  [
    check("title", "Title is required")
      .not()
      .isEmpty(),
    check("imagecover", "Cover image is required")
      .not()
      .isEmpty(),
    check("description", "Description is required")
      .not()
      .isEmpty(),
    check("status", "Staus is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    console.log(req.body);
    try {
    } catch (e) {
      console.log(e.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
