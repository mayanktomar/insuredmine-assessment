import mongoose from "mongoose";

const policySchema = new mongoose.Schema({
    policy_number: { type: String, required: true, unique: true },
    policy_start_date: { type: Date, required: true },
    policy_end_date: { type: Date, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "LOB", required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Carrier", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
    account: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true }
}, { timestamps: true });

export default mongoose.model("Policy", policySchema);
