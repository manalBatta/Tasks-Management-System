require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql");
const WebSocket = require("ws");
const http = require("http");
const cors = require("cors"); // Add this line at the top

const Message = require("./models").Message; // Import Message model

const app = express();
app.use(cors()); // Add this line before any routes or middleware
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");

    const server = http.createServer(app);

    // Create WebSocket server attached to same HTTP server
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
      console.log("WebSocket client connected");
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
            // Invalid message format, do not broadcast
            console.warn(
              "Invalid chat message received, not broadcasting:",
              parsed
            );
            return;
          }
        } catch (err) {
          // Not valid JSON, do not broadcast
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
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log("Server running on port", PORT);
      console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// GraphQL middleware
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
