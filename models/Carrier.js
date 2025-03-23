import mongoose from "mongoose";

const carrierSchema = new mongoose.Schema({
    company_name: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model("Carrier", carrierSchema);
