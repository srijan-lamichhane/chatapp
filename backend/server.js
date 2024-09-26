import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js'; 
import userRoutes from './routes/user.routes.js';

import connectToMongoDB from './db/connectToMongoDB.js';
import { app, server } from './socket/socket.js';

import path from 'path';

dotenv.config();

const __dirname = path.resolve();
// PORT should be assigned after calling dotenv.config() because we need to access the env variables.
const PORT = process.env.PORT || 5000;


// imp: express json middleware should be used before the routes definition.
app.use(express.json()); // to parse the incoming request with JSON payloads.
app.use(cookieParser());

app.use("/api/auth", authRoutes); // for signin, login, logout
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes); // for conversations

app.use(express.static(path.join(__dirname, 'frontend/dist'))); // serve the static files from the React app

// Catch-all route handler for frontend && Ensure that this catch-all route for the frontend is placed after your API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});


server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`server running on port ${PORT}`)
});



