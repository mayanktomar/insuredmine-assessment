import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    account_name: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model("Account", accountSchema);
