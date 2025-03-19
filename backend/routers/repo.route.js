const express = require("express");
const repoController = require("../controllers/repoController");
const repoRouter = express.Router();

repoRouter.post("/repo/create",repoController.createRepository);
repoRouter.get("/repo/all",repoController.getAllRepositories);
repoRouter.get("/repo/:id",repoController.getRepositoryById);
repoRouter.get("/repo/name/:name",repoController.getRepositoryByName);
repoRouter.get("/repo/user/:userId",repoController.fetchRepositoryForCurrUser);
repoRouter.put("/repo/update/:id",repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id",repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggele/:id",repoController.toggleVisibility);

module.exports = repoRouter;


