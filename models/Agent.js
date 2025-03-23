import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
    agent_name: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model("Agent", agentSchema);
