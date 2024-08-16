import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnection } from "./utils/dbConnection.js";
import { userRoute } from "./routes/user.route.js";
import { deployRoute } from "./routes/deploye.route.js";
import { Redis } from "ioredis";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const PORT = process.env.PORT || 2001;
const REDIS_URL = process.env.REDIS_URL;
const subscriber = new Redis(REDIS_URL);

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/v1/user", userRoute);
app.use("/v1/deploy", deployRoute);

dbConnection();

app.get("/", (req, res) => {
  res.send("Hello world");
});

server.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("user connected---->",socket.id);
  socket.on("subscribe", (channel) => {
  console.log("room join--->",channel);
    socket.join(channel);
    socket.emit("message", `Joined ${channel}`);
  });
});

async function initRedisSubscribe() {
  subscriber.psubscribe("logs:*");
  console.log("Subscribed to logs....");
  subscriber.on("pmessage", (pattern, channel, message) => {
    console.log(channel, "----->", message);final
    io.to(channel).emit("message", message);
  });
}

initRedisSubscribe();
