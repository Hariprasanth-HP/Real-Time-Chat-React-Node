const session = require("express-session");
const redisClient = require("../redis");
const RedisStore = require("connect-redis").default;
require("dotenv").config();

const sessionMiddleware = session({
  secret: process.env.COOKIE_SECRET,
  credentials: true,
  name: "sid",
  store: new RedisStore({
    client: redisClient,
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    expires: 1000 * 60 * 60 * 24,
    sameSite: "lax",
  },
});
const wrap = (expressSession) => (socket, next) => {
  expressSession(socket.request, {}, next);
};
const corsConfig = {
  origin: "http://localhost:3000",
  credentials: true,
};
module.exports = { sessionMiddleware, wrap, corsConfig };
