import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    scheduledAt: { type: Date, required: true },
    status: { type: String, enum: ["pending", "sent"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
