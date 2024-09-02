import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js'; 
import userRoutes from './routes/user.routes.js';

import connectToMongoDB from './db/connectToMongoDB.js';

const app = express();

dotenv.config();


const PORT = process.env.PORT || 5000;
// imp: express json middleware should be used before the routes definition.
app.use(express.json()); // to parse the incoming request with JSON payloads.
app.use(cookieParser());

app.use("/api/auth", authRoutes); // for signin, login, logout
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes); // for conversations


app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`server running on port ${PORT}`)
});



