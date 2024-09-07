import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
// putting the socket server on top of the express server.
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    }
});
// adding the object
const userSocketMap = {}; // {userId(key): socketId(value)}

// Listen for connection
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    const userId = socket.handshake.query.userId;
    if(userId != 'undefined') userSocketMap[userId] = socket.id;

    //io.emit() is used to send the event to all the clients connected to the server.
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
        

    // socket.on() is used to listen for the event from the client side.
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export {app, io, server};