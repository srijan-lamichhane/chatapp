import express from 'express';
const app = express();

import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.routes.js'

const PORT = process.env.PORT || 8000;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => 
console.log(`server running on port ${PORT}`));

app.get("/",(req, res) => {
    //root route localhost:8000/
    res.send("Hello world!!");
});