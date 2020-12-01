const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  uuid: String,
  question: String,
  CreatedAt: String,
  CreatedBy: String,
  UpdatedAt: String,
  UpdatedBy: String,
  IsActive: Number,
});

module.exports = mongoose.model("Question", QuestionSchema, "questions");
