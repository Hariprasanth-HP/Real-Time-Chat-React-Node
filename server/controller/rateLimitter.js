const redisClient = require("../redis");

module.exports.rateLimitter = (secondsLimit, totalAttempts) => {
  return async (req, res, next) => {
    const ip = await req.connection.remoteAddress;
    const [response] = await redisClient
      .multi()
      .incr(ip)
      .expire(ip, secondsLimit)
      .exec();
    console.log("response", response[1]);
    if (response[1] > totalAttempts) {
      res.json({
        loggedIn: false,
        status: "Too many attempts try after a min!",
      });
    } else {
      next();
    }
  };
};
