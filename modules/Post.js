const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String,
    required: true
  },
  imagecover: {
    type: String,
    required: true
  },
  images: [String],
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Number,
    required: true
  }
});

module.exports = Post = mongoose.model("Post", postSchema);
