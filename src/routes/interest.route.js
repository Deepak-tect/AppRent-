import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { expressInterest } from "../controllers/interestController.controller.js";


const router = Router();

router.route("/add-interests").get(verifyJWT , expressInterest)

export default router