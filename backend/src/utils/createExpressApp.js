const express = require("express");
const isAuth = require("../middleware/jwt/isAuth");
const routes = require("../routes/avatar")

module.exports = function () {
    const app = express()

    //use auth middleware
    app.use(isAuth)

    //mount routes
    app.get("/", (req, res,next) => {
        res.send("Hello")
        next()
    })
    app.use("/api", routes)

    return app
}