import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try{
        const {message} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;
        //1. find the conversation between the sender and receiver
        let conversation = await  Conversation.findOne({
            participants: { $all: [senderId, receiverId]},
        });
        //2. if conversation doesn't exist, create a new conversation
        if(!conversation){
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
        if(newMessage){
            conversation.messages.push(newMessage);
        }

        res.status(201).json({newMessage});

        //5. save the conversation to db
        // await conversation.save();
        // await newMessage.save();

        await Promise.all([conversation.save(), newMessage.save()]);
    }
    catch(error){
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};
