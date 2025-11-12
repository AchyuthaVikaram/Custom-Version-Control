const express = require("express");
const Router = express.Router();

const userRouter = require("./user.route");
const repoRouter = require("./repo.route");
const issueRouter = require("./issue.route");
const vcsRouter = require("./vcs.route");

Router.get("/", (req, res) => {
	res.send("Welcome!!");
});
Router.use(userRouter);
Router.use(repoRouter);
Router.use(issueRouter);
Router.use(vcsRouter);

module.exports = Router;
