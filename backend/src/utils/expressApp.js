const express = require("express");
const isAuth = require("../middleware/jwt/isAuth");

const app = express();
app.use(isAuth);

module.exports = app