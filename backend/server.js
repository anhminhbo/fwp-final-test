const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.use(express.json());
const url =
  "mongodb+srv://anhminhbo:anhminh1234@minhcluster.jm6xt.mongodb.net/finaltest?retryWrites=true&w=majority";
mongoose.connect(url);

var UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

var User = mongoose.model("User", UserSchema);

var MyLogSchema = new mongoose.Schema({
  date: String,
  ip: String,
  url: String,
});

var MyLog = mongoose.model("mylog", MyLogSchema);

var BlacklistSchema = new mongoose.Schema({
  ip: String,
});

var Blacklist = mongoose.model("blacklist", BlacklistSchema);

const mylog = (req, res, next) => {
  const date = new Date();
  let ips = (
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    ""
  ).split(",");

  const ip = ips[0].trim();

  const url = req.headers.host;

  Blacklist.find({}, function (err, blacklist) {
    if (blacklist.includes(ip))
      res.send({ result: "You are not allow to access the server" });
  });
  MyLog.create({ date, ip, url }, function (err, result) {
    next();
  });
};

app.get("/statistic", mylog, function (req, res) {
  const agg = req.query.agg;
  User.find({}, function (err, Users) {
    if (agg === "max") {
      const maximum = Math.max(...Users.map((o) => o.age));

      res.send({ result: maximum });
    }

    if (agg === "min") {
      const minimum = Math.min(...Users.map((o) => o.age));

      res.send({ result: minimum });
    }

    if (agg === "avg") {
      let avg = 0;
      for (const user of Users) {
        avg += user.age;
      }
      avg /= Users.length;

      res.send({ result: avg });
    }
  });
});

app.get("/index", mylog, (req, res) => {
  res.send({ status: "Success" });
});

app.listen(4001, () => console.log("server listening on 4001"));
