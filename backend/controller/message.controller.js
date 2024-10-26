import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import publisher from "../db/connectDB.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // 1. Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // 2. Create new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    // 3. Update conversation
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // 4. Save both conversation and message
    await Promise.all([conversation.save(), newMessage.save()]);

    // 5. Publish message to Redis
    const messageData = {
      _id: newMessage._id,
      senderId,
      receiverId,
      message,
      createdAt: newMessage.createdAt,
    };

    await publisher.publish("new_message", JSON.stringify(messageData));

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessage controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
