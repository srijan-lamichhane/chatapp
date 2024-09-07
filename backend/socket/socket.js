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

})

// Listen for connection
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    // socket.on() is used to listen for the event from the client side.
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    })
})

export {app, io, server};