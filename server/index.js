require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql");

const app = express();
app.use(express.json()); // still useful for future GraphQL mutations

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(" MongoDB connected");

    // Start server
    app.listen(process.env.PORT || 5000, () => {
      console.log(" Server running on port", process.env.PORT || 5000);
      console.log(" GraphQL endpoint: http://localhost:5000/graphql");
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// GraphQL middleware
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true, // enables GraphiQL UI in browser
  })
);
