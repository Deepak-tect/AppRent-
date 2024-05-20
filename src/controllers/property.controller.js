import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import {Property} from "../models/Property.js"


const createProperty = asyncHandler(async (req, res) => {
    const user = req.user;
    
    const {title, description, area, bedrooms, bathrooms, address, city, state, zipCode, price, availabilityDate, amenities } = req.body;
    if(!title || !area || !bedrooms || !bathrooms ||  !address || !city || !state || !zipCode || !price)
    {
        throw new ApiError(400, "All fields are required");
    }
    const property = await Property.create({
        user, title, description, area, bedrooms, bathrooms, address, city, state, zipCode, price, availabilityDate, amenities
    });

    res.status(201).json(new ApiResponse(201, property, "Property created successfully"));
});

const getPropertyById = asyncHandler(async (req, res) => {
    console.log("get-id")
    const {id} = req.query
    console.log(id)
    const property = await Property.findById(id);
    if (!property) {
        throw new ApiError(404, "Property not found");
    }
    res.status(200).json(new ApiResponse(200, property, "Property fetched successfully"));
});

const getPropertiesByUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    // console.log(userId)

    const properties = await Property.find({ user: userId });

    if (!properties || properties.length === 0) {
        throw new ApiError(201, "No properties found for this user");
    }

    res.status(200).json(new ApiResponse(200, properties, "Properties fetched successfully"));
});



const getProperties = asyncHandler(async (req, res) => {
    const properties = await Property.find();
    res.status(200).json(new ApiResponse(200, properties, "Properties fetched successfully"));
});

const updateProperty = asyncHandler(async (req, res) => {
    console.log("update")
    const { id } = req.query;
    console.log(id)
    const updates = req.body;

    const property = await Property.findByIdAndUpdate(id, updates, { new: true });
    if (!property) {
        throw new ApiError(404, "Property not found");
    }
    console.log(property);
    res.status(200).json(new ApiResponse(200, property, "Property updated successfully"));
});
const deleteProperty = asyncHandler(async (req, res) => {
    console.log("delete")
    const { id } = req.query;
    const property = await Property.findByIdAndDelete(id);
    if (!property) {
        throw new ApiError(404, "Property not found");
    }
    res.status(200).json(new ApiResponse(200, property, "Property deleted successfully"));
});


export {createProperty, getProperties , updateProperty, deleteProperty, getPropertyById , getPropertiesByUser}