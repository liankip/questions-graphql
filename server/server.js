const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const uri =
  "mongodb+srv://lionkip:liandi99)@cluster0.nqkp0.mongodb.net/db_questions?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(cors());
app.use(
  "/graphql",
  cors(),
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

module.exports = app;
