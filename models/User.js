import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    dob: { type: Date },
    address: { type: String },
    phone: { type: String },
    state: { type: String },
    zip: { type: String },
    email: { type: String, required: true, unique: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    user_type: { type: String }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
