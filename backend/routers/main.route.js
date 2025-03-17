const express = require("express");
const Router = express.Router();

const userRouter = require("./user.route");

Router.get("/", (req, res) => {
	res.send("Welcome!!");
});
Router.use(userRouter);

module.exports = Router;
