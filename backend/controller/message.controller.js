import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        //1. find the conversation between the sender and receiver
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        //2. if conversation doesn't exist, create a new conversation
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }
        //3. create new message
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });
        //4. push the new message to the conversation
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        //5. save the conversation to db
        // await conversation.save();
        // await newMessage.save();

        await Promise.all([conversation.save(), newMessage.save()]);

        //6. socket I/O function will go here
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage); // sending the new message to the specific receiver
        }

        res.status(201).json(newMessage);                          
    }
    catch (error) {
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
        }).populate("messages");  // Not Reference but acutal messages

        // if conversation doesn't exist, return empty array
        if (!conversation) {
            return res.status(200).json([]);
        }
        // if conversation exists, return the messages
        const messages = conversation.messages;
        res.status(200).json(messages);

    }
    catch (error) {
        console.log("Error in getMessage controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
}