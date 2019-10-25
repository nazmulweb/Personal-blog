const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Category = require("../../modules/Category");

// @route   GET api/auth
// @desc    create category
// @access  private
router.post(
  "/",
  auth,
  [
    check("category", "Category name is required")
      .not()
      .isEmpty(),
    check("status", "Status is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { category, status } = req.body;

    try {
      let categories = await Category.findOne({ category });
      console.log(categories);
      if (categories) {
        return res.status(400).json({
          errors: [{ msg: "Category already exists" }]
        });
      }

      categories = new Category({
        category,
        status
      });

      const success = await categories.save();
      if (success) {
        return res.status(200).json({
          success: [{ msg: "Successfully added" }]
        });
      }
    } catch (e) {
      console.log(e.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const allCategory = await Category.find();
    if (allCategory) {
      return res.status(200).json({
        success: [{ msg: "Success" }],
        data: [res.json(allCategory)]
      });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server error");
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const updateCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (updateCategory) {
      return res.status(200).json({
        success: [{ msg: "Success" }],
        data: [res.json(updateCategory)]
      });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    const message = await category.remove();
    if (message) {
      return res.status(200).json({
        success: [{ msg: "Deleted successfully" }]
      });
    }
  } catch (e) {
    console.log(e.message);
    if (e.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Sever error");
  }
});

module.exports = router;
