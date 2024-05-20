import mongoose from "mongoose";

const interestSchema = new mongoose.Schema({
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },{timestamps:true});
  
  export const Interest = mongoose.model('Interest', interestSchema);
  