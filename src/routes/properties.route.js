import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProperty, deleteProperty, getProperties, getPropertiesByUser, getPropertyById, updateProperty } from "../controllers/property.controller.js";

const router = Router();


router.route("/create-property").post(verifyJWT , createProperty)
router.route("/get-all-property").get(verifyJWT , getProperties)
router.route("/update-property").post(verifyJWT , updateProperty)
router.route("/delete-property").delete(verifyJWT , deleteProperty)
router.route("/get-property-id").get(verifyJWT , getPropertyById)
router.route("/get-property-by-user").get(verifyJWT , getPropertiesByUser);
export default router