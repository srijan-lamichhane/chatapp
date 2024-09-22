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
app.use(express.static(path.join(__dirname, 'frontend/dist'))); // serve the static files from the React app

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.use("/api/auth", authRoutes); // for signin, login, logout
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes); // for conversations


server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`server running on port ${PORT}`)
});



