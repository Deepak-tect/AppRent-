import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Interest} from "../models/Interest.js"
import { Property } from "../models/Property.js";
import { User } from "../models/User.js";
const expressInterest = asyncHandler(async (req, res) => {
    console.log("interest");
    const { id } = req.query;
    const buyerId = req.user;

    // Ensure id is provided in the request
    if (!id) {
        throw new ApiError(400, "PropertyId is required");
    }

    // Find the property by its ID
    const property = await Property.findById(id);
    if (!property) {
        throw new ApiError(404, "Property not found");
    }
    const owner = await User.findById(property.user)
    const sentOwner = {}

    const existingInterest = await Interest.findOne({ propertyId: property._id, buyerId });
    if (existingInterest) {
        throw new ApiError(400, "Interest already expressed in this property");
    }

    const interest = await Interest.create({ propertyId: property._id, buyerId });
    res.status(201).json(new ApiResponse(201, owner, "Interest expressed successfully"));
});


const getOwnerInterests = asyncHandler(async (req, res) => {
    const ownerId = req.user._id;

    // Find properties owned by the user
    const properties = await Property.find({ userId: ownerId });

    if (!properties.length) {
        throw new ApiError(404, "No properties found for this user");
    }

    // Get all interests for these properties
    const propertyIds = properties.map(property => property._id);
    const interests = await Interest.find({ propertyId: { $in: propertyIds } }).populate('propertyId').populate('buyerId');

    if (!interests.length) {
        throw new ApiError(404, "No interests found for this user's properties");
    }

    res.status(200).json(new ApiResponse(200, interests, "Interests fetched successfully"));
});

// Get all interests expressed by the user (buyer)
const getBuyerInterests = asyncHandler(async (req, res) => {
    const buyerId = req.user._id;

    // Find interests expressed by the user
    const interests = await Interest.find({ buyerId }).populate('propertyId').populate('buyerId');

    if (!interests.length) {
        throw new ApiError(404, "No interests found for this buyer");
    }

    res.status(200).json(new ApiResponse(200, interests, "Interests fetched successfully"));
});


export {expressInterest, getOwnerInterests , getBuyerInterests}