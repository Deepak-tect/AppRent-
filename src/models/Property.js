import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  area: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  amenities: [{ type: String }],
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  price: { type: Number, required: true },
  // status: { type: String, enum: ['available', 'sold', 'rented'], default: 'available' },
  availabilityDate: { type: Date }, // Assuming you want this field as a date
  },{timestamps:true});

export const Property = mongoose.model("Property", propertySchema);