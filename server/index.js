const express = require("express");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const helmet = require("helmet");

const server = http.createServer(app);
const router = require("./routes/authRouter");
const {
  sessionMiddleware,
  wrap,
  corsConfig,
} = require("./controller/sessionController");
const {
  authoriseSocket,
  addFriend,
  initializeUser,
  onDisconnect,
} = require("./controller/socketcontroller");

require("dotenv").config();
const io = new Server(server, {
  cors: corsConfig,
});
app.use(helmet());
app.use(express.json());
app.use(cors(corsConfig));
app.use(sessionMiddleware);
io.use(wrap(sessionMiddleware));
io.use(authoriseSocket);
app.use("/auth", router);
io.on("connect", (socket) => {
  initializeUser(socket);

  socket.on("add_friend", (friendName, cb) => {
    addFriend(socket, friendName, cb);
  });

  socket.on("disconnecting", () => onDisconnect(socket));
});

server.listen(5000, () => {
  console.log("server is listening at port 5000");
});
