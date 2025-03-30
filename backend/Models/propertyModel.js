import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [3, "Title must be at least 3 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: [10, "Description must be at least 10 characters"],
  },
  contactName: {
    type: String,
    required: [true, "Contact name is required"],
    trim: true,
    match: [/^[A-Za-z\s]+$/, "Contact name must contain only letters"],
  },
  contactNumber: {
    type: String,
    required: [true, "Mobile number is required"],
    match: [/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"],
  },
  propertyType: {
    type: String,
    enum: ["rent", "selling"],
    required: [true, "Property type is required"],
  },
  district: {
    type: String,
    required: [true, "District is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending",
  },
  requestType: {
    type: String,
    enum: ["add", "update", "delete"],
    default: "add",
  },
  originalPropertyId: {
    type: mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
    ref: "Property",
=======
    ref: "Property"
>>>>>>> fa71c03728e8271397cfbd1994cb2c379e8d37e8
  },
  postedByAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    required: true,
  },
}, {
  timestamps: true,
});

<<<<<<< HEAD
// Prevent re-compilation of the model
export default mongoose.models.Property || mongoose.model("Property", propertySchema);
=======
const Property = mongoose.model("Property", propertySchema);
export default Property;
>>>>>>> fa71c03728e8271397cfbd1994cb2c379e8d37e8
