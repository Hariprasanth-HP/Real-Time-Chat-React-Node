const redisClient = require("../redis");
module.exports.authoriseSocket = async (socket, next) => {
  if (!socket.request.session || !socket.request.session.user) {
    console.log("bad request");
    next(new Error("Not authorised"));
  } else {
    next();
  }
};
module.exports.initializeuser = async (socket) => {
  socket.user = { ...socket.request.session.user };
  await redisClient.hset(
    `userid:${socket.user.username}`,
    "userid",
    socket.user.userid
  );
  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  console.log("friendlist emitted", friendList);
  socket.emit("friends", friendList);
};
module.exports.addFriend = async (socket, friendName, cb) => {
  const friendUserId = await redisClient.hget(`userid:${friendName}`, "userid");
  const currentFriendlist = await redisClient.lrange(
    `friends:${friendName}`,
    0,
    -1
  );
  console.log(
    "currentFriendlist",
    currentFriendlist,
    friendName,
    friendUserId,
    socket.user.userid,
    socket.user.username
  );
  if (friendUserId === socket.user.userid) {
    console.log("cant add self");
    cb({ done: false, errorMsg: "cant add self" });
    return;
  }
  if (!friendUserId) {
    cb({ done: false, errorMsg: "user dont exist" });
    return;
  }
  if (currentFriendlist && currentFriendlist.indexOf(friendName) !== -1) {
    cb({ done: false, errorMsg: "user already added" });
    return;
  }
  await redisClient.lpush(`friends:${socket.user.username}`, friendName);
  cb({ done: true });
};
