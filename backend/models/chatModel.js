import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userMessages: {
    type: [String],
    required: true,
    default: [],
  },
  assistantMessages: {
    type: [String],
    required: true,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
