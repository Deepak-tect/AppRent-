import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/User.js"
import jwt from "jsonwebtoken";
const generateAccessTokenandRefreshToken = async(user)=>{
    try {
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        await User.updateOne({_id:user._id} ,{$set:{refreshToken:refreshToken}})
        return {accessToken , refreshToken};
    } catch (error) {
        throw new ApiError(500,"server error: error while creating token ")
    }
}

const userRegister = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    if(!firstName || !lastName || !email || !phoneNumber || !password){
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

const loginUser = asyncHandler(async (req, res) =>{

    const {email,password} = req.body

    if (!password || !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({email})

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }
   const {accessToken, refreshToken} = await generateAccessTokenandRefreshToken(user)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const userLoggedOut = asyncHandler(async(req,res)=>{
    
    // await User.updateOne({id:user._id},{$set:{refreshToken:undefined}})
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: ""    // can be use 1 to unset 
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))

})
const refrehAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken;
    if(!incomingRefreshToken){
        throw new ApiError('401',"unauthorised member")
    } 
    const userId = jwt.verify(incomingRefreshToken ,process.env.REFRESH_TOKEN_SECRET)._id;
    const user = await User.findById(userId);
    if(!user){
        throw new ApiError('404',"invalid token")
    }
    if(user.refreshToken !== incomingRefreshToken){
        throw new ApiError(401,"invalid token")
    }
    const {accessToken , refreshToken} = await generateAccessTokenandRefreshToken(user);
    const options = {
        httpOnly:true,
        secure:true
    }
    res.status(200).cookie("accessToken" , accessToken , options).cookie("refreshToken" , refreshToken , options).json(
        new ApiResponse(200 , {accessToken , refreshToken}, "token refresh successfully")
    )

})


export {userRegister, loginUser, userLoggedOut}
