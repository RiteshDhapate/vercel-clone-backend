import express from "express";
import { registerController } from "../controllers/users/register.controller.js";
import { loginController } from "../controllers/users/login.controller.js";
import { verifyUserController } from "../controllers/users/verifyUser.controller.js";
import { resendOTPController } from "../controllers/users/resendOTP.controller.js";
import { projectsController } from "../controllers/users/projects.controller.js";

export const userRoute = express.Router();

userRoute.post("/register",registerController);
userRoute.post("/login",loginController);
userRoute.post("/verify-user", verifyUserController);
userRoute.post("/resend-otp", resendOTPController);
userRoute.post("/projects", projectsController);