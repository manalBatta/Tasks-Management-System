require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql");
const WebSocket = require("ws");
const http = require("http");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { Messageser } = require("./models");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const token = req.header("x-auth-token");
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      console.error("Token verification error:", err);
    }
  }
  next();
});

const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const server = http.createServer(app);

    // Create WebSocket server attached to same HTTP server
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
      ws.on("message", async (message) => {
        let out;
        try {
          // Always parse the message (handle Buffer or string)
          const msgStr =
            typeof message === "string" ? message : message.toString();
          const parsed = JSON.parse(msgStr);

          // Validate required fields
          if (
            parsed &&
            typeof parsed === "object" &&
            parsed.senderId &&
            parsed.receiverId &&
            parsed.message
          ) {
            out = JSON.stringify(parsed);
            const savedMessage = new Message(parsed);
            await savedMessage.save();
          } else {
            console.warn(
              "Invalid chat message received, not broadcasting:",
              parsed
            );
            return;
          }
        } catch (err) {
          console.warn(
            "Non-JSON or invalid message received, not broadcasting:",
            message
          );
          return;
        }

        // Broadcast only valid messages
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(out);
          }
        });
      });
    });

    // Start HTTP server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log("Server running on port", PORT);
      console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// GraphQL middleware
app.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema,
    graphiql: true,
    context: { req },
  }))
);
