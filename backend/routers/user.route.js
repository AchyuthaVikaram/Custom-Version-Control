const express = require("express");
const usercontroller= require("../controllers/userController");
const userRouter = express.Router();

userRouter.get("/allUsers",usercontroller.getALlUsers);
userRouter.post("/signup",usercontroller.signup);
userRouter.post("/login",usercontroller.login);
userRouter.get("/userProfile/:id",usercontroller.getUserProfie);
userRouter.put("/updateProfile/:id",usercontroller.updateUserProfile);
userRouter.delete("/deleteProfile/:id",usercontroller.deleteUserProfile);

module.exports=userRouter;

