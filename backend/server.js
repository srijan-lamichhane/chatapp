import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';

import connectToMongoDB from './db/connectToMongoDB.js';

const app = express();

dotenv.config();


const PORT = process.env.PORT || 8000;
// imp: express json middleware should be used before the routes definition.
app.use(express.json()); // to parse the incoming request with JSON payloads.

app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`server running on port ${PORT}`)
});

// app.get("/",(req, res) => {
//     res.send("Hello world!!");
// });

