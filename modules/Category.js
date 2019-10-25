const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Category = mongoose.model("Category", categorySchema);
