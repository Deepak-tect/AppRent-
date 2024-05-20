import jwt from "jsonwebtoken"
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
const verifyJWT = async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        // console.log(req.header("Authorization"))
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        next(error);
        // throw new ApiError(401, error?.message || "Invalid access token")
    }
    
}

export {verifyJWT}