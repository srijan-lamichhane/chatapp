import subscriber from "../db/connectDB";

subscriber.subscribe("new_message", (err) => {
  if (err) {
    console.error("Failed to subscribe to new_message channel:", err);
    return;
  }
  console.log("Subscribed to new_message channel");
});

// Listen for messages
subscriber.on("message", (channel, message) => {
  if (channel === "new_message") {
    const messageData = JSON.parse(message);
    const receiverSocketId = getReceiverSocketId(messageData.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageData);
    }
  }
});
