import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: [],  // default value is an empty array
        },
    ],
}, { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;