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
  initializeuser,
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
// io.on("connect", (socket) => {
//   console.log("socket", socket.id, socket.request.session.user);
//   initializeuser(socket);
//   socket.on("add_friend", (friendName, cb) =>
//     addFriend(socket, friendName, cb)
//   );
// });
io.on("connect", (socket) => {
  console.log("ioooo connected");
  initializeuser(socket);

  socket.on("add_friend", (friendName, cb) => {
    addFriend(socket, friendName, cb);
  });
});
server.listen(5000, () => {
  console.log("server is listening");
});
