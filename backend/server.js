const express = require('express');
const app = express();

const PORT = process.env.PORT || 8000;

app.listen(8000, () => 
console.log('server running on port 8000'));

app.get("/",(req, res) => {
    //root route localhost:8000/
    res.send("Hello world!!!!");
});