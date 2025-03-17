const express = require("express");
const usercontroller= require("../controllers/userController");
const userRouter = express.Router();

userRouter.get("/allUsers",usercontroller.getALlUsers);
userRouter.post("/signup",usercontroller.signup);
userRouter.post("/login",usercontroller.login);
userRouter.get("/userProfile",usercontroller.getUserProfie);
userRouter.put("/updateProfile",usercontroller.updateUserProfile);
userRouter.delete("/deleteProfile",usercontroller.deleteUserProfile);

module.exports=userRouter;

