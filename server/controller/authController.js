const pool = require("../db");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
module.exports.validateSession = async (req, res) => {
  console.log("req.session", req.session);
  if (req.session.user && req.session.user.username) {
    res.json({ loggedIn: true, username: req.session.user.username });
  } else {
    res.json({ loggedIn: false });
  }
};
module.exports.registerAttempt = async (req, res) => {
  const userList = await pool.query("SELECT * FROM USERS WHERE username=$1", [
    req.body.username,
  ]);
  if (userList.rowCount === 0) {
    const hashedpassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (username,passhash,userid) VALUES ($1,$2,$3) RETURNING id,username,userid",
      [req.body.username, hashedpassword, uuid()]
    );
    req.session.user = {
      username: req.body.username,
      id: newUser.rows[0].id,
      userid: newUser.rows[0].userid,
    };
    res.json({ loggedIn: true, username: req.body.username });
  } else {
    res.json({ loggedIn: false, status: "Username already exist!" });
  }
};
module.exports.loginAttempt = async (req, res) => {
  const potentialUser = await pool.query(
    "SELECT username, id,passhash,userid from users u WHERE u.username=$1 ",
    [req.body.username]
  );
  console.log("req.session", req.session);
  if (potentialUser.rowCount > 0) {
    //login
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      potentialUser.rows[0].passhash
    );
    if (isValidPassword) {
      console.log();
      req.session.user = {
        username: req.body.username,
        id: potentialUser.rows[0].id,
        userid: potentialUser.rows[0].userid,
      };
      res.json({ loggedIn: true, username: req.body.username });
    } else {
      console.log("Invalid Username or password !");
      res.json({ loggedIn: false, status: "Invalid Username or password !" });
    }
  } else {
    console.log("Invalid Username or password !");

    res.json({ loggedIn: false, status: "Invalid Username or password !" });
  }
};
