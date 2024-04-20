import express from 'express';
const app = express();

import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.routes.js'
import { connect } from 'mongoose';
import connectToMongoDB from './db/connectToMongoDB.js';

const PORT = process.env.PORT || 8000;

app.use("/api/auth", authRoutes);

app.use(express.json()); // to parse the incoming request with JSON payloads.

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`server running on port ${PORT}`)
});

// app.get("/",(req, res) => {
//     res.send("Hello world!!");
// });

