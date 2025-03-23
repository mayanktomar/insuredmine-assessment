import mongoose from "mongoose";

const lobSchema = new mongoose.Schema({
    category_name: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model("LOB", lobSchema);
