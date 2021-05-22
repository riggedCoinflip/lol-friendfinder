const express = require("express");
const isAuth = require("../middleware/jwt/is-auth");

const app = express();
app.use(isAuth);

module.exports = app