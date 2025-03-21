const express = require("express");
const usercontroller = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/authentication");
const { isAuthorizedUser } = require("../middlewares/authorization");
const userRouter = express.Router();

userRouter.post("/signup", usercontroller.signup);
userRouter.post("/login", usercontroller.login);
userRouter.get("/allUsers", isAuthenticated, usercontroller.getALlUsers);
userRouter.get(
	"/userProfile/:id",
	isAuthenticated,
	isAuthorizedUser,
	usercontroller.getUserProfie
);
userRouter.put(
	"/updateProfile/:id",
	isAuthenticated,
	isAuthorizedUser,
	usercontroller.updateUserProfile
);
userRouter.delete(
	"/deleteProfile/:id",
	isAuthenticated,
	isAuthorizedUser,
	usercontroller.deleteUserProfile
);

module.exports = userRouter;
