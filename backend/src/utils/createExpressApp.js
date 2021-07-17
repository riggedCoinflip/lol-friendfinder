const express = require("express");
const isAuth = require("../middleware/jwt/isAuth");
const routes = require("../routes/avatar")
const cors = require("cors")

module.exports = function () {
    const app = express()
    app.use(cors())
    //use auth middleware
    app.use(isAuth)

    //mount routes
    app.get("/", (req, res,next) => {
        res.send("Hello")
        next()
    })
    app.use("/api", routes)
    app.use(express.static('files')) //TODO delete after riot-verified, only temporary

    return app
}