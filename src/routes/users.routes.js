import { Router } from "express";
import { loginUser, userLoggedOut, userRegister } from "../controllers/users.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/register").post(userRegister)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT , userLoggedOut)

export default router